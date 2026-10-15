-- ─────────────────────────────────────────────────────────────────────────────
-- DND-Gang waitlist — schema + security policies
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto; -- gen_random_uuid()

create table if not exists public.dnd_waitlist (
  id           uuid primary key default gen_random_uuid(),

  -- Normalized (lowercase, trimmed) by the app AND enforced here.
  email        text not null
               check (char_length(email) between 3 and 254)
               check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),

  -- Acquisition source, derived server-side from validated UTM data.
  source       text not null default 'direct'
               check (char_length(source) between 1 and 64),

  -- Validated UTM attribution (all optional, length-capped).
  utm_source   text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium   text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  utm_content  text check (utm_content is null or char_length(utm_content) <= 100),

  -- Server-generated timestamp; never accepted from the client.
  created_at   timestamptz not null default now()
);

-- Duplicate protection at the database level, case-insensitive as a second
-- line of defense behind the app's lowercasing (23505 → handled as "duplicate").
create unique index if not exists dnd_waitlist_email_unique_idx
  on public.dnd_waitlist (lower(email));

-- Chronological export/inspection in the Supabase dashboard.
create index if not exists dnd_waitlist_created_at_idx
  on public.dnd_waitlist (created_at desc);

-- Campaign reporting.
create index if not exists dnd_waitlist_source_idx
  on public.dnd_waitlist (source);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Default-deny: with RLS enabled and no SELECT/UPDATE/DELETE policies,
-- anonymous and authenticated clients cannot read, modify or remove rows.
alter table public.dnd_waitlist enable row level security;

-- Anonymous visitors may INSERT a valid signup, and nothing else.
-- The unique index + app-side validation guarantee only well-formed rows land.
drop policy if exists "anon can insert signups" on public.dnd_waitlist;
create policy "anon can insert signups"
  on public.dnd_waitlist
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT policy  → nobody using the public key can read the email list.
-- No UPDATE policy  → rows are immutable from the client.
-- No DELETE policy  → rows cannot be removed from the client.

-- Explicit INSERT grant so the signup works even if the project was created
-- with "Automatically expose new tables" disabled (that toggle otherwise
-- supplies these grants via default privileges).
grant insert on public.dnd_waitlist to anon, authenticated;

-- Defense in depth: strip read/modify grants from the API roles entirely.
revoke update, delete, truncate on public.dnd_waitlist from anon, authenticated;

-- ── Owner access ────────────────────────────────────────────────────────────
-- The table owner (postgres) and the service_role bypass RLS, so the owner
-- inspects/exports signups through the Supabase dashboard:
--   Table Editor → dnd_waitlist  →  or  Database → Editor, SQL:
--     select email, source, utm_source, utm_medium, utm_campaign, created_at
--     from public.dnd_waitlist order by created_at desc;
-- The service-role key stays in the Supabase dashboard only — it is never
-- used by this website and must never be committed to the repo.
