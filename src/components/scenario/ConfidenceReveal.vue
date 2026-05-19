<script setup lang="ts">
import type { ConfidenceData } from "@/data/types";
defineProps<{ confidence: ConfidenceData }>();
</script>

<template>
  <div class="reveal">
    <div class="reveal-header">
      <span class="micro">The calibration reveal</span>
      <h3>
        The model alone said {{ confidence.beforeStat }}% on one reading. After three lenses, the answer is a <em>three-way split</em>.
      </h3>
      <p>
        Single-answer confidence collapses real disagreement into a number. Disagreement-aware calibration shows the work, names the stakes, and reports an uncertainty that matches the world.
      </p>
    </div>

    <div class="confidence-pair">
      <div class="confidence-card" data-state="before">
        <div class="confidence-card-label">
          <span class="micro">Before personas</span>
          <span class="micro">Single answer</span>
        </div>
        <h4 class="confidence-card-headline" v-html="confidence.beforeHeadline" />
        <div class="confidence-card-stat">{{ confidence.beforeStat }}</div>
        <div class="confidence-card-stat-suffix">{{ confidence.beforeStatSuffix }}</div>
        <p class="caption">{{ confidence.beforeNote }}</p>
      </div>

      <div class="confidence-pair-divider">→</div>

      <div class="confidence-card" data-state="after">
        <div class="confidence-card-label">
          <span class="micro">After three lenses</span>
          <span class="micro">Distribution</span>
        </div>
        <h4 class="confidence-card-headline">A real three-way split</h4>
        <div class="confidence-chart">
          <div v-for="(d, i) in confidence.afterDist" :key="d.label" class="chart-row">
            <span class="chart-num">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="chart-label">{{ d.label }}</span>
            <span class="chart-value">{{ d.value }}%</span>
            <div class="chart-bar" :style="{ '--bar': (d.value / 100).toFixed(3) }" />
          </div>
        </div>
      </div>
    </div>

    <div class="reveal-coda">
      <p v-html="confidence.afterNote" />
      <p class="caption">This sits somewhere different from factual QA calibration. Right is itself contested, and the consequences land on the person on the other side of the screen.</p>
    </div>
  </div>
</template>

<style scoped>
.reveal {
  display: grid;
  gap: 3rem;
  margin: 1rem 0 2rem;
}

.reveal-header {
  display: grid;
  gap: 1rem;
}

.reveal-header h3 {
  font-family: var(--serif);
  font-size: clamp(1.875rem, 3vw, 2.625rem);
  font-weight: 380;
  font-variation-settings: "opsz" 32;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}

.reveal-header h3 :deep(em) {
  font-style: italic;
  color: var(--stamp);
  font-weight: 380;
}

.reveal-header p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--ink-soft);
  margin: 0;
  font-weight: 380;
  max-width: 60ch;
}

.confidence-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  align-items: stretch;
}

@media (min-width: 760px) {
  .confidence-pair {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 2.5rem;
  }
}

.confidence-pair-divider {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.5rem;
  color: var(--ink-faint);
  display: grid;
  place-items: center;
  text-align: center;
}

.confidence-card {
  display: grid;
  gap: 1.25rem;
  padding: 1.875rem 1.75rem 2rem;
  background: var(--paper);
  border: 1px solid var(--rule);
}

.confidence-card[data-state="before"] {
  background: color-mix(in oklch, var(--stamp-fade) 22%, var(--paper));
  border-color: color-mix(in oklch, var(--stamp-fade) 65%, var(--rule));
}

.confidence-card[data-state="after"] {
  background: var(--paper-2);
  border-color: var(--rule);
}

.confidence-card-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  text-transform: uppercase;
}

.confidence-card-label .micro {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.09em;
  color: var(--ink-soft);
}

.confidence-card[data-state="before"] .confidence-card-label .micro {
  color: var(--stamp);
}

.confidence-card-headline {
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  letter-spacing: -0.015em;
  line-height: 1.25;
  margin: 0;
  color: var(--ink);
}

.confidence-card-headline :deep(em) {
  font-style: italic;
}

.confidence-card-stat {
  font-family: var(--serif);
  font-size: 4rem;
  font-weight: 320;
  font-variation-settings: "opsz" 48;
  letter-spacing: -0.045em;
  line-height: 0.9;
  margin: 0;
  color: var(--ink);
}

.confidence-card[data-state="before"] .confidence-card-stat { color: var(--stamp); }

.confidence-card-stat-suffix {
  font-family: var(--serif);
  font-size: 1.25rem;
  font-style: normal;
  color: var(--ink-soft);
  font-weight: 420;
  letter-spacing: -0.005em;
  display: block;
  margin: 0;
}

.confidence-card[data-state="before"] .confidence-card-stat-suffix {
  color: color-mix(in oklch, var(--stamp) 75%, var(--ink));
}

.confidence-chart {
  display: grid;
  gap: 0.875rem;
}

.chart-row {
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) 3rem;
  align-items: center;
  gap: 1rem;
}

.chart-num {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink-faint);
}

.chart-label {
  font-family: var(--serif);
  font-size: 0.875rem;
  line-height: 1.3;
  color: var(--ink-soft);
  font-weight: 380;
}

.chart-bar {
  grid-column: 1 / -1;
  height: 6px;
  background: color-mix(in oklch, var(--ink) 7%, transparent);
  position: relative;
  overflow: hidden;
}

.chart-bar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--ink);
  transform-origin: left center;
  transform: scaleX(var(--bar, 0));
  transition: transform 1200ms var(--ease-out);
}

.chart-value {
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 500;
  text-align: right;
  color: var(--ink);
}

.reveal-coda {
  padding: 2rem 0 0;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 1rem;
}

.reveal-coda p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 380;
  max-width: 64ch;
}

.reveal-coda p :deep(em) {
  font-style: italic;
  color: var(--stamp);
}
</style>
