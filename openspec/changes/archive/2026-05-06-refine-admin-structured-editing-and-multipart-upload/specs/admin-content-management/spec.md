## MODIFIED Requirements

### Requirement: Photography CRUD
The system SHALL allow the owner to create, read, update, and delete photography entries and associated image files. Photo upload SHALL accept multipart file uploads and preserve original and thumbnail media references for saved photo metadata.

#### Scenario: Owner uploads photo
- **WHEN** the owner creates a photography entry with an image file, shooting date, and location
- **THEN** the system accepts the image as a multipart file upload, stores the original image file, generates or preserves a thumbnail reference, and records the metadata

#### Scenario: Owner updates photo metadata
- **WHEN** the owner edits a photography entry
- **THEN** the system updates the stored metadata

#### Scenario: Owner deletes photo entry
- **WHEN** the owner deletes a photography entry
- **THEN** the system removes or disables the metadata entry from the public gallery

#### Scenario: Owner uploads a large photo
- **WHEN** the owner uploads a photo larger than 20MB within the configured upload size limit
- **THEN** the system accepts the multipart upload without failing because of base64 JSON body expansion

### Requirement: Lab tool CRUD
The system SHALL allow the owner to create, read, update, and delete lab tool panel entries through structured admin controls.

#### Scenario: Owner creates external lab tool
- **WHEN** the owner creates a lab tool with an image, name, and external URL
- **THEN** the system stores a lab entry that opens the external URL from the public lab page

#### Scenario: Owner creates internal lab tool
- **WHEN** the owner creates a lab tool with an image, name, and internal route
- **THEN** the system stores a lab entry that opens the internal route from the public lab page

#### Scenario: Owner deletes lab tool
- **WHEN** the owner deletes a lab tool item from the admin list
- **THEN** the system removes the item from stored lab metadata

### Requirement: Admin workspace presentation
The admin UI SHALL present authenticated content management at `/plusplus7_admin_portal` as a focused owner workspace rather than a generic stacked form page, and it SHALL provide a visible action for returning to the public homepage.

#### Scenario: Owner opens authenticated admin
- **WHEN** the authenticated owner opens `/plusplus7_admin_portal`
- **THEN** the system displays distinct workspace regions for post editing, content lists, photo management, lab metadata, and publishing

#### Scenario: Owner uses admin on a narrow viewport
- **WHEN** the owner opens `/plusplus7_admin_portal` on a mobile-width viewport
- **THEN** the system preserves usable form controls, readable labels, and non-overlapping workspace sections

#### Scenario: Owner returns to public homepage
- **WHEN** the authenticated owner activates the admin header homepage action
- **THEN** the system navigates to the public blog homepage

### Requirement: Markdown editing workspace
The admin post editor SHALL provide a clearer Markdown writing workflow with visible metadata fields, body editing, automatic preview, equal-width editing and preview columns, and save/publish actions.

#### Scenario: Owner edits a post draft
- **WHEN** the owner edits post metadata and Markdown body
- **THEN** the system groups title, slug, date, tags, body, and post actions in a layout that makes the editing workflow clear

#### Scenario: Owner edits Markdown
- **WHEN** the owner changes the Markdown body
- **THEN** the system updates the rendered preview automatically without replacing the editable Markdown body

#### Scenario: Owner loads an existing post
- **WHEN** the owner selects an existing post from the post list
- **THEN** the system updates the editor with that post while keeping the post list and actions accessible

#### Scenario: Owner compares editor and preview
- **WHEN** the owner views the post editor on a desktop-width viewport
- **THEN** the system displays the Markdown editor and rendered preview as equal-width working columns

### Requirement: Admin content list clarity
The admin UI SHALL make existing posts and destructive actions visually distinguishable while keeping the post library compact, placed at the far right of the post workspace, and hideable or showable with one action.

#### Scenario: Owner views post list
- **WHEN** the owner views loaded posts in admin
- **THEN** the system displays each post as a compact row with the post title, or slug when the title is empty

#### Scenario: Owner deletes a post
- **WHEN** the owner views a delete action
- **THEN** the system presents it as a distinct destructive action separate from edit or load actions

#### Scenario: Owner hides post library
- **WHEN** the owner hides the post library
- **THEN** the system removes the post library panel from the workspace while preserving the current draft and a visible control to show the library again

#### Scenario: Owner shows post library
- **WHEN** the owner shows the hidden post library
- **THEN** the system restores the post library at the far right of the post workspace

### Requirement: Photo and lab management presentation
The admin UI SHALL make photo upload, photo metadata management, and lab metadata management easier to distinguish from the blog editor. Photo and lab metadata SHALL be manageable through structured list controls for routine add and delete operations instead of requiring raw JSON editing.

#### Scenario: Owner manages photos
- **WHEN** the owner views the photo manager
- **THEN** the system displays upload fields, upload action, and a structured photo list with thumbnails, titles, and delete controls

#### Scenario: Owner deletes photo metadata
- **WHEN** the owner deletes a photo from the structured photo list
- **THEN** the system removes the photo entry from stored photo metadata

#### Scenario: Owner manages lab metadata
- **WHEN** the owner views lab management
- **THEN** the system displays a structured lab item list with item details, delete controls, and enough context to distinguish it from photo metadata editing

#### Scenario: Owner adds lab metadata
- **WHEN** the owner submits the lab item form with valid fields for an external or internal tool
- **THEN** the system adds a valid lab metadata item to the structured lab list and persists it
