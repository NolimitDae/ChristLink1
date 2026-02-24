-- ============================================================
-- CHRIST LINK — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text unique not null,
  full_name     text,
  avatar_url    text,
  bio           text,
  city          text,
  role          text default 'attendee' check (role in ('attendee', 'host', 'admin')),
  stripe_customer_id text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- EVENTS
-- ============================================================
create table public.events (
  id                  uuid default uuid_generate_v4() primary key,
  host_id             uuid references public.profiles(id) on delete cascade not null,
  name                text not null,
  description         text,
  emoji               text default '✝',
  event_type          text,
  age_group           text default 'All Ages',
  format              text default 'in_person' check (format in ('in_person','online','hybrid')),
  denomination        text,
  tags                text[],
  is_paid             boolean default false,
  listing_fee_paid    boolean default false,
  listing_payment_id  text,          -- Stripe PaymentIntent ID
  absorb_stripe_fee   boolean default true,
  start_date          timestamptz,
  end_date            timestamptz,
  venue_name          text,
  address             text,
  city                text,
  state               text,
  zip                 text,
  online_url          text,
  max_capacity        integer,
  status              text default 'draft' check (status in ('draft','published','cancelled','completed')),
  image_url           text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ============================================================
-- TICKET TYPES (per event)
-- ============================================================
create table public.ticket_types (
  id            uuid default uuid_generate_v4() primary key,
  event_id      uuid references public.events(id) on delete cascade not null,
  name          text not null default 'General Admission',
  price_cents   integer not null default 0,  -- 0 = free
  quantity      integer,                      -- null = unlimited
  sold          integer default 0,
  created_at    timestamptz default now()
);

-- ============================================================
-- RSVPS (free events)
-- ============================================================
create table public.rsvps (
  id            uuid default uuid_generate_v4() primary key,
  event_id      uuid references public.events(id) on delete cascade not null,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  status        text default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at    timestamptz default now(),
  unique(event_id, user_id)
);

-- ============================================================
-- TICKETS (paid events — one row per purchased ticket)
-- ============================================================
create table public.tickets (
  id                    uuid default uuid_generate_v4() primary key,
  event_id              uuid references public.events(id) on delete cascade not null,
  ticket_type_id        uuid references public.ticket_types(id) not null,
  user_id               uuid references public.profiles(id) on delete cascade not null,
  quantity              integer not null default 1,
  unit_price_cents      integer not null,
  total_charged_cents   integer not null,
  platform_fee_cents    integer not null,
  stripe_fee_cents      integer not null,
  host_receives_cents   integer not null,
  stripe_payment_intent text unique not null,
  stripe_idempotency_key text unique,
  status                text default 'pending' check (status in ('pending','confirmed','refunded','failed')),
  buyer_email           text,
  created_at            timestamptz default now(),
  confirmed_at          timestamptz
);

-- ============================================================
-- HOST STRIPE CONNECT ACCOUNTS
-- ============================================================
create table public.host_stripe_accounts (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references public.profiles(id) on delete cascade not null unique,
  stripe_account_id text unique not null,  -- acct_...
  onboarding_complete boolean default false,
  payouts_enabled   boolean default false,
  charges_enabled   boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ============================================================
-- RATE LIMITING TABLE (simple request tracking)
-- ============================================================
create table public.rate_limits (
  id          uuid default uuid_generate_v4() primary key,
  identifier  text not null,  -- IP or user_id
  action      text not null,  -- 'payment', 'rsvp', 'signup'
  created_at  timestamptz default now()
);
create index idx_rate_limits_lookup on public.rate_limits(identifier, action, created_at);

-- Auto-clean old rate limit records (keep last 24h only)
create or replace function clean_old_rate_limits() returns void as $$
  delete from public.rate_limits where created_at < now() - interval '24 hours';
$$ language sql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles           enable row level security;
alter table public.events             enable row level security;
alter table public.ticket_types       enable row level security;
alter table public.rsvps              enable row level security;
alter table public.tickets            enable row level security;
alter table public.host_stripe_accounts enable row level security;
alter table public.rate_limits        enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- EVENTS
create policy "Published events viewable by everyone"
  on public.events for select using (status = 'published' or host_id = auth.uid());
create policy "Hosts can insert events"
  on public.events for insert with check (auth.uid() = host_id);
create policy "Hosts can update own events"
  on public.events for update using (auth.uid() = host_id);
create policy "Hosts can delete own draft events"
  on public.events for delete using (auth.uid() = host_id and status = 'draft');

-- TICKET TYPES
create policy "Ticket types viewable by everyone"
  on public.ticket_types for select using (true);
create policy "Hosts can manage ticket types for their events"
  on public.ticket_types for all using (
    exists (select 1 from public.events where id = event_id and host_id = auth.uid())
  );

-- RSVPS
create policy "Users can view own RSVPs"
  on public.rsvps for select using (auth.uid() = user_id);
create policy "Hosts can view RSVPs for their events"
  on public.rsvps for select using (
    exists (select 1 from public.events where id = event_id and host_id = auth.uid())
  );
create policy "Authenticated users can RSVP"
  on public.rsvps for insert with check (auth.uid() = user_id);
create policy "Users can cancel own RSVP"
  on public.rsvps for update using (auth.uid() = user_id);

-- TICKETS
create policy "Users can view own tickets"
  on public.tickets for select using (auth.uid() = user_id);
create policy "Hosts can view tickets for their events"
  on public.tickets for select using (
    exists (select 1 from public.events where id = event_id and host_id = auth.uid())
  );
create policy "Backend inserts tickets (service role only)"
  on public.tickets for insert with check (false); -- only service role can insert

-- HOST STRIPE ACCOUNTS
create policy "Users can view own stripe account"
  on public.host_stripe_accounts for select using (auth.uid() = user_id);
create policy "Users can insert own stripe account"
  on public.host_stripe_accounts for insert with check (auth.uid() = user_id);

-- RATE LIMITS (service role only)
create policy "Service role manages rate limits"
  on public.rate_limits for all using (false);

-- ============================================================
-- UPDATED_AT trigger
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger update_events_updated_at before update on public.events
  for each row execute function update_updated_at();
create trigger update_host_accounts_updated_at before update on public.host_stripe_accounts
  for each row execute function update_updated_at();

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Event with host info and ticket summary
create or replace view public.events_with_details as
  select
    e.*,
    p.full_name  as host_name,
    p.avatar_url as host_avatar,
    p.city       as host_city,
    coalesce(
      (select sum(quantity) from public.tickets t where t.event_id = e.id and t.status = 'confirmed'),
      (select count(*) from public.rsvps r where r.event_id = e.id and r.status = 'confirmed'),
      0
    ) as total_attendees,
    (select coalesce(sum(host_receives_cents),0) from public.tickets t where t.event_id = e.id and t.status = 'confirmed')
      as revenue_cents
  from public.events e
  join public.profiles p on p.id = e.host_id;
