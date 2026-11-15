-- AI-powered ticker items table.
--
-- Run this in the Supabase Dashboard -> SQL Editor.
-- WARNING: This drops the existing ticker_items table. Back up data first.

drop table if exists public.ticker_items cascade;

create table public.ticker_items (
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

create policy "Public can view active ticker items"
  on public.ticker_items for select
  using (is_active = true);

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
(
  'New Saudi Companies Law: Key Changes for International Investors',
  'نظام الشركات السعودي الجديد: التغييرات الرئيسية للمستثمرين الدوليين',
  'The new Companies Law introduces significant changes to corporate structuring, shareholder rights, and foreign investment requirements.',
  'دخلت التعديلات الجديدة على نظام الشركات حيز التنفيذ، مما يسهل على المستثمرين الأجانب تأسيس الشركات وتملك الأصول في المملكة.',
  'https://mc.gov.sa', 'Ministry of Commerce', 'legal', true, 1
),
(
  'Vision 2030: New Incentives for Tech Localization',
  'رؤية 2030: حوافز جديدة لتوطين التقنية',
  'The Saudi government has announced new incentives for technology companies that localize their operations in the Kingdom.',
  'أعلنت الحكومة السعودية عن حوافز جديدة للشركات التقنية التي توطن عملياتها في المملكة، بهدف تعزيز الابتكار وتنويع الاقتصاد.',
  'https://vision2030.gov.sa', 'Vision 2030', 'business', true, 2
),
(
  'Tasheel Legal Expands Cross-Border M&A Advisory',
  'تسهيل للمحاماة توسع خدماتها الاستشارية للاندماج والاستحواذ العابر للحدود',
  'Tasheel Legal has expanded its M&A advisory services to support international clients entering the Saudi market.',
  'أعلنت شركة تسهيل للمحاماة عن توسيع نطاق خدماتها الاستشارية لتشمل صفقات الاندماج والاستحواذ العابر للحدود، لدعم expansion الشركات في المنطقة.',
  'https://tasheel.law', 'Tasheel Legal', 'insight', true, 3
),
(
  'RHQ Framework: What Multinationals Need to Know',
  'إطار المقار الإقليمية: ما تحتاج الشركات متعددة الجنسيات معرفته',
  'The Regional Headquarters (RHQ) program offers significant benefits for multinationals establishing their regional base in Riyadh.',
  'تتطلب اللوائح الجديدة من الشركات متعددة الجنسيات الامتثال لإطار المقار الإقليمية، مما يؤثر على هيكلة الضرائب والعمليات.',
  'https://misa.gov.sa', 'MISA', 'legal', true, 4
),
(
  'Contractor Compliance: New Penalties for Violations',
  'امتثال المقاولين: عقوبات جديدة للمخالفات',
  'New regulatory penalties have been introduced for contractors that fail to comply with classification and licensing requirements.',
  'فرضت الجهات التنظيمية عقوبات جديدة على المقاولين غير الممتثلين لأنظمة السلامة والتوظيف، مما يستدعي مراجعة العقود والالتزامات.',
  'https://sbc.gov.sa', 'Saudi Contractors Authority', 'legal', true, 5
);
