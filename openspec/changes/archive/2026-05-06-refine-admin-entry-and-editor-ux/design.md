## Context

The React application currently routes admin screens when the browser path starts with `/admin`, and the public footer contains an `Admin` button that navigates there. The admin API is mounted separately under `/api` and already enforces owner-only access through the session cookie, so the route change is a presentation and discoverability improvement rather than an authentication boundary.

The admin editor currently renders a focused workspace, but the post list is still visually heavier than requested, login failures are only surfaced as rejected promises, and Markdown preview requires clicking a button.

## Goals / Non-Goals

**Goals:**

- Make `/plusplus7_admin_portal` the admin UI route.
- Remove public navigation to the admin UI.
- Preserve existing owner-only API authorization and session behavior.
- Surface failed password login in the sign-in UI.
- Make the post library compact: title selection plus delete action.
- Generate Markdown preview automatically as the post body changes.

**Non-Goals:**

- Do not rename `/api/*` admin API endpoints.
- Do not treat the obscure route as the security boundary.
- Do not change content storage, Markdown serialization, media upload, or publish contracts.
- Do not add a new frontend routing library.

## Decisions

### Use a single admin route constant in the React app

The frontend should define one canonical admin route value and use it for the route guard. This keeps future references aligned and avoids leaving stale `/admin` strings in app code.

Alternative considered: support both `/admin` and `/plusplus7_admin_portal`. That would be more forgiving for bookmarks, but it preserves the old discoverable route and weakens the intent of the change.

### Remove public admin navigation instead of hiding it with CSS

The footer `Admin` button should be removed from the public DOM. CSS hiding would still expose a navigable element in markup and would be easier to regress.

Alternative considered: keep a hidden keyboard shortcut or link. That adds undocumented behavior and still places the route in client code paths that public users can discover through the UI.

### Keep API authentication unchanged

The route name only reduces accidental discovery. The Express `/api` router remains the actual protection mechanism, with unauthenticated calls rejected by the existing middleware and invalid login rejected by the login endpoint.

Alternative considered: move admin APIs under the new route prefix. That would increase nginx and client churn without improving authorization, because crawlers can still discover API paths.

### Debounce server-rendered Markdown preview

The editor should call the existing preview API after short pauses while the Markdown body changes. This preserves the server renderer and sanitizer as the source of truth while making preview feel live.

Alternative considered: render Markdown in the browser. That risks diverging from public rendering and would add or duplicate sanitization logic.

## Risks / Trade-offs

- Old bookmarks to `/admin` stop working -> Document the new owner URL in QA/SRE notes and intentionally avoid backward compatibility.
- Route obscurity may be mistaken for security -> Keep specs and docs clear that `/api/*` authorization remains mandatory.
- Live preview can produce excess API calls -> Debounce requests and ignore stale responses when the body changes quickly.
- Preview failures could make the editor feel broken -> Show a lightweight preview error while preserving the editable Markdown body.
- Compact post rows may hide useful metadata -> Use the title as the primary label and fall back to slug only when title is empty.
