import type { Scenario } from "../types";

/**
 * Locked scenario placeholders. Each appears in the index but is not navigable.
 * When you're ready to publish one, move it to its own file (e.g. 03-mom-money.ts),
 * fill out the full Scenario shape, set locked: false, and import it in index.ts.
 */
export const stubs: Scenario[] = [
  {
    id: "06",
    title: "Foster stipend, mid-recertification",
    zone: { full: "Earned vs. unearned income", short: "Income" },
    hr1: { relevance: "indirect", note: "Indirect" },
    locked: true,
  },
  {
    id: "07",
    title: "Vehicle equity in a one-car household",
    zone: { full: "Resource counting", short: "Resources" },
    hr1: { relevance: "indirect", note: "Indirect" },
    locked: true,
  },
  {
    id: "08",
    title: "Adult child returns home",
    zone: { full: "Household composition", short: "Household" },
    hr1: { relevance: "indirect", note: "Indirect" },
    locked: true,
  },
  {
    id: "09",
    title: "Volunteer hours and exemption stacking",
    zone: { full: "ABAWD / work requirements", short: "ABAWD" },
    hr1: { relevance: "central", note: "Central" },
    locked: true,
  },
  {
    id: "10",
    title: "Cash app tips on a 1099",
    zone: { full: "Earned vs. unearned income", short: "Income" },
    hr1: { relevance: "indirect", note: "Indirect" },
    locked: true,
  },
];
