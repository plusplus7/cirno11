## ADDED Requirements

### Requirement: Public archive identity
The public site SHALL present a coherent personal archive identity inspired by the existing `+7 | 加七` blog, including concise navigation and contextual profile or link information.

#### Scenario: Visitor opens any public route
- **WHEN** a visitor opens a public route
- **THEN** the system displays a consistent site identity, public navigation, and archive-oriented visual treatment

#### Scenario: Visitor needs context about the site owner
- **WHEN** a visitor views the public shell or home page
- **THEN** the system displays concise profile or contextual information without requiring an admin API call

### Requirement: Editorial home overview
The public home page SHALL act as an editorial overview of the archive rather than a generic hero-only landing page.

#### Scenario: Visitor opens the home page
- **WHEN** a visitor opens `/`
- **THEN** the system displays recent writing, available public sections, and archive metadata such as post counts, tags, or latest update information

#### Scenario: Home page data is partially empty
- **WHEN** photos or lab tools are unavailable in generated site data
- **THEN** the system still displays a polished overview with clear empty or coming-soon treatment for those sections

### Requirement: Enhanced blog browsing presentation
The public blog list SHALL provide a polished browsing experience for long-running archive content with clear date, title, excerpt, and tag hierarchy.

#### Scenario: Visitor opens blog list
- **WHEN** a visitor opens `/blog`
- **THEN** the system displays published posts with readable titles, dates, excerpts when available or derived, and visible tags

#### Scenario: Visitor filters by tag
- **WHEN** a visitor selects a tag filter
- **THEN** the system highlights the active filter and displays the matching post count or an equivalent clear filtered state

#### Scenario: Filter has no visible results
- **WHEN** a selected filter produces no visible posts
- **THEN** the system displays a deliberate empty state instead of a visually broken or blank list

### Requirement: Long-form article reading experience
The public blog detail page SHALL optimize rendered Markdown content for long Chinese and bilingual technical articles.

#### Scenario: Visitor opens a blog detail page
- **WHEN** a visitor opens `/blog/:slug` for a published post
- **THEN** the system displays the title, date, tags, optional summary, and body using an article layout with comfortable reading width and hierarchy

#### Scenario: Article contains technical content
- **WHEN** a rendered article contains headings, links, lists, code, preformatted blocks, images, blockquotes, or tables
- **THEN** the system styles those elements so they remain readable and visually contained on desktop and mobile

### Requirement: Polished photography and lab sections
The public photography and lab pages SHALL look intentional whether they contain entries or are currently empty.

#### Scenario: Visitor opens photography page with entries
- **WHEN** a visitor opens `/photos` and generated photo entries exist
- **THEN** the system displays date-grouped photography with image, title, date, and location hierarchy

#### Scenario: Visitor opens photography page without entries
- **WHEN** a visitor opens `/photos` and no generated photo entries exist
- **THEN** the system displays a polished empty state that preserves the section identity

#### Scenario: Visitor opens lab page with entries
- **WHEN** a visitor opens `/lab` and enabled lab tools exist
- **THEN** the system displays lab entries with image, name, destination type, and clear navigation affordance

#### Scenario: Visitor opens lab page without entries
- **WHEN** a visitor opens `/lab` and no enabled lab tools exist
- **THEN** the system displays a polished empty state that preserves the section identity

### Requirement: Responsive public layout
The public site SHALL adapt to desktop and mobile viewports without overlapping text, broken navigation, or unreadable content.

#### Scenario: Visitor uses a narrow viewport
- **WHEN** a visitor opens any public route on a mobile-width viewport
- **THEN** the system stacks navigation, lists, metadata, images, and article content into a readable layout without horizontal overflow
