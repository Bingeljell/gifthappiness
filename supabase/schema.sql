-- GiftHappiness Supabase schema (Phase 5 scaffold)
--
-- Status: not yet applied to any project. Written against the tables listed in
-- docs/plan.md ("Define initial database schema"). Run this against a fresh
-- Supabase project once one exists: `supabase db push` or paste into the SQL editor.
--
-- Design notes:
-- * Hosts are NOT tied to Supabase Auth yet. Host verification currently runs
--   over email via GiftHappiness's own `verifications` table below (mobile
--   OTP is deferred, not removed -- see that table's comment). Whether to
--   move to Supabase Auth later is still an open decision in docs/plan.md.
-- * All public-facing reads go through views (celebrations_public,
--   contributions_public) that only expose what's meant to be public. Base
--   tables are only readable/writable by the service role (i.e. the Worker),
--   never directly by anon/browser clients.
-- * Money columns use numeric(12,2) (INR paise-free; adjust if paise precision
--   is ever needed).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- hosts: people who create a celebration
--
-- Verification currently happens over email (see `verifications` below);
-- mobile OTP is deferred, so mobile stays collected but unverified for now.
-- ---------------------------------------------------------------------------
create table if not exists hosts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  email_verified boolean not null default false,
  mobile text not null,
  mobile_verified boolean not null default false,
  address text,
  created_at timestamptz not null default now()
);

create unique index if not exists hosts_email_idx on hosts (email);

-- ---------------------------------------------------------------------------
-- charities: mirrors the shape already used as dummy data in
-- src/lib/charities.ts, so the frontend can eventually read from here instead.
-- ---------------------------------------------------------------------------
create table if not exists charities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  status text not null default 'active' check (status in ('active', 'completed')),
  short_description text not null,
  what_they_do text not null,
  who_they_help text not null,
  why_selected text not null,
  impact_example text,
  sdgs text[] not null default '{}',
  amount_raised numeric(12, 2) not null default 0,
  ceiling numeric(12, 2) not null,
  registration text,
  years_active integer,
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- celebrations
-- ---------------------------------------------------------------------------
create table if not exists celebrations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  host_id uuid not null references hosts (id) on delete cascade,
  charity_id uuid not null references charities (id),
  celebration_type text not null,
  celebration_date date,
  active_from date,
  active_till date,
  message text,
  picture_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'expired', 'flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists celebrations_host_id_idx on celebrations (host_id);
create index if not exists celebrations_charity_id_idx on celebrations (charity_id);

-- ---------------------------------------------------------------------------
-- contributions (donors)
-- ---------------------------------------------------------------------------
create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  celebration_id uuid not null references celebrations (id) on delete cascade,
  donor_name text not null,
  donor_mobile text not null,
  donor_email text,
  pan text,
  amount numeric(12, 2) not null check (amount > 0),
  message text,
  show_name boolean not null default true,
  show_amount boolean not null default false,
  anonymous boolean not null default false,
  -- payment_status starts pending; a real gateway integration (still undecided
  -- per docs/plan.md "Payments Plan") will move this to succeeded/failed via webhook.
  payment_status text not null default 'pending' check (payment_status in ('pending', 'succeeded', 'failed')),
  payment_reference text,
  created_at timestamptz not null default now()
);

create index if not exists contributions_celebration_id_idx on contributions (celebration_id);

-- ---------------------------------------------------------------------------
-- verifications: short-lived codes for host/contributor verification.
--
-- Channel-generic on purpose: email verification is the active path right
-- now (host sign-up), and mobile OTP is deferred rather than removed, so it
-- can be turned on later for the same purposes just by picking an SMS
-- provider and dispatching to channel='mobile' rows -- no schema change
-- needed. Actual dispatch (email send / SMS send) is a TODO in the Worker
-- either way; this table only tracks issued/verified codes.
-- ---------------------------------------------------------------------------
create table if not exists verifications (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email', 'mobile')),
  contact text not null,
  purpose text not null check (purpose in ('host_signup', 'contribution')),
  code_hash text not null,
  expires_at timestamptz not null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists verifications_contact_purpose_idx on verifications (channel, contact, purpose);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Base tables: no anon/authenticated access at all. Every read/write goes
-- through the Cloudflare Worker using the service role key, which bypasses
-- RLS by design. This matches docs/plan.md's Trust/Safety item "Add Supabase
-- Row Level Security policies" and "Validate all inputs server-side in
-- Workers before writing to Supabase."
-- ---------------------------------------------------------------------------
alter table hosts enable row level security;
alter table charities enable row level security;
alter table celebrations enable row level security;
alter table contributions enable row level security;
alter table verifications enable row level security;

-- No policies are created for anon/authenticated roles on the base tables:
-- with RLS enabled and zero policies, all access is denied by default except
-- for the service role (which Postgres RLS always exempts).

-- ---------------------------------------------------------------------------
-- Public views: the only things a browser client should ever read directly
-- (e.g. from the Next.js frontend once it moves off static dummy data), via
-- Supabase's anon key with RLS-equivalent grants below.
-- ---------------------------------------------------------------------------
create or replace view charities_public as
select
  id, slug, name, category, status, short_description, what_they_do,
  who_they_help, why_selected, impact_example, sdgs, amount_raised, ceiling,
  registration, years_active, verification_notes
from charities;

create or replace view celebrations_public as
select
  c.id, c.slug, c.celebration_type, c.celebration_date, c.active_from,
  c.active_till, c.message, c.picture_url, c.status,
  h.name as host_name,
  ch.slug as charity_slug, ch.name as charity_name
from celebrations c
join hosts h on h.id = c.host_id
join charities ch on ch.id = c.charity_id
where c.status = 'published';

-- Amount is only shown when the donor opted in; name is redacted when
-- anonymous or when the donor chose not to show it.
create or replace view contributions_public as
select
  id,
  celebration_id,
  case when anonymous or not show_name then 'Anonymous contributor' else donor_name end as donor_name,
  case when show_amount then amount else null end as amount,
  message,
  created_at
from contributions
where payment_status = 'succeeded';

grant select on charities_public, celebrations_public, contributions_public to anon, authenticated;
