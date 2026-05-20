# Three Readings, a web artifact

A Propel research artifact. The dataset captures SNAP scenarios where three personas (a legal aid attorney, an eligibility worker, and a SNAP director) read the same case three different ways. The point: confidence scores collapse contested interpretation into a single number, and when the stakes are whether someone eats next month, "95% sure" should mean something.

## Register

Brand. Design IS the deliverable. This is a portfolio piece, blog companion, and an entry point for researchers / policy folks / benefits-tech people looking at calibration on ambiguous determinations.

## Users

- AI calibration researchers, primarily reading to assess methodology.
- Benefits-tech and gov-tech audiences, primarily reading for the SNAP framing.
- Policy and legal aid audiences, primarily reading for the personas.
- Internal Propel and partners, reading because Propel shipped it.

## Brand & tone

Editorial seriousness. Civic weight. The case files matter; the personas have lived experience. Avoid: AI marketing tone, dashboard chrome, civic-tech beige cheerfulness, hero-stat templates.

The artifact reads like a long-form treatise that happens to be interactive. The interactivity earns its place by letting you watch the disagreement emerge, not by being clever for its own sake.

## Anti-references

- SaaS dashboards.
- AI demo sites with neon-on-black + glow.
- Government-tech "navy and gold" defaults.
- Three-column comparison cards (the obvious shape for "three personas"; explicitly refused everywhere except the calibration reveal, where side-by-side IS the argument).
- Cream + serif editorial that reads as "Anthropic / NYT pastiche".
- Hero-metric template (big number, small label, gradient accent).

## Reference anchors

- **Edward Tufte's small books** (sparse chrome, document-density, "the page is the layer").
- **The Marshall Project's long-form pieces** (civic weight on benefits and justice topics; serious tone without becoming an institutional brochure).
- **Pudding-style essays at their most restrained** (interactivity in service of the argument, not as a demo).

The artifact should sit somewhere in the triangle these three pieces form. If it tips toward magazine, it has drifted; toward demo, it has drifted; toward dashboard, it has drifted.

## Strategic principles

- Document-first. The case file is the substrate. Personas annotate it.
- The disagreement is the point. Don't resolve it. Show it.
- The reveal at the end is calibration: confidence drops when ambiguity is surfaced, and that's correct behavior.
- Type does most of the design work.

## Accessibility & Inclusion

Target: **WCAG 2.2 AA** across the artifact. The reading audience skews toward researchers, lawyers, and policy professionals; assume a higher-than-average rate of older readers and readers with visual impairment.

### Color is never the sole signal

Persona identity is always carried by at least three concurrent signals: the mono persona label (uppercase text), the serif persona name with italic em, and the step indicator label. Persona color (`--legal` / `--worker` / `--director`) reinforces but never replaces these. A reader with deuteranopia, protanopia, or tritanopia can still distinguish the three lenses through label and name alone.

### Reduced motion

Respect `prefers-reduced-motion: reduce`. When set:
- Disable the case-file mark `highlightPulse` halo.
- Collapse mark background and color transitions to near-zero (≤80ms).
- Skip `scrollIntoView({ behavior: "smooth" })` for off-screen marks; jump instantly.
- Disable button arrow translation on hover.

The artifact's motion is decorative, not informational; reduced-motion users lose nothing.

### Reading ergonomics

Working-against-fatigue choices are load-bearing here, not optional:
- Body lines capped at 70ch (lede at 56ch, narrow-column body at 32ch).
- Body type at 1.0625rem with 1.65 line-height; comfortable for long reading and for readers with mild dyslexia.
- Warm paper ground (`oklch(0.972 0.008 75)`, hue 75) instead of pure white, reducing visual fatigue under bright light.
- Body text contrast: `--ink` on `--paper` exceeds WCAG AAA at ~16:1.
- `hyphens: auto` on case-file body to avoid awkward line ragging at narrow viewports.

### Keyboard and assistive navigation

- All interactive elements are semantic `<button>` or `<a>` elements; no `<div onclick>`.
- Scenario walkthrough is operable via arrow keys (←/→) and Escape; mouse and keyboard reach parity.
- Focus must be visible (default browser ring or a deliberate equivalent). Never `outline: none` without a visible replacement.
- Screen reader names: the persona panel weight table should expose its rows as a labeled list or table; case-file marks should announce `mark` semantics without the data-attributes leaking as text.
- Page titles update per scenario (`01. The ex-roommate on the lease, Three Readings`) so SR users orienting by title can navigate.

### Content sensitivity

The case files concern real-shape situations of people seeking benefits. Synthetic data, but the framing should never punch down. Persona perspectives are presented as legitimate; no caricature, no "the bureaucrat as villain" framing. Tone is editorial-serious, not clever-at-the-expense-of-the-subjects.
