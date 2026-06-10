import type { Scenario } from "../types";

export const scenario03: Scenario = {
  id: "03",
  title: "Mom sends me money",
  zone: { full: "Earned vs. unearned income", short: "Income" },
  hr1: { relevance: "indirect", note: "Indirect, but the new QC tolerance sharpens every dollar at sample" },
  locked: false,
  determination:
    "Does the recurring $400 monthly transfer from Tasha's mother count as unearned income, an excluded loan, or an excluded vendor payment?",
  facts: [
    `Tasha Williams (27) lives alone in a West Philadelphia studio and applies for SNAP on May 4, 2026, after being laid off from a logistics contractor in late March. She now works 18 to 22 hours a week at a coffee shop in Center City, grossing about $890/month, with occasional DoorDash shifts adding $140. Rent on her studio is $1,050; the lease is in her name.`,
    `Since June 2024, her mother in Harrisburg, who draws Social Security and is neither on Tasha's lease nor in her SNAP household, has <mark data-key="venmo">sent her $400 on the first of every month via Venmo</mark>. <mark data-key="memo">The memo line reads variously "rent," "help," "love u," or is blank.</mark> <mark data-key="commingled">The transfers land in Tasha's personal PNC checking account, alongside her paychecks.</mark>`,
    `<mark data-key="no-note">There is no promissory note and no written repayment expectation.</mark> Tasha tells the worker, "She just helps me out, I'll pay her back someday if I can." <mark data-key="mom-says">Her mother, reached for verification, says, "I don't expect anything back. She's my daughter."</mark>`,
    `Tasha has no children, is not pregnant, is not an enrolled tribal member, and has no documented disability. <mark data-key="abawd">She is in the post-HR1 expanded ABAWD cohort and is currently clearing the 80-hour work requirement at the coffee shop alone, with no margin.</mark>`,
  ],
  walkthrough: [
    {
      key: "venmo",
      title: "$400, regular, anticipated",
      note: `Monthly, same date, same source, twenty-three months and counting. That's the textbook profile for <strong>countable unearned income under the 273.9(b)(2) catch-all</strong>, before any exclusion is considered.`,
      citation: "7 CFR 273.9(b)(2)(vii)",
    },
    {
      key: "memo",
      title: "The memo line is inconsistent",
      note: `Some months read "rent," some read "help," some are blank. <strong>A partial paper trail that supports the vendor-payment theory in some months and undermines it in others.</strong>`,
    },
    {
      key: "commingled",
      title: "Funds land in a personal account",
      note: `Vendor-payment treatment under 273.9(c)(1) requires funds paid to the household's creditor. <strong>Money in Tasha's account, even if intended for rent, doesn't meet the delivery test.</strong>`,
      citation: "7 CFR 273.9(c)(1)",
    },
    {
      key: "no-note",
      title: "No written loan instrument",
      note: `273.9(c)(4) excludes "all loans, including loans from private individuals," with no text requiring a written note. But Pennsylvania's §550.57 lets the CAO <strong>require an affidavit on recurring transfers</strong>, and that authority is what gets invoked here.`,
      citation: "7 CFR 273.9(c)(4); PA §550.57",
    },
    {
      key: "mom-says",
      title: "The phone call is dispositive, or it isn't",
      note: `Mom: <em>"I don't expect anything back."</em> A worker hears that and the loan theory is over. A legal aid attorney hears that and reframes it as <strong>willingness to forgive a debt, not an announcement that no debt exists.</strong> The case turns on which read controls.`,
    },
    {
      key: "abawd",
      title: "Pending is not free",
      note: `Tasha is in the expanded ABAWD cohort and clearing the 80-hour requirement with no buffer. <strong>Every month the application sits pending burns a countable month against the three-month clock.</strong> Procedural safety has a substantive cost.`,
      citation: "7 CFR 273.24",
    },
  ],
  personas: {
    legal: {
      label: "Legal aid attorney",
      name: "The advocate",
      emphasis: "Pushes toward eligibility.",
      reading: `Lands on the <em>loan exclusion</em>. The text of 273.9(c)(4) is broad and contains no documentary requirement. The Pennsylvania manual's affidavit provision is permissive ("may require"), not a precondition. Mom's statement reads in context as willingness to forgive a debt, not as a declaration that no debt ever existed. Failing that, the funds function as a vendor payment in substance even if not in form. Ambiguity resolves toward eligibility.`,
      call: "Excluded as a loan or vendor payment",
      pulls: [
        {
          key: "no-note",
          text: `<strong>The loan exclusion is text.</strong> "All loans, including loans from private individuals" doesn't carve out unwritten ones. Adding a writing requirement adds a rule the regulation declined to add.`,
        },
        {
          key: "memo",
          text: `<strong>"Rent" appears repeatedly in the memo line.</strong> Substance over delivery mechanism: the funds are routed to a household expense, the way most informal in-kind support is.`,
        },
        {
          key: "mom-says",
          text: `<strong>Forgiveness, not absence of debt.</strong> Mothers don't write notes to their daughters. The phone call is a parent saying she won't press for repayment, not a declaration of gift.`,
        },
      ],
      weights: [
        { label: "Countable as unearned income", value: 11 },
        { label: "Excluded as a loan or vendor payment", value: 71 },
        { label: "Pend and verify", value: 18 },
      ],
    },
    worker: {
      label: "Eligibility worker",
      name: "The careful processor",
      emphasis: "Verifies before deciding.",
      reading: `Lands on <em>countable</em>. The mother's statement on the phone is the operative fact: under PA's bona-fide-loan framework, no repayment obligation means no loan. It is also not a vendor payment under §550.56 because funds didn't go to a creditor. The default posture under QC-asymmetric pressure is countable unless verification flips it. If Tasha submits a signed loan statement within ten days, exclude; if not, count and deny.`,
      call: "Countable as unearned income",
      pulls: [
        {
          key: "mom-says",
          text: `<strong>"I don't expect anything back" defeats the loan theory.</strong> PA §550.57 specifically contemplates this kind of recurring transfer, and the affidavit option exists precisely for cases like this. Mom didn't sign it.`,
        },
        {
          key: "commingled",
          text: `<strong>Not a vendor payment.</strong> §550.56 is explicit: vendor treatment is available only when funds go directly to the creditor. Personal account routing doesn't qualify, regardless of memo line intent.`,
        },
        {
          key: "venmo",
          text: `<strong>Twenty-three months of regular, anticipated transfers</strong> is the exact pattern the catch-all at 273.9(b)(2)(vii) was written to capture. Absent a recognized exclusion, it counts.`,
        },
      ],
      weights: [
        { label: "Countable as unearned income", value: 60 },
        { label: "Excluded as a loan or vendor payment", value: 8 },
        { label: "Pend and verify", value: 32 },
      ],
    },
    director: {
      label: "SNAP director",
      name: "The institution",
      emphasis: "Holds federal compliance, cross-worker consistency, audit posture.",
      reading: `Sits on a <em>precedent gap</em>. The state has no formal guidance on peer-to-peer cash apps. §550.3 and §550.57 predate Venmo by two decades, and one worker excluding on the household's word while another counts is the worst possible posture for cross-worker consistency. Pennsylvania's 10.76% FY2024 payment error rate already places the state in the maximum benefit cost-share tier under OBBBA §10105. An Operations Memorandum is coming, almost certainly toward counting recurring P2P transfers absent contemporaneous written loan documentation.`,
      call: "Countable as unearned income",
      pulls: [
        {
          key: "venmo",
          text: `<strong>The state hasn't written this guidance.</strong> Cross-worker consistency is the central audit risk: one worker excludes, another counts, QC samples both. An Operations Memorandum standardizes the call.`,
        },
        {
          key: "abawd",
          text: `<strong>Cascading cost on the ABAWD side.</strong> A pending case with the clock running compounds across thousands of similar households in the cohort. The director chooses for a population, not for Tasha.`,
        },
        {
          key: "no-note",
          text: `<strong>The training will require written documentation going forward.</strong> A fair-hearing reversal favoring the household doesn't count toward the state error rate. A QC finding against the state does. The asymmetry sets the policy.`,
        },
      ],
      weights: [
        { label: "Countable as unearned income", value: 48 },
        { label: "Excluded as a loan or vendor payment", value: 14 },
        { label: "Pend and verify", value: 38 },
      ],
    },
  },
  interpretations: [
    { label: "Countable as unearned income", gloss: "Under the 273.9(b)(2) catch-all for regular, anticipated transfers." },
    { label: "Excluded as a loan or vendor payment", gloss: "Private loan or vendor payment in substance, regardless of form." },
    { label: "Pend and verify", gloss: "Require a signed statement from the mother before deciding." },
  ],
  confidence: {
    baselineLabel: "Countable as unearned income",
    beforeHeadline: "<em>Countable</em> as unearned income",
    beforeStat: "78",
    beforeStatSuffix: "% confident",
    beforeNote:
      "Asked up front, the model treats Mom's phone statement as dispositive: no repayment expectation, no loan, count it. Measured over five runs of Claude (Sonnet 4.6), June 2026.",
    afterDist: [
      { label: "Countable as unearned income", value: 40 },
      { label: "Excluded as a loan or vendor payment", value: 28 },
      { label: "Pend and verify", value: 32 },
    ],
    afterNote:
      "After three lenses, the model recognizes the mother's statement as <em>willingness to forgive, not absence of debt</em>, which the up-front read collapsed. The confidence drops; the framing sharpens; pend stops looking neutral once ABAWD is in the picture.",
  },
};
