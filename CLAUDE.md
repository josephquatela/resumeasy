# Resume Builder — Orchestrator Instructions

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Supabase (Postgres + Auth + Edge Functions if needed)
- Database: Supabase (Postgres + Auth)
- Deployment: Vercel

## Agent Roster
You have 5 specialist agents. Always delegate via agent teams — do not implement directly.

| Agent       | Owns                                              |
|-------------|---------------------------------------------------|
| frontend    | /src/components, /src/app, /src/styles, /public   |
| database    | /supabase, schema, migrations, RLS policies       |
| backend     | /src/lib, /src/store, /src/hooks, auth flows      |
| contractor  | integration testing, cross-agent conflict checks  |

## Orchestration Rules
1. **Decompose first.** Break every feature into frontend / backend / database tasks before spawning agents.
2. **Database runs first.** Schema must exist before backend or frontend touch data.
3. **Parallel when safe.** Frontend and backend can run in parallel once schema is settled.
4. **Contractor always closes.** After any multi-agent feature, spawn the contractor to verify integration.
5. **File ownership is strict.** Agents must not write outside their owned directories.

## Spawning Pattern
Use agent teams to spawn agents of the right expertise for each spec.

## Feature Workflow
1. Spawn database agent → define schema + migrations
2. In parallel: spawn frontend + backend + user agents with schema context
3. Spawn contractor agent to verify all pieces connect
4. Report back to user with summary + any open issues