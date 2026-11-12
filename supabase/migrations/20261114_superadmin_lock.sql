-- SuperAdmin account protection (bulletproof lock).
--
-- Run this in the Supabase Dashboard -> SQL Editor.
--
-- Prevents the SuperAdmin profile from being deleted or having its role
-- changed. These triggers fire at the database level, so they also protect
-- against direct edits via the Supabase dashboard / SQL editor.
--
-- OTP-gated self-service edits are handled separately at the API/UI layer.

create or replace function public.protect_superadmin_delete()
returns trigger
language plpgsql
as $$
begin
  if old.role = 'superadmin' then
    raise exception 'Cannot delete the SuperAdmin account.';
  end if;
  return old;
end;
$$;

drop trigger if exists prevent_superadmin_delete on public.profiles;
create trigger prevent_superadmin_delete
  before delete on public.profiles
  for each row execute function public.protect_superadmin_delete();

create or replace function public.protect_superadmin_role_change()
returns trigger
language plpgsql
as $$
begin
  if old.role = 'superadmin' and new.role is distinct from old.role then
    raise exception 'Cannot change the role of the SuperAdmin account.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_superadmin_role_change on public.profiles;
create trigger prevent_superadmin_role_change
  before update of role on public.profiles
  for each row execute function public.protect_superadmin_role_change();

-- Backfill: make sure the known SuperAdmin is marked approved and locked in.
update public.profiles
set is_approved = true,
    verification_status = 'approved'
where role = 'superadmin';