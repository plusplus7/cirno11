# QA Notes

## Automated Checks

- `npm run check`
- `npm test`
- `npm run build:static`

## Manual Checks

- Open `/blog` and confirm published posts are sorted newest first.
- Confirm unpublished drafts do not appear in `/blog` or `/blog/:slug`.
- Open `/photos` and confirm photo date grouping and location labels.
- Open `/lab` and confirm external and internal panels navigate correctly.
- Open `/plusplus7_admin_portal`, sign in, save a draft, confirm Markdown previews live while editing, and trigger publish.
- Stop a build midway or force a missing `index.html` and confirm the previous release remains active.
