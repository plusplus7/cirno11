## Context

The admin app currently keeps most content operations in `src/client/App.tsx` with a small API wrapper in `src/client/api.ts`. Photo uploads are serialized as a base64 data URL inside JSON and posted to `/api/photos/upload`; Express parses the entire request through `express.json({ limit: '25mb' })` before the route decodes the image and passes a `Buffer` to `MediaStorage`.

That design worked for small images, but a 20MB file expands by roughly one third when base64 encoded, which can push the JSON body past the configured limit and produce `413 Request Entity Too Large`. The previous thumbnail work already separates original and thumbnail references, so the upload contract should preserve the response shape while changing the request transport.

The admin UI also still uses a generic JSON textarea for photo and lab metadata. This is useful as a low-level fallback, but the owner workflow now needs routine list actions: see photo thumbnails and titles, delete photos, delete lab items, and add lab items through form fields.

## Goals / Non-Goals

**Goals:**

- Send photo uploads as `multipart/form-data` with the selected file as a real file part.
- Preserve the existing upload response fields: `id`, `url`, `path`, `thumbnailUrl`, and `thumbnailPath`.
- Keep upload authentication and media storage behavior owner-only and compatible with current thumbnail generation.
- Make the post editor and live preview equal-width working columns.
- Move the post library to the right side of the post workspace and make it hideable/showable without losing the current draft.
- Add an authenticated admin header action that navigates to the public blog homepage.
- Introduce one reusable structured list editor pattern for photo metadata and lab metadata.
- Let photo management show thumbnails and titles and delete photo entries without editing raw JSON.
- Let lab management add and delete lab entries through fields matching the existing `LabTool` schema.
- Update deploy/QA guidance for multipart upload size limits.

**Non-Goals:**

- Replacing local media storage with object storage.
- Implementing chunked or resumable uploads.
- Adding media garbage collection for orphaned original or thumbnail files.
- Changing the public photo gallery or lab page presentation beyond data compatibility.
- Adding arbitrary JSON schema editing for every possible content type.
- Changing the owner authentication model or admin route path.

## Decisions

### Use multipart upload for image bytes

`api.uploadPhoto` should build a `FormData` payload with a `photo` file part and any needed scalar fields. The generic JSON `request` helper should not force `Content-Type: application/json` for multipart requests; the browser must set the multipart boundary.

Alternative considered: raise `express.json` to a larger limit and keep base64 JSON. That is less code, but it keeps the 33% base64 overhead and leaves large binary payloads flowing through JSON parsing.

### Parse multipart only on the upload route

The Express app should keep JSON parsing for normal admin APIs and add multipart parsing only for `POST /api/photos/upload`, likely through `multer` memory storage with a configured file-size limit. The route should validate that a file was provided, derive filename/content type from the uploaded file, and call `mediaStorage.storePhoto` with the file buffer.

Alternative considered: add app-wide multipart middleware. Route-local parsing is narrower and avoids changing semantics for JSON endpoints.

### Preserve response compatibility

The upload response shape should remain unchanged so `PhotoManager` can still create `PhotoEntry` objects from `uploaded.url` and `uploaded.thumbnailUrl`. The request body is the only API contract that changes.

Alternative considered: return a full `PhotoEntry` from the upload endpoint. That would mix media storage with metadata persistence and make the current `savePhotos` flow less explicit.

### Build one reusable item-list editor pattern

Photo and lab metadata should share a reusable list editor shell that accepts item rendering and actions, while type-specific forms handle schema details. Photos need thumbnail/title/date/location display and delete. Lab tools need thumbnail/name/kind/enabled/target display, delete, and an add form that creates valid `external` or `internal` entries.

Alternative considered: create separate custom panels with duplicated list markup. Shared structure keeps row density, delete affordances, empty states, and responsive behavior consistent.

### Keep raw JSON editing out of the routine path

The structured list is the primary admin workflow for photos and lab tools. If raw JSON remains available, it should be a secondary fallback rather than the visible default for these panels.

Alternative considered: keep JSON visible below the list. That preserves escape-hatch power but would keep the page visually noisy and undermine the requested list workflow.

### Treat the post library as a right-side drawer

The post workspace should have equal editor/preview columns and a compact library panel on the far right. A local UI state can hide or show the library without changing loaded posts, the selected draft, or save behavior.

Alternative considered: put the library between editor and preview. The user specifically wants the list on the far right, and keeping editor plus preview adjacent makes writing and review easier.

## Risks / Trade-offs

- Multipart parser memory pressure for large photos -> Set an explicit file-size limit, keep it high enough for intended original uploads, and surface parser errors as useful API failures.
- nginx may still reject large requests before Express sees them -> Update deploy guidance and QA to verify proxy size settings alongside Express limits.
- Upload route request contract changes -> Update the client helper and any upload tests together; preserve response shape to limit downstream churn.
- Deleting photo metadata may leave media files on disk -> Keep this as existing behavior unless media garbage collection is separately scoped.
- Structured list forms can drift from shared TypeScript types -> Use existing `PhotoEntry` and `LabTool` types and keep server validation for lab arrays.
- Collapsible post library can hurt discoverability -> Keep a visible toggle with item count so the owner can restore the library in one click.

## Migration Plan

1. Add multipart parsing dependency and update server upload route while preserving response fields.
2. Update the admin API client and `PhotoManager` to submit `FormData`.
3. Replace photo and lab JSON panels with structured list workflows.
4. Refine post workspace layout and add the admin homepage action.
5. Update QA and deploy notes for multipart upload verification and nginx body-size settings.
6. Rollback can restore the previous JSON upload route and `FileReader` client path if multipart parsing fails before deployment.

## Open Questions

- What maximum single-photo upload size should be enforced in Express and documented for nginx? A practical default such as 100MB should be chosen unless production storage constraints require less.
- Should raw JSON editing remain as a hidden advanced fallback for photos and lab tools, or be removed entirely from those tabs?
