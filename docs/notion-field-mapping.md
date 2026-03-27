# Notion Field Mapping

## Source A: Engineering Hub -> Projects database
Use this to track the build itself.

- Project Name -> project title
- Status -> lifecycle state
- Owner -> primary DRI
- Branch Strategy -> git strategy note
- CLAUDE.md Path -> pointer to persistent agent context
- Last Agent Run -> operational timestamp
- Repo Link -> remote repository URL

## Source B: Portfolio Content Hub -> Portfolio Projects data source
Use this to seed the portfolio website content.

- Project Name -> canonical project title
- Organization -> brand/client/company label
- Segment -> top-level portfolio category
- Subcategory -> tag array
- Status -> content stage / publish readiness
- Verification -> confidence level on the record
- Featured -> prominence flag
- Portfolio Priority -> ranking signal
- Portfolio Angle -> positioning copy
- Summary -> short overview card text
- Problem -> problem statement
- What I Did -> responsibility summary
- Impact -> outcomes and metrics
- Tech Stack -> technologies and methods
- Links -> primary references
- Notes -> internal detail
- Source Notes -> provenance and follow-up notes
- Timeframe -> when the project occurred
- Website Ready -> readiness for publishing
- Last Updated -> refresh timestamp

## Local typed model
Create a single normalized model that can power both the list page and project detail pages.
