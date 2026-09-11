# Open Items

Running punch list of known gaps, deferred decisions, and things that will bite later.
Last updated 2026-09-10.

`docs/plan.md` is the phased roadmap and decision log; this file is the short "what's
still outstanding" view. When an item is done, delete it here and record it in
`docs/changelog.md`.

**Note:** items here are tracked even when the current state is intentional — an item
staying on the list is how we remember it's still outstanding.

---

## Blocking or user-visible now

### `hello@gifthappiness.org` does not exist yet
That address is printed on **six pages** — Contact, Privacy, Terms, Refund, For Charities,
and in email footers — and mail sent to it currently bounces.

Waiting on the people running the site to decide where they want it to land; the technical
part is small. DNS is already on Cloudflare, so **Cloudflare Email Routing** covers it for
free: add the address, forward it wherever they like. Zoho's free tier or Google Workspace
also work.

Once it exists, change `EMAIL_REPLY_TO` in `workers/wrangler.toml` from
`no-reply@mail.gifthappiness.org` to `hello@gifthappiness.org` and redeploy the Worker.

### Legal pages are not lawyer-reviewed
Privacy, Terms and Refund were expanded from placeholders into full plain-language
policies describing what the platform actually does. **They are accurate, not vetted.**
A charity partner may well read them. Get them reviewed before real money moves.

### DMARC record is GoDaddy's, not ours
`_dmarc.gifthappiness.org` still holds the record inherited from GoDaddy:

```
v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net
```

It enforces `p=quarantine` while **sending failure reports to GoDaddy rather than to us**,
so we get no visibility. Replace with our own, starting at `p=none` to monitor:

```
v=DMARC1; p=none; rua=mailto:<a real inbox>
```

Tighten to `quarantine` after a few weeks of clean reports.

---

### Test celebrations are publicly listed
Celebrations with placeholder messages (e.g. *"This is a test page. Will be deleted"*) appear
on `/celebrations`.

**Deliberate for now** — they're how the people running the site see the real flow end to end,
so don't delete them as cleanup. Still tracked here because they should come off before any
real public launch, and because a charity or early visitor browsing `/celebrations` will see
them.

---

## Payments

Payments are a **passthrough to each charity's own mechanism** — GiftHappiness never holds
funds. The concrete mechanism depends on what the first charity already uses, so nothing is
built yet.

- `contributions.payment_status` is always `'pending'`; nothing moves it.
- Donor-facing copy says the contribution is *recorded* and that we'll email payment
  instructions. **When the passthrough is decided this flow probably becomes a handoff to
  the charity's donation page**, which changes both the form's ending and the donor email.
- `contributions_public` hides amounts until `payment_status = 'succeeded'` **and** the donor
  opted in. That's written as a condition, not a hardcoded null, so amounts start appearing
  on their own once payments land — no second migration.
- Refund policy wording assumes money reaches the charity. Revisit alongside the above.

---

## Trust and safety

### Host picture upload was removed, not built
`/create` used to offer "Picture if applicable" but only captured the filename and discarded
the file. It was removed rather than left misleading.

**Build moderation before upload, not after.** The admin review panel already renders
`picture_url` whenever it's set, so the review half exists. What's missing: a storage bucket,
a session-gated upload endpoint with an ownership check, and wiring into `/create`. Because
approval already gates publication, nothing would go public unseen.

### `flagged` has no reason column
An admin can flag a celebration but cannot say why, so a rejection email would be useless.
Needs a `flag_reason` column before rejection mail is worth sending.

### Mobile numbers are format-checked, not owned
Validation enforces real Indian mobile shape (10 digits starting 6–9, or `+<country code>`),
which stops typos and lazy junk. **It cannot prove the number belongs to the person.** Only an
OTP does. `verifications.channel` already accepts `'mobile'`, so this is wiring an SMS
provider — no schema or route changes. This is the real answer if an auditable trail is the goal.

---

## Missing features

### Hosts cannot see contributions privately
`GET /me/contributions` filters on `donor_id` — a user's *own* giving, not contributions to
their celebration. A host sees contributors on the public page, but has **no private view with
amounts**. There is no endpoint for it.

This is also why the per-contribution host email existed. It was removed as noisy; if hosts
ask to be told, add a **daily digest behind a cron trigger** rather than reinstating one email
per contribution.

### Reminder emails
"Your celebration ends soon" needs a Cloudflare cron trigger. `celebrations.active_till`
already exists, so the data is there.

---

## Technical debt

- **`images.unoptimized` is set** in `next.config.ts`, so every image ships at its intrinsic
  size with no resizing at build or request time. Fine at current volume; compress before
  adding many more.
- **`senior-care.jpg` has a sparkle glyph** bottom-right that looks like a generator
  watermark, and signage text in the homepage images is garbled in places. Invisible at strip
  size, visible full-width.
- **`ALLOWED_ORIGIN` and `SITE_URL` still include `gifthappiness.pages.dev`.** Harmless, and
  useful as a fallback; drop the Pages origin once the custom domain has been stable a while.
- **Canonical URLs / SEO metadata** were deferred until the production domain was final. It
  now is (`gifthappiness.org`), so this can proceed — see `docs/plan.md` "SEO Plan".
- **No pagination on `GET /celebrations`.** Deliberate — the table is small. Revisit when the
  list is long enough to matter.

---

## Watch out for

- **Stale local DNS caches lie.** After the domain cutover the apex appeared to still serve
  GoDaddy for a long time; it was macOS's resolver cache, not a misconfiguration. Diagnose with
  `dig @1.1.1.1 <host>` and `curl --resolve <host>:443:<ip>`, never from browser behaviour
  alone. Flush with `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`.
- **Resend accepts and silently drops** mail from an unverified sending domain, returning HTTP
  200. Error logging cannot catch this class of failure — only domain verification can. This is
  what caused "only I get emails".
- **`CREATE OR REPLACE VIEW` can only append columns**, never insert one mid-list (error
  42P16). Add new view columns at the end.
