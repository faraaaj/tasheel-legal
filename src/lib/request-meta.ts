// Server-only registration metadata capture: client IP, geolocation and a
// short-lived signed token that lets the just-registered browser post its
// device fingerprint without holding a Supabase session yet.
import { createHmac, timingSafeEqual } from "crypto";

export type GeoLookup = {
  country: string | null;
  countryCode: string | null;
  city: string | null;
  isp: string | null;
};

const PRIVATE_IP_RE =
  /^(::1|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|fc00:|fd00:|fe80:)/i;

export function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  const candidate =
    forwarded?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("cf-connecting-ip")?.trim() ||
    null;

  if (!candidate) return null;

  const ip = candidate.replace(/^::ffff:/, "");
  if (PRIVATE_IP_RE.test(ip)) return null;

  // Basic sanity check: reject anything that is clearly not an IP literal.
  if (!/^[0-9a-f:.]+$/i.test(ip)) return null;

  return ip;
}

export async function lookupGeo(ip: string): Promise<GeoLookup | null> {
  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Record<string, unknown>;
    if (data.error) return null;

    const str = (key: string): string | null => {
      const value = data[key];
      return typeof value === "string" && value ? value : null;
    };

    return {
      country: str("country_name"),
      countryCode: str("country_code")?.toUpperCase() ?? null,
      city: str("city"),
      isp: str("org"),
    };
  } catch {
    return null;
  }
}

const CAPTURE_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function sign(userId: string, timestamp: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHmac("sha256", secret)
    .update(`${userId}.${timestamp}`)
    .digest("hex");
}

export function createCaptureToken(userId: string): string {
  const timestamp = Date.now().toString();
  return `${timestamp}.${sign(userId, timestamp)}`;
}

export function verifyCaptureToken(
  userId: string,
  token: string | null | undefined,
): boolean {
  if (!token) return false;

  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;

  const age = Date.now() - issuedAt;
  if (age < 0 || age > CAPTURE_TOKEN_TTL_MS) return false;

  const expected = sign(userId, timestamp);

  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
