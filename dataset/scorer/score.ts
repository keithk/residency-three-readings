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
