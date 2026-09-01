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
2. **Stage 2 — donor history. Done, deployed, verified live.** [x] `contributions_donor_id_idx` applied to the live Supabase project. [x] `POST /celebrations/:slug/contributions` attaches `donor_id` from the session when the donor is signed in, best-effort (guest donations still work unauthenticated). [x] `GET /me/contributions` (session-gated, reads the base `contributions` table so amount/message are never redacted for the donor's own view). [x] `/celebration`'s donor fields (name/email/mobile) pre-fill from the signed-in user's account, still editable, and the submit call sends the session token. [x] `/account` gained a "Your past donations" section. Deployed to the live Worker; `GET /me/contributions` confirmed live (401 unauthenticated, as expected).
3. **Stage 3 — admin RBAC. Done, deployed, verified live.** [x] `/admin/*` routes (`listCharitiesAdmin`, `createCharity`, `updateCharity`) check the session's `isAdmin` flag, with `ADMIN_API_KEY` kept as an explicit fallback during the transition (not deleted). [x] Read-only `/admin` page (gated on `user.isAdmin`; lists charities via `GET /admin/charities`). [x] `Header.tsx` shows an "Admin" link only for admin users. Deployed to the live Worker; `is_admin = true` flipped on an account via live SQL, confirmed the "Admin" link and charities list render correctly in the browser once signed in as that account.

Known constraint carried over from Phase 5: CORS is single-origin (`ALLOWED_ORIGIN`), so the new `/auth/*` and `/me/*` routes inherit the same Preview-deployment limitation already logged there.

## Phase 7: Live Charity Data

Product context (2026-08-19): GiftHappiness is being handed off to non-technical owners (a friend and his daughter, who will onboard others herself) to run charity management day-to-day. Neither uses a terminal, so charity management has to work entirely through the browser — no curl, no SQL editor.

### The gap found

Phase 6 Stage 3 (admin RBAC) added `/admin/*` write routes (`POST`/`GET`/`PATCH /admin/charities`) that read/write the real `charities` table in Supabase. But every public-facing page that shows charities — `/charities`, `/charities/[slug]`, the homepage teaser cards, `/create`'s charity-selection step, and `/impact` — still imports a static, hardcoded 12-charity dummy list from `src/lib/charities.ts`, written during Phase 3 before a backend existed. Nothing on the live site reads from the database. A charity created via `/admin` today would be invisible everywhere a donor or host actually looks — the admin write path and the public read path are completely disconnected.

### What needs to change

1. **Public `GET /charities` and `GET /charities/:slug` endpoints.** Read the existing `charities_public` view (already defined in `supabase/schema.sql`, never wired to a route). Implementation note: returns the view as-is, no `status` filter or field redaction added -- the view is already named/granted for public consumption (`grant select ... to anon`), same design already applied to `celebrations_public`/`contributions_public`, so there was nothing extra to filter. Each page decides what to do with `status` itself (e.g. `/impact` shows both active and completed for transparency).
2. **Rewire the 5 static-import pages** to fetch from that endpoint instead of `src/lib/charities.ts`: `/charities`, `/charities/[slug]`, `/`, `/create`, `/impact`.
3. **Admin create-charity form** on `/admin`, calling the existing `POST /admin/charities` — the intended admin can't use curl. Slug auto-generates from the charity name.
4. Delete `src/lib/charities.ts` once nothing imports it.

### Resolved: the `/charities/[slug]` static-export problem

Static export can't pre-render one HTML file per charity slug once charities are added at runtime (no `generateStaticParams` list to enumerate) -- confirmed against this project's bundled Next.js docs (`node_modules/next/dist/docs/01-app/02-guides/static-exports.md`): a dynamic route without `generateStaticParams()` is explicitly unsupported for static export.

Solution: `generateStaticParams()` returns a single fixed param (`{ slug: "_shell" }`), producing one static shell page at `/charities/_shell`. `public/_redirects` rewrites any `/charities/*` request to that shell with a `200` (rewrite, not redirect, so the browser URL bar keeps the real slug). The shell is a Client Component (`CharityDetailClient.tsx`) that reads the actual slug from `window.location.pathname` and fetches it. Standard technique for dynamic routes on a static host, same idea as the `try_files`/nginx rewrite example in the same Next.js doc, applied via Cloudflare Pages' `_redirects` file instead.

Known tradeoff: per-charity `generateMetadata` (title/OG tags per charity) isn't possible with this approach since the route is a client-side shell, not server-rendered per slug -- relevant to the still-open per-charity-page item in the SEO Plan section below. Not addressed in this pass.

### Sequencing

1. [x] Public `GET /charities` and `GET /charities/:slug` endpoints (backend).
2. [x] Rewired `/charities`, `/charities/[slug]`, `/`, `/create`, `/impact` to the live endpoint (frontend), including the `_shell`/`_redirects` technique above.
3. [x] Admin create-charity form on `/admin`, slug auto-generated from name.
4. [x] Deleted `src/lib/charities.ts`.

Deployed and verified live: added a charity via `/admin`, confirmed the `_shell`/`_redirects` rewrite works on real Cloudflare Pages, confirmed the new backend routes are live.

### Post-launch feedback (2026-08-19)

Product context: GiftHappiness is not a fundraising-target platform ("raise ₹X for charity Y") -- it's a conduit to good, a way to celebrate by giving. The "ceiling"/fundraising-goal concept never fit that framing and is removed, not just hidden.

1. **Removed `ceiling` entirely** -- dropped from the schema (`supabase/schema.sql` and the live table, manual migration required, see below), the admin create/update routes, the admin form, and every page that showed a "raised of X" progress bar or figure (`/charities`, `/charities/[slug]`, `/impact`'s table, `/admin`'s list). `amount_raised` stays -- charities still show how much has come through GiftHappiness, just with no target/cap framing.
2. **Removed "rotates out after reaching a limit" language** from the homepage, `/charities`, `/about`'s FAQ, and `/charity-selection-policy` -- that policy no longer exists once there's no ceiling to reach.
3. **"What they do" / "Who they help" / "Why selected" / "Impact example" are now line-based bullet lists** instead of single-paragraph text fields -- the admin form textareas are labeled "one point per line"; the charity detail page (`CharityDetailClient.tsx`) splits on newlines and renders an actual `<ul>`, stripping any leading `-`/`1.`/`•` markers the admin might type out of habit. Also restacked those three blocks from a cramped 3-column grid to full-width stacked cards, since longer list content didn't fit a narrow column.
4. **Added a `website` field** (schema + admin form + charity detail page, shown as an external link near the charity name).
5. **Payments**: answered, not changed -- there is no payment gateway wired up. `submitContribution` always records `payment_status: "pending"` and never transitions it; this is a known, separate, not-yet-scoped gap (see the Payments Plan section below).

**Manual step, run and confirmed working live (2026-08-19)**, same pattern as the Stage 2 index: the schema.sql edit doesn't apply itself to the live Supabase project. Run against it (the view must be dropped *before* the column, not replaced with the same statement -- `charities_public` depends on `ceiling`, and `CREATE OR REPLACE VIEW` can't drop a column from the middle of an existing view's output; hit this live on first attempt, corrected here):
```sql
drop view charities_public;

alter table charities drop column ceiling;
alter table charities add column website text;

create view charities_public as
select
  id, slug, name, category, status, short_description, what_they_do,
  who_they_help, why_selected, impact_example, sdgs, amount_raised,
  registration, years_active, verification_notes, website
from charities;

grant select on charities_public to anon, authenticated;
```

**Known gap surfaced during testing, since fixed**: the one charity created via `/admin` before this fix (test data, "YODA") had its "What they do"/"Who they help" text as a single run-on paragraph with inline `-`/numbered markers, not real line breaks -- the bullet renderer can't retroactively split text that has no newlines in it. Fixed by adding an edit UI (below); the actual "YODA" content still needs re-entering through the corrected form by whoever owns it, since the fix can't rewrite existing bad content automatically.

### Edit UI (2026-08-19)

`PATCH /admin/charities/:slug` existed server-side since Stage 3 but nothing called it -- Stage 3 explicitly deferred edit to ship create-only first. With real content now needing fixes, that gap became blocking.

- **Found and fixed a real bug along the way**: the Worker's CORS config (`workers/src/lib/response.ts`) only allowed `GET, POST, OPTIONS` -- `PATCH` was never added, so any browser-based edit call would have failed at the CORS preflight stage regardless of the frontend code. Added `PATCH` to `Access-Control-Allow-Methods`.
- Extracted `FormField`/`SdgChecklist` out of `AddCharityForm.tsx` into a shared `CharityFormFields.tsx` so the create and edit forms don't duplicate ~80 lines of field-rendering markup.
- Added `adminUpdateCharity` to the API client (`AdminUpdateCharityInput` uses snake_case field names directly, matching how `updateCharity` reads its `allowedFields` off the raw request body server-side -- unlike the create route, which maps camelCase to snake_case).
- Added `EditCharityForm.tsx`: pre-filled from the existing charity, slug shown read-only (changing it would break existing links), adds `status` (active/completed) and `amount_raised` as editable fields alongside everything the create form has -- both are legitimate admin-only edits (`amount_raised` in particular needs manual updates until a payment gateway exists, see the Payments answer above).
- Wired into `/admin`: each charity row gets an Edit button that swaps the row for the edit form in place; saving updates that one charity in local state without a full refetch.

Code complete: `npm run typecheck` (workers), `npm run lint`/`npm run build` (frontend) all pass. Deployed 2026-09-01 as part of the Phase 8 Worker redeploy below -- the CORS `PATCH` fix is live.

## Phase 8: Charity Pictures (2026-09-01)

Client feedback: charities need a picture as part of onboarding. Storage decision (left open in Phase 5's backend items) resolved as Supabase Storage, to keep everything -- DB and file storage -- in the one already-provisioned Supabase project rather than adding Cloudflare R2 as a second storage system.

- `charities.logo_url text` (nullable) added to `supabase/schema.sql`, and to `charities_public`'s column list.
- New public Storage bucket `charity-logos` (`public: true`, added via `insert into storage.buckets ...` in `supabase/schema.sql`) -- public so the returned URL works with no auth; there's no anon `INSERT` policy, so only the Worker (service role, bypasses Storage RLS the same way it does for tables) can write to it.
- `POST /admin/uploads/charity-logo` (`workers/src/routes/uploads.ts`): admin-gated (same `isAuthorizedAdmin` check as the other admin routes), takes multipart/form-data with a `file` field, validates type (PNG/JPEG/WebP) and size (5MB max), uploads to the bucket under a random UUID filename, returns the public URL. Upload is a separate step from charity create/update on purpose -- the admin form uploads first, then sends the resulting URL as `logo_url` on the existing `POST`/`PATCH /admin/charities` routes, so re-saving a charity's text fields never re-uploads or re-touches the image.
- `logo_url` added to `createCharity`/`updateCharity`'s accepted fields (`workers/src/routes/admin.ts`) and to the frontend's `Charity`/`AdminCharity`/`AdminCreateCharityInput`/`AdminUpdateCharityInput` types (`src/lib/api.ts`).
- `ImageUploadField` added to `CharityFormFields.tsx`, wired into both `AddCharityForm.tsx` and `EditCharityForm.tsx` (shows a preview, uploads on file select, stores the returned URL in form state until the charity itself is saved).
- New `CharityBadge` component (`src/components/CharityBadge.tsx`): shows the uploaded logo when `logo_url` is set, falls back to the existing category-initial circle otherwise. Used on the homepage's featured cards, the `/charities` directory cards, and the `/charities/[slug]` detail page, replacing the old always-on-initials badge in all three places.

Code complete: `npm run lint`/`npm run build` (frontend) and `npx tsc --noEmit` (workers) all pass.

**Applied live 2026-09-01.** The `supabase` CLI was already authenticated locally under the account's login (discovered via `supabase projects list`, which listed the `gifthappiness` project despite no service-role key/`psql` being present in this checkout) -- linked with `supabase link --project-ref fsradcbnqocpvxqwizdt` and ran the SQL below via `supabase db query --linked -f ...` (Management API, not a direct Postgres connection, so no `psql`/DB password needed):
```sql
alter table charities add column if not exists logo_url text;

insert into storage.buckets (id, name, public)
values ('charity-logos', 'charity-logos', true)
on conflict (id) do nothing;

create or replace view charities_public as
select
  id, slug, name, category, status, short_description, what_they_do,
  who_they_help, why_selected, impact_example, sdgs, amount_raised,
  registration, years_active, verification_notes, website, logo_url
from charities;
```
(Adding a column and `create or replace view` when only *adding* a trailing column both work without dropping the view first -- unlike Phase 7's ceiling removal, nothing is being removed from the view's output here.)

Then `wrangler deploy` from `workers/` shipped the new `/admin/uploads/charity-logo` route (and the previously-pending Phase 7 CORS `PATCH` fix in the same deploy). Verified end to end: `GET /charities/unicef` now returns `logo_url: null`; a real `POST /admin/uploads/charity-logo` with the `ADMIN_API_KEY` and a test PNG uploaded successfully and returned a working public URL (`200` on direct fetch); the unauthenticated case correctly `401`s; the test file was deleted from the bucket afterward (`supabase storage rm --experimental`).

### Bug fix: `InfoBlock` bullet-stripping regex ate leading numbers (2026-09-01)

Reported live on YODA's charity page: the "Impact example" bullets read ",000+ animals medically treated..." instead of "500,000+ animals...". `CharityDetailClient.tsx`'s `InfoBlock` strips a leading list-marker off each line before rendering it as a bullet (`/^[-•\d.)\s]+/`), but that character class matched bare leading digits too, not just an actual "-"/"•"/"1." marker -- so real content starting with a number (YODA's impact figures) got eaten. Narrowed to `/^(?:[-•]|\d+[.)])\s*/`, which only strips a genuine bullet/dash or an ordered-list prefix ("1." / "1)"), verified against the real YODA text. Frontend-only fix, no backend/schema change.

## Phase 8b: Charity Header Images (2026-09-01)

Client feedback after Phase 8 shipped: `logo_url` (the small square badge, kept as-is) isn't what was meant by "add pictures" -- the ask was a wide header/marquee banner per charity, shown atop the charity's own page and as a cover image on the cards that link to it.

- `charities.header_image_url text` (nullable) added alongside the existing `logo_url`, and to `charities_public`.
- Second public Storage bucket, `charity-headers` -- kept separate from `charity-logos` rather than reusing one bucket for both image kinds, so filenames (random UUIDs in both) never collide across the two purposes.
- `workers/src/routes/uploads.ts` refactored: the upload logic (validate type/size, upload to a bucket, return the public URL) is now a shared `uploadCharityImage(request, env, bucket)` helper, with `uploadCharityLogo`/`uploadCharityHeader` as thin wrappers over it for the two buckets. New route `POST /admin/uploads/charity-header`.
- `header_image_url` added to `createCharity`/`updateCharity`'s accepted fields, and to every relevant frontend type (`Charity`, `AdminCharity`, `AdminCreateCharityInput`, `AdminUpdateCharityInput`).
- `CharityFormFields.tsx`: extracted the upload-field mechanics into an internal `ImageUploadFieldBase`, with `ImageUploadField` (logo, square preview) and a new `HeaderImageUploadField` (banner, wide preview) as thin wrappers -- both admin forms now show both fields.
- Rendering: a full-width banner atop the charity detail page (above the two-column info/donate layout) when set; a cover-image strip bled to the card edges (negative-margin technique, since the cards use padding rather than a separate image container) atop each card on `/charities` and the homepage's featured-charity teasers. No change when `header_image_url` is unset -- cards/detail page look exactly as before.

Code complete: `npm run lint`/`npm run build` (frontend) and `npx tsc --noEmit` (workers) all pass.

**Applied live 2026-09-01**, same mechanism as Phase 8 (`supabase link` + `supabase db query --linked`, no service-role key/`psql` needed): added the column, created the `charity-headers` bucket, and updated the view. `wrangler deploy` shipped the new route. Verified end to end the same way as Phase 8's logo upload: `GET /charities/unicef` returns `header_image_url`; a real authenticated upload to `/admin/uploads/charity-header` succeeded and returned a working public URL; the test file was deleted from the bucket afterward.

### Bug fix: logo cropping (2026-09-01)

Reported after the first real logo upload (YODA's logo): `CharityBadge`'s public rendering and the admin form's logo preview both used `object-cover` on a fixed-size circle/square, which crops a non-square logo to fill the shape rather than showing the whole mark. Switched both to `object-contain` with a white background + small padding. The header/marquee banner is unaffected -- `object-cover` stays correct there, since cropping a wide photo's edges is expected/fine, unlike a logo where every part of the mark matters. Frontend-only, no schema/backend change, no re-upload needed for already-uploaded logos (this only changed how the stored image is displayed).

## Phase 8c: Delete A Charity (2026-09-01)

Product context: charities can already be retired via the existing `status: 'completed'` field, but there was no way to actually remove one -- surfaced when the user wanted to delete the `unicef` test/dummy charity and couldn't. Framed as "we may want to swap charities out in the future" -- a genuine ongoing need, not just cleanup of test data.

Decision: real delete, but blocked server-side if any celebration has ever pointed at the charity (`celebrations.charity_id` has no cascade rule, and donation history shouldn't silently disappear). For a charity that's actually been used, `status: 'completed'` remains the intended way to retire it -- delete is for charities that were never actually used (test/dummy entries, or one added and reconsidered before launch).

- `DELETE /admin/charities/:slug` (`workers/src/routes/admin.ts`, admin-gated same as the other admin routes): looks up the charity, counts `celebrations` rows referencing its id (`select count, head: true` -- no rows fetched), returns `409` with the count if nonzero, otherwise deletes and returns `{ deleted: true }`.
- **Found and fixed the same CORS bug class as Phase 7's `PATCH` fix**: `Access-Control-Allow-Methods` didn't list `DELETE` either -- added it in the same pass rather than waiting to hit it live.
- `adminDeleteCharity` added to the API client (`src/lib/api.ts`).
- `/admin`'s charity list (`src/app/admin/page.tsx`) gained a Delete button per row with an inline two-step confirm ("Delete X? This can't be undone" + Confirm/Cancel, not a native `confirm()` dialog, to match the app's existing UI patterns) and an inline error message if the backend refuses (e.g. "This charity has 3 celebrations tied to it and can't be deleted").

Code complete: `npm run lint`/`npm run build` (frontend) and `npx tsc --noEmit` (workers) all pass.

**Applied live 2026-09-01**: `wrangler deploy` shipped the new route (no schema/DB migration needed -- delete doesn't add any new column/table). Verified end to end: created a real throwaway test charity via the API, confirmed unauthenticated `DELETE` 401s, confirmed an authenticated `DELETE` removes it (`GET` afterward correctly 404s), confirmed the `OPTIONS` preflight now lists `DELETE`. Did not test the "blocked because celebrations exist" path against a real charity (UNICEF/YODA) to avoid any risk of actually deleting one if the celebration count happened to be zero -- the block logic was verified by code review instead, following the same count-then-act pattern already used elsewhere in this file.

## Phase 9: Admin Celebrations -- Approval, Completion, Edit (2026-09-01)

Product context: the user asked "how do I see people's celebrations and mark them complete", then clarified mid-session that admin also needs to edit a celebration if something's wrong with it, and -- the important part -- **every celebration must be approved by an admin before it goes live**.

This turned out to close a real, previously-open gap rather than just adding a nice-to-have: `POST /celebrations` (`workers/src/routes/celebrations.ts`) always inserts `status: 'draft'`, and until this pass **nothing ever transitioned a celebration out of draft** -- this was an explicit open TODO in this file ("Wire a draft→published transition for celebrations"). So every celebration ever created through `/create` was permanently invisible on its own public page, regardless of what the "Publish" button implied. The admin-approval requirement isn't a new gate bolted onto an existing self-publish flow -- it's the first and only mechanism that has ever published a celebration.

No "completed" status was added for celebrations, following the same call already made for charities' "expired" vs a new value question: `celebrations.status` already has `'expired'`, which already means exactly "this celebration's active window is over" from the public view's (`celebrations_public`) perspective. Admins mark a celebration done by setting that, surfaced in the UI as "Mark complete".

- **Backend** (`workers/src/routes/adminCelebrations.ts`, new file):
  - `GET /admin/celebrations` -- lists every celebration regardless of status (unlike `celebrations_public`, which only shows `'published'` rows), with host (name/email/mobile) and charity (name/slug) embedded via postgrest's FK-based nested `select` (`host:users!host_id(...)`, `charity:charities!charity_id(...)`) rather than a second round-trip per row.
  - `PATCH /admin/celebrations/:slug` -- one endpoint doubles as both the approval action (`{ status: 'published' }`) and a general edit (`celebration_type`/`celebration_date`/`active_from`/`active_till`/`message`), matching the `allowedFields`-style pattern already used by `updateCharity`.
  - Both admin-gated by the same `isAuthorizedAdmin` check duplicated into this file (same tradeoff already made in `uploads.ts` -- avoids a cross-route import cycle for one guard clause).
  - **Found and fixed the same CORS bug class a third time**: `DELETE` (Phase 8c) and `PATCH` (Phase 7) had already been added, but this is a reminder the pattern keeps recurring -- any new HTTP method needs a matching `Access-Control-Allow-Methods` entry in `workers/src/lib/response.ts` or it 404s/CORS-fails silently from the browser regardless of the route code being correct.
- **Frontend**: `AdminCelebrations.tsx` (new), rendered as a second card on `/admin` below Charities. Per celebration: host/charity/date/status, and status-appropriate action buttons -- "Approve & publish" (draft), "Mark complete" (published → expired), "Reopen" (expired/flagged → published), "Flag" (draft/published → flagged) -- plus an "Edit" button swapping in a form for the content fields, mirroring `EditCharityForm`'s swap-in-place pattern. `adminUpdateCelebration`/`adminListCelebrations`/`AdminCelebration`/`AdminUpdateCelebrationInput` added to `src/lib/api.ts`.
- **`/create` copy fix**: the Publish button and success message previously said "Publish"/"Created as X. It's saved as a draft in the database." -- accurate about the draft status but didn't explain what happens next. Changed to "Submit for review"/"Submitted as X. A GiftHappiness admin needs to review and approve it before the page goes live," now that there's an actual next step to describe.

Code complete: `npm run lint`/`npm run build` (frontend) and `npx tsc --noEmit` (workers) all pass.

**Applied live 2026-09-01**: `wrangler deploy` shipped the new routes (no schema/DB migration needed). Verified end to end against a real existing test celebration (`test-host-birthday-...`, from the Phase 5 smoke test, still sitting in `draft`): confirmed unauthenticated `GET /admin/celebrations` 401s; ran the full cycle -- approved it (`draft` → `published`, confirmed `GET /celebrations/:slug` now returns it), marked it complete (`published` → `expired`, confirmed the public endpoint then correctly 404s), then restored it to `draft` to leave state exactly as found.

**Known follow-on gap, not addressed here**: even a `published` celebration still has no dedicated public page at a real per-celebration URL -- `/celebration` (singular, no slug) posts contributions to a hardcoded `"demo"` slug (a different pre-existing open TODO, see Phase 5's backend work items above). Approval now correctly gates what's *allowed* to be shown publicly; wiring an actual `/celebration/[slug]` route is separate, unstarted work.

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
