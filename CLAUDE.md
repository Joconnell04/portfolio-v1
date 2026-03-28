# portfolio-v1

Concept: Hybrid Repository with Minimal List visual restraint.

Principles
- Keep the public surface minimal, with a content-forward presentation.
- Separate source data from presentation components.
- Prefer typed content records for anything imported from Notion.
- Use the Notion Content Hub as the canonical seed source.

Current planning notes
- Notion source database: Portfolio Projects
- Engineering Hub registry database: Projects
- Initial project record: Personal Portfolio - Pro Style
- Deployment target: Vercel
- Content seeding path: Notion -> lib/notion -> content model -> app routes

ClawdBot review loop
- Use `npm run review:portfolio` as the canonical helper for portfolio-v1 handoffs.
- Every feature or visual change follows Architect -> Coder -> Reviewer.
- Architect writes the brief, acceptance criteria, constraints, and any aesthetic guardrails before coding starts.
- Coder implements only the agreed slice with strict TypeScript and narrow data contracts.
- Reviewer rejects slop aggressively and feeds concrete fixes back into the brief.
- Reviewer checklist:
  - human-coded aesthetics
  - zero rounded corners
  - high-contrast
  - no redundant explanatory text
  - deliberate spacing, typography, and motion
  - accessible focus states and contrast
  - no generic or template-looking UI
- If ClawdBot routes through OpenClaw, connect to `ws://127.0.0.1:18789` via the Tailscale IP `100.112.52.51` using the `mac-openclaw-tunnel` key.
