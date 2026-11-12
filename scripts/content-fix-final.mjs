// Single consolidated content script. Run AFTER scripts/migration_final.sql
// AND scripts/rename-english-titles.mjs (English titles must already be
// renamed before this runs, since it matches rows by the NEW name_en values).
// Idempotent: updates existing rows by name_en (including description where
// provided), inserts the 3 new international packages if missing.
// v5: big_update_v5.json adds a rewritten, benefit-led description_en/ar for
// all 51 existing packages (was: only "The Technology Adoption Solution").
// v6: big_update_v6.json / new_packages_v4.json use the renamed English
// titles (US spelling "Program", shortened to fit one line). Arabic names
// (name_ar) are completely unaffected by this rename, in this file or in
// rename-english-titles.mjs: that script updates only the name_en column.
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const raw = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of raw.split("\n")) {
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

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey) {
  console.error("Missing Supabase URL or service role key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const bigUpdates = JSON.parse(
  readFileSync(path.join(__dirname, "big_update_v6.json"), "utf-8")
);
const newPackages = JSON.parse(
  readFileSync(path.join(__dirname, "new_packages_v4.json"), "utf-8")
);

async function updateExisting() {
  let updated = 0;
  for (const row of bigUpdates) {
    const payload = {
      name_ar: row.name_ar,
      outcomes_en: row.outcomes_en,
      outcomes_ar: row.outcomes_ar,
      details_en: row.details_en,
      details_ar: row.details_ar,
    };
    if (row.description_en) payload.description_en = row.description_en;
    if (row.description_ar) payload.description_ar = row.description_ar;

    const { data, error } = await supabase
      .from("service_packages")
      .update(payload)
      .eq("name_en", row.name_en)
      .select("id");

    if (error) {
      console.error(`Update failed for "${row.name_en}":`, error.message);
      continue;
    }
    if (!data || data.length === 0) {
      console.warn(`No existing row matched "${row.name_en}" (skipped).`);
      continue;
    }
    updated += 1;
  }
  return updated;
}

async function upsertNew() {
  let inserted = 0;
  let updated = 0;
  for (const row of newPackages) {
    const { data: existing, error: selectError } = await supabase
      .from("service_packages")
      .select("id")
      .eq("name_en", row.name_en)
      .maybeSingle();

    if (selectError) {
      console.error(`Lookup failed for "${row.name_en}":`, selectError.message);
      continue;
    }

    if (existing) {
      const { error } = await supabase
        .from("service_packages")
        .update(row)
        .eq("id", existing.id);
      if (error) {
        console.error(`Update failed for "${row.name_en}":`, error.message);
        continue;
      }
      updated += 1;
    } else {
      const { error } = await supabase.from("service_packages").insert(row);
      if (error) {
        console.error(`Insert failed for "${row.name_en}":`, error.message);
        continue;
      }
      inserted += 1;
    }
  }
  return { inserted, updated };
}

async function main() {
  console.log("Updating description/outcomes/details on existing packages...");
  const updatedCount = await updateExisting();
  console.log(`Updated ${updatedCount} / ${bigUpdates.length} existing packages.`);

  console.log("Upserting the 3 new international packages...");
  const { inserted, updated } = await upsertNew();
  console.log(`New packages: ${inserted} inserted, ${updated} updated.`);

  const { data: allActive, error } = await supabase
    .from("service_packages")
    .select("name_en")
    .eq("active", true);
  if (error) {
    console.error("Final count check failed:", error.message);
  } else {
    console.log(`Total active packages now in table: ${allActive.length}`);
    const names = new Set(allActive.map((r) => r.name_en));
    for (const n of [
      "Technology Market Entry Program",
      "Saudi Entity Setup Program",
      "Manufacturing Establishment",
    ]) {
      console.log(`  ${n}: ${names.has(n) ? "present" : "MISSING"}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
