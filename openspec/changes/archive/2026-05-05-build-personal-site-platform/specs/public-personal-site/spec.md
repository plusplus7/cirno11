## ADDED Requirements

### Requirement: Public blog listing
The system SHALL provide a public blog listing generated from published Markdown posts and ordered by post date descending.

#### Scenario: Visitor opens blog list
- **WHEN** a visitor opens the public blog page
- **THEN** the system displays published posts in reverse chronological order

#### Scenario: Draft post is hidden
- **WHEN** a post has `published` set to false
- **THEN** the system MUST exclude the post from the public blog list

### Requirement: Public blog tag filtering
The system SHALL allow visitors to filter public blog posts by tag.

#### Scenario: Visitor selects a tag
- **WHEN** a visitor selects a tag on the blog page
- **THEN** the system displays only published posts containing that tag

### Requirement: Public blog detail
The system SHALL provide a public detail page for each published blog post using rendered Markdown content and post frontmatter metadata.

#### Scenario: Visitor opens a published post
- **WHEN** a visitor opens a published post detail route
- **THEN** the system displays the post title, date, tags, summary when available, and rendered Markdown body

#### Scenario: Visitor opens an unpublished post route
- **WHEN** a visitor opens a route for an unpublished post
- **THEN** the system MUST not expose the post content in the public site

### Requirement: Public photography gallery
The system SHALL provide a public photography gallery generated from photo metadata and local media references.

#### Scenario: Visitor opens photography page
- **WHEN** a visitor opens the photography page
- **THEN** the system displays photography entries with image, title, shooting date, and shooting location

### Requirement: Public photography date grouping
The system SHALL group or filter photography entries by shooting date on the public photography page.

#### Scenario: Visitor browses by date
- **WHEN** a visitor browses the photography page
- **THEN** the system presents entries organized by date so photos from the same date can be viewed together

### Requirement: Public lab gallery
The system SHALL provide a public lab page showing configured tools as image and name panels.

#### Scenario: Visitor opens lab page
- **WHEN** a visitor opens the lab page
- **THEN** the system displays each enabled lab tool with its image and name

### Requirement: Lab panel navigation
The system SHALL support lab panels that either navigate to an external URL or to an internal application route.

#### Scenario: Visitor opens an external tool
- **WHEN** a visitor activates a lab panel configured with an external URL
- **THEN** the system navigates to the configured external URL

#### Scenario: Visitor opens an internal tool
- **WHEN** a visitor activates a lab panel configured with an internal route
- **THEN** the system navigates to the configured internal route
