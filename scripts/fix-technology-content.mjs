// One-off correction: fixes the Arabic popup content for the
// "Problems Technology Cure" package only. The Arabic source for this
// one package has a different structure than the others (numbered
// sub-headed diagnostic stages instead of simple bullet lists), which
// broke the original parser: description_ar ended up 1300+ characters
// (a full dump of the diagnostic-stage breakdown instead of a short
// card summary), outcomes_ar and details_ar ended up empty, and
// requirements_ar got contaminated with stray non-requirement lines,
// including an internal note never meant for customers.
//
// Updates ONLY description_ar, outcomes_ar, requirements_ar, details_ar
// for this one row. Does NOT touch name_en, name_ar, price_sar, or any
// English field (those were already correct).
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
const sb = createClient(url, key);

const fix = JSON.parse(fs.readFileSync(new URL("./fix_technology_ar.json", import.meta.url)))[
  "Problems Technology Cure"
];

async function main() {
  const nameEn = "Problems Technology Cure";
  const { data: existing, error: selErr } = await sb
    .from("service_packages")
    .select("id,name_en,description_ar")
    .eq("name_en", nameEn)
    .maybeSingle();
  if (selErr) {
    console.error("select error:", selErr);
    process.exit(1);
  }
  if (!existing) {
    console.error(`NOT FOUND: no row with name_en = "${nameEn}". Nothing changed.`);
    process.exit(1);
  }

  console.log("Before fix, description_ar length was:", (existing.description_ar || "").length);

  const { error } = await sb
    .from("service_packages")
    .update({
      description_ar: fix.description_ar,
      outcomes_ar: fix.outcomes_ar,
      requirements_ar: fix.requirements_ar,
      details_ar: fix.details_ar,
    })
    .eq("id", existing.id);

  if (error) {
    console.error("update error:", error);
    process.exit(1);
  }

  console.log("Fixed. New description_ar length:", fix.description_ar.length);
  console.log("outcomes_ar items:", fix.outcomes_ar.length);
  console.log("requirements_ar items:", fix.requirements_ar.length);
  console.log("details_ar length:", fix.details_ar.length);
}

main();
