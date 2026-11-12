-- Migration: Add discount columns and set discounted prices for premium packages
-- Run this in Supabase SQL Editor

-- Add discount columns
ALTER TABLE public.service_packages
ADD COLUMN IF NOT EXISTS original_price_sar NUMERIC,
ADD COLUMN IF NOT EXISTS discount_label_en TEXT,
ADD COLUMN IF NOT EXISTS discount_label_ar TEXT;

-- Package 1: Annual Legal Partnership (was 30,000, now 20,000)
UPDATE public.service_packages
SET 
  original_price_sar = 30000,
  price_sar = 20000,
  discount_label_en = 'Limited Offer',
  discount_label_ar = 'عرض محدود'
WHERE name_en = 'The Annual Legal Partnership' 
   OR name_en = 'Annual Legal Partnership'
   OR name_en = 'Annual Legal Support 1';

-- Package 2: Government Violations Cases (was 25,000, now 15,000)
UPDATE public.service_packages
SET 
  original_price_sar = 25000,
  price_sar = 15000,
  discount_label_en = 'Limited Offer',
  discount_label_ar = 'عرض محدود'
WHERE name_en = 'Government Violations Cases'
   OR name_en = 'Government Violation & Penalty Resolution';

-- Package 3: Problems Technology Cure (was 15,000, now Free)
UPDATE public.service_packages
SET 
  original_price_sar = 15000,
  price_sar = 0,
  discount_label_en = 'Free Until 2026',
  discount_label_ar = 'مجاناً حتى 2026'
WHERE name_en = 'Problems Technology Cure'
   OR name_en = 'The Technology Adoption Solution';

-- Verify the updates
SELECT name_en, name_ar, price_sar, original_price_sar, discount_label_en, discount_label_ar
FROM public.service_packages
WHERE original_price_sar IS NOT NULL;