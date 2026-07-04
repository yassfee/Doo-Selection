# Doo Selection — Triage Console

A client-side prototype of a triage/decision console for a customer service
inbox. For each incoming request, a rule-based engine decides:

1. **Priority** — which requests to handle first
2. **Action** — `auto_resolve` (AI handles it), `assign` (AI drafts, human
   sends), or `escalate` (AI does not act, human takes over)
3. A suggested response draft
4. An **owner** — who/what handles it next
5. A human-readable **reason** for the decision

No backend, no auth, no database — everything runs in the browser from seed
data.

## Key rule

Any request involving a financial dispute or billing error is **forced to
`escalate`**, regardless of confidence — the AI must never promise a refund.
This is implemented as an explicit rule in the decision engine, not an
emergent side effect of scoring.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Vitest for the engine's unit tests

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run the decision engine tests
npm run build    # type-check and build for production
```

## Project structure

- `src/engine/` — the classification and decision logic (`classify.ts`,
  `decisionEngine.ts`, `queue.ts`) plus their tests
- `src/components/` — UI components (queue table, request detail, badges,
  new-request form)
- `src/data/scenarios.ts` — seed data (fixed demo scenarios)
- `src/types.ts` — shared types
- `PROMPTS.md` — the full prompt log from the Claude Code build session
