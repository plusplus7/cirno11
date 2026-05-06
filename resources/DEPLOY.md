# Deploy Notes

1. Configure environment variables from `.env.example`.
2. Run `npm run build:static` to generate public frontend assets.
3. Start the Express admin API with `npm start`.
4. Point nginx at the active `current` release directory and proxy `/api/` to Express.
5. Use `docs/nginx.conf.example` as the nginx baseline.

Public releases are written under `releases/<timestamp>` and activated by switching the `current` symlink after verification.

Photo uploads use multipart requests and Express accepts files up to 100MB on `/api/photos/upload`. Keep nginx `client_max_body_size` at 100m or higher for the proxied admin API path, otherwise nginx can return `413 Request Entity Too Large` before Express receives the upload.
