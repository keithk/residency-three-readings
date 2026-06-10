<script setup lang="ts">
import { useRoute } from "@/composables/useRoute";

const { route, navigate } = useRoute();
</script>

<template>
  <header class="masthead">
    <div class="masthead-inner">
      <a
        class="masthead-identity"
        href="#/"
        @click.prevent="navigate({ view: 'index' })"
        aria-label="Beyond Average — home"
      >
        <span class="masthead-title">Beyond Average</span>
        <span class="masthead-sub meta">Propel AI Residency</span>
      </a>

      <nav class="masthead-nav" aria-label="Site navigation">
        <a
          class="nav-link meta"
          :class="{ active: route.view === 'about' }"
          href="#/about"
          @click.prevent="navigate({ view: 'about' })"
        >About</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.masthead {
  border-bottom: 1px solid var(--rule);
  padding: 0.875rem var(--pad-x);
  background: color-mix(in oklch, var(--paper) 88%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.masthead-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.masthead-identity {
  display: flex;
  align-items: baseline;
  gap: 0.875rem;
  text-decoration: none;
  flex-wrap: wrap;
  row-gap: 0.125rem;
}

.masthead-identity:focus-visible {
  outline: 2px solid var(--stamp);
  outline-offset: 3px;
  border-radius: 2px;
}

.masthead-title {
  font-family: var(--serif);
  font-size: 1rem;
  font-weight: 480;
  font-variation-settings: "opsz" 20;
  letter-spacing: -0.01em;
  color: var(--ink);
  white-space: nowrap;
}

.masthead-sub {
  color: var(--ink-faint);
  font-size: 0.6875rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
}

.masthead-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.nav-link {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
  text-decoration: none;
  transition: color 160ms var(--ease-out);
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.active {
  color: var(--ink);
}

.nav-link:focus-visible {
  outline: 2px solid var(--stamp);
  outline-offset: 3px;
  border-radius: 2px;
}

@media (max-width: 520px) {
  .masthead-sub {
    display: none;
  }
}
</style>
