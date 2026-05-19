import type { Scenario } from "../types";

export const scenario01: Scenario = {
  id: "01",
  title: "The ex-roommate on the lease",
  zone: { full: "Household composition", short: "Household" },
  hr1: { relevance: "limited", note: "Limited bearing, but heightens stakes at the margin" },
  locked: false,
  determination: "Is Jordan part of Maria's SNAP household for this application?",
  facts: [
    `Maria (31) applies for SNAP in North Carolina for herself and her two kids (ages 4 and 7), both from a prior relationship. <mark data-key="cohabit">She shares a two-bedroom apartment with Jordan (34), her ex-boyfriend of two years.</mark> They broke up eight months ago but both names are on the lease, which has five months left to run; neither can afford to move.`,
    `Maria sleeps in one bedroom with the kids, Jordan in the other. She says they <mark data-key="prep">"don't really eat together anymore": she buys groceries and cooks for herself and the kids, Jordan eats takeout or at his mother's nearby</mark>. <mark data-key="kitchen">They share the fridge and the kitchen.</mark>`,
    `When Maria has fallen short on rent (three or four times in the past year), <mark data-key="rent">Jordan has covered her half, roughly $150 to $200 each time</mark>. <mark data-key="streaming">He still pays for her streaming on his account.</mark>`,
    `<mark data-key="income">Jordan works full time as a warehouse supervisor at $3,800/month gross. Maria earns $1,450/month part time.</mark>`,
  ],
  walkthrough: [
    {
      key: "cohabit",
      title: "Cohabitation eight months after the breakup",
      note: `Two unrelated adults on the same lease, no longer a couple. That's <strong>the household-composition question</strong>, and federal regs leave it to a functional test rather than a status test.`,
      citation: "7 CFR 273.1(a)",
    },
    {
      key: "prep",
      title: "Purchase and prepare, separately",
      note: `The 7 CFR 273.1(a) test is whether members <strong>"customarily purchase food and prepare meals together"</strong>. Maria says no. That's the cleanest argument for keeping Jordan out.`,
      citation: "7 CFR 273.1(a)",
    },
    {
      key: "kitchen",
      title: "Shared fridge, shared kitchen",
      note: `The other side. <strong>Shared cooking infrastructure</strong> is exactly what eligibility workers point to when arguing a functional household, regardless of whether anyone actually cooks together this week.`,
    },
    {
      key: "rent",
      title: "Recurring rent help",
      note: `Three or four times a year, $150 to $200 a pop. <strong>Loan-like, or co-mingling?</strong> The classification controls income treatment and the household call.`,
    },
    {
      key: "income",
      title: "The math that makes this stakes",
      note: `If Jordan is in, combined gross is $5,250 for a household of four. That's above the 130% FPL gross income test (about $3,380 in 2026). <strong>Eligible at the margin becomes ineligible by a lot.</strong>`,
    },
    {
      key: "carve",
      title: "North Carolina has an explicit carve-out",
      note: `NC manual: <em>"Unmarried couples who live together and do not have common children are not required to be included in the same FNS unit."</em> The kids aren't Jordan's. The carve-out applies on its face, but only if "couple" still describes them eight months post-breakup.`,
      citation: "NC SNAP Policy Manual",
    },
  ],
  personas: {
    legal: {
      label: "Legal aid attorney",
      name: "The advocate",
      emphasis: "Pushes toward eligibility.",
      reading: `Lands strongly on <em>not in the household</em>. NC policy carves this fact pattern out explicitly. Occasional rent help doesn't convert separate households into a combined one. Ambiguity in the regs resolves toward the claimant.`,
      pulls: [
        { key: "carve", text: `<strong>The NC carve-out is the move.</strong> The text covers this fact pattern on its face; the office is being asked to add a requirement the statute doesn't impose.` },
        { key: "prep", text: `<strong>Functionally separate purchase and prep.</strong> The federal test is met, regardless of the kitchen sharing.` },
        { key: "rent", text: `<strong>Loan-like, not commingled.</strong> Three or four covers a year is exactly the pattern shared-household tests are designed not to capture.` },
      ],
      weights: [
        { label: "Not in household", value: 80 },
        { label: "In household", value: 6 },
        { label: "Verify further before deciding", value: 14 },
      ],
    },
    worker: {
      label: "Eligibility worker",
      name: "The careful processor",
      emphasis: "Verifies before deciding.",
      reading: `Genuinely torn. The NC carve-out gives cover for <em>not in</em>, but shared fridge plus recurring rent help is exactly the QC-risk pattern. A worker who accepts the screening at face value can be on the wrong end of an audit. A worker who pends has a procedurally safe answer.`,
      pulls: [
        { key: "kitchen", text: `<strong>The shared kitchen reads as a functional-household signal,</strong> independent of what either party says about meals.` },
        { key: "rent", text: `<strong>Recurring rent support is the QC red flag.</strong> Two pages of guidance say to scrutinize patterns like this.` },
        { key: "cohabit", text: `<strong>Eight months post-breakup, still cohabiting.</strong> A reasonable worker wants documentation before calling this separate.` },
      ],
      weights: [
        { label: "Not in household", value: 22 },
        { label: "In household", value: 28 },
        { label: "Verify further before deciding", value: 50 },
      ],
    },
    director: {
      label: "SNAP director",
      name: "The institution",
      emphasis: "Holds federal compliance, cross-worker consistency, audit posture.",
      reading: `Reads through <em>what guidance do I issue, and how does it hold up under audit and litigation?</em> The NC carve-out probably makes this case more likely to survive audit as <em>separate</em> than a co-parent case would, but the worker has to document the separate-routines finding carefully. The bigger risk is inconsistency across workers in the same office.`,
      pulls: [
        { key: "carve", text: `<strong>The explicit text is a strong audit defense,</strong> if and only if the file documents the carve-out reasoning.` },
        { key: "income", text: `<strong>The income asymmetry creates litigation risk either way.</strong> A wrongful inclusion costs the family $600 a month; a wrongful exclusion costs the state if QC samples it.` },
        { key: "prep", text: `<strong>The separate purchase-and-prepare finding</strong> needs to come from documented diligence, not the applicant's say-so.` },
      ],
      weights: [
        { label: "Not in household", value: 36 },
        { label: "In household", value: 18 },
        { label: "Verify further before deciding", value: 46 },
      ],
    },
  },
  interpretations: [
    "Not in household. NC carve-out applies; purchase and prepare is separate.",
    "In household. Functional-household test under 7 CFR 273.1(a).",
    "Verify further before deciding. Diligent check before a determination.",
  ],
  confidence: {
    beforeHeadline: "<em>Not in household</em>",
    beforeStat: "95",
    beforeStatSuffix: "% confident",
    beforeNote: "When the model is asked to pick a single answer up front, it picks one and commits.",
    afterDist: [
      { label: "Not in household", value: 40 },
      { label: "In household", value: 17 },
      { label: "Verify further before deciding", value: 43 },
    ],
    afterNote: "After reading through all three lenses, the model surfaces a three-way split. The single 95% became a calibrated <em>I'm not sure, and here's why</em>.",
  },
};
