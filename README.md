# GiftHappiness

A charity-first celebration platform. A host creates a celebration page — birthday, wedding,
anniversary — and invites guests to contribute to a vetted charity instead of giving gifts.

Live at **https://gifthappiness.org**

## Documentation

All project documentation lives in `docs/`:

| File | What it is |
| --- | --- |
| [`docs/open-items.md`](docs/open-items.md) | **Known gaps and deferred decisions. Read this first.** |
| [`docs/plan.md`](docs/plan.md) | Phased roadmap and decision log — why things are the way they are |
| [`docs/changelog.md`](docs/changelog.md) | Append-only log of every change |
| [`docs/master_docs.md`](docs/master_docs.md) | Original product brief |
| [`docs/content_dump.md`](docs/content_dump.md) | Source content and form requirements |

## Architecture

- **Frontend** — Next.js static export (`output: 'export'`) on Cloudflare Pages, git-connected
  to `main`. Merging to `main` triggers a rebuild.
- **Backend** — a Cloudflare Worker in `workers/`, hand-rolled routing in `workers/src/index.ts`.
- **Database and file storage** — Supabase Postgres. Base tables have RLS with no anon policies:
  only the Worker (service role) reads and writes them. Browsers read through `*_public` views.
- **Email** — Resend, sending from the verified subdomain `mail.gifthappiness.org`.

Dynamic routes (`/charities/[slug]`, `/celebration/[slug]`) can't be pre-rendered because the
rows are created at runtime. Each builds a single `_shell` page, and `public/_redirects`
rewrites to it with a 200 so the browser keeps the real slug.

## Local development

```bash
npm install
npm run dev          # frontend on :3000
npm run lint
npm run build        # also verifies the static export

cd workers
npx tsc --noEmit     # typecheck the Worker
npx wrangler dev     # Worker locally
```

Local dev needs `ALLOWED_ORIGIN` to include `http://localhost:3000`. It's a comma-separated
list in `workers/wrangler.toml`, so add the origin rather than replacing what's there.

## Deploying

**Frontend** deploys itself — merging to `main` triggers a Cloudflare Pages rebuild.

**The Worker does not.** After merging any change under `workers/`:

```bash
cd workers && npx wrangler deploy
```

Run database migrations **before** deploying a Worker that depends on them.

## Operations

### Making someone an admin

Admins can approve, edit and delete celebrations and charities through `/admin`. There is no UI
for granting admin — do it in the Supabase SQL editor.

The person must have signed in at least once, which creates their `users` row. Requesting a
sign-in code is enough; they don't have to complete it.

```sql
-- 1. Find them. Emails are stored lowercase.
select id, name, email, is_admin, created_at
from users
order by created_at desc
limit 20;

-- 2. Grant admin. RETURNING is the point here: if this comes back with
--    zero rows, the email doesn't exist -- a typo, or they haven't
--    signed in yet. It will NOT tell you that any other way.
update users
set is_admin = true
where email = 'person@example.com'
returning id, name, email, is_admin;

-- 3. Confirm who currently has admin.
select email, name, is_admin from users where is_admin = true order by email;
```

To revoke:

```sql
update users
set is_admin = false
where email = 'person@example.com'
returning email, is_admin;
```

Two things to know:

- **Admins receive email.** Every user with `is_admin = true` is notified whenever a celebration
  is submitted for review. That's the point — approval is a human bottleneck — but it means
  granting admin also subscribes them.
- **Admin is powerful.** It allows deleting charities and celebrations. Grant it only to people
  who should have that.

### Running a migration

`supabase/schema.sql` is the source of truth for the schema. To apply a change to the live
project:

```bash
supabase link --project-ref fsradcbnqocpvxqwizdt
supabase db query --linked --file <migration.sql>
```

Write the rollback SQL before running the migration, and capture the current definition of
anything you're replacing.

## Contributing

See `AGENTS.md`. In short: work on feature branches, commit through `scripts/committer`, keep
`docs/changelog.md` updated, and run `npm run lint`, `npm run build` and `npx tsc --noEmit`
(in `workers/`) before committing.
