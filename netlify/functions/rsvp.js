const { supabaseAdmin, ok, err, options, requireAuth } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();

  const { user, userId, authErr } = await requireAuth(event);
  if (authErr) return authErr;

  // POST /api/rsvp
  if (event.httpMethod === 'POST') {
    const { eventId } = JSON.parse(event.body || '{}');
    if (!eventId) return err(400, 'Event ID required.');

    const { data: ev } = await supabaseAdmin
      .from('events').select('id, max_capacity, status').eq('id', eventId).single();
    if (!ev || ev.status !== 'published') return err(404, 'Event not found.');

    if (ev.max_capacity) {
      const { count } = await supabaseAdmin
        .from('rsvps').select('*', { count: 'exact' })
        .eq('event_id', eventId).eq('status', 'confirmed');
      if (count >= ev.max_capacity) return err(400, 'This event is at full capacity.');
    }

    const { data, error } = await supabaseAdmin.from('rsvps').upsert({
      event_id: eventId,
      user_id:  userId,
      status:   'confirmed',
    }, { onConflict: 'event_id,user_id' }).select().single();

    if (error) return err(400, error.message);
    return ok({ success: true, rsvp: data });
  }

  // DELETE /api/rsvp/:eventId
  if (event.httpMethod === 'DELETE') {
    const eventId = event.path.split('/').pop();
    await supabaseAdmin.from('rsvps')
      .update({ status: 'cancelled' })
      .eq('event_id', eventId).eq('user_id', userId);
    return ok({ success: true });
  }

  return err(405, 'Method not allowed.');
};
