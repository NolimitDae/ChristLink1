-- ════════════════════════════════════════════════════════════
-- MIGRATION 002 — EVENT FEATURES
-- Waitlists, approval-required guest lists, promoter links,
-- ticket sales windows, host messaging, page-view analytics.
-- Run AFTER 001_security_lockdown.sql and BEFORE deploying server.js.
-- ════════════════════════════════════════════════════════════

-- ─── EVENTS ─────────────────────────────────────────────────
alter table public.events add column if not exists requires_approval boolean not null default false;
alter table public.events add column if not exists view_count        integer not null default 0;
alter table public.events add column if not exists sales_cutoff      timestamptz;

-- ─── RSVPS: approval + attribution ──────────────────────────
-- Replace the status check so RSVPs can be pending (awaiting host) or declined.
do $$
declare r record;
begin
  for r in select conname from pg_constraint
           where conrelid = 'public.rsvps'::regclass and contype = 'c'
             and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.rsvps drop constraint %I', r.conname);
  end loop;
end $$;
alter table public.rsvps add constraint rsvps_status_check
  check (status in ('confirmed','cancelled','pending','declined'));

alter table public.rsvps add column if not exists promoter_id uuid;
alter table public.rsvps add column if not exists note        text;
alter table public.rsvps add column if not exists updated_at  timestamptz not null default now();

-- ─── TICKET TYPES: sales windows ─────────────────────────────
alter table public.ticket_types add column if not exists sales_start timestamptz;
alter table public.ticket_types add column if not exists sales_end   timestamptz;
alter table public.ticket_types add column if not exists sort_order  integer not null default 0;

-- ─── PROMOTERS / REFERRAL LINKS ──────────────────────────────
create table if not exists public.event_promoters (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid not null references public.events(id) on delete cascade,
  code        text not null,
  label       text not null,
  user_id     uuid references public.profiles(id) on delete set null,
  clicks      integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (event_id, code)
);
create index if not exists event_promoters_event_idx on public.event_promoters(event_id);
alter table public.event_promoters enable row level security;

alter table public.tickets add column if not exists promoter_id uuid references public.event_promoters(id) on delete set null;
do $$ begin
  alter table public.rsvps add constraint rsvps_promoter_fk
    foreign key (promoter_id) references public.event_promoters(id) on delete set null;
exception when duplicate_object then null; end $$;

-- ─── WAITLIST ────────────────────────────────────────────────
create table if not exists public.event_waitlist (
  id           uuid primary key default uuid_generate_v4(),
  event_id     uuid not null references public.events(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  notified_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (event_id, user_id)
);
create index if not exists event_waitlist_event_idx on public.event_waitlist(event_id, created_at);
alter table public.event_waitlist enable row level security;

-- ─── HOST MESSAGES (blast log) ───────────────────────────────
create table if not exists public.event_messages (
  id               uuid primary key default uuid_generate_v4(),
  event_id         uuid not null references public.events(id) on delete cascade,
  host_id          uuid not null references public.profiles(id) on delete cascade,
  subject          text not null,
  body             text not null,
  audience         text not null default 'going' check (audience in ('going','waitlist','all')),
  recipients_count integer not null default 0,
  created_at       timestamptz not null default now()
);
create index if not exists event_messages_event_idx on public.event_messages(event_id, created_at desc);
alter table public.event_messages enable row level security;

-- ─── ATOMIC HELPERS (service role only) ──────────────────────

-- Capacity-safe RSVP. Locks the event row so two people can't take the last spot.
-- Returns: 'confirmed' | 'pending' | 'full' | 'declined' | 'closed'
create or replace function public.claim_rsvp(
  p_event_id uuid, p_user_id uuid, p_promoter_id uuid default null
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_ev       record;
  v_existing text;
  v_taken    integer;
  v_status   text;
begin
  select id, max_capacity, requires_approval, status
    into v_ev from events where id = p_event_id for update;
  if v_ev.id is null or v_ev.status <> 'published' then return 'closed'; end if;

  select status into v_existing from rsvps where event_id = p_event_id and user_id = p_user_id;
  if v_existing in ('confirmed','pending','declined') then return v_existing; end if;

  v_status := case when v_ev.requires_approval then 'pending' else 'confirmed' end;

  if v_status = 'confirmed' and v_ev.max_capacity is not null then
    select (select count(*) from rsvps where event_id = p_event_id and status = 'confirmed')
         + coalesce((select sum(quantity) from tickets where event_id = p_event_id and status = 'confirmed'), 0)
      into v_taken;
    if v_taken >= v_ev.max_capacity then return 'full'; end if;
  end if;

  insert into rsvps (event_id, user_id, status, promoter_id, updated_at)
  values (p_event_id, p_user_id, v_status, p_promoter_id, now())
  on conflict (event_id, user_id) do update
    set status      = excluded.status,
        promoter_id = coalesce(rsvps.promoter_id, excluded.promoter_id),
        updated_at  = now();

  delete from event_waitlist where event_id = p_event_id and user_id = p_user_id;
  return v_status;
end $$;

-- Host approves a pending RSVP, respecting capacity. Returns 'confirmed' | 'full' | 'not_pending'
create or replace function public.approve_rsvp(p_rsvp_id uuid)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_r     record;
  v_cap   integer;
  v_taken integer;
begin
  select * into v_r from rsvps where id = p_rsvp_id;
  if v_r.id is null or v_r.status <> 'pending' then return 'not_pending'; end if;
  select max_capacity into v_cap from events where id = v_r.event_id for update;
  if v_cap is not null then
    select (select count(*) from rsvps where event_id = v_r.event_id and status = 'confirmed')
         + coalesce((select sum(quantity) from tickets where event_id = v_r.event_id and status = 'confirmed'), 0)
      into v_taken;
    if v_taken >= v_cap then return 'full'; end if;
  end if;
  update rsvps set status = 'confirmed', updated_at = now() where id = p_rsvp_id;
  return 'confirmed';
end $$;

create or replace function public.increment_event_views(p_event_id uuid)
returns void language sql security definer set search_path = public as $$
  update events set view_count = view_count + 1 where id = p_event_id;
$$;

create or replace function public.increment_promoter_clicks(p_promoter_id uuid)
returns void language sql security definer set search_path = public as $$
  update event_promoters set clicks = clicks + 1 where id = p_promoter_id;
$$;

-- Never allow sold to drift below zero (refunds call this with negative qty).
create or replace function public.increment_tickets_sold(p_ticket_type_id uuid, p_qty integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update ticket_types set sold = greatest(0, sold + p_qty) where id = p_ticket_type_id;
end $$;

do $$
declare f text;
begin
  foreach f in array array[
    'public.claim_rsvp(uuid,uuid,uuid)',
    'public.approve_rsvp(uuid)',
    'public.increment_event_views(uuid)',
    'public.increment_promoter_clicks(uuid)',
    'public.increment_tickets_sold(uuid,integer)'
  ] loop
    execute format('revoke execute on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;

-- ─── REFRESH events_with_details (adds requires_approval, view_count, sales_cutoff) ─
drop view if exists public.events_with_details;
create view public.events_with_details
with (security_invoker = true) as
select
  e.id, e.host_id, e.name, e.description,
  e.cover_url, e.gallery_urls,
  e.event_type, e.age_group, e.format, e.denomination, e.tags,
  e.is_paid, e.absorb_stripe_fee,
  e.start_date, e.end_date,
  e.venue_name, e.address, e.city, e.state, e.zip, e.online_url,
  e.max_capacity, e.rsvp_count,
  e.forum_enabled,
  e.status, e.listing_fee_paid, e.listing_payment_id,
  e.lat, e.lng,
  e.publish_at,
  e.created_at, e.updated_at,
  p.full_name    as host_name,
  p.avatar_url   as host_avatar,
  p.avatar_color as host_avatar_color,
  coalesce(
    (select json_agg(t order by t.sort_order asc, t.price_cents asc)
     from public.ticket_types t
     where t.event_id = e.id),
    '[]'::json
  ) as ticket_types,
  (select count(*) from public.rsvps r where r.event_id = e.id and r.status = 'confirmed') as confirmed_rsvps,
  e.requires_approval,
  e.view_count,
  e.sales_cutoff
from public.events e
join public.profiles p on p.id = e.host_id;

revoke all on public.events_with_details from anon, authenticated;
grant select on public.events_with_details to service_role;
