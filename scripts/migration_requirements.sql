-- Idempotent migration: add requirements_en/ar columns for the "What we need
-- from you" popup section. Safe to re-run.
alter table service_packages
  add column if not exists requirements_en text[],
  add column if not exists requirements_ar text[];
