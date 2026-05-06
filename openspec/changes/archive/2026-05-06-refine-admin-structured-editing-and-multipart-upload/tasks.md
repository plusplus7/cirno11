## 1. Multipart Photo Upload

- [x] 1.1 Add a route-local multipart parsing dependency and TypeScript types if needed.
- [x] 1.2 Update `POST /api/photos/upload` to accept a `photo` multipart file, validate presence/type/size, and pass the uploaded buffer to `MediaStorage`.
- [x] 1.3 Preserve the existing upload response fields for original and thumbnail references.
- [x] 1.4 Update server error handling so multipart parser failures return useful API errors instead of generic 500 responses.
- [x] 1.5 Update the client API helper so JSON requests keep `Content-Type: application/json` while multipart uploads let the browser set the boundary.
- [x] 1.6 Update `PhotoManager` to submit the selected `File` through `FormData` and remove base64 `FileReader` upload logic.

## 2. Admin Post Workspace

- [x] 2.1 Add admin header actions with a button that navigates to the public homepage.
- [x] 2.2 Update the post workspace state to support hiding and showing the post library without clearing the current draft.
- [x] 2.3 Rework the post workspace layout so Markdown editor and preview are equal-width columns on desktop.
- [x] 2.4 Move the post library to the far right and keep a visible one-click show/hide control with post count.
- [x] 2.5 Verify the post workspace remains single-column and non-overlapping on narrow viewports.

## 3. Structured Metadata Lists

- [x] 3.1 Create a reusable structured list/editor shell for array-like admin metadata.
- [x] 3.2 Replace the photo metadata JSON panel with a list that renders thumbnail, title, date/location context, and delete controls.
- [x] 3.3 Persist photo deletions through the existing `savePhotos` API.
- [x] 3.4 Replace the lab JSON panel with a structured list that renders image, name, kind, enabled state, and target URL or route.
- [x] 3.5 Add a lab item form that creates valid external and internal `LabTool` entries.
- [x] 3.6 Persist lab additions and deletions through the existing `saveLab` API and keep server validation intact.

## 4. Styling And Documentation

- [x] 4.1 Update admin CSS for header actions, equal editor/preview columns, collapsible right-side library, and structured metadata rows.
- [x] 4.2 Update responsive CSS so photo and lab lists remain usable on mobile-width screens.
- [x] 4.3 Update deploy notes with the multipart upload size limit and required nginx `client_max_body_size` alignment.
- [x] 4.4 Update QA notes with manual checks for >20MB photo upload, admin homepage navigation, post library show/hide, photo deletion, and lab add/delete.

## 5. Verification

- [x] 5.1 Add or update API tests for multipart photo upload response shape and missing-file failure.
- [x] 5.2 Add focused tests or manual verification notes for photo list deletion and lab add/delete persistence.
- [x] 5.3 Run `npm run check`.
- [x] 5.4 Run `npm test`.
- [x] 5.5 Run `npm run build:static`.
- [ ] 5.6 Manually inspect `/plusplus7_admin_portal` on desktop and mobile widths for the updated admin workflows.
