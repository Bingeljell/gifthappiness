# Repo Guidelines

## Project Context

GiftHappiness is a charity-first celebration project. The current implementation is a static Next.js site deployed to Cloudflare. For now, build static front-end pages and forms that do not submit data anywhere unless the user explicitly approves a backend or third-party integration.

## Next.js Guidance

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Documentation

- All project documentation lives in `docs/`.
- Treat `docs/content_dump.md` as the source for current content and form requirements until the user provides a newer source.
- Keep `docs/plan.md` updated as product decisions are made and implementation work progresses.
- Update `docs/changelog.md` after changes when that file exists. Use this format:
  - `Date > File name > methods or functions > what the change does`
- If `docs/changelog.md` does not exist, ask the user before creating it.

## Working Style

- Plan before executing implementation work.
- Act as a senior technical architect: clarify the end objective of a feature, call out risks, and push back on decisions that look costly or brittle.
- Before installing dependencies or creating additional files, get user permission and explain why they are needed.
- Do not delete database files.
- Prefer small, reversible changes.
- Run available checks before committing, such as `npm run lint`, `npm run build`, or project-specific tests.

## Git Workflow

- Follow `docs/git_workflow.md` when it exists.
- Work on feature or fix branches by default.
- Do not commit directly to `main` or `master` unless explicitly instructed.
- Keep commits small and logical.
- Use reversible git commands. Do not use destructive commands unless the user explicitly requests them.

## Commit Workflow

Always commit and push through `scripts/committer`. Do not use direct `git add` or `git commit` unless explicitly asked.

Standard commit format:

```bash
scripts/committer "commit message" "<file1>" "<file2>" ...
```

If committing to `main` or `master` is explicitly requested:

```bash
scripts/committer --allow-main "commit message" "<file1>" ...
```

The helper intentionally stages only the listed files, refuses `.` and `node_modules`, and blocks direct commits to `main` or `master` unless `--allow-main` is supplied.
