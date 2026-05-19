import type { PersonaArchetype } from "./types";

export const PERSONAS: PersonaArchetype[] = [
  {
    id: "legal",
    label: "Legal aid attorney",
    nameHtml: "The <em>advocate</em>",
    body: "Works at a benefits clinic or legal services unit. Sees the system when it has gone wrong. Reads regs through a 'what does this mean for my client' frame and pushes toward the most favorable interpretation the text will bear.",
    cueLabel: "Default frame",
    cueText: "<strong>Resolve ambiguity toward eligibility.</strong>",
  },
  {
    id: "worker",
    label: "Eligibility worker",
    nameHtml: "The <em>careful processor</em>",
    body: "County or state SNAP office. Trained around the QC system, which penalizes wrongful grants harder than wrongful denials. Rewards verifying before deciding, pending cases where documentation is thin, and following the manual closely.",
    cueLabel: "Default frame",
    cueText: "<strong>Verify before deciding.</strong>",
  },
  {
    id: "director",
    label: "SNAP director",
    nameHtml: "The <em>institution</em>",
    body: "Runs a state program or a major county. Holds three concerns at once: federal compliance, cross-worker consistency, and the operational reality. The persona who has to make the call where the manual is silent; the call becomes precedent inside the agency.",
    cueLabel: "Default frame",
    cueText: "<strong>What guidance holds up under audit?</strong>",
  },
];
