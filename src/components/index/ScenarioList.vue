<script setup lang="ts">
import { SCENARIOS } from "@/data/scenarios";
import { useRoute } from "@/composables/useRoute";

const { navigate } = useRoute();

function hr1Label(rel?: string): string | null {
  if (!rel) return null;
  return `HR1 ° ${rel}`;
}

function open(id: string, locked: boolean) {
  if (locked) return;
  navigate({ view: "scenario", scenarioId: id, step: 0 });
}
</script>

<template>
  <div class="scenarios-section">
    <div class="section-header">
      <span class="micro">The scenarios</span>
    </div>
    <ol class="scenario-list">
      <li
        v-for="s in SCENARIOS"
        :key="s.id"
        class="scenario-row"
        :data-locked="s.locked || null"
        @click="open(s.id, s.locked)"
      >
        <div class="scenario-num">{{ s.id }}</div>
        <div class="scenario-row-main">
          <h3 class="scenario-title">{{ s.title }}</h3>
          <div class="scenario-meta-line">
            <span class="scenario-tag">{{ s.zone.short }}</span>
            <span
              v-if="s.hr1"
              class="scenario-tag scenario-tag-hr1"
            >{{ hr1Label(s.hr1.relevance) }}</span>
          </div>
        </div>
        <div class="scenario-arrow">{{ s.locked ? "·" : "→" }}</div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.scenarios-section {
  padding: 3rem 0;
  border-top: 1px solid var(--rule);
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 2rem;
}

.scenario-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--hairline);
}

.scenario-row {
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) auto;
  align-items: baseline;
  column-gap: clamp(1rem, 3vw, 3rem);
  row-gap: 0.4rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--hairline);
  cursor: pointer;
  position: relative;
  transition: background 240ms var(--ease-out);
}

.scenario-row::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--paper-2);
  opacity: 0;
  transition: opacity 240ms var(--ease-out);
  z-index: -1;
  margin: 0 calc(-1 * clamp(0.5rem, 2vw, 1.5rem));
}

.scenario-row:hover::before { opacity: 0.7; }
.scenario-row[data-locked]:hover::before { opacity: 0; }

.scenario-row[data-locked] {
  cursor: not-allowed;
  opacity: 0.45;
}

.scenario-num {
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 320;
  font-variation-settings: "opsz" 32;
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1;
  align-self: center;
}

.scenario-row[data-locked] .scenario-num { color: var(--ink-faint); }

.scenario-row-main {
  display: grid;
  gap: 0.5rem;
}

.scenario-title {
  font-family: var(--serif);
  font-size: clamp(1.375rem, 2vw, 1.75rem);
  font-weight: 400;
  font-variation-settings: "opsz" 24;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0;
}

.scenario-meta-line {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.scenario-tag {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--rule);
  border-radius: 2px;
  background: var(--paper);
}

.scenario-tag-hr1 {
  color: var(--stamp);
  border-color: var(--stamp-fade);
  background: color-mix(in oklch, var(--stamp-fade) 30%, var(--paper));
}

.scenario-arrow {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--ink-faint);
  align-self: center;
  transition: transform 320ms var(--ease-out), color 240ms;
}

.scenario-row:hover:not([data-locked]) .scenario-arrow {
  transform: translateX(8px);
  color: var(--stamp);
}
</style>
