## 1. Project Setup

- [x] 1.1 Create frontend and backend TypeScript project structure for a separated React/Rsbuild app and Express API.
- [x] 1.2 Add shared type definitions for posts, photos, lab tools, publish jobs, and API responses.
- [x] 1.3 Add environment configuration for GitHub repository access, owner authentication, local media paths, release paths, and nginx-facing URLs.
- [x] 1.4 Add local development scripts for frontend, backend, type checking, linting, and production build.

## 2. Content Store and Rendering

- [x] 2.1 Implement Markdown post parsing and serialization with frontmatter fields for title, slug, date, tags, summary, cover, and published state.
- [x] 2.2 Implement GitHub content adapter for reading, creating, updating, and deleting post Markdown files.
- [x] 2.3 Implement GitHub metadata adapter for reading and writing photography and lab JSON documents.
- [x] 2.4 Implement GitHub write error handling so failed commits return errors without reporting saved state.
- [x] 2.5 Implement Markdown rendering and sanitization for admin preview and public builds.

## 3. Media Storage

- [x] 3.1 Define a MediaStorage interface for storing, resolving, and deleting media references.
- [x] 3.2 Implement local filesystem media storage for photography image uploads.
- [x] 3.3 Implement public media URL resolution for generated photography pages.
- [x] 3.4 Add safeguards so metadata updates and local media writes do not leave broken published references.

## 4. Express Backend

- [x] 4.1 Implement owner-only authentication and session handling for admin routes and APIs.
- [x] 4.2 Implement blog post CRUD endpoints.
- [x] 4.3 Implement blog draft and publish-state endpoints or request fields.
- [x] 4.4 Implement Markdown preview endpoint that does not publish content.
- [x] 4.5 Implement photography CRUD endpoints with image upload support.
- [x] 4.6 Implement lab tool CRUD endpoints supporting external URLs and internal routes.
- [x] 4.7 Implement publish trigger and publish status endpoints.

## 5. Public Frontend

- [x] 5.1 Configure Rsbuild React TypeScript routing for public and admin route groups.
- [x] 5.2 Implement generated blog list page with reverse chronological ordering and tag filtering.
- [x] 5.3 Implement generated blog detail pages for published posts only.
- [x] 5.4 Implement generated photography gallery with date grouping and shooting location display.
- [x] 5.5 Implement generated lab gallery with image and name panels for external and internal tools.
- [x] 5.6 Ensure public builds exclude unpublished drafts.

## 6. Admin Frontend

- [x] 6.1 Implement admin authentication screens and route guards.
- [x] 6.2 Implement blog post list, create, edit, delete, save draft, preview, and publish controls.
- [x] 6.3 Implement plain text Markdown editor with rendered preview.
- [x] 6.4 Implement photography manager for metadata editing and image uploads.
- [x] 6.5 Implement lab manager for image, name, external URL, and internal route entries.
- [x] 6.6 Implement publish status display for pending, succeeded, and failed builds.

## 7. Static Build and Deployment

- [x] 7.1 Implement build-time content loading from GitHub posts and metadata.
- [x] 7.2 Implement static output generation for public pages and required assets.
- [x] 7.3 Implement release directory creation using timestamped immutable output paths.
- [x] 7.4 Implement generated-file verification before release activation.
- [x] 7.5 Implement active release switching via `current` symlink or equivalent atomic pointer.
- [x] 7.6 Add nginx configuration documentation for static hosting and API proxying.

## 8. Verification

- [x] 8.1 Add unit tests for Markdown parsing, frontmatter serialization, and draft filtering.
- [x] 8.2 Add unit tests for GitHub adapter success and failure behavior using mocks.
- [x] 8.3 Add API tests for authenticated and unauthenticated admin operations.
- [x] 8.4 Add frontend tests or smoke checks for public blog, photos, lab, and admin editor flows.
- [x] 8.5 Add publish-flow verification that failed builds keep the previous release active.
- [x] 8.6 Document manual QA commands and deployment verification steps.
