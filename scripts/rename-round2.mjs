// Round 2 of English-title-only renames (5 explicit chat-given renames).
// Updates ONLY name_en, matched by the CURRENT name_en (post round-1
// rename). name_ar is never selected or written by this script.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
const sb = createClient(url, key);

const RENAME = {
  "Government Violation Resolution": "Government Violations Cases",
  "Technology Adoption Solution": "Problems Technology Cure",
  "Prepaid Legal Capacity": "Annual Legal Support 1",
  "Major Project Protection": "Major Projects Structuring",
  "Technology Market Entry Program": "Technology Localization Program",
};

async function main() {
  for (const [oldName, newName] of Object.entries(RENAME)) {
    const { data, error } = await sb
      .from("service_packages")
      .update({ name_en: newName })
      .eq("name_en", oldName)
      .select("id,name_en");
    if (error) { console.error("error renaming", oldName, error); continue; }
    if (!data || data.length === 0) {
      console.log(`NOT FOUND: "${oldName}" (already renamed, or round 1 not applied yet)`);
    } else {
      console.log(`renamed: "${oldName}" -> "${newName}"`);
    }
  }
}
main();
