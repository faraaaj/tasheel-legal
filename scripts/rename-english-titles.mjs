// Renames English package titles ONLY (US spelling "Program" not "Programme",
// shortened so every title fits on a single line on the store card). This
// touches ONLY the name_en column, matched by the OLD name_en value.
// name_ar is never read, never included in the update payload, and is
// therefore never touched by this script, directly or indirectly.
//
// Run this BEFORE scripts/content-fix-final.mjs (which matches rows by the
// NEW name_en values already baked into big_update_v6.json / new_packages_v4.json).
//
// Idempotent: if a row has already been renamed (old name no longer found),
// it's reported as "not found (already renamed or not yet inserted)" and
// skipped, not treated as an error.
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

// old -> new, English titles only. Keep in sync with scripts/rename_map
// used to generate big_update_v6.json / new_packages_v4.json / trade_packages_v2.json.
const RENAME = {
  "AML Policy and Procedures Package": "AML Policy & Procedures",
  "Annual Corporate Compliance Calendar Package": "Annual Compliance Calendar",
  "Articles of Association Drafting Package": "Articles of Association",
  "Bilingual NDA Drafting Package": "Bilingual NDA Drafting",
  "Branch Office Registration Package": "Branch Office Registration",
  "Business Recovery and Creditor Management Programme": "Business Recovery Program",
  "Certified Legal Translation Package (up to 10 pages)": "Certified Legal Translation",
  "Closed Joint Stock Company Package": "Closed Joint Stock Company",
  "Commercial Lease Agreement Package": "Commercial Lease Agreement",
  "Construction Contract Drafting Package (FIDIC-style)": "FIDIC Construction Contract",
  "Contractor Business Protection Programme": "Contractor Protection Program",
  "Copyright and Brand Protection Starter Package": "Copyright & Brand Protection",
  "Corporate Governance Health Check Package": "Governance Health Check",
  "Corporate Legal Governance Programme": "Corporate Governance Program",
  "Dispute Resolution and Claims Management Programme": "Dispute & Claims Management",
  "Document Legalization and MOFA Attestation Support Package": "MOFA Legalization & Attestation",
  "Employment Contract Drafting Package": "Employment Contract Drafting",
  "Employment and Workforce Protection Programme": "Workforce Protection Program",
  "Executive Employment and Non-Compete Package": "Executive Non-Compete Contract",
  "Family Business Governance and Succession Programme": "Family Business Succession",
  "Family Company Governance Manual Package": "Family Governance Manual",
  "Franchise Agreement Drafting Package": "Franchise Agreement Drafting",
  "Freelance License Compliance Package": "Freelance License Compliance",
  "Government Violation & Penalty Resolution": "Government Violation Resolution",
  "IP and Technology Protection Programme": "IP & Technology Protection",
  "Individual Legal Protection Programme": "Individual Legal Protection",
  "International Business Partner Programme": "International Business Partner",
  "MISA Foreign Investment License Support Package": "MISA Investment License Support",
  "Major Project Legal Protection Programme": "Major Project Protection",
  "Real Estate Sale and Purchase Agreement Review Package": "Real Estate Sale & Purchase Review",
  "Real Estate and Project Transaction Programme": "Real Estate Transaction Program",
  "Regional Headquarters (RHQ) License Support Package": "RHQ License Support",
  "Regulatory Exposure and Penalty Management Programme": "Regulatory Penalty Management",
  "Saudi Market Entry and Operating Programme": "Saudi Market Entry Program",
  "Saudization (Nitaqat) Compliance Review Package": "Saudization (Nitaqat) Review",
  "Shareholder Agreement Drafting Package": "Shareholder Agreement Drafting",
  "Software License and SaaS Terms Package": "Software License & SaaS Terms",
  "Standard Commercial Contract Drafting Package": "Commercial Contract Drafting",
  "Strategic Transaction and Investment Programme": "Strategic Investment Program",
  "The Annual Legal Partnership": "Annual Legal Partnership",
  "The Technology Adoption Solution": "Technology Adoption Solution",
  "Trademark Registration Filing Package": "Trademark Registration Filing",
  "Trademark Watch and Enforcement Letter Package": "Trademark Watch & Enforcement",
  "Vendor and Supplier Agreement Package": "Vendor & Supplier Agreement",
  "Website Terms & Privacy Policy Package": "Website Terms & Privacy Policy",
  "Technology Market Entry Programme": "Technology Market Entry Program",
  "Saudi Entity Setup Programme": "Saudi Entity Setup Program",
  "Manufacturing Establishment Programme": "Manufacturing Establishment",
};

async function run() {
  let renamed = 0;
  let notFound = 0;
  for (const [oldName, newName] of Object.entries(RENAME)) {
    // name_en only. name_ar is not selected, not read, not written.
    const { data, error } = await supabase
      .from("service_packages")
      .update({ name_en: newName })
      .eq("name_en", oldName)
      .select("id");

    if (error) {
      console.error(`Rename failed for "${oldName}":`, error.message);
      continue;
    }
    if (!data || data.length === 0) {
      console.log(`  not found (already renamed or not yet inserted): "${oldName}"`);
      notFound += 1;
      continue;
    }
    console.log(`  renamed: "${oldName}" -> "${newName}"`);
    renamed += 1;
  }
  console.log(`\nRenamed ${renamed} rows, ${notFound} not found (safe to ignore if already renamed).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
