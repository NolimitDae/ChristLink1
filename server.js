/**
 * CHRIST LINK — Production Backend
 * Node.js / Express + Supabase + Stripe
 *
 * SETUP:
 *   npm install
 *   cp .env.example .env   (fill in all values)
 *   node server.js
 */

require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const stripe       = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app  = express();
const PORT = process.env.PORT || 4242;

// ─── SUPABASE CLIENTS ───────────────────────────────────────
// anon client  — respects RLS, used for auth verification
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
// service role — bypasses RLS, used for trusted server writes
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ─── CONSTANTS ──────────────────────────────────────────────
const PLATFORM_ACCOUNT  = process.env.CHRISTLINK_ACCOUNT_ID;
const PLATFORM_FEE_PCT  = 0.05;
const HOST_LISTING_FEE  = 2000;   // $20.00
const STRIPE_PCT        = 0.029;
const STRIPE_FIXED      = 30;     // 30¢

// ─── MIDDLEWARE ─────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.static('public'));

// Global rate limiter — 100 requests per 15 min per IP
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Strict rate limiter for payment endpoints — 10 per hour per IP
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many payment attempts. Please try again later.' },
});

// ─── AUTH MIDDLEWARE ─────────────────────────────────────────
/**
 * requireAuth — verifies Supabase JWT from Authorization header
 * Attaches req.user and req.userId to every protected request
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
    }
    req.user   = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed.' });
  }
}

/**
 * requireHost — user must have role = 'host' or have a connected Stripe account
 */
async function requireHost(req, res, next) {
  await requireAuth(req, res, async () => {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.userId)
      .single();

    if (!profile || !['host', 'admin'].includes(profile.role)) {
      return res.status(403).json({ error: 'Host account required. Please upgrade your account.' });
    }
    next();
  });
}

// ─── HELPERS ────────────────────────────────────────────────
function calcAmounts(ticketPriceCents, qty, hostAbsorbsStripeFee) {
  const face        = ticketPriceCents * qty;
  const platformFee = Math.round(face * PLATFORM_FEE_PCT);
  let   chargeAmount;

  if (hostAbsorbsStripeFee) {
    chargeAmount = face;
  } else {
    chargeAmount = Math.ceil((face + STRIPE_FIXED) / (1 - STRIPE_PCT));
  }

  const stripeFee    = Math.round(chargeAmount * STRIPE_PCT + STRIPE_FIXED);
  const hostReceives = chargeAmount - stripeFee - platformFee;

  return { face, chargeAmount, platformFee, stripeFee, hostReceives };
}

// ─── HEALTH CHECK ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    service:   'christlink-api',
    version:   '2.0.0',
  });
});

// ════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════

/**
 * POST /api/auth/signup
 * Creates user + sends OTP email via Supabase
 */
app.post('/api/auth/signup', rateLimit({ windowMs: 15*60*1000, max: 5 }), async (req, res) => {
  const { email, fullName } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { full_name: fullName || '' },
        emailRedirectTo: process.env.APP_URL,
      },
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, message: 'Check your email for a 6-digit verification code.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send verification email.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies 6-digit OTP and returns session
 */
app.post('/api/auth/verify-otp', rateLimit({ windowMs: 15*60*1000, max: 10 }), async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) return res.status(400).json({ error: 'Email and code are required.' });

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) return res.status(400).json({ error: 'Invalid or expired code. Please try again.' });

    // Fetch profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      success:      true,
      accessToken:  data.session.access_token,
      refreshToken: data.session.refresh_token,
      user:         { ...data.user, profile },
    });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed.' });
  }
});

/**
 * POST /api/auth/signin
 * Sign in existing user — sends OTP
 */
app.post('/api/auth/signin', rateLimit({ windowMs: 15*60*1000, max: 5 }), async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    // Always return success to prevent email enumeration
    res.json({ success: true, message: 'If an account exists, a code has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send sign-in code.' });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required.' });

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return res.status(401).json({ error: 'Session expired. Please sign in again.' });
    res.json({ accessToken: data.session.access_token, refreshToken: data.session.refresh_token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh session.' });
  }
});

// ════════════════════════════════════════════════════════════
// PROFILE ROUTES
// ════════════════════════════════════════════════════════════

/**
 * GET /api/profile
 * Get current user's profile
 */
app.get('/api/profile', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*, host_stripe_accounts(stripe_account_id, onboarding_complete, payouts_enabled)')
    .eq('id', req.userId)
    .single();

  if (error) return res.status(404).json({ error: 'Profile not found.' });
  res.json(data);
});

/**
 * PATCH /api/profile
 * Update current user's profile
 */
app.patch('/api/profile', requireAuth, async (req, res) => {
  const { full_name, bio, city, avatar_url } = req.body;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ full_name, bio, city, avatar_url })
    .eq('id', req.userId)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ════════════════════════════════════════════════════════════
// EVENT ROUTES
// ════════════════════════════════════════════════════════════

/**
 * GET /api/events
 * List published events with filters
 */
app.get('/api/events', async (req, res) => {
  const { city, type, is_paid, limit = 20, offset = 0 } = req.query;

  let query = supabaseAdmin
    .from('events_with_details')
    .select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true })
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (city)    query = query.ilike('city', `%${city}%`);
  if (type)    query = query.eq('event_type', type);
  if (is_paid !== undefined) query = query.eq('is_paid', is_paid === 'true');

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * GET /api/events/:id
 * Get single event with ticket types
 */
app.get('/api/events/:id', async (req, res) => {
  const { data: event, error } = await supabaseAdmin
    .from('events_with_details')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !event) return res.status(404).json({ error: 'Event not found.' });

  const { data: ticketTypes } = await supabaseAdmin
    .from('ticket_types')
    .select('*')
    .eq('event_id', req.params.id);

  res.json({ ...event, ticket_types: ticketTypes || [] });
});

/**
 * POST /api/events
 * Create a new event (auth required, upgrades role to host)
 */
app.post('/api/events', requireAuth, async (req, res) => {
  const {
    name, description, emoji, event_type, age_group, format, denomination,
    tags, is_paid, absorb_stripe_fee, start_date, end_date,
    venue_name, address, city, state, zip, online_url, max_capacity,
  } = req.body;

  if (!name) return res.status(400).json({ error: 'Event name is required.' });

  // Upgrade user to host role if not already
  await supabaseAdmin
    .from('profiles')
    .update({ role: 'host' })
    .eq('id', req.userId)
    .in('role', ['attendee']);

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert({
      host_id: req.userId,
      name, description, emoji: emoji || '✝', event_type, age_group,
      format: format || 'in_person', denomination, tags, is_paid: is_paid || false,
      absorb_stripe_fee: absorb_stripe_fee !== false,
      start_date, end_date, venue_name, address, city, state, zip,
      online_url, max_capacity, status: 'draft',
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * PATCH /api/events/:id/publish
 * Publish an event (must be host + listing fee paid if paid event)
 */
app.patch('/api/events/:id/publish', requireAuth, async (req, res) => {
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .eq('host_id', req.userId)
    .single();

  if (!event) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (event.is_paid && !event.listing_fee_paid) {
    return res.status(402).json({ error: 'Listing fee required to publish a paid event.' });
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .update({ status: 'published' })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ════════════════════════════════════════════════════════════
// RSVP ROUTES (free events — auth required)
// ════════════════════════════════════════════════════════════

/**
 * POST /api/rsvp
 * RSVP to a free event — requires authentication
 */
app.post('/api/rsvp', requireAuth, rateLimit({ windowMs: 60*60*1000, max: 20 }), async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ error: 'Event ID required.' });

  // Verify event is free and published
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, is_paid, status, max_capacity')
    .eq('id', eventId)
    .single();

  if (!event)              return res.status(404).json({ error: 'Event not found.' });
  if (event.status !== 'published') return res.status(400).json({ error: 'Event is not available.' });
  if (event.is_paid)       return res.status(400).json({ error: 'This event requires ticket purchase.' });

  // Check capacity
  if (event.max_capacity) {
    const { count } = await supabaseAdmin
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmed');

    if (count >= event.max_capacity) {
      return res.status(400).json({ error: 'This event is at full capacity.' });
    }
  }

  // Upsert RSVP
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .upsert({ event_id: eventId, user_id: req.userId, status: 'confirmed' })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, rsvp: data, eventName: event.name });
});

/**
 * DELETE /api/rsvp/:eventId
 * Cancel an RSVP
 */
app.delete('/api/rsvp/:eventId', requireAuth, async (req, res) => {
  await supabaseAdmin
    .from('rsvps')
    .update({ status: 'cancelled' })
    .eq('event_id', req.params.eventId)
    .eq('user_id', req.userId);

  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// PAYMENT ROUTES
// ════════════════════════════════════════════════════════════

/**
 * GET /api/price-breakdown
 * Preview price breakdown (no auth needed — just math)
 */
app.get('/api/price-breakdown', (req, res) => {
  const price  = parseInt(req.query.price)  || 0;
  const qty    = parseInt(req.query.qty)    || 1;
  const absorb = req.query.absorb !== 'false';
  res.json(calcAmounts(price, qty, absorb));
});

/**
 * POST /api/charge-listing-fee
 * Charge host $20 to unlock paid ticketing — AUTH REQUIRED
 */
app.post('/api/charge-listing-fee', requireAuth, paymentLimiter, async (req, res) => {
  const { paymentMethodId, eventId, hostEmail } = req.body;
  if (!paymentMethodId || !eventId) {
    return res.status(400).json({ error: 'Payment method and event ID required.' });
  }

  // Verify the event belongs to this user
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, name, listing_fee_paid')
    .eq('id', eventId)
    .eq('host_id', req.userId)
    .single();

  if (!event) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (event.listing_fee_paid) return res.status(400).json({ error: 'Listing fee already paid for this event.' });

  try {
    // Idempotency key = eventId so double-clicks never double-charge
    const intent = await stripe.paymentIntents.create({
      amount:         HOST_LISTING_FEE,
      currency:       'usd',
      payment_method: paymentMethodId,
      confirm:        true,
      receipt_email:  hostEmail || req.user.email,
      description:    `Christ Link listing fee — ${event.name}`,
      metadata:       { type: 'listing_fee', event_id: eventId, host_id: req.userId },
      return_url:     `${process.env.APP_URL}/host/success`,
    }, {
      idempotencyKey: `listing-fee-${eventId}`,
    });

    if (intent.status === 'succeeded') {
      // Mark listing fee as paid in DB
      await supabaseAdmin
        .from('events')
        .update({ listing_fee_paid: true, listing_payment_id: intent.id })
        .eq('id', eventId);

      res.json({ success: true, intentId: intent.id });
    } else {
      res.json({ success: false, status: intent.status, clientSecret: intent.client_secret });
    }
  } catch (err) {
    console.error('Listing fee error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/create-payment-intent
 * Create ticket purchase intent — AUTH REQUIRED
 */
app.post('/api/create-payment-intent', requireAuth, paymentLimiter, async (req, res) => {
  const {
    eventId,
    ticketTypeId,
    qty = 1,
    buyerEmail,
  } = req.body;

  if (!eventId || !ticketTypeId) {
    return res.status(400).json({ error: 'Event ID and ticket type required.' });
  }

  // Fetch event + ticket type together
  const { data: event } = await supabaseAdmin
    .from('events')
    .select('*, host_stripe_accounts!inner(stripe_account_id, payouts_enabled)')
    .eq('id', eventId)
    .eq('status', 'published')
    .single();

  if (!event) return res.status(404).json({ error: 'Event not found or unavailable.' });
  if (!event.is_paid) return res.status(400).json({ error: 'This event is free — use RSVP instead.' });

  const hostAccount = event.host_stripe_accounts;
  if (!hostAccount?.payouts_enabled) {
    return res.status(400).json({ error: 'Host payment account not fully set up yet.' });
  }

  const { data: ticketType } = await supabaseAdmin
    .from('ticket_types')
    .select('*')
    .eq('id', ticketTypeId)
    .eq('event_id', eventId)
    .single();

  if (!ticketType) return res.status(404).json({ error: 'Ticket type not found.' });

  // Check remaining capacity
  if (ticketType.quantity !== null) {
    const remaining = ticketType.quantity - ticketType.sold;
    if (qty > remaining) {
      return res.status(400).json({ error: `Only ${remaining} tickets remaining.` });
    }
  }

  const amounts = calcAmounts(ticketType.price_cents, qty, event.absorb_stripe_fee);

  // Idempotency key = userId + eventId + ticketTypeId + qty (prevents double-charge on retry)
  const idempotencyKey = `pi-${req.userId}-${eventId}-${ticketTypeId}-${qty}-${Date.now()}`;

  try {
    const intent = await stripe.paymentIntents.create({
      amount:        amounts.chargeAmount,
      currency:      'usd',
      receipt_email: buyerEmail || req.user.email,
      description:   `${qty}x ${ticketType.name} — ${event.name}`,
      metadata: {
        event_id:       eventId,
        ticket_type_id: ticketTypeId,
        buyer_id:       req.userId,
        qty:            qty,
        platform_fee:   amounts.platformFee,
        host_receives:  amounts.hostReceives,
        idempotency_key: idempotencyKey,
      },
      transfer_data: {
        destination: hostAccount.stripe_account_id,
      },
      application_fee_amount: amounts.platformFee,
    }, {
      idempotencyKey,
    });

    // Create a PENDING ticket record in DB
    await supabaseAdmin.from('tickets').insert({
      event_id:               eventId,
      ticket_type_id:         ticketTypeId,
      user_id:                req.userId,
      quantity:               qty,
      unit_price_cents:       ticketType.price_cents,
      total_charged_cents:    amounts.chargeAmount,
      platform_fee_cents:     amounts.platformFee,
      stripe_fee_cents:       amounts.stripeFee,
      host_receives_cents:    amounts.hostReceives,
      stripe_payment_intent:  intent.id,
      stripe_idempotency_key: idempotencyKey,
      status:                 'pending',
      buyer_email:            buyerEmail || req.user.email,
    });

    res.json({
      clientSecret: intent.client_secret,
      breakdown:    amounts,
      intentId:     intent.id,
    });
  } catch (err) {
    console.error('PaymentIntent error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/connect-onboard
 * Start Stripe Connect onboarding for a host — AUTH REQUIRED
 */
app.post('/api/connect-onboard', requireAuth, async (req, res) => {
  try {
    // Check if already connected
    const { data: existing } = await supabaseAdmin
      .from('host_stripe_accounts')
      .select('stripe_account_id, onboarding_complete')
      .eq('user_id', req.userId)
      .single();

    let accountId = existing?.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type:  'express',
        email: req.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers:     { requested: true },
        },
        metadata: { christlink_user_id: req.userId },
      });
      accountId = account.id;

      // Save to DB
      await supabaseAdmin.from('host_stripe_accounts').insert({
        user_id:           req.userId,
        stripe_account_id: accountId,
      });
    }

    const link = await stripe.accountLinks.create({
      account:     accountId,
      refresh_url: `${process.env.APP_URL}/host/reauth`,
      return_url:  `${process.env.APP_URL}/host/connected?account=${accountId}`,
      type:        'account_onboarding',
    });

    res.json({ url: link.url, accountId });
  } catch (err) {
    console.error('Connect onboard error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════════════
// STRIPE WEBHOOKS
// ════════════════════════════════════════════════════════════
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const { event_id, ticket_type_id, qty, buyer_id } = pi.metadata;

        if (pi.metadata.type === 'listing_fee') {
          // Listing fee confirmed — ensure event is marked
          if (pi.metadata.event_id) {
            await supabaseAdmin.from('events')
              .update({ listing_fee_paid: true, listing_payment_id: pi.id })
              .eq('id', pi.metadata.event_id);
          }
          break;
        }

        // Ticket purchase — confirm the ticket
        await supabaseAdmin.from('tickets')
          .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
          .eq('stripe_payment_intent', pi.id);

        // Increment sold count on ticket type
        if (ticket_type_id) {
          await supabaseAdmin.rpc('increment_tickets_sold', {
            p_ticket_type_id: ticket_type_id,
            p_qty: parseInt(qty) || 1,
          });
        }

        console.log(`✅ Ticket confirmed: ${pi.id} | Event: ${event_id} | Buyer: ${buyer_id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await supabaseAdmin.from('tickets')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent', pi.id);
        console.log(`❌ Payment failed: ${pi.id}`);
        break;
      }

      case 'account.updated': {
        const acct = event.data.object;
        await supabaseAdmin.from('host_stripe_accounts')
          .update({
            onboarding_complete: acct.details_submitted,
            payouts_enabled:     acct.payouts_enabled,
            charges_enabled:     acct.charges_enabled,
          })
          .eq('stripe_account_id', acct.id);
        console.log(`⛪ Host account updated: ${acct.id} | Payouts: ${acct.payouts_enabled}`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        await supabaseAdmin.from('tickets')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent', charge.payment_intent);
        console.log(`↩️  Refund processed: ${charge.payment_intent}`);
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    // Still return 200 so Stripe doesn't retry — log for manual review
    res.json({ received: true, warning: err.message });
  }
});

// ─── START ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✝  Christ Link API v2.0 running on port ${PORT}`);
  console.log(`   Supabase:  ${process.env.SUPABASE_URL}`);
  console.log(`   Platform:  ${PLATFORM_ACCOUNT}`);
  console.log(`   Fee:       ${PLATFORM_FEE_PCT * 100}% + $${HOST_LISTING_FEE/100} listing\n`);
});
