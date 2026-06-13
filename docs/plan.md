# GiftHappiness Plan

Updated as of 13 June 2026.

## Current Direction

GiftHappiness should first become a complete static front-end experience. The near-term goal is to update all public content, add the missing pages and forms, and make the site coherent without sending data anywhere.

The backend, database, payments, admin tools, and hosting architecture should be decided after the static product flow is visible end to end.

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
- [ ] Decide whether each charity needs an individual dedicated page before launch.
- [ ] Define how charities rotate out after reaching the predetermined limit.

## Phase 4: Design Pass

- [ ] Apply client feedback after content and page structure are in place.
- [ ] Finalize logo direction.
- [ ] Review visual tone for a charity-first project.
- [ ] Improve mobile layout and form ergonomics.
- [ ] Replace placeholder visuals/icons where needed.

## Phase 5: Backend And Hosting Decision

The current site is static and deployed to Cloudflare. That is enough for the next content and page-building pass.

Open architecture options:

- Cloudflare Pages + Cloudflare Worker + Supabase database.
  - Upside: no server to manage, works well with the current Cloudflare deployment, quick path to forms and admin workflows.
  - Downside: dependency on Cloudflare and Supabase service limits, pricing, auth, and operational behavior.
- Self-hosted app on DigitalOcean, AWS, or similar with a SQL database.
  - Upside: more control over runtime, database, and deployment architecture.
  - Downside: more infrastructure responsibility, maintenance, backups, monitoring, and deployment complexity.
- Hybrid approach.
  - Upside: keep static pages on Cloudflare while moving only dynamic workflows to a managed backend.
  - Downside: more integration surfaces and more decisions around authentication, secrets, and observability.

Decision still needed:

- [ ] Database choice: Supabase/Postgres, self-managed SQL, or another managed database.
- [ ] Authentication strategy for hosts/admins.
- [ ] Payment gateway.
- [ ] OTP provider.
- [ ] File upload/storage for celebration pictures.
- [ ] Admin interface scope.
- [ ] Data retention and privacy requirements.

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
