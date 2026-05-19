<script setup lang="ts">
import { computed, onMounted, onUnmounted, toRefs } from "vue";
import type { Scenario } from "@/data/types";
import { useRoute } from "@/composables/useRoute";
import { useStepState } from "@/composables/useStepState";
import ScenarioNav from "./ScenarioNav.vue";
import ScenarioRail from "./ScenarioRail.vue";
import CaseFile from "./CaseFile.vue";
import MarginNotes from "./MarginNotes.vue";
import StepControls from "./StepControls.vue";
import WalkthroughIntro from "./WalkthroughIntro.vue";
import PersonaPanel from "./PersonaPanel.vue";
import ConfidenceReveal from "./ConfidenceReveal.vue";

const props = defineProps<{ scenario: Scenario; step: number }>();
const { scenario, step } = toRefs(props);
const { navigate } = useRoute();

const scenarioRef = computed(() => scenario.value);
const stepRef = computed(() => step.value);
const { total, current, labels } = useStepState(scenarioRef, stepRef);

function go(delta: number) {
  const next = step.value + delta;
  if (next < 0 || next > total.value - 1) return;
  navigate({ view: "scenario", scenarioId: scenario.value.id, step: next });
}

function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowRight") go(1);
  else if (e.key === "ArrowLeft") go(-1);
  else if (e.key === "Escape") navigate({ view: "index" });
}

onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));

const showFactsIntro = computed(() => current.value?.kind === "facts");
const showWalkthrough = computed(() => current.value?.kind === "walkthrough");
const showPersona = computed(() => current.value?.kind === "persona");
const showReveal = computed(() => current.value?.kind === "reveal");
</script>

<template>
  <section class="view scenario-view">
    <ScenarioNav
      :step="step"
      :total="total"
      :on-back="() => navigate({ view: 'index' })"
    />

    <div class="scenario-layout">
      <ScenarioRail :scenario="scenario" />

      <article class="scenario-body">
        <header class="scenario-header">
          <div class="scenario-micro-path">
            <span class="micro">Scenario {{ scenario.id }}</span>
            <span class="micro dot">·</span>
            <span class="micro">{{ scenario.zone.full }}</span>
          </div>
          <h2 class="display-l">{{ scenario.title }}</h2>
        </header>

        <CaseFile :scenario="scenario" :current="current" />

        <div v-if="showFactsIntro && scenario.determination" class="determination">
          <span class="micro">Determination question</span>
          <p class="determination-q">{{ scenario.determination }}</p>
        </div>

        <div class="step-content">
          <WalkthroughIntro v-if="showFactsIntro" kind="facts" />
          <!-- Walkthrough steps render their content in the margin only. -->
          <PersonaPanel
            v-if="showPersona && current?.kind === 'persona'"
            :persona="scenario.personas![current.personaId]"
            :persona-id="current.personaId"
          />
          <ConfidenceReveal
            v-if="showReveal && scenario.confidence"
            :confidence="scenario.confidence"
          />
        </div>

        <StepControls
          :step="step"
          :total="total"
          :labels="labels"
          :on-next="() => go(1)"
          :on-prev="() => go(-1)"
        />
      </article>

      <MarginNotes :scenario="scenario" :current="current" />
    </div>
  </section>
</template>

<style scoped>
.view {
  animation: fadeIn 520ms var(--ease-out);
  padding: var(--pad-y) var(--pad-x);
  max-width: 1400px;
  margin: 0 auto;
}

.scenario-view {
  padding-top: 1.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.scenario-layout {
  display: grid;
  grid-template-columns: var(--col-rail) var(--col-body) var(--col-margin);
  column-gap: var(--gap-col);
  align-items: start;
}

@media (max-width: 1180px) {
  .scenario-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
}

.scenario-body {
  max-width: 70ch;
}

.scenario-header {
  display: grid;
  gap: 0.875rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--rule);
}

.scenario-micro-path {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  text-transform: uppercase;
  flex-wrap: wrap;
}

.scenario-micro-path .dot { opacity: 0.5; }

.determination {
  margin: 2rem 0;
  padding: 1.75rem 1.875rem 1.875rem;
  background: color-mix(in oklch, var(--stamp-fade) 30%, var(--paper));
  border: 1px solid color-mix(in oklch, var(--stamp-fade) 60%, var(--rule));
  position: relative;
}

.determination::before {
  content: "?";
  position: absolute;
  top: -0.5rem;
  left: 1.5rem;
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 500;
  background: var(--paper);
  color: var(--stamp);
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid color-mix(in oklch, var(--stamp-fade) 60%, var(--rule));
  border-radius: 999px;
  display: grid;
  place-items: center;
  line-height: 1;
}

.determination .micro {
  color: var(--stamp);
}

.determination-q {
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  line-height: 1.35;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0.5rem 0 0;
  font-style: italic;
}

.step-content {
  margin-top: 2.5rem;
  animation: stepIn 520ms var(--ease-out);
}

@keyframes stepIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
