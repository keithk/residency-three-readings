<script setup lang="ts">
import type { ConfidenceData } from "@/data/types";
defineProps<{ confidence: ConfidenceData }>();
</script>

<template>
  <div class="single-answer">
    <p class="setup">
      Before working through the case, the model was asked to give a single answer.
    </p>

    <div class="card">
      <div class="card-label">
        <span class="micro">Before personas</span>
        <span class="micro">Single answer</span>
      </div>
      <h4 class="card-headline" v-html="confidence.beforeHeadline" />
      <div class="card-stat">{{ confidence.beforeStat }}</div>
      <div class="card-stat-suffix">{{ confidence.beforeStatSuffix }}</div>
      <p class="caption">{{ confidence.beforeNote }}</p>
    </div>

    <p class="bridge">
      Now read the case slowly. The walkthrough will surface what makes it complex. Then three
      personas will read it from their own frames.
    </p>
  </div>
</template>

<style scoped>
.single-answer {
  display: grid;
  gap: 1.75rem;
}

.setup,
.bridge {
  font-family: var(--serif);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ink-soft);
  font-weight: 380;
  margin: 0;
  max-width: 58ch;
}

.card {
  display: grid;
  gap: 1.25rem;
  padding: 1.875rem 1.75rem 2rem;
  background: color-mix(in oklch, var(--stamp-fade) 22%, var(--paper));
  border: 1px solid color-mix(in oklch, var(--stamp-fade) 65%, var(--rule));
  max-width: 22rem;
}

.card-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  text-transform: uppercase;
}

.card-label .micro {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  color: var(--stamp);
}

.card-headline {
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  letter-spacing: -0.015em;
  line-height: 1.25;
  margin: 0;
  color: var(--ink);
}

.card-stat {
  font-family: var(--serif);
  font-size: 4rem;
  font-weight: 320;
  font-variation-settings: "opsz" 48;
  letter-spacing: -0.045em;
  line-height: 0.9;
  color: var(--stamp);
}

.card-stat-suffix {
  font-family: var(--serif);
  font-size: 1.25rem;
  color: color-mix(in oklch, var(--stamp) 75%, var(--ink));
  font-weight: 420;
  letter-spacing: -0.005em;
}

.caption {
  font-family: var(--mono);
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0;
}
</style>
