import type { Scenario } from "../types";

export const scenario04: Scenario = {
  id: "04",
  title: "The EITC refund sitting in savings",
  zone: { full: "Resource counting", short: "Resources" },
  hr1: { relevance: "indirect", note: "Indirect; OBBBA lowered the QC tolerance threshold to zero, making every dollar of a sampled balance count" },
  locked: false,
  determination:
    "On the April 30 sample date, is any portion of the $4,910 balance excluded as a federal tax refund, and if so, how is the excluded amount calculated once the refund has been commingled and partially spent down?",
  facts: [
    `Marcus and Renée Lewis (both 41) live in Memphis with Renée's mother Bernice (67), who receives $1,180/month in Social Security. <mark data-key="elderly">Bernice is the household's elderly member, which removes the gross income test, but triggers the $4,500 resource limit under 7 CFR 273.8(b).</mark> Marcus grosses $2,650/month as a forklift operator; Renée is on unpaid FMLA through August 2026 recovering from carpal tunnel surgery.`,
    `This is a mid-period review prompted by an interface match. The household's joint Regions Bank checking account, <mark data-key="balance">on the April 30, 2026 QC sample date, shows $4,910</mark>: $410 over the limit on its face.`,
    `Of that, $3,170 traces to a <mark data-key="refund">federal tax refund of $5,840 (EITC plus Child Tax Credit) deposited September 11, 2025, eight months before the sample date</mark>. <mark data-key="commingled">The refund landed in the same account as Marcus's biweekly paychecks and the household's debit-card spending.</mark>`,
    `<mark data-key="spent">In the intervening months the household paid down a $1,400 medical bill, replaced a transmission for $1,100, and bought a used dishwasher for $340.</mark> <mark data-key="renee-says">Renée tells the worker, "That's still our tax money. We've been trying to keep it for the rent gap."</mark>`,
  ],
  walkthrough: [
    {
      key: "elderly",
      title: "Why this is a resource case at all",
      note: `Bernice's age changes the test. Households with an elderly member <strong>skip the gross income test but face the $4,500 asset limit</strong>. Without Bernice, the balance would be irrelevant.`,
      citation: "7 CFR 273.8(b)",
    },
    {
      key: "balance",
      title: "$410 over the line, on its face",
      note: `The sample-date balance is the QC universe of one. <strong>$4,910 against a $4,500 limit is a closure case unless an exclusion applies.</strong>`,
    },
    {
      key: "refund",
      title: "A federal refund still inside the 12-month window",
      note: `26 USC 6409 excludes the refund "and shall not be taken into account as resources for a period of 12 months from receipt." <strong>Eight months in, the statutory shield is unambiguous as to the refund itself.</strong> The question is what survived in a mixed account.`,
      citation: "26 USC 6409",
    },
    {
      key: "commingled",
      title: "Mixed with paychecks from day one",
      note: `7 CFR 273.8(g) sets a <strong>six-month commingling cutoff</strong>: excluded funds in a mixed account lose their exemption after six months. By April 30, the six months are gone. Whether the regulation can do this in the teeth of 6409's "notwithstanding any other provision of law" clause is the conflict.`,
      citation: "7 CFR 273.8(g)",
    },
    {
      key: "spent",
      title: "Roughly $2,840 of documented spend-down",
      note: `Medical, transmission, dishwasher. <strong>First-in-first-out favors the household</strong>: spend was from the countable side first, leaving roughly $3,000 of refund money still inside. Tracing favors the agency: the account dipped to its lowest balance in December, and only that floor is provably refund.`,
    },
    {
      key: "renee-says",
      title: "Intent doesn't carry the day",
      note: `Renée: <em>"We've been trying to keep it for the rent gap."</em> Sincere. But intent isn't a method of tracing, and <strong>the regulation reads the balance, not the budget.</strong>`,
    },
  ],
  personas: {
    legal: {
      label: "Legal aid attorney",
      name: "The advocate",
      emphasis: "Pushes toward eligibility.",
      reading: `Lands on <em>fully exempt</em>. 26 USC 6409 is categorical and contains its own preemption clause: <em>notwithstanding any other provision of law</em>. The regulation at 273.8(g) cannot be applied to nullify the twelve-month exclusion the statute creates. FNS's 2011 implementation memorandum operationalized this with a subtraction method, not a tracing method: subtract refund received in the last twelve months from current resources. Documented spend-down comes first-in-first-out from countable funds. Roughly $3,000 of refund money is still inside the account, fully shielded. Closure is reversible at fair hearing.`,
      call: "Fully exempt under 6409",
      pulls: [
        {
          key: "refund",
          text: `<strong>"Notwithstanding any other provision of law"</strong> is a categorical preemption signal. The regulation cannot be applied in a way that nullifies the statutory 12-month exclusion. That's a one-paragraph fair-hearing decision.`,
        },
        {
          key: "spent",
          text: `<strong>FIFO favors the household.</strong> Spend-down comes from countable funds first; the refund remains shielded. This is the calculation the 2011 FNS memo's subtraction method assumes.`,
        },
        {
          key: "renee-says",
          text: `<strong>This is exactly who 6409 was written for.</strong> Low-income households saving a refund to smooth income volatility, then losing benefits because savings push them over the asset limit. The statute exists to prevent that.`,
        },
      ],
      weights: [
        { label: "Fully exempt under 6409", value: 70 },
        { label: "Commingled and countable after six months", value: 8 },
        { label: "Trace via lowest intermediate balance", value: 22 },
      ],
    },
    worker: {
      label: "Eligibility worker",
      name: "The careful processor",
      emphasis: "Verifies before deciding.",
      reading: `Lands on <em>commingled and countable</em>. QC reviewers don't apply preemption analysis; they apply FNS Handbook 310. The regulatory mechanism for honoring excluded funds in a mixed account is 273.8(g)'s six-month rule, which Tennessee has not displaced. Eight months in, the rule is dispositive. Verification (IRS transcript, statements) gets requested, but the default posture is closure absent documentation that flips a tracing analysis. Excluding $4,910 on a generous theory and being wrong produces a sampled over-issuance error at full dollar value under OBBBA's new tolerance.`,
      call: "Commingled and countable after six months",
      pulls: [
        {
          key: "commingled",
          text: `<strong>The six-month rule is explicit.</strong> Tennessee's manual is silent on the 6409/commingling interaction, which means the federal regulation controls, not the federal statute the regulation may or may not honor.`,
        },
        {
          key: "balance",
          text: `<strong>The sample-date balance is the QC universe of one.</strong> Whatever theory excludes it has to survive an FNS Handbook 310 review of a single moment in time.`,
        },
        {
          key: "spent",
          text: `<strong>Commingled spend, commingled remainder.</strong> Once funds are mixed, the household has the burden to prove what's left is refund. Renée's "trying to keep it" is intent, not proof.`,
        },
      ],
      weights: [
        { label: "Fully exempt under 6409", value: 14 },
        { label: "Commingled and countable after six months", value: 56 },
        { label: "Trace via lowest intermediate balance", value: 30 },
      ],
    },
    director: {
      label: "SNAP director",
      name: "The institution",
      emphasis: "Holds federal compliance, cross-worker consistency, audit posture.",
      reading: `Sits on a <em>state-level policy gap</em>. Tennessee has not issued guidance reconciling 6409 with the six-month commingling rule. The director's real choice is across thousands of similar cases, not this one. Honor the twelve-month exclusion via subtraction and the state is exposed if QC reviewers apply Handbook 310's commingling framework. Apply the six-month cutoff and the state takes fair-hearing losses and bad headlines. Require tracing in every sampled case and administrative cost balloons. The likely posture: pend, request the FNS Southeast Regional Office for an implementation memo, and instruct workers to verify rather than auto-close.`,
      call: "Trace via lowest intermediate balance",
      pulls: [
        {
          key: "refund",
          text: `<strong>Tennessee hasn't reconciled the statute and the regulation.</strong> Whatever posture the agency takes will propagate across hundreds of similar cases per year. This case sets policy.`,
        },
        {
          key: "balance",
          text: `<strong>FY2024 error rate of 9.47% puts Tennessee in the 10% cost-share tier.</strong> An over-issuance error on this case flows into the FY2026 number that drives FY2028 obligation. The audit math is no longer abstract.`,
        },
        {
          key: "commingled",
          text: `<strong>Tracing is administratively expensive but doctrinally defensible.</strong> Auto-closure is fast but generates fair-hearing reversals. Pend and ask FNS for guidance is the institutional move.`,
        },
      ],
      weights: [
        { label: "Fully exempt under 6409", value: 22 },
        { label: "Commingled and countable after six months", value: 30 },
        { label: "Trace via lowest intermediate balance", value: 48 },
      ],
    },
  },
  interpretations: [
    { label: "Fully exempt under 6409", gloss: "26 USC 6409's preemption clause overrides the 273.8(g) commingling rule." },
    { label: "Commingled and countable after six months", gloss: "Past the 273.8(g) six-month cutoff, the exemption lapses." },
    { label: "Trace via lowest intermediate balance", gloss: "Pend for IRS transcript and statements to compute the shielded portion." },
  ],
  confidence: {
    baselineLabel: "Trace via lowest intermediate balance",
    beforeHeadline: "<em>Trace</em> the shielded portion",
    beforeStat: "69",
    beforeStatSuffix: "% confident",
    beforeNote:
      "Asked up front, the model reaches for the tracing methodology: pend for the IRS transcript, compute what stays shielded. Different model tiers commit to different mechanisms on this case. Measured over five runs of Claude (Sonnet 4.6), June 2026.",
    afterDist: [
      { label: "Fully exempt under 6409", value: 32 },
      { label: "Commingled and countable after six months", value: 30 },
      { label: "Trace via lowest intermediate balance", value: 38 },
    ],
    afterNote:
      "After three lenses, the model's tracing call keeps only 38 of 100. A statute with <em>notwithstanding any other provision of law</em> is not subordinate to the regulation operationalizing it, and the six-month closure has its own constituency. The flattest split in the dataset, and a 69 concealed it.",
  },
};
