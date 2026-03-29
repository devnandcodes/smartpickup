@AGENTS.md

# SmartPickup

AI-powered soccer tactical analysis web app.

## Stack
- Next.js 16 App Router, TypeScript, Tailwind CSS
- Supabase (Postgres, Auth with Google OAuth, Storage)
- OpenAI GPT-4o-mini (structured outputs via Responses API)
- Zod for schema validation
- Deployed on Vercel

## Architecture rules
- All sports data must be normalized into `CanonicalMatch` before use.
- AI output must be validated against Zod schema before rendering or saving.
- Keep frontend, provider logic, AI orchestration, and database code separate.
- Never couple UI directly to raw provider responses.
- Prefer small composable modules over large files.

## Key files
- `src/types/match.ts` — CanonicalMatch type (core data contract)
- `src/lib/ai/schema.ts` — Zod schema for AI structured output
- `src/lib/ai/analyze-match.ts` — AI orchestration
- `src/lib/sports/provider.ts` — Sports data provider interface + factory
- `supabase/migrations/001_initial_schema.sql` — Database schema

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## Development workflow
- Use mock data provider by default (no API keys needed)
- Set `FOOTBALL_DATA_API_KEY` in `.env.local` to switch to real provider
- Auth requires Supabase project setup with Google OAuth configured
