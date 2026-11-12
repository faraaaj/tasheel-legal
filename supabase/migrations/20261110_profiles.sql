-- Phase 1A: Tasheel Marketplace — User Profiles table
-- Run this in the Supabase Dashboard → SQL Editor → New Query → Run

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'client' check (role in ('client', 'admin')),
  is_approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
