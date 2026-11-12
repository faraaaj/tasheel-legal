// NEW / PROPOSED CONTENT — not part of content-fix-final.mjs on purpose.
// Adds 3 new "Trade Opportunities" packages (review scripts/trade_packages_v2.json
// first). Run manually, after migration_final.sql, only once you've approved
// the content:
//   node scripts/add-trade-packages.mjs
// Idempotent: upserts by name_en, safe to re-run.
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

const tradePackages = JSON.parse(
  readFileSync(path.join(__dirname, "trade_packages_v2.json"), "utf-8")
);

async function upsertTrade() {
  let inserted = 0;
  let updated = 0;
  for (const row of tradePackages) {
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
  console.log("Upserting the 3 Trade Opportunities packages...");
  const { inserted, updated } = await upsertTrade();
  console.log(`Trade packages: ${inserted} inserted, ${updated} updated.`);

  const { data: allActive, error } = await supabase
    .from("service_packages")
    .select("name_en")
    .eq("active", true);
  if (error) {
    console.error("Final count check failed:", error.message);
  } else {
    const names = new Set(allActive.map((r) => r.name_en));
    for (const row of tradePackages) {
      console.log(`  ${row.name_en}: ${names.has(row.name_en) ? "present" : "MISSING"}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
