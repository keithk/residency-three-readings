<script setup lang="ts">
import { computed } from "vue";
import type { StepLabels } from "@/composables/useStepState";

const props = defineProps<{
  step: number;
  total: number;
  labels: StepLabels | null;
  onNext: () => void;
  onPrev: () => void;
}>();

const atStart = computed(() => props.step === 0);
const atEnd = computed(() => props.step >= props.total - 1);
</script>

<template>
  <div class="step-controls">
    <div class="step-indicator">
      <span class="indicator-label">{{ labels?.short || "" }}</span>
      <span class="indicator-fraction">{{ step + 1 }} / {{ total }}</span>
    </div>

    <div class="step-controls-row">
      <div class="step-controls-side step-controls-prev">
        <button v-if="!atStart" class="btn btn-ghost" @click="onPrev">
          <span class="btn-arrow">←</span>
          <span>Previous</span>
        </button>
      </div>

      <div class="step-controls-side step-controls-next">
        <button
          class="btn btn-primary"
          :data-tone="labels?.nextTone || null"
          :disabled="atEnd"
          @click="onNext"
        >
          <span>{{ atEnd ? "End of scenario" : labels?.next }}</span>
          <span v-if="!atEnd" class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-controls {
  display: grid;
  gap: 2rem;
  margin-top: 4rem;
  padding: 2.5rem 0 1rem;
  border-top: 1px solid var(--rule);
}

.step-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.step-controls-side { display: flex; }
.step-controls-prev { justify-content: flex-start; }
.step-controls-next { justify-content: flex-end; margin-left: auto; }

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.4;
  text-align: center;
}

.indicator-label {
  color: var(--ink-soft);
  font-weight: 550;
}

.indicator-fraction {
  color: var(--ink-faint);
  font-weight: 500;
  letter-spacing: 0.14em;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 1rem 1.625rem;
  border-radius: 2px;
  white-space: nowrap;
  transition: background 240ms, color 240ms, border-color 240ms, opacity 240ms;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-arrow {
  display: inline-block;
  transition: transform 320ms var(--ease-out);
}

.btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
}

.btn-ghost:hover:not(:disabled) .btn-arrow {
  transform: translateX(-3px);
}

@media (max-width: 480px) {
  .step-controls-row {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0.75rem;
  }
  .step-controls-side .btn { width: 100%; justify-content: center; }
}

.btn-primary {
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--ink);
}

.btn-primary:hover {
  background: var(--stamp);
  border-color: var(--stamp);
}

.btn-primary[data-tone="legal"] { background: var(--legal); border-color: var(--legal); }
.btn-primary[data-tone="worker"] { background: var(--worker); border-color: var(--worker); }
.btn-primary[data-tone="director"] { background: var(--director); border-color: var(--director); }

.btn-ghost {
  color: var(--ink-soft);
  border: 1px solid var(--rule);
}

.btn-ghost:hover {
  color: var(--ink);
  border-color: var(--ink-soft);
}
</style>
