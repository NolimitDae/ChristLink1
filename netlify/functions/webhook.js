const { supabaseAdmin, stripe } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Netlify passes body as string — need raw body for signature verification
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('Webhook signature failed:', e.message);
    return { statusCode: 400, body: `Webhook Error: ${e.message}` };
  }

  try {
    switch (stripeEvent.type) {

      case 'payment_intent.succeeded': {
        const pi = stripeEvent.data.object;
        if (pi.metadata.type === 'listing_fee') {
          if (pi.metadata.event_id) {
            await supabaseAdmin.from('events')
              .update({ listing_fee_paid: true, listing_payment_id: pi.id })
              .eq('id', pi.metadata.event_id);
          }
          break;
        }
        await supabaseAdmin.from('tickets')
          .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
          .eq('stripe_payment_intent', pi.id);
        if (pi.metadata.ticket_type_id) {
          await supabaseAdmin.rpc('increment_tickets_sold', {
            p_ticket_type_id: pi.metadata.ticket_type_id,
            p_qty: parseInt(pi.metadata.qty) || 1,
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = stripeEvent.data.object;
        await supabaseAdmin.from('tickets')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent', pi.id);
        break;
      }

      case 'account.updated': {
        const acct = stripeEvent.data.object;
        await supabaseAdmin.from('host_stripe_accounts')
          .update({
            onboarding_complete: acct.details_submitted,
            payouts_enabled:     acct.payouts_enabled,
            charges_enabled:     acct.charges_enabled,
          })
          .eq('stripe_account_id', acct.id);
        break;
      }

      case 'charge.refunded': {
        const charge = stripeEvent.data.object;
        await supabaseAdmin.from('tickets')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent', charge.payment_intent);
        break;
      }
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (e) {
    console.error('Webhook handler error:', e.message);
    // Return 200 so Stripe doesn't retry — log for review
    return { statusCode: 200, body: JSON.stringify({ received: true, warning: e.message }) };
  }
};
