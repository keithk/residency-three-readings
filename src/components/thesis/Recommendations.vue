<script setup lang="ts">
interface Recommendation {
  id: string;
  kicker: string;
  titleHtml: string;
  bodyHtml: string;
}

const recommendations: Recommendation[] = [
  {
    id: "01",
    kicker: "Procurement",
    titleHtml: `Require <em>disaggregation</em> as a scored capability.`,
    bodyHtml: `When you procure or select an LLM for evaluator-style work, do not score vendors on accuracy and calibration against factual benchmarks alone. Add a scored capability for whether the model produces multiple, reasoned readings on contested cases, with per-reading confidence. The model that gives a single confident answer on Maria's case is the model that gives a confidently wrong answer in production.`,
  },
  {
    id: "02",
    kicker: "Internal models",
    titleHtml: `Do not fine-tune toward <em>consensus</em>.`,
    bodyHtml: `RLHF and supervised fine-tuning on contested cases (benefits, medical, lending, hiring) will smooth out legitimate professional disagreement, because raters asked to produce a single label will average it away. Preserve the disagreement as structured output: per-reading reasoning, per-reading confidence, the phrases each reading rests on. Train the model to disagree with itself, deliberately, on the cases where experienced humans do.`,
  },
  {
    id: "03",
    kicker: "Reviewer tooling",
    titleHtml: `Surface the disagreement to the <em>reviewer</em>.`,
    bodyHtml: `The tool a reviewer uses to triage cases should not present a single recommendation. It should show the readings side by side, with the policy or rule citations each rests on, and leave the call to the human. The interface argues with itself, visibly. Reviewers are more accurate when they see the argument; they are less accurate when they see a number.`,
  },
  {
    id: "04",
    kicker: "Audit",
    titleHtml: `Log every <em>single-answer high-confidence</em> case.`,
    bodyHtml: `The inferences worth auditing are not the low-confidence ones. They are the cases where the model produced one answer with high confidence on phrases that historically split reviewers. Build a pipeline that flags any inference where the prompt contained one of those phrases and the output collapsed to a single answer. Those flags are the near-misses.`,
  },
  {
    id: "05",
    kicker: "Data labeling",
    titleHtml: `Label the <em>interpretation question</em>, not the answer.`,
    bodyHtml: `Most training data for evaluator-style tasks is labeled with the answer: approved/denied/pended, qualified/unqualified, approve/reject. That is the answer, not the question. The interpretation question on Maria's case is whether the federal "purchase and prepare" test or the NC unmarried-couple carve-out controls. Label that. Let the answer be a distribution across contested interpretations, not a single label. The model learns the right shape only if the labels carry it.`,
  },
];
</script>

<template>
  <section class="recs">
    <div class="section-header">
      <span class="micro">Five recommendations for anyone using LLMs as evaluators</span>
    </div>
    <ol class="recs-list">
      <li v-for="r in recommendations" :key="r.id" class="rec-row">
        <div class="rec-num" aria-hidden="true">{{ r.id }}</div>
        <div class="rec-body">
          <span class="micro rec-kicker">{{ r.kicker }}</span>
          <h3 class="rec-title" v-html="r.titleHtml" />
          <p class="rec-prose" v-html="r.bodyHtml" />
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.recs {
  padding: 3.5rem 0;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 2.5rem;
}

.section-header {
  display: grid;
  gap: 0.75rem;
}

.section-header .micro {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.recs-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}

.rec-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  padding: 2.25rem 0;
  border-top: 1px solid var(--hairline);
}

.rec-num {
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 320;
  line-height: 1;
  color: var(--ink-faint);
  letter-spacing: -0.03em;
  font-variation-settings: "opsz" 48;
}

.rec-body {
  display: grid;
  gap: 0.875rem;
}

.rec-kicker {
  color: var(--ink-soft);
  text-transform: uppercase;
}

.rec-title {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0;
  max-width: 28ch;
}

.rec-title :deep(em) {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
}

.rec-prose {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin: 0;
  max-width: 70ch;
}

.rec-prose :deep(em) {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
}

@media (min-width: 720px) {
  .rec-row {
    grid-template-columns: 4.5rem minmax(0, 1fr);
    gap: 2.5rem;
    padding: 2.75rem 0;
  }
  .rec-num {
    font-size: 3.25rem;
    padding-top: 0.25rem;
  }
}
</style>
