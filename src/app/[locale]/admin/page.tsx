"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Clock3,
  Package,
  ShoppingBag,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { roleLabel } from "@/lib/admin";

type Stats = {
  totalUsers: number;
  pendingApprovals: number;
  totalPackages: number;
  totalOrders: number;
};

type RecentUser = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
  isApproved: boolean;
  createdAt: string;
};

type StatsResponse = {
  stats: Stats;
  recentUsers: RecentUser[];
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

export default function AdminOverviewPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [data, setData] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    adminFetch<StatsResponse>("/api/admin/stats")
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : isAr
                ? "تعذر تحميل البيانات."
                : "Failed to load dashboard data.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAr]);

  const cards: {
    label: string;
    value: number | null;
    icon: LucideIcon;
    accent: string;
  }[] = [
    {
      label: isAr ? "إجمالي المستخدمين" : "Total Users",
      value: data?.stats.totalUsers ?? null,
      icon: Users,
      accent: "text-[#7DD3FC]",
    },
    {
      label: isAr ? "طلبات الموافقة المعلقة" : "Pending Approvals",
      value: data?.stats.pendingApprovals ?? null,
      icon: Clock3,
      accent: "text-[#FBBF24]",
    },
    {
      label: isAr ? "إجمالي الباقات" : "Total Packages",
      value: data?.stats.totalPackages ?? null,
      icon: Package,
      accent: "text-[#C5A880]",
    },
    {
      label: isAr ? "إجمالي الطلبات" : "Total Orders",
      value: data?.stats.totalOrders ?? null,
      icon: ShoppingBag,
      accent: "text-[#86EFAC]",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
            {isAr ? "نظرة عامة" : "Overview"}
          </p>
          <h2 className="mt-1 font-serif-en text-2xl text-white">
            {isAr ? "ملخص المنصة" : "Platform summary"}
          </h2>
        </div>
        <Link
          href={`/${locale}/admin/users`}
          className="inline-flex items-center gap-2 border border-[#C5A880]/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C5A880] transition-colors hover:bg-[#C5A880]/10"
        >
          {isAr ? "إدارة المستخدمين" : "Manage users"}
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {error && (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="border border-white/10 bg-[#0A1120] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  {card.label}
                </p>
                <Icon size={18} className={card.accent} />
              </div>
              <p className="mt-4 font-serif-en text-4xl text-white">
                {card.value === null ? "—" : card.value.toLocaleString(isAr ? "ar-SA" : "en-US")}
              </p>
            </motion.div>
          );
        })}
      </div>

      <section className="border border-white/10 bg-[#0A1120]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            {isAr ? "أحدث المستخدمين" : "Recent Users"}
          </h3>
          <span className="text-[10px] uppercase tracking-[0.16em] text-gray-500">
            {isAr ? "آخر 5 تسجيلات" : "Latest 5 registrations"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-start text-sm">
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
                  {isAr ? "الحالة" : "Status"}
                </th>
                <th className="px-5 py-3 text-start font-semibold">
                  {isAr ? "تاريخ التسجيل" : "Registered"}
                </th>
              </tr>
            </thead>
            <tbody>
              {!data && !error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "جارٍ التحميل..." : "Loading..."}
                  </td>
                </tr>
              )}

              {data && data.recentUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "لا يوجد مستخدمون بعد." : "No users yet."}
                  </td>
                </tr>
              )}

              {data?.recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-5 py-3.5 text-white">
                    {user.fullName || "—"}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
