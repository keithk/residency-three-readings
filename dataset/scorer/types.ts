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
