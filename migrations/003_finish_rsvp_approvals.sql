-- ════════════════════════════════════════════════════════════
-- MIGRATION 003 — finish RSVP approvals (run in Supabase SQL Editor)
--
-- The rest of 001/002 was applied to production on 2026-10-13 through the
-- Supabase connector, which holds DROP/DELETE statements for manual
-- confirmation. These two statements contain those keywords, so they are
-- run by hand. Safe to re-run.
-- ════════════════════════════════════════════════════════════

-- 1. Allow 'pending' and 'declined' RSVP statuses (approval-required events)
alter table public.rsvps drop constraint if exists rsvps_status_check;
alter table public.rsvps add constraint rsvps_status_check
  check (status in ('confirmed','cancelled','pending','declined'));

-- 2. Capacity-safe RSVP. Locks the event row so two people can't take the last spot.
--    Returns: 'confirmed' | 'pending' | 'full' | 'declined' | 'closed'
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

revoke execute on function public.claim_rsvp(uuid,uuid,uuid) from public, anon, authenticated;
grant  execute on function public.claim_rsvp(uuid,uuid,uuid) to service_role;
