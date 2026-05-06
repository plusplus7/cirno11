## Context

The current platform stores photography image binaries on the local filesystem through `MediaStorage`, while GitHub-backed metadata stores the photo records used by both admin and public builds. `POST /api/photos/upload` stores the uploaded image and returns a single URL/path. The admin `PhotoManager` then writes that same URL into both `imageUrl` and `thumbnailUrl`, and the public `/photos` route renders `thumbnailUrl ?? imageUrl`.

The desired behavior keeps the uploaded original available for user inspection while introducing an automatically generated, compressed thumbnail for list rendering. The admin metadata editor is currently a reusable JSON textarea that saves with a raw `JSON.parse`; this should become safer for Lab Metadata and other JSON panels.

## Goals / Non-Goals

**Goals:**

- Preserve original uploaded photo files without overwriting them.
- Generate a separate thumbnail asset at upload time.
- Persist both original and thumbnail media references in photo metadata.
- Load thumbnails in the public gallery list and load originals only in the modal/lightbox.
- Constrain modal original display to the current browser viewport.
- Improve the reusable JSON editor with validation feedback and formatting for Lab Metadata, Photo Metadata, and About Profile.
- Keep existing photo records functional when `thumbnailUrl` is missing.

**Non-Goals:**

- Bulk migration or offline regeneration of thumbnails for all existing media.
- Deleting original media when thumbnails are deleted, or implementing full media garbage collection.
- Replacing the local filesystem media backend with object storage.
- Introducing a schema-specific form editor for lab tools in this change.
- Changing public routing or requiring visitors to authenticate to view originals.

## Decisions

### Preserve originals and generate derived thumbnails

`LocalMediaStorage.storePhoto` should write the original file as it does today, then use image processing to create a derived thumbnail under a stable thumbnail path such as `photos/thumbnails/<id>.webp`. The upload response should continue returning `id`, `url`, and `path` for the original, and add thumbnail fields such as `thumbnailUrl` and `thumbnailPath`.

Alternative considered: compress and overwrite the uploaded file. This saves storage but violates the requirement that users can click and view the original.

### Use `sharp` for image processing

Use `sharp` to resize the thumbnail to a bounded dimension and encode it as compressed WebP. This keeps the thumbnail small regardless of uploaded original format and avoids hand-rolled image handling.

Alternative considered: browser-side thumbnail generation before upload. That reduces server work but makes the client responsible for media integrity and does not help with future API clients or server-side media workflows.

### Keep metadata backward compatible

`PhotoEntry.thumbnailUrl` remains optional. New uploads should populate it with the generated thumbnail URL. Public rendering should continue to fall back to `imageUrl` for older records without thumbnails.

Alternative considered: require every photo entry to have a thumbnail URL. This would force a migration before old photos can render safely.

### Implement the modal in the public React page

The public `Photos` component should keep local selected-photo state. Photo cards should be interactive controls that open a modal using the original `imageUrl`. The modal image should use CSS constraints such as viewport-relative `max-width`, `max-height`, and `object-fit: contain`.

Alternative considered: navigate to a dedicated photo detail route. A modal is lower scope and matches the requested interaction.

### Upgrade the reusable JSON editor rather than only Lab Metadata

The current `JsonManager` is shared by Lab Metadata, Photo Metadata, and About Profile. Improving it once gives Lab Metadata the requested editor behavior without creating divergent editor implementations. The editor should format JSON on demand, prevent invalid JSON saves, and show parse errors inline.

Alternative considered: create a separate Lab-only editor. This would leave the same fragility in the other admin metadata panels.

## Risks / Trade-offs

- Large base64 uploads may exceed the current JSON body limit → Keep existing behavior for this change unless implementation reveals immediate failure, and consider multipart upload as a follow-up.
- `sharp` adds a native dependency → Verify install/build in the target environment and document deployment implications if needed.
- Existing photos without thumbnails still load originals in the list → Fallback preserves compatibility, and a later migration can regenerate missing thumbnails.
- Thumbnail generation can fail after original storage succeeds → Treat upload as failed unless both original and thumbnail are available, or return a clear server error so metadata is not saved with an incomplete record.
- Modal accessibility can regress keyboard users → Include Escape-to-close, backdrop close, and descriptive image alt text in implementation tasks.
