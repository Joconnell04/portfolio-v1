# Technical Specification

## Product goal
Build a personal portfolio that combines:
- Concept 3: Hybrid Repository
- Concept 2: Minimal List visual restraint

The site should feel editorial, fast, and highly structured. Content comes from Notion and is rendered in a sparse, list-first UI.

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle transitions
- shadcn/ui for low-level primitives
- Vercel for deployment

## Core architecture
### 1. Presentation layer
The app routes own the public pages, with a minimal landing page, project index, and project detail pages.

### 2. Content layer
Notion data is not embedded directly in UI components. It is normalized into typed records in lib/notion and/or content/.

### 3. Data layer
A small set of TypeScript schemas define the portfolio domain:
- portfolio projects
- project highlights
- featured metrics
- external links
- source notes

### 4. Hybrid repository model
This repo should support both:
- code-first development in GitHub
- content-first updates from Notion

That means the repo needs explicit mapping files so seeding can be deterministic.

## Notion integration plan
Use @notionhq/client with a dedicated integration secret stored in environment variables.

Primary operations:
- retrieve a page for static content blocks and metadata
- query a data source for Portfolio Projects rows
- map each row into a local typed model
- seed or refresh the app content without hand-editing UI files

Recommended environment variables:
- NOTION_API_KEY
- NOTION_PORTFOLIO_CONTENT_HUB_PAGE_ID
- NOTION_PORTFOLIO_PROJECTS_DATA_SOURCE_ID

## Route plan
- / -> minimal editorial home
- /projects -> list view of all projects
- /projects/[slug] -> project detail page
- /about -> concise bio and credibility markers
- /links -> external references and contact links

## Data mapping strategy
The Notion Portfolio Projects source should normalize to a local model with the following groups:
- identity: Project Name, Organization, Segment, Subcategory
- narrative: Summary, Problem, What I Did, Impact, Notes
- provenance: Source Notes, Verification, Last Updated
- positioning: Portfolio Priority, Portfolio Angle, Featured, Website Ready
- utility: Tech Stack, Links, Timeframe, Status, Role

## UI behavior
- large whitespace
- thin dividers
- restrained motion only on hover and page transitions
- no heavy gradient treatment
- compact cards or list rows over large mosaic tiles

## Delivery checkpoints
1. Scaffold repo and data model
2. Connect Notion retrieval and mapping
3. Seed data into local typed records
4. Build the minimal list UI
5. Publish to Vercel
