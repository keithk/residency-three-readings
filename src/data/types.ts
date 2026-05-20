export type PersonaId = "legal" | "worker" | "director";

export interface PersonaArchetype {
  id: PersonaId;
  label: string;
  nameHtml: string;
  body: string;
  cueLabel: string;
  cueText: string;
}

export interface WalkthroughStep {
  /** Mark key inside the case facts that this step highlights. May be absent for conceptual annotations. */
  key?: string;
  title: string;
  /** HTML allowed. Use <strong> for emphasis. */
  note: string;
  citation?: string;
}

export interface PersonaPull {
  /** Mark key in the case the persona zeroes in on. */
  key: string;
  /** HTML allowed. */
  text: string;
}

export interface PersonaWeight {
  label: string;
  /** 0–100. The set should sum to 100 per persona. */
  value: number;
}

export interface PersonaReading {
  label: string;
  /** Display name like "The advocate". The last word is italicized in the UI. */
  name: string;
  /** Short cue under the label. */
  emphasis: string;
  /** HTML allowed. The persona's full reading of the case. */
  reading: string;
  /** The headline interpretation this persona lands on. Must match one of the weights[].label values. */
  call: string;
  pulls: PersonaPull[];
  weights: PersonaWeight[];
}

export interface Interpretation {
  /** Short label used across weights, persona.call, and confidence.afterDist. Must match exactly. */
  label: string;
  /** Sentence-form supporting text. The "why this reading is named what it is" gloss. */
  gloss: string;
}

export interface ConfidenceData {
  /** The semantic baseline answer; must match one of the interpretation labels. */
  baselineLabel: string;
  /** Headline shown above the big number. HTML allowed; display only. */
  beforeHeadline: string;
  /** Big stat shown alone. Usually just the number, e.g. "95%". */
  beforeStat: string;
  /** Subhead under the big number, e.g. "confident". */
  beforeStatSuffix: string;
  beforeNote: string;
  /** Distribution after considering all three personas. Should sum to 100. */
  afterDist: { label: string; value: number }[];
  afterNote: string;
}

export type Hr1Relevance = "central" | "indirect" | "limited";

export interface PolicyZoneTag {
  full: string;
  short: string;
}

export interface Scenario {
  id: string;
  title: string;
  zone: PolicyZoneTag;
  hr1?: { relevance: Hr1Relevance; note: string };
  /** Marks the scenario as published. Locked scenarios appear in the index but are not navigable. */
  locked: boolean;
  determination?: string;
  /** HTML strings with <mark data-key="..."> wrapping load-bearing phrases. */
  facts?: string[];
  walkthrough?: WalkthroughStep[];
  personas?: Record<PersonaId, PersonaReading>;
  interpretations?: Interpretation[];
  confidence?: ConfidenceData;
}
