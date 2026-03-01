const { supabaseAdmin, ok, err, options, requireAuth } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();

  const path = event.path
    .replace('/.netlify/functions/events', '')
    .replace('/api/events', '');

  // GET /api/events — list published events
  if (event.httpMethod === 'GET' && (path === '' || path === '/')) {
    const { city, type, is_paid, q, filter, limit = 20, offset = 0 } = event.queryStringParameters || {};

    let query = supabaseAdmin
      .from('events_with_details')
      .select('*')
      .eq('status', 'published')
      .order('start_date', { ascending: true })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (city)   query = query.ilike('city', `%${city}%`);
    if (type)   query = query.eq('event_type', type);
    if (is_paid !== undefined) query = query.eq('is_paid', is_paid === 'true');
    if (filter === 'free') query = query.eq('is_paid', false);
    if (filter === 'paid') query = query.eq('is_paid', true);
    if (q) {
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%,event_type.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) return err(500, error.message);
    return ok({ events: data || [] });
  }

  // GET /api/events/:id — single event
  if (event.httpMethod === 'GET' && path.length > 1) {
    const id = path.replace('/', '');
    const { data: ev, error } = await supabaseAdmin
      .from('events_with_details').select('*').eq('id', id).single();
    if (error || !ev) return err(404, 'Event not found.');
    const { data: ticketTypes } = await supabaseAdmin
      .from('ticket_types').select('*').eq('event_id', id);
    return ok({ ...ev, ticket_types: ticketTypes || [] });
  }

  // POST /api/events — create event (auth required)
  if (event.httpMethod === 'POST' && (path === '' || path === '/')) {
    const { user, userId, authErr } = await requireAuth(event);
    if (authErr) return authErr;

    const {
      name, description, emoji, event_type, age_group, format, denomination,
      tags, is_paid, absorb_stripe_fee, start_date, end_date,
      venue_name, address, city, state, zip, online_url, max_capacity,
    } = JSON.parse(event.body || '{}');

    if (!name) return err(400, 'Event name is required.');

    // Upgrade to host
    await supabaseAdmin.from('profiles')
      .update({ role: 'host' }).eq('id', userId).in('role', ['attendee']);

    const { data, error } = await supabaseAdmin.from('events').insert({
      host_id: userId,
      name, description, emoji: emoji || '✝', event_type, age_group,
      format: format || 'in_person', denomination, tags,
      is_paid: is_paid || false,
      absorb_stripe_fee: absorb_stripe_fee !== false,
      start_date, end_date,
      venue_name, address, city, state, zip, online_url,
      max_capacity: max_capacity || null,
      status: 'draft',
    }).select().single();

    if (error) return err(400, error.message);
    return ok(data);
  }

  // PATCH /api/events/:id/publish
  if (event.httpMethod === 'PATCH' && path.includes('/publish')) {
    const { user, userId, authErr } = await requireAuth(event);
    if (authErr) return authErr;

    const id = path.replace('/', '').replace('/publish', '');
    const { data: ev } = await supabaseAdmin
      .from('events').select('id, is_paid, listing_fee_paid')
      .eq('id', id).eq('host_id', userId).single();

    if (!ev) return err(404, 'Event not found or not yours.');
    if (ev.is_paid && !ev.listing_fee_paid) {
      return err(402, 'Listing fee required to publish a paid event.');
    }

    const { data, error } = await supabaseAdmin
      .from('events').update({ status: 'published' })
      .eq('id', id).select().single();

    if (error) return err(400, error.message);
    return ok(data);
  }

  return err(404, 'Not found.');
};
