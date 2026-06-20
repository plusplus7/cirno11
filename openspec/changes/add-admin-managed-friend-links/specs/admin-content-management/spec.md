## ADDED Requirements

### Requirement: Friend link CRUD
The system SHALL allow the owner to create, read, update, and delete friend-link metadata through owner-only admin APIs and structured admin controls. A friend link SHALL include an avatar icon URL, destination URL, display name, and public visibility state.

#### Scenario: Owner views friend-link management
- **WHEN** the authenticated owner opens friend-link management in `/plusplus7_admin_portal`
- **THEN** the admin UI displays structured friend-link form controls and a list of existing friend links with icons, names, URLs, visibility state, and delete controls

#### Scenario: Owner creates a friend link
- **WHEN** the owner submits a friend link with a display name, avatar icon URL, destination URL, and visibility state
- **THEN** the system stores the friend-link metadata and makes enabled entries eligible for the next public build

#### Scenario: Owner deletes a friend link
- **WHEN** the owner deletes a friend link from the structured list
- **THEN** the system removes the friend link from stored metadata

#### Scenario: Invalid friend-link metadata is rejected
- **WHEN** an authenticated admin request submits friend-link metadata that is not an array of valid friend-link items
- **THEN** the system MUST reject the request without replacing stored friend-link metadata
