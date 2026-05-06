## ADDED Requirements

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

## MODIFIED Requirements

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
