# Three Readings dataset package: README and docs design

**Date:** 2026-05-29
**Author:** Keith Kurson + Claude (brainstormed)
**Status:** Design approved; ready for writing-plans

## Context

The Three Readings artifact ships with a dataset bundle at `dataset/` that mirrors out to a standalone public repo. The current `dataset/README.md` is solid for the "run the included SNAP cases against a model" workflow (schema, three evals, scoring rubric, scenario format), but does not address the second use case the thesis explicitly opens: applying the methodology to other contested-determination domains (diagnosis, underwriting, hiring, claims, appeals).

The package is dropping mid-June 2026 alongside a webinar. The README ecosystem needs to serve two distinct readers self-selecting from a single index, support programmatic batch evaluation as the primary eval workflow, and give an aspiring methodology adopter enough scaffolding (concrete persona-design guidance + one worked sketch in a non-SNAP domain) to start.

The webinar is **not** referenced in the docs; the README is standalone and timeless. The artifact site at the project's homepage serves the thesis and the interactive reading experience.

## Goals

1. A reader landing cold on the standalone repo orients in under 90 seconds and self-selects into one of two tracks: **evaluate** (run the SNAP cases against models) or **design** (build their own dataset for their domain).
2. The **evaluate** track supports programmatic batch evaluation as its primary mode, with hand-scoring as a secondary quick-start path.
3. The **design** track teaches the methodology in enough detail that a competent practitioner can produce a valid dataset for a new domain, including a sketched non-SNAP example.
4. The package ships a small, runnable TypeScript reference scorer that exercises the three evals on a parsed scenario and a parsed model output. Not a framework; a unit demonstrating the scoring algorithm.
5. The package validates as honestly contested-interpretation work, not as a benchmark, not as ground truth, not as legal advice.

## Non-goals

- Building a full eval framework or runner (no model calling, no aggregation across scenarios, no CLI).
- Publishing as an npm or PyPI package.
- Generating sample scored outputs from real models. (Considered and explicitly deferred; readers can produce their own.)
- Writing a second full canonical scenario in a non-SNAP domain. The methodology guide gets one sketched example, not a complete second case.
- Referencing or depending on the mid-June webinar.

## File layout

The `dataset/` folder ships to the standalone repo. New layout:

```
dataset/
├── README.md                       # Index. Orients, splits into two tracks.
├── EVALUATING.md                   # "Run the eval" track (programmatic-lead)
├── DESIGNING.md                    # "Build your own" track
├── SCHEMA.md                       # Schema reference, linked from both tracks
├── scenarios/
│   ├── 01-ex-roommate.md           # (existing, generated from src/data/scenarios/)
│   ├── 02-gig-worker.md
│   ├── 03-mom-money.md
│   ├── 04-eitc-refund.md
│   ├── 05-pending-ssdi.md
│   └── ...                         # 06-10 in progress
├── examples/
│   └── sketch-hiring-screen.md     # The sketched non-SNAP example
└── scorer/
    ├── README.md                   # How to use the scorer
    ├── types.ts                    # ModelOutput, ScoreResult; re-exports Scenario
    ├── score.ts                    # scoreScenario + three per-eval helpers
    └── example.ts                  # Runnable demo against 01-ex-roommate
```

Notes:
- The existing `dataset/README.md` content is treated as raw material; re-distributed and rewritten freely across the new index, `EVALUATING.md`, and `SCHEMA.md`.
- `scenarios/*.md` files remain generated from the canonical TypeScript sources at `src/data/scenarios/`. The build pipeline does not need to change.
- The `scorer/types.ts` mirrors or re-exports the `Scenario` type from `src/data/types.ts` so the scorer stays type-coherent with the dataset it scores.

## File contents

### `README.md` (index)

Compact, ~1.5 page reading time. Sections in order:

1. **What this is.** One sentence + one paragraph.
2. **What's in here.** File map with one-line descriptions per item.
3. **The argument.** Three paragraphs, condensed from the artifact's thesis. Generalizes beyond SNAP, names the "LLM-as-evaluator" failure mode, points at the dataset as instrument.
4. **Pick your path.** Two-link split:
   - "I want to **evaluate a model** against the included SNAP cases" → `EVALUATING.md`
   - "I want to **build my own dataset** for a different contested-determination problem" → `DESIGNING.md`
5. **How the SNAP cases were produced.** One paragraph: synthetic facts, real regulatory ambiguity, sourced from federal regs / state manuals / HR1 / practitioner conversations.
6. **What this dataset is not.** Preserved from current README: not a benchmark, not ground truth, not legal advice.
7. **Status.** Which scenarios are published.
8. **Citation.** Preserved from current README.
9. **License.** CC BY 4.0 for dataset content (`scenarios/`, `examples/`, prose docs). MIT for the scorer code (`scorer/`). Stated explicitly at the bottom.

The index never recapitulates schema, scoring methodology, or workflow. Those live in the track docs.

### `EVALUATING.md`

Programmatic-first track. Sections:

1. **What you'll do here.** 2-3 sentences: parse → prompt → score, what you get out.
2. **The three evals at a glance.** One paragraph each (disaggregation, calibration, phrase-grounding), naming what each measures and what failure looks like.
3. **Workflow.**
   1. Load a scenario (YAML frontmatter parse, types, example loader snippet in TS).
   2. Construct the prompt (structured-output template asking for named readings, per-reading calls, phrase citations, confidence distribution summing to 100).
   3. Call the model (JSON mode / structured output, temperature 0, system-prompt guidance, reasoning-model handling: score the final answer, not the trace, unless explicitly intended).
   4. Score (pointer to the scorer, what it returns).
4. **Disaggregation scoring detail.** Coverage + persona mapping. Edge case: model produces a 4th interpretation not in the schema (treat as extra, doesn't penalize, but flag). Persona-mapping is the heuristic part: string-similarity / archetype-keyword match with a confidence flag, doc tells reader to spot-check.
5. **Calibration scoring detail.** Paired factual-QA item methodology. The gap metric. Per-reading max-confidence cap (`max_single_reading_confidence`, currently 70). Explicit note: calibration scoring requires external input (the paired factual-QA confidence), which cannot be computed from the scenario file alone.
6. **Phrase-grounding scoring detail.** Surfaced / missed / misattributed. What counts as a cite: exact-substring match against `phrase_keys[*].text` with light normalization (whitespace, quotes). Misattribution is the most diagnostic signal.
7. **The reference scorer.** Where it lives (`scorer/`), what it takes in, what it returns, sample invocation, pointer to `scorer/example.ts`.
8. **Hand-scoring quick path.** Single copy-pasteable prompt + inline grading checklist. Explicitly secondary.
9. **Reporting results.** Suggested per-model summary shape: `{disaggregation_pass_rate, calibration_pass_rate, phrase_grounding_pass_rate}` across the dataset, plus per-scenario detail. Note about sample size (n=10 is a unit test, not a leaderboard).
10. **Edge cases and model behaviors to watch for.** Models that refuse percentages. Models that name interpretations only in reasoning traces. Models that produce three structurally identical readings. Reasoning models that change between thought and answer.
11. **Schema reference.** Link to `SCHEMA.md`.

### `DESIGNING.md`

"Build your own" track. Sections:

1. **When this methodology fits.** Decision criteria. Quick test: *if three competent professionals from different roles read the same case, would they land in different places with reasons?* If no → factual QA, this isn't the right tool. Concrete fits named (from the thesis): eligibility, diagnosis, underwriting, hiring, admissions, claims, content moderation appeals. Explicit anti-fits: anything with a single ground truth.
2. **The shape of a contested case.** Enough fact to be answerable, enough ambiguity that no path is closed off. Anchored in real regulatory / policy / practice ambiguity, not invented. The interpretation question phrased the way a practitioner would phrase it. Synthetic data with real-shape situations.
3. **Designing personas.** Three roles with distinct institutional pressures, not demographic difference. Each persona: default frame, what they push toward, what they're cautious about, audit posture. Anti-patterns: caricature, good-cop/bad-cop/neutral-cop, three flavors of the same role, demographic-difference-as-persona.
4. **Picking interpretations.** 2-4 named outcomes, usually 3. Each is a label + one-sentence gloss. Strong pattern: one interpretation should be the *not-yet-decided* call (verify further, escalate, send back). Most contested cases have this as a real outcome; excluding it forces false confidence.
5. **Identifying load-bearing phrases.** Find the phrases a persona would *quote* to defend a reading. Tag with short keys. Cross-check: every persona's call grounded in at least one phrase (validator enforces this).
6. **Setting the target distribution.** **Lead with honesty:** the target distribution is an opinionated read of practice, not a measurement. State that plainly. Then offer the practitioner-poll method (ask several practitioners independently, look at the spread, preserve the shape) as the recommended approach. The baseline single-answer is observed model behavior; run your model on the case before building the target.
7. **A sketched example: hiring screen, same résumé.** Pointer to `examples/sketch-hiring-screen.md` with one paragraph framing.
8. **Validating your dataset.** What the validator enforces. How to run it. What it won't catch (semantic problems: personas too similar, cases not actually contested).
9. **Common failure modes.** Capped at five:
   1. Personas too similar (the disagreement disappears).
   2. "Right answer" obvious to a domain expert (not actually contested).
   3. Phrase keys cited but not anchoring the reasoning (decorative).
   4. Calibration targets too crisp (90/5/5, which defeats the purpose).
   5. Confusing "contested" with "uncertain" (lacking facts ≠ competent disagreement on the facts you have).
10. **Schema reference.** Link to `SCHEMA.md`.

### `SCHEMA.md`

Reference doc. Both tracks link to it. Lifts the schema documentation out of the current README and expands lightly.

Sections:

1. **The scenario file format.** YAML frontmatter + markdown body.
2. **Field reference.** Every frontmatter field, type, required/optional, what it's for. Includes the SNAP-specific fields (`policy_zone`, `hr1_relevance`, `hr1_note`) with a note that these are domain-specific; adapters should rename or drop them for their domain.
3. **Cross-field invariants.** What the validator enforces:
   - All `phrase_keys[*].key` referenced by `readings[*].grounded_in` must exist in `phrase_keys`.
   - All `readings[*].weights[*].interpretation` must match an `interpretations[*].label`.
   - `readings[*].weights` must sum to 100.
   - `readings[*].call` must match an `interpretations[*].label`.
   - `calibration.baseline_single_answer` must match an `interpretations[*].label`.
   - `calibration.target_distribution` must sum to 100, and each entry must match a named interpretation.
4. **TypeScript types.** Mirror or excerpt from `src/data/types.ts` so the reference is self-contained.
5. **Adapting the schema to a new domain.** Brief note: rename SNAP-specific fields, keep the core (`interpretations`, `phrase_keys`, `readings`, `calibration`) intact. The persona slugs (`legal` / `worker` / `director`) become whatever your domain's three roles are. The included reference scorer accepts arbitrary persona slugs (it does not lock to the SNAP-specific `PersonaId` union); adapters can run the scorer on their dataset without forking it.

### `examples/sketch-hiring-screen.md`

Sketched non-SNAP example. Demonstrates the methodology in motion in two pages without producing a full second canonical scenario.

Content:

- **The case.** A candidate résumé for a mid-level engineering role with a non-linear path: three years at a name-brand company → eighteen months at a stealth startup that doesn't appear to have shipped → six months of independent contracting → applying back to a larger company. Strong references from the name-brand stint, ambiguous references from the startup, no references from the contracting period. A side project on GitHub with significant commits but no users.
- **The interpretation question.** "Is this candidate a strong yes, a strong no, or somewhere a hiring committee needs more signal before deciding?"
- **The three personas.**
  - *Hiring manager (the operator).* Pushes toward signal-from-output. Looks at the GitHub project, the references from the name-brand stint. Default frame: *can this person ship in my codebase by month three.* Audit posture: their team's velocity is reviewable by their VP.
  - *Recruiter (the pipeline).* Pushes toward time-to-fill and offer-acceptance probability. Looks at the gaps, the contract period, the absence of recent references. Default frame: *is this candidate going to convert and stay.* Audit posture: their funnel metrics are reviewable monthly.
  - *Talent partner / hiring bar reviewer (the institution).* Pushes toward consistency across requisitions. Looks at the role's leveling rubric. Default frame: *does this hire degrade the calibration of the hiring system.* Audit posture: their decisions are reviewable across cohorts and quarters.
- **Phrase keys (sketched, not exhaustive).** A handful of load-bearing snippets keyed by short slug: the gap, the GitHub commits, the stealth-startup ambiguity, the references shape.
- **Sketched weights per persona (directional only, no full distributions).** Manager: ~60% toward yes. Recruiter: ~50% toward verify-further. Partner: ~50% toward no.
- **Calibration target shape.** One paragraph: more spread than a model would produce; verify-further is a legitimate landing.
- **Rails paragraph (at the end).** Explicit: this example demonstrates contested interpretation around fit and signal, not protected-class attributes. A hiring dataset that hangs on race / gender / age signals is a different (and more fraught) instrument; this methodology has nothing to say about that one.

Explicitly **not** in the sketch: full case body, full weight tables, `calibration` block. Showing the moves, not producing a second canonical scenario.

### `scorer/` (TypeScript reference scorer)

**Goal.** Prove the scoring algorithm is concrete and runnable. Not a framework.

**Files.**

- `scorer/README.md`: usage. Sample invocation. What the reader supplies that the scorer can't infer (the paired factual-QA confidence for the calibration eval).
- `scorer/types.ts`: type definitions. Defines `ModelOutput`, `ScoreOptions`, `ScoreResult`, and per-eval result types. **Defines its own `ScorerScenario` type with persona keys typed as `string` rather than the SNAP-specific `PersonaId = "legal" | "worker" | "director"` from `src/data/types.ts`.** This is deliberate: the scorer ships as a reference implementation that works on adapted datasets with different persona slugs (e.g., `manager` / `recruiter` / `partner` in the hiring sketch). The scorer parses YAML frontmatter into `ScorerScenario` and never depends on the project's domain-specific types. A short note in `scorer/README.md` explains the rationale.
- `scorer/score.ts`: public surface and per-eval helpers.
- `scorer/example.ts`: runnable demo. Loads `dataset/scenarios/01-ex-roommate.md`, parses frontmatter, runs a hardcoded mock model output through the scorer, prints the `ScoreResult`. Acts as both demo and smoke test.

**Public surface.**

```ts
scoreScenario(scenario: Scenario, output: ModelOutput, options?: ScoreOptions): ScoreResult

scoreDisaggregation(scenario: Scenario, output: ModelOutput): DisaggregationResult
scoreCalibration(scenario: Scenario, output: ModelOutput, pairedFactualConfidence: number): CalibrationResult
scoreGrounding(scenario: Scenario, output: ModelOutput): GroundingResult
```

`ScoreOptions` carries the paired factual-QA confidence. Without it, the calibration eval is skipped and `ScoreResult.calibration.status` is `"skipped"`. The reader can also invoke per-eval if they're building their own pipeline.

**`ModelOutput` shape.**

```ts
type ModelOutput = {
  readings: Array<{
    name: string;              // model's name for this reading
    call: string;              // the interpretation it lands on
    confidence: number;        // 0-100
    citedPhrases: string[];    // verbatim or near-verbatim quotes from the case
    reasoning?: string;        // optional, not scored
  }>;
};
```

Reader is responsible for getting their model to produce this shape (the prompt template in `EVALUATING.md` does that). Scorer doesn't call any model.

**`ScoreResult` shape.**

```ts
type ScoreResult = {
  scenarioId: string;
  disaggregation: {
    status: "pass" | "partial" | "fail";
    coverage: { surfaced: string[]; missed: string[] };
    personaMapping: { matches: Record<string, string>; confidence: "high" | "low" };
    detail: string;
  };
  calibration: {
    status: "pass" | "partial" | "fail" | "skipped";
    gap?: number;
    maxReadingConfidence: number;
    detail: string;
  };
  grounding: {
    status: "pass" | "partial" | "fail";
    surfaced: string[];
    missed: string[];
    misattributed: Array<{ key: string; expectedPersona: string; citedUnder: string }>;
    detail: string;
  };
};
```

**Persona mapping** is heuristic: string-similarity / archetype-keyword match. `personaMapping.confidence` flags when the match is uncertain. The doc tells the reader to spot-check.

**Dependencies.** YAML frontmatter parsing (`gray-matter` or similar). Nothing else.

**What the scorer doesn't do.**

- No model calling. No HTTP. No streaming.
- No reporting / aggregation across scenarios. Reader builds that loop.
- No persona-mapping deep-dive (heuristic with a flag, per above).

## Decisions made during brainstorming

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Track structure | Two equal tracks, reader self-selects | User wants both audiences served on parity |
| Eval-track consumption mode | Programmatic-lead | Audience is AI researchers; iterate at scale |
| Tooling | Document existing validator + ship a tiny reference scorer | Concrete and runnable, not a framework |
| Worked example concreteness | Methodology + one sketched non-SNAP example | Concrete enough to be useful, light enough to ship |
| Scorer language | TypeScript | Matches project stack, shares types with `src/data/types.ts` |
| Distribution | The standalone dataset repo (already exists) | No new packaging work needed |
| Webinar relationship | Not referenced | README is standalone and timeless |
| Sketched-example domain | Hiring screen, same résumé | Broad recognition, demonstrates contested interpretation without invoking protected-class attributes |
| Existing README content | Use as raw material, rewrite freely | Most content is solid but reshape/redistribute serves the new structure |
| Persona-mapping in disaggregation eval | Scorer does heuristic match with a confidence flag | Keeps batch eval automatic; doc tells reader to spot-check |
| Target-distribution methodology framing | Lead with honesty (opinionated read of practice, not measurement) | Avoids implying false rigor |
| Failure modes list cap | 5 | Useful range without bloat |
| Hiring sketch placement | Separate file in `examples/` | Keeps `DESIGNING.md` from ballooning; room to add more sketches |
| Rails paragraph placement (hiring sketch) | End of the sketch | Let the example demonstrate the methodology first |
| License | CC BY 4.0 (dataset) + MIT (scorer code) | Standard split; attribution-required on the contested content, permissive on the tools |

## Open questions for implementation

None blocking. The following may surface during writing:

- Whether `SCHEMA.md` needs a JSON Schema / Zod export for programmatic validators outside the project. Defer until a reader asks.
- Whether the scorer's `example.ts` should ship a recorded model output alongside (so the demo prints real-looking scoring). Currently spec says hardcoded mock; revisit if it reads as too synthetic.
- Whether to add a `CHANGELOG.md` to the dataset folder. Defer; the standalone repo's git history serves this for now.

## What gets implemented

The writing-plans skill should produce a step-by-step plan covering:

1. Create `dataset/SCHEMA.md` (extract + expand from current README).
2. Create `dataset/EVALUATING.md` (11 sections per spec above).
3. Create `dataset/DESIGNING.md` (10 sections per spec above).
4. Create `dataset/examples/sketch-hiring-screen.md` (per spec).
5. Rewrite `dataset/README.md` as the index (9 sections per spec).
6. Implement `dataset/scorer/types.ts`, `score.ts`, `example.ts`, and `scorer/README.md`.
7. Add the scorer's dependency (`gray-matter` or equivalent) to `package.json` if not already present.
8. Verify by running `scorer/example.ts` end-to-end on `01-ex-roommate.md`.
9. Sanity-check that `bun run build` still passes.
