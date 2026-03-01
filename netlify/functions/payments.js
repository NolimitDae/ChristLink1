const {
  supabaseAdmin, stripe,
  HOST_LISTING_FEE, PLATFORM_ACCOUNT,
  ok, err, options, requireAuth, calcAmounts,
} = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();

  const path = event.path
    .replace('/.netlify/functions/payments', '')
    .replace('/api', '');

  const body = event.body ? JSON.parse(event.body) : {};

  // GET /api/price-breakdown
  if (path === '/price-breakdown' && event.httpMethod === 'GET') {
    const { price, qty = 1, absorb = 'true' } = event.queryStringParameters || {};
    if (!price) return err(400, 'Price required.');
    const amounts = calcAmounts(Number(price), Number(qty), absorb === 'true');
    return ok(amounts);
  }

  // POST /api/tax-estimate
  if (path === '/tax-estimate' && event.httpMethod === 'POST') {
    const { amountCents } = body;
    if (!amountCents) return err(400, 'Amount required.');
    try {
      const calculation = await stripe.tax.calculations.create({
        currency: 'usd',
        line_items: [{ amount: amountCents, reference: 'ticket' }],
        customer_details: {
          address_source: 'shipping',
          address: { country: 'US' },
          taxability_override: 'none',
        },
      });
      return ok({
        taxAmountCents: calculation.tax_amount_exclusive,
        totalCents:     calculation.amount_total,
        calculationId:  calculation.id,
      });
    } catch {
      return ok({ taxAmountCents: 0, totalCents: amountCents, calculationId: null });
    }
  }

  // All remaining routes require auth
  const { user, userId, authErr } = await requireAuth(event);
  if (authErr) return authErr;

  // POST /api/charge-listing-fee
  if (path === '/charge-listing-fee' && event.httpMethod === 'POST') {
    const { paymentMethodId, eventId, hostEmail } = body;
    if (!paymentMethodId || !eventId) return err(400, 'Payment method and event ID required.');

    const { data: ev } = await supabaseAdmin
      .from('events').select('id, name, listing_fee_paid')
      .eq('id', eventId).eq('host_id', userId).single();

    if (!ev) return err(404, 'Event not found or not yours.');
    if (ev.listing_fee_paid) return err(400, 'Listing fee already paid.');

    try {
      const intent = await stripe.paymentIntents.create({
        amount:         HOST_LISTING_FEE,
        currency:       'usd',
        payment_method: paymentMethodId,
        confirm:        true,
        receipt_email:  hostEmail || user.email,
        description:    `Christ Link listing fee — ${ev.name}`,
        automatic_tax:  { enabled: true },
        metadata:       { type: 'listing_fee', event_id: eventId, host_id: userId },
        return_url:     `${process.env.APP_URL}/?listing_success=1`,
      }, { idempotencyKey: `listing-fee-${eventId}` });

      if (intent.status === 'succeeded') {
        await supabaseAdmin.from('events')
          .update({ listing_fee_paid: true, listing_payment_id: intent.id })
          .eq('id', eventId);
        return ok({ success: true, intentId: intent.id });
      }
      return ok({ success: false, status: intent.status, clientSecret: intent.client_secret });
    } catch (e) {
      return err(400, e.message);
    }
  }

  // POST /api/create-payment-intent
  if (path === '/create-payment-intent' && event.httpMethod === 'POST') {
    const { eventId, ticketTypeId, qty = 1, buyerEmail } = body;
    if (!eventId || !ticketTypeId) return err(400, 'Event ID and ticket type required.');

    const { data: ev } = await supabaseAdmin
      .from('events')
      .select('*, host_stripe_accounts!inner(stripe_account_id, payouts_enabled)')
      .eq('id', eventId).eq('status', 'published').single();

    if (!ev)          return err(404, 'Event not found.');
    if (!ev.is_paid)  return err(400, 'This event is free — use RSVP instead.');
    if (!ev.host_stripe_accounts?.payouts_enabled) {
      return err(400, 'Host payment account not fully set up yet.');
    }

    const { data: tt } = await supabaseAdmin
      .from('ticket_types').select('*').eq('id', ticketTypeId).eq('event_id', eventId).single();
    if (!tt) return err(404, 'Ticket type not found.');

    if (tt.quantity !== null && qty > (tt.quantity - tt.sold)) {
      return err(400, `Only ${tt.quantity - tt.sold} tickets remaining.`);
    }

    const amounts        = calcAmounts(tt.price_cents, qty, ev.absorb_stripe_fee);
    const idempotencyKey = `pi-${userId}-${eventId}-${ticketTypeId}-${qty}-${Date.now()}`;

    try {
      const intent = await stripe.paymentIntents.create({
        amount:        amounts.chargeAmount,
        currency:      'usd',
        receipt_email: buyerEmail || user.email,
        description:   `${qty}x ${tt.name} — ${ev.name}`,
        automatic_tax: { enabled: true },
        metadata: {
          event_id: eventId, ticket_type_id: ticketTypeId,
          buyer_id: userId, qty, platform_fee: amounts.platformFee,
          host_receives: amounts.hostReceives, idempotency_key: idempotencyKey,
        },
        transfer_data:          { destination: ev.host_stripe_accounts.stripe_account_id },
        application_fee_amount: amounts.platformFee,
      }, { idempotencyKey });

      const taxAmount = intent.amount_details?.tax?.amount || 0;

      await supabaseAdmin.from('tickets').insert({
        event_id: eventId, ticket_type_id: ticketTypeId,
        user_id: userId, quantity: qty,
        unit_price_cents:    tt.price_cents,
        total_charged_cents: amounts.chargeAmount + taxAmount,
        platform_fee_cents:  amounts.platformFee,
        stripe_fee_cents:    amounts.stripeFee,
        host_receives_cents: amounts.hostReceives,
        stripe_payment_intent:  intent.id,
        stripe_idempotency_key: idempotencyKey,
        status:      'pending',
        buyer_email: buyerEmail || user.email,
      });

      return ok({ clientSecret: intent.client_secret, breakdown: { ...amounts, taxAmount }, intentId: intent.id });
    } catch (e) {
      return err(400, e.message);
    }
  }

  // POST /api/connect-onboard
  if (path === '/connect-onboard' && event.httpMethod === 'POST') {
    try {
      const { data: existing } = await supabaseAdmin
        .from('host_stripe_accounts').select('stripe_account_id, onboarding_complete')
        .eq('user_id', userId).single();

      let accountId = existing?.stripe_account_id;

      if (!accountId) {
        const account = await stripe.accounts.create({
          type: 'express', email: user.email,
          capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
          metadata: { christlink_user_id: userId },
        });
        accountId = account.id;
        await supabaseAdmin.from('host_stripe_accounts')
          .insert({ user_id: userId, stripe_account_id: accountId });
      }

      const link = await stripe.accountLinks.create({
        account:     accountId,
        refresh_url: `${process.env.APP_URL}/?reauth=1`,
        return_url:  `${process.env.APP_URL}/?connected=1`,
        type:        'account_onboarding',
      });

      return ok({ url: link.url, accountId });
    } catch (e) {
      return err(400, e.message);
    }
  }

  return err(404, 'Not found.');
};
