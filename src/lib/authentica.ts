// Thin server-side client for Authentica.sa's OTP API.
// NEVER import this from a client component — it reads AUTHENTICA_API_KEY,
// a server-only secret. Always call it from a Next.js API route (app/api/*).
//
// Docs reference: https://api.authentica.sa/api/v2
//   POST /send-otp   { phone? , email?, method: "sms" | "whatsapp" | "email", template_id? }
//   POST /verify-otp { phone? , email?, otp: string }

const AUTHENTICA_BASE_URL = "https://api.authentica.sa/api/v2";

function getApiKey(): string {
  const key = process.env.AUTHENTICA_API_KEY;
  if (!key) {
    throw new Error("Missing AUTHENTICA_API_KEY env var.");
  }
  return key;
}

export type OtpMethod = "sms" | "whatsapp" | "email";

export interface SendOtpParams {
  phone?: string;
  email?: string;
  method: OtpMethod;
  templateId?: number;
}

export interface SendOtpResult {
  success: boolean;
  error?: string;
  raw?: unknown;
}

export async function sendOtp(params: SendOtpParams): Promise<SendOtpResult> {
  if (!params.phone && !params.email) {
    return { success: false, error: "Either phone or email is required." };
  }

  try {
    const res = await fetch(`${AUTHENTICA_BASE_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": getApiKey(),
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...(params.phone ? { phone: params.phone } : {}),
        ...(params.email ? { email: params.email } : {}),
        method: params.method,
        template_id: params.templateId ?? 1,
      }),
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        error: (raw && (raw.message || raw.error)) || `Authentica send-otp failed (${res.status})`,
        raw,
      };
    }

    return { success: true, raw };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export interface VerifyOtpParams {
  phone?: string;
  email?: string;
  otp: string;
}

export interface VerifyOtpResult {
  verified: boolean;
  error?: string;
  raw?: unknown;
}

export async function verifyOtp(params: VerifyOtpParams): Promise<VerifyOtpResult> {
  if (!params.phone && !params.email) {
    return { verified: false, error: "Either phone or email is required." };
  }

  try {
    const res = await fetch(`${AUTHENTICA_BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": getApiKey(),
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...(params.phone ? { phone: params.phone } : {}),
        ...(params.email ? { email: params.email } : {}),
        otp: params.otp,
      }),
    });

    const raw = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        verified: false,
        error: (raw && (raw.message || raw.error)) || `Authentica verify-otp failed (${res.status})`,
        raw,
      };
    }

    return { verified: true, raw };
  } catch (err) {
    return { verified: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
