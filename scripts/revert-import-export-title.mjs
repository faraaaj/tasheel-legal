import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function main() {
  const { data: row, error: findError } = await supabase
    .from("service_packages")
    .select("id, name_en")
    .eq("name_en", "Import-Export Compliance & Documentation")
    .single();

  if (findError || !row) {
    console.error("Could not find row with the current title:", findError?.message);
    process.exit(1);
  }

  const { error: updateError } = await supabase
    .from("service_packages")
    .update({ name_en: "Import-Export Compliance" })
    .eq("id", row.id);

  if (updateError) {
    console.error("Update failed:", updateError.message);
    process.exit(1);
  }

  console.log('Reverted: "Import-Export Compliance & Documentation" -> "Import-Export Compliance" (name_ar untouched)');
}

main().then(() => process.exit(0));
