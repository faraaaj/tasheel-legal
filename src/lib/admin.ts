// Shared admin role definitions. Safe to import from both client components
// and server route handlers (no secrets, no Supabase clients here).

export const ADMIN_ROLES = [
  "superadmin",
  "admin",
  "marketing_admin",
  "support_admin",
  "freelancer_admin",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

// Only these two roles may approve / revoke client accounts.
export const USER_MANAGEMENT_ROLES = ["superadmin", "admin"] as const;

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}

export function canManageUsers(role: string | null | undefined): boolean {
  return !!role && (USER_MANAGEMENT_ROLES as readonly string[]).includes(role);
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return role === "superadmin";
}

export const SUPERADMIN_PROTECTED_MESSAGE =
  "The SuperAdmin account cannot be modified.";

export const ROLE_LABELS: Record<string, { en: string; ar: string }> = {
  client: { en: "Client", ar: "عميل" },
  superadmin: { en: "Super Admin", ar: "مدير عام" },
  admin: { en: "Admin", ar: "مدير" },
  marketing_admin: { en: "Marketing Admin", ar: "مدير تسويق" },
  support_admin: { en: "Support Admin", ar: "مدير دعم" },
  freelancer_admin: { en: "Freelancer Admin", ar: "مدير مستقل" },
};

export function roleLabel(
  role: string | null | undefined,
  locale: "en" | "ar",
): string {
  if (!role) return locale === "ar" ? "غير محدد" : "Unassigned";
  return ROLE_LABELS[role]?.[locale] ?? role;
}
