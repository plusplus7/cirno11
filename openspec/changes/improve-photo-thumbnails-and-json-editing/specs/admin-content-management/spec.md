## MODIFIED Requirements

### Requirement: Photography CRUD
The system SHALL allow the owner to create, read, update, and delete photography entries and associated image files. When the owner uploads a photo, the system SHALL preserve the original image file and generate a separate compressed thumbnail reference for gallery list display.

#### Scenario: Owner uploads photo
- **WHEN** the owner creates a photography entry with an image file, shooting date, and location
- **THEN** the system stores the original image file, generates a compressed thumbnail file, and records metadata references for both the original image and thumbnail

#### Scenario: Owner updates photo metadata
- **WHEN** the owner edits a photography entry
- **THEN** the system updates the stored metadata

#### Scenario: Owner deletes photo entry
- **WHEN** the owner deletes a photography entry
- **THEN** the system removes or disables the metadata entry from the public gallery

### Requirement: Photo and lab management presentation
The admin UI SHALL make photo upload and JSON metadata editing easier to distinguish from the blog editor. JSON metadata editors SHALL provide validation feedback and formatting controls so owners can safely add or modify structured metadata.

#### Scenario: Owner manages photos
- **WHEN** the owner views the photo manager
- **THEN** the system displays upload fields, upload action, and photo metadata JSON editing as related but distinct controls

#### Scenario: Owner edits valid JSON metadata
- **WHEN** the owner edits JSON metadata for photos, lab tools, or profile content and the JSON is valid
- **THEN** the system allows the owner to format and save the metadata

#### Scenario: Owner edits invalid JSON metadata
- **WHEN** the owner edits JSON metadata for photos, lab tools, or profile content and the JSON is invalid
- **THEN** the system displays validation feedback and prevents saving the malformed metadata

#### Scenario: Owner manages lab metadata
- **WHEN** the owner views lab management
- **THEN** the system displays the lab JSON editor with a clear save action, validation feedback, formatting controls, and enough context to distinguish it from photo metadata editing
