## Why

The admin workspace still exposes photo and lab metadata as raw JSON, which makes routine deletion and item creation unnecessarily fragile. Photo upload also sends base64 inside JSON, so images around 20MB can inflate past the current request body limit and fail with `413 Request Entity Too Large`.

## What Changes

- Replace JSON-body photo uploads with `multipart/form-data` so the browser submits the selected image file directly.
- Keep the existing photo upload response shape with original and thumbnail media references.
- Refine the post editor workspace so Markdown editing and preview use equal-width columns, while the post library moves to a right-side panel that can be hidden and shown.
- Add an admin header action that returns directly to the public blog homepage.
- Replace photo metadata JSON editing with a structured list that shows thumbnails, photo titles, and delete controls.
- Replace lab metadata JSON editing with the same structured list pattern, including delete controls and a form for adding new lab items.
- Document deploy-facing upload size expectations so nginx and Express limits do not drift.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `admin-content-management`: Admin photo uploads use multipart file transfer, and photo/lab metadata management uses structured list controls instead of raw JSON editing for routine item operations.
- `static-publish-deploy`: Deployment guidance must account for larger multipart photo uploads passing through the nginx proxy to Express.

## Impact

- Frontend admin upload code changes from base64 `FileReader` JSON payloads to `FormData`.
- Client API upload helper changes request headers for multipart requests while preserving JSON requests elsewhere.
- Backend `/api/photos/upload` gains multipart parsing middleware and no longer depends on `express.json` for image bytes.
- A multipart dependency such as `multer` may be added.
- Admin React layout and CSS change for equal editor/preview columns, a collapsible post library, structured photo/lab item lists, and a public-home navigation action.
- QA should cover >20MB upload behavior, photo thumbnail/original response fields, list delete flows, lab add/delete flows, and the admin homepage action.
