# Christ Link v2 — Production Setup Guide

## What's in this package

```
christlink-v2/
├── server.js          ← Production Node.js API (auth, payments, Supabase)
├── package.json       ← Dependencies
├── railway.toml       ← Railway deployment config (zero-config deploy)
├── .env.example       ← All environment variables
├── sql/
│   └── schema.sql     ← Full Supabase database schema + RLS policies
└── public/
    └── index.html     ← Complete frontend with Supabase auth + Stripe
```

---

## STEP 1 — Run the database schema

1. Go to **dashboard.supabase.com** → your project
2. Click **SQL Editor** → **New query**
3. Paste the entire contents of `sql/schema.sql`
4. Click **Run**

This creates all 7 tables, RLS policies, triggers, and the `events_with_details` view.

Also run this small function manually (Supabase doesn't support it in schema migration):
```sql
create or replace function increment_tickets_sold(p_ticket_type_id uuid, p_qty int)
returns void as $$
  update ticket_types set sold = sold + p_qty where id = p_ticket_type_id;
$$ language sql;
```

---

## STEP 2 — Configure Supabase Auth

1. In Supabase Dashboard → **Authentication → Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication → Email Templates**
4. Update the OTP template subject to something like: `Your Christ Link verification code`
5. Under **Authentication → Settings**, set **OTP expiry** to `600` (10 minutes)

---

## STEP 3 — Deploy to Railway

### Option A: GitHub (recommended, auto-deploys on push)
1. Push this folder to a GitHub repo
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repo
4. Railway auto-detects Node.js via `package.json`

### Option B: Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## STEP 4 — Set environment variables in Railway

Go to your Railway project → **Variables** tab and add all of these:

```
SUPABASE_URL=https://iqosvigdelnmarecpkkp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_51SthaL0aSXVBGANHNQAqgYMIQCWfNn70Xdd...
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_AFTER_WEBHOOK_SETUP
CHRISTLINK_ACCOUNT_ID=acct_1Stha81sOqETIDGD

PORT=4242
APP_URL=https://YOUR_APP.railway.app       ← fill in after first deploy
ALLOWED_ORIGINS=https://YOUR_APP.railway.app
```

**After first deploy**, Railway gives you a URL like `https://christlink-api-production.railway.app`.
Update `APP_URL` and `ALLOWED_ORIGINS` with that URL.

Also update `API_BASE` in `public/index.html`:
```javascript
const API_BASE = 'https://YOUR_APP.railway.app';
```

---

## STEP 5 — Set up Stripe Webhook

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint** → URL: `https://YOUR_APP.railway.app/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `charge.refunded`
4. Copy the **Signing Secret** (whsec_...) → add to Railway vars as `STRIPE_WEBHOOK_SECRET`

---

## STEP 6 — Set up Stripe Connect

1. Go to [dashboard.stripe.com/settings/connect](https://dashboard.stripe.com/settings/connect)
2. **Get started** → Choose **Express accounts**
3. Fill in your platform name (Christ Link), website, category (Events)
4. This enables hosts to connect their own bank accounts for instant payouts

---

## How auth works

Every protected action requires a verified Supabase session:

```
User clicks RSVP / Buy Tickets
      ↓
Not logged in? → Auth modal opens automatically
      ↓
User enters email → Supabase sends 6-digit OTP
      ↓
User enters code → Supabase verifies → session created
      ↓
JWT token attached to every API request (Authorization: Bearer ...)
      ↓
Backend verifies token with Supabase on every request
      ↓
Action completes
```

**Bot protection via auth:**
- Every RSVP and ticket purchase requires email verification
- Rate limiting: 5 OTP requests per 15 min per IP
- Rate limiting: 10 payment attempts per hour per IP
- Stripe idempotency keys prevent double-charges on retries
- RLS policies prevent users from accessing each other's data

---

## Scalability on Railway

Railway runs Node.js on isolated containers. It scales well because:

- **Horizontal scaling**: Railway can run multiple instances of your server behind a load balancer
- **Stateless server**: no in-memory session state (sessions are in Supabase), so multiple instances work fine
- **Health check**: `/health` endpoint lets Railway know the server is alive
- **Auto-restart**: `ON_FAILURE` restart policy keeps uptime high

**Estimated capacity per Railway instance:**
- ~500 concurrent users comfortably
- ~2,000 concurrent users under load
- For more: upgrade Railway plan or add a second service

**Supabase free tier limits:**
- 500MB database, 50,000 monthly active users, 2GB bandwidth
- More than enough for early growth — upgrade to Pro ($25/mo) at scale

---

## Going to production (live Stripe keys)

1. Replace `sk_test_` with `sk_live_` in Railway vars
2. Replace `pk_test_` with `pk_live_` in `index.html`
3. Complete Stripe's identity verification for your platform account
4. Re-do the webhook setup with live mode endpoint

---

## Test cards (test mode only)

| Card Number          | Result              |
|---------------------|---------------------|
| 4242 4242 4242 4242 | ✅ Success          |
| 4000 0000 0000 9995 | ❌ Card declined    |
| 4000 0025 0000 3155 | 🔐 3DS auth required |

Any future expiry, any 3-digit CVC.
