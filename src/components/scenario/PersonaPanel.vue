<script setup lang="ts">
import { computed } from "vue";
import type { PersonaId, PersonaReading } from "@/data/types";

const props = defineProps<{ persona: PersonaReading; personaId: PersonaId }>();

const nameHtml = computed(() => {
  const parts = props.persona.name.split(" ");
  if (parts.length < 2) return props.persona.name;
  const last = parts.pop();
  return `${parts.join(" ")} <em>${last}</em>`;
});
</script>

<template>
  <div class="persona-panel" :data-persona="personaId">
    <div class="persona-panel-head">
      <span class="persona-panel-label">{{ persona.label }}</span>
      <span class="caption">{{ persona.emphasis }}</span>
    </div>
    <h3 class="persona-panel-name" v-html="nameHtml" />
    <p class="persona-reading" v-html="persona.reading" />
    <div class="persona-weights">
      <span class="micro">How they weight the interpretations</span>
      <div v-for="(w, i) in persona.weights" :key="w.label" class="persona-weight">
        <span class="persona-weight-num">{{ String(i + 1).padStart(2, "0") }}</span>
        <span class="persona-weight-label">{{ w.label }}</span>
        <span class="persona-weight-value">{{ w.value }}%</span>
        <div class="persona-weight-bar">
          <div
            class="persona-weight-fill"
            :style="{ '--weight': (w.value / 100).toFixed(3) }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.persona-panel {
  display: grid;
  gap: 1.25rem;
  padding: 2rem 1.875rem;
  border: 1px solid var(--rule);
  background: var(--paper);
  position: relative;
  overflow: hidden;
}

.persona-panel[data-persona="legal"] {
  background: color-mix(in oklch, var(--legal-soft) 40%, var(--paper));
  border-color: color-mix(in oklch, var(--legal-soft) 80%, var(--rule));
}
.persona-panel[data-persona="worker"] {
  background: color-mix(in oklch, var(--worker-soft) 50%, var(--paper));
  border-color: color-mix(in oklch, var(--worker-soft) 80%, var(--rule));
}
.persona-panel[data-persona="director"] {
  background: color-mix(in oklch, var(--director-soft) 45%, var(--paper));
  border-color: color-mix(in oklch, var(--director-soft) 80%, var(--rule));
}

.persona-panel-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.persona-panel-label {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.persona-panel[data-persona="legal"] .persona-panel-label { color: var(--legal-ink); }
.persona-panel[data-persona="worker"] .persona-panel-label { color: var(--worker-ink); }
.persona-panel[data-persona="director"] .persona-panel-label { color: var(--director-ink); }

.persona-panel-name {
  font-family: var(--serif);
  font-size: 1.625rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  letter-spacing: -0.015em;
  line-height: 1.15;
  margin: 0;
}

.persona-panel-name :deep(em) {
  font-style: italic;
  font-weight: 380;
}

.persona-reading {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--ink);
  font-weight: 380;
  margin: 0;
}

.persona-reading :deep(em) {
  font-style: italic;
  font-weight: 420;
}

.persona-weights {
  display: grid;
  gap: 0.875rem;
  padding-top: 1.25rem;
  border-top: 1px solid color-mix(in oklch, currentColor 15%, transparent);
}

.persona-panel[data-persona="legal"] .persona-weights { border-color: color-mix(in oklch, var(--legal) 25%, transparent); }
.persona-panel[data-persona="worker"] .persona-weights { border-color: color-mix(in oklch, var(--worker) 25%, transparent); }
.persona-panel[data-persona="director"] .persona-weights { border-color: color-mix(in oklch, var(--director) 25%, transparent); }

.persona-weight {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) 3rem;
  align-items: baseline;
  gap: 0.875rem;
}

.persona-weight-num {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink-faint);
}

.persona-weight-label {
  font-family: var(--serif);
  font-size: 0.9375rem;
  line-height: 1.35;
  color: var(--ink);
  font-weight: 380;
}

.persona-weight-bar {
  grid-column: 1 / -1;
  height: 4px;
  background: color-mix(in oklch, currentColor 8%, transparent);
  position: relative;
  overflow: hidden;
}

.persona-weight-fill {
  position: absolute;
  inset: 0;
  background: currentColor;
  transform-origin: left center;
  transform: scaleX(var(--weight, 0));
  transition: transform 920ms var(--ease-out);
}

.persona-panel[data-persona="legal"] .persona-weight-fill { color: var(--legal); }
.persona-panel[data-persona="worker"] .persona-weight-fill { color: var(--worker); }
.persona-panel[data-persona="director"] .persona-weight-fill { color: var(--director); }

.persona-weight-value {
  font-family: var(--mono);
  font-size: 0.8125rem;
  text-align: right;
  font-weight: 500;
  color: var(--ink);
}
</style>
