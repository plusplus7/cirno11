# Engineering Notes

- Frontend: Rsbuild, React, TypeScript.
- Backend: Express, TypeScript, owner-only admin API.
- Public site data is generated at build time into `src/client/generated/site-data.json`.
- GitHub is the intended content source when `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_TOKEN` are configured.
- Local file content under `content/` is used as a development fallback.
- Photography media is stored through `MediaStorage`; the first implementation is local filesystem storage.

