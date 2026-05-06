## ADDED Requirements

### Requirement: Build-time public generation
The system SHALL generate public blog, photography, and lab pages at build time from the content store.

#### Scenario: Public build runs
- **WHEN** a public site build runs
- **THEN** the generated output includes public pages for published blog posts, photography entries, and lab entries

### Requirement: Draft exclusion from public builds
The system MUST exclude unpublished blog drafts from generated public pages.

#### Scenario: Build encounters draft post
- **WHEN** the build reads a blog post with `published` set to false
- **THEN** the generated public output does not include a public route or listing entry for that post

### Requirement: Nginx static hosting
The system SHALL be deployable behind nginx with static frontend assets served directly and backend APIs proxied to Express.

#### Scenario: Visitor requests public page
- **WHEN** nginx receives a request for a public route
- **THEN** nginx serves the generated static frontend asset or SPA fallback

#### Scenario: Admin API request is received
- **WHEN** nginx receives a request for an admin API route
- **THEN** nginx proxies the request to the Express backend

### Requirement: Immutable release output
The system SHALL publish generated static files into immutable release directories.

#### Scenario: Build succeeds
- **WHEN** a public build completes successfully
- **THEN** the system writes the generated output to a new release directory

### Requirement: Atomic release activation
The system SHALL activate a new public release only after build verification succeeds.

#### Scenario: Verified release is activated
- **WHEN** a new release passes verification
- **THEN** the system switches the active release pointer to the new release

#### Scenario: Build fails
- **WHEN** a public build fails or verification fails
- **THEN** the system keeps serving the previously active release

### Requirement: Admin publishing status
The system SHALL expose publish status to the admin UI.

#### Scenario: Owner checks publish result
- **WHEN** the owner triggers or reviews a publish operation
- **THEN** the system reports whether the build is pending, succeeded, or failed
