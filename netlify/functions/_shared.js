/**
 * CHRIST LINK — Shared helpers for Netlify Functions
 * Imported by every function file
 */
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

// ─── CLIENTS ────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── CONSTANTS ──────────────────────────────────────────────
const PLATFORM_ACCOUNT = process.env.CHRISTLINK_ACCOUNT_ID;
const PLATFORM_FEE_PCT = 0.05;
const HOST_LISTING_FEE = 1999; // $19.99
const STRIPE_PCT       = 0.029;
const STRIPE_FIXED     = 30;   // 30¢

// ─── CORS HEADERS ───────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  process.env.APP_URL || '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
};

// ─── HELPERS ────────────────────────────────────────────────
function json(statusCode, body, extra = {}) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS, ...extra },
    body: JSON.stringify(body),
  };
}

function ok(body)          { return json(200, body); }
function err(code, msg)    { return json(code, { error: msg }); }
function options()         { return { statusCode: 204, headers: CORS, body: '' }; }

async function requireAuth(event) {
  const auth = event.headers.authorization || event.headers.Authorization || '';
  if (!auth.startsWith('Bearer ')) return { authErr: err(401, 'Authentication required.') };
  const token = auth.replace('Bearer ', '');
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return { authErr: err(401, 'Invalid or expired session.') };
    return { user, userId: user.id };
  } catch {
    return { authErr: err(401, 'Authentication failed.') };
  }
}

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

module.exports = {
  supabase, supabaseAdmin, stripe,
  PLATFORM_ACCOUNT, PLATFORM_FEE_PCT, HOST_LISTING_FEE, STRIPE_PCT, STRIPE_FIXED,
  CORS, json, ok, err, options, requireAuth, calcAmounts,
};
