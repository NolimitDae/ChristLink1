-- ════════════════════════════════════════════════════════════
-- CHRIST LINK — Supabase Schema v2.1
-- Run this in your Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ─── PROFILES ───────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  full_name     text,
  bio           text,
  city          text,
  avatar_url    text,
  avatar_color  text,
  role          text not null default 'attendee' check (role in ('attendee','host','admin','verified')),
  instagram_url text,
  facebook_url  text,
  tiktok_url    text,
  banner_url              text,
  bible_verse             text,
  bible_verse_reference   text,
  bible_version           text,
  hot_takes               text,
  hobbies                 text,
  connect_tags            text[],
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Migration: add social links if upgrading from older schema
alter table public.profiles add column if not exists instagram_url text;
alter table public.profiles add column if not exists facebook_url  text;
alter table public.profiles add column if not exists tiktok_url    text;

-- Migration: profile enrichment fields (v2.1+)
alter table public.profiles add column if not exists banner_url            text;
alter table public.profiles add column if not exists bible_verse           text;
alter table public.profiles add column if not exists bible_verse_reference text;
alter table public.profiles add column if not exists bible_version         text;
alter table public.profiles add column if not exists hot_takes             text;
alter table public.profiles add column if not exists hobbies               text;
alter table public.profiles add column if not exists connect_tags          text[];

-- Migration: allow 'verified' role (v2.2+)
-- Drop the old constraint and replace it to include 'verified'
do $$ begin
  alter table public.profiles drop constraint if exists profiles_role_check;
exception when others then null; end $$;
alter table public.profiles add constraint profiles_role_check
  check (role in ('attendee','host','admin','verified'));

alter table public.profiles enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can read all profiles') then
    create policy "Users can read all profiles"  on public.profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Users can insert own profile') then
    create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── HOST STRIPE ACCOUNTS ────────────────────────────────────
create table if not exists public.host_stripe_accounts (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  stripe_account_id   text not null unique,
  onboarding_complete boolean not null default false,
  payouts_enabled     boolean not null default false,
  charges_enabled     boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.host_stripe_accounts enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='host_stripe_accounts' and policyname='Hosts can view own account') then
    create policy "Hosts can view own account" on public.host_stripe_accounts for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='host_stripe_accounts' and policyname='Service role manages accounts') then
    create policy "Service role manages accounts" on public.host_stripe_accounts for all using (true);
  end if;
end $$;

-- ─── EVENTS ─────────────────────────────────────────────────
create table if not exists public.events (
  id                uuid primary key default uuid_generate_v4(),
  host_id           uuid not null references public.profiles(id) on delete cascade,
  name              text not null,
  description       text,
  emoji             text not null default '✝',
  event_type        text,
  age_group         text default 'All Ages',
  format            text not null default 'in_person' check (format in ('in_person','online','hybrid')),
  denomination      text,
  tags              text[],
  is_paid           boolean not null default false,
  absorb_stripe_fee boolean not null default true,
  listing_fee_paid  boolean not null default false,
  listing_payment_id text,
  start_date        timestamptz,
  end_date          timestamptz,
  venue_name        text,
  address           text,
  city              text,
  state             text,
  zip               text,
  online_url        text,
  max_capacity      integer,
  rsvp_count        integer not null default 0,
  forum_enabled     boolean not null default false,
  cover_url         text,
  gallery_urls      text[] default '{}',
  status            text not null default 'draft' check (status in ('draft','published','cancelled','completed')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.events enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='events' and policyname='Anyone can view published events') then
    create policy "Anyone can view published events" on public.events for select using (status = 'published' or auth.uid() = host_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='events' and policyname='Hosts can insert events') then
    create policy "Hosts can insert events" on public.events for insert with check (auth.uid() = host_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='events' and policyname='Hosts can update own events') then
    create policy "Hosts can update own events" on public.events for update using (auth.uid() = host_id);
  end if;
end $$;

-- index for search
create index if not exists events_city_idx  on public.events(city);
create index if not exists events_type_idx  on public.events(event_type);
create index if not exists events_date_idx  on public.events(start_date);
create index if not exists events_status_idx on public.events(status);
create index if not exists events_name_trgm on public.events using gin(name gin_trgm_ops);

-- ─── TICKET TYPES ────────────────────────────────────────────
create table if not exists public.ticket_types (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid not null references public.events(id) on delete cascade,
  name        text not null default 'General Admission',
  description text,
  price_cents integer not null check (price_cents > 0),
  quantity    integer,
  sold        integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.ticket_types enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='ticket_types' and policyname='Anyone can view ticket types') then
    create policy "Anyone can view ticket types" on public.ticket_types for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='ticket_types' and policyname='Service role manages ticket types') then
    create policy "Service role manages ticket types" on public.ticket_types for all using (true);
  end if;
end $$;

-- helper to increment sold count
create or replace function public.increment_tickets_sold(p_ticket_type_id uuid, p_qty integer)
returns void as $$
begin
  update public.ticket_types
  set sold = sold + p_qty
  where id = p_ticket_type_id;
end;
$$ language plpgsql security definer;

-- ─── RSVPS ──────────────────────────────────────────────────
create table if not exists public.rsvps (
  id          uuid primary key default uuid_generate_v4(),
  event_id    uuid not null references public.events(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at  timestamptz not null default now(),
  unique(event_id, user_id)
);

alter table public.rsvps enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='rsvps' and policyname='Users can view own RSVPs') then
    create policy "Users can view own RSVPs" on public.rsvps for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='rsvps' and policyname='Users can RSVP') then
    create policy "Users can RSVP" on public.rsvps for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='rsvps' and policyname='Users can cancel own RSVPs') then
    create policy "Users can cancel own RSVPs" on public.rsvps for update using (auth.uid() = user_id);
  end if;
end $$;

-- ─── TICKETS (paid purchases) ────────────────────────────────
create table if not exists public.tickets (
  id                       uuid primary key default uuid_generate_v4(),
  event_id                 uuid not null references public.events(id) on delete cascade,
  ticket_type_id           uuid references public.ticket_types(id),
  user_id                  uuid not null references public.profiles(id),
  quantity                 integer not null default 1,
  unit_price_cents         integer,
  total_charged_cents      integer,
  platform_fee_cents       integer,
  stripe_fee_cents         integer,
  host_receives_cents      integer,
  stripe_payment_intent    text unique,
  stripe_idempotency_key   text unique,
  buyer_email              text,
  status                   text not null default 'pending' check (status in ('pending','confirmed','failed','refunded','disputed')),
  confirmed_at             timestamptz,
  created_at               timestamptz not null default now()
);

alter table public.tickets enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='tickets' and policyname='Users can view own tickets') then
    create policy "Users can view own tickets" on public.tickets for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='tickets' and policyname='Service role manages tickets') then
    create policy "Service role manages tickets" on public.tickets for all using (true);
  end if;
end $$;

-- ─── EVENTS VIEW (with host info + ticket types) ─────────────
-- NOTE: uses explicit column list so e.* expansion stays stable
-- as columns are added. Always recreate this view after schema changes.
create or replace view public.events_with_details as
select
  e.id, e.host_id, e.name, e.description,
  e.cover_url,          -- canonical column name (was image_url before migration)
  e.gallery_urls,
  e.event_type, e.age_group, e.format, e.denomination, e.tags,
  e.is_paid, e.absorb_stripe_fee,
  e.start_date, e.end_date,
  e.venue_name, e.address, e.city, e.state, e.zip, e.online_url,
  e.max_capacity, e.rsvp_count,
  e.forum_enabled,      -- explicit: was absent when column was added later
  e.status, e.listing_fee_paid, e.listing_payment_id,
  e.created_at, e.updated_at,
  p.full_name    as host_name,
  p.avatar_url   as host_avatar,
  p.avatar_color as host_avatar_color,
  coalesce(
    (select json_agg(t order by t.price_cents asc)
     from public.ticket_types t
     where t.event_id = e.id),
    '[]'::json
  ) as ticket_types,
  (select count(*) from public.rsvps r where r.event_id = e.id and r.status = 'confirmed') as confirmed_rsvps
from public.events e
join public.profiles p on p.id = e.host_id;

-- ─── TICKET CHECK-INS ───────────────────────────────────────
create table if not exists public.ticket_checkins (
  id              uuid primary key default uuid_generate_v4(),
  ticket_id       uuid not null references public.tickets(id) on delete cascade,
  event_id        uuid not null references public.events(id) on delete cascade,
  checked_in_by   uuid not null references public.profiles(id),
  checked_in_at   timestamptz not null default now(),
  unique(ticket_id)   -- one check-in per ticket
);

alter table public.ticket_checkins enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='ticket_checkins' and policyname='Hosts can manage checkins') then
    create policy "Hosts can manage checkins" on public.ticket_checkins for all using (auth.uid() = checked_in_by);
  end if;
end $$;

-- ─── COMMUNITY POSTS ─────────────────────────────────────────
create table if not exists public.community_posts (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  amen_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.community_posts enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='Anyone can read posts') then
    create policy "Anyone can read posts" on public.community_posts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='Users can create posts') then
    create policy "Users can create posts" on public.community_posts for insert with check (auth.uid() = author_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='Authors can delete own posts') then
    create policy "Authors can delete own posts" on public.community_posts for delete using (auth.uid() = author_id);
  end if;
end $$;

-- ─── EVENT FORUM POSTS ───────────────────────────────────────
create table if not exists public.event_forum_posts (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  content      text,
  image_url    text,
  message_type text not null default 'text',
  created_at   timestamptz not null default now()
);

alter table public.event_forum_posts enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='event_forum_posts' and policyname='Authenticated users can read posts') then
    create policy "Authenticated users can read posts" on public.event_forum_posts for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename='event_forum_posts' and policyname='Users insert own posts') then
    create policy "Users insert own posts" on public.event_forum_posts for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='event_forum_posts' and policyname='Users delete own posts') then
    create policy "Users delete own posts" on public.event_forum_posts for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Migration: add forum_enabled to events if upgrading
alter table public.events add column if not exists forum_enabled boolean not null default false;

-- ─── TICKET CODE MIGRATION ───────────────────────────────────────
-- Add short code column to tickets for easy QR scanning + display
alter table public.tickets add column if not exists code text;
-- Backfill existing confirmed tickets with a code derived from payment intent
update public.tickets
set code = upper(substring(replace(stripe_payment_intent, '_', ''), length(replace(stripe_payment_intent, '_', '')) - 7, 8))
where code is null and stripe_payment_intent is not null;
-- For tickets without a payment intent (edge case), use uuid-based code
update public.tickets
set code = upper(substring(replace(id::text, '-', ''), 1, 8))
where code is null;

-- Storage policies for event-images bucket (run after creating bucket in Supabase dashboard)
-- insert into storage.policies (name, bucket_id, definition) values
-- ('allow_authenticated_uploads', 'event-images', '(auth.role() = ''authenticated'')');

-- ─── EVENT IMAGES STORAGE ──────────────────────────────────────
-- Create bucket: event-images, Public: ON, File size: 5MB
-- Allowed MIME: image/jpeg, image/png, image/webp

-- ─── AVATARS STORAGE ─────────────────────────────────────────
-- Run in Storage > New bucket:
-- Bucket name: avatars
-- Public: ON
-- File size limit: 2MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage policy (run after creating bucket):
-- insert into storage.policies (name, bucket_id, definition) values
-- ('allow_authenticated_uploads', 'avatars', '(auth.role() = ''authenticated'')');

-- ─── MIGRATIONS (run these in Supabase SQL Editor if upgrading) ──────────────

-- 1. Rename image_url → cover_url (skip if running schema fresh — table already uses cover_url)
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'image_url'
  ) then
    alter table public.events rename column image_url to cover_url;
  end if;
end $$;

-- 2. Recreate events_with_details view with explicit column list so
--    forum_enabled and cover_url are always present (run after rename above).
create or replace view public.events_with_details as
select
  e.id, e.host_id, e.name, e.description,
  e.cover_url, e.gallery_urls,
  e.event_type, e.age_group, e.format, e.denomination, e.tags,
  e.is_paid, e.absorb_stripe_fee,
  e.start_date, e.end_date,
  e.venue_name, e.address, e.city, e.state, e.zip, e.online_url,
  e.max_capacity, e.forum_enabled,
  e.status, e.listing_fee_paid, e.listing_payment_id,
  e.created_at, e.updated_at,
  p.full_name    as host_name,
  p.avatar_url   as host_avatar,
  p.avatar_color as host_avatar_color,
  coalesce(
    (select json_agg(t order by t.price_cents asc)
     from public.ticket_types t where t.event_id = e.id),
    '[]'::json
  ) as ticket_types,
  (select count(*) from public.rsvps r
   where r.event_id = e.id and r.status = 'confirmed') as confirmed_rsvps
from public.events e
join public.profiles p on p.id = e.host_id;

-- 3. Create event_forum_posts table if not already created
create table if not exists public.event_forum_posts (
  id         uuid primary key default uuid_generate_v4(),
  event_id   uuid not null references public.events(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
alter table public.event_forum_posts enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='event_forum_posts' and policyname='Anyone can read forum posts') then
    create policy "Anyone can read forum posts" on public.event_forum_posts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='event_forum_posts' and policyname='Authenticated users can post') then
    create policy "Authenticated users can post" on public.event_forum_posts for insert with check (auth.uid() = author_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='event_forum_posts' and policyname='Authors can delete own forum posts') then
    create policy "Authors can delete own forum posts" on public.event_forum_posts for delete using (auth.uid() = author_id);
  end if;
end $$;

-- 4. Forum backfill — enable forum on all published events (one-time, idempotent)
update public.events set forum_enabled = true
where status = 'published' and forum_enabled = false;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 5: COMMUNITY REPLIES
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

-- 5a. Community replies table
create table if not exists public.community_replies (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid not null references public.community_posts(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null check (char_length(body) <= 500),
  amen_count  integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.community_replies enable row level security;

-- 5b. RLS policies for community_replies
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_replies' and policyname='Anyone can read replies') then
    create policy "Anyone can read replies" on public.community_replies for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='community_replies' and policyname='Authenticated users can post replies') then
    create policy "Authenticated users can post replies" on public.community_replies for insert with check (auth.uid() = author_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='community_replies' and policyname='Authors can delete own replies') then
    create policy "Authors can delete own replies" on public.community_replies for delete using (auth.uid() = author_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='community_replies' and policyname='Authors can update own replies') then
    create policy "Authors can update own replies" on public.community_replies for update using (auth.uid() = author_id);
  end if;
end $$;

-- 5c. Indexes
create index if not exists replies_post_id_idx on public.community_replies(post_id);
create index if not exists replies_created_idx on public.community_replies(created_at);

-- 5d. Add reply_count to community_posts
alter table public.community_posts add column if not exists reply_count integer not null default 0;
update public.community_posts set reply_count = 0 where reply_count is null;

-- 5e. Atomic increment/decrement function
create or replace function public.increment_reply_count(p_post_id uuid, p_delta integer)
returns void as $$
begin
  update public.community_posts
  set reply_count = greatest(0, reply_count + p_delta)
  where id = p_post_id;
end;
$$ language plpgsql security definer;


-- ════════════════════════════════════════════════════════════
-- MIGRATION v2.2 — Missing tables, columns, indexes & views
-- ════════════════════════════════════════════════════════════

-- ─── EVENTS: missing columns ────────────────────────────────
alter table public.events add column if not exists lat        double precision;
alter table public.events add column if not exists lng        double precision;
alter table public.events add column if not exists publish_at timestamptz;

create index if not exists events_lat_lng_idx    on public.events(lat, lng) where lat is not null;
create index if not exists events_host_id_idx    on public.events(host_id);
create index if not exists events_publish_at_idx on public.events(publish_at) where publish_at is not null;

-- ─── COUPONS TABLE ──────────────────────────────────────────
create table if not exists public.coupons (
  id              uuid primary key default uuid_generate_v4(),
  event_id        uuid not null references public.events(id) on delete cascade,
  host_id         uuid not null references public.profiles(id) on delete cascade,
  code            text not null,
  discount_type   text not null check (discount_type in ('percent', 'amount')),
  discount_value  numeric not null,
  max_uses        integer,
  uses            integer not null default 0,
  active          boolean not null default true,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists coupons_event_id_idx   on public.coupons(event_id);
create index if not exists coupons_code_event_idx on public.coupons(code, event_id);

alter table public.coupons enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='coupons' and policyname='Hosts can manage own coupons') then
    create policy "Hosts can manage own coupons" on public.coupons for all using (auth.uid() = host_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='coupons' and policyname='Service role manages coupons') then
    create policy "Service role manages coupons" on public.coupons for all using (true);
  end if;
end $$;

-- ─── TICKETS: missing columns for coupons ───────────────────
alter table public.tickets add column if not exists coupon_id      uuid references public.coupons(id) on delete set null;
alter table public.tickets add column if not exists discount_cents integer not null default 0;

-- ─── MISSING INDEXES ────────────────────────────────────────
create index if not exists tickets_user_id_idx         on public.tickets(user_id);
create index if not exists tickets_event_id_idx        on public.tickets(event_id);
create index if not exists tickets_status_event_idx    on public.tickets(status, event_id);
create index if not exists rsvps_user_id_idx           on public.rsvps(user_id);
create index if not exists rsvps_event_status_idx      on public.rsvps(event_id, status);
create index if not exists ticket_checkins_event_idx   on public.ticket_checkins(event_id);

-- ─── increment_coupon_uses RPC ───────────────────────────────
create or replace function public.increment_coupon_uses(p_coupon_id uuid)
returns void as $$
begin
  update public.coupons set uses = uses + 1 where id = p_coupon_id;
end;
$$ language plpgsql security definer;

-- ─── UPDATE events_with_details VIEW (add lat/lng/publish_at) ─
create or replace view public.events_with_details as
select
  e.id, e.host_id, e.name, e.description,
  e.cover_url,
  e.gallery_urls,
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
    (select json_agg(t order by t.price_cents asc)
     from public.ticket_types t
     where t.event_id = e.id),
    '[]'::json
  ) as ticket_types,
  (select count(*) from public.rsvps r where r.event_id = e.id and r.status = 'confirmed') as confirmed_rsvps
from public.events e
join public.profiles p on p.id = e.host_id;

-- ─── ADMIN ANALYTICS VIEWS ──────────────────────────────────
create or replace view public.admin_overview as
select
  (select count(*) from public.profiles)                                               as total_users,
  (select count(*) from public.events where status = 'published')                      as published_events,
  (select count(*) from public.events)                                                  as total_events,
  (select coalesce(sum(total_charged_cents),0) from public.tickets where status='confirmed') as total_revenue_cents,
  (select count(*) from public.tickets where status = 'confirmed')                     as total_tickets_sold,
  (select count(*) from public.rsvps   where status = 'confirmed')                     as total_rsvps;

create or replace view public.admin_daily_signups as
select date_trunc('day', created_at)::date as day, count(*) as signups
from public.profiles group by 1 order by 1 desc;

create or replace view public.admin_daily_revenue as
select
  date_trunc('day', created_at)::date as day,
  count(*)                            as tickets_sold,
  sum(total_charged_cents)            as revenue_cents,
  sum(platform_fee_cents)             as platform_fee_cents
from public.tickets where status = 'confirmed'
group by 1 order by 1 desc;

create or replace view public.admin_events_by_type as
select event_type,
  count(*) as total,
  count(*) filter (where status='published') as published
from public.events group by 1 order by 2 desc;

create or replace view public.admin_top_events as
select e.id, e.name, e.city, e.state, e.start_date,
  count(t.id) filter (where t.status='confirmed') as tickets_sold,
  coalesce(sum(t.total_charged_cents) filter (where t.status='confirmed'),0) as revenue_cents
from public.events e
left join public.tickets t on t.event_id = e.id
group by e.id, e.name, e.city, e.state, e.start_date
order by tickets_sold desc limit 50;

create or replace view public.admin_top_hosts as
select p.id, p.full_name, p.email,
  count(distinct e.id) as events_created,
  count(t.id) filter (where t.status='confirmed') as tickets_sold,
  coalesce(sum(t.host_receives_cents) filter (where t.status='confirmed'),0) as host_revenue_cents
from public.profiles p
left join public.events  e on e.host_id = p.id
left join public.tickets t on t.event_id = e.id
group by p.id, p.full_name, p.email
order by tickets_sold desc limit 50;

-- ─── WEBHOOK IDEMPOTENCY TABLE ───────────────────────────────
create table if not exists public.webhook_events (
  id              uuid primary key default uuid_generate_v4(),
  stripe_event_id text not null unique,
  event_type      text not null,
  created_at      timestamptz not null default now()
);
create index if not exists webhook_events_created_idx on public.webhook_events(created_at);
-- Auto-purge rows older than 30 days to prevent unbounded growth
-- (Run as a Supabase scheduled job or pg_cron task)
-- delete from public.webhook_events where created_at < now() - interval '30 days';

-- ─── REFUND REQUESTS ─────────────────────────────────────────
create table if not exists public.refund_requests (
  id            uuid primary key default uuid_generate_v4(),
  ticket_id     uuid not null references public.tickets(id) on delete cascade,
  event_id      uuid not null references public.events(id)  on delete cascade,
  requester_id  uuid not null references public.profiles(id) on delete cascade,
  host_id       uuid not null references public.profiles(id) on delete cascade,
  reason        text,
  status        text not null default 'pending' check (status in ('pending','approved','denied')),
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz,
  unique(ticket_id)  -- one open request per ticket
);
create index if not exists refund_requests_host_idx   on public.refund_requests(host_id, status);
create index if not exists refund_requests_ticket_idx on public.refund_requests(ticket_id);

alter table public.refund_requests enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='refund_requests' and policyname='Service role manages refund_requests') then
    create policy "Service role manages refund_requests" on public.refund_requests for all using (true);
  end if;
end $$;

-- ─── NOTIFICATIONS ───────────────────────────────────────────
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text,
  data        jsonb,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists notifications_user_read_idx on public.notifications(user_id, read, created_at desc);

alter table public.notifications enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='notifications' and policyname='Service role manages notifications') then
    create policy "Service role manages notifications" on public.notifications for all using (true);
  end if;
end $$;

-- ─── USER FOLLOWS (FOLLOW SYSTEM v2.2) ───────────────────────
create table if not exists public.user_follows (
  id            uuid primary key default uuid_generate_v4(),
  follower_id   uuid not null references public.profiles(id) on delete cascade,
  following_id  uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique(follower_id, following_id)
);

create index if not exists follows_follower_idx  on public.user_follows(follower_id);
create index if not exists follows_following_idx on public.user_follows(following_id);

alter table public.user_follows enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='user_follows' and policyname='Anyone can view follows') then
    create policy "Anyone can view follows" on public.user_follows for select using (true);
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='user_follows' and policyname='Service role manages follows') then
    create policy "Service role manages follows" on public.user_follows for all using (true);
  end if;
end $$;
