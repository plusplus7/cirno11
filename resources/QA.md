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
- In `/plusplus7_admin_portal`, confirm the header action returns to `/`, the post library can be hidden and shown, and the editor/preview columns remain usable on desktop and mobile-width layouts.
- In photo management, upload a photo larger than 20MB but smaller than 100MB, confirm no `413` occurs, and confirm original and thumbnail references are saved.
- In photo management, delete a photo metadata row and confirm the list persists after reload.
- In lab management, add external and internal items through the form, delete an item, and confirm the list persists after reload.
- Stop a build midway or force a missing `index.html` and confirm the previous release remains active.
