## ADDED Requirements

### Requirement: Public friend links in aside
The public site SHALL render enabled friend links from generated site data in the non-home archive aside, with each link showing an avatar-sized icon, a display name, and navigation to the configured URL without requiring an admin API call.

#### Scenario: Visitor views a page with friend links
- **WHEN** a visitor opens a non-home public route and generated site data contains enabled friend links
- **THEN** the aside displays a friend-link section with each enabled link's icon, display name, and destination link

#### Scenario: Disabled friend link is hidden
- **WHEN** a friend link is stored with `enabled` set to false
- **THEN** the public aside MUST exclude that friend link from generated visitor-facing output

#### Scenario: No friend links are available
- **WHEN** generated site data contains no enabled friend links
- **THEN** the public layout remains polished and does not show a broken or empty friend-link list
