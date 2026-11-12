-- Auto-create a public.profiles row for every new auth user.
--
-- Why: profiles rows were only created by /api/auth/register. Any user
-- created directly in the Supabase Dashboard, via the Admin API, or by
-- deleting and re-creating an account ended up with no profiles row, so
-- login failed with "Could not verify account status" (the profiles
-- query returned 0 rows and .single() raised PGRST116).
--
-- The trigger is safe alongside /api/auth/register because that route now
-- upserts the profile after createUser() instead of inserting it.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    phone,
    role,
    is_approved,
    email_verified,
    phone_verified
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    'client',
    false,
    false,
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: create a default profile for any existing auth user that is
-- missing one. Existing rows (including promoted admins) are untouched.
insert into public.profiles (
  id,
  full_name,
  phone,
  role,
  is_approved,
  email_verified,
  phone_verified
)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  u.raw_user_meta_data ->> 'phone',
  'client',
  false,
  false,
  false
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
