---
id: "02"
title: "The gig worker hours"
policy_zone: "ABAWD / work requirements"
hr1_relevance: "central"
interpretation_question: "Does Marcus's self-attested hours log, combined with platform earnings records, satisfy ABAWD work verification?"

interpretations:
  - "Hours are verified"
  - "Hours are not verified"
  - "Pend with specific request"

phrase_keys:
  - key: "age"
    text: "Marcus (58)"
  - key: "hours"
    text: "22 hours per week across both platforms"
  - key: "docs"
    text: "neither provides him with a report of logged hours"
  - key: "notebook"
    text: "He estimates hours by adding up dash windows and shopping trips in a spiral notebook he keeps in his truck."
  - key: "hr1"
    text: "Under HR1 he is newly subject to ABAWD; the expansion to age 64 reached him in 2026."

readings:
  legal:
    persona: "Legal aid attorney"
    archetype: "The advocate"
    emphasis: "Pushes toward eligibility."
    call: "Hours are verified"
    weights:
      - { interpretation: "Hours are verified", value: 55 }
      - { interpretation: "Hours are not verified", value: 8 }
      - { interpretation: "Pend with specific request", value: 37 }
    grounded_in: ["docs", "notebook"]
  worker:
    persona: "Eligibility worker"
    archetype: "The careful processor"
    emphasis: "Verifies before deciding."
    call: "Hours are not verified"
    weights:
      - { interpretation: "Hours are verified", value: 12 }
      - { interpretation: "Hours are not verified", value: 53 }
      - { interpretation: "Pend with specific request", value: 35 }
    grounded_in: ["notebook", "hr1"]
  director:
    persona: "SNAP director"
    archetype: "The institution"
    emphasis: "Holds federal compliance, cross-worker consistency, audit posture."
    call: "Pend with specific request"
    weights:
      - { interpretation: "Hours are verified", value: 18 }
      - { interpretation: "Hours are not verified", value: 28 }
      - { interpretation: "Pend with specific request", value: 54 }
    grounded_in: ["docs", "hr1"]

calibration:
  baseline_single_answer: "Pend with specific request"
  baseline_confidence: 88
  baseline_note: "Asked up front, the model commits to the procedural middle path with conviction."
  target_distribution:
    - { interpretation: "Hours are verified", value: 28 }
    - { interpretation: "Hours are not verified", value: 30 }
    - { interpretation: "Pend with specific request", value: 42 }
  expected_targets:
    max_single_reading_confidence: 70
    min_named_readings: 3
    min_grounding_phrases_per_reading: 1
    min_factual_qa_gap_points: 20
---

# The gig worker hours

## Interpretation question

Does Marcus's self-attested hours log, combined with platform earnings records, satisfy ABAWD work verification?

## Case facts

Marcus (58) applies for SNAP in Georgia as a single-person household after losing his warehouse job in December 2025. He has been doing DoorDash and Instacart since January, his primary income now, and self-reports averaging 22 hours per week across both platforms.

His bank statements show $1,400 to $1,700 per month in platform payouts across the last three months. He has in-app earnings summaries from both platforms but neither provides him with a report of logged hours.

He estimates hours by adding up dash windows and shopping trips in a spiral notebook he keeps in his truck. No dependents, no disability determination, not in any of the codified exemption categories added by HR1.

Under HR1 he is newly subject to ABAWD; the expansion to age 64 reached him in 2026. Georgia does not hold a statewide ABAWD waiver, and the county he lives in is not on the narrowed high-unemployment list.

## Walkthrough

### Newly subject to ABAWD at 58

Pre-HR1, the ABAWD age band ended at 54. **Marcus would not have been subject to work requirements at all.** The post-HR1 expansion to 64 reaches him directly.

### 22 hours per week clears 80 per month

**The numbers work, if you believe them.** The question is no longer eligibility on the merits; it is whether the hours are documented to the state's satisfaction.

### Platforms do not produce hours reports by default

**A documentation gap by design, not by the claimant.** Earnings reports exist; hours reports require a specific request and take roughly 30 days.

### Spiral notebook hour log

**A good-faith estimate is not verification.** Or it is, depending on which precedent you cite. Informal labor verification accepts contemporaneous logs; ABAWD post-HR1 may not.

### Post-November 2025 QC counts these errors

Starting Nov 1, 2025, **incorrect determinations on the expanded ABAWD population count toward state QC error rates**, which under HR1 drive FY2028 state cost-sharing.

## Persona readings

### Legal aid attorney, "The advocate"

*Pushes toward eligibility.*

Lands on *hours are verified*, or failing that, on *pend with a specific, documented request*. Denying a gig worker for not having data the platform does not produce by default is a systemic failure the state imposed, not a compliance failure the claimant created.

Grounded in:

- **The documentation gap is the platform's design choice,** not Marcus's. He cannot surface what they do not produce.
- **Contemporaneous personal logs are accepted** for informal labor, domestic work, self-employment. ABAWD should not apply a stricter test.

Weights: Hours verified 55, Not verified 8, Pend 37.

### Eligibility worker, "The careful processor"

*Verifies before deciding.*

Pulled toward *not verified*. ABAWD determinations are among the most audited work-requirement categories. After November 2025, accepting the notebook is procedurally exposed. Pending the case is the safe move.

Grounded in:

- **A claimant-produced estimate is not verification** by the standard the manual applies to other earned-income documentation.
- **QC sampling on the expanded population now counts.** A wrong call costs the state under the new error-rate exposure.

Weights: Hours verified 12, Not verified 53, Pend 35.

### SNAP director, "The institution"

*Holds federal compliance, cross-worker consistency, audit posture.*

Most state manuals do not address platform gig work for ABAWD verification, because the chapters were written for pre-platform independent contractor work. *Cross-worker consistency* is the dominant concern. Director likely issues standing guidance to require platform-sourced activity reports, which compresses to pending in practice and which advocacy will call a soft denial.

Grounded in:

- **State guidance is silent on gig hour verification.** The director's call here becomes office precedent.
- **Cost-sharing exposure starts FY2028.** Permissive guidance now compounds across thousands of similar cases.

Weights: Hours verified 18, Not verified 28, Pend 54.

## Calibration

**Baseline.** Asked up front, the model commits to the procedural middle path (pend) with conviction, typically around 88%.

**Target after disaggregation.** Hours verified 28, Not verified 30, Pend 42. The model recognizes the procedural middle path *becomes* the substantive denial in practice when the claimant is in the ABAWD time-clock window. Confidence drops; framing sharpens.
