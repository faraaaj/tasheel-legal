import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const PROFILES_SQL = `
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'client' check (role in ('client', 'admin')),
  is_approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
`;

const PACKAGES = [
  { name_en: "Contractor Business Protection Programme", name_ar: "برنامج حماية أعمال المقاولين", description_en: "Protects the contractor's commercial position across projects, contracts, payments and regulatory exposure.", description_ar: "يحمي المركز التجاري للمقاول عبر المشاريع والعقود والمدفوعات والتعرض التنظيمي.", price_sar: 45000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Regulatory Exposure and Penalty Management Programme", name_ar: "برنامج إدارة المخاطر التنظيمية والغرامات", description_en: "Manages regulatory financial exposure across agencies, rather than selling single objection letters.", description_ar: "يدير التعرض المالي التنظيمي عبر الجهات الحكومية، بدلاً من بيع خطابات اعتراض فردية.", price_sar: 10000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Business Recovery and Creditor Management Programme", name_ar: "برنامج استرداد الأعمال وإدارة الدائنين", description_en: "Early legal intervention for financial distress, before formal bankruptcy.", description_ar: "تدخل قانوني مبكر للضائقة المالية، قبل الإفلاس الرسمي.", price_sar: 35000, validity_days: 180, max_seats: 1, active: true },
  { name_en: "Corporate Legal Governance Programme", name_ar: "برنامج الحوكمة القانونية للشركات", description_en: "A dependable legal operating capability for management and shareholders.", description_ar: "قدرة قانونية تشغيلية موثوقة للإدارة والمساهمين.", price_sar: 40000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Saudi Market Entry and Operating Programme", name_ar: "برنامج دخول السوق السعودي والتشغيل", description_en: "Coordinated pathway from entry structuring through operating readiness.", description_ar: "مسار منسق من هيكلة الدخول إلى جاهزية التشغيل.", price_sar: 60000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Major Project Legal Protection Programme", name_ar: "برنامج الحماية القانونية للمشاريع الكبرى", description_en: "Legal oversight of a project's contractual commitments, award to close-out.", description_ar: "إشراف قانوني على الالتزامات التعاقدية للمشروع، من الترسية إلى الإغلاق.", price_sar: 55000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Strategic Transaction and Investment Programme", name_ar: "برنامج المعاملات الاستراتيجية والاستثمار", description_en: "Structuring, diligence and execution for a significant transaction.", description_ar: "الهيكلة والفحص النافي للجهالة والتنفيذ لمعاملة كبيرة.", price_sar: 70000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Annual Legal Partnership", name_ar: "الشراكة القانونية السنوية", description_en: "Recurring legal capacity with defined monthly entitlements.", description_ar: "قدرة قانونية متكررة مع استحقاقات شهرية محددة.", price_sar: 60000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Prepaid Legal Capacity", name_ar: "السعة القانونية المدفوعة مقدماً", description_en: "A spendable hour balance across eligible services.", description_ar: "رصيد ساعات قابل للإنفاق عبر الخدمات المؤهلة.", price_sar: 15000, validity_days: 180, max_seats: 1, active: true },
  { name_en: "Individual Legal Protection Programme", name_ar: "برنامج الحماية القانونية للأفراد", description_en: "Bundles the personal-legal essentials into one entry product.", description_ar: "يجمع الأساسيات القانونية الشخصية في منتج دخول واحد.", price_sar: 2500, validity_days: 180, max_seats: 1, active: true },
  { name_en: "Family Business Governance and Succession Programme", name_ar: "برنامج حوكمة الشركات العائلية والتعاقب", description_en: "Structures ownership, governance and succession as one programme.", description_ar: "هيكلة الملكية والحوكمة والتعاقب كبرنامج واحد.", price_sar: 50000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "IP and Technology Protection Programme", name_ar: "برنامج حماية الملكية الفكرية والتقنية", description_en: "Protects brand, data and technology assets as one programme.", description_ar: "يحمي العلامة التجارية والبيانات والأصول التقنية كبرنامج واحد.", price_sar: 25000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Employment and Workforce Protection Programme", name_ar: "برنامج حماية العمل والقوى العاملة", description_en: "Covers the employment lifecycle as one programme.", description_ar: "يغطي دورة حياة العمل كبرنامج واحد.", price_sar: 30000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "Dispute Resolution and Claims Management Programme", name_ar: "برنامج تسوية المنازعات وإدارة المطالبات", description_en: "Assesses and manages a dispute from strategy memo to capped representation.", description_ar: "يقيّم ويدير النزاع من مذكرة الاستراتيجية إلى التمثيل المحدود.", price_sar: 35000, validity_days: 180, max_seats: 1, active: true },
  { name_en: "Real Estate and Project Transaction Programme", name_ar: "برنامج المعاملات العقارية والمشاريع", description_en: "Covers a property transaction or portfolio as one programme.", description_ar: "يغطي معاملة عقارية أو محفظة كبرنامج واحد.", price_sar: 40000, validity_days: 365, max_seats: 1, active: true },
  { name_en: "International Business Partner Programme", name_ar: "برنامج شركاء الأعمال الدوليين", description_en: "One coordinated entry point for foreign companies exploring the Saudi market.", description_ar: "نقطة دخول منسقة واحدة للشركات الأجنبية التي تستكشف السوق السعودي.", price_sar: 50000, validity_days: 365, max_seats: 1, active: true },
];

async function main() {
  // 1. Create profiles table + RLS via Management API
  const schemaRes = await fetch(`${supabaseUrl}/admin/v1/database/schema`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: PROFILES_SQL }),
  });
  const schemaData = await schemaRes.json();
  console.log("PROFILES_SCHEMA_STATUS:", schemaRes.status, JSON.stringify(schemaData));

  // 2. Insert 16 packages
  const { error: insertError } = await supabase.from("service_packages").insert(PACKAGES);
  console.log("PACKAGES_INSERT_ERROR:", insertError?.message ?? null);

  console.log("SETUP_DONE");
}

main();
