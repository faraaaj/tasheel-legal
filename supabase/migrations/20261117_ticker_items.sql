-- Ticker items table for the news ticker.
--
-- Run this in the Supabase Dashboard -> SQL Editor.
create table if not exists public.ticker_items (
  id uuid primary key default gen_random_uuid(),
  headline_en text not null,
  headline_ar text not null,
  summary_en text,
  summary_ar text,
  source_url text,
  source_name text,
  category text default 'legal',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ticker_items enable row level security;

drop policy if exists "Public can view active ticker items" on public.ticker_items;
create policy "Public can view active ticker items"
  on public.ticker_items for select
  using (is_active = true);

drop policy if exists "Admins can manage ticker items" on public.ticker_items;
create policy "Admins can manage ticker items"
  on public.ticker_items for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('superadmin', 'admin', 'marketing_admin')
    )
  );

-- Seed data
insert into public.ticker_items (headline_en, headline_ar, summary_en, summary_ar, source_url, source_name, category, is_active, sort_order) values
('New Saudi Companies Law: Key Changes for International Investors', 'نظام الشركات السعودي الجديد: التغييرات الرئيسية للمستثمرين الدوليين', 'The new Companies Law introduces significant changes to corporate structuring, shareholder rights, and foreign investment requirements.', 'يقدم نظام الشركات الجديد تغييرات كبيرة في هيكلة الشركات وحقوق المساهمين ومتطلبات الاستثمار الأجنبي.', 'https://mc.gov.sa', 'Ministry of Commerce', 'legal', true, 1),
('Vision 2030: New Incentives for Tech Localization', 'رؤية 2030: حوافز جديدة لتوطين التقنية', 'The Saudi government has announced new incentives for technology companies that localize their operations in the Kingdom.', 'أعلنت الحكومة السعودية عن حوافز جديدة للشركات التقنية التي توطن عملياتها في المملكة.', 'https://vision2030.gov.sa', 'Vision 2030', 'business', true, 2),
('Tasheel Legal Expands Cross-Border M&A Advisory', 'تسهيل للمحاماة توسع خدماتها الاستشارية للاندماج والاستحواذ العابر للحدود', 'Tasheel Legal has expanded its M&A advisory services to support international clients entering the Saudi market.', 'وسعت شركة تسهيل للمحاماة خدماتها الاستشارية للاندماج والاستحواذ لدعم العملاء الدوليين الداخلين إلى السوق السعودي.', 'https://tasheel.law', 'Tasheel Legal', 'insight', true, 3),
('RHQ Framework: What Multinationals Need to Know', 'إطار المقار الإقليمية: ما تحتاج الشركات متعددة الجنسيات معرفته', 'The Regional Headquarters (RHQ) program offers significant benefits for multinationals establishing their regional base in Riyadh.', 'يوفر برنامج المقار الإقليمية (RHQ) مزايا كبيرة للشركات متعددة الجنسيات التي تؤسس قاعدتها الإقليمية في الرياض.', 'https://misa.gov.sa', 'MISA', 'legal', true, 4),
('Contractor Compliance: New Penalties for Violations', 'امتثال المقاولين: عقوبات جديدة للمخالفات', 'New regulatory penalties have been introduced for contractors that fail to comply with classification and licensing requirements.', 'تم إدخال عقوبات تنظيمية جديدة على المقاولين الذين لا يلتزمون بمتطلبات التصنيف والترخيص.', 'https://sbc.gov.sa', 'Saudi Contractors Authority', 'legal', true, 5)
on conflict do nothing;
