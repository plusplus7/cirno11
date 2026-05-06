## MODIFIED Requirements

### Requirement: Photography metadata storage
The system SHALL store photography metadata in a structured JSON document in the GitHub content repository. Photography metadata SHALL be able to include both the original image URL and the generated thumbnail URL for each photo entry.

#### Scenario: Photo metadata is committed
- **WHEN** the owner creates or updates a photography entry
- **THEN** the system commits the updated photography metadata document to GitHub

#### Scenario: Photo metadata includes original and thumbnail references
- **WHEN** the owner uploads a new photography entry
- **THEN** the committed metadata contains a reference to the preserved original image and a reference to the generated thumbnail image

### Requirement: Local media references
The system SHALL allow GitHub metadata to reference image files stored outside GitHub, including preserved original photo files and generated thumbnail files.

#### Scenario: Photo metadata references local image
- **WHEN** a photography entry is read from GitHub metadata
- **THEN** the system can resolve the associated local original image or public media URL for rendering

#### Scenario: Photo metadata references local thumbnail
- **WHEN** a photography entry with a thumbnail reference is read from GitHub metadata
- **THEN** the system can resolve the associated local thumbnail image or public media URL for gallery list rendering
