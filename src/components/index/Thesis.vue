<script setup lang="ts">
import { useRoute } from "@/composables/useRoute";

const { navigate } = useRoute();

function openThesis(event: MouseEvent) {
  event.preventDefault();
  navigate({ view: "thesis" });
}
</script>

<template>
  <div class="thesis">
    <p>
      When an LLM scores a contested decision, it returns one number. That number is an average across the institutional perspectives in its training, blended and presented as a judgment. Ask whether the capital of France is Paris and the model can be <em>"95% sure"</em> of a tractable fact. Ask whether Maria's ex-roommate belongs in her SNAP household and the same number performs a stance on a question that has no single right answer. Add a consideration to the prompt, the answer shifts. Add an expert lens, it shifts again. The dataset is a record of what that averaged output conceals.
    </p>
    <p>
      The method, which the eval harness operationalizes, is to split the same question across three role-specific experts and read the spread before the mean. The dataset records where the readings part ways. The eval harness scores LLMs on whether they surface those differences, characterize each reading, and calibrate confidence to actual expert consensus, not on whether they pick one <em>correct</em> answer.
    </p>
    <a class="thesis-link" href="#/thesis" @click="openThesis">
      <span>Read the brief for procurement and back-end teams</span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </div>
</template>

<style scoped>
.thesis {
  max-width: 64ch;
  padding: 3.5rem 0;
  border-top: 1px solid var(--rule);
  display: grid;
  gap: 1.25rem;
}

.thesis p {
  font-family: var(--serif);
  font-size: 1.1875rem;
  line-height: 1.6;
  margin: 0;
  color: var(--ink);
  font-weight: 380;
}

.thesis p em {
  font-style: italic;
  color: var(--stamp);
  font-weight: 400;
}

.thesis-link {
  margin-top: 1rem;
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

.thesis-link:hover {
  color: var(--ink);
}

.thesis-link .arrow {
  display: inline-block;
  transition: transform 200ms var(--ease-out);
}

.thesis-link:hover .arrow {
  transform: translateX(3px);
}

.thesis-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--stamp-fade) 70%, transparent);
}
</style>
