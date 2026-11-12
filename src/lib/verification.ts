// Shared verification-workflow definitions. Safe to import from both client
// components and server route handlers (no secrets, no Supabase clients here).

export const VERIFICATION_STATUSES = [
  "pending",
  "statement_requested",
  "statement_received",
  "approved",
  "rejected",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const VERIFICATION_STATUS_LABELS: Record<
  VerificationStatus,
  { en: string; ar: string }
> = {
  pending: { en: "Pending", ar: "معلق" },
  statement_requested: {
    en: "Statement requested",
    ar: "طُلب بيان المشكلة",
  },
  statement_received: {
    en: "Statement received",
    ar: "تم استلام البيان",
  },
  approved: { en: "Approved", ar: "معتمد" },
  rejected: { en: "Rejected", ar: "مرفوض" },
};

export function isVerificationStatus(
  value: string | null | undefined,
): value is VerificationStatus {
  return !!value && (VERIFICATION_STATUSES as readonly string[]).includes(value);
}

export function verificationStatusLabel(
  status: VerificationStatus,
  locale: "en" | "ar",
): string {
  return VERIFICATION_STATUS_LABELS[status][locale];
}

// Statuses that still need an admin decision. Rejected/approved are final.
export function isOpenStatus(status: VerificationStatus): boolean {
  return (
    status === "pending" ||
    status === "statement_requested" ||
    status === "statement_received"
  );
}

// Countries whose registrations are treated as higher risk and must complete
// phone (SMS/WhatsApp) verification before submitting a problem statement.
// ISO 3166-1 alpha-2 codes: United States, Canada, United Kingdom, EU/EEA,
// Russia, Belarus, Ukraine, Switzerland.
export const HIGH_RISK_COUNTRY_CODES: ReadonlySet<string> = new Set([
  "US",
  "CA",
  "GB",
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "RU",
  "BY",
  "UA",
  "CH",
  "MD",
  "RS",
]);

export function isHighRiskCountry(
  countryCode: string | null | undefined,
): boolean {
  return !!countryCode && HIGH_RISK_COUNTRY_CODES.has(countryCode.toUpperCase());
}

export type VerificationProfileFields = {
  is_approved?: boolean | null;
  verification_status?: string | null;
  problem_statement?: string | null;
  verification_token?: string | null;
  token_expires_at?: string | null;
};

export function deriveVerificationStatus(
  row: VerificationProfileFields,
): VerificationStatus {
  if (isVerificationStatus(row.verification_status)) {
    return row.verification_status;
  }
  if (row.is_approved) return "approved";
  if (row.problem_statement) return "statement_received";
  if (
    row.verification_token &&
    row.token_expires_at &&
    new Date(row.token_expires_at).getTime() > Date.now()
  ) {
    return "statement_requested";
  }
  return "pending";
}

export function statusTone(
  status: VerificationStatus,
): "green" | "amber" | "red" | "blue" | "violet" {
  switch (status) {
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "statement_requested":
      return "blue";
    case "statement_received":
      return "violet";
    default:
      return "amber";
  }
}

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://tasheel.law"
  );
}
