<script setup lang="ts">
import type { Scenario } from "@/data/types";
defineProps<{ scenario: Scenario }>();
</script>

<template>
  <aside class="scenario-rail">
    <div class="rail-block">
      <span class="micro">Scenario</span>
      <div class="rail-number">{{ scenario.id }}</div>
    </div>
    <div class="rail-block">
      <span class="micro">Policy zone</span>
      <div class="rail-tag">{{ scenario.zone.full }}</div>
    </div>
    <div v-if="scenario.hr1" class="rail-block">
      <span class="micro">HR1 / Big Beautiful Bill</span>
      <div class="rail-tag rail-tag-hr1">{{ scenario.hr1.note }}</div>
    </div>
  </aside>
</template>

<style scoped>
.scenario-rail {
  display: grid;
  gap: 1.75rem;
  position: sticky;
  top: 100px;
  align-self: start;
}

@media (max-width: 1180px) {
  .scenario-rail {
    position: static;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}

.rail-block {
  display: grid;
  gap: 0.45rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--rule);
}

.rail-number {
  font-family: var(--serif);
  font-size: 3.25rem;
  font-weight: 320;
  font-variation-settings: "opsz" 48;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.rail-tag {
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--ink);
  text-transform: uppercase;
  line-height: 1.3;
}

.rail-tag-hr1 { color: var(--stamp); }
</style>
