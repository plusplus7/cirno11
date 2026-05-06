## MODIFIED Requirements

### Requirement: Nginx static hosting
The system SHALL be deployable behind nginx with static frontend assets served directly and backend APIs proxied to Express, including admin multipart photo uploads within the configured upload size limit.

#### Scenario: Visitor requests public page
- **WHEN** nginx receives a request for a public route
- **THEN** nginx serves the generated static frontend asset or SPA fallback

#### Scenario: Admin API request is received
- **WHEN** nginx receives a request for an admin API route
- **THEN** nginx proxies the request to the Express backend

#### Scenario: Admin uploads large photo through nginx
- **WHEN** nginx receives an authenticated admin multipart photo upload within the documented upload size limit
- **THEN** nginx proxies the request to Express without returning `413 Request Entity Too Large`
