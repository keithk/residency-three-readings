# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**The Disagreement Dataset** — a Propel research artifact. Ten SNAP scenarios where three personas (legal aid attorney, eligibility worker, SNAP director) read the same case three different ways. The artifact is a portfolio / blog companion / research entry point. **Design IS the deliverable** — read `PRODUCT.md` and `DESIGN.md` before making any visual or copy decisions.

## Commands

Package manager is **bun** (see `bun.lock`).

```bash
bun install           # install deps
bun run dev           # vite dev server on http://127.0.0.1:5757 (strictPort)
bun run build         # vue-tsc --noEmit && vite build  -- this is also the typecheck
bun run preview       # serve the production build
```

There is no test suite and no linter configured. `bun run build` is the only correctness gate — run it after substantive edits.

## Architecture

A Vue 3 + TypeScript SPA (Composition API, `<script setup>`). Hash-based router, no Vue Router, no Pinia. Everything is in-memory; there's no backend.

**Two views, driven by `useRoute`:**
- `#/` → `ScenarioIndex` (hero, thesis, persona cards, scenario list, colophon)
- `#/s/:scenarioId/:step` → `ScenarioView` (a stepped walkthrough of one case)

`src/composables/useRoute.ts` parses `location.hash` into a tagged `Route`. Navigation writes `location.hash` and listens for `hashchange`. There is one module-level `route` ref shared across consumers — refcounted listener attach/detach in `useRoute()`.

**Step machine (`useStepState.ts`):** Each scenario is a linear sequence: `facts → walkthrough[0..n] → persona(legal) → persona(worker) → persona(director) → reveal`. `stepKind(scenario, step)` maps an integer step to a tagged variant. `ScenarioView` listens for `←/→/Esc` keys and calls `navigate()` accordingly. The step count is derived from `scenario.walkthrough.length`, so adding/removing walkthrough entries reshapes the route space — old `#/s/01/5` URLs may land on a different step.

**Scenario data shape (`src/data/types.ts`):** A `Scenario` carries `facts` (HTML strings), `walkthrough` (ordered annotation steps, each with an optional `key`), `personas` (a record keyed by `PersonaId = "legal" | "worker" | "director"`), and a `confidence` payload for the reveal. Each persona has `pulls` (its emphasis on specific phrases) and `weights` (a distribution that should sum to 100).

**The `mark[data-key="..."]` mechanism is load-bearing.** `facts` strings embed `<mark data-key="cohabit">…</mark>`. `CaseFile.vue` queries `mark[data-key=...]` and toggles `data-highlighted` / `data-persona` / `data-pulse` based on the current step. Walkthrough entries and persona pulls reference these same keys. **Keys must match exactly** between `facts`, `walkthrough[*].key`, and `personas[*].pulls[*].key` — there is no validation; mismatches silently fail to highlight.

**Adding a scenario:** see the comment in `src/data/scenarios/index.ts`. Create `src/data/scenarios/NN-name.ts` exporting a full `Scenario`, import it into `index.ts` in order, and remove the matching stub from `stubs.ts`. Stubs render in the index as locked rows; `App.vue` refuses to navigate into a locked scenario.

**Styling.** Three global CSS files imported once by `main.ts`: `tokens.css` (OKLCH design tokens + grid/spacing vars), `base.css`, `typography.css`. Components use scoped styles. Most styling is in the components themselves. Path alias `@/*` → `src/*`.

## Design guardrails (from DESIGN.md / PRODUCT.md)

These aren't preferences. Treat them as constraints.

- **Document-first.** The case file is the substrate; personas annotate it. **No card grids.** Specifically no three-column persona comparison — that's the obvious shape and it's explicitly refused.
- **OKLCH tokens only.** Pull colors from `tokens.css`; don't hardcode hex or oklch literals in components. Use `color-mix(in oklch, …)` for blends.
- **Type.** Serif everywhere (Source Serif 4); JetBrains Mono for metadata/micro labels. No sans-serif. Body capped at 70ch, marginalia at 32ch.
- **Absolute bans:** no side-stripe accents, no gradient text, no glass cards, no hero-metric template, **no em dashes** (use commas/colons/periods/parentheses).
- **Tone:** editorial seriousness, civic weight. Avoid AI marketing tone, dashboard chrome, civic-tech beige cheerfulness, "Anthropic/NYT pastiche".
- **Motion** uses `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) and `--ease-quart`. Don't animate layout — prefer opacity/transform/`clip-path`.

## Conventions worth knowing

- Vue components use `<script setup lang="ts">` with `defineProps<{...}>()`. Match this style.
- HTML in data (`facts`, persona `reading`, `pulls[].text`, walkthrough `note`) is rendered via `v-html`. All such content is authored in `src/data/`, so it's trusted — but don't introduce `v-html` for user-supplied or external content.
- `verbatimModuleSyntax` is on: type imports must be `import type { … }`.
- Vite dev server is pinned to port 5757 with `strictPort: true` — if it won't start, something else is on the port.
