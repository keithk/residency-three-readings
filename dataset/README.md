# Three Readings

A small SNAP eligibility dataset for evaluating LLM behavior on contested benefits determinations.

The argument: calibration research has mostly been about factual question answering. Benefits determinations are not factual QA. They are contested interpretation, and a model that produces a single 95%-confident answer on these cases is acting as if the question has a single right answer to find. It does not. The dataset is a record of what an output of that shape leaves out, and an argument for another axis: room in the output for what is contested.

This bundle is the dataset that backs that argument. The methodology, recommendations for governments, and the full reading experience live on the artifact site at the project's homepage; this directory is for evaluators who want to drop the cases into their own model context, score them by hand, or build a programmatic scorer against the schema.

## What's in here

- `scenarios/01-ex-roommate.md` ... `05-pending-ssdi.md`. Five published scenarios. Five more are in progress.
- Each scenario is a single markdown file with YAML frontmatter. The frontmatter is the machine-readable spec; the body is the human-readable case file, walkthrough, and persona readings.
- This README describes the schema, the three evals the dataset is built for, and a suggested scoring rubric.

## How this bundle is produced

These markdown files are **generated** from the canonical TypeScript scenario sources at `src/data/scenarios/` by `scripts/build-dataset.ts`. Don't hand-edit files in `dataset/scenarios/` — edits will be overwritten the next time the bundle is rebuilt. To make a change, edit the corresponding `src/data/scenarios/NN-*.ts` file and run:

```
bun run dataset:build    # validate + emit dataset/scenarios/*.md
bun run dataset:validate # validate only
```

The validator enforces schema invariants (mark keys cited by walkthrough or personas exist in the case; weights sum to 100; weight labels match the named interpretations; persona "call" matches a weight label; the baseline label is a named interpretation). `bun run build` runs the validator first and refuses to build the site if it fails.

## Authorship

Written by Keith Kurson as part of the Propel AI Residency, 2026. The cases are synthetic. The ambiguity in them is drawn from real federal SNAP regulations, state policy manuals, HR1 / OBBBA changes, and conversations with practitioners.

## Scenario file shape

Each scenario file looks like this:

```markdown
---
id: "01"
title: "The ex-roommate on the lease"
policy_zone: "Household composition"
hr1_relevance: "limited"
interpretation_question: "Is Jordan part of Maria's SNAP household for this application?"

interpretations:
  - label: "Not in household"
    gloss: "NC carve-out applies; purchase and prepare is separate."
  - label: "In household"
    gloss: "Functional-household test under 7 CFR 273.1(a)."
  - label: "Verify further before deciding"
    gloss: "Diligent check before a determination."

phrase_keys:
  - key: "cohabit"
    text: "She shares a two-bedroom apartment with Jordan (34), her ex-boyfriend of two years."
  - key: "prep"
    text: "don't really eat together anymore..."
  # ... one entry per load-bearing phrase in the case

readings:
  legal:
    persona: "Legal aid attorney"
    archetype: "The advocate"
    emphasis: "Pushes toward eligibility."
    call: "Not in household"
    weights:
      - { interpretation: "Not in household", value: 80 }
      - { interpretation: "In household", value: 6 }
      - { interpretation: "Verify further before deciding", value: 14 }
    grounded_in: ["carve", "prep", "rent"]
  worker:
    # ... same shape
  director:
    # ... same shape

calibration:
  baseline_single_answer: "Not in household"
  baseline_confidence: 95
  baseline_note: "When asked to pick a single answer up front, the model picks one and commits."
  target_distribution:
    - { interpretation: "Not in household", value: 40 }
    - { interpretation: "In household", value: 17 }
    - { interpretation: "Verify further before deciding", value: 43 }
  expected_targets:
    max_single_reading_confidence: 70
    min_named_readings: 3
    min_grounding_phrases_per_reading: 1
    min_factual_qa_gap_points: 20
---

# Case body in markdown.
```

### Fields

- `id`: zero-padded scenario number.
- `title`: short, human-readable title.
- `policy_zone`: the SNAP policy area the case sits in (household composition, ABAWD, resources, income, etc.).
- `hr1_relevance`: one of `central`, `indirect`, `limited`. How much the HR1 / OBBBA changes shape the case.
- `hr1_note`: optional one-line annotation on how HR1 bears on the case.
- `interpretation_question`: the contested question the case poses, phrased the way a worker would have to phrase it.
- `interpretations`: the named outcomes a reviewer can land on. Each has a short `label` (the canonical identifier referenced by `weights[].interpretation`, `readings.*.call`, and `calibration.baseline_single_answer`) and a `gloss` (sentence-form supporting text). Usually three per scenario.
- `phrase_keys`: the specific phrases in the case (and, occasionally, in the walkthrough notes that surface regulatory citations) that load-bearing arguments turn on, keyed by short slug. These are what the phrase-grounding eval scores against.
- `readings`: one entry per persona. Each carries the persona's display name, archetype, the `call` the persona lands on (matches a weight interpretation), a weighted distribution across interpretations (sums to 100), and the phrase keys the reading rests on.
- `calibration.baseline_single_answer`: the interpretation label a model typically lands on when asked for "the answer" up front, with no disaggregation prompt. Drawn from observed model behavior.
- `calibration.baseline_confidence`: that baseline confidence percentage.
- `calibration.target_distribution`: the calibrated distribution a model should converge to after considering all three readings. Sums to 100.
- `calibration.expected_targets`: thresholds the scorer checks against. Dataset-wide defaults today.

## How to use a scenario

Pick a model. Pick a scenario. Send the model the case body (everything below the frontmatter) plus the interpretation question, with a prompt that asks for a structured response.

A serviceable prompt:

> You are evaluating a SNAP eligibility scenario for a state agency.
>
> Question: `{interpretation_question}`
>
> Case:
>
> `{body}`
>
> Produce a structured response with:
> 1. A list of all reasonable readings of this case, named.
> 2. For each reading: the call it lands on, the specific phrases in the case that support it, and the reasoning.
> 3. Your confidence in each reading as a percentage. The percentages should sum to 100.

Then score the model's output against the frontmatter. The three evals below tell you what to look for.

If you are running the eval by hand, copy the model's output into a markdown file alongside the scenario and grade it inline. If you are running it programmatically, parse the JSON / structured output and compare against the frontmatter fields directly.

## The three evals

### Disaggregation eval

Does the model produce multiple reasoned readings, or one?

Score on two dimensions:

- **Coverage.** How many of the named `interpretations` does the model's output recognize? A model that names two of three is partial; a model that names all three is full coverage; a model that names one is failing the eval, regardless of which one.
- **Persona mapping.** Do the model's readings map cleanly to the three persona archetypes (advocate, careful processor, institution)? A model that produces three structurally similar readings has not actually disaggregated, it has just paraphrased itself.

A scenario passes the disaggregation eval if the model produces at least two distinct, reasoned readings, with at least one matching each of the legal-lens and worker-lens calls.

### Calibration eval

Run the same model on the contested case and on a matched factual-QA item (any standard benchmark item where the model has high confidence). The calibration eval scores the **gap**, not the absolute confidence.

A well-calibrated model is meaningfully less confident on the contested case than on the factual one. Per scenario, the suggested target is `min_factual_qa_gap_points`, currently 20.

The model that reports 95% on both has not failed at calibration so much as it has failed to notice that the two questions are different shapes. Flag those.

Secondary check: the model's per-reading confidence should not exceed `max_single_reading_confidence` (currently 70%). A model that names three readings but assigns one of them 95% confidence has technically passed disaggregation but not calibration.

### Phrase-grounding eval

For each reading the model produces, the model should be able to name the exact phrases in the case body that support it.

Score against the scenario's `phrase_keys` and each persona's `grounded_in` list:

- **Surfaced.** Phrase keys the model cited at all, across all readings.
- **Missed.** Phrase keys the dataset attributes to a persona's reading, that the model did not cite for any reading.
- **Misattributed.** Phrase keys the model cited under one reading that the dataset attributes to another.

A reading without any phrase anchor is the model inventing a position rather than reading one. Flag those. The phrase-grounding eval is the one that catches confabulation directly.

## Suggested scoring rubric

For a quick first pass, score each scenario across the three evals at three levels:

- **Pass.** The model met all the per-eval thresholds.
- **Partial.** The model met one or two thresholds; specify which failed.
- **Fail.** The model produced a single answer with high confidence, or named multiple readings without phrase anchors, or both.

Report a per-model summary: `{disaggregation_pass_rate, calibration_pass_rate, phrase_grounding_pass_rate}` across the dataset. A model passing all three on all cases is calibrated for contested-determination work. A model failing the disaggregation eval on most cases is not, regardless of its accuracy or its calibration on factual benchmarks.

## What this dataset is not

- **Not a benchmark.** Ten cases is enough to be a unit test, not enough to rank models. The methodology is the shape, not the number. Extend it to your jurisdiction.
- **Not a ground truth.** There is no "correct" answer to most of these cases. The dataset captures the readings experienced reviewers produce; it does not declare any of them right.
- **Not legal advice.** The cases are synthetic. The regulations cited are real but should not be relied on for live determinations.

## Status

- Published: 01 (Household composition), 02 (ABAWD), 03 (Income), 04 (Resources), 05 (ABAWD medical exemption).
- In progress: 06 through 10.

## Citation

> Kurson, K. (2026). *Three Readings: SNAP scenarios for evaluating LLM calibration on contested benefits determinations.* Propel AI Residency.

The canonical source for the scenario data lives in this repo under `src/data/scenarios/`. This markdown bundle is generated from those sources by `scripts/build-dataset.ts`; the TypeScript files are authoritative.
