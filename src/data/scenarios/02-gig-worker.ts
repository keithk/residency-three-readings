import type { Scenario } from "../types";

export const scenario02: Scenario = {
  id: "02",
  title: "The gig worker hours",
  zone: { full: "ABAWD / work requirements", short: "ABAWD" },
  hr1: { relevance: "central", note: "Central. HR1 expanded ABAWD to age 64 and tightened verification posture." },
  locked: false,
  determination: "Does Marcus's self-attested hours log, combined with platform earnings records, satisfy ABAWD work verification?",
  facts: [
    `<mark data-key="age">Marcus (58)</mark> applies for SNAP in Georgia as a single-person household after losing his warehouse job in December 2025. He's been doing DoorDash and Instacart since January, his primary income now, and self-reports averaging <mark data-key="hours">22 hours per week across both platforms</mark>.`,
    `His bank statements show $1,400 to $1,700 per month in platform payouts across the last three months. He has in-app earnings summaries from both platforms but <mark data-key="docs">neither provides him with a report of logged hours</mark>.`,
    `<mark data-key="notebook">He estimates hours by adding up dash windows and shopping trips in a spiral notebook he keeps in his truck.</mark> No dependents, no disability determination, not in any of the codified exemption categories added by HR1.`,
    `<mark data-key="hr1">Under HR1 he is newly subject to ABAWD; the expansion to age 64 reached him in 2026.</mark> Georgia does not hold a statewide ABAWD waiver, and the county he lives in is not on the narrowed high-unemployment list.`,
  ],
  walkthrough: [
    {
      key: "age",
      title: "Newly subject to ABAWD at 58",
      note: `Pre-HR1, the ABAWD age band ended at 54. <strong>Marcus would not have been subject to work requirements at all.</strong> The post-HR1 expansion to 64 reaches him directly.`,
    },
    {
      key: "hours",
      title: "22 hours per week clears 80/month",
      note: `<strong>The numbers work, if you believe them.</strong> The question is no longer eligibility on the merits; it's whether the hours are documented to the state's satisfaction.`,
    },
    {
      key: "docs",
      title: "Platforms don't produce hours reports by default",
      note: `<strong>A documentation gap by design, not by the claimant.</strong> Earnings reports exist; hours reports require a specific request and take roughly 30 days.`,
    },
    {
      key: "notebook",
      title: "Spiral notebook hour log",
      note: `<strong>A good-faith estimate is not verification.</strong> Or it is, depending on which precedent you cite. Informal labor verification accepts contemporaneous logs; ABAWD post-HR1 may not.`,
    },
    {
      key: "hr1",
      title: "Post-November 2025 QC counts these errors",
      note: `Starting Nov 1, 2025, <strong>incorrect determinations on the expanded ABAWD population count toward state QC error rates</strong>, which under HR1 drive FY2028 state cost-sharing.`,
    },
  ],
  personas: {
    legal: {
      label: "Legal aid attorney",
      name: "The advocate",
      emphasis: "Pushes toward eligibility.",
      reading: `Lands on <em>hours are verified</em>, or failing that, on <em>pend with a specific, documented request</em>. Denying a gig worker for not having data the platform doesn't produce by default is a systemic failure the state imposed, not a compliance failure the claimant created.`,
      call: "Hours are verified",
      pulls: [
        { key: "docs", text: `<strong>The documentation gap is the platform's design choice,</strong> not Marcus's. He can't surface what they don't produce.` },
        { key: "notebook", text: `<strong>Contemporaneous personal logs are accepted</strong> for informal labor, domestic work, self-employment. ABAWD shouldn't apply a stricter test.` },
      ],
      weights: [
        { label: "Hours are verified", value: 55 },
        { label: "Hours are not verified", value: 8 },
        { label: "Pend with specific request", value: 37 },
      ],
    },
    worker: {
      label: "Eligibility worker",
      name: "The careful processor",
      emphasis: "Verifies before deciding.",
      reading: `Pulled toward <em>not verified</em>. ABAWD determinations are among the most audited work-requirement categories. After November 2025, accepting the notebook is procedurally exposed. Pending the case is the safe move.`,
      call: "Hours are not verified",
      pulls: [
        { key: "notebook", text: `<strong>A claimant-produced estimate is not verification</strong> by the standard the manual applies to other earned-income documentation.` },
        { key: "hr1", text: `<strong>QC sampling on the expanded population now counts.</strong> A wrong call costs the state under the new error-rate exposure.` },
      ],
      weights: [
        { label: "Hours are verified", value: 12 },
        { label: "Hours are not verified", value: 53 },
        { label: "Pend with specific request", value: 35 },
      ],
    },
    director: {
      label: "SNAP director",
      name: "The institution",
      emphasis: "Holds federal compliance, cross-worker consistency, audit posture.",
      reading: `Most state manuals don't address platform gig work for ABAWD verification, because the chapters were written for pre-platform independent contractor work. <em>Cross-worker consistency</em> is the dominant concern. Director likely issues standing guidance to require platform-sourced activity reports, which compresses to pending in practice and which advocacy will call a soft denial.`,
      call: "Pend with specific request",
      pulls: [
        { key: "docs", text: `<strong>State guidance is silent on gig hour verification.</strong> The director's call here becomes office precedent.` },
        { key: "hr1", text: `<strong>Cost-sharing exposure starts FY2028.</strong> Permissive guidance now compounds across thousands of similar cases.` },
      ],
      weights: [
        { label: "Hours are verified", value: 18 },
        { label: "Hours are not verified", value: 28 },
        { label: "Pend with specific request", value: 54 },
      ],
    },
  },
  interpretations: [
    { label: "Hours are verified", gloss: "Notebook plus earnings meets the evidentiary threshold." },
    { label: "Hours are not verified", gloss: "Earnings are not hours; deny or pend." },
    { label: "Pend with specific request", gloss: "A documented request for platform activity reports before deciding." },
  ],
  confidence: {
    baselineLabel: "Pend with specific request",
    beforeHeadline: "<em>Pend</em>, with high confidence",
    beforeStat: "88",
    beforeStatSuffix: "% confident",
    beforeNote: "Asked up front, the model commits to the procedural middle path with conviction.",
    afterDist: [
      { label: "Hours are verified", value: 28 },
      { label: "Hours are not verified", value: 30 },
      { label: "Pend with specific request", value: 42 },
    ],
    afterNote: "After reading through all three lenses, the model recognizes the procedural middle path <em>becomes</em> the substantive denial in practice. Confidence drops; framing sharpens.",
  },
};
