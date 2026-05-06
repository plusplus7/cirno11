## ADDED Requirements

### Requirement: Owner-only admin access
The system SHALL restrict all admin screens and admin API operations to the site owner.

#### Scenario: Unauthenticated user opens admin
- **WHEN** an unauthenticated user opens an admin route
- **THEN** the system requires authentication before showing admin content

#### Scenario: Unauthenticated user calls admin API
- **WHEN** an unauthenticated request calls an admin API endpoint
- **THEN** the system MUST reject the request

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
