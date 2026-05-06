## Why

The owner admin experience still exposes a guessable `/admin` entry point from the public footer, gives no visible feedback when sign-in fails, and requires an explicit preview action while writing Markdown. These details make the private workflow noisier than it needs to be and make the admin route easier for crawlers or scanners to discover.

## What Changes

- Move the owner admin screen from `/admin` to `/plusplus7_admin_portal`.
- Remove the visible public-site Admin entry link so public visitors are not shown the private route.
- Show a clear sign-in error when the admin password is rejected.
- Replace the article library card-style list with a compact title-only list plus a delete action.
- Update Markdown preview automatically while the owner edits the post body.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `admin-content-management`: Update admin route presentation, authentication feedback, post list density, and Markdown preview behavior.

## Impact

- Affects `src/client/App.tsx` routing, public footer markup, admin login state, post list markup, and Markdown preview effects.
- Affects `src/client/styles/app.css` admin login, compact post list, and preview state styling.
- Affects admin-related OpenSpec requirements and QA/SRE documentation that currently reference `/admin`.
- Keeps admin API paths under `/api/*`, session cookies, content contracts, and publishing behavior unchanged.
