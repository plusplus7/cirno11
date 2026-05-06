## Context

The existing React frontend is intentionally small and functional. It uses a single `App.tsx` router and one stylesheet, with public routes for home, blog, photography, lab, and an owner-only `/admin` area. The current UI uses generic white panels, standard buttons, and minimal spacing; it proves the platform works but does not yet express the identity of a personal archive.

The reference site at `plusplus7.com` / `blog.plusplus7.com` has a compact Hexo/Yilia-style structure: `+7 | 加七` identity, simple navigation, article list, tags, links, and a short "about me" profile. The redesign should preserve that lightweight archive feeling while improving typography, responsive layout, empty states, and admin usability for the newer React implementation.

The main constraints are:

- Keep the existing routes and data model from `src/shared/types.ts`.
- Keep public data loaded from `src/client/generated/site-data.json`.
- Keep admin API calls and authentication behavior unchanged.
- Avoid new dependencies unless implementation proves they are necessary.
- Support long Chinese/bilingual technical posts with code blocks, images, links, and lists.

## Goals / Non-Goals

**Goals:**

- Give the public site a distinctive personal archive identity instead of a generic scaffold.
- Make the home page useful as an overview of writing, tags, photos, lab tools, and latest updates.
- Improve blog list scanning with clear dates, tags, excerpts, and active filters.
- Improve article reading quality for long-form technical writing.
- Make photos and lab pages look intentional even when generated data is empty.
- Reframe admin as a focused content workspace with clearer editing, preview, metadata, upload, and publish areas.
- Preserve current implementation simplicity: React components plus CSS, no routing library migration.

**Non-Goals:**

- No backend API changes.
- No content storage changes.
- No new CMS workflow, WYSIWYG editor, comments, search backend, analytics, RSS, or multi-user roles.
- No redesign of nginx deployment or publish release mechanics.
- No attempt to clone the old site pixel-for-pixel.

## Decisions

### Use a two-mode visual system: public archive and admin workspace

Public pages should feel like a personal magazine/archive: quiet typography, strong date/title rhythm, concise tags, section indexes, and profile/link context. Admin pages should feel like a utilitarian writing desk: denser controls, strong form hierarchy, clear publish status, and side-by-side editing/preview.

Alternatives considered:

- Use one visual treatment everywhere: simpler CSS, but it keeps public identity and admin workflow muddled.
- Create a marketing-style landing page: more visually loud, but mismatched for a long-running personal blog archive.

### Keep the reference site's information model, not its exact theme

The redesign should borrow the durable pieces of the reference site: `+7 | 加七`, article list, tags, links, and about/profile content. It should not reproduce the old Hexo theme verbatim. The React site can improve hierarchy, responsive behavior, and empty states while keeping the familiar archive feel.

Alternatives considered:

- Exact visual clone: fast conceptually, but would inherit old theme limitations and conflict with the new admin/content platform.
- Entirely new brand direction: more freedom, but loses continuity with `plusplus7.com`.

### Keep routing and data contracts stable

All changes should stay inside client rendering and CSS. Existing routes (`/`, `/blog`, `/blog/:slug`, `/photos`, `/lab`, `/admin`) remain valid. Public pages continue reading `SiteData`; admin continues using the `api` client.

Alternatives considered:

- Introduce React Router or a page framework: unnecessary for the current route surface.
- Add backend-derived profile/settings data: useful later, but not required to improve frontend quality.

### Make empty states first-class

The generated data currently has empty `photos` and `labTools` in local output. Photography and lab pages should still look complete, with reserved layouts and concise empty states rather than blank sections.

Alternatives considered:

- Hide empty sections: avoids empty UI, but makes navigation feel broken and complicates route expectations.
- Add placeholder data to generated content: risks publishing fake content and changing content semantics.

### Improve article typography through CSS, not Markdown changes

The article renderer already produces sanitized HTML. The redesign should style the generated HTML for headings, paragraphs, code, pre blocks, links, images, lists, blockquotes, and tables without changing Markdown parsing.

Alternatives considered:

- Rewrite Markdown rendering: out of scope and higher risk.
- Normalize old article HTML content during build: may be useful later, but not required for a frontend redesign.

## Risks / Trade-offs

- Long legacy posts may contain malformed image markup or unusual HTML → Style common generated elements defensively and avoid assumptions about perfect Markdown.
- A more editorial layout can become sparse with very little content → Use counts, tags, latest post, section summaries, and empty states to keep pages intentional.
- Admin redesign can accidentally change save/delete/publish behavior → Keep event handlers and API calls behaviorally equivalent while changing layout and labels.
- CSS-only redesign can make `App.tsx` large → Add small helper functions/components only where they reduce duplication.
- Strong visual styling can hurt mobile readability → Use stable responsive constraints, avoid viewport-scaled body text, and verify mobile layouts manually.

## Migration Plan

- Implement frontend markup and CSS changes behind the same routes.
- Run `npm run check`, `npm test`, and `npm run build:static`.
- Manually inspect `/`, `/blog`, a blog detail route, `/photos`, `/lab`, and `/admin`.
- Rollback is the previous frontend files because no data/API migration is introduced.

## Open Questions

- Whether `Cirno11` or `+7 | 加七` should be the primary visible brand in the final UI. The implementation can preserve both by using `+7 | 加七` as the archive identity and `Cirno11` as a secondary/system label.
- Whether to add an explicit About page later. This change can include profile/about content on the home page and shell without adding a new route.
