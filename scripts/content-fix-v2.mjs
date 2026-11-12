// scripts/content-fix-v2.mjs
// Run this AFTER applying scripts/migration.sql (adds details_en/ar and
// comparison_en/ar columns to service_packages).
//
// 1. Inserts the 3 new international-company packages (Technology Market
//    Entry, Saudi Entity Setup, Manufacturing Establishment) at the end of
//    the public catalogue.
// 2. Populates details_en/ar (the per-card "three values" popup content,
//    replacing the old hardcoded identical Pillars block) and comparison_en/ar
//    (the "pay per component vs one prepaid price" breakdown) for the 3
//    premium cards and the 5 large existing programmes.
//
// Safe to re-run.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(projectRoot, ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function upsertNewPackage(entry) {
  const { data: existing, error: findErr } = await supabase
    .from("service_packages")
    .select("id")
    .eq("name_en", entry.name_en)
    .limit(1);
  if (findErr) throw findErr;

  const payload = {
    name_en: entry.name_en,
    name_ar: entry.name_ar,
    description_en: entry.description_en,
    description_ar: entry.description_ar,
    details_en: entry.details_en,
    details_ar: entry.details_ar,
    comparison_en: entry.comparison_en,
    comparison_ar: entry.comparison_ar,
    price_sar: entry.price_sar,
    validity_days: entry.validity_days,
    max_seats: entry.max_seats,
    active: entry.active,
  };

  if (existing && existing.length > 0) {
    const { error } = await supabase.from("service_packages").update(payload).eq("id", existing[0].id);
    if (error) throw error;
    return "updated";
  }
  const { error } = await supabase.from("service_packages").insert(payload);
  if (error) throw error;
  return "inserted";
}

async function updateDetails(entry) {
  const { error, count } = await supabase
    .from("service_packages")
    .update(
      {
        details_en: entry.details_en,
        details_ar: entry.details_ar,
        comparison_en: entry.comparison_en,
        comparison_ar: entry.comparison_ar,
      },
      { count: "exact" }
    )
    .eq("name_en", entry.name_en);
  if (error) throw error;
  return count ?? 0;
}

async function main() {
  const newPackages = JSON.parse(readFileSync(path.join(__dirname, "new_packages.json"), "utf8"));
  const bigPackageUpdates = JSON.parse(
    readFileSync(path.join(__dirname, "big_package_updates.json"), "utf8")
  );

  let inserted = 0;
  let updated = 0;
  for (const entry of newPackages) {
    const result = await upsertNewPackage(entry);
    if (result === "inserted") inserted += 1;
    else updated += 1;
    console.log(`${result}: ${entry.name_en}`);
  }
  console.log(`\nNew packages: ${inserted} inserted, ${updated} updated.`);

  let detailsUpdated = 0;
  for (const entry of bigPackageUpdates) {
    const rows = await updateDetails(entry);
    detailsUpdated += rows;
    console.log(`details set on ${rows} row(s): ${entry.name_en}`);
  }
  console.log(`\nDetails/comparison populated on ${detailsUpdated} existing package(s).`);

  const { data: finalRows, error: finalErr } = await supabase.from("service_packages").select("active");
  if (finalErr) throw finalErr;
  const activeCount = (finalRows ?? []).filter((r) => r.active).length;
  console.log(
    `\nFinal row count: ${finalRows?.length ?? 0} (public: ${activeCount}, hidden: ${
      (finalRows?.length ?? 0) - activeCount
    })`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
