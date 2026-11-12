// Server-only helper: profiles has no email column, so emails are joined
// from auth.users through the service-role admin API.
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getAuthEmailMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  try {
    let page = 1;
    // Supabase caps perPage at 1000; paginate until exhausted.
    for (;;) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

      if (error || !data?.users?.length) break;

      for (const user of data.users) {
        if (user.email) map.set(user.id, user.email);
      }

      if (data.users.length < 1000) break;
      page += 1;
    }
  } catch {
    // Degrade to an empty map: rows still render, email just shows as "—".
  }

  return map;
}
