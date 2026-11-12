"use client";

import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileText,
  RotateCcw,
  Search,
  ShieldAlert,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { roleLabel } from "@/lib/admin";
import {
  getSiteUrl,
  isOpenStatus,
  statusTone,
  verificationStatusLabel,
  type VerificationStatus,
} from "@/lib/verification";

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

  registrationIp: string | null;
  registrationCountry: string | null;
  registrationCountryCode: string | null;
  registrationCity: string | null;
  registrationIsp: string | null;
  referrer: string | null;
  deviceFingerprint: Record<string, unknown> | null;

  verificationStatus: VerificationStatus;
  problemStatement: string | null;
  statementSubmittedAt: string | null;
  verificationToken: string | null;
  tokenExpiresAt: string | null;
  rejectionReason: string | null;

  aiResearchScore: number | null;
  aiResearchSummary: string | null;
  aiResearchedAt: string | null;
  linkedinUrl: string | null;
};

type UsersResponse = {
  users: AdminUser[];
  viewerRole: string;
  canManage: boolean;
};

type Filter = "all" | "open" | "statements";

type Notice = {
  kind: "info" | "error";
  text: string;
  url?: string;
};

const TONE_CLASSES: Record<string, string> = {
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  red: "border-red-500/40 bg-red-500/10 text-red-300",
  blue: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
};

const BUTTON_TONES: Record<string, string> = {
  emerald: "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10",
  red: "border-red-500/40 text-red-300 hover:bg-red-500/10",
  amber: "border-amber-500/40 text-amber-300 hover:bg-amber-500/10",
  sky: "border-sky-500/40 text-sky-300 hover:bg-sky-500/10",
  violet: "border-violet-500/40 text-violet-300 hover:bg-violet-500/10",
  slate: "border-white/20 text-gray-300 hover:bg-white/5",
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

function formatDateTime(value: string, isAr: boolean): string {
  try {
    return new Intl.DateTimeFormat(isAr ? "ar-SA" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function statementUrlFor(user: AdminUser, locale: "en" | "ar"): string | null {
  if (!user.verificationToken) return null;
  const origin =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();
  return `${origin}/${locale}/verify/${user.verificationToken}`;
}

function deviceSummary(user: AdminUser): string | null {
  const device = user.deviceFingerprint;
  if (!device) return null;
  const timezone =
    typeof device.timezone === "string" ? device.timezone : null;
  const screen = typeof device.screen === "string" ? device.screen : null;
  const bot = device.webdriver === true;
  const parts = [timezone, screen].filter(Boolean);
  if (bot) parts.push("AUTOMATION");
  return parts.length > 0 ? parts.join(" · ") : "captured";
}

function ActionButton({
  onClick,
  disabled,
  tone,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  tone: keyof typeof BUTTON_TONES;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 border px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${BUTTON_TONES[tone]}`}
    >
      <Icon size={11} />
      {children}
    </button>
  );
}

export default function AdminUsersPage() {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const [data, setData] = useState<UsersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const act = async (
    userId: string,
    action: "approve" | "reject" | "revoke" | "statement" | "ai" | "linkedin",
  ) => {
    setBusy(`${userId}:${action}`);
    setError(null);
    setNotice(null);

    try {
      if (action === "linkedin") {
        const result = await adminFetch<{ url: string }>(
          "/api/admin/users/linkedin-research",
          { method: "POST", body: JSON.stringify({ userId }) },
        );
        window.open(result.url, "_blank", "noopener,noreferrer");
      } else if (action === "statement") {
        const result = await adminFetch<{
          statementUrl: string;
          email: { sent: boolean; skipped?: boolean; error?: string } | null;
        }>("/api/admin/users/request-statement", {
          method: "POST",
          body: JSON.stringify({ userId, locale }),
        });

        setNotice({
          kind: "info",
          text: result.email?.sent
            ? isAr
              ? "تم إرسال رابط بيان المشكلة بالبريد."
              : "Problem-statement link emailed."
            : isAr
              ? "تم إنشاء الرابط. لم يتم إرسال البريد (لم تتم تهيئة مزود البريد) — انسخ الرابط أدناه."
              : "Link created. Email was not sent (no email provider configured) — copy the link below.",
          url: result.statementUrl,
        });
        await load();
      } else if (action === "ai") {
        const result = await adminFetch<{ score: number; summary: string }>(
          "/api/admin/users/ai-research",
          { method: "POST", body: JSON.stringify({ userId }) },
        );
        setNotice({
          kind: "info",
          text: isAr
            ? `نتيجة البحث الآلي: ${result.score}/100 (محاكاة).`
            : `AI research score: ${result.score}/100 (simulated).`,
        });
        await load();
      } else {
        const result = await adminFetch<{
          email: { sent: boolean; skipped?: boolean } | null;
        }>("/api/admin/users/approve", {
          method: "POST",
          body: JSON.stringify({ userId, action }),
        });

        const base =
          action === "approve"
            ? isAr
              ? "تم اعتماد المستخدم."
              : "User approved."
            : isAr
              ? "تم رفض المستخدم."
              : "User rejected.";

        setNotice({
          kind: "info",
          text:
            result.email && !result.email.sent && !result.email.skipped
              ? `${base} ${isAr ? "تعذر إرسال البريد." : "Email could not be sent."}`
              : base,
        });
        await load();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? "تعذر تنفيذ الإجراء."
            : "The action could not be completed.",
      );
    } finally {
      setBusy(null);
    }
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice({
        kind: "info",
        text: isAr ? "تم نسخ الرابط." : "Link copied.",
        url: value,
      });
    } catch {
      setError(
        isAr ? "تعذر نسخ الرابط." : "Could not copy the link. Select it manually.",
      );
    }
  };

  const users = useMemo(() => {
    if (!data) return [];

    let list = data.users;

    if (filter === "open") {
      list = list.filter((user) => isOpenStatus(user.verificationStatus));
    } else if (filter === "statements") {
      list = list.filter(
        (user) => user.verificationStatus === "statement_received",
      );
    }

    const term = query.trim().toLowerCase();
    if (!term) return list;

    return list.filter((user) => {
      return (
        (user.fullName ?? "").toLowerCase().includes(term) ||
        (user.email ?? "").toLowerCase().includes(term) ||
        (user.phone ?? "").toLowerCase().includes(term) ||
        (user.registrationCountry ?? "").toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });
  }, [data, query, filter]);

  const columnCount = data?.canManage ? 9 : 8;
  const openCount =
    data?.users.filter((user) => isOpenStatus(user.verificationStatus)).length ??
    0;
  const statementCount =
    data?.users.filter(
      (user) => user.verificationStatus === "statement_received",
    ).length ?? 0;

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: "all", label: isAr ? "الكل" : "All", count: data?.users.length },
    { key: "open", label: isAr ? "معلقة" : "Pending", count: openCount },
    {
      key: "statements",
      label: isAr ? "بيانات مستلمة" : "Statements",
      count: statementCount,
    },
  ];

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

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-1.5">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  filter === item.key
                    ? "border-[#C5A880]/60 bg-[#C5A880]/10 text-[#E4D3AE]"
                    : "border-white/15 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {item.label}
                {typeof item.count === "number" && (
                  <span className="ms-1.5 text-gray-500">{item.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
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
      </div>

      {data && !data.canManage && (
        <div className="flex items-start gap-3 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          <p>
            {isAr
              ? "عرض فقط: إدارة الحسابات متاحة للمدير العام والمدير فقط."
              : "Read-only: account actions are restricted to Super Admin and Admin roles."}
          </p>
        </div>
      )}

      {error && (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {notice && (
        <div className="border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          <p>{notice.text}</p>
          {notice.url && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code
                className="max-w-full break-all text-[11px] text-[#C5A880]"
                dir="ltr"
              >
                {notice.url}
              </code>
              <button
                type="button"
                onClick={() => copy(notice.url as string)}
                className="inline-flex items-center gap-1 border border-[#C5A880]/50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#C5A880] hover:bg-[#C5A880]/10"
              >
                <Copy size={11} />
                {isAr ? "نسخ" : "Copy"}
              </button>
            </div>
          )}
        </div>
      )}

      <section className="border border-white/10 bg-[#0A1120]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px] text-start text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.14em] text-gray-500">
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "الاسم" : "Name"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "الدور" : "Role"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "الحالة" : "Status"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "IP / الدولة" : "IP / Country"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "الجهاز" : "Device"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "نتيجة AI" : "AI Score"}
                </th>
                <th className="px-4 py-3 text-start font-semibold">
                  {isAr ? "تاريخ التسجيل" : "Registered"}
                </th>
                {data?.canManage && (
                  <th className="px-4 py-3 text-end font-semibold">
                    {isAr ? "إجراء" : "Actions"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {!data && !error && (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "جارٍ التحميل..." : "Loading..."}
                  </td>
                </tr>
              )}

              {data && users.length === 0 && (
                <tr>
                  <td
                    colSpan={columnCount}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {isAr ? "لا يوجد مستخدمون مطابقون." : "No matching users."}
                  </td>
                </tr>
              )}

              {users.map((user) => {
                const tone = statusTone(user.verificationStatus);
                const device = deviceSummary(user);
                const isExpanded = expanded === user.id;
                const statementUrl = statementUrlFor(user, locale);

                return (
                  <Fragment key={user.id}>
                    <tr
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-white">{user.fullName || "—"}</p>
                        {user.phone && (
                          <p className="text-[11px] text-gray-500" dir="ltr">
                            {user.phone}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-600">
                          {user.emailVerified ? "email ✓" : "email ✗"}{" "}
                          {user.phoneVerified ? "phone ✓" : "phone ✗"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300" dir="ltr">
                        {user.email || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        {roleLabel(user.role, locale)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${TONE_CLASSES[tone]}`}
                        >
                          {verificationStatusLabel(
                            user.verificationStatus,
                            locale,
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        <p>
                          {user.registrationCountryCode
                            ? `${user.registrationCountryCode} · `
                            : ""}
                          {user.registrationCity ||
                            user.registrationCountry ||
                            "—"}
                        </p>
                        <p className="text-[10px] text-gray-500" dir="ltr">
                          {user.registrationIp || "no IP"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        <p className="text-[11px]">{device ?? "—"}</p>
                        {user.deviceFingerprint?.webdriver === true && (
                          <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">
                            automation
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {user.aiResearchScore === null ? (
                          <span className="text-gray-500">—</span>
                        ) : (
                          <span
                            className={`inline-flex border px-2 py-1 text-[10px] font-bold ${
                              user.aiResearchScore >= 80
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                : user.aiResearchScore >= 50
                                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                                  : "border-red-500/40 bg-red-500/10 text-red-300"
                            }`}
                            title={user.aiResearchSummary ?? undefined}
                          >
                            {user.aiResearchScore}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400">
                        {formatDate(user.createdAt, isAr)}
                      </td>
                      {data?.canManage && (
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {!user.isApproved && (
                              <ActionButton
                                onClick={() => act(user.id, "approve")}
                                disabled={busy === `${user.id}:approve`}
                                tone="emerald"
                                icon={Check}
                              >
                                {isAr ? "اعتماد" : "Approve"}
                              </ActionButton>
                            )}

                            {user.isApproved ? (
                              <ActionButton
                                onClick={() => act(user.id, "revoke")}
                                disabled={busy === `${user.id}:revoke`}
                                tone="red"
                                icon={RotateCcw}
                              >
                                {isAr ? "إلغاء" : "Revoke"}
                              </ActionButton>
                            ) : (
                              <ActionButton
                                onClick={() => act(user.id, "reject")}
                                disabled={busy === `${user.id}:reject`}
                                tone="red"
                                icon={XCircle}
                              >
                                {isAr ? "رفض" : "Reject"}
                              </ActionButton>
                            )}

                            {!user.isApproved && (
                              <ActionButton
                                onClick={() => act(user.id, "statement")}
                                disabled={busy === `${user.id}:statement`}
                                tone="amber"
                                icon={FileText}
                              >
                                {isAr ? "طلب بيان" : "Request Statement"}
                              </ActionButton>
                            )}

                            <ActionButton
                              onClick={() => act(user.id, "ai")}
                              disabled={busy === `${user.id}:ai`}
                              tone="sky"
                              icon={Bot}
                            >
                              {isAr ? "بحث AI" : "AI Research"}
                            </ActionButton>

                            <ActionButton
                              onClick={() => act(user.id, "linkedin")}
                              disabled={busy === `${user.id}:linkedin`}
                              tone="violet"
                              icon={ExternalLink}
                            >
                              {isAr ? "لينكدإن" : "LinkedIn"}
                            </ActionButton>

                            <ActionButton
                              onClick={() =>
                                setExpanded(isExpanded ? null : user.id)
                              }
                              tone="slate"
                              icon={isExpanded ? ChevronUp : ChevronDown}
                            >
                              {isAr ? "تفاصيل" : "Details"}
                            </ActionButton>
                          </div>
                        </td>
                      )}
                    </tr>

                    {isExpanded && (
                      <tr
                        key={`${user.id}-details`}
                        className="border-b border-white/10 bg-[#070D19]/60"
                      >
                        <td colSpan={columnCount} className="px-5 py-5">
                          <div className="grid gap-5 text-[12px] text-gray-300 lg:grid-cols-3">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C5A880]">
                                {isAr ? "بيانات التسجيل" : "Registration data"}
                              </p>
                              <p>
                                <span className="text-gray-500">IP: </span>
                                <span dir="ltr">
                                  {user.registrationIp || "—"}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-500">
                                  {isAr ? "الدولة: " : "Country: "}
                                </span>
                                {user.registrationCountry || "—"}
                                {user.registrationCountryCode
                                  ? ` (${user.registrationCountryCode})`
                                  : ""}
                              </p>
                              <p>
                                <span className="text-gray-500">
                                  {isAr ? "المدينة: " : "City: "}
                                </span>
                                {user.registrationCity || "—"}
                              </p>
                              <p>
                                <span className="text-gray-500">ISP: </span>
                                {user.registrationIsp || "—"}
                              </p>
                              <p className="break-all">
                                <span className="text-gray-500">
                                  {isAr ? "المصدر: " : "Referrer: "}
                                </span>
                                {user.referrer || "—"}
                              </p>
                              <p>
                                <span className="text-gray-500">
                                  {isAr ? "تاريخ التسجيل: " : "Registered: "}
                                </span>
                                {formatDateTime(user.createdAt, isAr)}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C5A880]">
                                {isAr ? "بصمة الجهاز" : "Device fingerprint"}
                              </p>
                              <pre
                                className="max-h-44 overflow-auto whitespace-pre-wrap break-all border border-white/10 bg-[#0A1120] p-3 text-[10px] leading-relaxed text-gray-400"
                                dir="ltr"
                              >
                                {user.deviceFingerprint
                                  ? JSON.stringify(
                                      user.deviceFingerprint,
                                      null,
                                      2,
                                    )
                                  : "—"}
                              </pre>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C5A880]">
                                {isAr ? "المراجعة" : "Review"}
                              </p>
                              <p>
                                <span className="text-gray-500">
                                  {isAr ? "الحالة: " : "Status: "}
                                </span>
                                {verificationStatusLabel(
                                  user.verificationStatus,
                                  locale,
                                )}
                              </p>
                              {user.rejectionReason && (
                                <p>
                                  <span className="text-gray-500">
                                    {isAr ? "سبب الرفض: " : "Rejection: "}
                                  </span>
                                  {user.rejectionReason}
                                </p>
                              )}
                              <p>
                                <span className="text-gray-500">
                                  {isAr ? "بيان المشكلة: " : "Statement: "}
                                </span>
                                {user.problemStatement
                                  ? `${user.problemStatement.length} ${isAr ? "حرف" : "chars"}`
                                  : "—"}
                              </p>
                              {user.problemStatement && (
                                <p className="max-h-28 overflow-auto whitespace-pre-wrap border border-white/10 bg-[#0A1120] p-3 text-[11px] leading-relaxed">
                                  {user.problemStatement}
                                </p>
                              )}
                              {user.aiResearchSummary && (
                                <p className="whitespace-pre-wrap text-[11px] text-gray-400">
                                  <span className="text-gray-500">
                                    AI:{" "}
                                  </span>
                                  {user.aiResearchSummary}
                                </p>
                              )}
                              {user.linkedinUrl && (
                                <a
                                  href={user.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#C5A880] hover:text-gold"
                                >
                                  <ExternalLink size={11} />
                                  LinkedIn
                                </a>
                              )}
                              {statementUrl && (
                                <div className="space-y-1">
                                  <p className="text-gray-500">
                                    {isAr
                                      ? "رابط بيان المشكلة:"
                                      : "Statement link:"}
                                  </p>
                                  <code
                                    className="block break-all text-[10px] text-[#C5A880]"
                                    dir="ltr"
                                  >
                                    {statementUrl}
                                  </code>
                                  <p className="text-[10px] text-gray-500">
                                    {user.tokenExpiresAt
                                      ? `${isAr ? "ينتهي: " : "Expires: "}${formatDateTime(user.tokenExpiresAt, isAr)}`
                                      : ""}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => copy(statementUrl)}
                                    className="inline-flex items-center gap-1 border border-[#C5A880]/50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#C5A880] hover:bg-[#C5A880]/10"
                                  >
                                    <Copy size={11} />
                                    {isAr ? "نسخ الرابط" : "Copy link"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
