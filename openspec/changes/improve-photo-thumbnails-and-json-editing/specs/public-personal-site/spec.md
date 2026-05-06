## MODIFIED Requirements

### Requirement: Public photography gallery
The system SHALL provide a public photography gallery generated from photo metadata and local media references. The gallery list SHALL display thumbnail images when thumbnail metadata is available, and SHALL allow visitors to open the preserved original image in a modal view that fits within the browser viewport.

#### Scenario: Visitor opens photography page
- **WHEN** a visitor opens the photography page
- **THEN** the system displays photography entries with thumbnail image, title, shooting date, and shooting location

#### Scenario: Visitor opens original photo
- **WHEN** a visitor selects a photo from the photography gallery
- **THEN** the system opens a modal displaying the original image constrained to the current browser viewport

#### Scenario: Visitor closes original photo
- **WHEN** a visitor closes the open photo modal
- **THEN** the system returns the visitor to the photography gallery without navigating away from the page

#### Scenario: Visitor views legacy photo without thumbnail
- **WHEN** a visitor opens the photography page and a photo entry has no thumbnail reference
- **THEN** the system still displays the photo entry using the original image as a fallback
