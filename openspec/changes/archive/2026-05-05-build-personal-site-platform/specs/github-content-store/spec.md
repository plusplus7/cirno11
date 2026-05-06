## ADDED Requirements

### Requirement: Markdown post storage
The system SHALL store blog posts as Markdown files with frontmatter in a GitHub content repository.

#### Scenario: Blog post is committed
- **WHEN** the owner creates or updates a blog post
- **THEN** the system commits a Markdown file containing frontmatter and body content to GitHub

### Requirement: Post frontmatter metadata
The system SHALL store blog post metadata in frontmatter fields required for routing, listing, filtering, draft state, and display.

#### Scenario: Post metadata is read
- **WHEN** the system reads a Markdown post from GitHub
- **THEN** the system can determine title, slug, date, tags, summary, cover when present, and published state from frontmatter

### Requirement: Photography metadata storage
The system SHALL store photography metadata in a structured JSON document in the GitHub content repository.

#### Scenario: Photo metadata is committed
- **WHEN** the owner creates or updates a photography entry
- **THEN** the system commits the updated photography metadata document to GitHub

### Requirement: Lab metadata storage
The system SHALL store lab tool panel metadata in a structured JSON document in the GitHub content repository.

#### Scenario: Lab metadata is committed
- **WHEN** the owner creates or updates a lab tool entry
- **THEN** the system commits the updated lab metadata document to GitHub

### Requirement: GitHub write failures
The system MUST report GitHub write failures without falsely marking the operation as saved.

#### Scenario: GitHub commit fails
- **WHEN** GitHub rejects or fails a content write
- **THEN** the system returns a failure result and preserves the previous saved content state

### Requirement: Content read model for builds
The system SHALL provide a build-readable content model derived from GitHub posts and metadata documents.

#### Scenario: Build loads content
- **WHEN** the public site build starts
- **THEN** the system reads posts, photography metadata, and lab metadata from the GitHub content repository

### Requirement: Local media references
The system SHALL allow GitHub metadata to reference image files stored outside GitHub.

#### Scenario: Photo metadata references local image
- **WHEN** a photography entry is read from GitHub metadata
- **THEN** the system can resolve the associated local image or public media URL for rendering
