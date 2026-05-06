## 1. Public Shell and Helpers

- [x] 1.1 Add frontend display helpers for navigation state, tag counts, excerpts, section counts, and date labels without changing public data contracts.
- [x] 1.2 Redesign the shared public shell/navigation so public routes show the `+7 | 加七` archive identity, concise route navigation, and profile/link context.
- [x] 1.3 Add responsive layout structure that prevents public navigation, metadata, and page content from overflowing on mobile.

## 2. Public Page Redesign

- [x] 2.1 Redesign the home page as an editorial archive overview with recent writing, section summaries, tag/archive metadata, and polished empty treatment for unavailable photos/lab tools.
- [x] 2.2 Redesign the blog list with readable post hierarchy, active tag filtering, excerpts, visible tags, matching count, and empty filtered state.
- [x] 2.3 Redesign the blog detail page for long-form article reading, including metadata, tags, optional summary, and styled rendered Markdown elements.
- [x] 2.4 Redesign the photography page with date-grouped image presentation and a first-class empty state.
- [x] 2.5 Redesign the lab page with clear tool cards, destination affordance, enabled-tool filtering presentation, and a first-class empty state.

## 3. Admin Redesign

- [x] 3.1 Redesign the unauthenticated admin sign-in screen while preserving the existing session check and login API behavior.
- [x] 3.2 Redesign the authenticated admin layout as a content workspace with distinct regions for posts, photos, lab metadata, and publishing.
- [x] 3.3 Improve the Markdown editor region with grouped frontmatter fields, body editor, action bar, and persistent rendered preview region.
- [x] 3.4 Improve loaded post list and destructive delete action presentation without changing save, load, publish, preview, or delete handlers.
- [x] 3.5 Improve photo upload, photo metadata JSON editing, lab JSON editing, and publish status presentation without changing API contracts.

## 4. Visual System and Verification

- [x] 4.1 Replace the generic scaffold stylesheet with a cohesive responsive visual system for public archive pages, article typography, forms, panels, lists, empty states, and admin workspace.
- [x] 4.2 Run `npm run check` and fix TypeScript errors introduced by the redesign.
- [x] 4.3 Run `npm test` and fix regressions introduced by the redesign.
- [x] 4.4 Run `npm run build:static` and fix static build issues introduced by the redesign.
- [x] 4.5 Manually inspect `/`, `/blog`, one `/blog/:slug` route, `/photos`, `/lab`, and `/admin` on desktop and mobile-width layouts.
