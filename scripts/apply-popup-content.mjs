// Applies long-form, user-authored bilingual popup content to existing
// packages. Matches rows by their CURRENT name_en (already renamed in
// earlier rounds). Updates ONLY: description_en/ar, outcomes_en/ar,
// requirements_en/ar, details_en/ar. Never touches name_en or name_ar,
// price_sar, validity_days, max_seats, or active.
//
// Run AFTER migration_requirements.sql has been applied (adds
// requirements_en/ar columns) and AFTER any landing-page title renames.
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
const sb = createClient(url, key);

const content = JSON.parse(fs.readFileSync(new URL("./popup_content_v1.json", import.meta.url)));

async function main() {
  let ok = 0, missing = [];
  for (const [nameEn, c] of Object.entries(content)) {
    const { data: existing, error: selErr } = await sb
      .from("service_packages")
      .select("id,name_en")
      .eq("name_en", nameEn)
      .maybeSingle();
    if (selErr) { console.error("select error for", nameEn, selErr); continue; }
    if (!existing) { missing.push(nameEn); continue; }

    const { error } = await sb
      .from("service_packages")
      .update({
        description_en: c.description_en,
        description_ar: c.description_ar,
        outcomes_en: c.outcomes_en,
        outcomes_ar: c.outcomes_ar,
        requirements_en: c.requirements_en,
        requirements_ar: c.requirements_ar,
        details_en: c.details_en,
        details_ar: c.details_ar,
      })
      .eq("id", existing.id);
    if (error) { console.error("update error for", nameEn, error); continue; }
    ok++;
  }
  console.log(`Updated ${ok}/${Object.keys(content).length} packages.`);
  if (missing.length) {
    console.log("NOT FOUND (name_en did not match any row - check renames applied first):");
    missing.forEach((m) => console.log(" -", m));
  }
}

main();
