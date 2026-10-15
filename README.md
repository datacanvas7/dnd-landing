# DND — DND-Gang Waitlist Landing Page

> **GET IN BEFORE THE FIRST SIP.** A one-page, conversion-focused launch site for
> **DND (dndlhr)**, an upcoming coffee brand in Lahore, Pakistan.
> Primary conversion: email signup for the DND-Gang membership waitlist (10% benefit).

Built with **Next.js (App Router) · TypeScript · Tailwind CSS · Supabase PostgreSQL · Vercel**.

---

## Contents

- [What this is](#what-this-is)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Supabase setup](#supabase-setup)
- [Environment variables](#environment-variables)
- [How the signup flow works](#how-the-signup-flow-works)
- [Database policies — plain-English explanation](#database-policies--plain-english-explanation)
- [Analytics & campaign attribution](#analytics--campaign-attribution)
- [Abuse protection](#abuse-protection)
- [Deployment (Vercel)](#deployment-vercel)
- [Custom domain](#custom-domain)
- [Production testing checklist](#production-testing-checklist)
- [14-day validation plan](#14-day-validation-plan)
- [⚠️ Unconfirmed business facts](#️-unconfirmed-business-facts)
- [Privacy](#privacy)

---

## What this is

One landing page with one job: turn an Instagram visitor into a waitlist email.

| Section | Purpose |
|---|---|
| Hero | `LAHORE, SOMETHING'S BREWING.` label + oversized `GOOD COFFEE. BETTER COMPANY.` headline |
| Signup panel | `GET IN WITH DND-GANG.` — one email field, one CTA: **CLAIM MY 10% OFF** |
| Ticker | Animated `BREW · SIP · REPEAT` strip (static under reduced-motion) |
| Membership | Three honest points about what joining gets you |
| Footer | Vector wordmark, tagline, Instagram link, privacy policy |

There is **no fake social proof** — no invented member counts, testimonials, ratings,
scarcity claims, addresses, menus, or opening dates.

### Design system

| Token | Value | Use |
|---|---|---|
| `burgundy` | `#500600` | Primary background (sampled from the brand reference) |
| `burgundy-deep` | `#3c0400` | Signup panel surface |
| `cream` | `#fffaf7` | Primary text / CTA button |
| `rose` | `#e7b7a9` | Accent, labels, secondary text |
| `clay` | `#765e59` | Body copy on light sections |

Typography: **Anton** (display, via `next/font` — self-hosted, no external requests)
+ **Inter** (body). The DND wordmark is pure SVG geometry
([lib/brand/wordmark.ts](lib/brand/wordmark.ts)) traced from the supplied reference
image — it powers the header, footer, favicon ([app/icon.svg](app/icon.svg)) and the
social share image ([app/opengraph-image.tsx](app/opengraph-image.tsx)) with no raster
assets.

---

## Project structure

```
dnd-landing/
├── app/
│   ├── api/waitlist/route.ts     # Signup endpoint: validate → rate-limit → insert
│   ├── opengraph-image.tsx       # Auto-generated branded OG share image (PNG)
│   ├── privacy/page.tsx          # Privacy policy (linked from the form + footer)
│   ├── icon.svg                  # Favicon (SVG, brand wordmark)
│   ├── robots.ts / sitemap.ts    # SEO basics
│   ├── layout.tsx                # Fonts, metadata, analytics
│   ├── page.tsx                  # The landing page
│   └── globals.css               # Tailwind v4 theme + grain + ticker
├── components/
│   ├── SignupForm.tsx            # All form states (idle/loading/success/duplicate/error)
│   ├── Wordmark.tsx              # SVG wordmark renderer
│   └── IgLink.tsx                # Instagram link with click tracking
├── lib/
│   ├── brand/wordmark.ts         # Wordmark vector geometry
│   ├── config/membership.ts      # ⚠️ Offer terms live here — edit in ONE place
│   ├── config/site.ts            # Canonical URL + Instagram URL
│   ├── supabase/server.ts        # Server-only Supabase client (anon key)
│   ├── validation.ts             # Email + UTM validation (shared client/server)
│   └── analytics.ts              # Failure-safe event tracking wrapper
├── supabase/migrations/
│   └── 0001_dnd_waitlist.sql     # Table + indexes + RLS policies
├── scripts/
│   └── mock-supabase.mjs         # Local mock of the Supabase REST API (no account needed)
└── .env.example
```

---

## Local development

Requirements: **Node.js 20+** (built and tested on Node 22 / npm 10).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
cp .env.example .env.local
#    then edit .env.local with your Supabase project values

# 3. Run the dev server
npm run dev            # → http://localhost:3000
```

### Try it without a Supabase account (mock mode)

A tiny local mock of the Supabase REST API is included, so you can exercise the
**entire** signup flow (success, duplicate, validation) before creating any account:

```bash
# Terminal 1 — mock database on :54321
node scripts/mock-supabase.mjs

# Terminal 2 — app pointed at the mock
SUPABASE_URL=http://localhost:54321 \
SUPABASE_ANON_KEY=mock-anon-key \
npm run dev
```

The mock prints every stored row and serves them at `http://localhost:54321/debug/rows`.

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (`next build`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js rules) |
| `npx tsc --noEmit` | Type check |

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. Open **SQL Editor** → paste and run the contents of
   [supabase/migrations/0001_dnd_waitlist.sql](supabase/migrations/0001_dnd_waitlist.sql).
   (Or, with the Supabase CLI linked to the project: `supabase db push`.)
3. Copy the project URL and anon key from **Project Settings → API** into `.env.local`.

### What the migration creates

```sql
public.dnd_waitlist
  id           uuid PK (default gen_random_uuid())
  email        text NOT NULL, unique (case-insensitive), format + length checked
  source       text (derived server-side, e.g. "instagram", "direct")
  utm_source / utm_medium / utm_campaign / utm_content   text, optional, length-capped
  created_at   timestamptz NOT NULL default now()        ← server-generated only
```

Indexes: unique `lower(email)`, `created_at DESC` (chronological export),
`source` (campaign reporting).

### How the owner reads the signups

No admin dashboard was built (on purpose — v1 validates demand, nothing more).
Open the **Supabase Dashboard → Table Editor → dnd_waitlist**, or export via SQL:

```sql
select email, source, utm_source, utm_medium, utm_campaign, created_at
from public.dnd_waitlist
order by created_at desc;
```

CSV export: Dashboard → Table Editor → dnd_waitlist → ⋯ → **Export to CSV**.

---

## Email setup (welcome email)

Every successful signup triggers one branded welcome email (HTML + plain text,
rendered in [lib/email/welcome.ts](lib/email/welcome.ts), delivered by
[lib/email/send.ts](lib/email/send.ts)). It's sent **after** the database
confirms the insert and **never** fails the signup — a delivery error is logged
server-side only.

The email promises nothing beyond the approved "10% membership benefit" label —
the actual terms are sent later, once the owner confirms them (see
[lib/config/membership.ts](lib/config/membership.ts)). Update the copy in
`lib/email/welcome.ts` when the terms land.

**No dependencies were added** — sending is a plain `fetch` to the Resend REST API.

### Dev mode (works right now, zero accounts)

With `RESEND_API_KEY` unset, welcome emails are written to `.outbox/` in the
project root (git-ignored) as paired `.html`/`.txt` files. Open the `.html` in a
browser to preview. This is the default, so the full flow works locally today.

### Sending for real (Resend, free tier: 3,000 emails/month, 100/day)

1. Sign up at [resend.com](https://resend.com) (free, no card).
2. **Verify a sender** — easiest starting option: Resend lets you send from
   `onboarding@resend.dev` immediately, but **only to your own account email**.
   To send to real signups you must verify a domain you control:
   Dashboard → Domains → Add domain → publish the DNS records Resend shows
   (TXT + MX/CNAME). For DND that would be e.g. `dndlhr.com` or a subdomain
   like `mail.dndlhr.com`.
3. API Keys → Create → copy the key.
4. Set env vars (local `.env.local`, and Vercel → Project → Settings →
   Environment Variables for production):
   - `RESEND_API_KEY` = the key
   - `EMAIL_FROM` = `DND <welcome@your-verified-domain>`
   - `EMAIL_REPLY_TO` = where replies go (e.g. `hello@dndlhr.com`)
5. Re-test: sign up with your own address → email arrives within seconds;
   `.outbox/` stops being written once the key is set.

Deliverability guardrails already in place: consent-based double opt-in is NOT
used (single opt-in, per the brief), so keep the unsubscribe line in the email
(it's there), honor replies that ask to be removed, and watch Resend's bounce
(<4%) / spam (<0.08%) metrics in its dashboard.

---

## Environment variables

| Variable | Where it's used | Notes |
|---|---|---|
| `SUPABASE_URL` | Server only | Project URL from Supabase API settings |
| `SUPABASE_ANON_KEY` | Server only | Anon/publishable key. **Never** the service-role key |
| `NEXT_PUBLIC_SITE_URL` | Build/metadata | Canonical URL (e.g. `https://dndlhr.com`). Falls back to `VERCEL_URL` in production |
| `RESEND_API_KEY` | Server only | Welcome-email sending via Resend. **Unset = dev mode**: emails are written to `.outbox/` instead of sent (see [Email setup](#email-setup-welcome-email)) |
| `EMAIL_FROM` | Server only | Verified Resend sender, e.g. `DND <welcome@dndlhr.com>`. Default assumes `welcome@dndlhr.com` |
| `EMAIL_REPLY_TO` | Server only | Reply-to for the welcome email. Default `hello@dndlhr.com` |

Copy [.env.example](.env.example) → `.env.local`. Env files are git-ignored; **never commit secrets**.

> **Why the browser never sees a Supabase key:** signups go through
> `POST /api/waitlist`, which validates, rate-limits, then inserts with the anon key
> server-side. Even though the anon key is by design public-safe, keeping it off the
> client removes a whole class of abuse. The **service-role key is not used anywhere
> in this codebase** and must only ever live in the Supabase/Vercel dashboards.

---

## How the signup flow works

```
Visitor submits email
        │
        ▼
[client] inline validation (shape, 254-char cap)
        │
        ▼
POST /api/waitlist  { email, attribution, hp, dwellMs }
        │
        ├─ honeypot field filled?  → fake 200, nothing written (bots learn nothing)
        ├─ submitted in <1.2s?     → fake 200, nothing written
        ├─ invalid email?          → 400
        ├─ >5 signups / 10min / IP → 429
        │
        ▼
Supabase insert (explicit columns only, email lowercased+trimmed)
        │
        ├─ unique violation (23505) → 409 → UI: "Already in."
        ├─ other error              → 500 → UI: retry message (no internals leaked)
        └─ ok                       → welcome email → 200 → UI: "You're in." ✅
                                          (email failure is logged,
                                           never blocks the signup)
```

UI states implemented in [components/SignupForm.tsx](components/SignupForm.tsx):

- **Idle** — enabled `CLAIM MY 10% OFF` button
- **Loading** — disabled button, "Claiming…"
- **Success** — shown **only after** the database confirms the write
- **Duplicate** — friendly "already registered" message (from HTTP 409)
- **Validation error** — correction message; input is **never cleared** on failure
- **Network/server error** — retry-friendly message, no database internals

Accessibility: semantic form + visible label, `aria-live` status announcements,
`aria-invalid`/`aria-describedby` wiring, keyboard navigable, visible brand-colored
focus rings, reduced-motion support.

---

## Database policies — plain-English explanation

Row Level Security is **enabled** with default-deny:

| Role | Can INSERT | Can SELECT | Can UPDATE/DELETE |
|---|---|---|---|
| `anon` (public key) | ✅ (one policy) | ❌ — no policy exists | ❌ — also `REVOKE`d |
| `authenticated` | ✅ (same policy) | ❌ | ❌ |
| Dashboard / service role | ✅ | ✅ | ✅ (owner only, bypasses RLS) |

So: anonymous visitors can add a signup and **cannot read, modify, or remove the
email list** — even with the anon key in hand. A second unique index on
`lower(email)` makes duplicates impossible at the database level, and CHECK
constraints reject malformed or oversized values even if the app were bypassed.

---

## Analytics & campaign attribution

**Tool:** Vercel Web Analytics (`@vercel/analytics`) — cookieless, privacy-conscious,
no consent banner required, no ad scripts.

**Events wired:** `signup_submit`, `signup_success`, `signup_duplicate`,
`signup_error`, `instagram_click` (with `source` property). Visits and conversion
rate are computed automatically in the Vercel dashboard
(Web Analytics → Insights → custom events).

**UTM capture:** `?utm_source=instagram&utm_medium=social&utm_campaign=dndgang_launch&utm_content=…`
is validated server-side (lowercased, pattern-checked, length-capped — arbitrary input
is dropped), stored per-row in the database, and preserved across the session via
`sessionStorage` so attribution survives the signup itself.

> Vercel Web Analytics must be enabled for the production domain in the Vercel
> dashboard (Project → Analytics). It is a no-op locally.

---

## Abuse protection

Three layers are built in:

1. **Honeypot field** — invisible to humans, commonly filled by bots → silently
   discarded (fake success, no row).
2. **Dwell-time check** — submissions faster than ~1.2s are discarded the same way.
3. **Per-IP rate limit** — 5 signups / 10 minutes / IP, in-memory
   (per serverless instance).

**Before exposing the form to paid traffic at scale**, upgrade layer 3 to a shared
store (e.g. Upstash Redis) and/or add Cloudflare Turnstile — the in-memory limiter
is per-instance on serverless and intentionally lightweight.

---

## Deployment (Vercel)

1. Push this repo to GitHub/GitLab.
2. [vercel.com/new](https://vercel.com/new) → import the repo. Framework
   auto-detected: **Next.js**. No build-setting changes needed.
3. In Vercel → **Project → Settings → Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://dndlhr.com`)
4. Run the migration against the **production** Supabase project (SQL Editor →
   paste [0001_dnd_waitlist.sql](supabase/migrations/0001_dnd_waitlist.sql)).
5. **Deploy.** Then enable Vercel Analytics (Project → Analytics).
6. Post-deploy smoke test: sign up with a real email → confirm the row appears in
   Supabase → sign up the same email again → confirm the "already in" message.

> This project has **not** been deployed yet — no Vercel/Supabase credentials were
> available in this environment. The production build (`npm run build`) passes and
> the complete flow was verified locally against a mock Supabase REST API.

---

## Custom domain

1. Vercel → Project → **Settings → Domains** → add `dndlhr.com` (and `www`).
2. At your registrar, point:
   - `A` record `@ → 76.76.21.21`
   - `CNAME` `www → cname.vercel-dns.com`
3. Update `NEXT_PUBLIC_SITE_URL` to `https://dndlhr.com` and redeploy
   (drives OG image / canonical / sitemap URLs).
4. Point the Instagram bio link at the domain.

---

## Production testing checklist

**Before announcing the link:**

- [ ] Migration applied to production Supabase; `dnd_waitlist` exists with RLS on
- [ ] Confirm **no SELECT policy** exists (public key returns zero rows)
- [ ] `SUPABASE_URL` / `SUPABASE_ANON_KEY` set in Vercel; **no service-role key anywhere**
- [ ] `NEXT_PUBLIC_SITE_URL` set to the custom domain
- [ ] Valid signup → row appears in Supabase dashboard (lowercased email, UTM columns)
- [ ] Same email again → "Already in." (no duplicate row)
- [ ] Garbage input (`foo@`, 300 chars) → inline validation error
- [ ] Page renders correctly at 360px / 390px / 768px / 1440px widths
- [ ] Headline fully visible above the fold on iPhone-sized screens
- [ ] Full keyboard walk-through: Tab order sensible, focus always visible
- [ ] `prefers-reduced-motion` respected (ticker static)
- [ ] OG image renders when pasted into Twitter/X + Facebook debuggers
- [ ] Favicon shows in tabs
- [ ] `/robots.txt` + `/sitemap.xml` resolve; `/privacy` linked and rendering
- [ ] Vercel Analytics receiving events (submit once, check dashboard)
- [ ] Instagram link opens `https://www.instagram.com/dndlhr/` in a new tab

---

## 14-day validation plan

**Hypothesis targets** (starting hypotheses, not industry benchmarks):

| Metric | Target |
|---|---|
| Relevant landing visits | ~500 |
| Valid signups | 50–100 |
| Visit → signup conversion | 10–20% |
| Paid signup cost (if ads) | measure, then judge |

**Launch sequence**

1. **Days 1–3 — soft launch.** Story + bio link on Instagram
   (`?utmsource=instagram&utmmedium=social&utmcampaign=dndgang_launch`). Fix any
   friction observed in the first signups.
2. **Days 4–10 — amplify.** Feed post + a couple of Story sequences. If testing paid
   traffic, use platform-specific `utm_content` (`story1`, `reel`, `paid_ig_feed`…)
   to read cost per signup in Vercel Analytics.
3. **Days 11–14 — read and decide.** Export the CSV; slice by `source`/UTM.

**Judge honestly:** traffic, signups, and paying customers are three different
things. The waitlist proves *interest*; the café's actual judgment comes when
redemption tracking starts after opening. Do not read email volume as revenue.

**Redemption tracking (phase 2, after opening):** add a `redeemed_at` column or a
one-field staff lookup page — deliberately **not** built in v1.

---

## Membership terms

**CONFIRMED by the owner (Oct 2026):** 10% off the order, **capped at Rs 3,000**,
**valid till February 2027**. Stated in the page copy, the terms note, and the
welcome email. Central config: [lib/config/membership.ts](lib/config/membership.ts).

Still open (nothing on the site claims these, so they don't block launch):

1. **Every visit, or once per customer?**
2. **Product exclusions?**
3. **Stackable with other offers?**
4. **Physical / digital card, or email-only for v1?** (v1 = email only)
5. **Cap on number of members?** (no scarcity is claimed anywhere)
6. **Minimum spend?**
7. **Redemption mechanism?** — the welcome email currently says "show this
   email at the counter" (simplest assumed flow; update `lib/email/welcome.ts`
   if a code/card/QR system is used instead).
8. **Opening date/area** — not stated anywhere; add only when real.
9. **Contact channel** — privacy policy currently points to the Instagram DM.

Also pending: owner review of the [privacy policy](app/privacy/page.tsx) wording.

---

## Privacy

- Cookieless analytics only (Vercel Web Analytics) — no consent banner required.
- No third-party ads/trackers.
- The privacy page honestly describes exactly what the site does — extend it if
  practices change (e.g. newsletters).

---

**BREW. SIP. REPEAT.** — [instagram.com/dndlhr](https://www.instagram.com/dndlhr/)
