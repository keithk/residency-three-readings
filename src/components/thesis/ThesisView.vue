<script setup lang="ts">
import ThesisHero from "./ThesisHero.vue";
import ThesisArgument from "./ThesisArgument.vue";
import Recommendations from "./Recommendations.vue";
import TensionNote from "./TensionNote.vue";
import EvalMethodology from "./EvalMethodology.vue";
import ClosingCall from "./ClosingCall.vue";
import Colophon from "@/components/index/Colophon.vue";
</script>

<template>
  <section class="view">
    <ThesisHero />
    <ThesisArgument />
    <Recommendations />
    <TensionNote />
    <EvalMethodology />
    <ClosingCall />
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
