<script setup lang="ts"></script>

<template>
  <div class="hero">
    <h1 class="display-xl">
      The<br />
      <em>Disagreement</em><br />
      Dataset
    </h1>
    <p class="lede">
      Ten SNAP scenarios where three experts read the same case three different ways. A calibration benchmark for AI on contested benefits determinations, where "right" is itself contested and the stakes are whether someone eats next month.
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
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 5rem;
    align-items: end;
    padding: 4rem 0 5.5rem;
  }
}

.hero .lede {
  max-width: 40ch;
}

@media (min-width: 960px) {
  .hero .lede {
    padding-bottom: 0.875rem;
  }
}
</style>
