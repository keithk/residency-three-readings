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
      Calibration research has mostly been about factual QA. A model that says <em>"I'm 95% sure"</em> on whether the capital of France is Paris is doing a tractable thing. A model that says the same about whether Maria's ex-roommate belongs in her SNAP household is acting as if the question has a single right answer. It does not. Add a consideration to the prompt, the answer shifts. Add an expert lens, it shifts again. The dataset is a record of what an output of that shape leaves out, and an argument for another axis: room in the output for what is contested.
    </p>
    <p>
      The dataset captures the cases where the personas land differently. The eval harness scores LLMs on whether they surface that disagreement, characterize each reading, and calibrate confidence to the actual consensus level, not on whether they pick one <em>correct</em> answer.
    </p>
    <a class="thesis-link" href="#/thesis" @click="openThesis">
      <span>Read the full argument and recommendations for governments</span>
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
