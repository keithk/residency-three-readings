<script setup lang="ts">
import { PERSONAS } from "@/data/personas";
import { PERSONAS_URL } from "@/data/links";
</script>

<template>
  <section class="personas-section" aria-labelledby="personas-heading">
    <div class="section-header">
      <h2 id="personas-heading" class="micro">The three lenses</h2>
    </div>
    <p class="personas-intro">
      The three personas below were drawn from years of fieldwork in SNAP eligibility: legal aid offices, county eligibility units, state SNAP administration. They fit this domain. A different problem, in a different field, would surface a different set of lenses, possibly more, possibly fewer, and the dataset would shape itself around <em>those</em> instead.
    </p>
    <p class="personas-intro">
      Each lens is written down, a few hundred words about the job itself: who checks this person's work, which mistakes cost them, what they reach for first when a case is unclear. The model reads that description before it reads the case. We tested whether the writing matters. Told only the three job titles, the model gave roughly the same answer three times over; the disagreement vanished. Given the full descriptions, the three readings came apart again, the way they do in the field. <em>The disagreement lives in the pressures of the job, not in the job title.</em> Every test behind these numbers is published alongside the dataset.
    </p>
    <div class="persona-columns">
      <article
        v-for="p in PERSONAS"
        :key="p.id"
        class="persona-column"
        :data-persona="p.id"
      >
        <span class="persona-label">{{ p.label }}</span>
        <h3 class="persona-name" v-html="p.nameHtml" />
        <p class="persona-body">{{ p.body }}</p>
        <p class="persona-cue">
          <span class="persona-cue-label">{{ p.cueLabel }}</span>
          <span v-html="p.cueText" />
        </p>
        <p class="persona-cue">
          <span class="persona-cue-label">{{ p.measureLabel }}</span>
          <span v-html="p.measureHtml" />
        </p>
      </article>
    </div>
    <a class="personas-link" :href="PERSONAS_URL" target="_blank" rel="noopener">
      <span>The persona files, and every test we ran</span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </section>
</template>

<style scoped>
.personas-section {
  padding: 3rem 0;
  border-top: 1px solid var(--rule);
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 2.25rem;
}

.section-header h2 {
  margin: 0;
}

.personas-intro {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  font-weight: 380;
  letter-spacing: -0.005em;
  color: var(--ink);
  max-width: 70ch;
  margin: 0 0 2.5rem;
}

.personas-intro + .personas-intro {
  margin-top: -1.25rem;
}

.personas-link {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 2.5rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 550;
  line-height: 1.35;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-decoration: none;
  transition: color 160ms var(--ease-out);
}

.personas-link:hover {
  color: var(--ink);
}

.personas-link .arrow {
  display: inline-block;
  transition: transform 200ms var(--ease-out);
}

.personas-link:hover .arrow {
  transform: translateX(3px);
}

.personas-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--stamp-fade) 70%, transparent);
}

.personas-intro em {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
}

.persona-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}

@media (min-width: 960px) {
  .persona-columns {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3.25rem;
  }
}

.persona-column {
  display: grid;
  gap: 0.875rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--hairline);
}

.persona-label {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.persona-column[data-persona="legal"] .persona-label { color: var(--legal-ink); }
.persona-column[data-persona="worker"] .persona-label { color: var(--worker-ink); }
.persona-column[data-persona="director"] .persona-label { color: var(--director-ink); }

.persona-name {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  letter-spacing: -0.015em;
  line-height: 1.1;
  margin: 0;
}

.persona-name :deep(em) {
  font-style: italic;
  font-weight: 380;
}

.persona-column[data-persona="legal"] .persona-name :deep(em) { color: var(--legal); }
.persona-column[data-persona="worker"] .persona-name :deep(em) { color: var(--worker); }
.persona-column[data-persona="director"] .persona-name :deep(em) { color: var(--director); }

.persona-body {
  font-family: var(--serif);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0;
  max-width: 32ch;
}

.persona-cue {
  font-family: var(--serif);
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--ink-soft);
  margin: 0;
  padding-top: 0.875rem;
  border-top: 1px solid var(--hairline);
  display: grid;
  gap: 0.25rem;
}

.persona-cue-label {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.persona-cue :deep(strong) {
  font-weight: 480;
  font-style: normal;
}

.persona-column[data-persona="legal"] .persona-cue :deep(strong) { color: var(--legal-ink); }
.persona-column[data-persona="worker"] .persona-cue :deep(strong) { color: var(--worker-ink); }
.persona-column[data-persona="director"] .persona-cue :deep(strong) { color: var(--director-ink); }
</style>
