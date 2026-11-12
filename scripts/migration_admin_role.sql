-- Adds a simple role column for the admin panel. Only one role matters
-- right now: 'admin' (you). Everyone else defaults to 'client'. Safe to
-- re-run.
alter table profiles
  add column if not exists role text not null default 'client';

-- Run this once, replacing the email, to make your own account an admin:
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');
