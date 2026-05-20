<script setup lang="ts"></script>

<template>
  <div class="hero">
    <h1
      class="hero-title"
      aria-label="Three readings: the advocate, the careful processor, the institution"
    >
      <span class="line line-count" aria-hidden="true">Three readings</span>
      <span class="line line-persona line-legal" aria-hidden="true">
        The <em>advocate</em>
      </span>
      <span class="line line-persona line-worker" aria-hidden="true">
        The <em>careful processor</em>
      </span>
      <span class="line line-persona line-director" aria-hidden="true">
        The <em>institution</em>
      </span>
    </h1>
    <p class="lede hero-lede">
      Ten SNAP scenarios where three experts read the same case three different ways. A calibration brief for AI on contested benefits determinations, where "right" is itself contested and the stakes are whether someone eats next month.
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
  font-size: clamp(2.25rem, 6.4vw, 5.25rem);
  font-weight: 380;
  font-variation-settings: "opsz" 60;
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

.hero-title .line-count {
  animation-delay: 60ms;
}

.hero-title .line-persona {
  font-weight: 380;
}

.hero-title .line-persona :deep(em) {
  font-style: italic;
  font-weight: 320;
  font-variation-settings: "opsz" 60;
}

.hero-title .line-legal {
  animation-delay: 220ms;
  margin-top: 0.32em;
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
