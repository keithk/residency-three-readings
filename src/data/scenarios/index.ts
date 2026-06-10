import type { Scenario } from "../types";
import { scenario01 } from "./01-ex-roommate";
import { scenario02 } from "./02-gig-worker";
import { scenario03 } from "./03-mom-money";
import { scenario04 } from "./04-eitc-refund";
import { scenario05 } from "./05-pending-ssdi";
import { stubs } from "./stubs";

/**
 * Ordered list of all scenarios shown in the index. To publish a new one:
 * 1. Create src/data/scenarios/NN-name.ts that exports a Scenario.
 * 2. Import it here and replace the matching stub.
 * 3. Remove the stub entry from stubs.ts.
 */
export const SCENARIOS: Scenario[] = [
  scenario01,
  scenario02,
  scenario03,
  scenario04,
  scenario05,
  ...stubs,
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
