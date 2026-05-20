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
      A brief for governments procuring or building LLMs that will touch benefits-eligibility decisions. The dataset bundles the cases. This page lays out the methodology and the recommendations: what to require in procurement, what to evaluate, and what not to fine-tune away. Aimed at back-end systems, not at the people whose benefits are at stake.
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
