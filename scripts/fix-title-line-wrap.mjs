// One-off: lengthen specific English package titles (name_en ONLY — name_ar
// is never read or touched here) so they wrap to two lines like the rest
// of the cards in their section, instead of sitting alone on one line.
// Matches by whatever the CURRENT name_en value is (handles the case where
// an earlier pending rename may or may not have already been applied).

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Each entry: list of possible CURRENT values to match against, and the
// final value we want. If the row is already at the final value, it's
// skipped (no-op, safe to re-run).
const renames = [
  {
    candidates: ["Import-Export Compliance"],
    newValue: "Import-Export Compliance & Documentation",
  },
  {
    candidates: ["GCC Trade Expansion Advisory"],
    newValue: "GCC Regional Trade Expansion Advisory",
  },
  {
    candidates: [
      "Real Estate Developer Advisory",
      "Real Estate Development & Investment Advisory",
    ],
    newValue: "Real Estate Development & Investment Advisory",
  },
];

async function main() {
  for (const { candidates, newValue } of renames) {
    const { data: rows, error: findError } = await supabase
      .from("service_packages")
      .select("id, name_en")
      .in("name_en", candidates);

    if (findError) {
      console.error(`Lookup failed for ${candidates[0]}:`, findError.message);
      continue;
    }
    if (!rows || rows.length === 0) {
      console.log(`No row found matching any of: ${candidates.join(" | ")} — skipping.`);
      continue;
    }

    for (const row of rows) {
      if (row.name_en === newValue) {
        console.log(`Already "${newValue}" — no change needed.`);
        continue;
      }
      const { error: updateError } = await supabase
        .from("service_packages")
        .update({ name_en: newValue })
        .eq("id", row.id);

      if (updateError) {
        console.error(`Update failed for "${row.name_en}":`, updateError.message);
      } else {
        console.log(`Updated: "${row.name_en}" -> "${newValue}" (name_ar untouched)`);
      }
    }
  }
}

main().then(() => process.exit(0));
