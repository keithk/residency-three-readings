<script setup lang="ts">
import { useRoute } from "@/composables/useRoute";

const { navigate } = useRoute();

function backToIndex(event: MouseEvent) {
  event.preventDefault();
  navigate({ view: "index" });
}
</script>

<template>
  <div class="hero">
    <a class="kicker" href="#/" @click="backToIndex">
      <span class="micro">Keith Kurson, Propel AI Residency</span>
      <span class="kicker-sep" aria-hidden="true">·</span>
      <span class="micro">The brief</span>
      <span class="kicker-sep" aria-hidden="true">·</span>
      <span class="micro">2026</span>
    </a>
    <h1 class="display-l title">
      What to <em>do</em><br />
      with three readings.
    </h1>
    <p class="lede">
      A brief for people building, buying, or testing an LLM that will judge cases humans would normally argue over. We use five SNAP cases as the example. The same approach works in other domains. This page covers how to test the model, what to ask of vendors, and what not to train out of it. Aimed at the systems behind the decision, not at the people the decision affects.
    </p>
  </div>
</template>

<style scoped>
.hero {
  padding: 3rem 0 4.5rem;
  display: grid;
  gap: 2rem;
}

.kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink-soft);
  text-decoration: none;
  justify-self: start;
  transition: color 160ms var(--ease-out);
}

.kicker:hover {
  color: var(--ink);
}

.kicker .micro {
  color: inherit;
}

.kicker-sep {
  color: var(--ink-ghost);
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.title {
  color: var(--ink);
  margin: 0;
  max-width: 18ch;
}

.title em {
  font-style: italic;
  color: var(--stamp);
  font-weight: 320;
}

.lede {
  color: var(--ink-soft);
  max-width: 56ch;
  margin: 0;
}

@media (min-width: 960px) {
  .hero {
    padding: 4rem 0 6rem;
    gap: 2.5rem;
  }
}
</style>
