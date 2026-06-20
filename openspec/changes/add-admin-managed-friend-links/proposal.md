## Why

The public aside currently has fixed profile/navigation context, so friendly links cannot be updated without editing frontend code. The site owner needs a small managed friend-link section that can be maintained from the existing admin workspace and published through the normal static data pipeline.

## What Changes

- Add a public friend-link section to the non-home aside, showing enabled links with a small avatar-sized icon, display name, and destination link.
- Add owner-only admin controls for creating and deleting friend links through structured list controls.
- Store friend-link metadata as content data so local development and GitHub-backed content storage both support the same workflow.
- Include enabled friend links in generated public site data so static releases do not call admin APIs.
- Keep the existing admin route, authentication model, publish workflow, and public navigation unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `public-personal-site`: Public aside context includes configured friend links generated from content data.
- `admin-content-management`: Owner admin supports structured friend-link metadata management for routine add and delete operations.

## Impact

- Shared content types and generated `SiteData` gain friend-link metadata.
- Local and GitHub content stores add list/save support for friend-link JSON under `data/`.
- Admin API gains authenticated friend-link read/write endpoints.
- Admin React UI gains a friend-link management tab or panel using the existing structured metadata list pattern.
- Public React shell and CSS gain the aside friend-link section and responsive styling.
- QA should cover public aside rendering, hidden/disabled links, admin add/delete persistence, and static generation.
