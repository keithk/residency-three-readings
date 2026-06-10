<script setup lang="ts"></script>

<template>
  <section class="tension">
    <div class="section-header">
      <span class="micro">A tension this doesn't try to resolve</span>
    </div>
    <div class="prose">
      <p>
        Everything above is aimed at back-end systems: procurement criteria, model training, caseworker tooling, audit logging, training-data labeling. The applicant still receives a clear decision out the other end. The disagreement lives in the worker's tool and in the model's structured output, not in the benefits letter the recipient reads.
      </p>
      <p>
        Not every benefits-AI surface is back-end-only. Self-service eligibility checkers, applicant-facing chatbots, "would I qualify?" estimators all show model output directly to people who need <em>actionability over nuance</em>, and on those interfaces "here are three readings" is the wrong shape. The right move there is probably a clear next step, with the underlying uncertainty surfaced to the agency rather than to the recipient. This artifact does not try to design that interface. It draws the line at: disaggregate where trained humans are deciding; do not push the disaggregation through to the people whose benefits are at stake.
      </p>
    </div>
  </section>
</template>

<style scoped>
.tension {
  padding: 3.5rem 0;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 2rem;
}

.section-header .micro {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.prose {
  max-width: 70ch;
  display: grid;
  gap: 1.25rem;
}

.prose p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin: 0;
}

.prose em {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
}

@media (min-width: 960px) {
  .tension {
    grid-template-columns: var(--col-rail, 200px) minmax(0, 1fr);
    gap: var(--gap-col, 72px);
    align-items: start;
  }
}
</style>
