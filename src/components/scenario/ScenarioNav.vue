<script setup lang="ts">
defineProps<{ step: number; total: number; onBack: () => void }>();
</script>

<template>
  <nav class="scenario-nav">
    <button class="back-link" @click="onBack">
      <span class="back-arrow">←</span>
      <span>Back to scenarios</span>
    </button>
    <div class="step-track">
      <span
        v-for="i in total"
        :key="i"
        class="step-dot"
        :data-active="i - 1 === step || null"
        :data-done="i - 1 < step || null"
      />
    </div>
  </nav>
</template>

<style scoped>
.scenario-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  transition: color 240ms;
}

.back-link:hover { color: var(--stamp); }
.back-arrow { transition: transform 320ms var(--ease-out); }
.back-link:hover .back-arrow { transform: translateX(-4px); }

.step-track {
  margin-left: auto;
  display: flex;
  gap: 6px;
  align-items: center;
}

.step-dot {
  width: 18px;
  height: 2px;
  background: var(--rule);
  transition: background 240ms, width 320ms var(--ease-out);
}

.step-dot[data-active] {
  background: var(--ink);
  width: 32px;
}

.step-dot[data-done] {
  background: var(--ink-soft);
}
</style>
