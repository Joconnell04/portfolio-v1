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
- docs/ for specs and planning

## Environment
- Copy .env.example to .env.local in your local checkout.
- Add your OpenAI and Supabase credentials there.
- .env.local is ignored by git.

## Scripts
- npm run dev
- npm run build
- npm run lint
- npm run typecheck
