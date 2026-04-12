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
const forge     = require('node-forge');
const JSZip     = require('jszip');
const crypto    = require('crypto');

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

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.APP_URL
    ? process.env.APP_URL.split(',').map(s => s.trim())
    : ['http://localhost:4242', 'http://127.0.0.1:4242'],
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure storage buckets exist (runs once on startup)
(async () => {
  const buckets = [
    { name: 'avatars',      public: true },
    { name: 'event-images', public: true },
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
// Strip all HTML tags to prevent stored XSS
function sanitizeText(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
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
  const { dataUrl } = req.body;
  if (!dataUrl || !dataUrl.startsWith('data:')) return res.status(400).json({ error: 'Invalid image data.' });
  try {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Bad data URL format.' });
    const mimeType = matches[1];
    const buffer   = Buffer.from(matches[2], 'base64');
    const ext      = mimeType.includes('png') ? 'png' : 'jpg';
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
  if (full_name               !== undefined) updates.full_name               = full_name;
  if (bio                     !== undefined) updates.bio                     = bio;
  if (city                    !== undefined) updates.city                    = city;
  if (avatar_url              !== undefined) updates.avatar_url              = avatar_url;
  if (avatar_color            !== undefined) updates.avatar_color            = avatar_color;
  if (avatar_ring_color       !== undefined) updates.avatar_ring_color       = avatar_ring_color;
  if (instagram_url           !== undefined) updates.instagram_url           = instagram_url;
  if (facebook_url            !== undefined) updates.facebook_url            = facebook_url;
  if (tiktok_url              !== undefined) updates.tiktok_url              = tiktok_url;
  if (banner_url              !== undefined) updates.banner_url              = banner_url;
  if (bible_verse             !== undefined) updates.bible_verse             = bible_verse;
  if (bible_verse_reference   !== undefined) updates.bible_verse_reference   = bible_verse_reference;
  if (bible_version           !== undefined) updates.bible_version           = bible_version;
  if (hot_takes               !== undefined) updates.hot_takes               = hot_takes;
  if (hobbies                 !== undefined) updates.hobbies                 = hobbies;
  if (connect_tags            !== undefined) updates.connect_tags            = Array.isArray(connect_tags) ? connect_tags : [];
  if (prayer_request          !== undefined) updates.prayer_request          = prayer_request;
  if (testimony               !== undefined) updates.testimony               = testimony;
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
  const { dataUrl } = req.body;
  if (!dataUrl || !dataUrl.startsWith('data:')) return res.status(400).json({ error: 'Invalid image data.' });
  try {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Bad data URL format.' });
    const mimeType = matches[1];
    const buffer   = Buffer.from(matches[2], 'base64');
    const ext      = mimeType.includes('png') ? 'png' : 'jpg';
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
  const { dataUrl, type } = req.body; // type: 'cover' | 'gallery'
  if (!dataUrl || !dataUrl.startsWith('data:')) return res.status(400).json({ error: 'Invalid image data.' });
  try {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Bad data URL format.' });
    const mimeType = matches[1];
    const buffer   = Buffer.from(matches[2], 'base64');
    const ext      = mimeType.includes('png') ? 'png' : 'jpg';
    const suffix   = type === 'cover' ? 'cover' : `gallery-${Math.random().toString(36).slice(2)}`;
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
  const { dataUrl } = req.body;
  if (!dataUrl || !dataUrl.startsWith('data:')) return res.status(400).json({ error: 'Invalid image data.' });
  try {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Bad data URL format.' });
    const mimeType = matches[1];
    const buffer   = Buffer.from(matches[2], 'base64');
    const ext      = mimeType.includes('png') ? 'png' : 'jpg';
    const path     = `forum/${req.userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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
  const { city, type, is_paid, q, format, host_id, lat, lng, radius = 100 } = req.query;
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
  if (format)  query = query.eq('format', format);
  if (host_id) query = query.eq('host_id', host_id);
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
  const { data: ev, error } = await supabaseAdmin
    .from('events_with_details').select('*').eq('id', req.params.id).single();
  if (error || !ev) return res.status(404).json({ error: 'Event not found.' });
  const { data: ticketTypes } = await supabaseAdmin.from('ticket_types').select('*').eq('event_id', req.params.id);
  // View now has explicit cover_url and forum_enabled — no aliasing needed.
  res.json({ ...ev, ticket_types: ticketTypes || [] });
});

app.post('/api/events', requireAuth, async (req, res) => {
  const {
    name, description, cover_url, gallery_urls, event_type, age_group, format,
    denomination, tags, is_paid, absorb_stripe_fee,
    start_date, end_date, sales_cutoff, venue_name, address, city, state, zip, online_url, max_capacity,
    forum_enabled, publish_at,
  } = req.body;
  if (!name) return res.status(400).json({ error: 'Event name is required.' });
  const safeName        = sanitizeText(name);
  const safeDescription = sanitizeText(description);
  await supabaseAdmin.from('profiles').update({ role: 'host' }).eq('id', req.userId).eq('role', 'attendee');
  // Geocode address to lat/lng for Near Me radius search
  const coords = format !== 'online' ? await geocodeAddress([address, city, state, zip]) : null;
  const { data, error } = await supabaseAdmin.from('events').insert({
    host_id: req.userId, name: safeName, description: safeDescription,
    cover_url: cover_url || null,
    gallery_urls: gallery_urls || [],
    event_type,
    age_group: age_group || 'All Ages',
    format: format || 'in_person',
    denomination, tags,
    is_paid: is_paid || false,
    absorb_stripe_fee: absorb_stripe_fee !== false,
    start_date: start_date || null, end_date: end_date || null,
    sales_cutoff: sales_cutoff || end_date || null,
    venue_name, address, city, state, zip, online_url,
    max_capacity: max_capacity || null,
    forum_enabled: forum_enabled !== false,
    publish_at: publish_at || null,
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
  const allowed = [
    'name','description','event_type','age_group','format','denomination','tags',
    'start_date','end_date','sales_cutoff','venue_name','address','city','state','zip','online_url',
    'max_capacity','gallery_urls','forum_enabled',
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  // cover_url is now the canonical column name; add it to allowed fields
  if (req.body.cover_url !== undefined) updates.cover_url = req.body.cover_url;
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
      .from('events').select('id, status, host_id').eq('id', req.params.id).single();
    if (!ev) return res.status(404).json({ error: 'Event not found.' });
    if (ev.host_id !== req.userId) return res.status(403).json({ error: 'Not your event.' });
    const newStatus = ev.status === 'published' ? 'draft' : 'published';
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
    const { id, created_at, updated_at, listing_fee_paid, listing_payment_id, ...rest } = ev;
    const { data: newEv, error } = await supabaseAdmin.from('events').insert({
      ...rest,
      name:   `${ev.name} (Copy)`,
      status: 'draft',
      listing_fee_paid:    false,
      listing_payment_id:  null,
    }).select().single();
    if (error) throw error;

    // Duplicate ticket types if any
    const { data: tts } = await supabaseAdmin
      .from('ticket_types').select('*').eq('event_id', id);
    if (tts?.length) {
      const newTts = tts.map(tt => {
        const { id: ttId, created_at: ttCa, tickets_sold, ...ttRest } = tt;
        return { ...ttRest, event_id: newEv.id, tickets_sold: 0 };
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
    const { content, image_url, message_type = 'text' } = req.body;
    if (!content?.trim() && !image_url)
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
      content:      content?.trim() || null,
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
  const { data: ev } = await supabaseAdmin
    .from('events').select('host_id').eq('id', req.params.id).single();
  if (!ev || ev.host_id !== req.userId)
    return res.status(403).json({ error: 'Not your event.' });
  const { data, error } = await supabaseAdmin.from('coupons').insert({
    event_id:       req.params.id,
    host_id:        req.userId,
    code:           code.trim().toUpperCase(),
    discount_type,
    discount_value: Number(discount_value),
    max_uses:       max_uses || null,
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
  const face = ticketPriceCents * (qty || 1);
  const discountCents = coupon.discount_type === 'percent'
    ? Math.round(face * coupon.discount_value / 100)
    : Math.min(coupon.discount_value * 100, face);
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
    .eq('status', 'confirmed')
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
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ error: 'Event ID required.' });
  const { data: ev } = await supabaseAdmin.from('events').select('id, max_capacity, status, end_date, sales_cutoff').eq('id', eventId).single();
  if (!ev || ev.status !== 'published') return res.status(404).json({ error: 'Event not found.' });
  const cutoff = ev.sales_cutoff || ev.end_date;
  if (cutoff && new Date() > new Date(cutoff)) return res.status(400).json({ error: 'RSVPs for this event are now closed.' });
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

// ── Public Attendee List ─────────────────────────────────────
app.get('/api/events/:id/attendees', async (req, res) => {
  const [{ data: rsvpRows }, { data: ticketRows }] = await Promise.all([
    supabaseAdmin.from('rsvps').select('user_id').eq('event_id', req.params.id).eq('status', 'confirmed').limit(100),
    supabaseAdmin.from('tickets').select('user_id').eq('event_id', req.params.id).eq('status', 'confirmed').limit(100),
  ]);
  const userIds = [...new Set([...(rsvpRows || []), ...(ticketRows || [])].map(r => r.user_id).filter(Boolean))];
  if (userIds.length === 0) return res.json({ attendees: [], total: 0 });
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, bio, city, avatar_url, avatar_color, instagram_url, facebook_url, tiktok_url')
    .in('id', userIds);
  res.json({ attendees: profiles || [], total: (profiles || []).length });
});

// ── Ticket Verification (scanner) ───────────────────────────
app.post('/api/tickets/verify', requireAuth, async (req, res) => {
  const { ticketId, code, eventId } = req.body;
  if (!ticketId && !code) return res.status(400).json({ valid: false, error: 'Ticket ID or code required.' });

  try {
    // First verify the requesting user is the host of this event
    if (eventId) {
      const { data: ev } = await supabaseAdmin
        .from('events').select('host_id').eq('id', eventId).single();
      if (!ev || ev.host_id !== req.userId) {
        return res.status(403).json({ valid: false, error: 'Only the event host can verify tickets.' });
      }
    }

    // Look up the ticket
    let query = supabaseAdmin
      .from('tickets')
      .select('*, events(name,start_date,city), ticket_types(name)')
      .eq('status', 'confirmed');

    if (ticketId) query = query.eq('id', ticketId);
    else {
      // Match against dedicated code column first, fall back to payment intent suffix
      const { data: byCode } = await supabaseAdmin
        .from('tickets')
        .select('*, events(name,start_date,city), ticket_types(name)')
        .eq('status', 'confirmed')
        .ilike('code', code)
        .eq('event_id', eventId || '')
        .maybeSingle();
      if (byCode) {
        // Found by code — skip the rest of query building
        const ticket = byCode;
        const { data: existingCheckin } = await supabaseAdmin.from('ticket_checkins').select('id,checked_in_at').eq('ticket_id', ticket.id).single();
        if (existingCheckin) {
          return res.json({ valid: false, already_checked_in: true, message: `Already checked in at ${new Date(existingCheckin.checked_in_at).toLocaleTimeString()}`, ticket: { ...ticket, code: ticket.code, event_name: ticket.events?.name } });
        }
        await supabaseAdmin.from('ticket_checkins').insert({ ticket_id: ticket.id, event_id: ticket.event_id, checked_in_by: req.userId });
        return res.json({ valid: true, message: `${ticket.quantity} ticket${ticket.quantity !== 1 ? 's' : ''} checked in successfully.`, ticket: { ...ticket, code: ticket.code, event_name: ticket.events?.name, ticket_type_name: ticket.ticket_types?.name } });
      }
      // Fall back to payment intent suffix match
      query = query.ilike('stripe_payment_intent', `%${code}`);
    }

    if (eventId) query = query.eq('event_id', eventId);

    const { data: ticket } = await query.single();

    if (!ticket) {
      return res.json({ valid: false, error: 'Ticket not found or not confirmed for this event.' });
    }

    // Check if already checked in
    const { data: existingCheckin } = await supabaseAdmin
      .from('ticket_checkins')
      .select('id, checked_in_at')
      .eq('ticket_id', ticket.id)
      .single();

    if (existingCheckin) {
      return res.json({
        valid: false,
        error: `Already checked in at ${new Date(existingCheckin.checked_in_at).toLocaleTimeString()}`,
        ticket: {
          ...ticket,
          code: (ticket.stripe_payment_intent || ticket.id).replace(/[^a-zA-Z0-9]/g,'').slice(-8).toUpperCase(),
          event_name: ticket.events?.name,
        }
      });
    }

    // Record check-in
    await supabaseAdmin.from('ticket_checkins').insert({
      ticket_id:     ticket.id,
      event_id:      ticket.event_id,
      checked_in_by: req.userId,
      checked_in_at: new Date().toISOString(),
    });

    res.json({
      valid: true,
      message: `${ticket.quantity} ticket${ticket.quantity !== 1 ? 's' : ''} checked in successfully.`,
      ticket: {
        ...ticket,
        code: (ticket.stripe_payment_intent || ticket.id).replace(/[^a-zA-Z0-9]/g,'').slice(-8).toUpperCase(),
        event_name:       ticket.events?.name,
        event_start_date: ticket.events?.start_date,
        ticket_type_name: ticket.ticket_types?.name,
      }
    });
  } catch(e) {
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
  const { paymentMethodId, eventId, hostEmail } = req.body;
  if (!paymentMethodId || !eventId) return res.status(400).json({ error: 'Payment method and event ID required.' });
  const { data: ev } = await supabaseAdmin.from('events').select('id, name, listing_fee_paid')
    .eq('id', eventId).eq('host_id', req.userId).single();
  if (!ev) return res.status(404).json({ error: 'Event not found or not yours.' });
  if (ev.listing_fee_paid) return res.status(400).json({ error: 'Listing fee already paid.' });
  try {
    const intent = await stripe.paymentIntents.create({
      amount:               HOST_LISTING_FEE,
      currency:             'usd',
      payment_method_types: ['card'],
      payment_method:       paymentMethodId,
      confirm:              true,
      receipt_email:        hostEmail || req.user.email,
      description:          `Christ Link listing fee — ${ev.name}`,
      metadata:             { type: 'listing_fee', event_id: eventId, host_id: req.userId },
      return_url:           `${process.env.APP_URL}/?listing_success=1`,
    }, { idempotencyKey: `listing-fee-${eventId}-${paymentMethodId.slice(-12)}` });
    if (intent.status === 'succeeded') {
      await supabaseAdmin
        .from('events')
        .update({ listing_fee_paid: true, listing_payment_id: intent.id })
        .eq('id', eventId);
      // Small delay to ensure DB commit propagates before frontend calls /publish
      await new Promise(r => setTimeout(r, 300));
      return res.json({ success: true, intentId: intent.id });
    }
    res.status(400).json({
      success: false,
      status: intent.status,
      error: `Payment status: ${intent.status}. Please try again.`,
    });
  } catch (e) {
    const msg = (e.raw?.code === 'payment_method_unexpected_state' || (e.message||'').toLowerCase().includes('previously used'))
      ? 'Your card could not be reused. Please re-enter your card details and try again.'
      : e.message;
    res.status(400).json({ error: msg, resetCard: true });
  }
});

app.post('/api/create-payment-intent', pmtLimiter, requireAuth, async (req, res) => {
  const { eventId, ticketTypeId, qty = 1, buyerEmail } = req.body;
  if (!eventId || !ticketTypeId)
    return res.status(400).json({ error: 'Event ID and ticket type required.' });

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
      .select('id, name, price_cents, quantity, sold')
      .eq('id', ticketTypeId)
      .eq('event_id', eventId)
      .single();

    if (ttErr || !tt)
      return res.status(404).json({ error: 'Ticket type not found for this event.' });

    const remaining = tt.quantity != null ? tt.quantity - (tt.sold || 0) : Infinity;
    if (qty > remaining)
      return res.status(400).json({ error: `Only ${remaining} ticket${remaining !== 1 ? 's' : ''} remaining.` });

    // ── 4. Calculate amounts ──────────────────────────────────────
    // Apply coupon discount if provided
    let adjustedPriceCents = tt.price_cents;
    let couponId           = null;
    let discountCents      = 0;
    if (req.body.couponCode) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('event_id', eventId)
        .eq('code', req.body.couponCode.trim().toUpperCase())
        .eq('active', true)
        .single();
      if (coupon && !(coupon.expires_at && new Date(coupon.expires_at) < new Date())
        && !(coupon.max_uses && coupon.uses >= coupon.max_uses)) {
        couponId      = coupon.id;
        discountCents = coupon.discount_type === 'percent'
          ? Math.round(tt.price_cents * coupon.discount_value / 100)
          : Math.min(coupon.discount_value * 100, tt.price_cents);
        adjustedPriceCents = Math.max(0, tt.price_cents - discountCents);
      }
    }
    const amounts        = calcAmounts(adjustedPriceCents, Number(qty), ev.absorb_stripe_fee !== false);
    const idempotencyKey = `pi-${req.userId}-${eventId}-${ticketTypeId}-${qty}`;

    // ── 6. Generate short ticket code ────────────────────────────
    const ticketCode = (
      Math.random().toString(36).slice(2, 6) +
      Math.random().toString(36).slice(2, 6)
    ).toUpperCase();

    // ── 5a. FREE PATH — coupon discounts to $0, skip Stripe entirely ──
    if (amounts.chargeAmount === 0) {
      const { data: insertedTicket, error: insertErr } = await supabaseAdmin
        .from('tickets')
        .insert({
          event_id:               eventId,
          ticket_type_id:         ticketTypeId,
          user_id:                req.userId,
          quantity:               Number(qty),
          unit_price_cents:       tt.price_cents,
          total_charged_cents:    0,
          platform_fee_cents:     0,
          stripe_fee_cents:       0,
          host_receives_cents:    0,
          stripe_payment_intent:  null,
          stripe_idempotency_key: null,
          status:                 'confirmed',
          buyer_email:            buyerEmail || req.user.email,
          code:                   ticketCode,
          coupon_id:              couponId      || null,
          discount_cents:         discountCents || 0,
        })
        .select('id, code')
        .single();
      if (insertErr) throw insertErr;

      if (couponId) {
        await supabaseAdmin.rpc('increment_coupon_uses', { p_coupon_id: couponId });
      }
      await supabaseAdmin.rpc('increment_tickets_sold', { p_ticket_type_id: ticketTypeId, p_qty: Number(qty) });

      // Fire-and-forget host sale notification
      notifyHostOfSale({
        event_id:            eventId,
        user_id:             req.userId,
        quantity:            Number(qty),
        total_charged_cents: 0,
        buyer_email:         buyerEmail || req.user.email,
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
      receipt_email:        buyerEmail || req.user.email,
      description:          `${qty}x ${tt.name} — ${ev.name}`,
      metadata: {
        event_id:       eventId,
        ticket_type_id: ticketTypeId,
        buyer_id:       req.userId,
        qty:            String(qty),
        platform_fee:   String(amounts.platformFee),
      },
      transfer_data:          { destination: stripeAcct.stripe_account_id },
      application_fee_amount: amounts.platformFee,
    }, { idempotencyKey });

    // ── 7. Create pending ticket record ──────────────────────────
    const { data: insertedTicket } = await supabaseAdmin
      .from('tickets')
      .insert({
        event_id:               eventId,
        ticket_type_id:         ticketTypeId,
        user_id:                req.userId,
        quantity:               Number(qty),
        unit_price_cents:       tt.price_cents,
        total_charged_cents:    amounts.chargeAmount,
        platform_fee_cents:     amounts.platformFee,
        stripe_fee_cents:       amounts.stripeFee,
        host_receives_cents:    amounts.hostReceives,
        stripe_payment_intent:  intent.id,
        stripe_idempotency_key: idempotencyKey,
        status:                 'pending',
        buyer_email:            buyerEmail || req.user.email,
        code:                   ticketCode,
        coupon_id:      couponId      || null,
        discount_cents: discountCents || 0,
      })
      .select('id, code')
      .single();

    // Increment coupon use count
    if (couponId) {
      await supabaseAdmin.rpc('increment_coupon_uses', { p_coupon_id: couponId });
    }

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
        .eq('id', req.userId);
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
      .select('id, code, quantity, ticket_type_id, event_id, total_charged_cents');
    if (error) throw error;
    // Increment sold count only if we actually updated a pending ticket (prevents double-count with webhook)
    if (tickets?.length > 0 && tickets[0].ticket_type_id) {
      await supabaseAdmin.rpc('increment_tickets_sold', {
        p_ticket_type_id: tickets[0].ticket_type_id,
        p_qty: tickets[0].quantity || 1,
      });
      // Notify host of sale (fire-and-forget)
      notifyHostOfSale({
        event_id:            tickets[0].event_id,
        user_id:             req.userId,
        quantity:            tickets[0].quantity || 1,
        total_charged_cents: tickets[0].total_charged_cents,
        buyer_email:         req.user.email,
      });
    }
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

    const refund = await stripe.refunds.create({ charge: intent.latest_charge });

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
          <p style="font-size:15px;margin:0 0 10px">The host has issued a refund of <strong>${amt}</strong> for <strong>"${evData?.name}"</strong>.</p>
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
        <p style="margin:0 0 10px;font-size:15px"><strong>${buyerName}</strong> just purchased
          <strong>${qty} ticket${qty > 1 ? 's' : ''}</strong> to <strong>${ev.name}</strong>.</p>
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
  const { reason } = req.body;
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
        reason:       reason?.trim() || null,
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
      body:  `${requesterName} requested a refund (${amount}).${reason ? ' Reason: ' + reason.trim() : ''}`,
      data:  { refund_request_id: request.id, ticket_id: ticketId, event_id: ev.id },
    });

    // Email to host
    await sendEmail({
      to:      host?.email,
      subject: `Refund request for "${ev.name}"`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#C9A84C">Refund Request</h2>
          <p><strong>${requesterName}</strong> has requested a refund for their ticket to <strong>${ev.name}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px 0;color:#555">Amount:</td><td style="padding:8px 0;font-weight:600">${amount}</td></tr>
            <tr><td style="padding:8px 0;color:#555">Ticket code:</td><td style="padding:8px 0;font-family:monospace">${ticket.code || ticketId.slice(0,8).toUpperCase()}</td></tr>
            ${reason ? `<tr><td style="padding:8px 0;color:#555;vertical-align:top">Reason:</td><td style="padding:8px 0">${reason.trim()}</td></tr>` : ''}
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
    const refund = await stripe.refunds.create({ charge: intent.latest_charge });

    await Promise.all([
      supabaseAdmin.from('tickets').update({ status: 'refunded' }).eq('id', ticket.id),
      supabaseAdmin.from('refund_requests').update({ status: 'approved', resolved_at: new Date().toISOString() }).eq('id', request.id),
      ticket.ticket_type_id
        ? supabaseAdmin.rpc('increment_tickets_sold', { p_ticket_type_id: ticket.ticket_type_id, p_qty: -(ticket.quantity || 1) })
        : Promise.resolve(),
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
        <p>Your refund of <strong>$${((ticket.total_charged_cents||0)/100).toFixed(2)}</strong> for <strong>${ev?.name}</strong> has been approved.</p>
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
        <p>Your refund request for <strong>${evName}</strong> was not approved by the host.</p>
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
    const { data: host } = await supabaseAdmin
      .from('profiles').select('full_name').eq('id', req.userId).single();
    const hostName = host?.full_name || 'Someone';
    await supabaseAdmin.from('notifications').insert(
      followerIds.map(uid => ({
        user_id: uid,
        type: 'event_invite',
        title: `${hostName} invited you to an event`,
        body: ev.name,
        data: { event_id: ev.id, event_name: ev.name }
      }))
    );
    res.json({ sent: followerIds.length });
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
  await supabaseAdmin.from('webhook_events').insert({ stripe_event_id: event.id, event_type: event.type });

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
          .select('id, event_id, user_id, quantity, total_charged_cents, buyer_email');
        if (ticketErr) console.error('[webhook] ticket update error:', ticketErr.message);
        console.log('[webhook] confirmed tickets:', updatedTickets?.length || 0);
        if (pi.metadata.ticket_type_id && updatedTickets?.length > 0) {
          await supabaseAdmin.rpc('increment_tickets_sold', {
            p_ticket_type_id: pi.metadata.ticket_type_id,
            p_qty: parseInt(pi.metadata.qty) || 1,
          });
          // Notify host (fire-and-forget — webhook already responded to Stripe)
          notifyHostOfSale(updatedTickets[0]);
        }
        break;
      }
      case 'payment_intent.payment_failed':
        await supabaseAdmin.from('tickets').update({ status: 'failed' })
          .eq('stripe_payment_intent', event.data.object.id);
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
          await supabaseAdmin
            .from('profiles')
            .update({ role: 'host' })
            .eq('id', existing.user_id);
        }

        console.log('[webhook] account.updated: DB synced for', acct.id);
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
  res.json({ posts: posts.map(p => ({ ...p, profiles: profilesMap[p.author_id] || null })) });
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
  const { data: post, error: fetchErr } = await supabaseAdmin
    .from('community_posts').select('amen_count').eq('id', req.params.id).single();
  if (fetchErr || !post) return res.status(404).json({ error: 'Post not found.' });
  const newCount = (post.amen_count || 0) + 1;
  const { error } = await supabaseAdmin
    .from('community_posts').update({ amen_count: newCount }).eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ amen_count: newCount });
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
  res.json({ replies: replies.map(r => ({ ...r, profiles: profilesMap[r.author_id] || null })) });
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
  const { data: reply, error: fetchErr } = await supabaseAdmin
    .from('community_replies').select('amen_count').eq('id', req.params.id).single();
  if (fetchErr || !reply) return res.status(404).json({ error: 'Reply not found.' });
  const newCount = (reply.amen_count || 0) + 1;
  await supabaseAdmin.from('community_replies').update({ amen_count: newCount }).eq('id', req.params.id);
  res.json({ amen_count: newCount });
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
      .select('id, full_name, email, role, city, created_at, avatar_url, avatar_color')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);
    if (q)    query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
    if (role) query = query.eq('role', role);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ users: data || [] });
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

// Delete community post (admin moderation)
app.delete('/api/admin/posts/:id', requireAdmin, async (req, res) => {
  try {
    await supabaseAdmin.from('community_posts').delete().eq('id', req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
