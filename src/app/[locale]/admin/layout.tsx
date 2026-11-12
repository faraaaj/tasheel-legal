"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Megaphone,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { adminFetch } from "@/lib/admin-client";
import {
  ADMIN_ROLES,
  canManageUsers,
  roleLabel,
  type AdminRole,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: AdminRole;
};

type AdminMeResponse = { user: AdminUser };

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const isAr = locale === "ar";
  const router = useRouter();
  const pathname = usePathname();

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">(
    "loading",
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace(`/${locale}/login`);
        return;
      }

      try {
        const data = await adminFetch<AdminMeResponse>("/api/admin/me");

        if (cancelled) return;

        if (
          !data?.user?.role ||
          !(ADMIN_ROLES as readonly string[]).includes(data.user.role)
        ) {
          setStatus("denied");
          router.replace(`/${locale}/login`);
          return;
        }

        setAdmin(data.user);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStatus("denied");
        router.replace(`/${locale}/login`);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [locale, router]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(`/${locale}/login`);
    router.refresh();
  };

  const base = `/${locale}/admin`;
  const navItems: NavItem[] = [
    {
      href: base,
      label: isAr ? "نظرة عامة" : "Dashboard",
      icon: LayoutDashboard,
    },
    ...(admin && canManageUsers(admin.role)
      ? [
          {
            href: `${base}/users`,
            label: isAr ? "المستخدمون" : "Users",
            icon: Users,
          },
        ]
      : []),
    {
      href: `${base}/packages`,
      label: isAr ? "الباقات" : "Packages",
      icon: Package,
    },
    {
      href: `${base}/ticker`,
      label: isAr ? "الشريط الإخباري" : "Ticker",
      icon: Megaphone,
      soon: true,
    },
    {
      href: `${base}/orders`,
      label: isAr ? "الطلبات" : "Orders",
      icon: ShoppingBag,
      soon: true,
    },
  ];

  if (status !== "ready" || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070D19] px-6">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-[#C5A880]" />
          <p className="mt-4 text-sm tracking-wide text-gray-300">
            {status === "denied"
              ? isAr
                ? "جارٍ تحويلك إلى صفحة الدخول..."
                : "Redirecting to sign in..."
              : isAr
                ? "جارٍ التحقق من صلاحيات الإدارة..."
                : "Verifying admin access..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D19] text-white">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#070D19] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#C5A880]" />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">
            {isAr ? "لوحة الإدارة" : "Admin Console"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          className="grid h-9 w-9 place-items-center border border-white/20 text-white"
          aria-label={isAr ? "القائمة" : "Menu"}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-white/10 bg-[#0A1120] transition-transform duration-300 lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0"
            : isAr
              ? "translate-x-full"
              : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <ShieldCheck className="h-7 w-7 shrink-0 text-[#C5A880]" />
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              {isAr ? "لوحة الإدارة" : "Admin Console"}
            </p>
            <p className="truncate text-[11px] text-gray-400">TASHEEL LEGAL</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === base
                ? pathname === base
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 border px-3 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  active
                    ? "border-[#C5A880]/60 bg-[#C5A880]/10 text-[#E4D3AE]"
                    : "border-transparent text-gray-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon size={17} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.soon && (
                  <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gray-400">
                    {isAr ? "قريباً" : "Soon"}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4">
          <p className="truncate text-sm text-white">
            {admin.fullName || admin.email || "—"}
          </p>
          <p className="truncate text-[11px] text-gray-400">
            {roleLabel(admin.role, locale)}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 border border-white/20 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-300 transition-colors hover:border-[#C5A880] hover:text-[#C5A880]"
          >
            <LogOut size={14} />
            {isAr ? "تسجيل الخروج" : "Log out"}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="lg:ps-64">
        <header className="hidden items-center justify-between border-b border-white/10 px-8 py-5 lg:flex">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
              {isAr ? "لوحة الإدارة" : "Admin Console"}
            </p>
            <h1 className="mt-1 font-serif-en text-xl text-white">
              {isAr ? "مرحباً" : "Welcome"}, {admin.fullName || admin.email}
            </h1>
          </div>
          <Link
            href={`/${locale}`}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-[#C5A880]"
          >
            {isAr ? "عرض الموقع" : "View site"}
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
