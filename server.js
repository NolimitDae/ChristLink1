/**
 * CHRIST LINK — Railway Backend v2.1
 * Express + Supabase + Stripe
 */
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const { createClient } = require('@supabase/supabase-js');
const Stripe    = require('stripe');

const app  = express();
const PORT = process.env.PORT || 4242;

// ─── CLIENTS ────────────────────────────────────────────────
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── CONSTANTS ──────────────────────────────────────────────
const PLATFORM_FEE_PCT = 0.05;
const HOST_LISTING_FEE = 1999;
const STRIPE_PCT       = 0.029;
const STRIPE_FIXED     = 30;

// ─── MIDDLEWARE ─────────────────────────────────────────────
// Webhook needs raw body BEFORE json()
app.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.APP_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── RATE LIMITERS ──────────────────────────────────────────
const apiLimiter  = rateLimit({ windowMs: 15*60*1000, max: 200, message: { error: 'Too many requests.' } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10,  message: { error: 'Too many auth attempts.' } });
const pmtLimiter  = rateLimit({ windowMs: 60*60*1000, max: 20,  message: { error: 'Too many payment attempts.' } });
app.use('/api', apiLimiter);

// ─── HELPERS ────────────────────────────────────────────────
function calcAmounts(priceCents, qty, absorb) {
  const face        = priceCents * qty;
  const platformFee = Math.round(face * PLATFORM_FEE_PCT);
  const chargeAmount = absorb
    ? face
    : Math.ceil((face + STRIPE_FIXED) / (1 - STRIPE_PCT));
  const stripeFee    = Math.round(chargeAmount * STRIPE_PCT + STRIPE_FIXED);
  const hostReceives = chargeAmount - stripeFee - platformFee;
  return { face, chargeAmount, platformFee, stripeFee, hostReceives };
}

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  const token = auth.replace('Bearer ', '');
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid or expired session.' });
    req.user = user; req.userId = user.id;
    next();
  } catch { res.status(401).json({ error: 'Authentication failed.' }); }
}

// ════════════════════════════════════════════════════════════
// HEALTH
// ════════════════════════════════════════════════════════════
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'christlink', ts: new Date().toISOString() }));

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════
app.post('/api/auth/signup', authLimiter, async (req, res) => {
  const { email, fullName } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, data: { full_name: fullName || '' } },
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, message: 'Check your email for a 6-digit code.' });
  } catch { res.status(500).json({ error: 'Failed to send verification email.' }); }
});

app.post('/api/auth/signin', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  try {
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    res.json({ success: true, message: 'Check your email for a verification code.' });
  } catch { res.status(500).json({ error: 'Failed to send sign-in code.' }); }
});

app.post('/api/auth/verify-otp', authLimiter, async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) return res.status(400).json({ error: 'Email and code are required.' });
  try {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) return res.status(400).json({ error: 'Invalid or expired code. Please try again.' });
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', data.user.id).single();
    res.json({
      success: true,
      accessToken:  data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: { ...data.user, profile },
    });
  } catch { res.status(500).json({ error: 'Verification failed.' }); }
});

app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required.' });
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    res.json({ accessToken: data.session.access_token, refreshToken: data.session.refresh_token });
  } catch { res.status(500).json({ error: 'Failed to refresh session.' }); }
});

// ════════════════════════════════════════════════════════════
// PROFILE
// ════════════════════════════════════════════════════════════
app.get('/api/profile', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*, host_stripe_accounts(stripe_account_id, onboarding_complete, payouts_enabled)')
    .eq('id', req.userId).single();
  if (error) return res.status(404).json({ error: 'Profile not found.' });
  res.json(data);
});

app.patch('/api/profile', requireAuth, async (req, res) => {
  const { full_name, bio, city, avatar_url, avatar_color } = req.body;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ full_name, bio, city, avatar_url, avatar_color })
    .eq('id', req.userId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ════════════════════════════════════════════════════════════
// EVENTS
// ════════════════════════════════════════════════════════════
app.get('/api/events', async (req, res) => {
  const { city, type, is_paid, q, format, limit = 20, offset = 0 } = req.query;
  let query = supabaseAdmin
    .from('events_with_details').select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true })
    .range(Number(offset), Number(offset) + Number(limit) - 1);
  if (city)   query = query.ilike('city', `%${city}%`);
  if (type)   query = query.ilike('event_type', `%${type}%`);
  if (format) query = query.eq('format', format);
  if (is_paid !== undefined) query = query.eq('is_paid', is_paid === 'true');
  if (q)      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%,event_type.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ events: data || [] });
});

app.get('/api/events/:id', async (req, res) => {
  const { data: ev, error } = await supabaseAdmin
    .from('events_with_details').select('*').eq('id', req.params.id).single();
  if (error || !ev) return res.status(404).json({ error: 'Event not found.' });
  const { data: ticketTypes } = await supabaseAdmin.from('ticket_types').select('*').eq('event_id', req.params.id);
  res.json({ ...ev, ticket_types: ticketTypes || [] });
});

app.post('/api/events', requireAuth, async (req, res) => {
  const {
    name, description, emoji, event_type, age_group, format,
    denomination, tags, is_paid, absorb_stripe_fee,
    start_date, end_date, venue_name, address, city, state, zip, online_url, max_capacity,
  } = req.body;
  if (!name) return res.status(400).json({ error: 'Event name is required.' });
  await supabaseAdmin.from('profiles').update({ role: 'host' }).eq('id', req.userId).eq('role', 'attendee');
  const { data, error } = await supabaseAdmin.from('events').insert({
    host_id: req.userId, name, description,
    emoji: emoji || '✝', event_type,
    age_group: age_group || 'All Ages',
    format: format || 'in_person',
    denomination, tags,
    is_paid: is_paid || false,
    absorb_stripe_fee: absorb_stripe_fee !== false,
    start_date: start_date || null, end_date: end_date || null,
    venue_name, address, city, state, zip, online_url,
    max_capacity: max_capacity || null,
    status: 'draft',
  }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.patch('/api/events/:id/publish', requireAuth, async (req, res) => {
  const { data: ev } = await supabaseAdmin
    .from('events').select('id, is_paid, listing_fee_paid')
    .eq('id', req.params.id).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.is_paid && !ev.listing_fee_paid) return res.status(402).json({ error: 'Listing fee required.' });
  const { data, error } = await supabaseAdmin
    .from('events').update({ status: 'published' })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ════════════════════════════════════════════════════════════
// TICKET TYPES
// ════════════════════════════════════════════════════════════
app.post('/api/ticket-types', requireAuth, async (req, res) => {
  const { event_id, name, price_cents, quantity } = req.body;
  if (!event_id || !name || !price_cents) return res.status(400).json({ error: 'event_id, name, price_cents required.' });
  const { data: ev } = await supabaseAdmin.from('events').select('id').eq('id', event_id).eq('host_id', req.userId).single();
  if (!ev) return res.status(403).json({ error: 'Not your event.' });
  const { data, error } = await supabaseAdmin.from('ticket_types')
    .insert({ event_id, name, price_cents, quantity: quantity || null, sold: 0 }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ════════════════════════════════════════════════════════════
// RSVP
// ════════════════════════════════════════════════════════════
app.post('/api/rsvp', requireAuth, async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ error: 'Event ID required.' });
  const { data: ev } = await supabaseAdmin.from('events').select('id, max_capacity, status').eq('id', eventId).single();
  if (!ev || ev.status !== 'published') return res.status(404).json({ error: 'Event not found.' });
  if (ev.max_capacity) {
    const { count } = await supabaseAdmin.from('rsvps').select('*', { count: 'exact' })
      .eq('event_id', eventId).eq('status', 'confirmed');
    if (count >= ev.max_capacity) return res.status(400).json({ error: 'Event is at full capacity.' });
  }
  const { data, error } = await supabaseAdmin.from('rsvps')
    .upsert({ event_id: eventId, user_id: req.userId, status: 'confirmed' }, { onConflict: 'event_id,user_id' })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, rsvp: data });
});

app.delete('/api/rsvp/:eventId', requireAuth, async (req, res) => {
  await supabaseAdmin.from('rsvps').update({ status: 'cancelled' })
    .eq('event_id', req.params.eventId).eq('user_id', req.userId);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════════════════════════
app.get('/api/price-breakdown', async (req, res) => {
  const { price, qty = 1, absorb = 'true' } = req.query;
  if (!price) return res.status(400).json({ error: 'Price required.' });
  res.json(calcAmounts(Number(price), Number(qty), absorb === 'true'));
});

app.post('/api/tax-estimate', async (req, res) => {
  const { amountCents } = req.body;
  if (!amountCents) return res.status(400).json({ error: 'Amount required.' });
  try {
    const calc = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: [{ amount: amountCents, reference: 'ticket' }],
      customer_details: { address_source: 'shipping', address: { country: 'US' }, taxability_override: 'none' },
    });
    res.json({ taxAmountCents: calc.tax_amount_exclusive, totalCents: calc.amount_total, calculationId: calc.id });
  } catch { res.json({ taxAmountCents: 0, totalCents: amountCents, calculationId: null }); }
});

app.post('/api/charge-listing-fee', pmtLimiter, requireAuth, async (req, res) => {
  const { paymentMethodId, eventId, hostEmail } = req.body;
  if (!paymentMethodId || !eventId) return res.status(400).json({ error: 'Payment method and event ID required.' });
  const { data: ev } = await supabaseAdmin.from('events').select('id, name, listing_fee_paid')
    .eq('id', eventId).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.listing_fee_paid) return res.status(400).json({ error: 'Listing fee already paid.' });
  try {
    const intent = await stripe.paymentIntents.create({
      amount: HOST_LISTING_FEE, currency: 'usd',
      payment_method: paymentMethodId, confirm: true,
      receipt_email: hostEmail || req.user.email,
      description: `Christ Link listing fee — ${ev.name}`,
      automatic_tax: { enabled: true },
      metadata: { type: 'listing_fee', event_id: eventId, host_id: req.userId },
      return_url: `${process.env.APP_URL}/?listing_success=1`,
    }, { idempotencyKey: `listing-fee-${eventId}` });
    if (intent.status === 'succeeded') {
      await supabaseAdmin.from('events').update({ listing_fee_paid: true, listing_payment_id: intent.id }).eq('id', eventId);
      return res.json({ success: true, intentId: intent.id });
    }
    res.json({ success: false, status: intent.status, clientSecret: intent.client_secret });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/create-payment-intent', pmtLimiter, requireAuth, async (req, res) => {
  const { eventId, ticketTypeId, qty = 1, buyerEmail } = req.body;
  if (!eventId || !ticketTypeId) return res.status(400).json({ error: 'Event ID and ticket type required.' });
  const { data: ev } = await supabaseAdmin
    .from('events').select('*, host_stripe_accounts!inner(stripe_account_id, payouts_enabled)')
    .eq('id', eventId).eq('status', 'published').single();
  if (!ev) return res.status(404).json({ error: 'Event not found.' });
  if (!ev.is_paid) return res.status(400).json({ error: 'This event is free — use RSVP.' });
  if (!ev.host_stripe_accounts?.payouts_enabled) return res.status(400).json({ error: 'Host payment account not set up.' });
  const { data: tt } = await supabaseAdmin.from('ticket_types').select('*').eq('id', ticketTypeId).eq('event_id', eventId).single();
  if (!tt) return res.status(404).json({ error: 'Ticket type not found.' });
  if (tt.quantity !== null && qty > (tt.quantity - tt.sold)) return res.status(400).json({ error: `Only ${tt.quantity - tt.sold} tickets remaining.` });
  const amounts = calcAmounts(tt.price_cents, qty, ev.absorb_stripe_fee);
  const idempotencyKey = `pi-${req.userId}-${eventId}-${ticketTypeId}-${qty}-${Date.now()}`;
  try {
    const intent = await stripe.paymentIntents.create({
      amount: amounts.chargeAmount, currency: 'usd',
      receipt_email: buyerEmail || req.user.email,
      description: `${qty}x ${tt.name} — ${ev.name}`,
      automatic_tax: { enabled: true },
      metadata: { event_id: eventId, ticket_type_id: ticketTypeId, buyer_id: req.userId, qty, platform_fee: amounts.platformFee },
      transfer_data: { destination: ev.host_stripe_accounts.stripe_account_id },
      application_fee_amount: amounts.platformFee,
    }, { idempotencyKey });
    const taxAmount = intent.amount_details?.tax?.amount || 0;
    await supabaseAdmin.from('tickets').insert({
      event_id: eventId, ticket_type_id: ticketTypeId, user_id: req.userId, quantity: qty,
      unit_price_cents: tt.price_cents, total_charged_cents: amounts.chargeAmount + taxAmount,
      platform_fee_cents: amounts.platformFee, stripe_fee_cents: amounts.stripeFee,
      host_receives_cents: amounts.hostReceives, stripe_payment_intent: intent.id,
      stripe_idempotency_key: idempotencyKey, status: 'pending',
      buyer_email: buyerEmail || req.user.email,
    });
    res.json({ clientSecret: intent.client_secret, breakdown: { ...amounts, taxAmount }, intentId: intent.id });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/connect-onboard', requireAuth, async (req, res) => {
  try {
    const { data: existing } = await supabaseAdmin.from('host_stripe_accounts')
      .select('stripe_account_id, onboarding_complete').eq('user_id', req.userId).single();
    let accountId = existing?.stripe_account_id;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express', email: req.user.email,
        capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
        metadata: { christlink_user_id: req.userId },
      });
      accountId = account.id;
      await supabaseAdmin.from('host_stripe_accounts').insert({ user_id: req.userId, stripe_account_id: accountId });
    }
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.APP_URL}/?reauth=1`,
      return_url:  `${process.env.APP_URL}/?connected=1`,
      type: 'account_onboarding',
    });
    res.json({ url: link.url, accountId });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
// STRIPE WEBHOOK
// ════════════════════════════════════════════════════════════
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('Webhook sig failed:', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        if (pi.metadata.type === 'listing_fee') {
          if (pi.metadata.event_id) await supabaseAdmin.from('events')
            .update({ listing_fee_paid: true, listing_payment_id: pi.id }).eq('id', pi.metadata.event_id);
          break;
        }
        await supabaseAdmin.from('tickets')
          .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
          .eq('stripe_payment_intent', pi.id);
        if (pi.metadata.ticket_type_id) await supabaseAdmin.rpc('increment_tickets_sold', {
          p_ticket_type_id: pi.metadata.ticket_type_id,
          p_qty: parseInt(pi.metadata.qty) || 1,
        });
        break;
      }
      case 'payment_intent.payment_failed':
        await supabaseAdmin.from('tickets').update({ status: 'failed' })
          .eq('stripe_payment_intent', event.data.object.id);
        break;
      case 'account.updated': {
        const acct = event.data.object;
        await supabaseAdmin.from('host_stripe_accounts').update({
          onboarding_complete: acct.details_submitted,
          payouts_enabled: acct.payouts_enabled,
          charges_enabled: acct.charges_enabled,
        }).eq('stripe_account_id', acct.id);
        break;
      }
      case 'charge.refunded':
        await supabaseAdmin.from('tickets').update({ status: 'refunded' })
          .eq('stripe_payment_intent', event.data.object.payment_intent);
        break;
    }
    res.json({ received: true });
  } catch (e) {
    console.error('Webhook error:', e.message);
    res.json({ received: true, warning: e.message });
  }
}

// ─── SPA FALLBACK ───────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ─── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✝  Christ Link running on :${PORT}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`   App URL:  ${process.env.APP_URL || 'http://localhost:'+PORT}\n`);
});
