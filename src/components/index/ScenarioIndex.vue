<script setup lang="ts">
import Hero from "./Hero.vue";
import Thesis from "./Thesis.vue";
import ScenarioList from "./ScenarioList.vue";
import PersonaCards from "./PersonaCards.vue";
import Colophon from "./Colophon.vue";
</script>

<template>
  <section class="view">
    <Hero />
    <Thesis />
    <ScenarioList />
    <PersonaCards />
    <Colophon />
  </section>
</template>

<style scoped>
.view {
  animation: fadeIn 520ms var(--ease-out);
  padding: var(--pad-y) var(--pad-x);
  max-width: 1400px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
