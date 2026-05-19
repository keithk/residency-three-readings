<script setup lang="ts">
import { computed } from "vue";
import type { Scenario } from "@/data/types";
import type { StepKind } from "@/composables/useStepState";

const props = defineProps<{ scenario: Scenario; current: StepKind | null }>();

const walk = computed(() => props.scenario.walkthrough ?? []);
</script>

<template>
  <aside class="scenario-margin">
    <!-- Empty state on the facts step -->
    <div v-if="current?.kind === 'facts'" class="margin-empty">
      Annotations appear here as you walk through.
    </div>

    <!-- Walkthrough step: prominent current card, prior steps below -->
    <template v-else-if="current?.kind === 'walkthrough'">
      <div class="margin-current">
        <div class="margin-current-tag">
          <span class="micro">
            Walkthrough {{ String(current.index + 1).padStart(2, "0") }} / {{ String(walk.length).padStart(2, "0") }}
          </span>
          <span v-if="walk[current.index]?.citation" class="micro">{{ walk[current.index].citation }}</span>
        </div>
        <h4 class="margin-current-title">{{ walk[current.index].title }}</h4>
        <p class="margin-current-note" v-html="walk[current.index].note" />
      </div>
      <template v-if="current.index > 0">
        <div class="margin-prior-label"><span class="micro">Earlier</span></div>
        <div
          v-for="i in current.index"
          :key="`prior-${current.index - i}`"
          class="margin-note margin-prior"
          :style="{ animationDelay: `${i * 60}ms` }"
        >
          <span class="micro">
            {{ String(current.index - i + 1).padStart(2, "0") }} ·
            {{ walk[current.index - i].citation || "Annotation" }}
          </span>
          <div><strong>{{ walk[current.index - i].title }}.</strong></div>
        </div>
      </template>
    </template>

    <!-- Persona step: reading frame + pulls -->
    <template v-else-if="current?.kind === 'persona'">
      <div class="margin-note" :data-persona="current.personaId">
        <span class="micro">Reading frame</span>
        <div>{{ scenario.personas![current.personaId].emphasis }}</div>
      </div>
      <div
        v-for="(p, idx) in scenario.personas![current.personaId].pulls"
        :key="p.key"
        class="margin-note"
        :data-persona="current.personaId"
        :style="{ animationDelay: `${(idx + 1) * 90}ms` }"
      >
        <span class="micro">Pull {{ String(idx + 1).padStart(2, "0") }}</span>
        <div v-html="p.text" />
      </div>
    </template>

    <!-- Reveal -->
    <template v-else-if="current?.kind === 'reveal'">
      <div class="margin-note">
        <span class="micro">What changed</span>
        <div>The model's pre-elicitation guess assumed one persona's frame would dominate. Three perspectives shifted the answer from <strong>single answer, high confidence</strong> to <strong>real disagreement, calibrated uncertainty</strong>.</div>
      </div>
      <div class="margin-note">
        <span class="micro">Read next</span>
        <div>Try Scenario 02 to see the same pattern on an ABAWD verification edge case, where HR1 sits at the center.</div>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.scenario-margin {
  display: grid;
  gap: 1.25rem;
  position: sticky;
  top: 100px;
  align-self: start;
  font-family: var(--serif);
}

@media (max-width: 1180px) {
  .scenario-margin { position: static; }
}

.margin-note {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--hairline);
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--ink-soft);
  font-weight: 380;
  animation: marginIn 600ms var(--ease-out) backwards;
}

.margin-note .micro { color: var(--ink-faint); }

.margin-note[data-persona="legal"] .micro { color: var(--legal-ink); }
.margin-note[data-persona="worker"] .micro { color: var(--worker-ink); }
.margin-note[data-persona="director"] .micro { color: var(--director-ink); }

.margin-note :deep(strong) {
  font-style: italic;
  font-weight: 460;
  color: var(--ink);
}

@keyframes marginIn {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.margin-empty {
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  text-transform: uppercase;
  padding-top: 1rem;
  border-top: 1px solid var(--hairline);
}

.margin-current {
  display: grid;
  gap: 0.625rem;
  padding: 1.125rem 1.25rem 1.25rem;
  background: var(--paper);
  border: 1px solid var(--rule);
  position: relative;
  animation: marginIn 600ms var(--ease-out) backwards;
}

.margin-current::before {
  content: "";
  position: absolute;
  left: -1px;
  top: -1px;
  bottom: -1px;
  width: 3px;
  background: var(--stamp);
}

.margin-current-tag {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: baseline;
  flex-wrap: wrap;
}

.margin-current-tag .micro:first-child {
  color: var(--stamp);
}

.margin-current-title {
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  letter-spacing: -0.012em;
  line-height: 1.2;
  margin: 0;
  color: var(--ink);
}

.margin-current-note {
  font-family: var(--serif);
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--ink-soft);
  font-weight: 380;
  margin: 0;
}

.margin-current-note :deep(strong) {
  font-style: italic;
  font-weight: 460;
  color: var(--ink);
}

.margin-prior-label {
  padding-top: 1.5rem;
  margin-bottom: -0.5rem;
}

.margin-prior {
  font-size: 0.875rem;
  color: var(--ink-faint);
  padding: 0.75rem 0;
}

.margin-prior strong {
  font-weight: 460;
  color: var(--ink-soft);
  font-style: italic;
}

.margin-prior .micro {
  color: var(--ink-faint);
}
</style>
