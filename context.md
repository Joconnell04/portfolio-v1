# context.md

Purpose: Jackson O'Connell's professional personal portfolio.

Stack: Next.js 15, Tailwind CSS, Supabase, Vercel.

Aesthetic: human, anti-slop, brutalist, sharp, zero-radius, high-contrast.

Operating rule: public-facing copy is provided externally. Do not invent or rewrite site copy unless explicitly instructed.

Maintenance rule: keep this file updated as the project evolves so future sessions can recover high-level context quickly.
Progress log
- GitHub heatmap now prefers the authenticated GraphQL contribution calendar with private contributions enabled when GITHUB_TOKEN is present.
- Travel route is being moved from Mission Control to Coordinates and seeded only from the Notion Travel hub.
- Project cards are no longer draggable, and the home project section now includes a View More CTA to /projects.
- Recruiter console starts collapsed on load and the reset-gate button has been removed.
- Travel Coordinates build blocker fixed by escaping the apostrophe in the route shell description, and GitHub heatmap parsing now skips missing contribution dates instead of fabricating values.
