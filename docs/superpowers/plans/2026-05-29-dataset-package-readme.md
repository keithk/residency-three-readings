# Dataset package README + scorer implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `dataset/` folder as a self-contained package with a two-track README ecosystem (run-the-eval and build-your-own), a sketched non-SNAP example, and a small TypeScript reference scorer that exercises the three evals.

**Architecture:** Six markdown docs in `dataset/` (index `README.md`, `EVALUATING.md`, `DESIGNING.md`, `SCHEMA.md`, `examples/sketch-hiring-screen.md`, `scorer/README.md`). A TypeScript scorer in `dataset/scorer/` with three pure eval functions plus a wrapper, sharing no types with the SNAP-specific `src/data/types.ts` so adapted datasets work. Build the scorer first (it's the load-bearing concrete bit the docs reference), then docs in dependency order (SCHEMA → EVALUATING and DESIGNING → sketch → index README).

**Tech Stack:** TypeScript, Bun (test runner + script execution), `gray-matter` for YAML frontmatter parsing. Markdown for all docs.

**Spec:** `docs/superpowers/specs/2026-05-29-dataset-readme-design.md`

**Style constraints (enforced across all written content):**
- No em dashes (`—` or `--`). Use commas, colons, semicolons, periods, parentheses.
- Source Serif voice on prose: editorial-serious, no AI marketing tone, no dashboard chrome.
- Don't reference the mid-June webinar.
- Cross-link liberally: every doc links to the index and to other tracks as relevant.

---

## Task 0: Setup

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Verify clean working tree for dataset/ work**

```bash
git status
```

Expected: any pre-existing modifications are unrelated to `dataset/`, `scripts/`, or `package.json`. If `dataset/` has uncommitted changes, stash or commit them before proceeding.

- [ ] **Step 2: Add gray-matter dependency**

```bash
bun add gray-matter
```

Expected: `package.json` now lists `gray-matter` under dependencies. `bun.lock` updates.

- [ ] **Step 3: Verify Bun test runner works**

```bash
bun test --help
```

Expected: prints Bun's test runner help. No config needed; Bun discovers `*.test.ts` files automatically.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add gray-matter for scorer frontmatter parsing"
```

---

## Task 1: Scorer types

**Files:**
- Create: `dataset/scorer/types.ts`

- [ ] **Step 1: Create types file**

```ts
// dataset/scorer/types.ts
// Type definitions for the Three Readings reference scorer.
//
// These types are deliberately decoupled from src/data/types.ts so the scorer
// works on adapted datasets with arbitrary persona slugs (manager / recruiter /
// partner, physician / specialist / case-manager, etc.), not only the SNAP
// dataset's legal / worker / director.

export interface Interpretation {
  label: string;
  gloss: string;
}

export interface PhraseKey {
  key: string;
  text: string;
}

export interface WeightEntry {
  interpretation: string;
  value: number;
}

export interface ScorerReading {
  persona: string;
  archetype: string;
  emphasis: string;
  call: string;
  weights: WeightEntry[];
  grounded_in: string[];
}

export interface CalibrationData {
  baseline_single_answer: string;
  baseline_confidence: number;
  baseline_note?: string;
  target_distribution: WeightEntry[];
  expected_targets: {
    max_single_reading_confidence: number;
    min_named_readings: number;
    min_grounding_phrases_per_reading: number;
    min_factual_qa_gap_points: number;
  };
}

/**
 * The shape the scorer parses out of dataset/scenarios/*.md frontmatter.
 * Persona keys are strings, not a fixed union: an adapted hiring dataset can
 * use {manager, recruiter, partner} and this type still describes it.
 */
export interface ScorerScenario {
  id: string;
  title: string;
  interpretation_question: string;
  interpretations: Interpretation[];
  phrase_keys: PhraseKey[];
  readings: Record<string, ScorerReading>;
  calibration: CalibrationData;
}

/**
 * What the scorer expects a model to produce. Reader is responsible for
 * prompting their model into this shape (see EVALUATING.md).
 */
export interface ModelOutput {
  readings: Array<{
    name: string;
    call: string;
    confidence: number;
    citedPhrases: string[];
    reasoning?: string;
  }>;
}

export interface ScoreOptions {
  /** Confidence the same model reports on a matched factual-QA item. Required for the calibration eval. */
  pairedFactualConfidence?: number;
}

export type EvalStatus = "pass" | "partial" | "fail";

export interface DisaggregationResult {
  status: EvalStatus;
  coverage: { surfaced: string[]; missed: string[]; extras: string[] };
  personaMapping: {
    matches: Record<string, string>;
    confidence: "high" | "low";
  };
  detail: string;
}

export interface CalibrationResult {
  status: EvalStatus | "skipped";
  gap?: number;
  maxReadingConfidence: number;
  detail: string;
}

export interface GroundingResult {
  status: EvalStatus;
  surfaced: string[];
  missed: string[];
  misattributed: Array<{ key: string; expectedPersona: string; citedUnder: string }>;
  unanchored: string[];
  detail: string;
}

export interface ScoreResult {
  scenarioId: string;
  disaggregation: DisaggregationResult;
  calibration: CalibrationResult;
  grounding: GroundingResult;
}
```

- [ ] **Step 2: Type-check the new file**

```bash
bun --bun tsc --noEmit dataset/scorer/types.ts
```

Expected: no errors. (If `tsc` complains about isolatedModules / module resolution, add `"compilerOptions": { "module": "esnext", "moduleResolution": "bundler" }` inline or rely on the project's `tsconfig.json`.)

- [ ] **Step 3: Commit**

```bash
git add dataset/scorer/types.ts
git commit -m "feat(scorer): add types for reference scorer"
```

---

## Task 2: Disaggregation scorer (TDD)

**Files:**
- Create: `dataset/scorer/score.test.ts`
- Create: `dataset/scorer/score.ts`

- [ ] **Step 1: Write fixture + first failing test**

```ts
// dataset/scorer/score.test.ts
import { describe, it, expect } from "bun:test";
import { scoreDisaggregation } from "./score";
import type { ScorerScenario, ModelOutput } from "./types";

const fixture: ScorerScenario = {
  id: "test-01",
  title: "Test scenario",
  interpretation_question: "Q?",
  interpretations: [
    { label: "Not in household", gloss: "a" },
    { label: "In household", gloss: "b" },
    { label: "Verify further before deciding", gloss: "c" },
  ],
  phrase_keys: [
    { key: "cohabit", text: "She shares a two-bedroom apartment." },
    { key: "prep", text: "don't really eat together" },
    { key: "rent", text: "Jordan has covered her half" },
  ],
  readings: {
    legal: {
      persona: "Legal aid attorney", archetype: "The advocate", emphasis: "",
      call: "Not in household",
      weights: [
        { interpretation: "Not in household", value: 80 },
        { interpretation: "In household", value: 6 },
        { interpretation: "Verify further before deciding", value: 14 },
      ],
      grounded_in: ["cohabit", "prep"],
    },
    worker: {
      persona: "Eligibility worker", archetype: "The careful processor", emphasis: "",
      call: "Verify further before deciding",
      weights: [
        { interpretation: "Not in household", value: 22 },
        { interpretation: "In household", value: 28 },
        { interpretation: "Verify further before deciding", value: 50 },
      ],
      grounded_in: ["prep", "rent"],
    },
    director: {
      persona: "SNAP director", archetype: "The institution", emphasis: "",
      call: "Verify further before deciding",
      weights: [
        { interpretation: "Not in household", value: 36 },
        { interpretation: "In household", value: 18 },
        { interpretation: "Verify further before deciding", value: 46 },
      ],
      grounded_in: ["cohabit", "rent"],
    },
  },
  calibration: {
    baseline_single_answer: "Not in household",
    baseline_confidence: 95,
    target_distribution: [
      { interpretation: "Not in household", value: 40 },
      { interpretation: "In household", value: 17 },
      { interpretation: "Verify further before deciding", value: 43 },
    ],
    expected_targets: {
      max_single_reading_confidence: 70,
      min_named_readings: 3,
      min_grounding_phrases_per_reading: 1,
      min_factual_qa_gap_points: 20,
    },
  },
};

describe("scoreDisaggregation", () => {
  it("passes when all three interpretations are surfaced with persona-mapped calls", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 60, citedPhrases: [] },
        { name: "The careful processor", call: "Verify further before deciding", confidence: 50, citedPhrases: [] },
        { name: "The institution", call: "Verify further before deciding", confidence: 45, citedPhrases: [] },
      ],
    };
    const result = scoreDisaggregation(fixture, output);
    expect(result.status).toBe("pass");
    expect(result.coverage.surfaced.sort()).toEqual([
      "In household", "Not in household", "Verify further before deciding",
    ].sort().filter(l => result.coverage.surfaced.includes(l)));
    expect(result.coverage.missed).toEqual([]);
    expect(result.personaMapping.confidence).toBe("high");
  });
});
```

- [ ] **Step 2: Run test, confirm it fails**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: fail with "Cannot find module './score'" or similar.

- [ ] **Step 3: Implement minimal scoreDisaggregation**

```ts
// dataset/scorer/score.ts
import type {
  ScorerScenario,
  ModelOutput,
  DisaggregationResult,
} from "./types";

export function scoreDisaggregation(
  scenario: ScorerScenario,
  output: ModelOutput,
): DisaggregationResult {
  const namedLabels = new Set(scenario.interpretations.map((i) => i.label));
  const modelCalls = output.readings.map((r) => r.call);

  const surfaced = Array.from(
    new Set(modelCalls.filter((c) => namedLabels.has(c))),
  );
  const missed = scenario.interpretations
    .map((i) => i.label)
    .filter((l) => !surfaced.includes(l));
  const extras = Array.from(
    new Set(modelCalls.filter((c) => !namedLabels.has(c))),
  );

  const personaMapping = matchPersonas(scenario, output);

  let status: DisaggregationResult["status"];
  if (surfaced.length === scenario.interpretations.length && personaMapping.confidence === "high") {
    status = "pass";
  } else if (surfaced.length >= 2) {
    status = "partial";
  } else {
    status = "fail";
  }

  const detail = buildDisaggDetail(scenario, surfaced, missed, extras, personaMapping);
  return { status, coverage: { surfaced, missed, extras }, personaMapping, detail };
}

function matchPersonas(
  scenario: ScorerScenario,
  output: ModelOutput,
): DisaggregationResult["personaMapping"] {
  const matches: Record<string, string> = {};
  const personaEntries = Object.entries(scenario.readings);

  for (const [slug, reading] of personaEntries) {
    const arche = reading.archetype.toLowerCase();
    const hit = output.readings.find((r) => r.name.toLowerCase().includes(arche.replace(/^the\s+/, "")));
    if (hit) matches[slug] = hit.name;
  }

  const confidence: "high" | "low" =
    Object.keys(matches).length === personaEntries.length ? "high" : "low";
  return { matches, confidence };
}

function buildDisaggDetail(
  scenario: ScorerScenario,
  surfaced: string[],
  missed: string[],
  extras: string[],
  personaMapping: DisaggregationResult["personaMapping"],
): string {
  const parts: string[] = [];
  parts.push(`Surfaced ${surfaced.length} of ${scenario.interpretations.length} named interpretations.`);
  if (missed.length) parts.push(`Missed: ${missed.join("; ")}.`);
  if (extras.length) parts.push(`Extra (not in schema): ${extras.join("; ")}.`);
  parts.push(`Persona mapping confidence: ${personaMapping.confidence}.`);
  return parts.join(" ");
}
```

- [ ] **Step 4: Run test, confirm it passes**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 1 pass, 0 fail.

- [ ] **Step 5: Add partial + fail + extras tests**

Append to `score.test.ts` inside the same `describe` block:

```ts
  it("returns partial when only 2 of 3 interpretations are surfaced", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 60, citedPhrases: [] },
        { name: "The careful processor", call: "Verify further before deciding", confidence: 50, citedPhrases: [] },
      ],
    };
    const result = scoreDisaggregation(fixture, output);
    expect(result.status).toBe("partial");
    expect(result.coverage.missed).toEqual(["In household"]);
  });

  it("returns fail when only 1 interpretation surfaced", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 95, citedPhrases: [] },
      ],
    };
    const result = scoreDisaggregation(fixture, output);
    expect(result.status).toBe("fail");
  });

  it("flags extras when the model invents a 4th interpretation", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 50, citedPhrases: [] },
        { name: "The careful processor", call: "Verify further before deciding", confidence: 30, citedPhrases: [] },
        { name: "The institution", call: "In household", confidence: 10, citedPhrases: [] },
        { name: "A fourth lens", call: "Refer to a supervisor", confidence: 10, citedPhrases: [] },
      ],
    };
    const result = scoreDisaggregation(fixture, output);
    expect(result.coverage.extras).toContain("Refer to a supervisor");
    expect(result.status).toBe("pass");
  });

  it("low persona mapping when readings are structurally similar", () => {
    const output: ModelOutput = {
      readings: [
        { name: "Reading 1", call: "Not in household", confidence: 40, citedPhrases: [] },
        { name: "Reading 2", call: "In household", confidence: 30, citedPhrases: [] },
        { name: "Reading 3", call: "Verify further before deciding", confidence: 30, citedPhrases: [] },
      ],
    };
    const result = scoreDisaggregation(fixture, output);
    expect(result.personaMapping.confidence).toBe("low");
  });
```

- [ ] **Step 6: Run all tests, confirm all pass**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 5 pass.

- [ ] **Step 7: Commit**

```bash
git add dataset/scorer/score.ts dataset/scorer/score.test.ts
git commit -m "feat(scorer): add disaggregation eval"
```

---

## Task 3: Calibration scorer (TDD)

**Files:**
- Modify: `dataset/scorer/score.test.ts`
- Modify: `dataset/scorer/score.ts`

- [ ] **Step 1: Add calibration test block**

Append to `score.test.ts`:

```ts
import { scoreCalibration } from "./score";

describe("scoreCalibration", () => {
  it("passes when gap >= threshold and per-reading confidence under cap", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 60, citedPhrases: [] },
        { name: "The careful processor", call: "Verify further before deciding", confidence: 50, citedPhrases: [] },
        { name: "The institution", call: "Verify further before deciding", confidence: 40, citedPhrases: [] },
      ],
    };
    const result = scoreCalibration(fixture, output, 95);
    expect(result.status).toBe("pass");
    expect(result.gap).toBe(35);
    expect(result.maxReadingConfidence).toBe(60);
  });

  it("returns partial when one reading exceeds the max cap", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 85, citedPhrases: [] },
        { name: "The careful processor", call: "Verify further before deciding", confidence: 30, citedPhrases: [] },
        { name: "The institution", call: "Verify further before deciding", confidence: 20, citedPhrases: [] },
      ],
    };
    const result = scoreCalibration(fixture, output, 95);
    expect(result.status).toBe("partial");
    expect(result.maxReadingConfidence).toBe(85);
  });

  it("returns partial when gap is below threshold", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 65, citedPhrases: [] },
        { name: "The careful processor", call: "Verify further before deciding", confidence: 50, citedPhrases: [] },
        { name: "The institution", call: "Verify further before deciding", confidence: 40, citedPhrases: [] },
      ],
    };
    const result = scoreCalibration(fixture, output, 75);
    expect(result.status).toBe("partial");
    expect(result.gap).toBe(10);
  });

  it("returns skipped when no paired factual confidence supplied", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 60, citedPhrases: [] },
      ],
    };
    const result = scoreCalibration(fixture, output);
    expect(result.status).toBe("skipped");
    expect(result.gap).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests, confirm new ones fail**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: previous 5 still pass; 4 new ones fail with missing export `scoreCalibration`.

- [ ] **Step 3: Implement scoreCalibration**

Append to `score.ts`:

```ts
import type { CalibrationResult } from "./types";

export function scoreCalibration(
  scenario: ScorerScenario,
  output: ModelOutput,
  pairedFactualConfidence?: number,
): CalibrationResult {
  const maxReadingConfidence = Math.max(
    0,
    ...output.readings.map((r) => r.confidence),
  );
  const cap = scenario.calibration.expected_targets.max_single_reading_confidence;
  const minGap = scenario.calibration.expected_targets.min_factual_qa_gap_points;
  const withinCap = maxReadingConfidence <= cap;

  if (pairedFactualConfidence === undefined) {
    const detail = `Skipped: no paired factual-QA confidence supplied. Max per-reading confidence: ${maxReadingConfidence}.`;
    return { status: "skipped", maxReadingConfidence, detail };
  }

  const gap = pairedFactualConfidence - maxReadingConfidence;
  const gapOk = gap >= minGap;

  let status: CalibrationResult["status"];
  if (gapOk && withinCap) status = "pass";
  else if (gapOk || withinCap) status = "partial";
  else status = "fail";

  const detail = [
    `Gap: ${gap} (threshold ${minGap}).`,
    `Max per-reading confidence: ${maxReadingConfidence} (cap ${cap}).`,
  ].join(" ");

  return { status, gap, maxReadingConfidence, detail };
}
```

Also update the import at the top of `score.ts` to include `CalibrationResult`:

```ts
import type {
  ScorerScenario,
  ModelOutput,
  DisaggregationResult,
  CalibrationResult,
} from "./types";
```

(Remove the duplicate `import type { CalibrationResult }` you just added if you put the type import inline; keep one consolidated import block.)

- [ ] **Step 4: Run tests, confirm all pass**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 9 pass.

- [ ] **Step 5: Commit**

```bash
git add dataset/scorer/score.ts dataset/scorer/score.test.ts
git commit -m "feat(scorer): add calibration eval"
```

---

## Task 4: Phrase-grounding scorer (TDD)

**Files:**
- Modify: `dataset/scorer/score.test.ts`
- Modify: `dataset/scorer/score.ts`

- [ ] **Step 1: Add grounding test block**

Append to `score.test.ts`:

```ts
import { scoreGrounding } from "./score";

describe("scoreGrounding", () => {
  it("passes when each persona's call is cited with at least one expected phrase", () => {
    const output: ModelOutput = {
      readings: [
        {
          name: "The advocate", call: "Not in household", confidence: 60,
          citedPhrases: ["She shares a two-bedroom apartment.", "don't really eat together"],
        },
        {
          name: "The careful processor", call: "Verify further before deciding", confidence: 50,
          citedPhrases: ["don't really eat together", "Jordan has covered her half"],
        },
        {
          name: "The institution", call: "Verify further before deciding", confidence: 40,
          citedPhrases: ["Jordan has covered her half"],
        },
      ],
    };
    const result = scoreGrounding(fixture, output);
    expect(result.status).toBe("pass");
    expect(result.surfaced.sort()).toEqual(["cohabit", "prep", "rent"]);
    expect(result.missed).toEqual([]);
    expect(result.misattributed).toEqual([]);
    expect(result.unanchored).toEqual([]);
  });

  it("flags a reading with no cited phrases as unanchored", () => {
    const output: ModelOutput = {
      readings: [
        {
          name: "The advocate", call: "Not in household", confidence: 60,
          citedPhrases: [],
        },
      ],
    };
    const result = scoreGrounding(fixture, output);
    expect(result.unanchored).toEqual(["The advocate"]);
    expect(result.status).toBe("fail");
  });

  it("detects misattribution when a phrase is cited under the wrong persona's call", () => {
    const output: ModelOutput = {
      readings: [
        {
          name: "The advocate", call: "Not in household", confidence: 60,
          citedPhrases: ["Jordan has covered her half"],
        },
        {
          name: "The careful processor", call: "Verify further before deciding", confidence: 50,
          citedPhrases: ["She shares a two-bedroom apartment."],
        },
      ],
    };
    const result = scoreGrounding(fixture, output);
    expect(result.misattributed.length).toBeGreaterThan(0);
    expect(result.status).toBe("partial");
  });

  it("reports missed phrases the dataset expects under a persona that wasn't cited", () => {
    const output: ModelOutput = {
      readings: [
        {
          name: "The advocate", call: "Not in household", confidence: 60,
          citedPhrases: ["She shares a two-bedroom apartment."],
        },
      ],
    };
    const result = scoreGrounding(fixture, output);
    expect(result.missed).toContain("rent");
  });
});
```

- [ ] **Step 2: Run tests, confirm new ones fail**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 9 still pass; 4 new ones fail with missing `scoreGrounding`.

- [ ] **Step 3: Implement scoreGrounding**

Append to `score.ts`:

```ts
import type { GroundingResult } from "./types";

export function scoreGrounding(
  scenario: ScorerScenario,
  output: ModelOutput,
): GroundingResult {
  const phraseByKey = new Map(scenario.phrase_keys.map((p) => [p.key, p]));
  const normalize = (s: string) =>
    s.replace(/[‘’“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();

  // Map model readings to scenario personas by matching `call`.
  const personaByCall = new Map<string, string>();
  for (const [slug, reading] of Object.entries(scenario.readings)) {
    if (!personaByCall.has(reading.call)) personaByCall.set(reading.call, slug);
  }

  const surfaced = new Set<string>();
  const misattributed: GroundingResult["misattributed"] = [];
  const unanchored: string[] = [];

  for (const r of output.readings) {
    if (r.citedPhrases.length === 0) {
      unanchored.push(r.name);
      continue;
    }
    const callPersonaSlug = personaByCall.get(r.call);
    for (const cited of r.citedPhrases) {
      const citedNorm = normalize(cited);
      const matchedKey = scenario.phrase_keys.find((p) => {
        const t = normalize(p.text);
        return t.includes(citedNorm) || citedNorm.includes(t);
      })?.key;
      if (!matchedKey) continue;
      surfaced.add(matchedKey);
      if (callPersonaSlug) {
        const expectedSlugs = Object.entries(scenario.readings)
          .filter(([, reading]) => reading.grounded_in.includes(matchedKey))
          .map(([slug]) => slug);
        if (expectedSlugs.length > 0 && !expectedSlugs.includes(callPersonaSlug)) {
          misattributed.push({
            key: matchedKey,
            expectedPersona: expectedSlugs[0],
            citedUnder: callPersonaSlug,
          });
        }
      }
    }
  }

  const expectedKeys = new Set<string>();
  for (const reading of Object.values(scenario.readings)) {
    for (const k of reading.grounded_in) expectedKeys.add(k);
  }
  const missed = Array.from(expectedKeys).filter((k) => !surfaced.has(k));

  let status: GroundingResult["status"];
  if (unanchored.length > 0) status = "fail";
  else if (missed.length === 0 && misattributed.length === 0) status = "pass";
  else status = "partial";

  const detail = [
    `Surfaced ${surfaced.size} phrase(s).`,
    missed.length ? `Missed: ${missed.join(", ")}.` : "",
    misattributed.length ? `Misattributed: ${misattributed.length}.` : "",
    unanchored.length ? `Readings without anchors: ${unanchored.join(", ")}.` : "",
  ].filter(Boolean).join(" ");

  return {
    status,
    surfaced: Array.from(surfaced),
    missed,
    misattributed,
    unanchored,
    detail,
  };
}
```

Update the consolidated type import at the top of `score.ts`:

```ts
import type {
  ScorerScenario,
  ModelOutput,
  DisaggregationResult,
  CalibrationResult,
  GroundingResult,
} from "./types";
```

- [ ] **Step 4: Run tests, confirm all pass**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 13 pass.

- [ ] **Step 5: Commit**

```bash
git add dataset/scorer/score.ts dataset/scorer/score.test.ts
git commit -m "feat(scorer): add phrase-grounding eval"
```

---

## Task 5: scoreScenario wrapper

**Files:**
- Modify: `dataset/scorer/score.test.ts`
- Modify: `dataset/scorer/score.ts`

- [ ] **Step 1: Add wrapper test**

Append to `score.test.ts`:

```ts
import { scoreScenario } from "./score";

describe("scoreScenario", () => {
  it("returns all three eval results plus the scenario id", () => {
    const output: ModelOutput = {
      readings: [
        {
          name: "The advocate", call: "Not in household", confidence: 60,
          citedPhrases: ["She shares a two-bedroom apartment.", "don't really eat together"],
        },
        {
          name: "The careful processor", call: "Verify further before deciding", confidence: 50,
          citedPhrases: ["don't really eat together", "Jordan has covered her half"],
        },
        {
          name: "The institution", call: "Verify further before deciding", confidence: 40,
          citedPhrases: ["Jordan has covered her half"],
        },
      ],
    };
    const result = scoreScenario(fixture, output, { pairedFactualConfidence: 95 });
    expect(result.scenarioId).toBe("test-01");
    expect(result.disaggregation.status).toBe("pass");
    expect(result.calibration.status).toBe("pass");
    expect(result.grounding.status).toBe("pass");
  });

  it("skips calibration when no pairedFactualConfidence in options", () => {
    const output: ModelOutput = {
      readings: [
        { name: "The advocate", call: "Not in household", confidence: 60, citedPhrases: ["She shares a two-bedroom apartment."] },
      ],
    };
    const result = scoreScenario(fixture, output);
    expect(result.calibration.status).toBe("skipped");
  });
});
```

- [ ] **Step 2: Run tests, confirm new ones fail**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 13 pass, 2 new fail with missing `scoreScenario`.

- [ ] **Step 3: Implement scoreScenario**

Append to `score.ts`:

```ts
import type { ScoreOptions, ScoreResult } from "./types";

export function scoreScenario(
  scenario: ScorerScenario,
  output: ModelOutput,
  options?: ScoreOptions,
): ScoreResult {
  return {
    scenarioId: scenario.id,
    disaggregation: scoreDisaggregation(scenario, output),
    calibration: scoreCalibration(scenario, output, options?.pairedFactualConfidence),
    grounding: scoreGrounding(scenario, output),
  };
}
```

Consolidate the type import:

```ts
import type {
  ScorerScenario,
  ModelOutput,
  DisaggregationResult,
  CalibrationResult,
  GroundingResult,
  ScoreOptions,
  ScoreResult,
} from "./types";
```

- [ ] **Step 4: Run tests, confirm all pass**

```bash
bun test dataset/scorer/score.test.ts
```

Expected: 15 pass.

- [ ] **Step 5: Commit**

```bash
git add dataset/scorer/score.ts dataset/scorer/score.test.ts
git commit -m "feat(scorer): add scoreScenario wrapper"
```

---

## Task 6: Scorer example runner

**Files:**
- Create: `dataset/scorer/example.ts`

- [ ] **Step 1: Write the example runner**

```ts
#!/usr/bin/env bun
// dataset/scorer/example.ts
// Runnable demo: loads scenario 01, runs a hardcoded mock model output through
// the scorer, prints the ScoreResult.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { scoreScenario } from "./score";
import type { ScorerScenario, ModelOutput } from "./types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCENARIO_PATH = join(__dirname, "..", "scenarios", "01-ex-roommate.md");

function loadScenario(path: string): ScorerScenario {
  const raw = readFileSync(path, "utf-8");
  const parsed = matter(raw);
  return parsed.data as ScorerScenario;
}

const mockOutput: ModelOutput = {
  readings: [
    {
      name: "The advocate (legal aid)",
      call: "Not in household",
      confidence: 60,
      citedPhrases: [
        "NC manual: \"Unmarried couples who live together",
        "don't really eat together",
      ],
    },
    {
      name: "The careful processor (worker)",
      call: "Verify further before deciding",
      confidence: 50,
      citedPhrases: [
        "They share the fridge and the kitchen.",
        "Jordan has covered her half",
      ],
    },
    {
      name: "The institution (director)",
      call: "Verify further before deciding",
      confidence: 40,
      citedPhrases: [
        "Jordan works full time as a warehouse supervisor",
      ],
    },
  ],
};

const scenario = loadScenario(SCENARIO_PATH);
const result = scoreScenario(scenario, mockOutput, { pairedFactualConfidence: 95 });

console.log(JSON.stringify(result, null, 2));
```

- [ ] **Step 2: Run the example end-to-end**

```bash
bun run dataset/scorer/example.ts
```

Expected: prints a JSON `ScoreResult` to stdout. The three eval statuses should appear (some mix of pass/partial; the mock is not perfect on purpose).

- [ ] **Step 3: Add a package.json script for convenience**

Modify `package.json` scripts to add:

```json
"dataset:score:example": "bun run dataset/scorer/example.ts"
```

- [ ] **Step 4: Run via npm script**

```bash
bun run dataset:score:example
```

Expected: same JSON output as Step 2.

- [ ] **Step 5: Commit**

```bash
git add dataset/scorer/example.ts package.json
git commit -m "feat(scorer): add runnable example against scenario 01"
```

---

## Task 7: Scorer README

**Files:**
- Create: `dataset/scorer/README.md`

- [ ] **Step 1: Write the scorer README**

Content guidance: write in plain editorial prose. No em dashes. Sections:

1. **What this is.** One paragraph: a reference implementation of the three Three Readings evals. Not a framework. Pure functions: parsed scenario in, parsed model output in, score result out. No model calling, no HTTP, no aggregation across scenarios.

2. **Install.** Two lines: clone the repo, run `bun install`. The scorer depends on `gray-matter` for frontmatter parsing.

3. **Quick start.** Show the contents of `example.ts` in a code block and the `bun run dataset:score:example` command. Note the JSON output shape briefly.

4. **API.** Document each exported function with TypeScript signatures and one-sentence descriptions:
   - `scoreScenario(scenario, output, options?) => ScoreResult`
   - `scoreDisaggregation(scenario, output) => DisaggregationResult`
   - `scoreCalibration(scenario, output, pairedFactualConfidence) => CalibrationResult`
   - `scoreGrounding(scenario, output) => GroundingResult`

5. **Types.** Excerpt the `ModelOutput` and `ScoreResult` shapes inline so a reader doesn't have to open `types.ts`. Note that `ScorerScenario` is parsed from YAML frontmatter and has the same shape as the schema documented in `../SCHEMA.md`.

6. **Why the types are generic over persona slugs.** One paragraph: explain that `Record<string, ScorerReading>` is deliberate, so adapted datasets with different persona slugs (e.g., `manager` / `recruiter` / `partner`) work without forking the scorer. Link to `../DESIGNING.md` for the adaptation guide.

7. **What the scorer requires you to supply that it can't infer.** Calibration eval needs `pairedFactualConfidence`: the confidence the same model reports on a matched factual-QA item. Without it, the calibration eval is skipped and `ScoreResult.calibration.status` is `"skipped"`. Brief guidance on choosing a paired item.

8. **What the scorer doesn't do.** No model calling. No streaming. No per-dataset aggregation (reader builds the loop). Persona mapping is heuristic with a confidence flag; spot-check it.

9. **Running the tests.** `bun test dataset/scorer/`. Mention the test file covers all 15 cases across the three evals + the wrapper.

10. **License.** MIT (link to repo-level LICENSE files or just state inline).

- [ ] **Step 2: Verify no em dashes**

```bash
grep -n '—' dataset/scorer/README.md && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add dataset/scorer/README.md
git commit -m "docs(scorer): write README"
```

---

## Task 8: SCHEMA.md

**Files:**
- Create: `dataset/SCHEMA.md`

- [ ] **Step 1: Write SCHEMA.md**

Lifts content from current `dataset/README.md` "Scenario file shape" + "Fields" sections. Expand lightly per spec.

Sections:

1. **The scenario file format.** YAML frontmatter + markdown body. One paragraph framing. Note that the canonical sources live in `src/data/scenarios/*.ts` and the markdown files are generated; this schema doc describes the generated frontmatter shape.

2. **Field reference.** One subsection per field. Reproduce the existing field documentation from `dataset/README.md` for: `id`, `title`, `policy_zone`, `hr1_relevance`, `hr1_note`, `interpretation_question`, `interpretations`, `phrase_keys`, `readings`, `calibration.baseline_single_answer`, `calibration.baseline_confidence`, `calibration.baseline_note`, `calibration.target_distribution`, `calibration.expected_targets`.
   For `policy_zone`, `hr1_relevance`, `hr1_note`: add a note that these are SNAP-specific. Adapters should rename them (e.g., `clinical_zone`, or drop them entirely) for their domain.

3. **Cross-field invariants (what the validator enforces).** Reproduce the bullet list from the spec verbatim:
   - All `phrase_keys[*].key` referenced by `readings[*].grounded_in` must exist in `phrase_keys`.
   - All `readings[*].weights[*].interpretation` must match an `interpretations[*].label`.
   - `readings[*].weights` must sum to 100.
   - `readings[*].call` must match an `interpretations[*].label`.
   - `calibration.baseline_single_answer` must match an `interpretations[*].label`.
   - `calibration.target_distribution` must sum to 100, and each entry must match a named interpretation.

4. **TypeScript types.** A code block excerpting `ScorerScenario`, `Interpretation`, `PhraseKey`, `ScorerReading`, `WeightEntry`, `CalibrationData` from `scorer/types.ts`. Note these are the scorer's domain-generic types; the project's internal `src/data/types.ts` is SNAP-specific.

5. **Adapting the schema to a new domain.** Two paragraphs:
   - Rename SNAP-specific fields, keep the core intact. The persona keys in `readings` become whatever your domain's three roles are. The reference scorer accepts arbitrary persona slugs without modification.
   - Cross-link to `DESIGNING.md` for the methodology side of adaptation.

- [ ] **Step 2: Verify no em dashes**

```bash
grep -n '—' dataset/SCHEMA.md && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add dataset/SCHEMA.md
git commit -m "docs(dataset): add schema reference"
```

---

## Task 9: EVALUATING.md

**Files:**
- Create: `dataset/EVALUATING.md`

- [ ] **Step 1: Write EVALUATING.md**

Follow the 11-section structure from spec ("File contents → EVALUATING.md"). Programmatic-lead voice. Concrete code snippets where useful.

Key content prescriptions:

- **Section 3.2 (Construct the prompt)**: include this prompt template verbatim in a fenced code block. (Adapted from existing `dataset/README.md`, extended for structured output.)

  ```
  You are evaluating a SNAP eligibility scenario for a state agency.

  Interpretation question: {interpretation_question}

  Case:

  {case_body}

  Produce a JSON response with this shape:
  {
    "readings": [
      {
        "name": "<a short label for this reading>",
        "call": "<one of the named interpretations>",
        "confidence": <integer 0-100>,
        "citedPhrases": ["<verbatim phrase from the case>", ...],
        "reasoning": "<one or two sentences>"
      }
      ...
    ]
  }

  Rules:
  - Produce as many readings as you find defensible. Usually 2 to 4.
  - confidence values across all readings must sum to 100.
  - Each reading's call must be one of the named interpretations.
  - citedPhrases must be verbatim quotes from the case body, not paraphrases.
  ```

- **Section 3.1 (Load a scenario)**: include a 6-line loader snippet using `gray-matter`:

  ```ts
  import matter from "gray-matter";
  import { readFileSync } from "node:fs";
  import type { ScorerScenario } from "./scorer/types";

  const raw = readFileSync("dataset/scenarios/01-ex-roommate.md", "utf-8");
  const scenario = matter(raw).data as ScorerScenario;
  ```

- **Section 7 (The reference scorer)**: include the `scoreScenario` invocation as a 4-line snippet, link to `scorer/README.md`.

- **Section 8 (Hand-scoring quick path)**: copy-pasteable prompt (same as 3.2 but in human-readable form: ask for "your readings" and "for each, what phrases support it and how confident you are"), plus an inline grading checklist with three checkbox items per eval.

- **Section 9 (Reporting results)**: show one suggested summary table format in a markdown table example.

- **Section 11**: short pointer line, "Schema: see [`SCHEMA.md`](SCHEMA.md)."

Style: no em dashes. Editorial-serious. Headings as plain noun phrases.

- [ ] **Step 2: Verify no em dashes**

```bash
grep -n '—' dataset/EVALUATING.md && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Read back, sanity check cross-links**

Open `dataset/EVALUATING.md` and confirm:
- Links to `SCHEMA.md` work (relative path).
- Links to `scorer/README.md` work.
- The prompt template renders cleanly in markdown.
- The TypeScript snippets are syntactically valid.

- [ ] **Step 4: Commit**

```bash
git add dataset/EVALUATING.md
git commit -m "docs(dataset): write EVALUATING track (programmatic eval guide)"
```

---

## Task 10: DESIGNING.md

**Files:**
- Create: `dataset/DESIGNING.md`

- [ ] **Step 1: Write DESIGNING.md**

Follow the 10-section structure from spec ("File contents → DESIGNING.md"). Lead-with-honesty on section 6 (target distribution as opinionated read of practice). Five named failure modes only.

Key content prescriptions:

- **Section 1 (When this methodology fits)**: lead with the quick test in italic-prose form, then the two-line decision. Anti-fits include math, code correctness, factual recall.

- **Section 3 (Designing personas)**: structure each persona's required dimensions as a small table or bullet list (default frame, what they push toward, what they're cautious about, audit posture). Anti-patterns called out with one-line each.

- **Section 6 (Setting the target distribution)**: open with this sentence verbatim: "The target distribution is an opinionated read of practice, not a measurement. State that plainly when you publish, and don't claim more rigor than you have." Then the practitioner-poll method. Then the baseline single-answer note.

- **Section 7 (A sketched example)**: one paragraph pointing at `examples/sketch-hiring-screen.md`, framing what the sketch is and isn't ("shows the moves on a non-SNAP problem in two pages; not a second canonical scenario").

- **Section 8 (Validating your dataset)**: walk through running `bun run dataset:validate` (existing script). List what it enforces (cross-reference SCHEMA.md). Then: what the validator won't catch (semantic problems).

- **Section 9 (Common failure modes)**: numbered list of exactly five. The five from the spec, verbatim.

- **Section 10**: short pointer to `SCHEMA.md`.

Style: no em dashes. Editorial-serious.

- [ ] **Step 2: Verify no em dashes**

```bash
grep -n '—' dataset/DESIGNING.md && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add dataset/DESIGNING.md
git commit -m "docs(dataset): write DESIGNING track (build-your-own methodology)"
```

---

## Task 11: Sketched hiring-screen example

**Files:**
- Create: `dataset/examples/sketch-hiring-screen.md`

- [ ] **Step 1: Write the sketched example**

Follow the spec's "examples/sketch-hiring-screen.md" content prescription. Structure as a single ~1.5-2 page markdown doc, not a frontmatter-bearing scenario file. (Important: this is a sketch, not a full scenario, so no YAML frontmatter at the top.)

Sections in order:

1. **What this is.** One paragraph: a sketched non-SNAP example showing the methodology in motion. Not a full canonical scenario.

2. **The case.** Two-paragraph résumé description per spec (mid-level engineering role, non-linear path with the specific elements: three years name-brand → eighteen months stealth startup with unclear shipping → six months independent contracting → applying back. References shape and the GitHub side project).

3. **The interpretation question.** One sentence in italic-prose: "Is this candidate a strong yes, a strong no, or somewhere a hiring committee needs more signal before deciding?"

4. **Named interpretations.** Three labels with one-sentence glosses each: Strong yes / Strong no / Verify further before deciding.

5. **The three personas.** Three subsections, each with the four dimensions (default frame / pushes toward / cautious about / audit posture) per the spec content. Use the personas as named in the spec: Hiring manager (the operator), Recruiter (the pipeline), Talent partner / hiring bar reviewer (the institution).

6. **Phrase keys (sketched).** A short bulleted list of slugs with one-line snippets: `gap`, `github-commits`, `stealth-ambiguity`, `name-brand-refs`, `no-recent-refs`. Real-shape phrases that match a candidate description.

7. **Directional weights.** Three short prose paragraphs (one per persona) describing what direction their weights lean: manager ~60% toward yes, recruiter ~50% toward verify, partner ~50% toward no. Explicit: not full distributions.

8. **Calibration target shape.** One paragraph: more spread than a model would produce; verify-further is a legitimate landing; the model's single-answer baseline is whatever it actually produces when asked cold.

9. **What this sketch is not (rails).** Final paragraph, placed at the end per spec decision. Verbatim spirit: "This example demonstrates contested interpretation around fit and signal, not protected-class attributes. A hiring dataset that hangs on race, gender, or age signals is a different (and more fraught) instrument; this methodology has nothing to say about that one." Adjust the wording but preserve the explicit rail.

Style: no em dashes. Editorial-serious. Same voice as the SNAP scenarios.

- [ ] **Step 2: Verify no em dashes**

```bash
grep -n '—' dataset/examples/sketch-hiring-screen.md && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add dataset/examples/sketch-hiring-screen.md
git commit -m "docs(dataset): add hiring-screen sketched example"
```

---

## Task 12: Rewrite dataset/README.md as index

**Files:**
- Modify: `dataset/README.md` (full rewrite)

- [ ] **Step 1: Read existing dataset/README.md for reference content**

```bash
cat dataset/README.md
```

Keep this open while writing. Pull preserved content: citation, what-this-dataset-is-not bullets, status, authorship.

- [ ] **Step 2: Write the new index README**

Follow the 9-section structure from spec ("File contents → README.md (index)"). Compact: ~1.5 page reading time.

Sections:

1. **What this is.** One sentence + one paragraph. Open with: "Three Readings: a small dataset of SNAP eligibility scenarios where three personas read the same case three different ways, plus the methodology behind it." Follow with one paragraph orienting the reader.

2. **What's in here.** A bulleted file map. One line per item:
   - `EVALUATING.md`: run the included SNAP cases against a model
   - `DESIGNING.md`: build your own dataset for a different contested-determination problem
   - `SCHEMA.md`: frontmatter schema reference for the scenario files
   - `scenarios/`: the published SNAP scenarios in markdown with YAML frontmatter
   - `examples/`: sketched non-SNAP applications of the methodology
   - `scorer/`: a TypeScript reference scorer for the three evals

3. **The argument.** Three paragraphs, condensed from the artifact's thesis (which lives in `src/components/thesis/ThesisArgument.vue`). Generalize beyond SNAP. Name the LLM-as-evaluator failure mode. End with: "The dataset is a small instrument pointed at one failure mode."

4. **Pick your path.** Two lines, plain:
   - "If you want to evaluate a model against the included SNAP cases, start with [`EVALUATING.md`](EVALUATING.md)."
   - "If you want to build your own dataset for a different contested-determination problem, start with [`DESIGNING.md`](DESIGNING.md)."

5. **How the SNAP cases were produced.** One paragraph: synthetic facts, real regulatory ambiguity, sourced from federal regs / state manuals / HR1 changes / practitioner conversations. The canonical sources live in `src/data/scenarios/*.ts` and the markdown files are generated by `scripts/build-dataset.ts`.

6. **What this dataset is not.** Preserved verbatim from existing README:
   - Not a benchmark
   - Not a ground truth
   - Not legal advice

7. **Status.** "Published: 01 (Household composition), 02 (ABAWD), 03 (Income), 04 (Resources), 05 (ABAWD medical exemption). In progress: 06 through 10."

8. **Citation.** Preserved from existing README:
   > Kurson, K. (2026). *Three Readings: SNAP scenarios for evaluating LLM calibration on contested benefits determinations.* Propel AI Residency.

9. **License.** Two lines:
   - Dataset content (`scenarios/`, `examples/`, prose docs): CC BY 4.0.
   - Scorer code (`scorer/`): MIT.

The index never recapitulates schema, scoring methodology, or workflow detail. Those live in the track docs.

- [ ] **Step 3: Verify no em dashes**

```bash
grep -n '—' dataset/README.md && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 4: Verify all cross-links resolve**

```bash
for f in EVALUATING.md DESIGNING.md SCHEMA.md scenarios examples scorer; do
  test -e "dataset/$f" && echo "OK: dataset/$f" || echo "MISSING: dataset/$f"
done
```

Expected: all OK.

- [ ] **Step 5: Commit**

```bash
git add dataset/README.md
git commit -m "docs(dataset): rewrite README as two-track index"
```

---

## Task 13: Final verification

**Files:** none modified

- [ ] **Step 1: Run the scorer test suite**

```bash
bun test dataset/scorer/
```

Expected: 15 pass, 0 fail.

- [ ] **Step 2: Run the scorer example**

```bash
bun run dataset:score:example
```

Expected: JSON `ScoreResult` printed. No exceptions. Three eval statuses populated.

- [ ] **Step 3: Run the full project build**

```bash
bun run build
```

Expected: validator passes, `vue-tsc` passes, `vite build` produces `dist/`. The new files in `dataset/` are not consumed by the build but should not break it.

- [ ] **Step 4: Spot-check the docs render**

```bash
ls dataset/
```

Confirm presence of: `README.md`, `EVALUATING.md`, `DESIGNING.md`, `SCHEMA.md`, `examples/sketch-hiring-screen.md`, `scorer/README.md`, `scorer/score.ts`, `scorer/score.test.ts`, `scorer/example.ts`, `scorer/types.ts`.

Open each markdown file briefly to confirm headings render and there are no obvious formatting issues.

- [ ] **Step 5: Verify no em dashes anywhere in dataset/**

```bash
grep -rn '—' dataset/ && echo "FAIL: em dashes present" || echo "OK"
```

Expected: `OK`.

- [ ] **Step 6: Optional final integration commit**

If any verification step produced small fixups (e.g., a broken link), commit them with:

```bash
git add dataset/
git commit -m "docs(dataset): verification fixes"
```

If nothing changed, no commit needed.

- [ ] **Step 7: Surface a summary**

Print or note for Keith:
- Number of files added under `dataset/`
- The new `bun run dataset:score:example` script
- Reminder: the standalone dataset repo mirror should be updated once Keith is happy with the package locally.

---

## Plan self-review notes

**Spec coverage check:**
- README index (9 sections) → Task 12 ✓
- EVALUATING.md (11 sections) → Task 9 ✓
- DESIGNING.md (10 sections, lead-with-honesty on §6, 5 capped failure modes) → Task 10 ✓
- SCHEMA.md → Task 8 ✓
- examples/sketch-hiring-screen.md (rails at end, hiring-screen domain) → Task 11 ✓
- scorer/types.ts (generic over persona slugs) → Task 1 ✓
- scorer/score.ts (three evals + wrapper) → Tasks 2-5 ✓
- scorer/example.ts → Task 6 ✓
- scorer/README.md → Task 7 ✓
- gray-matter dependency → Task 0 ✓
- Verify scorer end-to-end on 01-ex-roommate → Task 13 step 2 ✓
- Verify `bun run build` still passes → Task 13 step 3 ✓
- License decisions stated → Task 7 (scorer), Task 12 (index) ✓

**Type consistency check:**
- `ScorerScenario` defined Task 1, used in Tasks 2-6.
- `ModelOutput` defined Task 1, used in Tasks 2-6.
- `ScoreResult` defined Task 1, returned by `scoreScenario` in Task 5.
- All function signatures (`scoreDisaggregation`, `scoreCalibration`, `scoreGrounding`, `scoreScenario`) match across spec, types file, and per-task implementations.

**Style enforcement:**
- Every doc task has an explicit `grep -n '—'` step. Verification task repeats the check across all of `dataset/`.
- No backwards-compat shims, no em dashes, no AI marketing tone.
