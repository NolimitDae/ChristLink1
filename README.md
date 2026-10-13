# ChristLink

Faith-based events marketplace (PWA): discover and RSVP to events, host free or paid events, sell tickets via Stripe Connect, and chat in event forums and the community feed.

## Layout

| Path | What it is |
|------|------------|
| `server.js` | Express API (auth, events, tickets, payments, forum, admin) + static hosting |
| `public/index.html` | The entire frontend (HTML, CSS and JS in one file) |
| `public/` | Static assets, `manifest.json`, `robots.txt` |
| `schema.sql` | Full Supabase/Postgres schema, RLS policies and migrations |
| `railway.json` | Railway deploy config (health check at `/health`) |
| `CLAUDE.md` | Project rules for Claude Code |
| `.claude/skills/` | Claude Code skills (see `skills-lock.json`) |

## Run locally

```bash
cp .env.example .env   # fill in Supabase + Stripe keys
npm ci
npm run dev            # http://localhost:4242
```

Deploys automatically to Railway on push to `main`. Run `schema.sql` in the Supabase SQL editor for a new project.
