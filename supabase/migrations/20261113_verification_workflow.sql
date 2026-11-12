-- Advanced user verification & approval workflow.
--
-- Run this in the Supabase Dashboard -> SQL Editor before using the new
-- admin actions (Request Statement / AI Research / Reject emails).
--
-- Adds analytics captured at registration, the gated problem-statement token,
-- AI research results, and an explicit verification status so "rejected" is
-- distinguishable from "pending".

alter table public.profiles
  add column if not exists registration_ip text,
  add column if not exists registration_country text,
  add column if not exists registration_country_code text,
  add column if not exists registration_city text,
  add column if not exists registration_isp text,
  add column if not exists referrer text,
  add column if not exists device_fingerprint jsonb,
  add column if not exists problem_statement text,
  add column if not exists statement_submitted_at timestamptz,
  add column if not exists verification_token text unique,
  add column if not exists token_expires_at timestamptz,
  add column if not exists verification_status text default 'pending',
  add column if not exists rejection_reason text,
  add column if not exists ai_research_score integer,
  add column if not exists ai_research_summary text,
  add column if not exists ai_researched_at timestamptz,
  add column if not exists linkedin_url text;

-- Backfill existing rows so approved accounts are not shown as pending.
update public.profiles
set verification_status = 'approved'
where is_approved = true;

update public.profiles
set verification_status = 'pending'
where verification_status is null;

create index if not exists profiles_verification_status_idx
  on public.profiles (verification_status);

-- Optional: keep verification_status in sync whenever is_approved flips
-- through a path that does not go through the admin API.
create or replace function public.sync_verification_status()
returns trigger
language plpgsql
as $$
begin
  if new.is_approved is distinct from old.is_approved then
    if new.is_approved then
      new.verification_status := 'approved';
    elsif new.verification_status = 'approved' then
      new.verification_status := 'pending';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_verification_status on public.profiles;
create trigger sync_verification_status
  before update of is_approved on public.profiles
  for each row execute function public.sync_verification_status();
