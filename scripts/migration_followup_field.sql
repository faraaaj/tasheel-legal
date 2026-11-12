-- Tracks whether an automated 48h follow-up reminder has been sent to a
-- user who registered but never finished email+phone OTP verification.
-- Safe to re-run.
alter table profiles
  add column if not exists followup_sent_at timestamptz;
