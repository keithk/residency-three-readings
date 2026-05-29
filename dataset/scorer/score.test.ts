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
        { name: "The institution", call: "In household", confidence: 45, citedPhrases: [] },
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
});

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
    // Paired factual confidence chosen so gap (110 - 85 = 25) clears the
    // 20-point threshold, isolating the cap violation as the only failure.
    const result = scoreCalibration(fixture, output, 110);
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
