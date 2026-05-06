## 1. Media Upload Pipeline

- [x] 1.1 Add an image processing dependency and verify TypeScript/build compatibility.
- [x] 1.2 Extend the media storage contract and stored media type to include thumbnail path and URL for uploaded photos.
- [x] 1.3 Update local photo storage to preserve the original upload and generate a compressed thumbnail asset under a stable thumbnail path.
- [x] 1.4 Update the photo upload API response and client API type to return original and thumbnail media references.
- [x] 1.5 Ensure upload failure handling does not save photo metadata when thumbnail generation fails.

## 2. Admin Photo Metadata Flow

- [x] 2.1 Update `PhotoManager` to save `imageUrl` from the original upload URL and `thumbnailUrl` from the generated thumbnail URL.
- [x] 2.2 Keep existing photo metadata compatible when a record has no thumbnail URL.
- [x] 2.3 Add focused tests for upload response shape or media storage behavior covering original and thumbnail references.

## 3. Public Photography Modal

- [x] 3.1 Update the photography gallery list so cards render thumbnails and expose an accessible click target for opening the photo.
- [x] 3.2 Add selected-photo state and modal/lightbox rendering that displays the original `imageUrl`.
- [x] 3.3 Add responsive modal styles that constrain the original image within the browser viewport using contain behavior.
- [x] 3.4 Support closing the modal through a visible close action, backdrop interaction, and Escape key.
- [x] 3.5 Verify legacy entries without `thumbnailUrl` still render using `imageUrl` fallback.

## 4. JSON Metadata Editor

- [x] 4.1 Upgrade the reusable JSON manager to track parse errors and prevent saving invalid JSON.
- [x] 4.2 Add a format action that pretty-prints valid JSON without changing the underlying data.
- [x] 4.3 Apply the improved JSON editing behavior to Lab Metadata, Photo Metadata, and About Profile panels.
- [x] 4.4 Style validation feedback and editor actions so they remain usable in compact and full-width admin panels.

## 5. Verification

- [x] 5.1 Run TypeScript checks and the test suite.
- [x] 5.2 Build the static site to confirm generated public data and frontend compilation still work.
- [x] 5.3 Manually inspect `/photos` on desktop and mobile widths for thumbnail list rendering and original-image modal sizing.
- [x] 5.4 Manually inspect `/admin` JSON metadata editing with valid and invalid Lab Metadata JSON.
