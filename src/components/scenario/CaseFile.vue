<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { Scenario } from "@/data/types";
import type { StepKind } from "@/composables/useStepState";

const props = defineProps<{ scenario: Scenario; current: StepKind | null }>();

const caseEl = ref<HTMLElement | null>(null);

const highlights = computed<{ keys: Set<string>; activeKey: string | null; personaId: string | null }>(() => {
  const keys = new Set<string>();
  let activeKey: string | null = null;
  let personaId: string | null = null;
  const c = props.current;
  if (!c) return { keys, activeKey, personaId };

  if (c.kind === "walkthrough") {
    const walk = props.scenario.walkthrough ?? [];
    for (let i = 0; i <= c.index; i++) {
      const k = walk[i]?.key;
      if (k) keys.add(k);
    }
    activeKey = walk[c.index]?.key ?? null;
  } else if (c.kind === "persona") {
    const persona = props.scenario.personas?.[c.personaId];
    persona?.pulls.forEach((p) => keys.add(p.key));
    personaId = c.personaId;
  } else if (c.kind === "reveal") {
    (props.scenario.walkthrough ?? []).forEach((w) => w.key && keys.add(w.key));
  }

  return { keys, activeKey, personaId };
});

watch(highlights, async () => {
  await nextTick();
  const el = caseEl.value;
  if (!el) return;
  el.querySelectorAll("mark").forEach((m) => {
    m.removeAttribute("data-highlighted");
    m.removeAttribute("data-persona");
    m.removeAttribute("data-pulse");
  });
  highlights.value.keys.forEach((key) => {
    const m = el.querySelector(`mark[data-key="${key}"]`) as HTMLElement | null;
    if (!m) return;
    m.setAttribute("data-highlighted", "");
    if (highlights.value.personaId) m.setAttribute("data-persona", highlights.value.personaId);
    if (key === highlights.value.activeKey) {
      m.setAttribute("data-pulse", "");
      const rect = m.getBoundingClientRect();
      const out = rect.top < 80 || rect.bottom > window.innerHeight - 80;
      if (out) m.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}, { immediate: true, flush: "post" });
</script>

<template>
  <div class="case-file">
    <div class="case-file-header">
      <span class="micro">Case facts</span>
      <span class="micro">Synthetic, grounded in real manual ambiguity</span>
    </div>
    <div ref="caseEl" class="case-text">
      <p v-for="(f, i) in scenario.facts" :key="i" v-html="f" />
    </div>
  </div>
</template>

<style scoped>
.case-file {
  margin: 2.5rem 0 2rem;
  padding: 2rem 0;
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
}

.case-file-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 1.5rem;
  text-transform: uppercase;
}

.case-text {
  font-family: var(--serif);
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--ink);
  font-weight: 380;
  letter-spacing: -0.005em;
  position: relative;
  hyphens: auto;
}

.case-text :deep(p) {
  margin: 0 0 1.25rem;
}

.case-text :deep(p:last-child) {
  margin-bottom: 0;
}

.case-text :deep(mark) {
  background: transparent;
  color: inherit;
  position: relative;
  padding: 0.05em 0.1em;
  margin: 0 -0.1em;
  border-radius: 2px;
  transition: background 480ms var(--ease-out), color 240ms;
}

.case-text :deep(mark[data-highlighted]) {
  background: var(--paper-deep);
}

.case-text :deep(mark[data-persona="legal"][data-highlighted]) {
  background: color-mix(in oklch, var(--legal-soft) 85%, transparent);
  color: var(--legal-ink);
}

.case-text :deep(mark[data-persona="worker"][data-highlighted]) {
  background: color-mix(in oklch, var(--worker-soft) 85%, transparent);
  color: var(--worker-ink);
}

.case-text :deep(mark[data-persona="director"][data-highlighted]) {
  background: color-mix(in oklch, var(--director-soft) 85%, transparent);
  color: var(--director-ink);
}

.case-text :deep(mark[data-pulse]) {
  animation: highlightPulse 1400ms var(--ease-out);
}

@keyframes highlightPulse {
  0% { box-shadow: 0 0 0 0 color-mix(in oklch, currentColor 15%, transparent); }
  60% { box-shadow: 0 0 0 6px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
</style>
