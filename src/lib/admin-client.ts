// Client-side helper for calling the protected /api/admin/* routes with the
// current Supabase session's bearer token.
import { supabase } from "@/lib/supabase";

export class AdminFetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminFetchError";
    this.status = status;
  }
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new AdminFetchError("NOT_AUTHENTICATED", 401);
  }

  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new AdminFetchError(
      body?.error ?? `Request failed (${res.status})`,
      res.status,
    );
  }

  return (await res.json()) as T;
}
