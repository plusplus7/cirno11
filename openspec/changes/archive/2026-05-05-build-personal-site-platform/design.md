## Context

The platform is a personal website with a public static experience and a private owner-only admin experience. Public visitors need blog, photography, and lab pages. The owner needs to manage Markdown posts, photography metadata and images, and lab entries from the same React application under `/admin`.

The frontend will use Rsbuild, React, and TypeScript. The backend will use Express and TypeScript. Public pages are generated at build time and hosted by nginx. Blog Markdown files and structured metadata are stored in GitHub so content changes have a durable commit history. Photography image files are stored on the server local filesystem in the first version, with a storage boundary that can later support S3-compatible storage.

## Goals / Non-Goals

**Goals:**

- Provide public routes for blog posts, photography, and lab tools.
- Provide owner-only admin routes for CRUD operations.
- Support Markdown draft editing with side-by-side or toggled preview.
- Store posts and content metadata in GitHub.
- Store photography images locally on the server for the first version.
- Generate public pages at build time so the public site does not depend on runtime API availability.
- Deploy generated releases behind nginx with a rollback-friendly layout.

**Non-Goals:**

- Multi-user collaboration, roles, or permissions beyond a single owner.
- Comments, likes, analytics, search indexing, newsletters, or RSS in the first version.
- WYSIWYG or block-based editing.
- Direct S3 implementation in the first version.
- Database-backed CMS storage in the first version.

## Decisions

### Use one React application for public and admin routes

The frontend will be a single Rsbuild React TypeScript application with public routes and admin routes. Admin screens live under `/admin` and call the Express backend for authenticated operations.

Alternatives considered:

- Separate public and admin apps: cleaner deployment isolation, but more setup and duplicated design/runtime wiring for the first version.
- Backend-rendered admin: simpler frontend routing, but inconsistent with the requested React frontend and less reusable for preview rendering.

### Use Express TypeScript as the backend API

The backend will expose owner-only APIs for authentication, post CRUD, photo CRUD, lab CRUD, preview rendering, media upload, and publish/build triggering.

Alternatives considered:

- Go backend: strong deployment profile, but the user chose Express.
- Serverless functions: easy for small APIs, but local media storage and build job orchestration are simpler in a long-running server process.

### Use GitHub as the source for text content and structured metadata

The content repository stores:

```text
posts/
  <date>-<slug>.md
data/
  photos.json
  lab.json
media-manifest.json
```

Posts use Markdown with frontmatter fields including title, slug, date, tags, summary, cover, and published state. Photography and lab data are JSON documents committed to GitHub through the backend.

Alternatives considered:

- Database as primary store: better for complex admin workflows, but adds operational cost and weakens the Git-first content history.
- GitHub for all media files: simple conceptually, but unsuitable for large photography originals and future growth.

### Use local media storage behind an interface

Photography image uploads are written to a configured local directory on the server. Metadata committed to GitHub references public media URLs or stable media IDs. The backend owns a `MediaStorage` boundary so a future S3 implementation can replace local storage without changing admin or public data contracts.

Alternatives considered:

- Upload directly to S3 now: better long-term storage, but explicitly deferred.
- Store image binaries in GitHub: increases repository size and makes high-resolution photo management awkward.

### Generate public pages at build time

The public site reads GitHub content and media metadata during build. Public blog lists, post pages, photography pages, and lab pages include only published content. Draft content is available only through admin preview APIs.

Alternatives considered:

- Runtime API reads for public pages: simpler publishing, but makes the public site dependent on backend uptime and loses the static-hosting benefit.
- Fully static admin: cannot perform authenticated CRUD or media upload.

### Publish with immutable release directories

Publishing creates a new static release directory, verifies required generated files, and then switches nginx to serve the new release through a `current` symlink or equivalent atomic pointer:

```text
releases/
  20260505-120001/
  20260505-123012/
current -> releases/20260505-123012
```

If build or verification fails, nginx continues serving the previous release.

Alternatives considered:

- Build directly into the nginx-served directory: fewer moving parts, but failed or partial builds can break the public site.
- Rely only on external CI: useful later, but the first version needs an owner-triggered publish path from admin.

### Use simple owner-only authentication

The first version will support a single-owner admin model. Implementation can use GitHub OAuth allowlisting or password login with an HTTP-only session cookie, but all admin APIs must reject unauthenticated requests.

Alternatives considered:

- Role-based access control: unnecessary for a personal site.
- No auth behind private network only: too fragile once nginx exposes routes.

## Risks / Trade-offs

- GitHub commit conflicts or API failures can interrupt saves → The backend should read latest content before writes, return clear conflict errors, and keep failed operations from mutating local release state.
- Build jobs can be slow or fail → Publish must be asynchronous or visibly pending in admin, and release switching must happen only after verification.
- Local media files are not versioned with GitHub metadata → The backend should maintain stable media IDs and avoid deleting media files until metadata updates succeed.
- Drafts stored in GitHub are visible to anyone with repository access → Use a private content repository if drafts are sensitive.
- Static public pages can become stale after content updates → Only publish actions update the public release; save-draft actions do not.
- Markdown rendering can introduce XSS risk → The preview and public renderer must sanitize or restrict generated HTML.
