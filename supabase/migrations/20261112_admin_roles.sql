-- Admin roles: widen the profiles.role check constraint so the five admin
-- tiers can be stored. Run this in the Supabase Dashboard → SQL Editor.
--
-- Apply order matters if you are promoting an account to superadmin:
-- run this first, then update the profile role.

alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (
    role in (
      'client',
      'superadmin',
      'admin',
      'marketing_admin',
      'support_admin',
      'freelancer_admin'
    )
  );

-- Example: promote the owner account to superadmin.
-- update public.profiles p
-- set role = 'superadmin', is_approved = true, updated_at = now()
-- from auth.users u
-- where u.id = p.id and u.email = 'faraaaj@gmail.com';
