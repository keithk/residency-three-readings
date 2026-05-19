<script setup lang="ts"></script>

<template>
  <header class="masthead">
    <div class="masthead-row">
      <span class="meta">Keith Kurson, Propel AI Residency</span>
      <span class="meta meta-dot">·</span>
      <span class="meta">No. 01</span>
      <span class="meta meta-dot">·</span>
      <span class="meta">April 2026</span>
    </div>
  </header>
</template>

<style scoped>
.masthead {
  border-bottom: 1px solid var(--rule);
  padding: 1.125rem var(--pad-x);
  background: color-mix(in oklch, var(--paper) 80%, transparent);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.masthead-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 0.75rem;
  row-gap: 0.25rem;
  max-width: 1400px;
  margin: 0 auto;
  text-transform: uppercase;
}

.masthead-row .meta {
  white-space: nowrap;
}

@media (max-width: 520px) {
  .masthead-row .meta-dot {
    display: none;
  }
  .masthead-row {
    column-gap: 0.875rem;
  }
}
</style>
