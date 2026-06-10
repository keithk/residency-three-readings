import type { PersonaArchetype } from "./types";

export const PERSONAS: PersonaArchetype[] = [
  {
    id: "legal",
    label: "Legal aid attorney",
    nameHtml: "The <em>advocate</em>",
    body: "Works at a benefits clinic or legal services unit. Sees the system when it has gone wrong. Reads regs through a 'what does this mean for my client' frame and pushes toward the most favorable interpretation the text will bear.",
    cueLabel: "Default frame",
    cueText: "<strong>Resolve ambiguity toward eligibility.</strong>",
    measureLabel: "What we measured",
    measureHtml: "This is the reading a model is least likely to produce on its own. Given only the words <strong>legal aid attorney</strong>, it read the case this way 40% of the time. Given the full description of the job and its pressures, 87%.",
  },
  {
    id: "worker",
    label: "Eligibility worker",
    nameHtml: "The <em>careful processor</em>",
    body: "County or state SNAP office. Trained around the QC system, which penalizes wrongful grants harder than wrongful denials. Rewards verifying before deciding, pending cases where documentation is thin, and following the manual closely.",
    cueLabel: "Default frame",
    cueText: "<strong>Verify before deciding.</strong>",
    measureLabel: "What we measured",
    measureHtml: "Writing the job down changes how the model reads. Asked to point at the exact sentences in the case a worker would flag, it went from <strong>almost never</strong> doing that to doing it <strong>most of the time</strong>.",
  },
  {
    id: "director",
    label: "SNAP director",
    nameHtml: "The <em>institution</em>",
    body: "Runs a state program or a major county. Holds three concerns at once: federal compliance, cross-worker consistency, and the operational reality. The persona who has to make the call where the manual is silent; the call becomes precedent inside the agency.",
    cueLabel: "Default frame",
    cueText: "<strong>What guidance holds up under audit?</strong>",
    measureLabel: "What we measured",
    measureHtml: "Caution is where models already live. Even the bare job title produced director-shaped answers <strong>80%</strong> of the time. The written description changes how carefully the answer is hedged and documented, not which answer it is.",
  },
];
