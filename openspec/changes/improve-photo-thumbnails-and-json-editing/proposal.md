## Why

The photography page currently uses the uploaded image URL directly for gallery display, so browsing the list can load full-size originals and offers no focused way to inspect a photo. The admin JSON metadata areas also behave like plain textareas, making lab metadata edits fragile when JSON is malformed.

## What Changes

- Preserve uploaded photography originals and generate a separate compressed thumbnail during upload.
- Store both the original image URL and thumbnail URL in photography metadata.
- Render the public photography list from thumbnails only.
- Let visitors click a photo to open a modal/lightbox that displays the original image without exceeding the browser viewport.
- Improve the reusable admin JSON editor so Lab Metadata, Photo Metadata, and similar metadata panels support safer editing with JSON validation feedback and formatting.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `admin-content-management`: Photo upload now produces both original and thumbnail references, and JSON metadata editing provides validation-oriented editor behavior.
- `github-content-store`: Photography metadata must persist local media references for both original images and generated thumbnails.
- `public-personal-site`: The public photography gallery must display thumbnails in the list and show the original image in a viewport-constrained modal when selected.

## Impact

- Backend media storage will need image processing support, likely through a new dependency such as `sharp`.
- `POST /api/photos/upload` response shape will expand to include a thumbnail URL/path while preserving existing original URL/path fields.
- Existing photo metadata remains compatible through fallback behavior when `thumbnailUrl` is missing.
- Public React photography rendering and CSS will add modal/lightbox behavior.
- Admin React JSON metadata editor will gain validation and formatting states.
