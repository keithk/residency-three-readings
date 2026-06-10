<script setup lang="ts">
defineProps<{ kind: "facts" }>();
</script>

<template>
  <div class="context-block">
    <h3>Read the case slowly.</h3>
    <p>Before the walkthrough, you'll see how the model answers when asked to pick a single reading up front.</p>
  </div>
</template>

<style scoped>
.context-block {
  padding: 1.625rem 1.75rem;
  background: var(--paper-2);
  border: 1px solid var(--rule);
  display: grid;
  gap: 0.75rem;
}

.context-block h3 {
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 420;
  font-variation-settings: "opsz" 24;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin: 0;
  font-style: italic;
}

.context-block p {
  font-family: var(--serif);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  color: var(--ink-soft);
  font-weight: 380;
}
</style>
