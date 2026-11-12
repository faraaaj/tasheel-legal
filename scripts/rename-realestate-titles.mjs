// Two separate, narrow updates on the real estate packages:
// 1. English title change for "Real Estate Developer Advisory"
//    (name_en ONLY, matched by its current name_en).
// 2. Arabic title change for "Off-Plan Delivery Disputes & Claims"
//    (name_ar ONLY, matched by its name_en, which is never touched).
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
const sb = createClient(url, key);

async function updateOne({ matchNameEn, field, newValue, label }) {
  const { data: existing, error: selErr } = await sb
    .from("service_packages")
    .select("id,name_en,name_ar")
    .eq("name_en", matchNameEn)
    .maybeSingle();

  if (selErr) {
    console.error(`[${label}] select error:`, selErr);
    return false;
  }
  if (!existing) {
    console.error(`[${label}] NOT FOUND: no row with name_en = "${matchNameEn}". Nothing changed.`);
    return false;
  }

  console.log(`[${label}] Found row. Current ${field}:`, existing[field]);

  const { error } = await sb.from("service_packages").update({ [field]: newValue }).eq("id", existing.id);

  if (error) {
    console.error(`[${label}] update error:`, error);
    return false;
  }

  console.log(`[${label}] Updated ${field} -> "${newValue}"`);
  console.log(`[${label}] (name_en: "${existing.name_en}", name_ar untouched unless this field IS name_ar)`);
  return true;
}

async function main() {
  await updateOne({
    matchNameEn: "Real Estate Developer Advisory",
    field: "name_en",
    newValue: "Real Estate Development & Investment Legal Advisory",
    label: "English title",
  });

  console.log("---");

  await updateOne({
    matchNameEn: "Off-Plan Delivery Disputes & Claims",
    field: "name_ar",
    newValue: "حماية المشتري ومعالجة نزاعات البيع على الخارطة",
    label: "Arabic title",
  });
}

main();
