## ADDED Requirements

### Requirement: Admin workspace presentation
The admin UI SHALL present authenticated content management as a focused owner workspace rather than a generic stacked form page.

#### Scenario: Owner opens authenticated admin
- **WHEN** the authenticated owner opens `/admin`
- **THEN** the system displays distinct workspace regions for post editing, content lists, photo management, lab metadata, and publishing

#### Scenario: Owner uses admin on a narrow viewport
- **WHEN** the owner opens `/admin` on a mobile-width viewport
- **THEN** the system preserves usable form controls, readable labels, and non-overlapping workspace sections

### Requirement: Improved admin authentication presentation
The admin authentication screen SHALL clearly present the owner-only entry point without exposing admin content before authentication.

#### Scenario: Unauthenticated user opens admin
- **WHEN** an unauthenticated user opens `/admin`
- **THEN** the system displays a polished sign-in view with password input and sign-in action only

### Requirement: Markdown editing workspace
The admin post editor SHALL provide a clearer Markdown writing workflow with visible metadata fields, body editing, preview, and save/publish actions.

#### Scenario: Owner edits a post draft
- **WHEN** the owner edits post metadata and Markdown body
- **THEN** the system groups title, slug, date, tags, body, and post actions in a layout that makes the editing workflow clear

#### Scenario: Owner previews Markdown
- **WHEN** the owner requests Markdown preview
- **THEN** the system displays rendered preview in a visually distinct preview region without replacing the editable Markdown body

#### Scenario: Owner loads an existing post
- **WHEN** the owner selects an existing post from the post list
- **THEN** the system updates the editor with that post while keeping the post list and actions accessible

### Requirement: Admin content list clarity
The admin UI SHALL make existing posts and destructive actions visually distinguishable.

#### Scenario: Owner views post list
- **WHEN** the owner views loaded posts in admin
- **THEN** the system displays each post with enough title or slug context to identify it

#### Scenario: Owner deletes a post
- **WHEN** the owner views a delete action
- **THEN** the system presents it as a distinct destructive action separate from edit or load actions

### Requirement: Photo and lab management presentation
The admin UI SHALL make photo upload and JSON metadata editing easier to distinguish from the blog editor.

#### Scenario: Owner manages photos
- **WHEN** the owner views the photo manager
- **THEN** the system displays upload fields, upload action, and photo metadata JSON editing as related but distinct controls

#### Scenario: Owner manages lab metadata
- **WHEN** the owner views lab management
- **THEN** the system displays the lab JSON editor with a clear save action and enough context to distinguish it from photo metadata editing

### Requirement: Publish status presentation
The admin UI SHALL make publish status and build action visible and understandable.

#### Scenario: Owner views publish section
- **WHEN** the owner views the publish controls
- **THEN** the system displays the current publish state and a clear action to trigger a public site build

#### Scenario: Publish state changes
- **WHEN** the publish API returns a new job state
- **THEN** the system updates the displayed publish state without changing the existing publish API contract
