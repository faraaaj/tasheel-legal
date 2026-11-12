// Updates ONLY name_ar for one package. Matches the row by its
// CURRENT name_en and never reads or writes name_en. English titles
// are untouched, per standing instruction.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
const sb = createClient(url, key);

// nameEn is used ONLY to find the row; it is never written.
const nameEn = "Technology Localization Program";
const newNameAr = "باقة شركات التقنية العمالية";

async function main() {
  const { data: existing, error: selErr } = await sb
    .from("service_packages")
    .select("id,name_en,name_ar")
    .eq("name_en", nameEn)
    .maybeSingle();

  if (selErr) {
    console.error("select error:", selErr);
    process.exit(1);
  }
  if (!existing) {
    console.error(`NOT FOUND: no row with name_en = "${nameEn}". Nothing changed.`);
    process.exit(1);
  }

  console.log("Found row. Current name_ar:", existing.name_ar);

  const { error } = await sb.from("service_packages").update({ name_ar: newNameAr }).eq("id", existing.id);

  if (error) {
    console.error("update error:", error);
    process.exit(1);
  }

  console.log(`Updated name_ar -> "${newNameAr}" (name_en left untouched: "${existing.name_en}")`);
}

main();
