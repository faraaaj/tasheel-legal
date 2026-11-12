// Client-side analytics tracking helper.
// Sends events to /api/analytics/track (best-effort, never blocks UI).

const SESSION_KEY = "tasheel_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function trackEvent(
  eventType: string,
  opts?: {
    packageId?: string;
    pagePath?: string;
    locale?: string;
    metadata?: Record<string, unknown>;
  },
): void {
  if (typeof window === "undefined") return;

  const payload = {
    eventType,
    packageId: opts?.packageId,
    sessionId: getSessionId(),
    pagePath: opts?.pagePath ?? window.location.pathname,
    locale: opts?.locale,
    deviceType: getDeviceType(),
    metadata: opts?.metadata,
  };

  // Fire and forget
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* silent */
  });
}
