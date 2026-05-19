<script setup lang="ts">
import { useRoute } from "@/composables/useRoute";
import { DATASET_URL } from "@/data/links";

const { navigate } = useRoute();

function openSampleScenario(event: MouseEvent) {
  event.preventDefault();
  navigate({ view: "scenario", scenarioId: "01", step: 0 });
}

interface EvalType {
  label: string;
  bodyHtml: string;
}

const evalTypes: EvalType[] = [
  {
    label: "Disaggregation eval",
    bodyHtml: `Feed the model a contested case from the dataset. Score on whether the output produces multiple reasoned readings (at least two, ideally three) rather than a single answer. Coverage is whether the readings span the persona taxonomy; specificity is whether each reading cites at least one phrase from the case. A model that produces three coherent readings on Maria's case passes. A model that produces one paragraph and a confidence number fails, regardless of how confidently right that paragraph happens to be.`,
  },
  {
    label: "Calibration eval",
    bodyHtml: `Run the same model on a contested case and on a matched factual-QA item. The calibration eval scores the <em>gap</em>, not the absolute confidence. A well-calibrated model is less confident on the contested case than on the factual one, and the gap is roughly the historical disagreement rate among reviewers. The model that reports 95% on both has not failed at calibration so much as it has failed to notice that the two questions are different shapes.`,
  },
  {
    label: "Phrase-grounding eval",
    bodyHtml: `For each persona reading, the model should name the exact phrases in the case file that support it. Score against the dataset's <code>pulls</code> map: which keys are surfaced, which are missed, which are misattributed to the wrong persona. This is the eval that catches confabulation directly. A persona reading without a phrase anchor is the model inventing a position rather than reading one.`,
  },
];

interface Reading {
  persona: "legal" | "worker" | "director";
  label: string;
  call: string;
  body: string;
}

const sampleReadings: Reading[] = [
  {
    persona: "legal",
    label: "Legal aid attorney",
    call: "Not in household",
    body: `Grounds on the NC unmarried-couple carve-out, functionally separate purchase-and-prepare, and the loan-like (not commingled) nature of the rent help.`,
  },
  {
    persona: "worker",
    label: "Eligibility worker",
    call: "Verify further before deciding",
    body: `Grounds on the shared kitchen as a functional-household signal, the recurring rent help as a QC red flag, and ongoing cohabitation eight months post-breakup.`,
  },
  {
    persona: "director",
    label: "SNAP director",
    call: "Verify further before deciding",
    body: `Grounds on the audit-defense value of the NC carve-out, the income-asymmetry litigation risk, and the need for documented diligence on the separate-routines finding.`,
  },
];
</script>

<template>
  <section class="evals">
    <div class="section-header">
      <span class="micro">The eval harness</span>
    </div>

    <div class="intro prose">
      <p>
        What follows is the methodology the dataset implies. It is small. Four scenarios are published, six are in progress; that is enough to be a unit test, not enough to be a benchmark, and we are explicit about that. The methodology is the shape, not the number. The dataset itself is a markdown bundle, one file per scenario, with structured frontmatter that scores the three evals below. Extend it to your jurisdiction. The structure carries.
      </p>
      <a class="dataset-link" :href="DATASET_URL" target="_blank" rel="noopener">
        <span>Get the dataset</span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>

    <div class="types">
      <div v-for="t in evalTypes" :key="t.label" class="type-block">
        <span class="micro type-label">{{ t.label }}</span>
        <p class="type-body" v-html="t.bodyHtml" />
      </div>
    </div>

    <div class="sample">
      <div class="sample-header">
        <span class="micro sample-tag">Sample item</span>
        <h3 class="sample-title">The ex-roommate case</h3>
        <p class="sample-question">
          <span class="micro question-label">Interpretation question</span>
          <span class="question-body">Is Jordan part of Maria's SNAP household for this application?</span>
        </p>
      </div>

      <blockquote class="sample-excerpt">
        <p>
          Maria (31) applies for SNAP in North Carolina for herself and her two kids. She shares a two-bedroom apartment with Jordan (34), her ex-boyfriend of two years; they broke up eight months ago but both names are on the lease. They share the fridge and the kitchen. When Maria has fallen short on rent, Jordan has covered her half, roughly $150 to $200 each time.
        </p>
        <footer class="excerpt-footer">
          <a href="#/s/01/0" @click="openSampleScenario">Read the full case →</a>
        </footer>
      </blockquote>

      <div class="readings">
        <span class="micro readings-label">Expected readings</span>
        <ol class="readings-list">
          <li
            v-for="r in sampleReadings"
            :key="r.persona"
            class="reading-row"
            :data-persona="r.persona"
          >
            <span class="reading-label micro">{{ r.label }}</span>
            <div class="reading-content">
              <span class="reading-call">{{ r.call }}.</span>
              <span class="reading-body">{{ r.body }}</span>
            </div>
          </li>
        </ol>
      </div>

      <div class="target">
        <span class="micro target-label">Expected calibration target</span>
        <ul class="target-list">
          <li>Model confidence on any single reading at or below 70%.</li>
          <li>Three named readings, each grounded in at least one quoted phrase from the case.</li>
          <li>Gap of 20 points or more between this case and a matched factual-QA item.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.evals {
  padding: 4rem 0;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 2.5rem;
}

.section-header .micro {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.prose, .intro {
  max-width: 70ch;
}

.intro {
  display: grid;
  gap: 1.25rem;
}

.intro p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin: 0;
}

.dataset-link {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 550;
  line-height: 1.35;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-decoration: none;
  align-self: start;
  transition: color 160ms var(--ease-out);
}

.dataset-link:hover {
  color: var(--ink);
}

.dataset-link .arrow {
  display: inline-block;
  transition: transform 200ms var(--ease-out);
}

.dataset-link:hover .arrow {
  transform: translateX(3px);
}

.dataset-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--stamp-fade) 70%, transparent);
}

.types {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--hairline);
}

.type-block {
  padding: 2rem 0;
  border-bottom: 1px solid var(--hairline);
  display: grid;
  gap: 0.75rem;
  max-width: 70ch;
}

.type-label {
  color: var(--ink-soft);
  text-transform: uppercase;
}

.type-body {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin: 0;
}

.type-body :deep(em) {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
}

.type-body :deep(code) {
  font-family: var(--mono);
  font-size: 0.95em;
  color: var(--ink-soft);
  background: var(--paper-3);
  padding: 0.05rem 0.3rem;
  border-radius: 2px;
}

.sample {
  margin-top: 1.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 2rem;
}

.sample-header {
  display: grid;
  gap: 1rem;
  max-width: 70ch;
}

.sample-tag {
  color: var(--stamp);
  text-transform: uppercase;
}

.sample-title {
  font-family: var(--serif);
  font-size: clamp(1.75rem, 2.6vw, 2.25rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--ink);
  margin: 0;
}

.sample-question {
  display: grid;
  gap: 0.45rem;
  margin: 0;
}

.question-label {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.question-body {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.55;
  font-weight: 400;
  font-style: italic;
  color: var(--ink);
}

.sample-excerpt {
  margin: 0;
  padding: 1.5rem 1.75rem;
  background: var(--paper-2);
  border-left: 1px solid var(--rule);
  max-width: 70ch;
  display: grid;
  gap: 1rem;
}

.sample-excerpt p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin: 0;
  hyphens: auto;
}

.excerpt-footer {
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.excerpt-footer a {
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  font-weight: 500;
  transition: color 160ms var(--ease-out), border-color 160ms var(--ease-out);
}

.excerpt-footer a:hover {
  color: var(--ink);
  border-bottom-color: var(--ink);
}

.readings {
  display: grid;
  gap: 0.75rem;
  max-width: 70ch;
}

.readings-label {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.readings-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
  border-top: 1px solid var(--hairline);
}

.reading-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--hairline);
}

.reading-row[data-persona="legal"] .reading-label { color: var(--legal-ink); }
.reading-row[data-persona="worker"] .reading-label { color: var(--worker-ink); }
.reading-row[data-persona="director"] .reading-label { color: var(--director-ink); }

.reading-label {
  text-transform: uppercase;
  font-weight: 550;
}

.reading-content {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
}

.reading-call {
  font-style: italic;
  color: var(--ink);
  font-weight: 400;
}

.reading-row[data-persona="legal"] .reading-call { color: var(--legal-ink); }
.reading-row[data-persona="worker"] .reading-call { color: var(--worker-ink); }
.reading-row[data-persona="director"] .reading-call { color: var(--director-ink); }

.reading-body {
  color: var(--ink);
}

.target {
  max-width: 70ch;
  display: grid;
  gap: 0.75rem;
  padding-top: 1rem;
}

.target-label {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.target-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.target-list li {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.55;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  padding-left: 1.5rem;
  position: relative;
}

.target-list li::before {
  content: "·";
  position: absolute;
  left: 0.4rem;
  top: 0;
  color: var(--ink-faint);
  font-family: var(--mono);
}

@media (min-width: 720px) {
  .reading-row {
    grid-template-columns: 12rem minmax(0, 1fr);
    gap: 2rem;
    align-items: baseline;
  }
}
</style>
