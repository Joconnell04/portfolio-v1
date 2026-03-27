# portfolio-v1

Next.js 15 portfolio scaffold for Jackson O’Connell.

## Stack
- Next.js 15
- Tailwind CSS
- Framer Motion
- shadcn/ui
- Vercel

## Structure
- app/ for routes and shells
- components/ for reusable UI
- content/ for portfolio content primitives
- lib/notion/ for Notion data fetching and seeding helpers
- lib/recruiter/ for recruiter retrieval and prompt wiring
- docs/ for specs and planning

## Environment
- Copy .env.example to .env.local in your local checkout.
- Add your OpenAI and Supabase credentials there.
- Required for recruiter chat: OPENAI_API_KEY, OPENAI_MODEL, SUPABASE_URL, and either SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.
- Optional embedding override: OPENAI_EMBEDDING_MODEL.
- .env.local is ignored by git.

## Scripts
- npm run dev
- npm run build
- npm run lint
- npm run typecheck
