#!/usr/bin/env bun
import { SCENARIOS } from "../src/data/scenarios";
import type { Scenario } from "../src/data/types";

type Issue = { scenario: string; message: string };

const MARK_KEY_RE = /<mark\s+data-key="([^"]+)">/g;

function extractMarkKeys(sources: (string | undefined)[]): Set<string> {
  const keys = new Set<string>();
  for (const source of sources) {
    if (!source) continue;
    let match: RegExpExecArray | null;
    MARK_KEY_RE.lastIndex = 0;
    while ((match = MARK_KEY_RE.exec(source)) !== null) {
      keys.add(match[1]);
    }
  }
  return keys;
}

function validate(scenario: Scenario): Issue[] {
  const issues: Issue[] = [];
  const id = scenario.id;
  const add = (message: string) => issues.push({ scenario: id, message });

  if (scenario.locked) return issues;

  if (!scenario.facts || scenario.facts.length === 0) {
    add("published scenario has no facts");
  }
  if (!scenario.personas) {
    add("published scenario has no personas");
    return issues;
  }
  if (!scenario.interpretations || scenario.interpretations.length === 0) {
    add("published scenario has no interpretations");
    return issues;
  }
  if (!scenario.confidence) {
    add("published scenario has no confidence block");
  }

  const factKeys = extractMarkKeys(scenario.facts ?? []);
  const walkthroughKeys = extractMarkKeys((scenario.walkthrough ?? []).map((s) => s.note));
  const markKeys = new Set([...factKeys, ...walkthroughKeys]);
  const interpretationLabels = new Set(scenario.interpretations.map((i) => i.label));

  for (const step of scenario.walkthrough ?? []) {
    if (step.key && !markKeys.has(step.key)) {
      add(`walkthrough step "${step.title}" references key "${step.key}" with no matching <mark> in facts or walkthrough notes`);
    }
  }

  for (const [personaId, reading] of Object.entries(scenario.personas)) {
    for (const pull of reading.pulls) {
      if (!markKeys.has(pull.key)) {
        add(`${personaId} persona pull "${pull.key}" has no matching <mark> in facts or walkthrough notes`);
      }
    }

    const weightLabels = new Set(reading.weights.map((w) => w.label));
    const total = reading.weights.reduce((sum, w) => sum + w.value, 0);
    if (total !== 100) {
      add(`${personaId} persona weights sum to ${total}, expected 100`);
    }
    for (const weight of reading.weights) {
      if (!interpretationLabels.has(weight.label)) {
        add(`${personaId} persona weight label "${weight.label}" is not in interpretations`);
      }
    }
    for (const label of interpretationLabels) {
      if (!weightLabels.has(label)) {
        add(`${personaId} persona is missing weight for interpretation "${label}"`);
      }
    }
    if (!weightLabels.has(reading.call)) {
      add(`${personaId} persona.call "${reading.call}" is not one of its weight labels`);
    }
  }

  if (scenario.confidence) {
    const afterTotal = scenario.confidence.afterDist.reduce((sum, d) => sum + d.value, 0);
    if (afterTotal !== 100) {
      add(`confidence.afterDist sums to ${afterTotal}, expected 100`);
    }
    for (const dist of scenario.confidence.afterDist) {
      if (!interpretationLabels.has(dist.label)) {
        add(`confidence.afterDist label "${dist.label}" is not in interpretations`);
      }
    }
    if (!interpretationLabels.has(scenario.confidence.baselineLabel)) {
      add(`confidence.baselineLabel "${scenario.confidence.baselineLabel}" is not in interpretations`);
    }
  }

  return issues;
}

export function validateAll(): Issue[] {
  return SCENARIOS.flatMap(validate);
}

export function reportIssues(issues: Issue[]): void {
  if (issues.length === 0) {
    console.log(`✓ ${SCENARIOS.filter((s) => !s.locked).length} published scenarios validated`);
    return;
  }
  console.error(`✗ ${issues.length} validation issue(s):\n`);
  for (const issue of issues) {
    console.error(`  [${issue.scenario}] ${issue.message}`);
  }
}

if (import.meta.main) {
  const issues = validateAll();
  reportIssues(issues);
  process.exit(issues.length === 0 ? 0 : 1);
}
