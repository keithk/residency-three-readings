import type { Scenario } from "../types";

export const scenario05: Scenario = {
  id: "05",
  title: "Pending SSDI, ABAWD clock running",
  zone: { full: "ABAWD / medical exemption", short: "ABAWD" },
  hr1: { relevance: "central", note: "Central. HR1 put James in the ABAWD cohort and made the medical exemption the only path that doesn't require work hours he physically can't produce" },
  locked: false,
  determination:
    "Does James's documentation, a primary care letter describing functional limits, an MRI, and prescription records, but no formal disability determination and no completed state form, satisfy the medical exemption at 7 CFR 273.24(c)(2)?",
  facts: [
    `James Holloway (58) lives alone in Charlotte, North Carolina and applies for SNAP recertification on May 7, 2026. He worked in residential roofing and framing for 32 years; his last employer let him go in August 2025 after he could no longer climb a ladder reliably.`,
    `<mark data-key="ssdi">He filed for SSDI on September 24, 2025; his attorney expects an ALJ hearing in late 2026.</mark> The Charlotte hearing office averaged about six months wait in late 2025; the national average is closer to eight and a half.`,
    `His medical record includes a <mark data-key="mri">January 2026 MRI showing L4 to L5 disc herniation with bilateral foraminal stenosis</mark>, prescriptions for gabapentin, tramadol, and methocarbamol, and a <mark data-key="letter">March 2026 letter from his primary care physician at a federally qualified health center stating, "Mr. Holloway suffers from chronic low back pain with radiculopathy and is currently unable to perform manual labor; he should avoid lifting more than 10 pounds and prolonged standing."</mark>`,
    `<mark data-key="prior-occupation">The letter describes limits in his prior occupation; it does not address whether James can perform any work.</mark> North Carolina, like Pennsylvania and New York, channels the medical exemption through a <mark data-key="form">state-issued medical statement form with specific functional questions including expected duration</mark>. He has not completed it.`,
    `James is in the post-HR1 expanded ABAWD cohort. <mark data-key="exhausted">He received SNAP in January, February, and March 2026 without meeting the 80-hour work requirement; his three countable months are exhausted.</mark> He has $48 in checking and no other resources.`,
  ],
  walkthrough: [
    {
      key: "exhausted",
      title: "The clock is already at zero",
      note: `Three countable months consumed. <strong>If the exemption isn't granted, the case closes at the next adverse-action notice cycle, and James cannot regain eligibility without 30 consecutive days of 80+ work hours.</strong> Which is the thing he physically cannot do.`,
      citation: "7 CFR 273.24",
    },
    {
      key: "letter",
      title: "What the regulation actually requires",
      note: `7 CFR 273.24(c)(2)(iii) accepts <em>"a statement from a physician, physician's assistant, nurse, nurse practitioner...or any other medical personnel the State agency determines appropriate."</em> No form, no magic words. <strong>James has a PCP letter that names the condition, prescribes the limits, and identifies the signing provider.</strong>`,
      citation: "7 CFR 273.24(c)(2)(iii)",
    },
    {
      key: "mri",
      title: "The corroborating record is qualitatively strong",
      note: `MRI findings, multiple controlled prescriptions, pain management consult. <strong>Far above the regulatory minimum.</strong> Whatever evidentiary bar exists, this case clears it on substance.`,
    },
    {
      key: "prior-occupation",
      title: "The letter speaks to one job, not all work",
      note: `The PCP wrote what a treating physician writes: <em>can no longer do manual labor</em>. The regulation reads <em>unfit for employment</em>, which workers train to read against <strong>any work</strong>, not just prior occupation. The letter's silence on transferable work is the seam.`,
    },
    {
      key: "form",
      title: "The state operationalizes through a form",
      note: `NC FNS Manual §260 accepts self-attestation as the default for ABAWD exemptions, and PCP letters meet the regulatory text. But the state's medical statement form asks the specific questions (lift, stand, expected duration), and <strong>a sampled case without the form is the kind of file QC reviewers flag.</strong>`,
      citation: "NC FNS Manual §260",
    },
    {
      key: "ssdi",
      title: "The other path is too slow",
      note: `(c)(2)(i) recognizes anyone <em>receiving</em> temporary or permanent disability benefits. <strong>James filed in September; the Charlotte hearing office is six months out at the soonest, the national average closer to eight and a half.</strong> At least one and likely two SNAP cycles in coverage gap, waiting for the determination that would automatically restore the exemption.`,
    },
  ],
  personas: {
    legal: {
      label: "Legal aid attorney",
      name: "The advocate",
      emphasis: "Pushes toward eligibility.",
      reading: `Lands on <em>sufficient on its face</em>. 273.24(c)(2)(iii) sets a deliberately low evidentiary bar, listing a broad set of providers and requiring no particular form. NC FNS Manual §260 affirmatively accepts self-attestation; a treating physician's letter is qualitatively stronger than self-attestation. The SNAP medical exemption was written more permissively than the SSA disability standard for a reason: this is a food program, not a disability program. Requiring a state form on top of regulation-compliant evidence is adding a rule the federal regulation doesn't impose.`,
      call: "PCP letter is sufficient under (c)(2)(iii)",
      pulls: [
        {
          key: "letter",
          text: `<strong>The letter satisfies the text.</strong> The regulation lists physicians, NPs, social workers, "any other medical personnel the State agency determines appropriate." A PCP letter at an FQHC isn't a marginal case. It's the central case.`,
        },
        {
          key: "mri",
          text: `<strong>The corroborating record is overwhelming.</strong> MRI, prescriptions, pain management consult. Whatever evidentiary bar exists, this is well past it. Stacking process on top is friction in service of nothing.`,
        },
        {
          key: "ssdi",
          text: `<strong>The (c)(2)(i) path is too slow to mean anything.</strong> Six to eight months of coverage gap while waiting for an ALJ decision is closure in everything but name. The (c)(2)(iii) path exists for exactly this case.`,
        },
      ],
      weights: [
        { label: "PCP letter is sufficient under (c)(2)(iii)", value: 76 },
        { label: "Pend for the state medical statement form", value: 11 },
        { label: "Use the discretionary 15% exemption", value: 13 },
      ],
    },
    worker: {
      label: "Eligibility worker",
      name: "The careful processor",
      emphasis: "Verifies before deciding.",
      reading: `Lands on <em>complete the state form</em>. Granting a medical exemption is one of the highest-scrutiny determinations in the system; it pauses the ABAWD clock indefinitely and is reviewed in detail when sampled. The state form exists precisely to capture the questions the regulation contemplates: functional capacity, expected duration, signing provider's credentials. A letter describing limits in prior occupation, without addressing other work, creates ambiguity the worker cannot resolve unilaterally. Pend ten days, send the form, and tell James clearly that on return the exemption attaches.`,
      call: "Pend for the state medical statement form",
      pulls: [
        {
          key: "form",
          text: `<strong>The form is the operational instrument.</strong> Verification authority at 273.2(f)(1)(i) lets the worker require what's reasonably necessary. The form is reasonably necessary; it's what QC reviewers look for in a sampled case.`,
        },
        {
          key: "prior-occupation",
          text: `<strong>The letter speaks to one job, not all work.</strong> "Unfit for employment" reads against any work, and the letter is silent there. The form asks; the letter doesn't.`,
        },
        {
          key: "exhausted",
          text: `<strong>The stakes argue for procedural care, not against it.</strong> An incorrectly granted exemption is a QC error at full dollar value; an incorrectly denied one is a fair-hearing reversal. Both matter, but only one counts toward the state error rate.`,
        },
      ],
      weights: [
        { label: "PCP letter is sufficient under (c)(2)(iii)", value: 16 },
        { label: "Pend for the state medical statement form", value: 60 },
        { label: "Use the discretionary 15% exemption", value: 24 },
      ],
    },
    director: {
      label: "SNAP director",
      name: "The institution",
      emphasis: "Holds federal compliance, cross-worker consistency, audit posture.",
      reading: `Sits with a <em>precedent problem</em>. North Carolina has tens of thousands in the 55-to-64 cohort newly subject to ABAWD; medical-exemption volume is up sharply. Treating one-paragraph letters as sufficient brings exemption rates up and FNS Management Evaluations down on the state. Requiring the form rigidly produces fair-hearing losses and likely advocacy litigation. The institutional move is to require the form, but with a clear case-aide protocol: FQHC referrals, secure portal submission, equivalent documents accepted, good-cause extensions granted liberally. NC's FY2024 payment error rate of 10.21% places the state in the maximum 15% cost-share tier; the protocol has to thread the needle.`,
      call: "Pend for the state medical statement form",
      pulls: [
        {
          key: "form",
          text: `<strong>The form sets the precedent for thousands of cases.</strong> The director isn't deciding for James; she's deciding for the cohort. Sustainability of either posture is the real test.`,
        },
        {
          key: "letter",
          text: `<strong>A case-aide protocol can route around the cliff.</strong> Workers refer to FQHC providers, accept equivalent documents, grant extensions. The form becomes a coordination mechanism, not a gate.`,
        },
        {
          key: "exhausted",
          text: `<strong>A fair-hearing reversal favoring the household doesn't count toward QC.</strong> A wrongful grant in a sampled case does. That asymmetry, more than any reg, sets the agency's default posture.`,
        },
      ],
      weights: [
        { label: "PCP letter is sufficient under (c)(2)(iii)", value: 19 },
        { label: "Pend for the state medical statement form", value: 47 },
        { label: "Use the discretionary 15% exemption", value: 34 },
      ],
    },
  },
  interpretations: [
    { label: "PCP letter is sufficient under (c)(2)(iii)", gloss: "Sufficient on its face under 7 CFR 273.24(c)(2)(iii); the regulation's bar is below what the form asks for." },
    { label: "Pend for the state medical statement form", gloss: "Pend ten days for completion of the NC medical statement form's functional questions." },
    { label: "Use the discretionary 15% exemption", gloss: "Apply 7 CFR 273.24(g) discretionary exemption while SSDI is pending." },
  ],
  confidence: {
    baselineLabel: "Pend for the state medical statement form",
    beforeHeadline: "<em>Pend</em> for the state form",
    beforeStat: "71",
    beforeStatSuffix: "% confident",
    beforeNote:
      "Asked up front, the model commits to the procedural middle: the form exists, the letter doesn't answer its questions, ten days won't hurt. Measured over five runs of Claude (Sonnet 4.6), June 2026.",
    afterDist: [
      { label: "PCP letter is sufficient under (c)(2)(iii)", value: 34 },
      { label: "Pend for the state medical statement form", value: 38 },
      { label: "Use the discretionary 15% exemption", value: 28 },
    ],
    afterNote:
      "After three lenses, the model recognizes that <em>ten days won't hurt</em> is wrong when the clock is already at zero, that the regulation's bar is below what the form asks for, and that the discretionary 15% has been sitting on the shelf the whole time.",
  },
};
