-- Adds the extra intake fields now required at registration
-- (nationality, address, city — city is auto-detected from the
-- visitor's IP on the registration form, but stored as plain text so
-- it can be corrected), plus email_verified / phone_verified flags
-- driven by Authentica OTP checks (independent of Supabase's own
-- email-confirmation flag, which is now always set true at creation
-- time since Authentica does the real verification).
-- Safe to re-run: every column uses IF NOT EXISTS.
alter table profiles
  add column if not exists nationality text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists email_verified boolean not null default false,
  add column if not exists phone_verified boolean not null default false;
