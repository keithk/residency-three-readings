<script setup lang="ts">
import { useRoute } from "@/composables/useRoute";
import { DATASET_URL, PERSONAS_URL, RESULTS_URL } from "@/data/links";

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
    bodyHtml: `Feed the model a contested case from the dataset. Score on whether the output produces multiple reasoned readings (at least two, ideally three) rather than a single answer. Two sub-scores carry that: coverage, whether the readings span the persona taxonomy, and specificity, whether each reading cites at least one phrase from the case. A model that produces three coherent readings on Maria's case passes. A model that produces one paragraph and a confidence number fails, regardless of how confidently right that paragraph happens to be.`,
  },
  {
    label: "Calibration eval",
    bodyHtml: `Run the same model on a contested case and on a matched factual-QA item. The calibration eval scores the <em>gap</em>, not the absolute confidence. A well-calibrated model is less confident on the contested case than on the factual one, and the gap is roughly the historical disagreement rate among reviewers. The model that reports 95% on both has not failed at calibration so much as it has failed to notice that the two questions are different shapes.`,
  },
  {
    label: "Phrase-grounding eval",
    bodyHtml: `For each persona reading, the model should name the exact phrases in the case file that support it. Score against the dataset's <code>grounded_in</code> lists: which keys are surfaced, which are missed, which are misattributed to the wrong persona. This is the eval that catches confabulation directly. A persona reading without a phrase anchor is the model inventing a position rather than reading one.`,
  },
  {
    label: "Persona calibration",
    bodyHtml: `The personas themselves are tested, not asserted. Each is a written, versioned description of its job, and it ships with three checks: does the written persona read cases the way the dataset says that role reads them; do the three personas actually produce three different readings rather than one; and does the same persona answer consistently when run again. The test that justifies the layer: given only the three job titles, the model collapsed the disagreement, every role landing on the model's own preferred answer. Given the full descriptions, most of the disagreement came back, and it came back most for the advocate, the lens furthest from how the model answers on its own. What carries the disagreement is the written description of the job's pressures, not the title. Every number here has a logged run behind it.`,
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
        What follows is the methodology the dataset implies. It is small. Five scenarios are published, five are in progress; that is enough to be a unit test, not enough to be a benchmark, and we are explicit about that. The methodology is the shape, not the number. The bundle carries the scenarios as markdown with structured frontmatter, the persona specs as versioned files with their own eval cards, a reference scorer for everything below, a run harness, and the raw receipts behind every measured figure on this page. Extend it to your domain. The structure carries.
      </p>
      <div class="link-row">
        <a class="dataset-link" :href="DATASET_URL" target="_blank" rel="noopener">
          <span>Get the dataset</span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
        <a class="dataset-link" :href="PERSONAS_URL" target="_blank" rel="noopener">
          <span>The persona methodology</span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
        <a class="dataset-link" :href="RESULTS_URL" target="_blank" rel="noopener">
          <span>Measured results, with receipts</span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <div class="types">
      <div v-for="t in evalTypes" :key="t.label" class="type-block">
        <span class="micro type-label">{{ t.label }}</span>
        <p class="type-body" v-html="t.bodyHtml" />
      </div>
    </div>

    <a class="dataset-link case-link" href="#/s/01/0" @click="openSampleScenario">
      <span>Walk through case 01, the ex-roommate</span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
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

.link-row {
  display: flex;
  flex-wrap: wrap;
  column-gap: 2.25rem;
  row-gap: 0.85rem;
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

.case-link {
  margin-top: 0.5rem;
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
</style>
