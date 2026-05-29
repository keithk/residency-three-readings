<script setup lang="ts"></script>

<template>
  <div class="hero">
    <h1
      class="hero-title"
      aria-label="Beyond average: the legal aid attorney, the eligibility worker, the SNAP director"
    >
      <span class="line line-title" aria-hidden="true">
        Beyond <em class="mark-average">Average</em>
      </span>
      <span class="line line-persona line-legal" aria-hidden="true">
        The <em>legal aid attorney</em>
      </span>
      <span class="line line-persona line-worker" aria-hidden="true">
        The <em>eligibility worker</em>
      </span>
      <span class="line line-persona line-director" aria-hidden="true">
        The <em>SNAP director</em>
      </span>
    </h1>
    <p class="lede hero-lede">
      By default, an LLM gives one confident answer. On a contested decision, that single answer flattens disagreement that's there for reasons. A legal aid attorney, an eligibility worker, and a benefits director read the same SNAP case three different ways. Five scenarios show what gets lost. The stakes: whether someone gets their benefits.
    </p>
  </div>
</template>

<style scoped>
.hero {
  padding: 4rem 0 4.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
    gap: 5rem;
    align-items: end;
    padding: 4rem 0 5.5rem;
  }
}

.hero-title {
  font-family: var(--serif);
  font-weight: 380;
  line-height: 1;
  letter-spacing: -0.035em;
  margin: 0;
  color: var(--ink);
  display: grid;
  row-gap: 0;
}

.hero-title .line {
  display: block;
  opacity: 0;
  transform: translateY(0.18em);
  animation: lineArrive 520ms var(--ease-out) forwards;
}

.hero-title .line-title {
  font-size: clamp(3rem, 9vw, 7.5rem);
  font-variation-settings: "opsz" 60;
  letter-spacing: -0.04em;
  line-height: 0.95;
  animation-delay: 60ms;
}

.hero-title .line-title :deep(em.mark-average) {
  font-style: italic;
  color: var(--stamp);
}

.hero-title .line-persona {
  font-size: clamp(1.875rem, 5vw, 3.75rem);
  font-weight: 380;
  font-variation-settings: "opsz" 36;
  margin-top: 0.18em;
}

.hero-title .line-persona :deep(em) {
  font-style: italic;
  font-weight: 320;
  font-variation-settings: "opsz" 36;
}

.hero-title .line-legal {
  animation-delay: 220ms;
  margin-top: 0.42em;
}
.hero-title .line-legal :deep(em) { color: var(--legal); }

.hero-title .line-worker {
  animation-delay: 360ms;
}
.hero-title .line-worker :deep(em) { color: var(--worker); }

.hero-title .line-director {
  animation-delay: 500ms;
}
.hero-title .line-director :deep(em) { color: var(--director); }

@keyframes lineArrive {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-lede {
  max-width: 40ch;
  opacity: 0;
  animation: lineArrive 640ms var(--ease-out) 720ms forwards;
}

@media (min-width: 960px) {
  .hero-lede {
    padding-bottom: 0.4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-title .line,
  .hero-lede {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
