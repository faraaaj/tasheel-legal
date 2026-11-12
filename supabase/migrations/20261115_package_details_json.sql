-- Structured package details for the popup (headings + check-bulleted items).
--
-- Run this in the Supabase Dashboard -> SQL Editor.
alter table public.service_packages
  add column if not exists details_json_en jsonb,
  add column if not exists details_json_ar jsonb;
