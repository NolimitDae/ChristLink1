/**
 * CHRIST LINK — Railway Backend v2.1
 * Express + Supabase + Stripe
 */
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const compression  = require('compression');
const path         = require('path');
const { createClient } = require('@supabase/supabase-js');
const Stripe       = require('stripe');
const forge        = require('node-forge');
const JSZip        = require('jszip');
const crypto       = require('crypto');

const app  = express();
const PORT = process.env.PORT || 4242;
// Trust Railway's proxy — required for rate limiting and
// correct IP detection behind Railway's load balancer
app.set('trust proxy', 1);

// ─── CLIENTS ────────────────────────────────────────────────
// Validate required env vars — warn but don't crash so /health still responds
const REQUIRED_VARS = [
  'SUPABASE_URL','SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','APP_URL',
];
const missingVars = REQUIRED_VARS.filter(v => !process.env[v]);
if (missingVars.length) {
  if (process.env.NODE_ENV === 'production') {
    console.error(`❌ Missing required env vars: ${missingVars.join(', ')}. Refusing to start.`);
    process.exit(1);
  } else {
    console.warn(`⚠️  Missing env vars: ${missingVars.join(', ')}`);
    console.warn('   Some API routes will not work until these are set.');
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL      || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder'
);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL             || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

// ─── CONSTANTS ──────────────────────────────────────────────
const PLATFORM_FEE_PCT = 0.07;
const HOST_LISTING_FEE = 1999;
const STRIPE_PCT       = 0.029;
const STRIPE_FIXED     = 30;

// ─── MIDDLEWARE ─────────────────────────────────────────────
// Webhook needs raw body BEFORE json()
app.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.APP_URL
    ? process.env.APP_URL.split(',').map(s => s.trim())
    : ['http://localhost:4242', 'http://127.0.0.1:4242'],
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    if (/\.html?$/.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
    } else if (/\.(js|css|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day
    } else if (/\.json$/.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    }
  },
}));

// Ensure storage buckets exist (runs once on startup)
(async () => {
  const buckets = [
    { name: 'avatars',        public: true  },
    { name: 'event-images',   public: true  },
    { name: 'identity-docs',  public: false },
  ];
  for (const b of buckets) {
    const { error } = await supabaseAdmin.storage.createBucket(b.name, { public: b.public });
    if (error && !error.message.includes('already exists')) {
      console.warn(`[storage] Could not create bucket "${b.name}":`, error.message);
    } else if (!error) {
      console.log(`[storage] Created bucket "${b.name}"`);
    }
  }
  // Forum backfill removed — now a schema migration in schema.sql (migrations section).
})();

// ─── RATE LIMITERS ──────────────────────────────────────────
const apiLimiter  = rateLimit({ windowMs: 15*60*1000, max: 200, message: { error: 'Too many requests.' } });
const authLimiter = rateLimit({ windowMs: 15*60*1000, max: 10,  message: { error: 'Too many auth attempts.' } });
const pmtLimiter  = rateLimit({ windowMs: 60*60*1000, max: 20,  message: { error: 'Too many payment attempts.' } });
app.use('/api', apiLimiter);

// ─── HELPERS ────────────────────────────────────────────────
// Strip all HTML tags (and any stray angle brackets, which can still form a tag
// when the text is later concatenated into innerHTML) to prevent stored XSS.
function sanitizeText(str, maxLen = 5000) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim().slice(0, maxLen);
}

// Escape text for interpolation into server-generated HTML (emails, OG tags)
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Accept only absolute http(s) URLs without characters that break out of HTML attributes.
// Returns the normalized URL, '' to clear the field, or null if invalid.
function sanitizeUrl(str) {
  if (str === null || str === '') return '';
  if (typeof str !== 'string') return null;
  const trimmed = str.trim();
  if (!trimmed) return '';
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    const out = u.toString();
    return /["'<>`\s]/.test(out) ? null : out;
  } catch { return null; }
}

// Colors are interpolated into inline styles, so only allow plain hex/rgb(a)/hsl(a)/simple gradients.
function sanitizeColor(str) {
  if (str === null || str === '') return '';
  if (typeof str !== 'string') return null;
  const s = str.trim();
  const color = '(#[0-9a-fA-F]{3,8}|rgba?\\([\\d\\s.,%]+\\)|hsla?\\([\\d\\s.,%deg]+\\))';
  const single = new RegExp(`^${color}$`);
  const gradient = new RegExp(`^linear-gradient\\(\\s*\\d{1,3}deg\\s*(,\\s*${color}(\\s+\\d{1,3}%)?\\s*){2,4}\\)$`);
  return single.test(s) || gradient.test(s) ? s : null;
}

// PostgREST .or()/.ilike() filters are string-built; strip characters that change filter syntax.
function sanitizeSearch(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[,()*%\\:"']/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
}

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// Parse and validate a base64 image data URL. Returns { mimeType, buffer, ext } or { error, status }.
function parseImageDataUrl(dataUrl, { maxBytes = 5 * 1024 * 1024, allowPdf = false } = {}) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return { error: 'Invalid image data.', status: 400 };
  const matches = dataUrl.match(/^data:([a-zA-Z0-9.+/-]+);base64,(.+)$/);
  if (!matches) return { error: 'Bad data URL format.', status: 400 };
  const mimeType = matches[1].toLowerCase();
  if (!IMAGE_MIME.has(mimeType) && !(allowPdf && mimeType === 'application/pdf'))
    return { error: 'Only JPEG, PNG, WebP or GIF images are allowed.', status: 415 };
  const buffer = Buffer.from(matches[2], 'base64');
  if (buffer.length > maxBytes) return { error: `File must be under ${Math.round(maxBytes / 1024 / 1024)}MB.`, status: 413 };
  // Check magic bytes so a mislabeled HTML/SVG file can't be stored as an "image"
  const sig = buffer.subarray(0, 12);
  const isJpeg = sig[0] === 0xFF && sig[1] === 0xD8;
  const isPng  = sig.subarray(0, 4).toString('hex') === '89504e47';
  const isGif  = sig.subarray(0, 3).toString('ascii') === 'GIF';
  const isWebp = sig.subarray(0, 4).toString('ascii') === 'RIFF' && sig.subarray(8, 12).toString('ascii') === 'WEBP';
  const isPdf  = sig.subarray(0, 4).toString('ascii') === '%PDF';
  const ok = { 'image/jpeg': isJpeg, 'image/png': isPng, 'image/gif': isGif, 'image/webp': isWebp, 'application/pdf': isPdf }[mimeType];
  if (!ok) return { error: 'File contents do not match its type.', status: 415 };
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'application/pdf': 'pdf' }[mimeType];
  return { mimeType, buffer, ext };
}

// Unambiguous, cryptographically random ticket code (no 0/O/1/I)
function generateTicketCode(len = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = v => typeof v === 'string' && UUID_RE.test(v);

// Total spots taken for an event: confirmed RSVPs + confirmed ticket quantities
async function countSpotsTaken(eventId) {
  const [{ count: rsvpCount }, { data: ticketRows }] = await Promise.all([
    supabaseAdmin.from('rsvps').select('*', { count: 'exact', head: true })
      .eq('event_id', eventId).eq('status', 'confirmed'),
    supabaseAdmin.from('tickets').select('quantity').eq('event_id', eventId).eq('status', 'confirmed'),
  ]);
  return (rsvpCount || 0) + (ticketRows || []).reduce((s, t) => s + (t.quantity || 1), 0);
}

// Resolve a promoter referral code (?ref=CODE) for an event → promoter id or null
async function resolvePromoter(eventId, ref) {
  if (!ref || typeof ref !== 'string') return null;
  const code = ref.trim().toUpperCase().slice(0, 40);
  if (!/^[A-Z0-9_-]+$/.test(code)) return null;
  const { data } = await supabaseAdmin.from('event_promoters')
    .select('id').eq('event_id', eventId).eq('code', code).eq('active', true).maybeSingle();
  return data?.id || null;
}

// Optional auth: returns the user for a valid Bearer token, else null (never rejects)
async function getOptionalUser(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser(auth.replace('Bearer ', ''));
    return user || null;
  } catch { return null; }
}

function calcAmounts(priceCents, qty, absorb) {
  const face        = priceCents * qty;
  const platformFee = Math.round(face * PLATFORM_FEE_PCT); // added to attendee charge
  const baseCharge  = face + platformFee;                   // attendee pays face + 7%
  const chargeAmount = absorb
    ? baseCharge
    : Math.ceil((baseCharge + STRIPE_FIXED) / (1 - STRIPE_PCT));
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
app.get('/health', (req, res) => res.json({
  status: missingVars.length ? 'degraded' : 'ok',
  service: 'christlink',
  ts: new Date().toISOString(),
  ...(missingVars.length && { missing_vars: missingVars }),
}));

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
  try {
    const [profileResult, stripeResult, followersResult, followingResult] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', req.userId).single(),
      supabaseAdmin.from('host_stripe_accounts')
        .select('stripe_account_id, onboarding_complete, payouts_enabled, charges_enabled')
        .eq('user_id', req.userId),
      supabaseAdmin.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', req.userId),
      supabaseAdmin.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', req.userId),
    ]);
    if (profileResult.error || !profileResult.data) {
      const fallback = {
        id:         req.userId,
        email:      req.user.email,
        full_name:  req.user.user_metadata?.full_name || req.user.email?.split('@')[0] || '',
        role:       'attendee',
        created_at: new Date().toISOString(),
        host_stripe_accounts: [],
        followers_count: 0,
        following_count: 0,
      };
      return res.json(fallback);
    }
    res.json({
      ...profileResult.data,
      host_stripe_accounts: stripeResult.data || [],
      followers_count: followersResult.count || 0,
      following_count: followingResult.count || 0,
    });
  } catch (e) {
    console.error('[profile GET]', e.message);
    res.status(500).json({ error: 'Could not load profile.' });
  }
});

app.get('/api/profiles/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, bio, city, avatar_url, avatar_color, role, created_at, instagram_url, facebook_url, tiktok_url')
    .eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Profile not found.' });
  res.json(data);
});

app.get('/api/profiles/:id/stats', async (req, res) => {
  const hostId = req.params.id;
  const [{ data: profile }, { data: events }] = await Promise.all([
    supabaseAdmin.from('profiles').select('role').eq('id', hostId).single(),
    supabaseAdmin.from('events').select('id').eq('host_id', hostId).eq('status', 'published'),
  ]);
  const eventIds = (events || []).map(e => e.id);
  let totalAttendees = 0;
  if (eventIds.length) {
    const { count } = await supabaseAdmin
      .from('tickets').select('*', { count: 'exact', head: true })
      .in('event_id', eventIds).eq('status', 'confirmed');
    totalAttendees = count || 0;
  }
  res.json({
    eventsHosted:   (events || []).length,
    totalAttendees,
    isVerified:     profile?.role === 'verified' || profile?.role === 'admin',
  });
});

// GET /api/profile/public/:userId — full profile for authenticated, restricted for guests
app.get('/api/profile/public/:userId', async (req, res) => {
  try {
    const targetId = req.params.userId;
    const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
    let viewerId = null;
    if (token) {
      const { data: authData } = await supabase.auth.getUser(token);
      viewerId = authData?.user?.id || null;
    }

    const [profileRes, followersRes, followingRes] = await Promise.all([
      supabaseAdmin.from('profiles')
        .select('id, full_name, avatar_url, avatar_color, avatar_ring_color, banner_url, bio, city, role, created_at, instagram_url, facebook_url, tiktok_url, bible_verse, bible_verse_reference, bible_version, hot_takes, hobbies, connect_tags, prayer_request, testimony, prayer_supporters')
        .eq('id', targetId).single(),
      supabaseAdmin.from('user_follows').select('*', { count: 'exact', head: true }).eq('following_id', targetId),
      supabaseAdmin.from('user_follows').select('*', { count: 'exact', head: true }).eq('follower_id', targetId),
    ]);

    if (profileRes.error || !profileRes.data) return res.status(404).json({ error: 'Profile not found.' });
    const data = profileRes.data;

    // Check if viewer is following this profile
    let is_following = false;
    if (viewerId && viewerId !== targetId) {
      const { data: followRow } = await supabaseAdmin.from('user_follows')
        .select('id').eq('follower_id', viewerId).eq('following_id', targetId).maybeSingle();
      is_following = !!followRow;
    }

    const counts = { followers_count: followersRes.count || 0, following_count: followingRes.count || 0 };

    if (!viewerId) {
      return res.json({ id: data.id, full_name: data.full_name, avatar_url: data.avatar_url, avatar_color: data.avatar_color, banner_url: data.banner_url, restricted: true, ...counts });
    }
    res.json({ ...data, ...counts, is_following });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/follow/:userId — follow a user
app.post('/api/follow/:userId', requireAuth, async (req, res) => {
  const followingId = req.params.userId;
  if (followingId === req.userId) return res.status(400).json({ error: 'Cannot follow yourself.' });
  const { error } = await supabaseAdmin.from('user_follows')
    .insert({ follower_id: req.userId, following_id: followingId });
  if (error && error.code !== '23505') return res.status(500).json({ error: error.message }); // 23505 = unique violation (already following)
  res.json({ following: true });
});

// DELETE /api/follow/:userId — unfollow a user
app.delete('/api/follow/:userId', requireAuth, async (req, res) => {
  const { error } = await supabaseAdmin.from('user_follows')
    .delete().eq('follower_id', req.userId).eq('following_id', req.params.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ following: false });
});

// GET /api/followers — current user's followers list (for invite picker)
app.get('/api/followers', requireAuth, async (req, res) => {
  try {
    const { data: follows, error } = await supabaseAdmin
      .from('user_follows')
      .select('follower_id')
      .eq('following_id', req.userId);
    if (error) return res.status(500).json({ error: error.message });
    if (!follows || follows.length === 0) return res.json({ followers: [] });
    const ids = follows.map(f => f.follower_id);
    const { data: profiles, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, avatar_url, avatar_color')
      .in('id', ids);
    if (pErr) return res.status(500).json({ error: pErr.message });
    res.json({ followers: profiles || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/followers/:userId — list of users following this person
app.get('/api/followers/:userId', async (req, res) => {
  try {
    const { data: follows, error } = await supabaseAdmin
      .from('user_follows').select('follower_id')
      .eq('following_id', req.params.userId)
      .order('created_at', { ascending: false }).limit(200);
    if (error) return res.status(500).json({ error: error.message });
    if (!follows || follows.length === 0) return res.json({ users: [] });
    const ids = follows.map(f => f.follower_id);
    const { data: profiles } = await supabaseAdmin
      .from('profiles').select('id, full_name, avatar_url, avatar_color, city, role').in('id', ids);
    res.json({ users: profiles || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/following/:userId — list of users this person follows
app.get('/api/following/:userId', async (req, res) => {
  try {
    const { data: follows, error } = await supabaseAdmin
      .from('user_follows').select('following_id')
      .eq('follower_id', req.params.userId)
      .order('created_at', { ascending: false }).limit(200);
    if (error) return res.status(500).json({ error: error.message });
    if (!follows || follows.length === 0) return res.json({ users: [] });
    const ids = follows.map(f => f.following_id);
    const { data: profiles } = await supabaseAdmin
      .from('profiles').select('id, full_name, avatar_url, avatar_color, city, role').in('id', ids);
    res.json({ users: profiles || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/upload-banner — same dataUrl pattern as upload-avatar
app.post('/api/upload-banner', requireAuth, async (req, res) => {
  const img = parseImageDataUrl(req.body.dataUrl);
  if (img.error) return res.status(img.status).json({ error: img.error });
  try {
    const { mimeType, buffer, ext } = img;
    const path     = `banners/${req.userId}/banner.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from('banner-images')
      .upload(path, buffer, { upsert: true, contentType: mimeType });
    if (upErr) return res.status(400).json({ error: upErr.message });
    const { data: { publicUrl } } = supabaseAdmin.storage.from('banner-images').getPublicUrl(path);
    res.json({ url: publicUrl });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/profile', requireAuth, async (req, res) => {
  const {
    full_name, bio, city, avatar_url, avatar_color, avatar_ring_color,
    instagram_url, facebook_url, tiktok_url,
    banner_url, bible_verse, bible_verse_reference, bible_version,
    hot_takes, hobbies, connect_tags, prayer_request, testimony,
  } = req.body;
  const updates = {};
  const text = { full_name: 80, bio: 1000, city: 80, bible_verse: 1000, bible_verse_reference: 80,
    bible_version: 20, hot_takes: 1000, hobbies: 500, prayer_request: 1000, testimony: 3000 };
  for (const [key, max] of Object.entries(text)) {
    const v = req.body[key];
    if (v === undefined) continue;
    updates[key] = v === null ? null : sanitizeText(String(v), max);
  }
  // Image URLs come from our own upload endpoints; silently ignore anything malformed
  for (const key of ['avatar_url', 'banner_url']) {
    const v = req.body[key];
    if (v === undefined) continue;
    const url = sanitizeUrl(v);
    if (url !== null) updates[key] = url || null;
  }
  // Social links are typed by the user: accept "instagram.com/me", "@me" or a full URL
  const SOCIAL_HOSTS = { instagram_url: 'instagram.com', facebook_url: 'facebook.com', tiktok_url: 'tiktok.com' };
  for (const [key, host] of Object.entries(SOCIAL_HOSTS)) {
    let v = req.body[key];
    if (v === undefined) continue;
    if (typeof v === 'string') {
      v = v.trim();
      if (/^@[\w.]+$/.test(v)) v = `https://${host}/${key === 'tiktok_url' ? v : v.slice(1)}`;
      else if (v && !/^https?:\/\//i.test(v)) v = `https://${v}`;
    }
    const url = sanitizeUrl(v);
    if (url === null) return res.status(400).json({ error: `Please enter a valid ${host} link.` });
    updates[key] = url || null;
  }
  // Colors are interpolated into inline styles — drop anything that isn't a plain color/gradient
  for (const key of ['avatar_color', 'avatar_ring_color']) {
    const v = req.body[key];
    if (v === undefined) continue;
    const color = sanitizeColor(v);
    if (color !== null) updates[key] = color || null;
  }
  if (connect_tags !== undefined) {
    updates.connect_tags = Array.isArray(connect_tags)
      ? connect_tags.filter(t => typeof t === 'string').slice(0, 20).map(t => sanitizeText(t, 40)).filter(Boolean)
      : [];
  }
  updates.updated_at = new Date().toISOString();
  // Try update first (profile should exist from signup trigger)
  let { data, error } = await supabaseAdmin
    .from('profiles').update(updates).eq('id', req.userId).select().single();
  if (error || !data) {
    // Profile row missing — insert it
    const insert = await supabaseAdmin
      .from('profiles')
      .insert({ id: req.userId, email: req.user.email, ...updates })
      .select().single();
    if (insert.error) return res.status(400).json({ error: insert.error.message });
    return res.json(insert.data);
  }
  res.json(data);
});

// Toggle prayer support for another user's prayer request
app.post('/api/profile/prayer-support', requireAuth, async (req, res) => {
  const { target_user_id } = req.body;
  if (!target_user_id) return res.status(400).json({ error: 'target_user_id required' });
  if (target_user_id === req.userId) return res.status(400).json({ error: 'Cannot support your own prayer' });
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('prayer_supporters').eq('id', target_user_id).single();
  const supporters = Array.isArray(profile?.prayer_supporters) ? profile.prayer_supporters : [];
  const alreadySupporting = supporters.includes(req.userId);
  const updated = alreadySupporting
    ? supporters.filter(id => id !== req.userId)
    : [...supporters, req.userId];
  const { data, error } = await supabaseAdmin
    .from('profiles').update({ prayer_supporters: updated }).eq('id', target_user_id)
    .select('prayer_supporters').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ prayer_supporters: data.prayer_supporters, supporting: !alreadySupporting });
});

// Upload avatar via server (bypasses Supabase storage RLS)
app.post('/api/upload-avatar', requireAuth, async (req, res) => {
  const img = parseImageDataUrl(req.body.dataUrl);
  if (img.error) return res.status(img.status).json({ error: img.error });
  try {
    const { mimeType, buffer, ext } = img;
    const path     = `avatars/${req.userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, buffer, { upsert: true, contentType: mimeType });
    if (upErr) return res.status(400).json({ error: upErr.message });
    const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(path);
    res.json({ url: publicUrl });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Upload event image via server (bypasses Supabase storage RLS)
app.post('/api/upload-event-image', requireAuth, async (req, res) => {
  const { type } = req.body; // type: 'cover' | 'gallery'
  const img = parseImageDataUrl(req.body.dataUrl);
  if (img.error) return res.status(img.status).json({ error: img.error });
  try {
    const { mimeType, buffer, ext } = img;
    const suffix   = type === 'cover' ? 'cover' : `gallery-${crypto.randomBytes(6).toString('hex')}`;
    const path     = `events/${req.userId}/${Date.now()}-${suffix}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from('event-images')
      .upload(path, buffer, { upsert: true, contentType: mimeType });
    if (upErr) return res.status(400).json({ error: upErr.message });
    const { data: { publicUrl } } = supabaseAdmin.storage.from('event-images').getPublicUrl(path);
    res.json({ url: publicUrl });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Upload forum image via server (bypasses Supabase storage RLS)
app.post('/api/upload-forum-image', requireAuth, async (req, res) => {
  const img = parseImageDataUrl(req.body.dataUrl);
  if (img.error) return res.status(img.status).json({ error: img.error });
  try {
    const { mimeType, buffer, ext } = img;
    const path     = `forum/${req.userId}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from('event-images')
      .upload(path, buffer, { upsert: false, contentType: mimeType });
    if (upErr) return res.status(400).json({ error: upErr.message });
    const { data: { publicUrl } } = supabaseAdmin.storage.from('event-images').getPublicUrl(path);
    res.json({ url: publicUrl });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════════════════════
// EVENTS
// ════════════════════════════════════════════════════════════
// Haversine distance in miles between two lat/lng points
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Geocode an address string to {lat, lng} using Nominatim (free, no key)
async function geocodeAddress(parts) {
  const q = parts.filter(Boolean).join(', ');
  if (!q) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`, {
      headers: { 'User-Agent': 'ChristLink/1.0' }
    });
    const data = await res.json();
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

app.get('/api/events', async (req, res) => {
  const { is_paid, format, host_id, lat, lng, radius = 100 } = req.query;
  const city = sanitizeSearch(req.query.city);
  const type = sanitizeSearch(req.query.type);
  const q    = sanitizeSearch(req.query.q);
  const limit  = Math.min(Math.max(parseInt(req.query.limit)  || 50,  1), 200);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);
  const useRadius = lat && lng;
  let query = supabaseAdmin
    .from('events_with_details').select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true, nullsFirst: false })
    // Fetch more when doing radius filter so we have enough to filter from
    .range(Number(offset), Number(offset) + (useRadius ? 499 : Number(limit) - 1));
  if (!useRadius && city) query = query.ilike('city', `%${city}%`);
  if (type)    query = query.ilike('event_type', `%${type}%`);
  if (format && ['in_person','online','hybrid'].includes(format)) query = query.eq('format', format);
  if (host_id && isUuid(host_id)) query = query.eq('host_id', host_id);
  else if (req.query.include_past !== 'true') {
    // Public listings only show events that haven't ended yet
    const now = new Date().toISOString();
    query = query.or(`end_date.gte.${now},start_date.gte.${now},and(start_date.is.null,end_date.is.null)`);
  }
  if (is_paid !== undefined) query = query.eq('is_paid', is_paid === 'true');
  if (q)       query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%,event_type.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  let events = data || [];
  // Radius filter: keep events that have lat/lng within radius miles, or fall back to city match
  if (useRadius) {
    const uLat = parseFloat(lat), uLng = parseFloat(lng), r = parseFloat(radius);
    events = events.filter(ev => {
      if (ev.lat && ev.lng) return haversineMiles(uLat, uLng, ev.lat, ev.lng) <= r;
      return false; // exclude events with no coordinates from radius search
    });
  }
  res.json({ events });
});

app.get('/api/events/:id', async (req, res) => {
  if (!isUuid(req.params.id)) return res.status(404).json({ error: 'Event not found.' });
  const { data: ev, error } = await supabaseAdmin
    .from('events_with_details').select('*').eq('id', req.params.id).single();
  if (error || !ev) return res.status(404).json({ error: 'Event not found.' });

  const viewer = await getOptionalUser(req);
  const isHost = viewer?.id === ev.host_id;
  // Drafts are private to their host (and admins)
  if (ev.status === 'draft' && !isHost) {
    let isAdmin = false;
    if (viewer) {
      const { data: prof } = await supabaseAdmin.from('profiles').select('role').eq('id', viewer.id).single();
      isAdmin = prof?.role === 'admin';
    }
    if (!isAdmin) return res.status(404).json({ error: 'Event not found.' });
  }

  const [{ data: ticketTypes }, spotsTaken, viewerRsvp, viewerWaitlist] = await Promise.all([
    supabaseAdmin.from('ticket_types').select('*').eq('event_id', req.params.id)
      .order('sort_order', { ascending: true }).order('price_cents', { ascending: true }),
    countSpotsTaken(req.params.id),
    viewer ? supabaseAdmin.from('rsvps').select('status').eq('event_id', req.params.id).eq('user_id', viewer.id).maybeSingle() : { data: null },
    viewer ? supabaseAdmin.from('event_waitlist').select('id').eq('event_id', req.params.id).eq('user_id', viewer.id).maybeSingle() : { data: null },
  ]);

  // Count a page view (not the host's own views); fire-and-forget
  if (!isHost && ev.status === 'published') {
    supabaseAdmin.rpc('increment_event_views', { p_event_id: ev.id }).then(() => {}, () => {});
  }

  const now = Date.now();
  const tiers = (ticketTypes || []).map(tt => {
    const remaining = tt.quantity != null ? Math.max(0, tt.quantity - (tt.sold || 0)) : null;
    let sale_state = 'on_sale';
    if (tt.sales_start && new Date(tt.sales_start).getTime() > now) sale_state = 'upcoming';
    else if (tt.sales_end && new Date(tt.sales_end).getTime() < now) sale_state = 'ended';
    else if (remaining === 0) sale_state = 'sold_out';
    return { ...tt, remaining, sale_state };
  });
  const spotsLeft = ev.max_capacity ? Math.max(0, ev.max_capacity - spotsTaken) : null;

  // Hide host-only fields from everyone else
  const { listing_payment_id, view_count, ...publicEv } = ev;
  res.json({
    ...publicEv,
    ...(isHost && { listing_payment_id, view_count }),
    ticket_types: tiers,
    spots_taken: spotsTaken,
    spots_left:  spotsLeft,
    is_full:     spotsLeft === 0,
    viewer: viewer ? {
      rsvp_status: viewerRsvp?.data?.status || null,
      on_waitlist: !!viewerWaitlist?.data,
      is_host:     isHost,
    } : null,
  });
});

// Normalize host-editable event fields. Returns { fields } or { error }.
function normalizeEventFields(body) {
  const fields = {};
  const text = { name: 140, description: 8000, event_type: 60, age_group: 40, denomination: 80,
    venue_name: 140, address: 200, city: 80, state: 40, zip: 20 };
  for (const [k, max] of Object.entries(text)) {
    if (body[k] !== undefined) fields[k] = body[k] === null ? null : sanitizeText(String(body[k]), max);
  }
  if (body.format !== undefined) {
    if (!['in_person', 'online', 'hybrid'].includes(body.format)) return { error: 'Invalid event format.' };
    fields.format = body.format;
  }
  if (body.tags !== undefined) {
    fields.tags = Array.isArray(body.tags)
      ? body.tags.filter(t => typeof t === 'string').slice(0, 15).map(t => sanitizeText(t, 40)).filter(Boolean)
      : null;
  }
  for (const k of ['cover_url', 'online_url']) {
    if (body[k] === undefined) continue;
    const url = sanitizeUrl(body[k]);
    if (url === null) return { error: `${k === 'cover_url' ? 'Cover image' : 'Online link'} must be a valid http(s) URL.` };
    fields[k] = url || null;
  }
  if (body.gallery_urls !== undefined) {
    const urls = Array.isArray(body.gallery_urls) ? body.gallery_urls.slice(0, 12).map(sanitizeUrl) : [];
    if (urls.some(u => u === null)) return { error: 'Gallery images must be valid URLs.' };
    fields.gallery_urls = urls.filter(Boolean);
  }
  for (const k of ['start_date', 'end_date', 'sales_cutoff', 'publish_at']) {
    if (body[k] === undefined) continue;
    if (body[k] === null || body[k] === '') { fields[k] = null; continue; }
    const d = new Date(body[k]);
    if (isNaN(d.getTime())) return { error: `Invalid ${k.replace('_', ' ')}.` };
    fields[k] = d.toISOString();
  }
  if (fields.start_date && fields.end_date && new Date(fields.end_date) < new Date(fields.start_date))
    return { error: 'End time must be after the start time.' };
  if (body.max_capacity !== undefined) {
    if (body.max_capacity === null || body.max_capacity === '' || body.max_capacity === 0) fields.max_capacity = null;
    else {
      const n = parseInt(body.max_capacity, 10);
      if (!n || n < 1 || n > 1000000) return { error: 'Capacity must be a positive number.' };
      fields.max_capacity = n;
    }
  }
  if (body.forum_enabled !== undefined)     fields.forum_enabled     = !!body.forum_enabled;
  if (body.requires_approval !== undefined) fields.requires_approval = !!body.requires_approval;
  return { fields };
}

app.post('/api/events', requireAuth, async (req, res) => {
  const {
    name, description, cover_url, gallery_urls, event_type, age_group, format,
    denomination, tags, is_paid, absorb_stripe_fee,
    start_date, end_date, sales_cutoff, venue_name, address, city, state, zip, online_url, max_capacity,
    forum_enabled, publish_at,
  } = req.body;
  const norm = normalizeEventFields(req.body);
  if (norm.error) return res.status(400).json({ error: norm.error });
  const f = norm.fields;
  if (!f.name) return res.status(400).json({ error: 'Event name is required.' });
  await supabaseAdmin.from('profiles').update({ role: 'host' }).eq('id', req.userId).eq('role', 'attendee');
  // Geocode address to lat/lng for Near Me radius search
  const coords = format !== 'online' ? await geocodeAddress([address, city, state, zip]) : null;
  const { data, error } = await supabaseAdmin.from('events').insert({
    host_id: req.userId, name: f.name, description: f.description || null,
    cover_url: f.cover_url || null,
    gallery_urls: f.gallery_urls || [],
    event_type: f.event_type || null,
    age_group: f.age_group || 'All Ages',
    format: f.format || 'in_person',
    denomination: f.denomination || null, tags: f.tags || null,
    is_paid: is_paid === true,
    absorb_stripe_fee: absorb_stripe_fee !== false,
    start_date: f.start_date || null, end_date: f.end_date || null,
    sales_cutoff: f.sales_cutoff || f.end_date || null,
    venue_name: f.venue_name || null, address: f.address || null, city: f.city || null,
    state: f.state || null, zip: f.zip || null, online_url: f.online_url || null,
    max_capacity: f.max_capacity || null,
    forum_enabled: forum_enabled !== false,
    requires_approval: f.requires_approval === true,
    publish_at: f.publish_at || null,
    status: 'draft',
    lat: coords?.lat || null, lng: coords?.lng || null,
  }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.patch('/api/events/:id', requireAuth, async (req, res) => {
  const { data: ev } = await supabaseAdmin
    .from('events').select('id, host_id')
    .eq('id', req.params.id).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  const norm = normalizeEventFields(req.body);
  if (norm.error) return res.status(400).json({ error: norm.error });
  const { publish_at: _ignored, ...updates } = norm.fields; // scheduling goes through /schedule
  if (updates.name === '' || updates.name === null) return res.status(400).json({ error: 'Event name is required.' });
  if (!Object.keys(updates).length) return res.status(400).json({ error: 'No fields to update.' });
  // Re-geocode if any address field changed (use req.body.format — updates.format is only set if format was in the PATCH body)
  const addrChanged = ['address','city','state','zip','venue_name'].some(k => req.body[k] !== undefined);
  if (addrChanged && req.body.format !== 'online') {
    const coords = await geocodeAddress([req.body.address, req.body.city, req.body.state, req.body.zip]);
    if (coords) { updates.lat = coords.lat; updates.lng = coords.lng; }
  }
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('events').update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  // Raising (or removing) capacity can free spots for people on the waitlist
  if (updates.max_capacity !== undefined) promoteWaitlist(req.params.id).catch(() => {});
  res.json(data);
});

app.patch('/api/events/:id/publish', requireAuth, async (req, res) => {
  const { data: ev } = await supabaseAdmin
    .from('events').select('id, is_paid, listing_fee_paid, status')
    .eq('id', req.params.id).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.status !== 'draft') return res.status(400).json({ error: 'Only draft events can be published.' });
  if (ev.is_paid && !ev.listing_fee_paid) return res.status(402).json({ error: 'Listing fee required.' });
  const { data, error } = await supabaseAdmin
    .from('events').update({ status: 'published', publish_at: null })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Schedule an event to auto-publish at a future datetime
app.patch('/api/events/:id/schedule', requireAuth, async (req, res) => {
  const { publish_at } = req.body;
  if (!publish_at) return res.status(400).json({ error: 'publish_at is required.' });
  const scheduleDate = new Date(publish_at);
  if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date())
    return res.status(400).json({ error: 'Schedule date must be in the future.' });
  const { data: ev } = await supabaseAdmin
    .from('events').select('id, is_paid, listing_fee_paid, status')
    .eq('id', req.params.id).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.status !== 'draft') return res.status(400).json({ error: 'Only draft events can be scheduled.' });
  if (ev.is_paid && !ev.listing_fee_paid) return res.status(402).json({ error: 'Listing fee required to schedule a paid event.' });
  const { data, error } = await supabaseAdmin
    .from('events').update({ publish_at: scheduleDate.toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET sales breakdown for a specific event (host only)
app.get('/api/events/:id/sales', requireAuth, async (req, res) => {
  // Verify requester is the host
  const { data: ev } = await supabaseAdmin
    .from('events').select('id, name, host_id, is_paid')
    .eq('id', req.params.id).single();
  if (!ev) return res.status(404).json({ error: 'Event not found.' });
  if (ev.host_id !== req.userId) return res.status(403).json({ error: 'Not your event.' });
  const [{ data: ticketRows }, { data: rsvpRows }] = await Promise.all([
    supabaseAdmin.from('tickets')
      .select('id, quantity, unit_price_cents, total_charged_cents, platform_fee_cents, host_receives_cents, status, confirmed_at, created_at, buyer_email, code, ticket_type_id, user_id')
      .eq('event_id', req.params.id)
      .order('created_at', { ascending: false }),
    supabaseAdmin.from('rsvps')
      .select('id, created_at, user_id')
      .eq('event_id', req.params.id).eq('status', 'confirmed')
      .order('created_at', { ascending: false }),
  ]);

  const typeIds    = [...new Set((ticketRows || []).map(t => t.ticket_type_id).filter(Boolean))];
  const allUserIds = [...new Set([...(ticketRows || []), ...(rsvpRows || [])].map(r => r.user_id).filter(Boolean))];
  const [{ data: ticketTypes }, { data: profileRows }] = await Promise.all([
    typeIds.length    ? supabaseAdmin.from('ticket_types').select('id, name').in('id', typeIds) : { data: [] },
    allUserIds.length ? supabaseAdmin.from('profiles').select('id, full_name, email, avatar_url, avatar_color').in('id', allUserIds) : { data: [] },
  ]);
  const typesMap    = Object.fromEntries((ticketTypes || []).map(tt => [tt.id, tt]));
  const profilesMap = Object.fromEntries((profileRows  || []).map(p  => [p.id, p]));

  const tickets = (ticketRows || []).map(t => ({
    ...t,
    ticket_types: typesMap[t.ticket_type_id]   ? { name: typesMap[t.ticket_type_id].name }   : null,
    profiles:     profilesMap[t.user_id]        || null,
  }));
  const rsvps = (rsvpRows || []).map(r => ({
    ...r,
    profiles: profilesMap[r.user_id] || null,
  }));
  const confirmed  = (tickets || []).filter(t => t.status === 'confirmed');
  const totalGross = confirmed.reduce((s, t) => s + (t.total_charged_cents || 0), 0);
  const totalFees  = confirmed.reduce((s, t) => s + (t.platform_fee_cents || 0), 0);
  const hostEarns  = confirmed.reduce((s, t) => s + (t.host_receives_cents || 0), 0);
  const totalQty   = confirmed.reduce((s, t) => s + (t.quantity || 1), 0);
  res.json({
    event:   ev,
    tickets: tickets || [],
    rsvps:   rsvps   || [],
    summary: {
      totalTicketsSold: totalQty,
      totalRsvps:       (rsvps || []).length,
      grossRevenue:     totalGross,
      platformFees:     totalFees,
      hostEarnings:     hostEarns,
    },
  });
});

// ── My Events (host's own events) ───────────────────────────
app.get('/api/my-events', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('events_with_details')
    .select('*')
    .eq('host_id', req.userId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const events = data || [];

  // Fetch confirmed ticket + RSVP counts for each event in one query
  if (events.length) {
    const eventIds = events.map(e => e.id);
    const [{ data: ticketCounts }, { data: rsvpCounts }] = await Promise.all([
      supabaseAdmin.from('tickets')
        .select('event_id, quantity')
        .in('event_id', eventIds)
        .eq('status', 'confirmed'),
      supabaseAdmin.from('rsvps')
        .select('event_id')
        .in('event_id', eventIds)
        .eq('status', 'confirmed'),
    ]);
    // Aggregate by event_id
    const ticketMap = {};
    (ticketCounts || []).forEach(t => {
      ticketMap[t.event_id] = (ticketMap[t.event_id] || 0) + (t.quantity || 1);
    });
    (rsvpCounts || []).forEach(r => {
      ticketMap[r.event_id] = (ticketMap[r.event_id] || 0) + 1;
    });
    events.forEach(ev => { ev.attendee_count = ticketMap[ev.id] || 0; });
  }

  res.json({ events });
});

// ── My Tickets (attendee's purchased tickets) ────────────────
app.get('/api/my-tickets', requireAuth, async (req, res) => {
  const { data: ticketRows, error } = await supabaseAdmin
    .from('tickets')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  if (!ticketRows || ticketRows.length === 0) return res.json({ tickets: [] });

  const eventIds  = [...new Set(ticketRows.map(t => t.event_id).filter(Boolean))];
  const typeIds   = [...new Set(ticketRows.map(t => t.ticket_type_id).filter(Boolean))];
  const ticketIds = ticketRows.map(t => t.id);

  const [{ data: events }, { data: ticketTypes }, { data: checkins }] = await Promise.all([
    supabaseAdmin.from('events').select('id, name, start_date, city, cover_url, host_id').in('id', eventIds),
    supabaseAdmin.from('ticket_types').select('id, name').in('id', typeIds),
    supabaseAdmin.from('ticket_checkins').select('ticket_id, checked_in_at').in('ticket_id', ticketIds),
  ]);

  const eventsMap   = Object.fromEntries((events      || []).map(e  => [e.id,        e]));
  const typesMap    = Object.fromEntries((ticketTypes || []).map(tt => [tt.id,       tt]));
  const checkinsMap = Object.fromEntries((checkins    || []).map(c  => [c.ticket_id, c.checked_in_at]));

  const tickets = ticketRows.map(t => ({
    ...t,
    event_name:       eventsMap[t.event_id]?.name,
    event_start_date: eventsMap[t.event_id]?.start_date,
    event_city:       eventsMap[t.event_id]?.city,
    event_cover_url:  eventsMap[t.event_id]?.cover_url,
    event_host_id:    eventsMap[t.event_id]?.host_id,
    ticket_type_name: typesMap[t.ticket_type_id]?.name,
    checked_in:       !!checkinsMap[t.id],
    checked_in_at:    checkinsMap[t.id] || null,
  }));
  res.json({ tickets });
});

// ── Delete Event ─────────────────────────────────────────────
app.delete('/api/events/:id', requireAuth, async (req, res) => {
  // Only allow deletion of draft events or if host owns it
  const { data: ev } = await supabaseAdmin
    .from('events').select('id, status, host_id')
    .eq('id', req.params.id).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.status === 'published') {
    // Soft-cancel instead of hard delete to preserve ticket records
    const { error } = await supabaseAdmin
      .from('events').update({ status: 'cancelled' }).eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ success: true, action: 'cancelled' });
  }
  const { error } = await supabaseAdmin.from('events').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, action: 'deleted' });
});

// Toggle event status between published and draft (host only)
app.patch('/api/events/:id/toggle-visibility', requireAuth, async (req, res) => {
  try {
    const { data: ev } = await supabaseAdmin
      .from('events').select('id, status, host_id, is_paid, listing_fee_paid').eq('id', req.params.id).single();
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.host_id !== req.userId) return res.status(403).json({ error: 'Not your event.' });
    if (!['published', 'draft'].includes(ev.status))
      return res.status(400).json({ error: `A ${ev.status} event can't be republished.` });
    const newStatus = ev.status === 'published' ? 'draft' : 'published';
    if (newStatus === 'published' && ev.is_paid && !ev.listing_fee_paid)
      return res.status(402).json({ error: 'Listing fee required.' });
    const { error } = await supabaseAdmin
      .from('events').update({ status: newStatus }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, status: newStatus });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Duplicate an event as a new draft (host only)
app.post('/api/events/:id/duplicate', requireAuth, async (req, res) => {
  try {
    const { data: ev } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.host_id !== req.userId) return res.status(403).json({ error: 'Not your event.' });

    // Create new event as draft, strip IDs and timestamps
    const { id, created_at, updated_at, listing_fee_paid, listing_payment_id, image_url,
      rsvp_count, view_count, publish_at, ...rest } = ev;
    const { data: newEv, error } = await supabaseAdmin.from('events').insert({
      ...rest,
      name:   `${ev.name} (Copy)`.slice(0, 140),
      status: 'draft',
      listing_fee_paid:    false,
      listing_payment_id:  null,
      publish_at:          null,
    }).select().single();
    if (error) throw error;

    // Duplicate ticket types if any
    const { data: tts } = await supabaseAdmin
      .from('ticket_types').select('*').eq('event_id', id);
    if (tts?.length) {
      const newTts = tts.map(tt => {
        const { id: ttId, created_at: ttCa, sold, ...ttRest } = tt;
        return { ...ttRest, event_id: newEv.id, sold: 0 };
      });
      await supabaseAdmin.from('ticket_types').insert(newTts);
    }

    res.json({ event: newEv });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ════════════════════════════════════════════════════════════
// EVENT FORUM
// ════════════════════════════════════════════════════════════
function forumExpired(ev) {
  if (!ev.end_date) return false;
  return Date.now() > new Date(ev.end_date).getTime() + 30 * 24 * 60 * 60 * 1000;
}

// GET forum posts
app.get('/api/events/:id/forum', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('event_forum_posts')
      .select('id, content, image_url, message_type, created_at, user_id, profiles(full_name, avatar_url, avatar_color)')
      .eq('event_id', req.params.id)
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) {
      // Fallback: fetch without join, enrich profiles manually
      console.warn('[forum GET] join failed, falling back:', error.message);
      const { data: d2, error: e2 } = await supabaseAdmin
        .from('event_forum_posts')
        .select('id, content, image_url, message_type, created_at, user_id')
        .eq('event_id', req.params.id)
        .order('created_at', { ascending: true })
        .limit(200);
      if (e2) { console.error('[forum GET]', e2.message); return res.status(500).json({ error: e2.message }); }
      const ids = [...new Set((d2 || []).map(p => p.user_id).filter(Boolean))];
      const { data: profs } = ids.length
        ? await supabaseAdmin.from('profiles').select('id, full_name, avatar_url, avatar_color').in('id', ids)
        : { data: [] };
      const pm = Object.fromEntries((profs || []).map(p => [p.id, p]));
      const posts = (d2 || []).map(p => ({ ...p, profiles: pm[p.user_id] || null }));
      return res.json({ posts });
    }

    res.json({ posts: data || [] });
  } catch (e) {
    console.error('[forum GET crash]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST a message
app.post('/api/events/:id/forum', requireAuth, async (req, res) => {
  try {
    const content      = typeof req.body.content === 'string' ? sanitizeText(req.body.content, 2000) : '';
    const image_url    = req.body.image_url ? sanitizeUrl(req.body.image_url) : '';
    const message_type = req.body.message_type === 'image' ? 'image' : 'text';
    if (image_url === null) return res.status(400).json({ error: 'Invalid image.' });
    if (!content && !image_url)
      return res.status(400).json({ error: 'Message content or image required.' });

    const { data: ev } = await supabaseAdmin
      .from('events').select('id, forum_enabled').eq('id', req.params.id).single();
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.forum_enabled === false) return res.status(403).json({ error: 'Forum disabled for this event.' });

    const insert = {
      event_id:     req.params.id,
      user_id:      req.userId,
      image_url:    image_url || null,
      message_type: message_type,
      content:      content || null,
      created_at:   new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('event_forum_posts').insert(insert)
      .select('id, content, image_url, message_type, created_at, user_id').single();
    if (error) { console.error('[forum POST]', error.message); return res.status(500).json({ error: error.message }); }
    res.json(data);
  } catch (e) {
    console.error('[forum POST crash]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// DELETE a message (own only)
app.delete('/api/forum/:postId', requireAuth, async (req, res) => {
  try {
    const { data: post } = await supabaseAdmin
      .from('event_forum_posts').select('user_id').eq('id', req.params.postId).single();
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post.user_id !== req.userId) return res.status(403).json({ error: 'Not your message.' });
    await supabaseAdmin.from('event_forum_posts').delete().eq('id', req.params.postId);
    res.json({ success: true });
  } catch (e) {
    console.error('[forum DELETE crash]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Legacy delete route (event-scoped)
app.delete('/api/events/:eventId/forum/:postId', requireAuth, async (req, res) => {
  try {
    const { data: post } = await supabaseAdmin
      .from('event_forum_posts').select('user_id').eq('id', req.params.postId).single();
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post.user_id !== req.userId) return res.status(403).json({ error: 'Not your message.' });
    await supabaseAdmin.from('event_forum_posts').delete().eq('id', req.params.postId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ════════════════════════════════════════════════════════════
// TICKET TYPES
// ════════════════════════════════════════════════════════════
// Validate host-supplied ticket tier fields. Returns { fields } or { error }.
function normalizeTicketTypeFields(body, { partial = false } = {}) {
  const fields = {};
  if (body.name !== undefined || !partial) {
    const name = sanitizeText(String(body.name || ''), 80);
    if (!name) return { error: 'Ticket name is required.' };
    fields.name = name;
  }
  if (body.description !== undefined) fields.description = body.description ? sanitizeText(String(body.description), 500) : null;
  if (body.price_cents !== undefined || !partial) {
    const price = parseInt(body.price_cents, 10);
    if (!price || price < 50 || price > 1000000) return { error: 'Price must be between $0.50 and $10,000.' };
    fields.price_cents = price;
  }
  if (body.quantity !== undefined) {
    if (body.quantity === null || body.quantity === '') fields.quantity = null;
    else {
      const q = parseInt(body.quantity, 10);
      if (!q || q < 1) return { error: 'Quantity must be a positive number.' };
      fields.quantity = q;
    }
  }
  for (const k of ['sales_start', 'sales_end']) {
    if (body[k] === undefined) continue;
    if (!body[k]) { fields[k] = null; continue; }
    const d = new Date(body[k]);
    if (isNaN(d.getTime())) return { error: 'Invalid sales window date.' };
    fields[k] = d.toISOString();
  }
  if (fields.sales_start && fields.sales_end && new Date(fields.sales_end) <= new Date(fields.sales_start))
    return { error: 'Sales end must be after sales start.' };
  if (body.sort_order !== undefined) fields.sort_order = parseInt(body.sort_order, 10) || 0;
  return { fields };
}

app.post('/api/ticket-types', requireAuth, async (req, res) => {
  const { event_id } = req.body;
  if (!isUuid(event_id)) return res.status(400).json({ error: 'event_id required.' });
  const norm = normalizeTicketTypeFields(req.body);
  if (norm.error) return res.status(400).json({ error: norm.error });
  const { data: ev } = await supabaseAdmin.from('events').select('id').eq('id', event_id).eq('host_id', req.userId).single();
  if (!ev) return res.status(403).json({ error: 'Not your event.' });
  const { data, error } = await supabaseAdmin.from('ticket_types')
    .insert({ ...norm.fields, event_id, sold: 0 }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PATCH a ticket tier (host only). Price can't change once tickets have sold.
app.patch('/api/ticket-types/:id', requireAuth, async (req, res) => {
  const { data: tt } = await supabaseAdmin.from('ticket_types').select('id, event_id, sold').eq('id', req.params.id).single();
  if (!tt) return res.status(404).json({ error: 'Ticket type not found.' });
  const { data: ev } = await supabaseAdmin.from('events').select('host_id').eq('id', tt.event_id).single();
  if (!ev || ev.host_id !== req.userId) return res.status(403).json({ error: 'Not your event.' });
  const norm = normalizeTicketTypeFields(req.body, { partial: true });
  if (norm.error) return res.status(400).json({ error: norm.error });
  if (norm.fields.price_cents !== undefined && (tt.sold || 0) > 0)
    return res.status(400).json({ error: "Price can't be changed after tickets have sold. Add a new tier instead." });
  if (norm.fields.quantity != null && norm.fields.quantity < (tt.sold || 0))
    return res.status(400).json({ error: `Quantity can't be lower than the ${tt.sold} already sold.` });
  if (!Object.keys(norm.fields).length) return res.status(400).json({ error: 'No fields to update.' });
  const { data, error } = await supabaseAdmin.from('ticket_types').update(norm.fields).eq('id', tt.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE a ticket tier (host only, only if nothing sold)
app.delete('/api/ticket-types/:id', requireAuth, async (req, res) => {
  const { data: tt } = await supabaseAdmin.from('ticket_types').select('id, event_id, sold').eq('id', req.params.id).single();
  if (!tt) return res.status(404).json({ error: 'Ticket type not found.' });
  const { data: ev } = await supabaseAdmin.from('events').select('host_id').eq('id', tt.event_id).single();
  if (!ev || ev.host_id !== req.userId) return res.status(403).json({ error: 'Not your event.' });
  if ((tt.sold || 0) > 0) return res.status(400).json({ error: "Tiers with sales can't be deleted. Set its quantity to the number sold to close it." });
  const { error } = await supabaseAdmin.from('ticket_types').delete().eq('id', tt.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// ── COUPONS ──────────────────────────────────────────────
// GET coupons for an event (host only)
app.get('/api/events/:id/coupons', requireAuth, async (req, res) => {
  const { data: ev } = await supabaseAdmin
    .from('events').select('host_id').eq('id', req.params.id).single();
  if (!ev || ev.host_id !== req.userId)
    return res.status(403).json({ error: 'Not your event.' });
  const { data, error } = await supabaseAdmin
    .from('coupons').select('*').eq('event_id', req.params.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ coupons: data || [] });
});
// POST create a coupon
app.post('/api/events/:id/coupons', requireAuth, async (req, res) => {
  const { code, discount_type, discount_value, max_uses, expires_at } = req.body;
  if (!code || !discount_type || !discount_value)
    return res.status(400).json({ error: 'code, discount_type, discount_value required.' });
  const cleanCode = String(code).trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,30}$/.test(cleanCode))
    return res.status(400).json({ error: 'Code must be 3–30 letters, numbers, dashes or underscores.' });
  if (!['percent', 'amount'].includes(discount_type))
    return res.status(400).json({ error: 'discount_type must be percent or amount.' });
  const val = Number(discount_value);
  if (!isFinite(val) || val <= 0) return res.status(400).json({ error: 'Discount must be a positive number.' });
  if (discount_type === 'percent' && val > 100) return res.status(400).json({ error: 'Percent discount cannot exceed 100.' });
  const { data: ev } = await supabaseAdmin
    .from('events').select('host_id').eq('id', req.params.id).single();
  if (!ev || ev.host_id !== req.userId)
    return res.status(403).json({ error: 'Not your event.' });
  const { data, error } = await supabaseAdmin.from('coupons').insert({
    event_id:       req.params.id,
    host_id:        req.userId,
    code:           cleanCode,
    discount_type,
    discount_value: val,
    max_uses:       max_uses ? Math.max(1, parseInt(max_uses, 10) || 1) : null,
    expires_at:     expires_at || null,
    active:         true,
  }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
// DELETE / deactivate a coupon
app.delete('/api/events/:eventId/coupons/:couponId', requireAuth, async (req, res) => {
  const { data: coupon } = await supabaseAdmin
    .from('coupons').select('host_id').eq('id', req.params.couponId).single();
  if (!coupon || coupon.host_id !== req.userId)
    return res.status(403).json({ error: 'Not your coupon.' });
  await supabaseAdmin.from('coupons').update({ active: false }).eq('id', req.params.couponId);
  res.json({ success: true });
});
// POST validate a coupon code (called during checkout)
app.post('/api/events/:id/validate-coupon', async (req, res) => {
  const { code, ticketPriceCents, qty } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required.' });
  const { data: coupon } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .eq('event_id', req.params.id)
    .eq('code', code.trim().toUpperCase())
    .eq('active', true)
    .single();
  if (!coupon) return res.status(404).json({ error: 'Invalid coupon code.' });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return res.status(400).json({ error: 'This coupon has expired.' });
  if (coupon.max_uses && coupon.uses >= coupon.max_uses)
    return res.status(400).json({ error: 'This coupon has reached its usage limit.' });
  const face = Math.max(0, parseInt(ticketPriceCents, 10) || 0) * Math.max(1, Math.min(20, parseInt(qty, 10) || 1));
  const discountCents = coupon.discount_type === 'percent'
    ? Math.round(face * Math.min(100, coupon.discount_value) / 100)
    : Math.min(Math.round(coupon.discount_value * 100), face);
  res.json({
    valid:         true,
    couponId:      coupon.id,
    discountType:  coupon.discount_type,
    discountValue: coupon.discount_value,
    discountCents,
    newTotal:      Math.max(0, face - discountCents),
    label: coupon.discount_type === 'percent'
      ? `${coupon.discount_value}% off`
      : `$${(coupon.discount_value).toFixed(2)} off`,
  });
});

// ════════════════════════════════════════════════════════════
// RSVP
// ════════════════════════════════════════════════════════════
app.get('/api/rsvp/:eventId', requireAuth, async (req, res) => {
  const { data } = await supabaseAdmin.from('rsvps')
    .select('id, status').eq('event_id', req.params.eventId).eq('user_id', req.userId).single();
  res.json({ rsvp: data || null });
});

app.get('/api/my-rsvps', requireAuth, async (req, res) => {
  const { data: rsvpRows, error } = await supabaseAdmin
    .from('rsvps')
    .select('*')
    .eq('user_id', req.userId)
    .in('status', ['confirmed', 'pending'])
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  if (!rsvpRows || rsvpRows.length === 0) return res.json({ rsvps: [] });

  const eventIds = [...new Set(rsvpRows.map(r => r.event_id).filter(Boolean))];
  const { data: events } = await supabaseAdmin
    .from('events').select('id, name, start_date, city, cover_url').in('id', eventIds);
  const eventsMap = Object.fromEntries((events || []).map(e => [e.id, e]));

  const rsvps = rsvpRows.map(r => ({
    ...r,
    event_name:       eventsMap[r.event_id]?.name,
    event_start_date: eventsMap[r.event_id]?.start_date,
    event_city:       eventsMap[r.event_id]?.city,
    event_cover_url:  eventsMap[r.event_id]?.cover_url,
    type: 'rsvp',
  }));
  res.json({ rsvps });
});

app.post('/api/rsvp', requireAuth, async (req, res) => {
  const { eventId, ref } = req.body;
  if (!isUuid(eventId)) return res.status(400).json({ error: 'Event ID required.' });
  const { data: ev } = await supabaseAdmin.from('events')
    .select('id, name, host_id, is_paid, status, start_date, end_date, sales_cutoff, requires_approval')
    .eq('id', eventId).single();
  if (!ev || ev.status !== 'published') return res.status(404).json({ error: 'Event not found.' });
  if (ev.is_paid) return res.status(400).json({ error: 'This event requires a ticket.' });
  const cutoff = ev.sales_cutoff || ev.end_date;
  if (cutoff && new Date() > new Date(cutoff)) return res.status(400).json({ error: 'RSVPs for this event are now closed.' });

  const promoterId = await resolvePromoter(eventId, ref);
  const { data: result, error } = await supabaseAdmin.rpc('claim_rsvp', {
    p_event_id: eventId, p_user_id: req.userId, p_promoter_id: promoterId,
  });
  if (error) return res.status(500).json({ error: error.message });

  switch (result) {
    case 'confirmed':
      return res.json({ success: true, status: 'confirmed' });
    case 'pending': {
      const { data: guest } = await supabaseAdmin.from('profiles').select('full_name').eq('id', req.userId).single();
      createNotification(ev.host_id, {
        type: 'rsvp_request',
        title: `New request — ${ev.name}`,
        body: `${guest?.full_name || 'Someone'} asked to join your event.`,
        data: { event_id: ev.id },
      }).catch(() => {});
      return res.json({ success: true, status: 'pending', message: 'Request sent — the host will review it.' });
    }
    case 'full':
      return res.status(409).json({ error: 'This event is full. Join the waitlist to get notified if a spot opens.', full: true });
    case 'declined':
      return res.status(403).json({ error: "The host wasn't able to approve your request for this event." });
    default:
      return res.status(400).json({ error: 'RSVPs for this event are closed.' });
  }
});

app.delete('/api/rsvp/:eventId', requireAuth, async (req, res) => {
  const { data: prev } = await supabaseAdmin.from('rsvps')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('event_id', req.params.eventId).eq('user_id', req.userId)
    .in('status', ['confirmed', 'pending'])
    .select('status');
  // A confirmed spot just opened up — offer it to the waitlist
  if (prev?.some(r => r.status === 'confirmed')) promoteWaitlist(req.params.eventId).catch(() => {});
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// WAITLIST
// ════════════════════════════════════════════════════════════
// When spots open: free events auto-confirm the next people in line;
// paid events notify the next people in line so they can buy.
async function promoteWaitlist(eventId) {
  const { data: ev } = await supabaseAdmin.from('events')
    .select('id, name, is_paid, max_capacity, status, requires_approval').eq('id', eventId).single();
  if (!ev || ev.status !== 'published') return;
  const taken = await countSpotsTaken(eventId);
  let open = ev.max_capacity ? ev.max_capacity - taken : 25;
  if (open <= 0) return;
  const { data: queue } = await supabaseAdmin.from('event_waitlist')
    .select('id, user_id, notified_at').eq('event_id', eventId)
    .is('notified_at', null)
    .order('created_at', { ascending: true }).limit(Math.min(open, 25));
  for (const w of queue || []) {
    if (!ev.is_paid && !ev.requires_approval) {
      const { data: result } = await supabaseAdmin.rpc('claim_rsvp', { p_event_id: eventId, p_user_id: w.user_id, p_promoter_id: null });
      if (result === 'full') break;
      if (result === 'confirmed') {
        await createNotification(w.user_id, {
          type: 'waitlist_confirmed', title: "You're in! 🎉",
          body: `A spot opened up and you're now going to "${ev.name}".`, data: { event_id: eventId },
        });
        notifyByEmail(w.user_id, `You're in: ${ev.name}`,
          `<p>A spot opened up at <strong>${escapeHtml(ev.name)}</strong> and we've reserved it for you.</p>`, eventId);
      }
    } else {
      await supabaseAdmin.from('event_waitlist').update({ notified_at: new Date().toISOString() }).eq('id', w.id);
      await createNotification(w.user_id, {
        type: 'waitlist_spot', title: 'A spot opened up',
        body: `${ev.is_paid ? 'Tickets are' : 'A spot is'} available again for "${ev.name}" — grab it before it's gone.`,
        data: { event_id: eventId },
      });
      notifyByEmail(w.user_id, `A spot opened up: ${ev.name}`,
        `<p>${ev.is_paid ? 'Tickets are' : 'A spot is'} available again for <strong>${escapeHtml(ev.name)}</strong>. First come, first served.</p>`, eventId);
    }
  }
}

app.post('/api/events/:id/waitlist', requireAuth, async (req, res) => {
  const { data: ev } = await supabaseAdmin.from('events')
    .select('id, status, max_capacity, host_id').eq('id', req.params.id).single();
  if (!ev || ev.status !== 'published') return res.status(404).json({ error: 'Event not found.' });
  if (ev.host_id === req.userId) return res.status(400).json({ error: "You're the host of this event." });
  const { error } = await supabaseAdmin.from('event_waitlist')
    .upsert({ event_id: ev.id, user_id: req.userId, notified_at: null }, { onConflict: 'event_id,user_id' });
  if (error) return res.status(500).json({ error: error.message });
  const { count } = await supabaseAdmin.from('event_waitlist').select('*', { count: 'exact', head: true }).eq('event_id', ev.id);
  res.json({ success: true, on_waitlist: true, waitlist_count: count || 0 });
});

app.delete('/api/events/:id/waitlist', requireAuth, async (req, res) => {
  await supabaseAdmin.from('event_waitlist').delete().eq('event_id', req.params.id).eq('user_id', req.userId);
  res.json({ success: true, on_waitlist: false });
});

// ════════════════════════════════════════════════════════════
// HOST GUEST LIST (approve / decline / export)
// ════════════════════════════════════════════════════════════
async function requireEventHost(req, res) {
  if (!isUuid(req.params.id)) { res.status(404).json({ error: 'Event not found.' }); return null; }
  const { data: ev } = await supabaseAdmin.from('events')
    .select('id, name, host_id, is_paid, max_capacity, requires_approval, status, start_date, view_count')
    .eq('id', req.params.id).single();
  if (!ev) { res.status(404).json({ error: 'Event not found.' }); return null; }
  if (ev.host_id !== req.userId) { res.status(403).json({ error: 'Not your event.' }); return null; }
  return ev;
}

app.get('/api/events/:id/guests', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const [{ data: rsvps }, { data: tickets }, { data: waitlist }, { data: checkins }, { data: promoters }] = await Promise.all([
    supabaseAdmin.from('rsvps').select('id, user_id, status, promoter_id, created_at, updated_at')
      .eq('event_id', ev.id).neq('status', 'cancelled').order('created_at', { ascending: true }),
    supabaseAdmin.from('tickets').select('id, user_id, quantity, status, code, buyer_email, ticket_type_id, promoter_id, created_at')
      .eq('event_id', ev.id).eq('status', 'confirmed').order('created_at', { ascending: true }),
    supabaseAdmin.from('event_waitlist').select('id, user_id, notified_at, created_at')
      .eq('event_id', ev.id).order('created_at', { ascending: true }),
    supabaseAdmin.from('ticket_checkins').select('ticket_id, checked_in_at').eq('event_id', ev.id),
    supabaseAdmin.from('event_promoters').select('id, label, code').eq('event_id', ev.id),
  ]);
  const userIds = [...new Set([...(rsvps || []), ...(tickets || []), ...(waitlist || [])].map(r => r.user_id).filter(Boolean))];
  const { data: profiles } = userIds.length
    ? await supabaseAdmin.from('profiles').select('id, full_name, email, avatar_url, avatar_color, city').in('id', userIds)
    : { data: [] };
  const pm = Object.fromEntries((profiles || []).map(p => [p.id, p]));
  const promoMap = Object.fromEntries((promoters || []).map(p => [p.id, p.label]));
  const checkMap = Object.fromEntries((checkins || []).map(c => [c.ticket_id, c.checked_in_at]));
  const person = id => {
    const p = pm[id] || {};
    return { user_id: id, full_name: p.full_name || null, email: p.email || null,
      avatar_url: p.avatar_url || null, avatar_color: p.avatar_color || null, city: p.city || null };
  };
  res.json({
    event: { id: ev.id, name: ev.name, is_paid: ev.is_paid, max_capacity: ev.max_capacity, requires_approval: ev.requires_approval },
    going: [
      ...(rsvps || []).filter(r => r.status === 'confirmed').map(r => ({
        ...person(r.user_id), kind: 'rsvp', id: r.id, quantity: 1, joined_at: r.created_at,
        promoter: promoMap[r.promoter_id] || null })),
      ...(tickets || []).map(t => ({
        ...person(t.user_id), kind: 'ticket', id: t.id, quantity: t.quantity || 1, code: t.code,
        email: pm[t.user_id]?.email || t.buyer_email || null, joined_at: t.created_at,
        checked_in_at: checkMap[t.id] || null, promoter: promoMap[t.promoter_id] || null })),
    ],
    pending:  (rsvps || []).filter(r => r.status === 'pending').map(r => ({ ...person(r.user_id), id: r.id, requested_at: r.created_at })),
    declined: (rsvps || []).filter(r => r.status === 'declined').map(r => ({ ...person(r.user_id), id: r.id, declined_at: r.updated_at })),
    waitlist: (waitlist || []).map(w => ({ ...person(w.user_id), id: w.id, joined_at: w.created_at, notified_at: w.notified_at })),
  });
});

app.post('/api/events/:id/guests/:rsvpId/approve', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const { data: r } = await supabaseAdmin.from('rsvps').select('id, user_id, event_id, status').eq('id', req.params.rsvpId).single();
  if (!r || r.event_id !== ev.id) return res.status(404).json({ error: 'Request not found.' });
  // Hosts can change their mind about a declined guest
  if (r.status === 'declined') await supabaseAdmin.from('rsvps').update({ status: 'pending' }).eq('id', r.id);
  const { data: result, error } = await supabaseAdmin.rpc('approve_rsvp', { p_rsvp_id: r.id });
  if (error) return res.status(500).json({ error: error.message });
  if (result === 'full') return res.status(409).json({ error: 'Event is at capacity. Raise the capacity to approve more guests.' });
  if (result !== 'confirmed') return res.status(400).json({ error: 'This request was already handled.' });
  await createNotification(r.user_id, {
    type: 'rsvp_approved', title: "You're approved! 🎉",
    body: `The host approved your request for "${ev.name}". See you there!`, data: { event_id: ev.id },
  });
  notifyByEmail(r.user_id, `You're approved for ${ev.name}`,
    `<p>Good news — the host approved your request to attend <strong>${escapeHtml(ev.name)}</strong>.</p>`, ev.id);
  res.json({ success: true, status: 'confirmed' });
});

app.post('/api/events/:id/guests/:rsvpId/decline', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const { data: updated } = await supabaseAdmin.from('rsvps')
    .update({ status: 'declined', updated_at: new Date().toISOString() })
    .eq('id', req.params.rsvpId).eq('event_id', ev.id).in('status', ['pending', 'confirmed'])
    .select('user_id, status');
  if (!updated?.length) return res.status(404).json({ error: 'Request not found.' });
  await createNotification(updated[0].user_id, {
    type: 'rsvp_declined', title: 'Request not approved',
    body: `The host wasn't able to approve your request for "${ev.name}".`, data: { event_id: ev.id },
  });
  res.json({ success: true, status: 'declined' });
});

// CSV export of the guest list (host only)
app.get('/api/events/:id/guests.csv', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const [{ data: rsvps }, { data: tickets }, { data: checkins }, { data: ticketTypes }] = await Promise.all([
    supabaseAdmin.from('rsvps').select('id, user_id, status, created_at').eq('event_id', ev.id).in('status', ['confirmed', 'pending']),
    supabaseAdmin.from('tickets').select('id, user_id, quantity, code, buyer_email, ticket_type_id, created_at').eq('event_id', ev.id).eq('status', 'confirmed'),
    supabaseAdmin.from('ticket_checkins').select('ticket_id, checked_in_at').eq('event_id', ev.id),
    supabaseAdmin.from('ticket_types').select('id, name').eq('event_id', ev.id),
  ]);
  const ids = [...new Set([...(rsvps || []), ...(tickets || [])].map(r => r.user_id))];
  const { data: profiles } = ids.length ? await supabaseAdmin.from('profiles').select('id, full_name, email').in('id', ids) : { data: [] };
  const pm = Object.fromEntries((profiles || []).map(p => [p.id, p]));
  const tm = Object.fromEntries((ticketTypes || []).map(t => [t.id, t.name]));
  const cm = Object.fromEntries((checkins || []).map(c => [c.ticket_id, c.checked_in_at]));
  // Prefix cells that spreadsheet apps would treat as formulas
  const cell = v => {
    let str = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
    return `"${str.replace(/"/g, '""')}"`;
  };
  const rows = [['Name', 'Email', 'Type', 'Status', 'Quantity', 'Ticket code', 'Checked in', 'Joined']];
  for (const r of rsvps || []) rows.push([pm[r.user_id]?.full_name, pm[r.user_id]?.email, 'RSVP', r.status, 1, '', '', r.created_at]);
  for (const t of tickets || []) rows.push([pm[t.user_id]?.full_name, pm[t.user_id]?.email || t.buyer_email,
    tm[t.ticket_type_id] || 'Ticket', 'confirmed', t.quantity || 1, t.code || '', cm[t.id] || '', t.created_at]);
  const safeName = ev.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'event';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}-guests.csv"`);
  res.send(rows.map(r => r.map(cell).join(',')).join('\r\n'));
});

// ════════════════════════════════════════════════════════════
// HOST MESSAGING (blast to guests)
// ════════════════════════════════════════════════════════════
const messageLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Message limit reached — try again in an hour.' } });

app.get('/api/events/:id/messages', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const { data } = await supabaseAdmin.from('event_messages')
    .select('id, subject, body, audience, recipients_count, created_at')
    .eq('event_id', ev.id).order('created_at', { ascending: false }).limit(50);
  res.json({ messages: data || [] });
});

app.post('/api/events/:id/messages', messageLimiter, requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const subject  = sanitizeText(String(req.body.subject || ''), 120);
  const body     = sanitizeText(String(req.body.body || ''), 3000);
  const audience = ['going', 'waitlist', 'all'].includes(req.body.audience) ? req.body.audience : 'going';
  const sendEmailToo = req.body.email !== false;
  if (!subject || !body) return res.status(400).json({ error: 'Subject and message are required.' });

  const wantGoing = audience !== 'waitlist', wantWait = audience !== 'going';
  const [{ data: rsvps }, { data: tickets }, { data: waitlist }] = await Promise.all([
    wantGoing ? supabaseAdmin.from('rsvps').select('user_id').eq('event_id', ev.id).eq('status', 'confirmed') : { data: [] },
    wantGoing ? supabaseAdmin.from('tickets').select('user_id').eq('event_id', ev.id).eq('status', 'confirmed') : { data: [] },
    wantWait  ? supabaseAdmin.from('event_waitlist').select('user_id').eq('event_id', ev.id) : { data: [] },
  ]);
  const recipients = [...new Set([...(rsvps || []), ...(tickets || []), ...(waitlist || [])]
    .map(r => r.user_id).filter(id => id && id !== req.userId))];
  if (!recipients.length) return res.status(400).json({ error: 'No guests to message yet.' });

  const { data: host } = await supabaseAdmin.from('profiles').select('full_name').eq('id', req.userId).single();
  const hostName = host?.full_name || 'The host';
  const { error: logErr } = await supabaseAdmin.from('event_messages').insert({
    event_id: ev.id, host_id: req.userId, subject, body, audience, recipients_count: recipients.length,
  });
  if (logErr) return res.status(500).json({ error: logErr.message });

  // In-app notifications in batches
  for (let i = 0; i < recipients.length; i += 500) {
    await supabaseAdmin.from('notifications').insert(recipients.slice(i, i + 500).map(uid => ({
      user_id: uid, type: 'host_message', title: `${ev.name}: ${subject}`,
      body: body.slice(0, 280), data: { event_id: ev.id },
    })));
  }
  res.json({ success: true, recipients: recipients.length });

  // Emails go out after responding so the host isn't left waiting
  if (sendEmailToo) {
    const html = `<p style="margin:0 0 6px;color:#666;font-size:13px">Message from ${escapeHtml(hostName)} · ${escapeHtml(ev.name)}</p>
      <h2 style="margin:0 0 14px">${escapeHtml(subject)}</h2>
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(body)}</p>`;
    for (const uid of recipients) {
      await notifyByEmail(uid, `${subject} — ${ev.name}`, html, ev.id);
    }
  }
});

// ════════════════════════════════════════════════════════════
// PROMOTER / REFERRAL LINKS
// ════════════════════════════════════════════════════════════
app.get('/api/events/:id/promoters', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const [{ data: promoters }, { data: tickets }, { data: rsvps }] = await Promise.all([
    supabaseAdmin.from('event_promoters').select('*').eq('event_id', ev.id).order('created_at', { ascending: true }),
    supabaseAdmin.from('tickets').select('promoter_id, quantity, total_charged_cents')
      .eq('event_id', ev.id).eq('status', 'confirmed').not('promoter_id', 'is', null),
    supabaseAdmin.from('rsvps').select('promoter_id')
      .eq('event_id', ev.id).eq('status', 'confirmed').not('promoter_id', 'is', null),
  ]);
  const stats = {};
  for (const t of tickets || []) {
    const st = stats[t.promoter_id] ||= { tickets: 0, revenue_cents: 0, rsvps: 0 };
    st.tickets += t.quantity || 1; st.revenue_cents += t.total_charged_cents || 0;
  }
  for (const r of rsvps || []) (stats[r.promoter_id] ||= { tickets: 0, revenue_cents: 0, rsvps: 0 }).rsvps += 1;
  res.json({ promoters: (promoters || []).map(p => ({ ...p, ...(stats[p.id] || { tickets: 0, revenue_cents: 0, rsvps: 0 }) })) });
});

app.post('/api/events/:id/promoters', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const label = sanitizeText(String(req.body.label || ''), 60);
  if (!label) return res.status(400).json({ error: 'Give this link a name (e.g. "Youth group" or "Instagram").' });
  let code = String(req.body.code || label).toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 16);
  if (code.length < 3) code = `${code}${generateTicketCode(4)}`;
  const { data: clash } = await supabaseAdmin.from('event_promoters').select('id').eq('event_id', ev.id).eq('code', code).maybeSingle();
  if (clash) code = `${code.slice(0, 12)}${generateTicketCode(4)}`;
  const { data, error } = await supabaseAdmin.from('event_promoters')
    .insert({ event_id: ev.id, label, code }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ promoter: { ...data, tickets: 0, revenue_cents: 0, rsvps: 0 } });
});

app.delete('/api/events/:id/promoters/:promoterId', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  await supabaseAdmin.from('event_promoters').update({ active: false })
    .eq('id', req.params.promoterId).eq('event_id', ev.id);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// HOST ANALYTICS (per event)
// ════════════════════════════════════════════════════════════
app.get('/api/events/:id/analytics', requireAuth, async (req, res) => {
  const ev = await requireEventHost(req, res); if (!ev) return;
  const [{ data: tickets }, { data: rsvps }, { count: waitlistCount }, { count: checkins }, { data: types }, { data: promoters }] = await Promise.all([
    supabaseAdmin.from('tickets').select('quantity, total_charged_cents, host_receives_cents, status, ticket_type_id, promoter_id, created_at')
      .eq('event_id', ev.id).in('status', ['confirmed', 'refunded']),
    supabaseAdmin.from('rsvps').select('status, promoter_id, created_at').eq('event_id', ev.id),
    supabaseAdmin.from('event_waitlist').select('*', { count: 'exact', head: true }).eq('event_id', ev.id),
    supabaseAdmin.from('ticket_checkins').select('*', { count: 'exact', head: true }).eq('event_id', ev.id),
    supabaseAdmin.from('ticket_types').select('id, name, quantity, sold, price_cents').eq('event_id', ev.id),
    supabaseAdmin.from('event_promoters').select('id, label, clicks').eq('event_id', ev.id),
  ]);
  const confirmed = (tickets || []).filter(t => t.status === 'confirmed');
  const ticketQty = confirmed.reduce((s, t) => s + (t.quantity || 1), 0);
  const goingRsvps = (rsvps || []).filter(r => r.status === 'confirmed').length;
  const going = ticketQty + goingRsvps;
  const views = ev.view_count || 0;

  // Daily series (last 30 days) of new attendees
  const days = {};
  const add = (iso, n) => { const d = String(iso).slice(0, 10); days[d] = (days[d] || 0) + n; };
  confirmed.forEach(t => add(t.created_at, t.quantity || 1));
  (rsvps || []).filter(r => r.status === 'confirmed').forEach(r => add(r.created_at, 1));
  const series = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    series.push({ day: d, count: days[d] || 0 });
  }

  const promoterRows = (promoters || []).map(p => {
    const pt = confirmed.filter(t => t.promoter_id === p.id);
    const pr = (rsvps || []).filter(r => r.promoter_id === p.id && r.status === 'confirmed').length;
    const conv = pt.reduce((s, t) => s + (t.quantity || 1), 0) + pr;
    return { id: p.id, label: p.label, clicks: p.clicks || 0, conversions: conv,
      revenue_cents: pt.reduce((s, t) => s + (t.total_charged_cents || 0), 0) };
  });
  const attributed = promoterRows.reduce((s, p) => s + p.conversions, 0);

  res.json({
    views,
    going,
    capacity: ev.max_capacity,
    conversion_rate: views ? Math.round((going / views) * 1000) / 10 : null,
    pending_requests: (rsvps || []).filter(r => r.status === 'pending').length,
    waitlist: waitlistCount || 0,
    checked_in: checkins || 0,
    revenue_cents: confirmed.reduce((s, t) => s + (t.total_charged_cents || 0), 0),
    host_earnings_cents: confirmed.reduce((s, t) => s + (t.host_receives_cents || 0), 0),
    refunded_tickets: (tickets || []).filter(t => t.status === 'refunded').reduce((s, t) => s + (t.quantity || 1), 0),
    tiers: (types || []).map(t => ({ id: t.id, name: t.name, sold: t.sold || 0, quantity: t.quantity, price_cents: t.price_cents })),
    sources: [...promoterRows, { id: null, label: 'Direct / other', clicks: null, conversions: Math.max(0, going - attributed), revenue_cents: null }],
    series,
  });
});

// ── Public Attendee List ─────────────────────────────────────
// Shows who's going (first names + avatars). Only for published events;
// the host's full guest list with emails lives at /guests.
app.get('/api/events/:id/attendees', async (req, res) => {
  if (!isUuid(req.params.id)) return res.json({ attendees: [], total: 0 });
  const { data: ev } = await supabaseAdmin.from('events').select('id, status').eq('id', req.params.id).single();
  if (!ev || ev.status !== 'published') return res.json({ attendees: [], total: 0 });
  const [{ data: rsvpRows }, { data: ticketRows }] = await Promise.all([
    supabaseAdmin.from('rsvps').select('user_id').eq('event_id', req.params.id).eq('status', 'confirmed')
      .order('created_at', { ascending: false }).limit(200),
    supabaseAdmin.from('tickets').select('user_id').eq('event_id', req.params.id).eq('status', 'confirmed')
      .order('created_at', { ascending: false }).limit(200),
  ]);
  const userIds = [...new Set([...(rsvpRows || []), ...(ticketRows || [])].map(r => r.user_id).filter(Boolean))];
  if (userIds.length === 0) return res.json({ attendees: [], total: 0 });
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, city, avatar_url, avatar_color')
    .in('id', userIds.slice(0, 100));
  res.json({ attendees: profiles || [], total: userIds.length });
});

// ── Ticket Verification (scanner) ───────────────────────────
// Host (only) scans a QR / types a code. The ticket must belong to an event the requester hosts.
app.post('/api/tickets/verify', requireAuth, async (req, res) => {
  const { ticketId, eventId } = req.body;
  const code = typeof req.body.code === 'string' ? req.body.code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
  if (!ticketId && !code) return res.status(400).json({ valid: false, error: 'Ticket ID or code required.' });
  if (ticketId && !isUuid(ticketId)) return res.json({ valid: false, error: 'Ticket not found.' });
  if (eventId && !isUuid(eventId)) return res.status(400).json({ valid: false, error: 'Invalid event.' });
  if (!ticketId && !eventId) return res.status(400).json({ valid: false, error: 'Select an event to scan for.' });

  try {
    if (eventId) {
      const { data: ev } = await supabaseAdmin.from('events').select('host_id').eq('id', eventId).single();
      if (!ev || ev.host_id !== req.userId)
        return res.status(403).json({ valid: false, error: 'Only the event host can verify tickets.' });
    }

    // 1. Find the ticket (by id, by short code, or by legacy payment-intent suffix)
    let ticket = null;
    const cols = 'id, event_id, ticket_type_id, user_id, quantity, status, code, stripe_payment_intent, buyer_email';
    if (ticketId) {
      ({ data: ticket } = await supabaseAdmin.from('tickets').select(cols).eq('id', ticketId).maybeSingle());
    } else {
      ({ data: ticket } = await supabaseAdmin.from('tickets').select(cols)
        .eq('event_id', eventId).eq('code', code).maybeSingle());
      if (!ticket && code.length >= 6) {
        const { data: legacy } = await supabaseAdmin.from('tickets').select(cols)
          .eq('event_id', eventId).ilike('stripe_payment_intent', `%${code}`).limit(2);
        if (legacy?.length === 1) ticket = legacy[0];
      }
    }
    if (!ticket || (eventId && ticket.event_id !== eventId))
      return res.json({ valid: false, error: 'Ticket not found for this event.' });

    // 2. Requester must host the ticket's event (covers ticketId-only scans)
    const [{ data: ev }, { data: tt }, { data: holder }] = await Promise.all([
      supabaseAdmin.from('events').select('host_id, name, start_date').eq('id', ticket.event_id).single(),
      ticket.ticket_type_id
        ? supabaseAdmin.from('ticket_types').select('name').eq('id', ticket.ticket_type_id).single()
        : { data: null },
      supabaseAdmin.from('profiles').select('full_name').eq('id', ticket.user_id).single(),
    ]);
    if (!ev || ev.host_id !== req.userId)
      return res.status(403).json({ valid: false, error: 'Only the event host can verify tickets.' });

    const displayCode = ticket.code || (ticket.stripe_payment_intent || ticket.id).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase();
    const info = {
      id: ticket.id, quantity: ticket.quantity, code: displayCode, buyer_email: ticket.buyer_email,
      holder_name: holder?.full_name || null, event_name: ev.name, event_start_date: ev.start_date,
      ticket_type_name: tt?.name || null, status: ticket.status,
    };
    if (ticket.status !== 'confirmed') {
      const why = { refunded: 'This ticket was refunded.', pending: 'Payment for this ticket has not completed.',
        failed: 'Payment for this ticket failed.', disputed: 'This ticket is under a payment dispute.' }[ticket.status];
      return res.json({ valid: false, error: why || 'Ticket is not valid.', ticket: info });
    }

    // 3. Record check-in; the unique(ticket_id) constraint makes double-scans safe
    const { error: insErr } = await supabaseAdmin.from('ticket_checkins').insert({
      ticket_id: ticket.id, event_id: ticket.event_id, checked_in_by: req.userId,
      checked_in_at: new Date().toISOString(),
    });
    if (insErr) {
      const { data: existing } = await supabaseAdmin.from('ticket_checkins')
        .select('checked_in_at').eq('ticket_id', ticket.id).maybeSingle();
      if (existing) {
        const msg = `Already checked in at ${new Date(existing.checked_in_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        return res.json({ valid: false, already_checked_in: true, error: msg, message: msg, ticket: info });
      }
      throw insErr;
    }
    res.json({
      valid: true,
      message: `${ticket.quantity} ticket${ticket.quantity !== 1 ? 's' : ''} checked in successfully.`,
      ticket: info,
    });
  } catch (e) {
    console.error('Verify error:', e.message);
    res.status(500).json({ valid: false, error: 'Verification failed. Try again.' });
  }
});

// ── Event Attendance Count ───────────────────────────────────
app.get('/api/events/:id/attendance', requireAuth, async (req, res) => {
  // Verify host
  const { data: ev } = await supabaseAdmin
    .from('events').select('host_id, max_capacity').eq('id', req.params.id).single();
  if (!ev || ev.host_id !== req.userId)
    return res.status(403).json({ error: 'Not your event.' });

  const [{ count: total }, { count: checkedIn }] = await Promise.all([
    supabaseAdmin.from('tickets').select('*', { count: 'exact', head: true })
      .eq('event_id', req.params.id).eq('status', 'confirmed'),
    supabaseAdmin.from('ticket_checkins').select('*', { count: 'exact', head: true })
      .eq('event_id', req.params.id),
  ]);

  res.json({ total: total || 0, checked_in: checkedIn || 0, capacity: ev.max_capacity });
});

// ════════════════════════════════════════════════════════════
// PAYMENTS
// ════════════════════════════════════════════════════════════
app.get('/api/price-breakdown', async (req, res) => {
  const { price, qty = 1, absorb = 'true' } = req.query;
  if (!price) return res.status(400).json({ error: 'Price required.' });
  res.json(calcAmounts(Number(price), Number(qty), absorb === 'true'));
});

app.post('/api/tax-estimate', requireAuth, async (req, res) => {
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
  const { paymentMethodId, eventId, hostEmail, promoCode } = req.body;
  if (!eventId) return res.status(400).json({ error: 'Event ID required.' });
  if (!paymentMethodId) return res.status(400).json({ error: 'Payment method required.' });
  const { data: ev } = await supabaseAdmin.from('events').select('id, name, listing_fee_paid')
    .eq('id', eventId).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.listing_fee_paid) return res.status(400).json({ error: 'Listing fee already paid.' });

  // Apply promo code if provided
  let chargeAmount = HOST_LISTING_FEE;
  let appliedPromoId = null;
  if (promoCode) {
    const { data: promo } = await supabaseAdmin
      .from('listing_promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase().trim())
      .eq('active', true)
      .single();
    if (promo && !(promo.expires_at && new Date() > new Date(promo.expires_at))
              && (promo.max_uses === null || promo.uses_count < promo.max_uses)) {
      const discountCents = promo.discount_type === 'percent'
        ? Math.round(HOST_LISTING_FEE * (promo.discount_value / 100))
        : Math.min(Math.round(promo.discount_value * 100), HOST_LISTING_FEE);
      chargeAmount = Math.max(0, HOST_LISTING_FEE - discountCents);
      appliedPromoId = promo.id;
    }
  }

  // Guard: if frontend sent the free-promo sentinel but discount is no longer valid
  if (paymentMethodId === '__promo_free__' && chargeAmount > 0) {
    return res.status(400).json({ error: 'Promo code could not be applied. Please re-enter your card details and try again.', resetCard: true });
  }

  // Free after discount — skip Stripe entirely
  if (chargeAmount === 0) {
    await supabaseAdmin.from('events').update({ listing_fee_paid: true, listing_payment_id: 'promo_free' }).eq('id', eventId);
    if (appliedPromoId) {
      const { data: pc } = await supabaseAdmin.from('listing_promo_codes').select('uses_count').eq('id', appliedPromoId).single();
      await supabaseAdmin.from('listing_promo_codes').update({ uses_count: (pc?.uses_count || 0) + 1 }).eq('id', appliedPromoId);
    }
    await new Promise(r => setTimeout(r, 300));
    return res.json({ success: true, intentId: 'promo_free' });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount:               chargeAmount,
      currency:             'usd',
      payment_method_types: ['card'],
      payment_method:       paymentMethodId,
      confirm:              true,
      receipt_email:        hostEmail || req.user.email || undefined,
      description:          `Christ Link listing fee — ${ev.name}`,
      metadata:             { type: 'listing_fee', event_id: eventId, host_id: req.userId, promo_id: appliedPromoId || '' },
      return_url:           `${process.env.APP_URL}/?listing_success=1`,
    }, { idempotencyKey: `listing-fee-${eventId}-${paymentMethodId.slice(-12)}` });
    console.log('[listing-fee] intent status:', intent.status, 'eventId:', eventId);
    if (intent.status === 'succeeded') {
      await supabaseAdmin
        .from('events')
        .update({ listing_fee_paid: true, listing_payment_id: intent.id })
        .eq('id', eventId);
      if (appliedPromoId) {
        const { data: pc } = await supabaseAdmin.from('listing_promo_codes').select('uses_count').eq('id', appliedPromoId).single();
        await supabaseAdmin.from('listing_promo_codes').update({ uses_count: (pc?.uses_count || 0) + 1 }).eq('id', appliedPromoId);
      }
      await new Promise(r => setTimeout(r, 300));
      return res.json({ success: true, intentId: intent.id });
    }
    res.status(400).json({
      success: false,
      status: intent.status,
      error: `Payment status: ${intent.status}. Please try again.`,
    });
  } catch (e) {
    console.error('[listing-fee] stripe error:', e.raw?.code, e.message, 'eventId:', eventId, 'userId:', req.userId);
    const msg = (e.raw?.code === 'payment_method_unexpected_state' || (e.message||'').toLowerCase().includes('previously used'))
      ? 'Your card could not be reused. Please re-enter your card details and try again.'
      : e.message;
    res.status(400).json({ error: msg, resetCard: true });
  }
});

app.post('/api/create-payment-intent', pmtLimiter, requireAuth, async (req, res) => {
  const { eventId, ticketTypeId, qty = 1, ref } = req.body;
  const parsedQty = parseInt(qty, 10);
  const typedEmail = typeof req.body.buyerEmail === 'string' ? req.body.buyerEmail.trim().slice(0, 254) : '';
  const buyerEmail = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(typedEmail) ? typedEmail : req.user.email;
  if (!isUuid(eventId) || !isUuid(ticketTypeId))
    return res.status(400).json({ error: 'Event ID and ticket type required.' });
  if (!parsedQty || parsedQty < 1 || parsedQty > 20)
    return res.status(400).json({ error: 'Quantity must be between 1 and 20.' });

  try {
    // ── 1. Fetch event using admin client (bypasses RLS) ──────────
    const { data: ev, error: evErr } = await supabaseAdmin
      .from('events')
      .select('id, name, status, is_paid, absorb_stripe_fee, host_id, max_capacity, end_date, sales_cutoff')
      .eq('id', eventId)
      .single();

    if (evErr || !ev) {
      console.error('[payment-intent] event fetch error:', evErr?.message, 'eventId:', eventId);
      return res.status(404).json({ error: 'Event not found. It may have been removed or unpublished.' });
    }

    if (ev.status !== 'published')
      return res.status(400).json({ error: 'This event is not currently available for ticket purchases.' });

    const ticketCutoff = ev.sales_cutoff || ev.end_date;
    if (ticketCutoff && new Date() > new Date(ticketCutoff))
      return res.status(400).json({ error: 'Ticket sales for this event are now closed.' });

    if (!ev.is_paid)
      return res.status(400).json({ error: 'This is a free event — use RSVP instead.' });

    // ── 2. Fetch host Stripe account ──────────────────────────────
    const { data: stripeAcct, error: acctErr } = await supabaseAdmin
      .from('host_stripe_accounts')
      .select('stripe_account_id, payouts_enabled, charges_enabled')
      .eq('user_id', ev.host_id)
      .single();

    if (acctErr || !stripeAcct?.stripe_account_id) {
      console.error('[payment-intent] no stripe account for host:', ev.host_id);
      return res.status(400).json({
        error: 'The host has not set up payments yet. Please contact the event organiser.',
      });
    }

    if (!stripeAcct.charges_enabled) {
      return res.status(400).json({
        error: "The host's payment account is still being verified by Stripe. Please try again later or contact the event organiser.",
      });
    }

    // ── 3. Fetch ticket type ──────────────────────────────────────
    const { data: tt, error: ttErr } = await supabaseAdmin
      .from('ticket_types')
      .select('id, name, price_cents, quantity, sold, sales_start, sales_end')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();

    if (ttErr || !tt)
      return res.status(404).json({ error: 'Ticket type not found for this event.' });

    if (tt.sales_start && new Date(tt.sales_start) > new Date())
      return res.status(400).json({ error: `${tt.name} goes on sale ${new Date(tt.sales_start).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}.` });
    if (tt.sales_end && new Date(tt.sales_end) < new Date())
      return res.status(400).json({ error: `${tt.name} is no longer on sale.` });

    const remaining = tt.quantity != null ? tt.quantity - (tt.sold || 0) : Infinity;
    if (parsedQty > remaining)
      return res.status(409).json({
        error: remaining > 0 ? `Only ${remaining} ticket${remaining !== 1 ? 's' : ''} remaining.` : 'This ticket is sold out.',
        sold_out: remaining <= 0,
      });

    // Event-wide capacity (tickets + RSVPs) applies across all tiers
    if (ev.max_capacity) {
      const taken = await countSpotsTaken(eventId);
      const left  = ev.max_capacity - taken;
      if (parsedQty > left)
        return res.status(409).json({
          error: left > 0 ? `Only ${left} spot${left !== 1 ? 's' : ''} left for this event.` : 'This event is sold out.',
          sold_out: left <= 0,
        });
    }
    const promoterId = await resolvePromoter(eventId, ref);

    // ── 4. Calculate amounts ──────────────────────────────────────
    // Apply coupon discount if provided
    // Discount applies to the whole order (matches /validate-coupon shown at checkout)
    const faceCents   = tt.price_cents * parsedQty;
    let couponId      = null;
    let discountCents = 0;
    if (typeof req.body.couponCode === 'string' && req.body.couponCode.trim()) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('event_id', eventId)
        .eq('code', req.body.couponCode.trim().toUpperCase())
        .eq('active', true)
        .maybeSingle();
      if (coupon && !(coupon.expires_at && new Date(coupon.expires_at) < new Date())
        && !(coupon.max_uses && coupon.uses >= coupon.max_uses)) {
        couponId      = coupon.id;
        discountCents = coupon.discount_type === 'percent'
          ? Math.round(faceCents * Math.min(100, coupon.discount_value) / 100)
          : Math.min(Math.round(coupon.discount_value * 100), faceCents);
      }
    }
    let discountedFace = Math.max(0, faceCents - discountCents);
    // Stripe can't charge less than $0.50 — round tiny post-discount totals up to free
    if (discountedFace > 0 && discountedFace < 50) { discountCents = faceCents; discountedFace = 0; }
    const amounts = discountedFace === 0
      ? { face: 0, chargeAmount: 0, platformFee: 0, stripeFee: 0, hostReceives: 0 }
      : calcAmounts(discountedFace, 1, ev.absorb_stripe_fee !== false);
    // The client sends a fresh checkoutId per checkout attempt, so double-taps reuse one
    // PaymentIntent but a second purchase of the same tier gets its own.
    const checkoutId = typeof req.body.checkoutId === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(req.body.checkoutId)
      ? req.body.checkoutId : crypto.randomUUID();
    const idempotencyKey = `pi-${req.userId}-${checkoutId}-${amounts.chargeAmount}`;

    // ── 6. Generate short ticket code ────────────────────────────
    const ticketCode = generateTicketCode();

    // ── 5a. FREE PATH — coupon discounts to $0, skip Stripe entirely ──
    if (amounts.chargeAmount === 0) {
      const { data: insertedTicket, error: insertErr } = await supabaseAdmin
        .from('tickets')
        .insert({
          event_id:               eventId,
          ticket_type_id:         ticketTypeId,
          user_id:                req.userId,
          quantity:               parsedQty,
          unit_price_cents:       tt.price_cents,
          total_charged_cents:    0,
          platform_fee_cents:     0,
          stripe_fee_cents:       0,
          host_receives_cents:    0,
          stripe_payment_intent:  null,
          stripe_idempotency_key: null,
          status:                 'confirmed',
          buyer_email:            buyerEmail,
          code:                   ticketCode,
          coupon_id:              couponId      || null,
          discount_cents:         discountCents || 0,
          promoter_id:            promoterId,
        })
        .select('id, code')
        .single();
      if (insertErr) throw insertErr;

      await onTicketConfirmed({
        event_id:            eventId,
        ticket_type_id:      ticketTypeId,
        coupon_id:           couponId,
        user_id:             req.userId,
        quantity:            parsedQty,
        total_charged_cents: 0,
        buyer_email:         buyerEmail,
      });

      return res.json({
        free:       true,
        breakdown:  amounts,
        ticketCode: insertedTicket?.code || ticketCode,
      });
    }

    // ── 5b. PAID PATH — create Stripe PaymentIntent ───────────────
    const intent = await stripe.paymentIntents.create({
      amount:               amounts.chargeAmount,
      currency:             'usd',
      payment_method_types: ['card'],
      receipt_email:        buyerEmail,
      description:          `${parsedQty}x ${tt.name} — ${ev.name}`,
      metadata: {
        event_id:       eventId,
        ticket_type_id: ticketTypeId,
        buyer_id:       req.userId,
        qty:            String(parsedQty),
        platform_fee:   String(amounts.platformFee),
      },
      transfer_data:          { destination: stripeAcct.stripe_account_id },
      application_fee_amount: amounts.platformFee,
    }, { idempotencyKey });

    // ── 7. Create pending ticket record (a retried request reuses the same intent) ─
    const { data: existingTicket } = await supabaseAdmin
      .from('tickets').select('id, code').eq('stripe_payment_intent', intent.id).maybeSingle();
    if (existingTicket) {
      return res.json({ clientSecret: intent.client_secret, breakdown: amounts, intentId: intent.id, ticketCode: existingTicket.code });
    }
    const { data: insertedTicket, error: pendingErr } = await supabaseAdmin
      .from('tickets')
      .insert({
        event_id:               eventId,
        ticket_type_id:         ticketTypeId,
        user_id:                req.userId,
        quantity:               parsedQty,
        unit_price_cents:       tt.price_cents,
        total_charged_cents:    amounts.chargeAmount,
        platform_fee_cents:     amounts.platformFee,
        stripe_fee_cents:       amounts.stripeFee,
        host_receives_cents:    amounts.hostReceives,
        stripe_payment_intent:  intent.id,
        stripe_idempotency_key: idempotencyKey,
        status:                 'pending',
        buyer_email:            buyerEmail,
        code:                   ticketCode,
        coupon_id:      couponId      || null,
        discount_cents: discountCents || 0,
        promoter_id:    promoterId,
      })
      .select('id, code')
      .single();
    if (pendingErr) throw pendingErr;

    res.json({
      clientSecret: intent.client_secret,
      breakdown:    amounts,
      intentId:     intent.id,
      ticketCode:   insertedTicket?.code || ticketCode,
    });

  } catch (e) {
    console.error('[payment-intent] error:', e.message);
    res.status(400).json({
      error: e.type === 'StripeInvalidRequestError'
        ? 'Payment setup failed — please try again or contact support.'
        : e.message,
    });
  }
});

app.post('/api/connect-onboard', requireAuth, async (req, res) => {
  try {
    const { data: existing } = await supabaseAdmin
      .from('host_stripe_accounts')
      .select('stripe_account_id, onboarding_complete, payouts_enabled')
      .eq('user_id', req.userId)
      .single();

    let accountId = existing?.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: req.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers:     { requested: true },
        },
        metadata: { christlink_user_id: req.userId },
      });
      accountId = account.id;
      await supabaseAdmin.from('host_stripe_accounts').insert({
        user_id:             req.userId,
        stripe_account_id:   accountId,
        onboarding_complete: false,
        payouts_enabled:     false,
        charges_enabled:     false,
      });
    } else if (existing?.payouts_enabled) {
      // Already fully onboarded — return a Stripe dashboard login link
      try {
        const loginLink = await stripe.accounts.createLoginLink(accountId);
        return res.json({ url: loginLink.url, accountId, alreadyOnboarded: true });
      } catch (e) {
        // Fall through to re-onboard if login link fails
      }
    }

    const appUrl = (process.env.APP_URL || `https://${req.headers.host}`).replace(/\/$/, '');
    const link = await stripe.accountLinks.create({
      account:     accountId,
      refresh_url: `${appUrl}/?reauth=1`,
      return_url:  `${appUrl}/?connected=1`,
      type:        'account_onboarding',
    });

    res.json({ url: link.url, accountId });
  } catch (e) {
    console.error('[connect-onboard]', e.message);
    if (e.message && e.message.toLowerCase().includes('platform profile')) {
      return res.status(400).json({
        error: 'Stripe Connect is not fully configured yet. The platform owner must complete the Connect platform profile in the Stripe Dashboard before hosts can set up payouts.',
        platformSetup: true,
      });
    }
    res.status(400).json({ error: e.message });
  }
});

// Sync Stripe account status after onboarding redirect
app.post('/api/connect-sync', requireAuth, async (req, res) => {
  try {
    const { data: row } = await supabaseAdmin
      .from('host_stripe_accounts')
      .select('stripe_account_id')
      .eq('user_id', req.userId)
      .single();

    if (!row?.stripe_account_id) {
      return res.status(404).json({ error: 'No connected account found.' });
    }

    const account = await stripe.accounts.retrieve(row.stripe_account_id);

    const updates = {
      onboarding_complete: account.details_submitted,
      payouts_enabled:     account.payouts_enabled,
      charges_enabled:     account.charges_enabled,
      updated_at:          new Date().toISOString(),
    };

    await supabaseAdmin
      .from('host_stripe_accounts')
      .update(updates)
      .eq('stripe_account_id', row.stripe_account_id);

    if (account.payouts_enabled) {
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'host' })
        .eq('id', req.userId)
        .eq('role', 'attendee');
    }

    res.json({
      accountId:          row.stripe_account_id,
      onboardingComplete: account.details_submitted,
      payoutsEnabled:     account.payouts_enabled,
      chargesEnabled:     account.charges_enabled,
      requirements:       account.requirements,
    });
  } catch (e) {
    console.error('[connect-sync]', e.message);
    res.status(400).json({ error: e.message });
  }
});

// Disconnect/reset Stripe Connect — removes the DB record so user can re-onboard
app.delete('/api/connect-disconnect', requireAuth, async (req, res) => {
  try {
    const { data: row } = await supabaseAdmin
      .from('host_stripe_accounts')
      .select('stripe_account_id')
      .eq('user_id', req.userId)
      .single();
    if (!row) return res.status(404).json({ error: 'No connected Stripe account found.' });
    await supabaseAdmin.from('host_stripe_accounts').delete().eq('user_id', req.userId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: disconnect any user's Stripe Connect account
app.delete('/api/admin/connect-disconnect/:userId', requireAdmin, async (req, res) => {
  try {
    await supabaseAdmin.from('host_stripe_accounts').delete().eq('user_id', req.params.userId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ════════════════════════════════════════════════════════════
// IDENTITY VERIFICATION
// ════════════════════════════════════════════════════════════

app.post('/api/identity/submit', requireAuth, async (req, res) => {
  const { legal_name, id_doc_base64 } = req.body;
  if (!legal_name?.trim()) return res.status(400).json({ error: 'Legal name is required.' });
  if (!id_doc_base64)       return res.status(400).json({ error: 'ID document photo is required.' });
  try {
    const doc = parseImageDataUrl(id_doc_base64, { maxBytes: 10 * 1024 * 1024, allowPdf: true });
    if (doc.error) return res.status(doc.status).json({ error: doc.error });
    const { mimeType, buffer, ext } = doc;
    const path = `${req.userId}/id-${Date.now()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from('identity-docs')
      .upload(path, buffer, { upsert: true, contentType: mimeType });
    if (upErr) throw upErr;

    const cleanName = sanitizeText(legal_name.trim());
    const { error: dbErr } = await supabaseAdmin
      .from('identity_verifications')
      .upsert({
        user_id: req.userId, status: 'pending', legal_name: cleanName,
        id_doc_path: path, submitted_at: new Date().toISOString(),
        verified_at: null, rejected_reason: null, reviewed_by: null,
      }, { onConflict: 'user_id' });
    if (dbErr) throw dbErr;

    // Keep profile full_name in sync with legal name
    const { data: prof } = await supabaseAdmin.from('profiles').select('full_name').eq('id', req.userId).single();
    if (prof && prof.full_name?.toLowerCase().trim() !== cleanName.toLowerCase()) {
      await supabaseAdmin.from('profiles').update({ full_name: cleanName }).eq('id', req.userId);
    }
    res.json({ success: true });
  } catch (e) {
    console.error('[identity/submit]', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/identity/status', requireAuth, async (req, res) => {
  try {
    const { data } = await supabaseAdmin
      .from('identity_verifications')
      .select('status, legal_name, submitted_at, verified_at, rejected_reason')
      .eq('user_id', req.userId)
      .single();
    res.json({ verification: data || null });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/verifications', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabaseAdmin
      .from('identity_verifications')
      .select('*, profiles!user_id(full_name, email, avatar_url, avatar_color)')
      .order('submitted_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ verifications: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/verifications/:userId/approve', requireAdmin, async (req, res) => {
  try {
    const uid = req.params.userId;
    const { error: vErr } = await supabaseAdmin.from('identity_verifications')
      .update({ status: 'verified', verified_at: new Date().toISOString(), reviewed_by: req.userId, rejected_reason: null })
      .eq('user_id', uid);
    if (vErr) throw vErr;
    const { error: pErr } = await supabaseAdmin.from('profiles')
      .update({ identity_verified: true, identity_verified_at: new Date().toISOString() })
      .eq('id', uid);
    if (pErr) throw pErr;
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/admin/verifications/:userId/reject', requireAdmin, async (req, res) => {
  const { reason } = req.body;
  try {
    const uid = req.params.userId;
    const { error: vErr } = await supabaseAdmin.from('identity_verifications')
      .update({ status: 'rejected', reviewed_by: req.userId, rejected_reason: sanitizeText(reason || 'Verification could not be confirmed.') })
      .eq('user_id', uid);
    if (vErr) throw vErr;
    await supabaseAdmin.from('profiles')
      .update({ identity_verified: false, identity_verified_at: null })
      .eq('id', uid);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/verifications/:userId/id-doc', requireAdmin, async (req, res) => {
  try {
    const { data: v } = await supabaseAdmin.from('identity_verifications')
      .select('id_doc_path').eq('user_id', req.params.userId).single();
    if (!v?.id_doc_path) return res.status(404).json({ error: 'No ID document found.' });
    const { data, error } = await supabaseAdmin.storage
      .from('identity-docs').createSignedUrl(v.id_doc_path, 3600);
    if (error) throw error;
    res.json({ url: data.signedUrl });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Fallback route — called by frontend after payment succeeds
// Confirms the ticket without relying on webhook delivery
app.post('/api/tickets/confirm-by-intent', requireAuth, async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentId required.' });
  try {
    // Verify the payment intent actually succeeded with Stripe
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ error: `Payment status is ${intent.status}, not succeeded.` });
    }
    // Confirm the ticket in DB
    const { data: tickets, error } = await supabaseAdmin
      .from('tickets')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('stripe_payment_intent', paymentIntentId)
      .eq('user_id', req.userId)
      .eq('status', 'pending')
      .select('id, code, quantity, ticket_type_id, event_id, total_charged_cents, coupon_id');
    if (error) throw error;
    // Only runs if we actually flipped a pending ticket (prevents double-count with webhook)
    if (tickets?.length > 0) await onTicketConfirmed({ ...tickets[0], user_id: req.userId, buyer_email: req.user.email });
    res.json({ confirmed: true, tickets: tickets || [] });
  } catch (e) {
    console.error('[confirm-by-intent]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── Host-initiated refund ────────────────────────────────────
// Only the event host can refund a ticket; attendee must be confirmed.
app.post('/api/tickets/:ticketId/refund', pmtLimiter, requireAuth, async (req, res) => {
  const { ticketId } = req.params;
  try {
    const { data: ticket } = await supabaseAdmin
      .from('tickets')
      .select('id, stripe_payment_intent, status, event_id, quantity, ticket_type_id')
      .eq('id', ticketId)
      .single();
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    if (ticket.status !== 'confirmed') return res.status(400).json({ error: 'Only confirmed tickets can be refunded.' });

    // Verify requester is the event host
    const { data: ev } = await supabaseAdmin
      .from('events').select('host_id').eq('id', ticket.event_id).single();
    if (!ev || ev.host_id !== req.userId) return res.status(403).json({ error: 'Only the event host can issue refunds.' });

    if (!ticket.stripe_payment_intent) return res.status(400).json({ error: 'No payment on record for this ticket.' });

    // Look up the PaymentIntent to get the charge
    const intent = await stripe.paymentIntents.retrieve(ticket.stripe_payment_intent);
    if (!intent.latest_charge) return res.status(400).json({ error: 'No charge found for this payment.' });

    const refund = await stripe.refunds.create(
      { charge: intent.latest_charge, reverse_transfer: true },
      { idempotencyKey: `refund-${ticketId}` });

    const { data: updatedTicket } = await supabaseAdmin
      .from('tickets')
      .update({ status: 'refunded' })
      .eq('id', ticketId)
      .select('user_id, total_charged_cents, buyer_email')
      .single();

    // Decrement sold count
    if (ticket.ticket_type_id) {
      await supabaseAdmin.rpc('increment_tickets_sold', {
        p_ticket_type_id: ticket.ticket_type_id,
        p_qty: -(ticket.quantity || 1),
      });
    }
    promoteWaitlist(ticket.event_id).catch(() => {});

    // Notify attendee of refund
    if (updatedTicket?.user_id) {
      const { data: evData } = await supabaseAdmin
        .from('events').select('name').eq('id', ticket.event_id).single();
      const amt = updatedTicket.total_charged_cents
        ? `$${(updatedTicket.total_charged_cents / 100).toFixed(2)}`
        : 'your payment';
      createNotification(updatedTicket.user_id, {
        type:  'refund_approved',
        title: 'Refund issued',
        body:  `The host has issued a refund of ${amt} for "${evData?.name || 'your event'}". It may take 5–10 business days to appear.`,
        data:  { event_id: ticket.event_id },
      });
      const { data: attendeeProfile } = await supabaseAdmin
        .from('profiles').select('email').eq('id', updatedTicket.user_id).single();
      sendEmail({
        to:      attendeeProfile?.email || updatedTicket.buyer_email,
        subject: `Refund issued for "${evData?.name}"`,
        html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="margin:0 0 16px">Refund Issued ✅</h2>
          <p style="font-size:15px;margin:0 0 10px">The host has issued a refund of <strong>${amt}</strong> for <strong>"${escapeHtml(evData?.name)}"</strong>.</p>
          <p style="font-size:14px;color:#555;margin:0 0 10px">It may take 5–10 business days to appear on your statement.</p>
        </div>`,
      });
    }

    res.json({ success: true, refundId: refund.id });
  } catch (e) {
    console.error('[refund]', e.message);
    res.status(400).json({ error: e.message });
  }
});

// ════════════════════════════════════════════════════════════
// REFUND REQUESTS (attendee-initiated)
// ════════════════════════════════════════════════════════════

// Helper: send email via Resend (no extra package — plain fetch)
async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return; // email silently skipped if not configured
  const from = process.env.FROM_EMAIL || 'ChristLink <noreply@christlink.com>';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
    });
  } catch (e) {
    console.error('[sendEmail]', e.message);
  }
}

// Helper: create in-app notification
async function createNotification(userId, { type, title, body, data }) {
  await supabaseAdmin.from('notifications')
    .insert({ user_id: userId, type, title, body: body || null, data: data || null });
}

// Wrap pre-escaped inner HTML in the standard ChristLink email layout
function emailLayout(innerHtml, eventId) {
  const appUrl = (process.env.APP_URL || '').split(',')[0].trim().replace(/\/$/, '');
  const cta = eventId && appUrl
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(`${appUrl}/e/${eventId}`)}" style="display:inline-block;background:#C9A84C;color:#0A0A0F;padding:12px 20px;border-radius:10px;font-weight:700;text-decoration:none">View event</a></p>`
    : '';
  return `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#111;font-size:15px;line-height:1.5">
    ${innerHtml}${cta}
    <p style="color:#888;font-size:12px;margin:28px 0 0">ChristLink · Faith Events Platform</p>
  </div>`;
}

// Email a user by id (looks up their address). innerHtml must already be escaped.
async function notifyByEmail(userId, subject, innerHtml, eventId) {
  try {
    const { data: p } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
    if (p?.email) await sendEmail({ to: p.email, subject, html: emailLayout(innerHtml, eventId) });
  } catch (e) { console.error('[notifyByEmail]', e.message); }
}

// Runs exactly once per ticket when it flips pending → confirmed (webhook OR client confirm).
async function onTicketConfirmed(ticket) {
  try {
    if (ticket.ticket_type_id) {
      await supabaseAdmin.rpc('increment_tickets_sold', { p_ticket_type_id: ticket.ticket_type_id, p_qty: ticket.quantity || 1 });
    }
    // Coupon uses are only counted for completed purchases (abandoned checkouts don't burn uses)
    if (ticket.coupon_id) await supabaseAdmin.rpc('increment_coupon_uses', { p_coupon_id: ticket.coupon_id });
    if (ticket.user_id) {
      await supabaseAdmin.from('event_waitlist').delete().eq('event_id', ticket.event_id).eq('user_id', ticket.user_id);
    }
  } catch (e) {
    console.error('[onTicketConfirmed]', e.message);
  }
  notifyHostOfSale(ticket);
}

// Helper: notify host when a ticket sale is confirmed
async function notifyHostOfSale(ticket) {
  try {
    const [{ data: ev }, { data: buyer }] = await Promise.all([
      supabaseAdmin.from('events').select('name, host_id').eq('id', ticket.event_id).single(),
      supabaseAdmin.from('profiles').select('full_name, email').eq('id', ticket.user_id).single(),
    ]);
    if (!ev) return;
    const { data: hostProfile } = await supabaseAdmin
      .from('profiles').select('full_name, email').eq('id', ev.host_id).single();
    if (!hostProfile) return;

    const qty       = ticket.quantity || 1;
    const amount    = ticket.total_charged_cents
      ? `$${(ticket.total_charged_cents / 100).toFixed(2)}`
      : 'Free';
    const buyerName = buyer?.full_name || ticket.buyer_email || 'A guest';
    const evName    = escapeHtml(ev.name);

    await createNotification(ev.host_id, {
      type:  'ticket_sale',
      title: `New ticket sale — ${ev.name}`,
      body:  `${buyerName} purchased ${qty} ticket${qty > 1 ? 's' : ''} (${amount}).`,
      data:  { event_id: ticket.event_id },
    });

    await sendEmail({
      to:      hostProfile.email,
      subject: `New ticket sale for "${ev.name}"`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin:0 0 16px">New Ticket Sale 🎟️</h2>
        <p style="margin:0 0 10px;font-size:15px"><strong>${escapeHtml(buyerName)}</strong> just purchased
          <strong>${qty} ticket${qty > 1 ? 's' : ''}</strong> to <strong>${evName}</strong>.</p>
        <p style="font-size:15px;margin:0 0 10px">Amount: <strong>${amount}</strong></p>
        <p style="font-size:13px;color:#888;margin:24px 0 0">View your sales in the ChristLink host dashboard.</p>
      </div>`,
    });
  } catch (e) {
    console.error('[notifyHostOfSale]', e.message);
  }
}

// POST /api/tickets/:ticketId/request-refund
// Attendee submits a refund request — notifies host in-app and by email
app.post('/api/tickets/:ticketId/request-refund', requireAuth, async (req, res) => {
  const safeReason = typeof req.body.reason === 'string' ? sanitizeText(req.body.reason, 1000) : '';
  const { ticketId } = req.params;
  try {
    // Fetch ticket + event + host info in one round
    const { data: ticket } = await supabaseAdmin
      .from('tickets')
      .select('id, event_id, status, total_charged_cents, quantity, code, buyer_email, user_id')
      .eq('id', ticketId)
      .eq('user_id', req.userId)
      .single();
    if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
    if (ticket.status !== 'confirmed') return res.status(400).json({ error: 'Only confirmed tickets can be refunded.' });
    if ((ticket.total_charged_cents || 0) === 0) return res.status(400).json({ error: 'Free tickets cannot be refunded.' });

    const { data: ev } = await supabaseAdmin
      .from('events').select('id, name, host_id').eq('id', ticket.event_id).single();
    if (!ev) return res.status(404).json({ error: 'Event not found.' });

    const [{ data: requester }, { data: host }] = await Promise.all([
      supabaseAdmin.from('profiles').select('full_name, email').eq('id', req.userId).single(),
      supabaseAdmin.from('profiles').select('full_name, email').eq('id', ev.host_id).single(),
    ]);

    // Upsert request (only one per ticket)
    const { data: request, error: reqErr } = await supabaseAdmin
      .from('refund_requests')
      .upsert({
        ticket_id:    ticketId,
        event_id:     ev.id,
        requester_id: req.userId,
        host_id:      ev.host_id,
        reason:       safeReason || null,
        status:       'pending',
      }, { onConflict: 'ticket_id' })
      .select()
      .single();
    if (reqErr) throw reqErr;

    const requesterName = requester?.full_name || ticket.buyer_email || 'A guest';
    const amount = `$${((ticket.total_charged_cents) / 100).toFixed(2)}`;

    // In-app notification for host
    await createNotification(ev.host_id, {
      type:  'refund_request',
      title: `Refund request — ${ev.name}`,
      body:  `${requesterName} requested a refund (${amount}).${safeReason ? ' Reason: ' + safeReason : ''}`,
      data:  { refund_request_id: request.id, ticket_id: ticketId, event_id: ev.id },
    });

    // Email to host
    await sendEmail({
      to:      host?.email,
      subject: `Refund request for "${ev.name}"`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#C9A84C">Refund Request</h2>
          <p><strong>${escapeHtml(requesterName)}</strong> has requested a refund for their ticket to <strong>${escapeHtml(ev.name)}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px 0;color:#555">Amount:</td><td style="padding:8px 0;font-weight:600">${amount}</td></tr>
            <tr><td style="padding:8px 0;color:#555">Ticket code:</td><td style="padding:8px 0;font-family:monospace">${escapeHtml(ticket.code || ticketId.slice(0,8).toUpperCase())}</td></tr>
            ${safeReason ? `<tr><td style="padding:8px 0;color:#555;vertical-align:top">Reason:</td><td style="padding:8px 0">${escapeHtml(safeReason)}</td></tr>` : ''}
          </table>
          <p>Log in to ChristLink to approve or deny this request from your event's Sales section.</p>
          <p style="color:#888;font-size:12px">ChristLink · Faith Events Platform</p>
        </div>`,
    });

    res.json({ success: true, requestId: request.id });
  } catch (e) {
    console.error('[request-refund]', e.message);
    res.status(400).json({ error: e.message });
  }
});

// POST /api/refund-requests/:id/approve — host approves → issues Stripe refund
app.post('/api/refund-requests/:id/approve', pmtLimiter, requireAuth, async (req, res) => {
  try {
    const { data: request } = await supabaseAdmin
      .from('refund_requests')
      .select('*, tickets(id, stripe_payment_intent, quantity, ticket_type_id, user_id, total_charged_cents, buyer_email)')
      .eq('id', req.params.id)
      .eq('host_id', req.userId)
      .single();
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request already resolved.' });

    const ticket = request.tickets;
    if (!ticket?.stripe_payment_intent) return res.status(400).json({ error: 'No payment on record.' });

    const intent = await stripe.paymentIntents.retrieve(ticket.stripe_payment_intent);
    if (!intent.latest_charge) return res.status(400).json({ error: 'No charge found.' });
    const refund = await stripe.refunds.create(
      { charge: intent.latest_charge, reverse_transfer: true },
      { idempotencyKey: `refund-${ticket.id}` });

    await Promise.all([
      supabaseAdmin.from('tickets').update({ status: 'refunded' }).eq('id', ticket.id),
      supabaseAdmin.from('refund_requests').update({ status: 'approved', resolved_at: new Date().toISOString() }).eq('id', request.id),
      ticket.ticket_type_id
        ? supabaseAdmin.rpc('increment_tickets_sold', { p_ticket_type_id: ticket.ticket_type_id, p_qty: -(ticket.quantity || 1) })
        : Promise.resolve(),
      promoteWaitlist(request.event_id).catch(() => {}),
      createNotification(ticket.user_id, {
        type:  'refund_approved',
        title: 'Refund approved',
        body:  `Your refund of $${((ticket.total_charged_cents||0)/100).toFixed(2)} has been issued. It may take 5–10 business days to appear.`,
        data:  { ticket_id: ticket.id, event_id: request.event_id },
      }),
    ]);

    // Email to attendee
    const [{ data: ev }, { data: attendee }] = await Promise.all([
      supabaseAdmin.from('events').select('name').eq('id', request.event_id).single(),
      supabaseAdmin.from('profiles').select('full_name, email').eq('id', ticket.user_id).single(),
    ]);
    await sendEmail({
      to: attendee?.email || ticket.buyer_email,
      subject: `Your refund for "${ev?.name}" has been approved`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#4EC98C">Refund Approved ✓</h2>
        <p>Your refund of <strong>$${((ticket.total_charged_cents||0)/100).toFixed(2)}</strong> for <strong>${escapeHtml(ev?.name)}</strong> has been approved.</p>
        <p>It may take <strong>5–10 business days</strong> to appear on your statement.</p>
        <p style="color:#888;font-size:12px">ChristLink · Faith Events Platform</p>
      </div>`,
    });

    res.json({ success: true, refundId: refund.id });
  } catch (e) {
    console.error('[approve-refund]', e.message);
    res.status(400).json({ error: e.message });
  }
});

// POST /api/refund-requests/:id/deny — host denies request
app.post('/api/refund-requests/:id/deny', requireAuth, async (req, res) => {
  try {
    const { data: request } = await supabaseAdmin
      .from('refund_requests')
      .select('*, tickets(id, user_id, total_charged_cents, buyer_email), events(name)')
      .eq('id', req.params.id)
      .eq('host_id', req.userId)
      .single();
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request already resolved.' });

    await supabaseAdmin.from('refund_requests')
      .update({ status: 'denied', resolved_at: new Date().toISOString() }).eq('id', request.id);

    const ticket = request.tickets;
    const evName = request.events?.name;
    await createNotification(ticket.user_id, {
      type:  'refund_denied',
      title: 'Refund request declined',
      body:  `Your refund request for "${evName}" was not approved. Contact the host for questions.`,
      data:  { ticket_id: ticket.id, event_id: request.event_id },
    });

    await sendEmail({
      to: (await supabaseAdmin.from('profiles').select('email').eq('id', ticket.user_id).single())?.data?.email || ticket.buyer_email,
      subject: `Update on your refund request for "${evName}"`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="color:#ef4444">Refund Not Approved</h2>
        <p>Your refund request for <strong>${escapeHtml(evName)}</strong> was not approved by the host.</p>
        <p>If you have questions, please contact the event host directly.</p>
        <p style="color:#888;font-size:12px">ChristLink · Faith Events Platform</p>
      </div>`,
    });

    res.json({ success: true });
  } catch (e) {
    console.error('[deny-refund]', e.message);
    res.status(400).json({ error: e.message });
  }
});

// GET /api/notifications — current user's notifications (newest 30)
app.get('/api/notifications', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ notifications: data || [] });
});

// PATCH /api/notifications/read-all — mark all read
app.patch('/api/notifications/read-all', requireAuth, async (req, res) => {
  await supabaseAdmin.from('notifications')
    .update({ read: true }).eq('user_id', req.userId).eq('read', false);
  res.json({ success: true });
});

// POST /api/events/:eventId/invite — host sends event invites to selected followers
app.post('/api/events/:eventId/invite', requireAuth, async (req, res) => {
  const { eventId } = req.params;
  const { followerIds } = req.body;
  if (!Array.isArray(followerIds) || followerIds.length === 0)
    return res.status(400).json({ error: 'No followers selected.' });
  if (followerIds.length > 100)
    return res.status(400).json({ error: 'Cannot invite more than 100 people at once.' });
  try {
    const { data: ev, error } = await supabaseAdmin
      .from('events').select('id, name, host_id').eq('id', eventId).single();
    if (error || !ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.host_id !== req.userId) return res.status(403).json({ error: 'Only the host can send invites.' });
    // Only actual followers can be invited (prevents notification spam to arbitrary users)
    const { data: follows } = await supabaseAdmin.from('user_follows')
      .select('follower_id').eq('following_id', req.userId)
      .in('follower_id', followerIds.filter(isUuid));
    const allowed = [...new Set((follows || []).map(f => f.follower_id))];
    if (!allowed.length) return res.status(400).json({ error: 'Select people who follow you.' });
    const { data: host } = await supabaseAdmin
      .from('profiles').select('full_name').eq('id', req.userId).single();
    const hostName = host?.full_name || 'Someone';
    await supabaseAdmin.from('notifications').insert(
      allowed.map(uid => ({
        user_id: uid,
        type: 'event_invite',
        title: `${hostName} invited you to an event`,
        body: ev.name,
        data: { event_id: ev.id, event_name: ev.name }
      }))
    );
    res.json({ sent: allowed.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/refund-requests — host fetches refund requests for their events
// Optional ?eventId=<uuid> to scope to a single event
app.get('/api/refund-requests', requireAuth, async (req, res) => {
  let query = supabaseAdmin
    .from('refund_requests')
    .select('*, tickets(id, quantity, total_charged_cents, code, buyer_email), events(id, name), profiles!refund_requests_requester_id_fkey(full_name, avatar_url, avatar_color)')
    .eq('host_id', req.userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (req.query.eventId) {
    query = query.eq('event_id', req.query.eventId);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ requests: data || [] });
});

// ════════════════════════════════════════════════════════════
// STRIPE WEBHOOK
// ════════════════════════════════════════════════════════════
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    // Try platform webhook secret first, fall back to Connect secret
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const connectSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (e) {
      if (connectSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, connectSecret);
      } else {
        throw e;
      }
    }
  } catch (e) {
    console.error('Webhook sig failed:', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }
  // Idempotency: skip already-processed webhook events
  const { data: existing } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single();
  if (existing) {
    return res.json({ received: true, duplicate: true });
  }
  const { error: claimErr } = await supabaseAdmin.from('webhook_events')
    .insert({ stripe_event_id: event.id, event_type: event.type });
  // Unique violation = another delivery of this event is already being processed
  if (claimErr?.code === '23505') return res.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        console.log('[webhook] payment_intent.succeeded:', pi.id, 'metadata:', pi.metadata);
        if (pi.metadata.type === 'listing_fee') {
          if (pi.metadata.event_id) await supabaseAdmin.from('events')
            .update({ listing_fee_paid: true, listing_payment_id: pi.id }).eq('id', pi.metadata.event_id);
          break;
        }
        const { data: updatedTickets, error: ticketErr } = await supabaseAdmin.from('tickets')
          .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
          .eq('stripe_payment_intent', pi.id)
          .eq('status', 'pending')
          .select('id, event_id, user_id, quantity, total_charged_cents, buyer_email, ticket_type_id, coupon_id');
        if (ticketErr) console.error('[webhook] ticket update error:', ticketErr.message);
        console.log('[webhook] confirmed tickets:', updatedTickets?.length || 0);
        if (updatedTickets?.length > 0) await onTicketConfirmed(updatedTickets[0]);
        break;
      }
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        await supabaseAdmin.from('tickets').update({ status: 'failed' })
          .eq('stripe_payment_intent', event.data.object.id).eq('status', 'pending');
        break;
      case 'account.updated': {
        const acct = event.data.object;
        console.log('[webhook] account.updated:', acct.id,
          'payouts:', acct.payouts_enabled,
          'charges:', acct.charges_enabled,
          'submitted:', acct.details_submitted);

        const { data: existing } = await supabaseAdmin
          .from('host_stripe_accounts')
          .select('id, user_id')
          .eq('stripe_account_id', acct.id)
          .single();

        if (!existing) {
          console.warn('[webhook] account.updated: no DB row for', acct.id);
          break;
        }

        await supabaseAdmin
          .from('host_stripe_accounts')
          .update({
            onboarding_complete: acct.details_submitted,
            payouts_enabled:     acct.payouts_enabled,
            charges_enabled:     acct.charges_enabled,
            updated_at:          new Date().toISOString(),
          })
          .eq('stripe_account_id', acct.id);

        if (acct.payouts_enabled && existing.user_id) {
          // Only promote attendees — never downgrade admins or verified users
          await supabaseAdmin
            .from('profiles')
            .update({ role: 'host' })
            .eq('id', existing.user_id)
            .eq('role', 'attendee');
        }

        console.log('[webhook] account.updated: DB synced for', acct.id);
        break;
      }
      case 'charge.refunded': {
        // Refunds issued from the Stripe dashboard: sync status + inventory
        const { data: refunded } = await supabaseAdmin.from('tickets').update({ status: 'refunded' })
          .eq('stripe_payment_intent', event.data.object.payment_intent)
          .eq('status', 'confirmed')
          .select('event_id, ticket_type_id, quantity');
        for (const t of refunded || []) {
          if (t.ticket_type_id) await supabaseAdmin.rpc('increment_tickets_sold', { p_ticket_type_id: t.ticket_type_id, p_qty: -(t.quantity || 1) });
          promoteWaitlist(t.event_id).catch(() => {});
        }
        break;
      }
      case 'charge.dispute.created':
        if (event.data.object.payment_intent)
          await supabaseAdmin.from('tickets').update({ status: 'disputed' })
            .eq('stripe_payment_intent', event.data.object.payment_intent);
        break;
    }
    res.json({ received: true });
  } catch (e) {
    // Release the idempotency claim so Stripe's retry gets processed
    console.error('Webhook error:', e.message);
    await supabaseAdmin.from('webhook_events').delete().eq('stripe_event_id', event.id);
    res.status(500).json({ received: false });
  }
}

// ════════════════════════════════════════════════════════════
// APPLE WALLET — .pkpass generation
// ════════════════════════════════════════════════════════════

function signManifest(manifestJson, p12Base64, p12Password) {
  const p12Der  = Buffer.from(p12Base64, 'base64');
  const p12Asn1 = forge.asn1.fromDer(p12Der.toString('binary'));
  const p12Obj  = forge.pkcs12.pkcs12FromAsn1(p12Asn1, p12Password);

  let certPem = null;
  let keyPem  = null;

  for (const safeContent of p12Obj.safeContents) {
    for (const safeBag of safeContent.safeBags) {
      if (safeBag.type === forge.pki.oids.certBag) {
        certPem = forge.pki.certificateToPem(safeBag.cert);
      }
      if (safeBag.type === forge.pki.oids.pkcs8ShroudedKeyBag ||
          safeBag.type === forge.pki.oids.keyBag) {
        keyPem = forge.pki.privateKeyToPem(safeBag.key);
      }
    }
  }

  if (!certPem || !keyPem) throw new Error('Could not extract cert/key from P12.');

  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(manifestJson, 'utf8');
  p7.addCertificate(certPem);
  p7.addSigner({
    key:         keyPem,
    certificate: certPem,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType,   value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest               },
      { type: forge.pki.oids.signingTime,   value: new Date() },
    ],
  });
  p7.sign({ detached: true });
  const derBytes = forge.asn1.toDer(p7.toAsn1()).getBytes();
  return Buffer.from(derBytes, 'binary');
}

app.get('/api/tickets/:ticketId/wallet', requireAuth, async (req, res) => {
  const { ticketId } = req.params;

  const { data: ticket } = await supabaseAdmin
    .from('tickets')
    .select('*, events(name, start_date, end_date, venue_name, city, state, cover_url), ticket_types(name)')
    .eq('id', ticketId)
    .eq('user_id', req.userId)
    .eq('status', 'confirmed')
    .single();

  if (!ticket) return res.status(404).json({ error: 'Ticket not found or not confirmed.' });

  const p12Base64   = process.env.APPLE_PASS_P12_BASE64;
  const p12Password = process.env.APPLE_PASS_P12_PASSWORD;
  const passTypeId  = process.env.APPLE_PASS_TYPE_ID  || 'pass.com.christlink.tickets';
  const teamId      = process.env.APPLE_TEAM_ID       || 'QKP52JF8KD';

  if (!p12Base64 || !p12Password) {
    return res.status(503).json({ error: 'Apple Wallet not configured on this server.' });
  }

  try {
    const ev          = ticket.events || {};
    const shortCode   = (ticket.stripe_payment_intent || ticket.id).replace(/[^a-zA-Z0-9]/g,'').slice(-8).toUpperCase();
    const eventName   = ev.name      || 'Christ Link Event';
    const venueName   = ev.venue_name || (ev.city ? `${ev.city}${ev.state ? ', ' + ev.state : ''}` : 'See event details');
    const startDate   = ev.start_date ? new Date(ev.start_date) : new Date();
    const relevantDate = startDate.toISOString();
    const fmtDate     = startDate.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });

    const passJson = {
      formatVersion:          1,
      passTypeIdentifier:     passTypeId,
      serialNumber:           ticket.id,
      teamIdentifier:         teamId,
      organizationName:       'Christ Link',
      description:            eventName,
      logoText:               'Christ Link',
      foregroundColor:        'rgb(240, 235, 224)',
      backgroundColor:        'rgb(10, 10, 15)',
      labelColor:             'rgb(201, 168, 76)',
      relevantDate,
      barcode: {
        message:         JSON.stringify({ ticketId: ticket.id, code: shortCode, eventId: ticket.event_id }),
        format:          'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
        altText:         shortCode,
      },
      barcodes: [{
        message:         JSON.stringify({ ticketId: ticket.id, code: shortCode, eventId: ticket.event_id }),
        format:          'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1',
        altText:         shortCode,
      }],
      eventTicket: {
        primaryFields: [
          { key: 'event',  label: 'EVENT',    value: eventName },
        ],
        secondaryFields: [
          { key: 'date',   label: 'DATE',     value: fmtDate },
          { key: 'qty',    label: 'TICKETS',  value: String(ticket.quantity || 1) },
        ],
        auxiliaryFields: [
          { key: 'venue',  label: 'LOCATION', value: venueName },
          { key: 'type',   label: 'TYPE',     value: ticket.ticket_types?.name || 'General Admission' },
        ],
        backFields: [
          { key: 'ticketid', label: 'Ticket ID',     value: ticket.id },
          { key: 'code',     label: 'Confirmation',  value: shortCode },
          { key: 'email',    label: 'Registered To', value: ticket.buyer_email || '' },
          { key: 'terms',    label: 'Terms',         value: 'This ticket is non-transferable. Present QR code at entry. Issued by Christ Link.' },
        ],
      },
    };

    const passJsonStr = JSON.stringify(passJson);
    const zip = new JSZip();

    const transparentPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    zip.file('pass.json',    passJsonStr);
    zip.file('icon.png',     transparentPng);
    zip.file('icon@2x.png',  transparentPng);
    zip.file('logo.png',     transparentPng);
    zip.file('logo@2x.png',  transparentPng);

    const manifest = {};
    for (const [name] of Object.entries(zip.files)) {
      const buf = await zip.file(name).async('nodebuffer');
      manifest[name] = require('crypto').createHash('sha1').update(buf).digest('hex');
    }
    const manifestStr = JSON.stringify(manifest);
    zip.file('manifest.json', manifestStr);

    const signatureBuf = signManifest(manifestStr, p12Base64, p12Password);
    zip.file('signature', signatureBuf);

    const pkpassBuf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    res.set({
      'Content-Type':        'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="christlink-${shortCode}.pkpass"`,
      'Content-Length':      pkpassBuf.length,
    });
    res.send(pkpassBuf);

  } catch(e) {
    console.error('Wallet generation error:', e.message);
    res.status(500).json({ error: 'Failed to generate pass. ' + e.message });
  }
});

// ════════════════════════════════════════════════════════════
// COMMUNITY POSTS
// ════════════════════════════════════════════════════════════
app.get('/api/community-posts', async (req, res) => {
  const limit  = Math.min(Math.max(parseInt(req.query.limit)  || 30, 1), 100);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);

  let callerId = null;
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    try {
      const { data: { user } } = await supabase.auth.getUser(auth.replace('Bearer ', ''));
      callerId = user?.id || null;
    } catch {}
  }

  const { data: posts, error } = await supabaseAdmin
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(Number(offset), Number(offset) + Number(limit) - 1);
  if (error) return res.status(500).json({ error: error.message });
  if (!posts || posts.length === 0) return res.json({ posts: [] });

  const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
  const { data: profiles } = authorIds.length
    ? await supabaseAdmin.from('profiles').select('id, full_name, avatar_url, avatar_color').in('id', authorIds)
    : { data: [] };
  const profilesMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  let amenedSet = new Set();
  if (callerId) {
    const postIds = posts.map(p => p.id);
    const { data: amens } = await supabaseAdmin
      .from('community_post_amens').select('post_id').eq('user_id', callerId).in('post_id', postIds);
    amenedSet = new Set((amens || []).map(a => a.post_id));
  }

  res.json({ posts: posts.map(p => ({ ...p, profiles: profilesMap[p.author_id] || null, has_amened: amenedSet.has(p.id) })) });
});

app.post('/api/community-posts', requireAuth, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Post body required.' });
  const safeBody = sanitizeText(body);
  if (!safeBody) return res.status(400).json({ error: 'Post body required.' });
  const { data: post, error } = await supabaseAdmin
    .from('community_posts')
    .insert({ author_id: req.userId, body: safeBody })
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id, full_name, avatar_url, avatar_color').eq('id', req.userId).single();
  res.json({ ...post, profiles: profile || null });
});

app.patch('/api/community-posts/:id', requireAuth, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Body required.' });
  const safeBody = sanitizeText(body);
  if (!safeBody) return res.status(400).json({ error: 'Body required.' });
  const { data: post } = await supabaseAdmin
    .from('community_posts').select('author_id').eq('id', req.params.id).single();
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  if (post.author_id !== req.userId) return res.status(403).json({ error: 'Not your post.' });
  const { data: updated, error } = await supabaseAdmin
    .from('community_posts').update({ body: safeBody }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id, full_name, avatar_url, avatar_color').eq('id', req.userId).single();
  res.json({ ...updated, profiles: profile || null });
});

app.delete('/api/community-posts/:id', requireAuth, async (req, res) => {
  // Only the author can delete
  const { data: post } = await supabaseAdmin
    .from('community_posts').select('author_id').eq('id', req.params.id).single();
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  if (post.author_id !== req.userId) return res.status(403).json({ error: 'Not your post.' });
  const { error } = await supabaseAdmin.from('community_posts').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

app.post('/api/community-posts/:id/amen', requireAuth, async (req, res) => {
  const postId = req.params.id;
  const userId = req.userId;
  const { data: existing } = await supabaseAdmin
    .from('community_post_amens').select('post_id').eq('post_id', postId).eq('user_id', userId).single();
  if (existing) {
    await supabaseAdmin.from('community_post_amens').delete().eq('post_id', postId).eq('user_id', userId);
    await supabaseAdmin.rpc('adjust_post_amen_count', { p_post_id: postId, p_delta: -1 });
  } else {
    await supabaseAdmin.from('community_post_amens').insert({ post_id: postId, user_id: userId });
    await supabaseAdmin.rpc('adjust_post_amen_count', { p_post_id: postId, p_delta: 1 });
  }
  const { data: updated } = await supabaseAdmin.from('community_posts').select('amen_count').eq('id', postId).single();
  res.json({ amen_count: updated?.amen_count ?? 0, has_amened: !existing });
});

// ════════════════════════════════════════════════════════════
// COMMUNITY REPLIES
// ════════════════════════════════════════════════════════════

// GET /api/community-posts/:id/replies
app.get('/api/community-posts/:id/replies', async (req, res) => {
  const { data: replies, error } = await supabaseAdmin
    .from('community_replies')
    .select('*')
    .eq('post_id', req.params.id)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  if (!replies || replies.length === 0) return res.json({ replies: [] });

  const authorIds = [...new Set(replies.map(r => r.author_id).filter(Boolean))];
  const { data: profiles } = authorIds.length
    ? await supabaseAdmin.from('profiles').select('id, full_name, avatar_url, avatar_color').in('id', authorIds)
    : { data: [] };
  const profilesMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  let amenedSet = new Set();
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    try {
      const { data: { user } } = await supabase.auth.getUser(auth.replace('Bearer ', ''));
      if (user?.id) {
        const replyIds = replies.map(r => r.id);
        const { data: amens } = await supabaseAdmin
          .from('community_reply_amens').select('reply_id').eq('user_id', user.id).in('reply_id', replyIds);
        amenedSet = new Set((amens || []).map(a => a.reply_id));
      }
    } catch {}
  }

  res.json({ replies: replies.map(r => ({ ...r, profiles: profilesMap[r.author_id] || null, has_amened: amenedSet.has(r.id) })) });
});

// POST /api/community-posts/:id/replies
app.post('/api/community-posts/:id/replies', requireAuth, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Reply body required.' });
  const safeReply = sanitizeText(body);
  if (!safeReply) return res.status(400).json({ error: 'Reply body required.' });
  if (safeReply.length > 500) return res.status(400).json({ error: 'Reply must be 500 characters or less.' });

  const { data: post } = await supabaseAdmin
    .from('community_posts').select('id').eq('id', req.params.id).single();
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const { data: reply, error } = await supabaseAdmin
    .from('community_replies')
    .insert({ post_id: req.params.id, author_id: req.userId, body: safeReply })
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });

  await supabaseAdmin.rpc('increment_reply_count', { p_post_id: req.params.id, p_delta: 1 });

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id, full_name, avatar_url, avatar_color').eq('id', req.userId).single();
  res.json({ ...reply, profiles: profile || null });
});

// DELETE /api/community-posts/:postId/replies/:replyId
app.delete('/api/community-posts/:postId/replies/:replyId', requireAuth, async (req, res) => {
  const { data: reply } = await supabaseAdmin
    .from('community_replies').select('author_id').eq('id', req.params.replyId).single();
  if (!reply) return res.status(404).json({ error: 'Reply not found.' });
  if (reply.author_id !== req.userId)
    return res.status(403).json({ error: 'Not your reply.' });

  const { error } = await supabaseAdmin
    .from('community_replies').delete().eq('id', req.params.replyId);
  if (error) return res.status(400).json({ error: error.message });

  // Decrement reply_count on parent post
  await supabaseAdmin.rpc('increment_reply_count', {
    p_post_id: req.params.postId,
    p_delta: -1,
  });

  res.json({ ok: true });
});

// POST /api/community-replies/:id/amen
app.post('/api/community-replies/:id/amen', requireAuth, async (req, res) => {
  const replyId = req.params.id;
  const userId  = req.userId;
  const { data: existing } = await supabaseAdmin
    .from('community_reply_amens').select('reply_id').eq('reply_id', replyId).eq('user_id', userId).single();
  if (existing) {
    await supabaseAdmin.from('community_reply_amens').delete().eq('reply_id', replyId).eq('user_id', userId);
    await supabaseAdmin.rpc('adjust_reply_amen_count', { p_reply_id: replyId, p_delta: -1 });
  } else {
    await supabaseAdmin.from('community_reply_amens').insert({ reply_id: replyId, user_id: userId });
    await supabaseAdmin.rpc('adjust_reply_amen_count', { p_reply_id: replyId, p_delta: 1 });
  }
  const { data: updated } = await supabaseAdmin.from('community_replies').select('amen_count').eq('id', replyId).single();
  res.json({ amen_count: updated?.amen_count ?? 0, has_amened: !existing });
});

// ── ADMIN MIDDLEWARE ─────────────────────────────────────────
async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'Authentication required.' });
  const token = auth.replace('Bearer ', '');
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid session.' });
    req.user   = user;
    req.userId = user.id;
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin')
      return res.status(403).json({ error: 'Admin access required.' });
    next();
  } catch {
    res.status(401).json({ error: 'Authentication failed.' });
  }
}

// ════════════════════════════════════════════════════════════
// ADMIN ROUTES (all require admin role)
// ════════════════════════════════════════════════════════════

// Overview stats
app.get('/api/admin/overview', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_overview')
      .select('*')
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Daily signups chart data
app.get('/api/admin/signups', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_daily_signups')
      .select('*');
    if (error) throw error;
    res.json({ data: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Daily revenue chart data
app.get('/api/admin/revenue', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_daily_revenue')
      .select('*');
    if (error) throw error;
    res.json({ data: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Events by type
app.get('/api/admin/events-by-type', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_events_by_type')
      .select('*');
    if (error) throw error;
    res.json({ data: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Top events by attendance
app.get('/api/admin/top-events', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_top_events')
      .select('*');
    if (error) throw error;
    res.json({ events: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Top hosts
app.get('/api/admin/top-hosts', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_top_hosts')
      .select('*');
    if (error) throw error;
    res.json({ hosts: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Recent activity feed
app.get('/api/admin/activity', requireAdmin, async (req, res) => {
  try {
    const [users, events, tickets] = await Promise.all([
      supabaseAdmin.from('profiles')
        .select('id, full_name, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(10),
      supabaseAdmin.from('events')
        .select('id, name, status, created_at, host_id, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(10),
      supabaseAdmin.from('tickets')
        .select('id, quantity, total_charged_cents, confirmed_at, events(name), profiles(full_name)')
        .eq('status', 'confirmed')
        .order('confirmed_at', { ascending: false })
        .limit(10),
    ]);
    const activity = [
      ...(users.data || []).map(u => ({
        type: 'signup', time: u.created_at,
        text: `${u.full_name || u.email} joined ChristLink`,
        icon: '👤', color: '#4EC98C',
      })),
      ...(events.data || []).map(e => ({
        type: 'event', time: e.created_at,
        text: `${e.profiles?.full_name || 'Host'} created "${e.name}"`,
        icon: '✝', color: '#C9A84C',
        sub: e.status,
      })),
      ...(tickets.data || []).map(t => ({
        type: 'ticket', time: t.confirmed_at,
        text: `${t.profiles?.full_name || 'Attendee'} bought ${t.quantity} ticket${t.quantity !== 1 ? 's' : ''} for "${t.events?.name}"`,
        icon: '🎟️', color: '#A882FF',
        sub: `$${((t.total_charged_cents || 0) / 100).toFixed(2)}`,
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 20);
    res.json({ activity });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// User search + management
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  const { q, role } = req.query;
  const limit  = Math.min(Math.max(parseInt(req.query.limit)  || 30, 1), 200);
  const offset = Math.max(parseInt(req.query.offset) || 0, 0);
  try {
    let query = supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role, city, created_at, avatar_url, avatar_color, host_stripe_accounts(stripe_account_id)')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);
    const safeQ = sanitizeSearch(q);
    if (safeQ) query = query.or(`full_name.ilike.%${safeQ}%,email.ilike.%${safeQ}%`);
    if (role) query = query.eq('role', role);
    const { data, error } = await query;
    if (error) throw error;
    const users = (data || []).map(u => ({
      ...u,
      stripe_account_id: u.host_stripe_accounts?.[0]?.stripe_account_id || null,
      host_stripe_accounts: undefined,
    }));
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update user role
app.patch('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!['attendee','host','admin'].includes(role))
    return res.status(400).json({ error: 'Invalid role.' });
  if (req.params.id === req.userId && role !== 'admin')
    return res.status(400).json({ error: 'Cannot change your own admin role.' });
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin cancel event
app.patch('/api/admin/events/:id/cancel', requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('events')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin delete event
app.delete('/api/admin/events/:id', requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List all community posts for admin moderation
app.get('/api/admin/posts', requireAdmin, async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);
    const { data: posts, error } = await supabaseAdmin
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) return res.status(500).json({ error: error.message });
    if (!posts?.length) return res.json({ posts: [] });
    const ids = [...new Set(posts.map(p => p.author_id).filter(Boolean))];
    const { data: profiles } = ids.length
      ? await supabaseAdmin.from('profiles').select('id, full_name, avatar_url, avatar_color').in('id', ids)
      : { data: [] };
    const pm = Object.fromEntries((profiles || []).map(p => [p.id, p]));
    res.json({ posts: posts.map(p => ({ ...p, profiles: pm[p.author_id] || null })) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete community post (admin moderation)
app.delete('/api/admin/posts/:id', requireAdmin, async (req, res) => {
  try {
    await supabaseAdmin.from('community_posts').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── LISTING PROMO CODES (admin) ─────────────────────────────
app.get('/api/admin/listing-promo-codes', requireAdmin, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('listing_promo_codes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ codes: data });
});

app.post('/api/admin/listing-promo-codes', requireAdmin, async (req, res) => {
  const { code, discount_type, discount_value, max_uses, expires_at } = req.body;
  if (!code || !discount_type || !discount_value)
    return res.status(400).json({ error: 'code, discount_type and discount_value are required.' });
  if (!['percent','fixed'].includes(discount_type))
    return res.status(400).json({ error: 'discount_type must be percent or fixed.' });
  const val = parseFloat(discount_value);
  if (isNaN(val) || val <= 0) return res.status(400).json({ error: 'discount_value must be a positive number.' });
  if (discount_type === 'percent' && val > 100) return res.status(400).json({ error: 'Percent discount cannot exceed 100.' });
  const { data, error } = await supabaseAdmin
    .from('listing_promo_codes')
    .insert({
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value: val,
      max_uses: max_uses ? parseInt(max_uses, 10) : null,
      expires_at: expires_at || null,
    })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ code: data });
});

app.patch('/api/admin/listing-promo-codes/:id', requireAdmin, async (req, res) => {
  const { active } = req.body;
  const { error } = await supabaseAdmin
    .from('listing_promo_codes')
    .update({ active })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Validate a promo code (called by host before payment)
app.post('/api/validate-listing-promo', requireAuth, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required.' });
  const { data: promo } = await supabaseAdmin
    .from('listing_promo_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .single();
  if (!promo) return res.status(404).json({ error: 'Invalid or expired promo code.' });
  if (promo.expires_at && new Date() > new Date(promo.expires_at))
    return res.status(400).json({ error: 'This promo code has expired.' });
  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses)
    return res.status(400).json({ error: 'This promo code has reached its usage limit.' });
  // Calculate discounted amount
  let discountCents;
  if (promo.discount_type === 'percent') {
    discountCents = Math.round(HOST_LISTING_FEE * (promo.discount_value / 100));
  } else {
    discountCents = Math.min(Math.round(promo.discount_value * 100), HOST_LISTING_FEE);
  }
  const finalCents = Math.max(0, HOST_LISTING_FEE - discountCents);
  res.json({ valid: true, promo_id: promo.id, discount_type: promo.discount_type, discount_value: promo.discount_value, discount_cents: discountCents, final_cents: finalCents });
});

// ─── SCHEDULED EVENT AUTO-PUBLISHER ─────────────────────────
// Checks every 60 seconds for draft events whose publish_at has passed
setInterval(async () => {
  try {
    const { data: due } = await supabaseAdmin
      .from('events')
      .select('id, is_paid, listing_fee_paid')
      .eq('status', 'draft')
      .not('publish_at', 'is', null)
      .lte('publish_at', new Date().toISOString());
    for (const ev of due || []) {
      if (ev.is_paid && !ev.listing_fee_paid) continue; // skip if fee not settled
      await supabaseAdmin
        .from('events')
        .update({ status: 'published', publish_at: null })
        .eq('id', ev.id);
      console.log(`[scheduler] Auto-published event ${ev.id}`);
    }
  } catch (e) {
    console.error('[scheduler] Auto-publish check failed:', e.message);
  }
}, 60_000);

// ─── SHAREABLE EVENT LINKS (/e/:id) ─────────────────────────
// Serves the SPA with event-specific Open Graph tags so links unfurl with the
// event's title, date and cover image in iMessage, WhatsApp, Instagram, etc.
// ?ref=CODE attributes the visit to a promoter link.
const fs = require('fs');
let indexHtmlCache = null;
function getIndexHtml() {
  if (!indexHtmlCache || process.env.NODE_ENV !== 'production') {
    indexHtmlCache = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  }
  return indexHtmlCache;
}

app.get('/e/:id', async (req, res) => {
  const id = req.params.id;
  const html = getIndexHtml();
  if (!isUuid(id)) return res.redirect(302, '/');
  try {
    const { data: ev } = await supabaseAdmin.from('events')
      .select('id, name, description, cover_url, start_date, city, state, venue_name, status')
      .eq('id', id).single();
    if (!ev || ev.status === 'draft') return res.redirect(302, '/');

    const ref = typeof req.query.ref === 'string' ? req.query.ref : '';
    if (ref) {
      const promoterId = await resolvePromoter(ev.id, ref);
      if (promoterId) supabaseAdmin.rpc('increment_promoter_clicks', { p_promoter_id: promoterId }).then(() => {}, () => {});
    }

    const when = ev.start_date
      ? new Date(ev.start_date).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' })
      : '';
    const where = [ev.venue_name, ev.city, ev.state].filter(Boolean).join(', ');
    const desc  = [when, where, (ev.description || '').slice(0, 160)].filter(Boolean).join(' · ');
    const base  = `${req.protocol}://${req.get('host')}`;
    const url   = `${base}/e/${ev.id}`;
    const image = sanitizeUrl(ev.cover_url) || `${base}/icon-logo.png`;
    const title = `${ev.name} | Christ Link`;

    const meta = `<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${escapeHtml(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Christ Link">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:title" content="${escapeHtml(ev.name)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(ev.name)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<script>try{var r=${JSON.stringify(/^[A-Za-z0-9_-]{1,40}$/.test(ref) ? ref : '')};if(r)sessionStorage.setItem('cl_ref_${ev.id}',r);}catch(e){}history.replaceState(null,'','/#event/${ev.id}');</script>`;

    // Swap the generic head tags for event-specific ones
    const out = html
      .replace(/<title>[\s\S]*?<\/title>\s*/, '')
      .replace(/<meta name="description"[^>]*>\s*/, '')
      .replace(/<meta property="og:[^"]+"[^>]*>\s*/g, '')
      .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, '')
      .replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n${meta}`);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(out);
  } catch (e) {
    console.error('[share page]', e.message);
    res.redirect(302, `/#event/${id}`);
  }
});

// ─── SPA FALLBACK ───────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────
// Must be defined after all routes. Catches any unhandled errors
// thrown or passed via next(err) so API routes never return HTML.
app.use((err, req, res, next) => {
  console.error('[unhandled error]', err.message, err.stack);
  if (res.headersSent) return next(err);
  if (req.path.startsWith('/api/') || req.path === '/webhook') {
    return res.status(500).json({ error: 'Internal server error.' });
  }
  res.status(500).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✝  Christ Link running on :${PORT}`);
  console.log(`   Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`   App URL:  ${process.env.APP_URL || 'http://localhost:'+PORT}\n`);
});
