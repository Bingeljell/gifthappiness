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

- [ ] Add an **Impact** page/section to the nav (public totals, SDG framing — see the new Transparency phase below).
- [ ] Give **FAQ** its own top-level nav entry (currently only reachable via `/about#faq`); decide whether it stays merged into About or becomes `/faq`.
- [ ] Add a visible but non-functional **Sign In** nav placeholder (no auth exists yet; make that explicit in the UI rather than omitting the item).
- [ ] Remove or relabel the dev-only "Preview Page" nav link before this becomes a real IA — it is not part of the documented nav.
- [ ] Add footer pages/stubs for: **Contact**, **For Charities**, **Privacy Policy**, **Terms of Service**, **Refund/Donation Policy**, **Charity Selection Policy**, **Transparency and SDGs**. None of these exist today, even as placeholders.

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

- [ ] Rebuild `/create` as the documented three-step flow (Host & Occasion → Cause & Page → Preview & Publish) instead of one long static form. Step 3 needs a rendered preview of the celebration page before "publish."
- [ ] Add a QR code preview/placeholder to the create flow's publish step (client-side generation against the static demo URL; no backend needed).
- [ ] Align the celebration-page CTA copy with the suggested line in `website_dev.md` §8 ("Instead of gifts, please consider supporting a cause close to my heart.") or confirm the current wording is an intentional departure.

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
- [ ] Build the `/charities/[slug]` detail page per the spec above.
- [ ] Add SDG tags to each charity (`master_docs.md` §10) on both the directory card and the detail page.
- [ ] Define how charities rotate out after reaching the predetermined limit.

## Phase 3b: Transparency And Impact (new — `master_docs.md` §9, §10, §12)

The docs treat public transparency as a core trust mechanic, not a later add-on. None of this exists on the site yet. All of it can ship as static/dummy data in this phase; it becomes real data once Supabase is wired up in Phase 5.

- [ ] Add an **Impact** page: per-charity amount raised (dummy figures), allocation ceiling, active/completed status — the public answer to "where is the money going?"
- [ ] Add SDG framing content: a short explainer of how celebrations map to UN SDGs, referenced from charity cards/detail pages and the Impact page.
- [ ] Add an amount-raised/status pill to charity directory cards (dummy data now, same shape the real data will use later).

## Phase 3c: Legal And Informational Pages (new — footer requirement)

Stub pages so the footer links specified in `master_docs.md`/`website_dev.md` are not dead links. Content stays placeholder/"final wording pending legal review" until Phase 5/legal work resolves it — this mirrors how the Create form already marks OTP/payment as pending.

- [ ] `/privacy` — placeholder Privacy Policy page.
- [ ] `/terms` — placeholder Terms of Service page.
- [ ] `/refund-policy` — placeholder Refund/Donation Policy page.
- [ ] `/charity-selection-policy` — placeholder Charity Selection Policy page (can reuse the existing vetting-criteria content).
- [ ] `/contact` — static contact page.
- [ ] `/for-charities` — static page describing how a charity gets listed/vetted, aimed at NGO partners rather than donors.

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
- [ ] Create a Supabase project on the free tier.
- [ ] Define initial database schema:
  - hosts/users
  - charities
  - celebrations
  - contributors
  - contribution visibility preferences
  - payment references or pending payment records
- [ ] Define Cloudflare Worker API routes for:
  - creating a celebration
  - reading a public celebration page
  - submitting contribution details
  - verifying email or one-time links
  - admin-only charity/content updates
- [ ] Decide whether image uploads use Supabase Storage or Cloudflare R2.
- [ ] Define data retention and privacy requirements.
- [ ] Define audit logging needs for admin actions.

## CMS And Admin Direction

Do not add a CMS framework yet. The current setup is good enough for the next backend pass if admin needs stay narrow.

Recommended path:

- Start with a simple internal admin surface built in the existing Next.js app.
- Store managed content in Supabase tables.
- Use role-based access for admin-only pages/actions.
- Reconsider a dedicated CMS only if editorial workflows become complex.

CMS/admin decision points:

- [ ] Confirm who will manage charity data and how often it changes.
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

- [ ] Charity list and charity profiles.
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
