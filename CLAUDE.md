# ChristLink — Claude Code Context

## Project Overview
Faith-based Christian events marketplace PWA. Hosts can create free or paid events,
sell tickets, manage attendees, and run event forums. Attendees can discover events,
RSVP, buy tickets, and chat in event forums.

Live URL: https://christlink1-production.up.railway.app
Repo:     C:\Users\David\ChristLink1

---

## Stack
- **Backend:**  Node.js + Express (`server.js`)
- **Frontend:** Single file PWA (`public/index.html`) — vanilla JS, no React, ~4000+ lines
- **Database:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe Connect Express
- **Hosting:**  Railway (auto-deploys on git push)
- **Storage buckets:** `avatars`, `event-images`, `forum-images`

---

## Key Files
| File | Purpose |
|------|---------|
| `server.js` | ALL backend API routes |
| `public/index.html` | ENTIRE frontend — HTML + CSS + JS in one file |
| `CLAUDE.md` | This file — project context for Claude Code |

---

## Environment Variables (Railway)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PORT` (auto-set by Railway)

---

## Critical Rules — Never Break These

### Backend (server.js)
- Always use `supabaseAdmin` (not `supabase`) for ALL server-side DB operations
- Never use Supabase relational joins — always use two separate queries and merge results
- `app.set('trust proxy', 1)` must stay near the top of server.js — removing it breaks rate limiting on Railway
- Stripe webhook route must use `express.raw()` middleware, not `express.json()`
- After payment succeeds, call `/api/tickets/confirm-by-intent` immediately — never rely solely on webhook

### Frontend (public/index.html)
- `#page-forum` default CSS must be `display:none` — the router sets visibility
- `goTo('forum')` must set `display:flex` not `display:block` — forum uses flex layout
- All `.page` divs default to `display:none` — router controls which is visible
- Font size on all inputs/textareas must be `16px` minimum — prevents iOS Safari zoom
- `visualViewport` API handles iOS keyboard push-up in forum page

### Database
- Forum posts table: always write BOTH `author_id` AND `user_id` on every insert
- Events cover photo column: `cover_url` (was renamed from `image_url`)
- Ticket code column: `code`
- Ticket status flow: `pending` → `confirmed`
- Never query `rsvp_count` on events table — column does not exist

---

## Business Logic
- Platform fee: **7%** on ticket price (paid by attendee on top of face value)
- Listing fee: **$19.99** one-time per paid event (unlocks ticket sales)
- Forum expiry: **30 days** after event end date
- Stripe Connect: Express accounts (`acct_` prefix)
- Free events: RSVP only, no payment
- Paid events: Stripe payment intent flow, Stripe Connect for host payouts

---

## Database Schema (Key Tables)
- `profiles` — users (id, full_name, email, avatar_url, avatar_color, role, city)
- `events` — events (id, host_id, name, cover_url, is_paid, forum_enabled, status, listing_fee_paid)
- `ticket_types` — ticket tiers per event (id, event_id, name, price_cents, quantity, sold)
- `tickets` — purchased tickets (id, event_id, user_id, status, code, stripe_payment_intent, coupon_id)
- `rsvps` — free event RSVPs (id, event_id, user_id, status)
- `event_forum_posts` — forum messages (id, event_id, author_id, user_id, body, image_url, message_type)
- `coupons` — discount codes (id, event_id, host_id, code, discount_type, discount_value, uses)
- `host_stripe_accounts` — Stripe Connect accounts (id, user_id, stripe_account_id, payouts_enabled)
- `community_posts` — community feed posts
- `ticket_checkins` — QR scan check-ins

---

## Known Gotchas
- Supabase relational joins fail silently when FK not explicitly defined — always use two-query approach
- Railway proxy: `trust proxy` must be set or rate limiters crash with ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
- Stripe webhooks are unreliable in test mode — always add client-side confirm fallback
- CSS `display:flex` on a `.page` div overrides the router's `display:none` — always default pages to `display:none`
- `events_with_details` view does NOT have `rsvp_count` column — do not query it
- iOS Safari auto-zooms inputs with font-size below 16px — all inputs must be 16px+
- `openSheet()` needs `position:fixed` on body for iOS scroll lock to work

---

## Routing Pattern
```javascript
// All pages hidden by default
document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

// Show target page — forum needs flex, all others block
const el = document.getElementById('page-' + page);
el.style.display = page === 'forum' ? 'flex' : 'block';
```

---

## Deployment
```bash
git add .
git commit -m "your message"
git push
# Railway auto-deploys on push — takes ~60 seconds
```

---

## API Route Patterns
```javascript
// Auth middleware
app.get('/api/protected', requireAuth, async (req, res) => {
  // req.userId available after requireAuth
  const { data } = await supabaseAdmin.from('table').select('*').eq('id', req.userId);
});

// Two-query pattern (never use relational joins)
const [{ data: profile }, { data: stripeAcct }] = await Promise.all([
  supabaseAdmin.from('profiles').select('*').eq('id', userId).single(),
  supabaseAdmin.from('host_stripe_accounts').select('*').eq('user_id', userId),
]);
const result = { ...profile, host_stripe_accounts: stripeAcct || [] };
```

---

## Current Skills Installed
- `christlink` — this project context
- `vibesec` — security review for payment/auth code
- `systematic-debugging` — structured bug diagnosis
- `root-cause-tracing` — trace errors to origin
- `postgres` — safe Supabase SQL queries
- `webapp-testing` — Playwright testing
- `owasp-security` — security audit
- `frontend-design` — UI/UX patterns
- `brainstorming` — feature planning
- `skill-creator` — build new skills

---

## Output Files Location
Implementation specs saved to: `/mnt/user-data/outputs/`
Key files:
- `CHRISTLINK_MEGA_FIX.md` — pending tickets, QR, sales popup, coupons, back buttons, share, scanner
- `CHRISTLINK_FORUM_FIXES.md` — forum visibility, images, messages, useless buttons
- `CHRISTLINK_FORUM_CHAT_REDESIGN.md` — full forum chat UI redesign
- `CHRISTLINK_FORUM_COVER_PHOTO.md` — event cover photo in forum header
- `CHRISTLINK_STRIPE_PROFILE_FIX.md` — Stripe Connect profile two-query fix
