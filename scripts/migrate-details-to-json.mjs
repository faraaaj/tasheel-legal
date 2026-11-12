// scripts/migrate-details-to-json.mjs
//
// Migrates the existing details_en / details_ar prose in service_packages
// into the new structured details_json_en / details_json_ar columns, and
// appends a "Price & Offer" section to the three premium packages.
//
// Run:  node scripts/migrate-details-to-json.mjs
//
// Requires in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

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
    // ignore; rely on process env
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const HEADERS = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

// Premium package price breakdowns appended to details_json.
const PRICE_BREAKDOWNS = {
  "Annual Legal Partnership": {
    en: ["Original Price: 30,000 SAR", "Discounted Price: 20,000 SAR", "Discount Valid Until: End of 2026"],
    ar: ["السعر الأصلي: 30,000 ريال سعودي", "السعر بعد الخصم: 20,000 ريال سعودي", "الخصم ساري حتى: نهاية 2026"],
  },
  "Government Violations Cases": {
    en: ["Original Price: 25,000 SAR", "Discounted Price: 15,000 SAR", "Discount Valid Until: End of 2026"],
    ar: ["السعر الأصلي: 25,000 ريال سعودي", "السعر بعد الخصم: 15,000 ريال سعودي", "الخصم ساري حتى: نهاية 2026"],
  },
  "Problems Technology Cure": {
    en: ["Original Price: 15,000 SAR", "Discounted Price: FREE", "Discount Valid Until: End of 2026"],
    ar: ["السعر الأصلي: 15,000 ريال سعودي", "السعر بعد الخصم: مجاناً", "الخصم ساري حتى: نهاية 2026"],
  },
};

function isHeading(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.endsWith(":") || trimmed.endsWith("：")) return true;
  if (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return true;
  return false;
}

function isBullet(line) {
  return /^[-•✓*]\s/.test(line.trim()) || /^[-•✓*]$/.test(line.trim());
}

function stripBullet(line) {
  return line.trim().replace(/^[-•✓*]\s*/, "").trim();
}

function parseDetails(text) {
  if (!text || typeof text !== "string" || text.trim() === "") return null;
  const lines = text.split(/\r?\n/);
  const sections = [];
  let current = null;

  const blocks = [];
  let block = [];
  for (const line of lines) {
    if (line.trim() === "") {
      if (block.length) { blocks.push(block); block = []; }
    } else {
      block.push(line);
    }
  }
  if (block.length) blocks.push(block);

  for (const blk of blocks) {
    let heading = null;
    const items = [];
    let started = false;
    for (const raw of blk) {
      const line = raw.trim();
      if (!line) continue;
      if (!started && isHeading(line)) {
        heading = line.replace(/[:：]$/, "").trim();
        started = true;
        continue;
      }
      started = true;
      if (isBullet(line)) {
        const item = stripBullet(line);
        if (item) items.push(item);
      } else {
        items.push(line);
      }
    }
    if (heading || items.length > 0) {
      sections.push({ heading, items });
    }
  }

  return sections.length > 0 ? { sections } : null;
}

async function fetchPackages() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/service_packages?select=id,name_en,details_en,details_ar`,
    { headers: HEADERS },
  );
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function patchPackage(id, jsonEn, jsonAr) {
  const body = {};
  if (jsonEn) body.details_json_en = jsonEn;
  if (jsonAr) body.details_json_ar = jsonAr;
  if (Object.keys(body).length === 0) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/service_packages?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...HEADERS, Prefer: "return=minimal" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`patch ${id} failed: ${res.status} ${await res.text()}`);
}

async function main() {
  const packages = await fetchPackages();
  console.log(`Found ${packages.length} packages.`);
  let migrated = 0;
  for (const pkg of packages) {
    let jsonEn = parseDetails(pkg.details_en);
    let jsonAr = parseDetails(pkg.details_ar);

    const breakdown = PRICE_BREAKDOWNS[pkg.name_en];
    if (breakdown) {
      if (jsonEn) {
        jsonEn.sections = jsonEn.sections || [];
        jsonEn.sections.push({ heading: "Price & Offer", items: breakdown.en });
      } else {
        jsonEn = { sections: [{ heading: "Price & Offer", items: breakdown.en }] };
      }
      if (jsonAr) {
        jsonAr.sections = jsonAr.sections || [];
        jsonAr.sections.push({ heading: "السعر والعرض", items: breakdown.ar });
      } else {
        jsonAr = { sections: [{ heading: "السعر والعرض", items: breakdown.ar }] };
      }
    }

    if (!jsonEn && !jsonAr) {
      console.log(`  ${pkg.id}: nothing to migrate (empty details)`);
      continue;
    }

    await patchPackage(pkg.id, jsonEn, jsonAr);
    migrated++;
    console.log(`  ${pkg.id} (${pkg.name_en}): migrated${breakdown ? " + price breakdown" : ""}`);
  }
  console.log(`\nDone. Migrated ${migrated} packages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
