<script setup lang="ts"></script>

<template>
  <section class="argument">
    <div class="section-header">
      <span class="micro">The case</span>
    </div>
    <div class="prose">
      <p>
        When an LLM is asked to score a contested decision, it returns one number. That number is an average across the institutional perspectives in its training, blended into a single line of output and presented as a judgment. A model that says <em>"I'm 95% sure"</em> on whether the capital of France is Paris is doing a tractable thing, and we know how to grade it. A model that says the same on whether Maria's ex-roommate belongs in her SNAP household is performing a stance on a question that has no single right answer. Add a consideration to the prompt, the answer shifts. Add an expert lens, it shifts again. The dataset is a record of what that averaged output conceals, and an argument for a different output shape: room in the answer for what is contested.
      </p>
      <p>
        This pattern shows up wherever LLMs are deployed as evaluators: eligibility, diagnosis, underwriting, hiring, admissions, claims. The procurement language and benchmarks in use are borrowed from factual-QA: accuracy, calibration error, confidence intervals. Those metrics measure the wrong thing on contested decisions. They tell you the model is sure. They do not tell you whether the determination itself is contested, and on the cases that matter most, it is. SNAP is the case study because the failure mode is most legible there, and because state agencies are accelerating LLM-assisted eligibility under the cover of "modernization," with the federal HR1 package pushing tighter timelines and error tolerances down to the states. The argument does not stop at SNAP.
      </p>
      <p>
        The dataset is a small instrument pointed at one failure mode. Across ten SNAP scenarios, three experienced readers (a legal aid attorney, an eligibility worker, a SNAP director) read the same case and land in different places, with reasons. A 95%-confident single answer on those cases is not a model error. It is a category error in how we asked the question. The fix is not better calibration on the same question. The fix is to <em>ask a different question</em>.
      </p>
      <p>
        One precision before the methodology. Splitting the score across role-specific personas makes institutional bias <em>visible and contestable</em>. It does not remove it. The model still arrives at the three personas carrying its training and its blind spots. What changes is that the bias stops hiding inside an averaged number and starts showing up as three readings a human can read against each other. The fix is still deliberation. The artifact is an instrument for it, not a substitute.
      </p>
    </div>
  </section>
</template>

<style scoped>
.argument {
  padding: 3.5rem 0;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 2rem;
}

.section-header {
  display: grid;
  gap: 0.75rem;
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
  .argument {
    grid-template-columns: var(--col-rail, 200px) minmax(0, 1fr);
    gap: var(--gap-col, 72px);
    align-items: start;
  }
}
</style>
