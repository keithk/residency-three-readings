<script setup lang="ts">
import { DATASET_URL } from "@/data/links";
</script>

<template>
  <section class="closing">
    <div class="section-header">
      <span class="micro">In closing</span>
    </div>

    <p class="prose">
      The methodology is the page you just read. The dataset is four published cases, six in progress, shipped as a markdown bundle in the repo. If your team is procuring or building an LLM that will touch contested benefits determinations, treat this as a starting point and a methodology that generalizes. The cases are synthetic. The ambiguity is real, and it is the ambiguity, not the answer, that the current generation of benefits AI is being trained to ignore.
    </p>

    <a class="dataset-link" :href="DATASET_URL" target="_blank" rel="noopener">
      <span>Get the dataset bundle on GitHub</span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>

    <p class="punchline">
      The right answer to a contested question is not one answer. <em>It is the argument.</em>
    </p>
  </section>
</template>

<style scoped>
.closing {
  padding: 4rem 0 3rem;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 2.5rem;
}

.section-header .micro {
  color: var(--ink-faint);
  text-transform: uppercase;
}

.prose {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  margin: 0;
  max-width: 70ch;
}

.punchline {
  font-family: var(--serif);
  font-size: clamp(1.75rem, 3.4vw, 2.75rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  font-weight: 400;
  color: var(--ink);
  margin: 0;
  max-width: 28ch;
}

.punchline em {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
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
</style>
