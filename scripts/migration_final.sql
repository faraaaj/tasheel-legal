-- Single consolidated migration. Safe to run even if some columns already exist.
alter table public.service_packages
  add column if not exists details_en text,
  add column if not exists details_ar text,
  add column if not exists outcomes_en text[],
  add column if not exists outcomes_ar text[];

comment on column public.service_packages.details_en is
  'English popup-only "Why Tasheel" value paragraph, written per package. Includes plain-language pricing/bundle rationale where relevant.';
comment on column public.service_packages.details_ar is
  'Arabic popup-only "Why Tasheel" value paragraph, written per package. Includes plain-language pricing/bundle rationale where relevant.';
comment on column public.service_packages.outcomes_en is
  'English bullet list of concrete outcomes/deliverables, shown in the popup before the price.';
comment on column public.service_packages.outcomes_ar is
  'Arabic bullet list of concrete outcomes/deliverables, shown in the popup before the price.';
