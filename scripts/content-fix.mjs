// scripts/content-fix.mjs
// One-off content remediation for service_packages:
//  1. Removes 3 packages that were inserted without approval and are not part
//     of the approved 21-public / 30-hidden catalogue (External General Counsel,
//     Prepaid Legal Capacity 25h, Prepaid Legal Capacity 200h).
//  2. Restores the 3 premium rows (deleted by an earlier script) that the
//     store page now reads by exact name_en, with the corrected Arabic names
//     and the original prices (60000 / 25000 / 0).
//  3. Rewrites name_ar + description_en + description_ar for every one of the
//     51 approved packages (21 public + 30 hidden) so each card's content is
//     specific to its own title instead of generic/copy-pasted text.
// Safe to re-run: it updates existing rows by name_en, or inserts them if
// they are missing, and never touches anything outside this exact list.

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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const REMOVE_NAMES = [
  "External General Counsel",
  "Prepaid Legal Capacity (25 Hours)",
  "Prepaid Legal Capacity (200 Hours)",
];

async function main() {
  const dataPath = path.join(__dirname, "content_fix.json");
  const entries = JSON.parse(readFileSync(dataPath, "utf8"));

  // 1. Remove the 3 packages that were never part of the approved 21/30 split.
  const { data: removed, error: removeErr } = await supabase
    .from("service_packages")
    .delete()
    .in("name_en", REMOVE_NAMES)
    .select("name_en");
  if (removeErr) throw removeErr;
  console.log(
    `Removed ${removed?.length ?? 0} unapproved package(s): ${
      (removed ?? []).map((r) => r.name_en).join(", ") || "none"
    }`
  );

  // 2. Upsert (update if present, insert if missing) every approved package.
  let updated = 0;
  let inserted = 0;
  for (const entry of entries) {
    const { data: existing, error: findErr } = await supabase
      .from("service_packages")
      .select("id")
      .eq("name_en", entry.name_en)
      .limit(1);
    if (findErr) throw findErr;

    if (existing && existing.length > 0) {
      const { error: updateErr } = await supabase
        .from("service_packages")
        .update({
          name_ar: entry.name_ar,
          description_en: entry.description_en,
          description_ar: entry.description_ar,
          price_sar: entry.price_sar,
          validity_days: entry.validity_days,
          max_seats: entry.max_seats,
          active: entry.active,
        })
        .eq("id", existing[0].id);
      if (updateErr) throw updateErr;
      updated += 1;
    } else {
      const { error: insertErr } = await supabase
        .from("service_packages")
        .insert({
          name_en: entry.name_en,
          name_ar: entry.name_ar,
          description_en: entry.description_en,
          description_ar: entry.description_ar,
          price_sar: entry.price_sar,
          validity_days: entry.validity_days,
          max_seats: entry.max_seats,
          active: entry.active,
        });
      if (insertErr) throw insertErr;
      inserted += 1;
    }
  }

  console.log(`Updated ${updated} existing package(s).`);
  console.log(`Inserted ${inserted} new/restored package(s).`);

  const { data: finalRows, error: finalErr } = await supabase
    .from("service_packages")
    .select("active");
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
