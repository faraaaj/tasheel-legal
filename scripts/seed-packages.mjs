// One-off seed script: loads scripts/seed_packages.json into public.service_packages.
// Run once from the project root with your normal terminal (not through any Claude tool):
//   node scripts/seed-packages.mjs
//
// Uses the service role key (bypasses RLS) from .env.local. Safe to re-run: it checks the
// current row count first and refuses to run if the table is not empty, so it never
// duplicates or overwrites existing rows.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env.local parser (no "dotenv" package is installed in this project).
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

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const rows = JSON.parse(readFileSync(join(__dirname, "seed_packages.json"), "utf-8"));

async function main() {
  const { count, error: countErr } = await supabase
    .from("service_packages")
    .select("*", { count: "exact", head: true });

  if (countErr) {
    console.error("Could not read service_packages:", countErr.message);
    process.exit(1);
  }

  if (count && count > 0) {
    console.error(
      `service_packages already has ${count} row(s). Refusing to run automatically ` +
      `to avoid duplicates. Clear the table first or edit this script if you want to re-seed.`
    );
    process.exit(1);
  }

  const { data, error } = await supabase.from("service_packages").insert(rows).select("id, name_en, active");

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  const publicCount = data.filter((r) => r.active).length;
  const hiddenCount = data.filter((r) => !r.active).length;
  console.log(`Inserted ${data.length} packages: ${publicCount} public (active), ${hiddenCount} hidden (inactive).`);
}

main();
