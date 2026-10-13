-- ════════════════════════════════════════════════════════════
-- MIGRATION 001 — SECURITY LOCKDOWN
-- Run in Supabase SQL Editor BEFORE deploying the matching server.js.
--
-- Why: the browser ships the public anon key, and several RLS policies
-- used `using (true)` (which applies to EVERY role, not just the service
-- role). With the anon key anyone could:
--   • rewrite host_stripe_accounts.stripe_account_id (hijack payouts)
--   • read/insert/update tickets (free "confirmed" tickets, buyer PII)
--   • change ticket_types prices, mint listing promo codes
--   • set their own profiles.role = 'admin'
--   • read every user's email from profiles / admin_* views
--   • call security-definer RPCs (increment_tickets_sold, ...)
--
-- Model after this migration: ALL reads and writes go through server.js
-- (service role, which bypasses RLS). The browser only uses Supabase for
-- Auth plus the realtime feed on community_posts.
-- ════════════════════════════════════════════════════════════

-- 1. Drop every client-facing policy in public, except the one the
--    realtime community feed needs.
do $$
declare r record;
begin
  for r in
    select tablename, policyname from pg_policies
    where schemaname = 'public'
      and not (tablename = 'community_posts' and policyname = 'Anyone can read posts')
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Ensure the realtime feed policy exists (read-only)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_posts' and policyname='Anyone can read posts') then
    create policy "Anyone can read posts" on public.community_posts for select using (true);
  end if;
end $$;

-- 2. Make sure RLS is ON for every table in public (no policy = deny for anon/authenticated)
do $$
declare r record;
begin
  for r in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind = 'r'
  loop
    execute format('alter table public.%I enable row level security', r.relname);
  end loop;
end $$;

-- 3. Views run with the owner's rights by default, bypassing RLS.
--    Switch them to invoker rights and remove client access entirely.
do $$
declare r record;
begin
  for r in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind = 'v'
  loop
    execute format('alter view public.%I set (security_invoker = true)', r.relname);
    execute format('revoke all on public.%I from anon, authenticated', r.relname);
    execute format('grant select on public.%I to service_role', r.relname);
  end loop;
end $$;

-- 4. Security-definer RPCs are callable by anyone through PostgREST.
--    Restrict them to the service role.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as sig from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', r.sig);
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;
end $$;

-- 5. Storage: uploads go through server.js (which validates file type).
--    Remove direct client write access; keep public reads for public buckets.
drop policy if exists "avatars upload"                    on storage.objects;
drop policy if exists "avatars update"                    on storage.objects;
drop policy if exists "avatars delete"                    on storage.objects;
drop policy if exists "event-images upload"               on storage.objects;
drop policy if exists "Users can upload their own banners" on storage.objects;
drop policy if exists "Users can update their own banners" on storage.objects;

-- 6. Defence in depth: privileged profile columns can only change via the service role,
--    even if someone re-adds a permissive update policy later.
create or replace function public.guard_profile_privileged_columns()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), 'service_role') <> 'service_role' then
    if new.role is distinct from old.role
       or new.identity_verified is distinct from old.identity_verified
       or new.identity_verified_at is distinct from old.identity_verified_at
       or new.email is distinct from old.email then
      raise exception 'Not allowed to change privileged profile fields';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists profiles_guard_privileged on public.profiles;
create trigger profiles_guard_privileged before update on public.profiles
  for each row execute function public.guard_profile_privileged_columns();

-- Same idea for events: fee/payment columns are service-role only.
create or replace function public.guard_event_privileged_columns()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(), 'service_role') <> 'service_role' then
    if new.listing_fee_paid is distinct from old.listing_fee_paid
       or new.listing_payment_id is distinct from old.listing_payment_id
       or new.host_id is distinct from old.host_id then
      raise exception 'Not allowed to change privileged event fields';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists events_guard_privileged on public.events;
create trigger events_guard_privileged before update on public.events
  for each row execute function public.guard_event_privileged_columns();
