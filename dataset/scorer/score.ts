import type {
  ScorerScenario,
  ModelOutput,
  DisaggregationResult,
  CalibrationResult,
  GroundingResult,
  ScoreOptions,
  ScoreResult,
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

export function scoreGrounding(
  scenario: ScorerScenario,
  output: ModelOutput,
): GroundingResult {
  const normalize = (s: string) =>
    s.replace(/[‘’“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();

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
