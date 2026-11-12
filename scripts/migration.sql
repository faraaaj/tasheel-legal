-- Adds popup-only content fields to service_packages so the front card
-- (short, SEO-friendly summary) and the "View Details" popup (full value
-- story, the three-pillar framing, and the itemized cost-comparison for
-- large bundled packages) can finally hold different text instead of the
-- same single description field rendered twice.
alter table public.service_packages
  add column if not exists details_en text,
  add column if not exists details_ar text,
  add column if not exists comparison_en text,
  add column if not exists comparison_ar text;

comment on column public.service_packages.details_en is
  'Extended English popup-only content (replaces the generic "Three Pillars" block, written specifically per package).';
comment on column public.service_packages.details_ar is
  'Extended Arabic popup-only content (replaces the generic "Three Pillars" block, written specifically per package).';
comment on column public.service_packages.comparison_en is
  'English "pay per component vs. one prepaid price" breakdown, shown only on bundled flagship packages that have one.';
comment on column public.service_packages.comparison_ar is
  'Arabic "pay per component vs. one prepaid price" breakdown, shown only on bundled flagship packages that have one.';
