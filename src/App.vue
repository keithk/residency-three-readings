<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "@/composables/useRoute";
import { getScenario } from "@/data/scenarios";
import Masthead from "@/components/Masthead.vue";
import ScenarioIndex from "@/components/index/ScenarioIndex.vue";
import ScenarioView from "@/components/scenario/ScenarioView.vue";
import ThesisView from "@/components/thesis/ThesisView.vue";

const { route } = useRoute();

const scenario = computed(() => {
  if (route.value.view !== "scenario") return null;
  const s = getScenario(route.value.scenarioId);
  return s && !s.locked ? s : null;
});

watch(
  () => [route.value, scenario.value?.title] as const,
  ([r, title]) => {
    if (r.view === "scenario" && title) {
      document.title = `${scenario.value!.id}. ${title}, The Disagreement Dataset`;
    } else if (r.view === "thesis") {
      document.title = "The argument, The Disagreement Dataset";
    } else {
      document.title = "The Disagreement Dataset, Propel AI Residency";
    }
  },
  { immediate: true },
);
</script>

<template>
  <Masthead />
  <main>
    <ThesisView v-if="route.view === 'thesis'" />
    <ScenarioIndex v-else-if="route.view === 'index' || !scenario" />
    <ScenarioView v-else :scenario="scenario!" :step="route.step" />
  </main>
</template>

<style>
main {
  display: block;
}
</style>
