alter table public.service_packages
  add column if not exists outcomes_en text[],
  add column if not exists outcomes_ar text[];

comment on column public.service_packages.outcomes_en is
  'English bullet list of concrete outcomes/deliverables, shown in the popup before the price, per package.';
comment on column public.service_packages.outcomes_ar is
  'Arabic bullet list of concrete outcomes/deliverables, shown in the popup before the price, per package.';
