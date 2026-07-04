# Prompt Log — Triage Console Build

All prompts given to Claude Code during this session, in order.

---

## Prompt 1 — Initial spec

I have 40 minutes to build a working prototype for a workshop. The goal is to
show I can plan AND build with AI, phase by phase, testing after each phase.
This is a live demo build — optimize for "works flawlessly when I click things
in front of people" over production quality. No backend, no auth, no database,
no deployment. Everything runs client-side in the browser from seed data.

### The business problem

We're building a triage/decision console for a customer service inbox. For
each incoming request, the system must decide:
1. Priority — which requests to handle first
2. Whether AI can Auto-Resolve it, should Assign it to a human to review/send,
   or must Escalate it (AI does not act)
3. A suggested response (drafted text)
4. An owner (who/what handles it next)
5. A human-readable reason explaining WHY the decision was made

### Fixed scenarios (seed data — use exactly these 5, don't invent more)

1. VIP customer — booking was cancelled (not by them)
2. New customer — wants to book the earliest available slot today
3. Angry customer — was charged twice, demanding a refund
4. Customer — simple pricing question ("how much does X cost?")
5. Customer — urgent issue, explicitly threatens to leave a bad review

### Decision model (lock this in, don't redesign it)

Action = one of: `auto_resolve` | `assign` | `escalate`
- `auto_resolve`: AI sends the response itself, no human needed
- `assign`: AI drafts a response + recommends an owner, but a human reviews/sends
- `escalate`: AI does NOT draft a committal response; this is the "AI should not act" path — human must handle it

Target outcomes per scenario (build the rule engine to reliably produce these):

| # | Scenario | Priority | Action | Owner | Confidence | Why |
|---|----------|----------|--------|-------|------------|-----|
| 1 | VIP booking cancelled | High | assign | Account Manager | ~70% | Fix is clear (rebook) but VIP relationship needs a human touch before contact |
| 2 | New customer, book earliest slot | Medium | auto_resolve | AI Agent | ~90%+ | Low risk, unambiguous, time-sensitive but safe to automate |
| 3 | Charged twice, angry | Critical | escalate | Billing Manager | capped ~30-40% | **Golden edge case**: any financial dispute/refund request must ALWAYS escalate, regardless of how confident the model is about the facts. AI must never promise money back. |
| 4 | Simple pricing question | Low | auto_resolve | AI Agent | ~95%+ | FAQ-style, no risk |
| 5 | Urgent + threatens bad review | Critical | escalate | Support Manager (on-call) | ~medium | Reputational risk + emotional volatility — needs human judgment on tone |

This spread deliberately covers all 3 action types and a full priority range, so
the demo can show "the system decides differently depending on the situation,"
not just one code path.

The **hard rule to implement explicitly** (this is the "edge case" deliverable
the workshop grades on): if a request involves a financial dispute/charge
error, the action is FORCED to `escalate` no matter what other signals say —
write this as an explicit, visible rule in the engine (not just an emergent
side-effect of scoring), so it's easy to point at in the demo and say "here's
where we deliberately stop the AI from acting."

### Tech stack (decided, don't re-litigate)

Vite + React + TypeScript + Tailwind + Vitest. Single-page app, no router (only
2 views, toggle with local state). This gets us fast scaffolding, a real
testable rules module, and a UI that looks professional with minimal CSS work.

### Pages & flow

**Page 1 — Decision Queue (default view)**
Table of all requests, sorted by priority (Critical → High → Medium → Low).
Columns: Priority badge | Customer/Scenario | AI Confidence % | Recommended
Action | Owner | Reason (short) | Status (Pending / Auto-resolved / Escalated).
A "Simulate incoming request" button appends one of the 5 seed scenarios (pick
next unused one, or re-shuffle) to the queue live, running it through the
engine in front of the viewer — THIS is the "at least one automated workflow"
deliverable: the system decides and, for `auto_resolve` cases, flips its own
status to "Auto-resolved" without any click.

**Page 2 — Request Detail** (click a row to open)
Full request text, full list of triggered reasoning signals (bullet list, not
just one sentence), the full suggested response draft, and:
- if `auto_resolve`: a "✅ Sent automatically" state
- if `assign`: a "Review & Send" button (human-in-the-loop, doesn't need to
  actually send anywhere, just changes status to "Sent by [Owner]")
- if `escalate`: a prominent "⚠️ AI will not act — escalated to [Owner]" banner,
  reason bullets, and NO drafted response (or a clearly labeled "draft only,
  requires human rewrite" if you want to show one)
Back button returns to the Queue.

### Build in phases. After each phase, STOP and wait for me to test before continuing.

**Phase 0 — Setup (~5 min)**
Scaffold Vite+React+TS+Tailwind+Vitest. Empty structure: `src/types.ts`,
`src/data/scenarios.ts`, `src/engine/decisionEngine.ts`, `src/components/`.
Test gate: `npm run dev` boots, shows a placeholder title.

**Phase 1 — Domain model & seed data (~5 min)**
Define types: `Priority`, `Action`, `Owner`, `Request`, `Decision`. Hardcode the
5 scenarios as realistic request objects (customer name, tier, category,
message text, timestamp).
Test gate: no TS errors, seed data visibly typed correctly.

**Phase 2 — Decision engine (~10 min)** — this is the "AI"
Implement `decide(request: Request): Decision`, rule-based (no external API
calls — keep the live demo 100% reliable, no network dependency). Implement
the financial-dispute-always-escalates rule as an explicit early-return, not
buried in scoring math. Write Vitest unit tests, one per scenario, asserting
the target outcomes in the table above — especially a test proving scenario 3
escalates even if you tweak its other signals to look "confident."
Test gate: `npm run test` passes all 5.

**Phase 3 — Decision Queue UI (~10 min)**
Render the table, sorted by priority, color-coded priority badges, wired to
the real engine output (not mock UI data).
Test gate: visually confirm in browser all 5 rows, correct sort order,
escalate rows visually distinct (e.g. red) from auto_resolve (green) and
assign (amber).

**Phase 4 — Automated workflow trigger (~7 min)**
"Simulate incoming request" button. On click, injects the next scenario, runs
it through the engine live, and for `auto_resolve` outcomes auto-flips status
to "Auto-resolved" with no further click — the system making a decision and
acting on it.
Test gate: click through and watch it happen live.

**Phase 5 — Detail view + edge case spotlight (~7 min)**
Full detail page/panel per the flow above. Especially verify scenario 3's
escalate banner reads clearly as "AI intentionally did not act."
Test gate: click into scenario 3 and scenario 4, confirm both look correct.

**Phase 6 — Demo polish (~5 min)**
Tidy spacing/branding, make sure a page refresh doesn't break state, and help
me draft a 90-second demo script: what was built, how the engine decides
(point at the escalation rule), and one thing to build next (e.g. "swap the
rule engine for a real LLM to draft nuanced responses, keep the escalation
guardrail as a hard rule regardless").

Use the `tdd` skill for Phase 2's tests. Skip `grill-me`/`to-prd`/`to-issues` —
this spec is already locked and there's no time budget for that ceremony; we
can revisit deeper design/architecture skills (`codebase-design`,
`improve-codebase-architecture`) after the workshop if we keep building this.

Before declaring done, self-check against the workshop's actual grading
criteria:
- [ ] Decision screen shows priority, AI confidence, recommended action,
      owner, suggested response, reason
- [ ] At least one automated workflow (decision → triggered action) visible
- [ ] One clear edge case where AI does not act and escalates
- [ ] Whole thing demoable in 90 seconds

use the provided images as references for the design:
https://www.pinterest.com/pin/701928291968547916/

*(Image attached: a travel-booking landing page — cream/off-white background,
bold black display type, orange rounded-pill CTA buttons, rounded card imagery.
Used as the visual reference for the queue UI's palette and shapes.)*

---

## Prompt 2

go

*(after Phase 0 test gate)*

---

## Prompt 3

perfect lets move to phase 2

*(Phase 1 and Phase 2 were built together since Phase 2 depends on Phase 1's types/seed data)*

---

## Prompt 4

go

*(after Phase 1+2 test gate — moved into Phase 3)*

---

## Prompt 5

go

*(after Phase 3 test gate — moved into Phase 4)*

---

## Prompt 6

go

*(after Phase 4 test gate — moved into Phase 5)*

---

## Prompt 7

go

*(after Phase 5 test gate — moved into Phase 6, demo polish + script)*

---

## Prompt 8 — Requesting improvements after the phased build was complete

ok nice, its perfect, however i think that we need to make some improvmental
features, like:
- a user input for the request, so it shows that the system is not hardcoded,
- an email connector maybe with the highglighted issue request to the support
  manager email, we can put ours now.

do u have any other improvmental suggestions that we can present and it would
show the project in a better way of our understanding?

*(Follow-up decision, via a clarifying question: asked which additional
suggestions — confidence-vs-threshold bar, decision audit log, override
control, or SLA/aging indicator — to build next. Answer: "None — stop here.")*

---

## Prompt 9 — Design system integration request

Apply this exact color palette to the project. This is from our MYBiz app
(Next.js + Tailwind CSS v4).

Add these CSS variables to the global stylesheet:

LIGHT THEME (:root):
  --background: #F9F7F3       /* warm off-white page bg */
  --foreground: #424242       /* dark gray text */
  --card: #FFFFFF
  --card-foreground: #424242
  --popover: #FFFFFF
  --popover-foreground: #424242
  --primary: #424242
  --primary-foreground: #FFFFFF
  --secondary: #F3F4F6
  --secondary-foreground: #424242
  --muted: #F3F4F6
  --muted-foreground: #6B7280
  --accent: #F3F4F6
  --accent-foreground: #424242
  --brand: #FF812E            /* main orange accent */
  --brand-foreground: #FFFFFF
  --brand-soft: #FFF5EE       /* light orange tint for hover/bg */
  --destructive: #EF4444
  --success: #22C55E
  --warning: #F59E0B
  --info: #3B82F6
  --border: #E5E7EB
  --input: #E5E7EB
  --ring: #FF812E
  --radius: 0.625rem

DARK THEME (.dark):
  --background: #2E2E2E
  --foreground: #f5f5f5
  --card: #424242
  --card-foreground: #f5f5f5
  --popover: #3C3C3C
  --popover-foreground: #f5f5f5
  --primary: #f5f5f5
  --primary-foreground: #3C3C3C
  --secondary: #4A4A4A
  --secondary-foreground: #f5f5f5
  --muted: #4A4A4A
  --muted-foreground: #a1a1a1
  --accent: #4A4A4A
  --accent-foreground: #f5f5f5
  --brand: #FF812E            /* orange stays the same in dark mode */
  --brand-foreground: #FFFFFF
  --brand-soft: #3a2a1f
  --destructive: #f87171
  --success: #4ade80
  --warning: #fbbf24
  --info: #60a5fa
  --border: #5A5A5A
  --input: #5A5A5A
  --ring: #FF812E

CHART COLORS (same tokens for both themes):
  Light: #FF812E, #3B82F6, #22C55E, #F59E0B, #8B5CF6
  Dark:  #FF812E, #60a5fa, #4ade80, #fbbf24, #a78bfa

KEY DESIGN NOTES:
- The brand color is #FF812E (orange) — use it for CTAs, active states, focus
  rings, and scrollbars
- Background is warm off-white (#F9F7F3), NOT pure white — gives a soft paper
  feel
- Dark mode uses dark grays (#2E2E2E, #424242, #4A4A4A), NOT pure black
- Border radius is 0.625rem (10px) — rounded but not pill-shaped
- Scrollbars: thin, orange (#FF812E) thumb, transparent track

*(Interrupted mid-implementation — see Prompt 11)*

---

## Prompt 10 — Sent while the above was still being applied

keep in mind that only 2 staff members are available,
3 appointment slots left today.
refunds above a limit need manager approval.
VIP list is a knowledge base available

*(Follow-up decision, via a clarifying question: asked how deep to take these
operational constraints — light-touch reasoning context only, real branching
logic, or just the refund threshold. Answer: "Light touch.")*

---

## Prompt 11 — Reverting the palette mid-flight

restart the colort to what they were

*(Reverted index.css, tailwind.config.js, and the three badge components back
to the original cream/orange/ink palette from Phase 3, since the MYBiz
palette work was interrupted before finishing.)*

---

## Prompt 12 — This request

ok put all the prompts used in one singe file so i can submit it
