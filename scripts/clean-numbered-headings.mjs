// scripts/clean-numbered-headings.mjs
//
// Cleans numbered headings in service_packages outcomes/requirements arrays.
// Strips leading numbers, trailing colons and slashes from heading strings.
//
// Run: node scripts/clean-numbered-headings.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      const value = m[2].trim().replace(/^"|"$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const HEADERS = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

// Clean a heading string: remove leading numbers/dots/slashes, trailing colons/slashes
function cleanHeading(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/^[\d\u0660-\u0669]+[.\-\\\s\/]*/, "")
    .replace(/[:\/\\]+$/, "")
    .trim();
}

// Detect if a string is a numbered heading (e.g., "1. text" or "1\. text")
function isNumberedHeading(str) {
  return typeof str === "string" && /^[\d\u0660-\u0669]+[.\\]/.test(str.trim());
}

function cleanArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item) => {
    if (isNumberedHeading(item)) {
      return cleanHeading(item);
    }
    return item;
  });
}

async function fetchPackages() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/service_packages?select=id,name_en,outcomes_en,outcomes_ar,requirements_en,requirements_ar`,
    { headers: HEADERS },
  );
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function patchPackage(id, updates) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/service_packages?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...HEADERS, Prefer: "return=minimal" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`patch ${id} failed: ${res.status} ${await res.text()}`);
}

async function main() {
  const packages = await fetchPackages();
  console.log(`Found ${packages.length} packages.`);
  let cleaned = 0;
  for (const pkg of packages) {
    const updates = {};
    let changed = false;

    for (const field of ["outcomes_en", "outcomes_ar", "requirements_en", "requirements_ar"]) {
      const original = pkg[field];
      const cleanedArr = cleanArray(original);
      if (JSON.stringify(cleanedArr) !== JSON.stringify(original)) {
        updates[field] = cleanedArr;
        changed = true;
      }
    }

    if (!changed) {
      continue;
    }

    await patchPackage(pkg.id, updates);
    cleaned++;
    console.log(`  ${pkg.id} (${pkg.name_en}): cleaned`);
  }
  console.log(`\nDone. Cleaned ${cleaned} packages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
