-- Discount banners + price structure for premium packages.
--
-- Run this in the Supabase Dashboard -> SQL Editor.
--
-- Adds original_price_sar and discount labels, then sets the discounted
-- prices for the three premium packages. Names are corrected to match the
-- actual service_packages rows (the original instruction used
-- "Annual Legal Support 1", which is a different package).

alter table public.service_packages
  add column if not exists original_price_sar numeric,
  add column if not exists discount_label_en text,
  add column if not exists discount_label_ar text;

-- Package 1: Annual Legal Partnership
update public.service_packages
set
  original_price_sar = 30000,
  price_sar = 20000,
  discount_label_en = 'Limited Offer',
  discount_label_ar = 'عرض محدود'
where name_en = 'Annual Legal Partnership';

-- Package 2: Government Violations Cases
update public.service_packages
set
  original_price_sar = 25000,
  price_sar = 15000,
  discount_label_en = 'Limited Offer',
  discount_label_ar = 'عرض محدود'
where name_en = 'Government Violations Cases';

-- Package 3: Problems Technology Cure
update public.service_packages
set
  original_price_sar = 15000,
  price_sar = 0,
  discount_label_en = 'Free Until 2026',
  discount_label_ar = 'مجاناً حتى 2026'
where name_en = 'Problems Technology Cure';