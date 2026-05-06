## Why

The project needs a personal website that can publish long-form writing, photography, and small experiments while keeping content editable through a private admin UI. The site should be easy to deploy behind nginx, preserve content history in GitHub, and avoid runtime dependencies for public pages by generating the public site at build time.

## What Changes

- Add a separated frontend and backend personal site platform.
- Add a Rsbuild, React, and TypeScript frontend with public routes for blog posts, photography, lab tools, and private admin screens under `/admin`.
- Add an Express and TypeScript backend that provides owner-only admin APIs for content CRUD, Markdown preview, media upload, and publish actions.
- Store blog Markdown files and structured metadata in a GitHub repository.
- Store photography image files on the server local filesystem for the first version, behind a storage abstraction that can later be replaced by S3-compatible storage.
- Generate public blog, photography, and lab pages at build time and serve the resulting static files through nginx.
- Support blog drafts, admin preview, and explicit publish flows.
- Support nginx proxying of backend APIs while hosting static frontend assets.

## Capabilities

### New Capabilities

- `public-personal-site`: Public visitor experience for blog, photography, and lab sections.
- `admin-content-management`: Owner-only admin UI and API behavior for managing posts, photos, lab tools, drafts, previews, and publishing.
- `github-content-store`: GitHub-backed content repository behavior for Markdown posts and structured metadata.
- `static-publish-deploy`: Build-time generation and nginx-hosted release deployment behavior.

### Modified Capabilities

- None.

## Impact

- Adds frontend application architecture using Rsbuild, React, and TypeScript.
- Adds backend service architecture using Express and TypeScript.
- Adds admin API endpoints for authentication, content management, preview, media upload, and publishing.
- Adds GitHub API integration for committing Markdown files and JSON metadata changes.
- Adds local server media storage for photography assets.
- Adds build and deployment flow for static releases served by nginx.
