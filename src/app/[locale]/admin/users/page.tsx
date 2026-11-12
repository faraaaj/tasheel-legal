"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check, RotateCcw, Search, ShieldAlert } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { roleLabel } from "@/lib/admin";

type AdminUser = {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  isApproved: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
};

type UsersResponse = {
  users: AdminUser[];
  viewerRole: string;
  canManage: boolean;
};

function formatDate(value: string, isAr: boolean): string {
  try {
    return new Intl.DateTimeFormat(isAr ? "ar-SA" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminUsersPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [data, setData] = useState<UsersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      const result = await adminFetch<UsersResponse>("/api/admin/users");
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? "تعذر تحميل المستخدمين."
            : "Failed to load users.",
      );
    }
  }, [isAr]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (userId: string, action: "approve" | "reject") => {
    setBusyId(userId);
    setError(null);
    try {
      await adminFetch("/api/admin/users/approve", {
        method: "POST",
        body: JSON.stringify({ userId, action }),
      });
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? "تعذر تحديث حالة المستخدم."
            : "Failed to update the user.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const users = useMemo(() => {
    if (!data) return [];
    const term = query.trim().toLowerCase();
    if (!term) return data.users;
    return data.users.filter((user) => {
      return (
        (user.fullName ?? "").toLowerCase().includes(term) ||
        (user.email ?? "").toLowerCase().includes(term) ||
        (user.phone ?? "").toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });
  }, [data, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
            {isAr ? "المستخدمون" : "Users"}
          </p>
          <h2 className="mt-1 font-serif-en text-2xl text-white">
            {isAr ? "إدارة الحسابات" : "Account management"}
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              isAr ? "بحث بالاسم أو البريد..." : "Search name or email..."
            }
            className="h-10 w-full border border-white/15 bg-[#0A1120] ps-9 pe-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-[#C5A880]"
          />
        </div>
      </div>

      {data && !data.canManage && (
        <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          <p>
            {isAr
              ? "عرض فقط: الموافقة على الحسابات متاحة للمدير العام والمدير فقط."
              : "Read-only: approving accounts is restricted to Super Admin and Admin roles."}
          </p>
        </div>
      )}

      {error && (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="border border-white/10 bg-[#0A1120]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-start text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.14em] text-gray-500">
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "الاسم" : "Name"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "الدور" : "Role"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "حالة الموافقة" : "Approval Status"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "تاريخ التسجيل" : "Registration Date"}
                </th>
                {data?.canManage && (
                  <th className="px-5 py-3 text-end font-semibold">
                    {isAr ? "إجراء" : "Action"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {!data && !error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "جارٍ التحميل..." : "Loading..."}
                  </td>
                </tr>
              )}

              {data && users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "لا يوجد مستخدمون مطابقون." : "No matching users."}
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-white">{user.fullName || "—"}</p>
                    {user.phone && (
                      <p className="text-[11px] text-gray-500" dir="ltr">
                        {user.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-300" dir="ltr">
                    {user.email || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-300">
                    {roleLabel(user.role, locale)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        user.isApproved
                          ? "inline-flex border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300"
                          : "inline-flex border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300"
                      }
                    >
                      {user.isApproved
                        ? isAr
                          ? "معتمد"
                          : "Approved"
                        : isAr
                          ? "معلق"
                          : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {formatDate(user.createdAt, isAr)}
                  </td>
                  {data?.canManage && (
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        {user.isApproved ? (
                          <button
                            type="button"
                            onClick={() => act(user.id, "reject")}
                            disabled={busyId === user.id}
                            className="inline-flex items-center gap-1.5 border border-red-500/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <RotateCcw size={12} />
                            {isAr ? "إلغاء الاعتماد" : "Revoke"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => act(user.id, "approve")}
                            disabled={busyId === user.id}
                            className="inline-flex items-center gap-1.5 border border-emerald-500/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 transition-colors hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check size={12} />
                            {isAr ? "اعتماد" : "Approve"}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
