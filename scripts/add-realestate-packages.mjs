// Opt-in script: adds the 3 new real-estate-focused packages (off-plan
// delivery disputes, landowner protection, real estate developer advisory).
// NOT auto-run by content-fix-final.mjs or apply-popup-content.mjs — run
// this explicitly once the starting prices are confirmed (see note below).
//
// PRICE NOTE: the user's two source documents disagree on these starting
// prices. The Arabic attachment says 15,000 / 35,000 / 75,000 SAR; the
// English docx says 35,000 / 45,000 / 85,000 SAR. This script uses the
// Arabic (lower) figures. Re-run with edited JSON if the English figures
// should win instead.
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
const sb = createClient(url, key);
const packages = JSON.parse(fs.readFileSync(new URL("./realestate_packages_final.json", import.meta.url)));

async function main() {
  for (const pkg of packages) {
    const { data: existing } = await sb
      .from("service_packages")
      .select("id")
      .eq("name_en", pkg.name_en)
      .maybeSingle();
    if (existing) {
      const { error } = await sb.from("service_packages").update(pkg).eq("id", existing.id);
      if (error) console.error("update error", pkg.name_en, error);
      else console.log("updated:", pkg.name_en);
    } else {
      const { error } = await sb.from("service_packages").insert(pkg);
      if (error) console.error("insert error", pkg.name_en, error);
      else console.log("inserted:", pkg.name_en);
    }
  }
}
main();
