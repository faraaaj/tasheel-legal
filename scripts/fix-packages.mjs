// Fixes the service_packages table after a partial/duplicate seed:
// 1. Removes the 3 rows that duplicate the hardcoded premium cards (different prices than page.tsx).
// 2. Adds the 4 missing tier packages (2nd annual tier, external general counsel, 2 prepaid-hour blocks).
// 3. Adds the 30 hidden (active:false) granular packages, skipping any that already exist by name.
//
// Safe to re-run: every insert is skip-if-exists by name_en, and the delete only targets the
// 3 exact known duplicate names.
//
// Run from the project root:
//   node scripts/fix-packages.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvLocal(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const env = { ...loadEnvLocal(join(__dirname, "..", ".env.local")), ...process.env };
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const DUPLICATE_NAMES_EN = [
  "The Annual Legal Partnership",
  "Government Violation & Penalty Resolution",
  "The Technology Adoption Solution",
];

const MISSING_PUBLIC = [
  {"name_en":"Business Legal Partner","name_ar":"الباقة القانونية السنوية 2","description_en":"Extended annual legal coverage for active SMEs with regular contracts, staff matters and commercial disputes.","description_ar":"تغطية قانونية سنوية موسعة للمنشآت النشطة ذات العقود والمسائل العمالية والمنازعات التجارية المنتظمة.","price_sar":120000,"validity_days":365,"max_seats":1,"active":true},
  {"name_en":"External General Counsel","name_ar":"المستشار القانوني العام الخارجي","description_en":"Continuing legal input to management decisions, with quarterly legal-risk and contract-obligation review.","description_ar":"إدخال قانوني مستمر لقرارات الإدارة مع مراجعة ربع سنوية للمخاطر القانونية والالتزامات التعاقدية.","price_sar":240000,"validity_days":365,"max_seats":1,"active":true},
  {"name_en":"Prepaid Legal Capacity (25 Hours)","name_ar":"السعة القانونية المدفوعة مقدما (25 ساعة)","description_en":"25 prepaid professional legal hours, 6-month validity.","description_ar":"25 ساعة مهنية قانونية مدفوعة مقدما، صلاحية 6 أشهر.","price_sar":35000,"validity_days":180,"max_seats":1,"active":true},
  {"name_en":"Prepaid Legal Capacity (200 Hours)","name_ar":"السعة القانونية المدفوعة مقدما (200 ساعة)","description_en":"200 prepaid professional legal hours, 12-month validity, at a lower effective hourly rate.","description_ar":"200 ساعة مهنية قانونية مدفوعة مقدما، صلاحية 12 شهرا، بمعدل فعلي أقل للساعة.","price_sar":200000,"validity_days":365,"max_seats":1,"active":true},
];

async function main() {
  // 1. Remove the 3 duplicates of the hardcoded premium cards.
  const { data: deleted, error: delErr } = await supabase
    .from("service_packages")
    .delete()
    .in("name_en", DUPLICATE_NAMES_EN)
    .select("name_en");
  if (delErr) {
    console.error("Delete failed:", delErr.message);
    process.exit(1);
  }
  console.log(`Removed ${deleted.length} duplicate premium row(s): ${deleted.map((d) => d.name_en).join(", ") || "(none found)"}`);

  // 2. Insert the 4 missing tier packages, skipping any already present.
  const { data: existing, error: existErr } = await supabase.from("service_packages").select("name_en");
  if (existErr) {
    console.error("Read failed:", existErr.message);
    process.exit(1);
  }
  const existingNames = new Set(existing.map((r) => r.name_en));

  const toInsert = MISSING_PUBLIC.filter((p) => !existingNames.has(p.name_en));
  if (toInsert.length > 0) {
    const { data: inserted, error: insErr } = await supabase.from("service_packages").insert(toInsert).select("name_en");
    if (insErr) {
      console.error("Insert (missing public) failed:", insErr.message);
      process.exit(1);
    }
    console.log(`Inserted ${inserted.length} missing public package(s): ${inserted.map((d) => d.name_en).join(", ")}`);
  } else {
    console.log("No missing public packages to insert (all already present).");
  }

  // 3. Insert the 30 hidden modules from seed_packages.json, skipping any already present.
  const allSeed = JSON.parse(readFileSync(join(__dirname, "seed_packages.json"), "utf-8"));
  const hidden = allSeed.filter((p) => p.active === false);

  const { data: existing2, error: existErr2 } = await supabase.from("service_packages").select("name_en");
  if (existErr2) {
    console.error("Read failed:", existErr2.message);
    process.exit(1);
  }
  const existingNames2 = new Set(existing2.map((r) => r.name_en));
  const hiddenToInsert = hidden.filter((p) => !existingNames2.has(p.name_en));

  if (hiddenToInsert.length > 0) {
    const { data: insertedHidden, error: hidErr } = await supabase
      .from("service_packages")
      .insert(hiddenToInsert)
      .select("name_en");
    if (hidErr) {
      console.error("Insert (hidden) failed:", hidErr.message);
      process.exit(1);
    }
    console.log(`Inserted ${insertedHidden.length} hidden package(s).`);
  } else {
    console.log("No hidden packages to insert (all already present).");
  }

  const { count } = await supabase.from("service_packages").select("*", { count: "exact", head: true });
  console.log(`\nFinal row count: ${count}`);
}

main();
