// Quick self-check: run this any time to confirm whether the migration + content
// script actually landed, independent of what the live website shows (which may
// be cached by the dev server). Usage: node scripts/verify-content.mjs
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
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY
);

async function main() {
  console.log("1) Checking columns exist (details_en, outcomes_en)...");
  const { data: sample, error: colError } = await supabase
    .from("service_packages")
    .select("name_en, details_en, outcomes_en")
    .eq("name_en", "Annual Legal Partnership")
    .maybeSingle();

  if (colError) {
    console.log("   COLUMNS MISSING or query failed:", colError.message);
  } else if (!sample) {
    console.log("   Row not found for 'Annual Legal Partnership'.");
  } else {
    console.log("   name_en:", sample.name_en);
    console.log("   details_en present:", Boolean(sample.details_en));
    console.log("   outcomes_en present:", Boolean(sample.outcomes_en));
  }

  console.log("\n2) Checking the 3 new international packages...");
  const newNames = [
    "Technology Market Entry Program",
    "Saudi Entity Setup Program",
    "Manufacturing Establishment",
  ];
  const { data: rows, error } = await supabase
    .from("service_packages")
    .select("name_en, active, price_sar")
    .in("name_en", newNames);

  if (error) {
    console.log("   Query failed:", error.message);
  } else {
    for (const n of newNames) {
      const row = rows.find((r) => r.name_en === n);
      console.log(`   ${n}: ${row ? `present (active=${row.active}, price=${row.price_sar})` : "MISSING"}`);
    }
  }

  console.log("\n3) Checking the renamed annual packages...");
  const { data: annualRows } = await supabase
    .from("service_packages")
    .select("name_en, name_ar")
    .in("name_en", ["Annual Legal Partnership", "Business Legal Partner"]);
  for (const r of annualRows ?? []) {
    console.log(`   ${r.name_en}: name_ar = "${r.name_ar}"`);
  }

  console.log("\n4) Spot-checking renamed English titles (US spelling, no 'Programme')...");
  const { data: progRows, error: progError } = await supabase
    .from("service_packages")
    .select("name_en")
    .ilike("name_en", "%Programme%");
  if (progError) {
    console.log("   Query failed:", progError.message);
  } else if (!progRows || progRows.length === 0) {
    console.log("   None found — all titles renamed to US spelling.");
  } else {
    console.log("   STILL BRITISH SPELLING:", progRows.map((r) => r.name_en));
  }

  console.log("\n5) Checking the 3 Trade Opportunities packages...");
  const tradeNames = [
    "Import-Export Compliance",
    "Distribution & Agency Agreement",
    "GCC Trade Expansion Advisory",
  ];
  const { data: tradeRows, error: tradeError } = await supabase
    .from("service_packages")
    .select("name_en, active, price_sar")
    .in("name_en", tradeNames);
  if (tradeError) {
    console.log("   Query failed:", tradeError.message);
  } else {
    for (const n of tradeNames) {
      const row = tradeRows.find((r) => r.name_en === n);
      console.log(`   ${n}: ${row ? `present (active=${row.active}, price=${row.price_sar})` : "not added yet"}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
