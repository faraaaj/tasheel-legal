-- Phase 1: Tasheel Marketplace — Service Packages table
-- Run this in the Supabase Dashboard → SQL Editor → New Query → Run

create extension if not exists "pgcrypto";

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  price_sar numeric not null check (price_sar >= 0),
  validity_days int not null default 30,
  max_seats int not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_service_packages_active
  on public.service_packages (active)
  where active;

-- Optional: seed an initial package for testing
-- insert into public.service_packages (name_en, name_ar, description_en, description_ar, price_sar, validity_days, max_seats, active)
-- values
--   ('Strategic Legal Health Check', 'فحص استشاري قانوني استراتيجي', '...', '...', 5000, 30, 1, true);
