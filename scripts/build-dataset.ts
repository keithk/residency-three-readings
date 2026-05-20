#!/usr/bin/env bun
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENARIOS } from "../src/data/scenarios";
import { PERSONAS } from "../src/data/personas";
import type { PersonaId, PersonaReading, Scenario, WalkthroughStep } from "../src/data/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const SOURCE_DIR = join(REPO_ROOT, "src/data/scenarios");
const TARGET_DIR = join(REPO_ROOT, "dataset/scenarios");

const EXPECTED_TARGETS = {
  max_single_reading_confidence: 70,
  min_named_readings: 3,
  min_grounding_phrases_per_reading: 1,
  min_factual_qa_gap_points: 20,
} as const;

const PERSONA_ORDER: PersonaId[] = ["legal", "worker", "director"];

const PERSONA_BY_ID = new Map(PERSONAS.map((p) => [p.id, p]));

const HR1_NOTE_BY_RELEVANCE: Record<string, string> = {
  central: "Central. The HR1 / OBBBA changes shape the case directly.",
  indirect: "Indirect. HR1 changes set the stakes but do not control the call.",
  limited: "Limited bearing.",
};

function stripHtml(html: string): string {
  return html
    .replace(/<mark\s+data-key="[^"]+">([\s\S]*?)<\/mark>/g, "$1")
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "$1")
    .replace(/<em>([\s\S]*?)<\/em>/g, "$1")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<mark\s+data-key="[^"]+">([\s\S]*?)<\/mark>/g, "$1")
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

function yamlString(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function extractPhraseKeys(scenario: Scenario): { key: string; text: string }[] {
  const sources: string[] = [...(scenario.facts ?? [])];
  for (const step of scenario.walkthrough ?? []) sources.push(step.note);

  const re = /<mark\s+data-key="([^"]+)">([\s\S]*?)<\/mark>/g;
  const found = new Map<string, string>();
  for (const src of sources) {
    re.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(src)) !== null) {
      const key = match[1];
      if (!found.has(key)) {
        found.set(key, stripHtml(match[2]));
      }
    }
  }
  return Array.from(found, ([key, text]) => ({ key, text }));
}

function archetypeName(personaId: PersonaId): string {
  const persona = PERSONA_BY_ID.get(personaId);
  if (!persona) throw new Error(`Unknown persona ${personaId}`);
  return stripHtml(persona.nameHtml);
}

function personaLabel(personaId: PersonaId): string {
  const persona = PERSONA_BY_ID.get(personaId);
  if (!persona) throw new Error(`Unknown persona ${personaId}`);
  return persona.label;
}

function renderWeightsBlock(weights: { label: string; value: number }[], indent: string): string {
  return weights
    .map(
      (w) =>
        `${indent}- { interpretation: ${yamlString(w.label)}, value: ${w.value} }`,
    )
    .join("\n");
}

function renderFrontmatter(scenario: Scenario): string {
  const facts = scenario.facts ?? [];
  const walkthrough = scenario.walkthrough ?? [];
  const personas = scenario.personas!;
  const interpretations = scenario.interpretations ?? [];
  const confidence = scenario.confidence!;
  const phraseKeys = extractPhraseKeys(scenario);

  const lines: string[] = [];
  lines.push("---");
  lines.push(`id: ${yamlString(scenario.id)}`);
  lines.push(`title: ${yamlString(scenario.title)}`);
  lines.push(`policy_zone: ${yamlString(scenario.zone.full)}`);
  lines.push(`hr1_relevance: ${yamlString(scenario.hr1?.relevance ?? "limited")}`);
  if (scenario.hr1?.note) {
    lines.push(`hr1_note: ${yamlString(scenario.hr1.note)}`);
  }
  if (scenario.determination) {
    lines.push(`interpretation_question: ${yamlString(scenario.determination)}`);
  }
  lines.push("");

  lines.push("interpretations:");
  for (const i of interpretations) {
    lines.push(`  - label: ${yamlString(i.label)}`);
    lines.push(`    gloss: ${yamlString(i.gloss)}`);
  }
  lines.push("");

  lines.push("phrase_keys:");
  for (const pk of phraseKeys) {
    lines.push(`  - key: ${yamlString(pk.key)}`);
    lines.push(`    text: ${yamlString(pk.text)}`);
  }
  lines.push("");

  lines.push("readings:");
  for (const id of PERSONA_ORDER) {
    const reading = personas[id];
    lines.push(`  ${id}:`);
    lines.push(`    persona: ${yamlString(personaLabel(id))}`);
    lines.push(`    archetype: ${yamlString(archetypeName(id))}`);
    lines.push(`    emphasis: ${yamlString(reading.emphasis)}`);
    lines.push(`    call: ${yamlString(reading.call)}`);
    lines.push(`    weights:`);
    lines.push(renderWeightsBlock(reading.weights, "      "));
    lines.push(`    grounded_in: [${reading.pulls.map((p) => yamlString(p.key)).join(", ")}]`);
  }
  lines.push("");

  lines.push("calibration:");
  lines.push(`  baseline_single_answer: ${yamlString(confidence.baselineLabel)}`);
  lines.push(`  baseline_confidence: ${parseInt(confidence.beforeStat, 10)}`);
  lines.push(`  baseline_note: ${yamlString(stripHtml(confidence.beforeNote))}`);
  lines.push(`  target_distribution:`);
  lines.push(renderWeightsBlock(confidence.afterDist, "    "));
  lines.push(`  expected_targets:`);
  lines.push(`    max_single_reading_confidence: ${EXPECTED_TARGETS.max_single_reading_confidence}`);
  lines.push(`    min_named_readings: ${EXPECTED_TARGETS.min_named_readings}`);
  lines.push(`    min_grounding_phrases_per_reading: ${EXPECTED_TARGETS.min_grounding_phrases_per_reading}`);
  lines.push(`    min_factual_qa_gap_points: ${EXPECTED_TARGETS.min_factual_qa_gap_points}`);
  lines.push("---");

  return lines.join("\n");
}

function renderWalkthroughStep(step: WalkthroughStep): string {
  const note = htmlToMarkdown(step.note);
  const citation = step.citation ? ` (${step.citation})` : "";
  return `### ${step.title}\n\n${note}${citation}`;
}

function renderPersona(reading: PersonaReading, personaId: PersonaId): string {
  const persona = PERSONA_BY_ID.get(personaId)!;
  const archetype = stripHtml(persona.nameHtml);
  const out: string[] = [];
  out.push(`### ${persona.label}, "${archetype}"`);
  out.push("");
  out.push(`*${reading.emphasis}*`);
  out.push("");
  out.push(`Call: **${reading.call}**.`);
  out.push("");
  out.push(htmlToMarkdown(reading.reading));
  out.push("");
  out.push("Grounded in:");
  out.push("");
  for (const pull of reading.pulls) {
    out.push(`- ${htmlToMarkdown(pull.text)}`);
  }
  out.push("");
  const weightLine = reading.weights
    .map((w) => `${w.label} ${w.value}`)
    .join(", ");
  out.push(`Weights: ${weightLine}.`);
  return out.join("\n");
}

function renderBody(scenario: Scenario): string {
  const out: string[] = [];
  out.push(`# ${scenario.title}`);
  out.push("");

  if (scenario.determination) {
    out.push("## Interpretation question");
    out.push("");
    out.push(scenario.determination);
    out.push("");
  }

  if (scenario.facts && scenario.facts.length > 0) {
    out.push("## Case facts");
    out.push("");
    for (const fact of scenario.facts) {
      out.push(htmlToMarkdown(fact));
      out.push("");
    }
  }

  if (scenario.walkthrough && scenario.walkthrough.length > 0) {
    out.push("## Walkthrough");
    out.push("");
    for (const step of scenario.walkthrough) {
      out.push(renderWalkthroughStep(step));
      out.push("");
    }
  }

  if (scenario.personas) {
    out.push("## Persona readings");
    out.push("");
    for (const id of PERSONA_ORDER) {
      out.push(renderPersona(scenario.personas[id], id));
      out.push("");
    }
  }

  if (scenario.confidence) {
    out.push("## Calibration");
    out.push("");
    out.push(
      `**Baseline.** Asked up front, a model typically lands on *${scenario.confidence.baselineLabel}* with around ${parseInt(scenario.confidence.beforeStat, 10)}% confidence. ${stripHtml(scenario.confidence.beforeNote)}`,
    );
    out.push("");
    const afterLine = scenario.confidence.afterDist
      .map((d) => `${d.label} ${d.value}`)
      .join(", ");
    out.push(`**Target after disaggregation.** ${afterLine}. ${stripHtml(scenario.confidence.afterNote)}`);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

function sourceSlugMap(): Map<string, string> {
  const map = new Map<string, string>();
  const files = readdirSync(SOURCE_DIR);
  for (const file of files) {
    const match = file.match(/^(\d+)-(.+)\.ts$/);
    if (!match) continue;
    map.set(match[1], `${match[1]}-${match[2]}`);
  }
  return map;
}

async function main() {
  const { validateAll, reportIssues } = await import("./validate-dataset");
  const issues = validateAll();
  reportIssues(issues);
  if (issues.length > 0) {
    console.error("\nRefusing to build dataset bundle with validation issues.");
    process.exit(1);
  }

  mkdirSync(TARGET_DIR, { recursive: true });
  const slugs = sourceSlugMap();
  const published = SCENARIOS.filter((s) => !s.locked);
  const written: string[] = [];

  for (const scenario of published) {
    const slug = slugs.get(scenario.id);
    if (!slug) {
      console.error(`No source file found for scenario id "${scenario.id}"; skipping.`);
      continue;
    }
    const frontmatter = renderFrontmatter(scenario);
    const body = renderBody(scenario);
    const content = `${frontmatter}\n\n${body}`;
    const target = join(TARGET_DIR, `${slug}.md`);
    writeFileSync(target, content);
    written.push(slug);
  }

  console.log(`✓ wrote ${written.length} scenario file(s) to dataset/scenarios/`);
  for (const slug of written) console.log(`  ${slug}.md`);
}

main();
