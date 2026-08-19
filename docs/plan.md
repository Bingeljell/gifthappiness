# GiftHappiness Plan

Updated as of 16 August 2026.

`docs/master_docs.md` (Master Project Document v1.0) and `docs/website_dev.md` (Website Development Brief v1.0) are now the source of truth for content and IA. This plan has been reconciled against both; gaps found during that review are captured below as new tasks rather than rewriting completed phases.

## Current Direction

GiftHappiness should first become a complete static front-end experience. The near-term goal is to update all public content, add the missing pages and forms, and make the site coherent without sending data anywhere.

The backend, database, payments, admin tools, and hosting architecture should be decided after the static product flow is visible end to end.

### Feasibility check: Phase 1b/2b/3b/3c against the current Cloudflare static-export setup

`next.config.ts` already sets `output: 'export'` (fully static, no server), which is what Cloudflare Pages serves. Everything added to the plan above is implementable within that constraint:

- New static pages (Impact, Contact, For Charities, legal stubs) are ordinary routes — no change to the export model.
- Charity detail pages (`/charities/[slug]`) work under static export via `generateStaticParams` over the dummy charity list, same pattern as any static site generator — no server needed.
- The three-step create flow and QR-code preview are client-side state/rendering only; no submission target exists yet, consistent with the "does not send data anywhere" constraint.
- QR-code generation needs a small client-side dependency (e.g. `qrcode` or `qrcode.react`) — will ask before installing, per `AGENTS.md`.
- None of this requires Supabase, Workers, or auth — it's all still Phase 1-4 static work. Phase 5 (backend) is unaffected and unblocked by any of it.

## Phase 1: Static Content And IA

- [x] Update landing page content from `docs/content_dump.md`.
- [x] Add charity vetting criteria to the public site.
- [x] Create an About Us page with Dalai's story.
- [x] Add FAQ content from the content dump.
- [x] Validate the information architecture:
  - Home
  - Create Celebration
  - Celebration Page
  - About / FAQ
  - Charity information
  - Privacy Policy
  - Terms of Service
- [x] Decide which placeholder links should stay hidden until real pages exist.

### Phase 1 follow-up: IA gaps found against `master_docs.md` §12 and `website_dev.md` §4

The header/footer today do not yet match the nav specified in the updated docs.

- [x] Add an **Impact** page/section to the nav (public totals, SDG framing — see the new Transparency phase below).
- [x] Give **FAQ** its own top-level nav entry: kept the content merged into `/about#faq` and added a direct nav link rather than duplicating content at `/faq`.
- [x] Add a visible but non-functional **Sign In** nav placeholder (no auth exists yet; made that explicit in the UI rather than omitting the item).
- [x] Remove the dev-only "Preview Page" nav link; `/celebration` is still reachable from the footer's Platform column.
- [x] Add footer pages/stubs for: **Contact**, **For Charities**, **Privacy Policy**, **Terms of Service**, **Refund/Donation Policy**, **Charity Selection Policy**, **Transparency and SDGs**.

## Phase 2: Static Forms And Pages

- [x] Update the Create Celebration form fields:
  - Host name
  - Mobile number
  - Address
  - OTP verification placeholder
  - Celebration type
  - Celebration date
  - Charity selection
  - Donation page active from
  - Donation page active till
  - Personal message
  - Optional picture
- [x] Keep form submission local/static for now.
- [x] Add a static Celebration Page template for shared donor-facing pages.
- [x] Add donor contribution fields:
  - Donor name
  - Mobile number
  - PAN number when required
  - Donation amount
  - Payment link placeholder
- [x] Mark payment gateway details as undecided in the UI or supporting docs.
- [x] Add static contributor messages and donor visibility controls:
  - Cross-celebration messages on the home page
  - Contributor wall on each celebration page
  - Name visibility enabled by default
  - Amount visibility private by default
  - Anonymous donation option

### Phase 2 follow-up: flow gaps found against `website_dev.md` §7 and §15

- [x] Rebuild `/create` as the documented three-step flow (Host & Occasion → Cause & Page → Preview & Publish) instead of one long static form. Step 3 renders a live preview of the celebration page before "publish."
- [x] Add a QR code preview to the create flow's publish step, via `qrcode.react` (client-side, static demo URL, no backend). "Publish" stays disabled — no submission target exists yet.
- [x] Aligned the celebration-page quote with the suggested line in `website_dev.md` §8.

## Phase 3: Charity Content

- [ ] Finalize the starting list of charities.
- [x] Define the minimum charity profile content:
  - Name
  - Category
  - Description
  - Registration details
  - Years active
  - Donation limit/status
  - Verification notes
- [x] Decide whether each charity needs an individual dedicated page before launch: **yes** — `website_dev.md` §11 now specifies a full charity detail page (logo, what/who/why, SDGs, impact examples, amount raised, allocation status, "Choose this Charity" CTA). Build as a static dynamic route (`/charities/[slug]`) with dummy data.
- [x] Build the `/charities/[slug]` detail page per the spec above (static, via `generateStaticParams`, dummy data in `src/lib/charities.ts`).
- [x] Add SDG tags to each charity (`master_docs.md` §10) on both the directory card and the detail page.
- [ ] Define how charities rotate out after reaching the predetermined limit. (UI copy explains the mechanic; actual rotation logic needs real data/backend in Phase 5.)

## Phase 3b: Transparency And Impact (new — `master_docs.md` §9, §10, §12)

The docs treat public transparency as a core trust mechanic, not a later add-on. None of this exists on the site yet. All of it can ship as static/dummy data in this phase; it becomes real data once Supabase is wired up in Phase 5.

- [x] Add an **Impact** page: per-charity amount raised (dummy figures), allocation ceiling, active/completed status — the public answer to "where is the money going?"
- [x] Add SDG framing content: a short explainer of how celebrations map to UN SDGs, referenced from charity cards/detail pages and the Impact page.
- [x] Add an amount-raised/status pill to charity directory cards (dummy data now, same shape the real data will use later).

## Phase 3c: Legal And Informational Pages (new — footer requirement)

Stub pages so the footer links specified in `master_docs.md`/`website_dev.md` are not dead links. Content stays placeholder/"final wording pending legal review" until Phase 5/legal work resolves it — this mirrors how the Create form already marks OTP/payment as pending.

- [x] `/privacy` — placeholder Privacy Policy page.
- [x] `/terms` — placeholder Terms of Service page.
- [x] `/refund-policy` — placeholder Refund/Donation Policy page.
- [x] `/charity-selection-policy` — placeholder Charity Selection Policy page (reuses the existing vetting-criteria content).
- [x] `/contact` — static contact page (no email fabricated; states a contact channel isn't finalized yet).
- [x] `/for-charities` — static page describing how a charity gets listed/vetted, aimed at NGO partners rather than donors.

## Phase 4: Design Pass

- [ ] Apply client feedback after content and page structure are in place.
- [ ] Finalize logo direction.
- [ ] Review visual tone for a charity-first project.
- [ ] Improve mobile layout and form ergonomics.
- [ ] Replace placeholder visuals/icons where needed.

## Phase 5: Backend And Hosting Direction

The current site is static and deployed to Cloudflare. The next backend pass should keep that deployment model and add dynamic behavior with Cloudflare + Supabase on free tiers where possible.

Provisional architecture:

- Cloudflare Pages for the static/front-end app.
- Cloudflare Workers for API endpoints, validation, bot checks, and backend-for-frontend logic.
- Supabase Postgres for persistent data.
- Supabase Auth or an email verification flow for host/contributor verification, pending implementation details.
- Supabase Storage or Cloudflare R2 for celebration images, pending cost and integration review.

Known tradeoffs:

- Upside: no server to manage, fits the current Cloudflare deployment, fast path to forms/admin workflows, and low initial cost.
- Downside: dependency on Cloudflare and Supabase limits, pricing, auth behavior, observability, and service availability.
- Keep the implementation portable enough that core data remains in Postgres and can be migrated later if needed.

Backend work items:

- [x] Pick provisional backend direction: Cloudflare + Supabase.
- [x] Define initial database schema (`supabase/schema.sql`, not yet applied to a live project):
  - hosts/users (now includes email as the verification identity — see deviation note below)
  - charities
  - celebrations
  - contributors
  - contribution visibility preferences
  - payment references or pending payment records
- [x] Define Cloudflare Worker API routes for (`workers/src/routes/`, not yet deployed):
  - creating a celebration
  - reading a public celebration page
  - submitting contribution details
  - verifying a contact (email now, mobile OTP deferred — see below)
  - admin-only charity/content updates
- [x] Wire the Next.js frontend to the Worker API (`src/lib/api.ts`, `NEXT_PUBLIC_API_BASE_URL` in `.env.example`): `/create`'s email verification and Publish step, and `/celebration`'s donor form, all make real requests. With no backend deployed, every request fails gracefully with a "backend isn't deployed yet" message instead of throwing — this is the expected state until Supabase/the Worker exist. `/charities`, `/impact`, and the rest of the site still read the static dummy data in `src/lib/charities.ts` (not wired, no live equivalent yet).
- [x] Create a Supabase project on the free tier and apply `supabase/schema.sql`. Live project `fsradcbnqocpvxqwizdt` (ap-south-1, org "GiftHappiness"); all 5 tables + 3 public views confirmed present.
- [x] Set `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`/`ADMIN_API_KEY` and run `wrangler deploy` from `workers/`. Deployed to `https://gift-happiness-api.nikhil-shahane.workers.dev`; `/health` and a real Supabase-backed route (`GET /celebrations/demo` → 404 "Celebration not found") both verified live.
- [x] Point `ALLOWED_ORIGIN` at the real frontend. Set to `https://gifthappiness.pages.dev` (the existing Cloudflare Pages Production URL, git-connected to `main`) and redeployed. Known gap: CORS is single-origin only (`workers/src/lib/response.ts`), so Pages Preview deployments (random `<hash>.gifthappiness.pages.dev` subdomains) will be CORS-blocked, and local dev needs `ALLOWED_ORIGIN` switched back to `http://localhost:3000` manually. Multi-origin CORS is a follow-up if Preview-testing the API becomes a regular need.
- [ ] Set `NEXT_PUBLIC_API_BASE_URL=https://gift-happiness-api.nikhil-shahane.workers.dev` as a Cloudflare Pages environment variable (Production, and Preview if desired) on the `gifthappiness` Pages project, then trigger a rebuild -- Next.js inlines `NEXT_PUBLIC_*` vars at build time, so this won't take effect without one. User-owned step (dashboard access), not done via CLI here.
- [x] Set a real `NEXT_PUBLIC_API_BASE_URL` in `.env.local` once the Worker is deployed (copy `.env.example`). Set to the deployed Worker URL above.
- [ ] Point `/charities`, `/charities/[slug]`, and `/impact` at the deployed Worker instead of `src/lib/charities.ts`'s static dummy data. Note: the live `charities` table currently has exactly one seeded row (`unicef`, copied from the dummy data) added only to smoke-test the `/create` publish flow end to end -- it is not the real starting list (that's still open in Phase 3).
- [ ] Wire a draft→published transition for celebrations. `createCelebration` always inserts `status: 'draft'` and nothing currently moves it to `'published'`, but both `GET /celebrations/:slug` (via `celebrations_public`) and `POST /celebrations/:slug/contributions` only serve/accept `'published'` rows -- confirmed live: a celebration published through the `/create` UI could not be found or contributed to. `/create`'s "Publish" button also currently implies success without this being wired up; needs either a real publish action or copy that reflects the actual state.
- [ ] Wire `/celebration`'s donor form to a real celebration slug. It currently posts to a hardcoded `"demo"` slug (confirmed live: fails with "Celebration not found" since no such celebration exists) -- no per-celebration routing (e.g. `/celebration/[slug]`) exists yet.
- [ ] Pick an OTP/SMS provider and wire actual dispatch into `workers/src/routes/verification.ts` for the `mobile` channel (the route and storage already support it; only the send step is a TODO).
- [ ] Decide whether image uploads use Supabase Storage or Cloudflare R2.
- [ ] Define data retention and privacy requirements.
- [ ] Define audit logging needs for admin actions.
- [ ] Replace the `ADMIN_API_KEY` shared-secret gate on `/admin/*` routes with real role-based auth — now planned as part of Phase 6 below rather than a separate CMS decision.

**Deviation from `master_docs.md`/`website_dev.md`: OTP → email verification.** Both docs describe host verification as mobile OTP. Per an explicit product decision, host verification now runs over email instead — the `hosts` table has `email`/`email_verified` columns, and the Worker's `verifications` table is channel-generic (`email` | `mobile`) specifically so mobile OTP can be turned back on later (per the docs) just by wiring an SMS provider, with no schema or route changes. `/create`'s "OTP verification" field/button was replaced with an "Email (used to verify you)" field and a Verify Email flow. Mobile number is still collected on both host and donor forms, just not used for verification right now.

## Phase 6: Accounts And Sign-In

Product decision (2026-08-17): the header's "Sign In" placeholder (Phase 1 follow-up) is for one unified account system, not three separate ones. A host today and a donor tomorrow should be the same identity, so accounts unify hosts, donors, and admins rather than bolting on three auth mechanisms. Passwordless email-code login is reused from the existing host-verification flow (`workers/src/routes/verification.ts`) rather than adding passwords.

### Identity model

- Repoint `celebrations.host_id` from `hosts` to a renamed `users` table (same columns as `hosts` today, plus `is_admin boolean not null default false`). `host_id` keeps its name — it still describes that user's role on that celebration — it just no longer points at a role-specific table.
- Add `contributions.donor_id uuid null references users(id)`. Nullable so guest/anonymous donations (no account) keep working exactly as today, filling only the existing free-text `donor_name`/`donor_mobile`/`donor_email` columns; a signed-in donor's contribution additionally links to their account for history.
- Add `'login'` to the `verifications.purpose` check constraint alongside the existing `host_signup`/`contribution` values, and reuse the same channel-generic code-issue/confirm mechanism for login.
- New `sessions` table (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`): an opaque bearer token, sha256-hashed at rest (same pattern already used for verification codes), not a JWT. Chosen over a stateless JWT so sessions can be revoked (logout, "sign out everywhere") without adding a second secret (a JWT signing key) to manage alongside `SUPABASE_SERVICE_ROLE_KEY`/`ADMIN_API_KEY`.

### Auth flow (shared by every role)

1. `POST /auth/request { email }` — find-or-create the `users` row by email, issue a login verification code (same mechanism as host-signup verification).
2. `POST /auth/confirm { email, code }` — validate the code, mark `email_verified`, create a `sessions` row, return the plaintext bearer token once (only the hash is stored).
3. `GET /auth/me` (`Authorization: Bearer <token>`) — look up the session by token hash, reject if expired, return `{ id, name, email, isAdmin }`.
4. `POST /auth/logout` — delete the session row for that token.

Bearer token in `localStorage`, not a cookie: the frontend (`gifthappiness.pages.dev`, static export) and API (`gift-happiness-api.nikhil-shahane.workers.dev`) are different origins, so a cookie session means fighting `SameSite`/CORS-credentials rules for no real benefit at this scale. Tradeoff: a `localStorage` token is more exposed to XSS than an `httpOnly` cookie — acceptable for now since no payment/financial data flows through it (payment gateway is still undecided, see Payments Plan), but worth revisiting if that changes.

### Admin

- `/admin/*` routes switch from the `ADMIN_API_KEY` shared secret to: validate the bearer session, require `users.is_admin = true`. The first admin account is flipped via a direct SQL update against the live project — no admin-invite UI yet.

### Frontend

- New `/sign-in` page: email → request code → enter code → confirm → store token → redirect.
- A `useSession()` hook/context: reads the stored token, calls `GET /auth/me` once, exposes `{ user, loading, signOut }` to the rest of the app.
- `Header.tsx`: the greyed-out "Sign In" placeholder becomes a real link; once signed in, show the account name / "My Celebrations" / sign-out instead.
- New `/account` page (client-side protected — redirect to `/sign-in` if no session, since static export has no server to gate this): lists the signed-in user's celebrations via a new `GET /me/celebrations` route.

### Sequencing

1. **Stage 1 — unified accounts + host dashboard. Done, fully verified.** [x] Schema migration (`users`, `sessions`, `contributions.donor_id`, `verifications` purpose constraint) applied to the live Supabase project. [x] `/auth/*` routes (`request`, `confirm`, `me`, `logout`) and `GET /me/celebrations`, deployed and verified live via curl. [x] `/sign-in` and `/account` pages, `Header.tsx` wiring -- `npm run build`/`npm run lint` pass, and the full flow was clicked through live in the browser (against the deployed Worker, with `ALLOWED_ORIGIN` temporarily flipped to `localhost` for the test and reverted to `https://gifthappiness.pages.dev` afterward -- confirmed via a live CORS check post-revert): sign in with an email code (brute-forced from the stored hash for test purposes, same technique used throughout this project's testing) → redirected to `/account` → header shows the signed-in account and "Sign Out" → "My celebrations" correctly shows the empty state → Sign Out → `/account` correctly redirects back to `/sign-in` with no session. Nothing outstanding in Stage 1.
2. **Stage 2 — donor history. Code complete, not yet deployed/verified live.** [x] `contributions_donor_id_idx` added to `supabase/schema.sql` (not yet applied to the live project — needs a manual `CREATE INDEX` run against it). [x] `POST /celebrations/:slug/contributions` now attaches `donor_id` from the session when the donor is signed in, best-effort (guest donations still work unauthenticated). [x] `GET /me/contributions` (session-gated, reads the base `contributions` table so amount/message are never redacted for the donor's own view). [x] `/celebration`'s donor fields (name/email/mobile) pre-fill from the signed-in user's account, still editable, and the submit call now sends the session token. [x] `/account` gained a "Your past donations" section. `npm run lint`/`npm run build` (frontend) and `npm run typecheck` (workers) all pass. Not yet deployed to the live Worker or clicked through in the browser — that's the next step before calling this stage done, same as Stage 1's process.
3. **Stage 3 — admin RBAC. Code complete, not yet deployed/verified live.** [x] `/admin/*` routes (`listCharitiesAdmin`, `createCharity`, `updateCharity`) now check the session's `isAdmin` flag, with `ADMIN_API_KEY` kept as an explicit fallback during the transition (not deleted). [x] New read-only `/admin` page (gated on `user.isAdmin`; lists charities via the existing `GET /admin/charities`; no create/edit UI yet). [x] `Header.tsx` shows an "Admin" link only for admin users. `npm run typecheck` (workers) and `npm run lint`/`npm run build` (frontend) all pass. Not yet deployed to the live Worker, and no account has `is_admin = true` yet on the live project -- that manual SQL flip plus a browser click-through (signed-out, signed-in non-admin, signed-in admin) is the next step before calling this stage done.

Known constraint carried over from Phase 5: CORS is single-origin (`ALLOWED_ORIGIN`), so the new `/auth/*` and `/me/*` routes inherit the same Preview-deployment limitation already logged there.

## Phase 7: Live Charity Data

Product context (2026-08-19): GiftHappiness is being handed off to non-technical owners (a friend and his daughter, who will onboard others herself) to run charity management day-to-day. Neither uses a terminal, so charity management has to work entirely through the browser — no curl, no SQL editor.

### The gap found

Phase 6 Stage 3 (admin RBAC) added `/admin/*` write routes (`POST`/`GET`/`PATCH /admin/charities`) that read/write the real `charities` table in Supabase. But every public-facing page that shows charities — `/charities`, `/charities/[slug]`, the homepage teaser cards, `/create`'s charity-selection step, and `/impact` — still imports a static, hardcoded 12-charity dummy list from `src/lib/charities.ts`, written during Phase 3 before a backend existed. Nothing on the live site reads from the database. A charity created via `/admin` today would be invisible everywhere a donor or host actually looks — the admin write path and the public read path are completely disconnected.

### What needs to change

1. **Public `GET /charities` endpoint.** Reads the existing `charities_public` view (already defined in `supabase/schema.sql`, never wired to a route) — filtered to `status = 'active'`, no admin-only fields (e.g. `verification_notes`) exposed.
2. **Rewire the 5 static-import pages** to fetch from that endpoint instead of `src/lib/charities.ts`:
   - `/charities` (directory)
   - `/charities/[slug]` (detail page — currently a build-time `generateStaticParams` route; needs to become a client-side fetch instead, since charities are no longer known at build time)
   - `/` (homepage featured-charity teasers)
   - `/create` (charity-selection step)
   - `/impact` (aggregate totals + per-charity table)
3. **Admin create-charity form** on `/admin`, calling the existing `POST /admin/charities` — the intended admin can't use curl. Slug should auto-generate from the charity name (don't ask a non-technical user to hand-write a URL slug).
4. Once live, `src/lib/charities.ts` becomes dead code and can be deleted.

### Open questions

- `/charities/[slug]` currently uses `generateStaticParams` for a fully static export — moving to live data means switching that route to a client-side fetch (matches the pattern already used by `/account`/`/admin`), since re-running the Cloudflare Pages build every time a charity is added isn't acceptable for a non-technical admin.
- Should the admin form also support editing/deactivating a charity after creation (`PATCH /admin/charities/:slug` already exists server-side), or is create-only enough for this pass? Deferred until the create flow itself is confirmed working.

### Sequencing

1. Public `GET /charities` endpoint (backend).
2. Rewire `/charities`, `/charities/[slug]`, `/`, `/create`, `/impact` to the live endpoint (frontend).
3. Admin create-charity form (frontend).
4. Delete `src/lib/charities.ts`.

Not started. No code changed in this write-up — documenting the gap and the plan before building, same as Phase 6.

## CMS And Admin Direction

Superseded by Phase 6 above for auth/roles specifically; the sections below (content-management scope, non-auth admin decisions) still stand.

Do not add a CMS framework yet. The current setup is good enough for the next backend pass if admin needs stay narrow.

Recommended path:

- Start with a simple internal admin surface built in the existing Next.js app.
- Store managed content in Supabase tables.
- Use role-based access for admin-only pages/actions.
- Reconsider a dedicated CMS only if editorial workflows become complex.

CMS/admin decision points:

- [x] Confirmed (2026-08-19): a non-technical friend and his daughter will manage charity data going forward, and she'll onboard others herself — admin UI must work entirely in-browser, no terminal/SQL access assumed. Likely low volume. See Phase 7: Live Charity Data above.
- [ ] Confirm whether landing page copy needs non-developer editing.
- [ ] Confirm whether FAQ/policy content needs admin editing.
- [ ] Decide whether admin pages are part of this app or a separate protected surface.
- [ ] Define admin roles:
  - owner/admin
  - charity manager
  - content editor
  - read-only reviewer

## SEO Plan

SEO matters because charity pages and celebration pages should be shareable and understandable to search engines and social platforms.

Static/public SEO work:

- [ ] Add page-specific metadata for Home, About, Charities, Create, and Celebration preview.
- [ ] Add Open Graph and Twitter card metadata.
- [ ] Add canonical URLs after the production domain is finalized.
- [ ] Add sitemap generation.
- [ ] Add `robots.txt`.
- [ ] Add structured data where appropriate:
  - Organization for GiftHappiness
  - FAQPage for the FAQ section
  - CollectionPage for charities
- [ ] Ensure public pages render meaningful static HTML.
- [ ] Ensure images have descriptive alt text once real images are added.
- [ ] Confirm performance on Cloudflare Pages after deployment.

Dynamic SEO work:

- [ ] Decide whether individual celebration pages should be indexable or `noindex`.
- [ ] Decide whether individual charity pages should be indexable.
- [ ] Generate metadata dynamically for public charity pages.
- [ ] Add privacy controls so private celebration details are never exposed through SEO metadata.

## Domain And DNS Plan

The domain is currently on GoDaddy.

Options:

- Keep the domain registered at GoDaddy and point DNS records to Cloudflare Pages.
  - Upside: fastest path, no registrar transfer risk.
  - Downside: DNS/registrar management remains split.
- Transfer DNS management to Cloudflare while keeping the registrar at GoDaddy.
  - Upside: Cloudflare manages DNS, SSL, proxying, and Pages integration cleanly.
  - Downside: still pay/manage renewal at GoDaddy.
- Transfer the domain registration to Cloudflare or Namecheap.
  - Upside: cleaner long-term ownership and DNS management.
  - Downside: transfer friction, timing constraints, and possible temporary restrictions.

Recommended next step:

- [ ] Use a custom domain on Cloudflare Pages first.
- [ ] If staying on GoDaddy temporarily, update DNS records there to point to Cloudflare.
- [ ] Later decide whether to transfer the registrar to Cloudflare or Namecheap.
- [ ] Finalize production domain before SEO canonical URLs are implemented.

## Payments Plan

Payment flow is intentionally deferred until charity conversations are complete.

Open questions for charities:

- [ ] How do they accept donations today?
- [ ] Can they provide direct payment links?
- [ ] Can they accept metadata/reference IDs for campaign or celebration tracking?
- [ ] Can they issue receipts automatically?
- [ ] How do they handle PAN/tax benefit requirements?
- [ ] Do they support refunds or cancellation policies?
- [ ] Are they comfortable with GiftHappiness collecting pledge/contributor details before redirecting to their payment flow?

Implementation options to evaluate later:

- Direct charity payment link per celebration.
- Payment gateway integration owned by GiftHappiness.
- Payment gateway integration owned by each charity.
- Hybrid flow where GiftHappiness records intent and redirects to charity-owned payment rails.

## Trust, Safety, And Abuse Protection

Protection mechanisms should be planned before enabling public forms.

Initial protections:

- [ ] Add Cloudflare Turnstile to public forms:
  - create celebration
  - contribution intent/donor form
  - contact/admin request forms if added
- [ ] Add email verification before someone can contribute.
- [ ] Add email verification before a host can publish/manage a celebration.
- [ ] Rate-limit form submissions at the Cloudflare Worker layer.
- [ ] Validate all inputs server-side in Workers before writing to Supabase.
- [ ] Add Supabase Row Level Security policies.
- [ ] Use signed or expiring links for host management actions.
- [ ] Add moderation controls for contributor messages.
- [ ] Add abuse reporting or manual hide controls for public contributor wall entries.
- [ ] Add audit logs for admin edits and visibility changes.
- [ ] Define spam handling and blocklist strategy.
- [ ] Keep payment amount visibility private by default.
- [ ] Keep contributor names visible by default but opt-out.

## Admin-Controlled Content

Likely admin-controlled areas:

- [ ] Charity list and charity profiles (see Phase 7: Live Charity Data — public pages still read a static dummy file, not the database).
- [ ] Charity donation limits and active/inactive status.
- [ ] Landing page copy.
- [ ] Featured charities.
- [ ] Celebration pages.
- [ ] User/host records.
- [ ] Donation records or payment references.
- [ ] FAQ and policy content.

## Engineering Cleanup

- [x] Fix current lint issues.
- [ ] Restore build health after reinstalling the correct native dependency package for this machine.
- [x] Add or confirm `docs/changelog.md` workflow.
- [ ] Add `docs/git_workflow.md` if the branch/release process needs more detail than `AGENTS.md`.
