## 1. Data Model and Storage

- [x] 1.1 Add a shared `FriendLink` type, `SiteData.friendLinks`, and an `isFriendLinkArray` validator.
- [x] 1.2 Extend the `ContentStore` interface with `listFriendLinks()` and `saveFriendLinks()`.
- [x] 1.3 Implement local file storage for `content/data/friend-links.json` with an empty-array fallback.
- [x] 1.4 Implement GitHub content storage for `data/friend-links.json` with read fallback and write commit messages.

## 2. Admin API and Client

- [x] 2.1 Add owner-only `GET /api/friend-links` and `PUT /api/friend-links` routes.
- [x] 2.2 Validate friend-link request bodies before saving and return a clear 400 error for invalid arrays.
- [x] 2.3 Add frontend API helpers for reading and saving friend links.
- [x] 2.4 Load friend links alongside posts, photos, lab tools, about content, and publish status after admin authentication.

## 3. Admin UI

- [x] 3.1 Add a friend-link admin tab or panel labeled for 友情链接.
- [x] 3.2 Build structured add controls for display name, avatar icon URL, destination URL, and public visibility.
- [x] 3.3 Render existing friend links in a structured list with icon preview, name, URL, visibility state, and delete action.
- [x] 3.4 Persist add/delete operations through the friend-link API and show success feedback.
- [x] 3.5 Verify the friend-link management layout remains usable on mobile-width admin screens.

## 4. Public Rendering and Static Data

- [x] 4.1 Include enabled friend links in `scripts/generate-public-data.ts` output.
- [x] 4.2 Render a friend-link section in the non-home public aside using generated `SiteData.friendLinks`.
- [x] 4.3 Style friend-link rows with avatar-sized icons, readable names, safe external anchors, and responsive spacing.
- [x] 4.4 Keep the aside visually intact when no enabled friend links exist.

## 5. Tests and Verification

- [x] 5.1 Add unit coverage for valid and invalid friend-link metadata validation.
- [x] 5.2 Add content-store or GitHub-store coverage for friend-link read/write behavior where existing tests have matching patterns.
- [x] 5.3 Run `npm run check`.
- [x] 5.4 Run `npm test`.
- [x] 5.5 Run `npm run build:static`.
- [x] 5.6 Manually verify `/blog` or another non-home public route renders enabled friend links and hides disabled links.
- [x] 5.7 Manually verify `/plusplus7_admin_portal` can add and delete friend links and persists the list after reload.
