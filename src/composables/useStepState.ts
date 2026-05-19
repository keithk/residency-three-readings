import { computed, type ComputedRef } from "vue";
import type { Scenario, PersonaId } from "@/data/types";

export type StepKind =
  | { kind: "facts" }
  | { kind: "walkthrough"; index: number }
  | { kind: "persona"; personaId: PersonaId }
  | { kind: "reveal" };

const PERSONA_ORDER: PersonaId[] = ["legal", "worker", "director"];

export function totalSteps(scenario: Scenario): number {
  const walk = scenario.walkthrough?.length ?? 0;
  return 1 /* facts */ + walk + 3 /* personas */ + 1 /* reveal */;
}

export function stepKind(scenario: Scenario, step: number): StepKind {
  if (step <= 0) return { kind: "facts" };
  const walk = scenario.walkthrough?.length ?? 0;
  if (step <= walk) return { kind: "walkthrough", index: step - 1 };
  if (step === walk + 1) return { kind: "persona", personaId: "legal" };
  if (step === walk + 2) return { kind: "persona", personaId: "worker" };
  if (step === walk + 3) return { kind: "persona", personaId: "director" };
  return { kind: "reveal" };
}

export interface StepLabels {
  short: string;
  /** Label for the primary CTA button. */
  next: string;
  /** Tone for the primary CTA, used for theming. */
  nextTone?: PersonaId;
}

export function stepLabels(scenario: Scenario, step: number): StepLabels {
  const sk = stepKind(scenario, step);
  const walk = scenario.walkthrough ?? [];

  if (sk.kind === "facts") {
    return { short: "Read the facts", next: "Begin walkthrough" };
  }
  if (sk.kind === "walkthrough") {
    const last = sk.index === walk.length - 1;
    return {
      short: `Walkthrough ${sk.index + 1} of ${walk.length}`,
      next: last ? "On to the personas" : "Next phrase",
      nextTone: last ? "legal" : undefined,
    };
  }
  if (sk.kind === "persona") {
    const idx = PERSONA_ORDER.indexOf(sk.personaId);
    const nextPersona = PERSONA_ORDER[idx + 1];
    const name = { legal: "Legal aid", worker: "Eligibility worker", director: "SNAP director" }[sk.personaId];
    return {
      short: name,
      next: nextPersona ? "Next persona" : "Show the reveal",
      nextTone: nextPersona,
    };
  }
  return { short: "Confidence reveal", next: "End of scenario" };
}

/**
 * Reactive view over the current scenario + step. Returns null when the
 * scenario can't be resolved or is locked.
 */
export function useStepState(
  scenarioRef: ComputedRef<Scenario | null>,
  stepRef: ComputedRef<number>,
) {
  const total = computed(() => (scenarioRef.value ? totalSteps(scenarioRef.value) : 0));
  const current = computed<StepKind | null>(() =>
    scenarioRef.value ? stepKind(scenarioRef.value, stepRef.value) : null,
  );
  const labels = computed<StepLabels | null>(() =>
    scenarioRef.value ? stepLabels(scenarioRef.value, stepRef.value) : null,
  );

  return { total, current, labels };
}
