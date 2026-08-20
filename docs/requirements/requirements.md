# Semi-Static React Website Template Requirements

## 1. Purpose

Build a modular React website template that can be hosted for free on GitHub
Pages. The project should be designed to be forked and adapted into a real
website for a specific organization or use case. The template should behave
mostly like a static website, while allowing selected content areas to be
updated by non-technical users through Google Sheets, without requiring a
custom backend or database.

## 2. Product Vision

The template should support small organizations, teams, clubs, labs, or
similar groups that need:

- A polished public-facing website
- Mostly static, reliable content
- A simple way for non-technical users to update approved sections
- A structure that developers can extend with new pages and reusable blocks
- A starter project that can be forked into a proper production website

The project delivered at this stage should include an example/demo site that
illustrates the available features and module patterns, but it should not
implement real organization-specific information.

## 3. Core Goals

- Support free hosting on GitHub Pages
- Keep the site primarily static for simplicity, speed, and reliability
- Allow selected page content to be updated through Google Sheets
- Make the site modular and extensible in code
- Make the project reusable as a forkable template
- Support multi-page navigation with navbar sections and subsections
- Keep developer-authored text centrally organized through a `t()` translation
  or text lookup pattern
- Avoid any custom backend, server-side rendering, or stored application data

## 4. Non-Goals

- No full CMS
- No authenticated admin portal built into the website
- No custom backend API
- No private database
- No complex user accounts or permissions system inside the app
- No dynamic business logic beyond reading approved external content and
  rendering it safely
- No requirement to ship real organization-owned content in the initial
  template/demo site

## 5. Primary Users

### 5.1 Site Visitors

Visitors of a forked production site would browse static and semi-static
content such as:

- About pages
- Contact information
- Team/member listings
- Events or calendar items
- Announcements
- External forms or sign-up links

### 5.2 Content Editors

Non-technical users update selected content through Google Sheets.
They should not need to edit code, JSON files, or GitHub directly.

### 5.3 Developers

Developers add new pages, create reusable page modules, configure mappings to
Google Sheets data sources, and maintain the overall structure.
They should also be able to fork the template and replace the example content
with real content for a proper website.

## 6. High-Level Architecture Requirements

### 6.1 Hosting Model

- The site must be deployable as a static React build to GitHub Pages
- The solution must work on GitHub Pages free hosting without requiring a
  server runtime
- The site should continue to render correctly even if external updatable data
  is temporarily unavailable
- The template repository may include a demo deployment that showcases features
  using placeholder or sample content only

### 6.2 Update Model

- Static content is bundled into the site at build time
- Updatable content is loaded from Google Sheets-based external data sources
- The website must clearly separate static content from externally updated
  content
- External content loading must fail gracefully and not break the page layout

### 6.3 Stability Requirement

Because Google Sheets are being used as the editing interface, the update
mechanism must prioritize stability over flexibility. The system should depend
on a stable published data format or controlled intermediate representation,
not on fragile scraping of spreadsheet UI pages.

## 7. Functional Requirements

### 7.1 Modular Page System

- The site must support multiple pages
- Developers must be able to add a new page with minimal code changes
- Each page must be composed from reusable content modules
- Modules should be configurable rather than hardcoded for one page only
- The initial delivered site should demonstrate these modules with example
  content rather than real organizational content

Required baseline module types:

- Header / hero block
- Text block
- Image block
- Card list / card grid
- Section wrapper

Optional future-ready module types:

- FAQ block
- Call-to-action block
- Timeline block
- Calendar/events block
- Gallery block
- Embedded external content block

### 7.2 Updatable Module System

- Some module instances must be marked as updatable
- Updatable modules must read their content from Google Sheets-linked data
- Static modules and updatable modules must share a consistent rendering system
- Each updatable module must have a clear mapping between:
  - Website page
  - Website section/module
  - Google Sheet and worksheet/table range
  - Expected data type

Examples:

- An announcement text block may map to one text response
- A card list may map to multiple rows, each row producing one card
- A calendar/events block may map to multiple dated rows

### 7.3 Navigation Requirements

- The site must include a top navigation bar
- The navbar must support:
  - Top-level pages
  - Section groupings
  - Dropdown subsections
- Example supported structure:
  - `About`
  - `About > Contact`
  - `About > Members`
- Navigation configuration should be data-driven where practical
- The current page/section should be visually identifiable

### 7.4 Text Management Requirements

- Static developer-controlled text must use a standard `t()` lookup function
- Text keys must follow the format:
  - `[page].[section].[item]`
- At minimum, the design must enforce `[page].[section]` grouping
- Text configuration must be centralized and easy to edit
- This structure should support future localization or alternate text sets

Examples:

- `home.hero.title`
- `about.contact.heading`
- `members.intro.body`

### 7.5 Google Sheets Integration Requirements

- Google Sheets must be the editor-facing content update mechanism
- Different sheets, tabs, or named ranges must support different website
  sections
- The system must support multiple content shapes, including:
  - Single text values
  - Multi-field card rows
  - Event/calendar rows with dates
  - Repeating content collections
- Each updatable content type must have a defined schema
- Invalid or incomplete submissions must not break page rendering

### 7.6 External Submission Requirements

The website may include public-facing forms for actions such as:

- Contact requests
- Event registration
- Volunteer sign-up
- Mailing list sign-up

Constraints:

- These flows must not require custom backend storage
- Submission handling should be limited to:
  - Sending email through an external service, or
  - Sending users to an external app/workflow
- The website itself should not store submitted data

## 8. Content Model Requirements

### 8.1 Module Definition Model

Each page module should have a structured definition including:

- Module type
- Static or updatable mode
- Layout/config options
- Data source reference
- Validation expectations
- Fallback behavior

### 8.2 Updatable Data Types

At minimum, the requirements must support the following data models:

#### Text Block

- Title
- Body text
- Optional last-updated metadata

#### Card List

- Multiple entries
- Each entry may include:
  - Title
  - Subtitle
  - Description
  - Link
  - Image URL (optional)
  - Sort order (optional)

#### Event / Calendar Item

- Event title
- Date
- Time (optional)
- Location (optional)
- Description (optional)
- External link (optional)

#### Contact / Info Entry

- Label
- Value
- Optional type indicator such as email, phone, URL, or plain text

## 9. Editor Experience Requirements

- Non-technical users must only need Google Sheets to update approved content
- Editors should not need to understand React, GitHub, JSON, or deployment
- The input process should be easy to explain in a short written guide
- Each editable area should have a predictable sheet structure
- It should be clear which sheet, tab, row, or column affects which website
  section
- Example sheets used by the template should contain sample or placeholder data
  only

## 10. Reliability and Safety Requirements

- The website must remain usable if external content cannot be loaded
- Missing or malformed external content must fall back safely
- The system must avoid exposing raw sheet data directly without validation
- The rendering layer must sanitize or constrain externally provided content
- Updatable content should be limited to approved fields and approved formats
- The solution should minimize manual maintenance of integration points

## 11. Performance Requirements

- Base pages should load quickly as a static site
- External updatable content should not noticeably block initial rendering
- Large updatable collections should be reasonably limited or paginated if
  needed

## 12. Extensibility Requirements

- Developers must be able to add new pages without redesigning the architecture
- Developers must be able to add new module types later
- Developers must be able to connect new Google Sheets-backed sections later
- The system should support future replacement of Google Sheets with another
  editor-facing source if needed

## 13. Accessibility Requirements

- The navbar and dropdowns must be keyboard accessible
- Images must support alt text
- Text blocks and cards must preserve readable heading hierarchy
- Color and interaction states should meet standard web accessibility
  expectations

## 14. Deployment and Operations Requirements

- Deployment must be compatible with GitHub Pages
- The build output must be static assets only
- The process for updating static code and deploying should remain separate from
  the process for editors updating sheet-driven content
- The repository should be structured so it is easy to fork, rename, and adapt
  into a real website
- The project should include clear documentation for:
  - Adding a page
  - Adding a module
  - Configuring an updatable section
  - Mapping a Google Sheets data source

## 15. Recommended Requirement-Level Design Decisions

These are requirement-aligned decisions, not implementation details:

- Treat the website as "static-first, externally hydrated where approved"
- Treat Google Sheets as the editor UI only
- Treat the Google-linked data source as structured content, not freeform HTML
- Restrict updatable content to predefined schemas per module type
- Prefer configuration-driven page composition over page-specific hardcoding
- Treat the delivered site as a demonstrative template instance, not a finished
  real-world deployment

## 16. Acceptance Criteria

The solution is acceptable if all of the following are true:

- A React site can be deployed successfully to GitHub Pages
- The repository clearly functions as a reusable template that can be forked
  into a production website
- The delivered site includes an example/demo experience that illustrates the
  available modules and update patterns using placeholder content only
- A developer can add a new page using reusable modules
- A developer can add a navbar item and subsection navigation
- Static text is referenced through `t()` keys in the `[page].[section].[item]`
  pattern
- At least one text block, one card list, and one event/calendar section can be
  driven from Google Sheets-linked data
- A non-technical user can update those approved sections without editing code
- If the external update source fails, the site still renders without crashing
- Public submission flows rely only on email or external services, not custom
  backend storage

## 17. Open Questions for Later Design

These are not blockers for the requirements, but they should be decided during
design:

- Should all updatable content come from one sheet, or from multiple sheets?
- Should updates appear instantly on page load, or only after a scheduled sync?
- What is the preferred limit for number of cards or events per section?
- Should editors be allowed to upload images, or only paste approved URLs?
- Should old event entries automatically expire from display?
- Should there be a manual review step before published updates appear?

## 18. Summary

This product should be a modular React website template hosted on GitHub Pages
that is mostly static, but supports stable, non-technical content updates
through Google Sheets for selected sections. The initial delivered version
should be an example/demo site that shows the feature set without containing
real organization-specific information. The architecture must separate static
text, configurable modules, and structured external content so that the site
stays reliable, extensible, easy to fork, and easy to maintain.
