## Why

The current frontend satisfies the platform workflow but still looks like a functional scaffold: public pages, article reading, photography, lab, and admin screens all share the same generic card-and-button treatment. The site should feel closer to the existing `plusplus7.com` identity: a lightweight personal archive for long-form technical writing, life notes, games, photography, and experiments, with a more deliberate reading and owner-editing experience.

## What Changes

- Redesign the public shell with a personal blog identity inspired by the existing `+7 | 加七` site: concise navigation, archive-oriented structure, visible tags, and lightweight profile/link context.
- Redesign the home page into an editorial archive overview instead of a plain hero, highlighting recent writing, site sections, post counts, tags, and available photo/lab material.
- Redesign the blog list with stronger typography, date/category rhythm, excerpts, tag filtering, and empty states.
- Redesign blog detail pages for long bilingual/Chinese technical articles with improved article width, metadata, tags, headings, code blocks, images, links, lists, and reading rhythm.
- Redesign photography and lab pages so they remain polished with both populated and empty data sets.
- Redesign the owner-only admin frontend into a quiet content workspace with clearer sections for posts, photos, lab JSON editing, preview, and publish status.
- Keep all existing data contracts, routes, authentication behavior, admin APIs, and publish behavior unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `public-personal-site`: Improve public visitor presentation requirements for the home page, blog list, blog detail, photography gallery, lab gallery, metadata, tags, and empty states.
- `admin-content-management`: Improve owner admin presentation requirements for authentication, Markdown editing, preview, content lists, photo upload, JSON metadata editing, and publish status.

## Impact

- Affects `src/client/App.tsx` public/admin markup and UI state presentation.
- Affects `src/client/styles/app.css` visual system, responsive layout, article typography, cards/lists, forms, and admin workspace styling.
- May add small frontend-only helper functions for dates, excerpts, counts, navigation state, and display grouping.
- Does not add new runtime dependencies unless the implementation finds an existing project-approved need.
- Does not change backend routes, API response shapes, generated site data schema, GitHub content storage, media storage, publish jobs, nginx deployment, or authentication/session behavior.
