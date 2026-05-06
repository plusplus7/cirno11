# admin-content-management Specification

## Purpose
TBD - created by archiving change build-personal-site-platform. Update Purpose after archive.
## Requirements
### Requirement: Owner-only admin access
The system SHALL restrict all admin screens and admin API operations to the site owner.

#### Scenario: Unauthenticated user opens admin
- **WHEN** an unauthenticated user opens an admin route
- **THEN** the system requires authentication before showing admin content

#### Scenario: Unauthenticated user calls admin API
- **WHEN** an unauthenticated request calls an admin API endpoint
- **THEN** the system MUST reject the request

### Requirement: Concealed admin entry route
The public UI SHALL NOT expose a visible navigation control to the owner admin screen, and the admin UI SHALL be served from `/plusplus7_admin_portal`.

#### Scenario: Public visitor views site chrome
- **WHEN** a public visitor views shared site navigation or footer chrome
- **THEN** the system does not display an admin navigation link or button

#### Scenario: Owner opens canonical admin route
- **WHEN** the owner opens `/plusplus7_admin_portal`
- **THEN** the system displays the admin authentication or authenticated workspace flow

#### Scenario: Visitor opens legacy admin route
- **WHEN** a visitor opens `/admin`
- **THEN** the system does not display the admin authentication or authenticated workspace flow

### Requirement: Blog post CRUD
The system SHALL allow the owner to create, read, update, and delete blog posts stored as Markdown files.

#### Scenario: Owner saves a new post
- **WHEN** the owner submits a new blog post with frontmatter fields and Markdown body
- **THEN** the system creates a Markdown post in the content store

#### Scenario: Owner updates a post
- **WHEN** the owner edits an existing blog post
- **THEN** the system updates the corresponding Markdown post in the content store

#### Scenario: Owner deletes a post
- **WHEN** the owner deletes a blog post
- **THEN** the system removes the corresponding Markdown post from the content store

### Requirement: Blog draft workflow
The system SHALL support draft blog posts that are editable in admin but excluded from public builds.

#### Scenario: Owner saves draft
- **WHEN** the owner saves a blog post as draft
- **THEN** the system stores the post with `published` set to false

#### Scenario: Owner publishes draft
- **WHEN** the owner publishes a draft blog post
- **THEN** the system stores the post with `published` set to true and makes it eligible for the next public build

### Requirement: Markdown preview
The system SHALL provide Markdown preview for admin blog editing without publishing the post.

#### Scenario: Owner previews Markdown
- **WHEN** the owner requests preview for Markdown content
- **THEN** the system returns rendered preview content without changing the public release

### Requirement: Text editor for Markdown
The admin UI SHALL provide a plain text Markdown editor with preview.

#### Scenario: Owner edits post body
- **WHEN** the owner opens a blog post editor
- **THEN** the system provides a text editing area for Markdown and a way to view rendered preview

### Requirement: Photography CRUD
The system SHALL allow the owner to create, read, update, and delete photography entries and associated image files.

#### Scenario: Owner uploads photo
- **WHEN** the owner creates a photography entry with an image file, shooting date, and location
- **THEN** the system stores the image file and records the metadata

#### Scenario: Owner updates photo metadata
- **WHEN** the owner edits a photography entry
- **THEN** the system updates the stored metadata

#### Scenario: Owner deletes photo entry
- **WHEN** the owner deletes a photography entry
- **THEN** the system removes or disables the metadata entry from the public gallery

### Requirement: Lab tool CRUD
The system SHALL allow the owner to create, read, update, and delete lab tool panel entries.

#### Scenario: Owner creates external lab tool
- **WHEN** the owner creates a lab tool with an image, name, and external URL
- **THEN** the system stores a lab entry that opens the external URL from the public lab page

#### Scenario: Owner creates internal lab tool
- **WHEN** the owner creates a lab tool with an image, name, and internal route
- **THEN** the system stores a lab entry that opens the internal route from the public lab page

### Requirement: Publish trigger
The admin UI SHALL allow the owner to trigger publication after content changes.

#### Scenario: Owner publishes content changes
- **WHEN** the owner triggers publish from admin
- **THEN** the system starts a public site build and release process

### Requirement: Admin workspace presentation
The admin UI SHALL present authenticated content management at `/plusplus7_admin_portal` as a focused owner workspace rather than a generic stacked form page.

#### Scenario: Owner opens authenticated admin
- **WHEN** the authenticated owner opens `/plusplus7_admin_portal`
- **THEN** the system displays distinct workspace regions for post editing, content lists, photo management, lab metadata, and publishing

#### Scenario: Owner uses admin on a narrow viewport
- **WHEN** the owner opens `/plusplus7_admin_portal` on a mobile-width viewport
- **THEN** the system preserves usable form controls, readable labels, and non-overlapping workspace sections

### Requirement: Improved admin authentication presentation
The admin authentication screen SHALL clearly present the owner-only entry point without exposing admin content before authentication, and it SHALL display clear feedback when sign-in fails.

#### Scenario: Unauthenticated user opens admin
- **WHEN** an unauthenticated user opens `/plusplus7_admin_portal`
- **THEN** the system displays a polished sign-in view with password input and sign-in action only

#### Scenario: Owner enters an invalid password
- **WHEN** the owner submits an incorrect admin password
- **THEN** the system displays a visible authentication failure message without showing admin content

### Requirement: Markdown editing workspace
The admin post editor SHALL provide a clearer Markdown writing workflow with visible metadata fields, body editing, automatic preview, and save/publish actions.

#### Scenario: Owner edits a post draft
- **WHEN** the owner edits post metadata and Markdown body
- **THEN** the system groups title, slug, date, tags, body, and post actions in a layout that makes the editing workflow clear

#### Scenario: Owner edits Markdown
- **WHEN** the owner changes the Markdown body
- **THEN** the system updates the rendered preview automatically without replacing the editable Markdown body

#### Scenario: Owner loads an existing post
- **WHEN** the owner selects an existing post from the post list
- **THEN** the system updates the editor with that post while keeping the post list and actions accessible

### Requirement: Admin content list clarity
The admin UI SHALL make existing posts and destructive actions visually distinguishable while keeping the post library compact.

#### Scenario: Owner views post list
- **WHEN** the owner views loaded posts in admin
- **THEN** the system displays each post as a compact row with the post title, or slug when the title is empty

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
