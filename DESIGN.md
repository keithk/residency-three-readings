---
name: The Disagreement Dataset
description: Ten SNAP scenarios where three personas read the same case three different ways.
colors:
  paper: "oklch(0.972 0.008 75)"
  paper-2: "oklch(0.946 0.012 75)"
  paper-3: "oklch(0.915 0.018 75)"
  paper-deep: "oklch(0.881 0.024 75)"
  ink: "oklch(0.20 0.012 85)"
  ink-soft: "oklch(0.42 0.012 85)"
  ink-faint: "oklch(0.60 0.012 85)"
  ink-ghost: "oklch(0.78 0.010 75)"
  rule: "oklch(0.84 0.014 75)"
  hairline: "oklch(0.90 0.012 75)"
  stamp: "oklch(0.50 0.135 28)"
  stamp-soft: "oklch(0.72 0.085 28)"
  stamp-fade: "oklch(0.92 0.04 28)"
  legal: "oklch(0.46 0.085 158)"
  legal-soft: "oklch(0.92 0.035 158)"
  legal-ink: "oklch(0.34 0.07 158)"
  worker: "oklch(0.43 0.045 248)"
  worker-soft: "oklch(0.92 0.020 248)"
  worker-ink: "oklch(0.32 0.04 248)"
  director: "oklch(0.52 0.085 78)"
  director-soft: "oklch(0.93 0.04 78)"
  director-ink: "oklch(0.38 0.075 78)"
typography:
  display-xl:
    fontFamily: "Source Serif 4, Source Serif Pro, Georgia, serif"
    fontSize: "clamp(4rem, 11vw, 9rem)"
    fontWeight: 380
    lineHeight: 0.92
    letterSpacing: "-0.04em"
    fontVariation: "opsz 60"
  display-l:
    fontFamily: "Source Serif 4, Source Serif Pro, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.025em"
    fontVariation: "opsz 36"
  lede:
    fontFamily: "Source Serif 4, Source Serif Pro, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)"
    fontWeight: 380
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Source Serif 4, Source Serif Pro, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 380
    lineHeight: 1.65
    letterSpacing: "-0.005em"
  caption:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
  micro:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 550
    lineHeight: 1.35
    letterSpacing: "0.1em"
  meta:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: "0.05em"
rounded:
  none: "0"
  hair: "2px"
spacing:
  pad-y: "clamp(2rem, 4vw, 4rem)"
  pad-x: "clamp(1.25rem, 4vw, 3rem)"
  col-rail: "200px"
  col-body: "minmax(0, 70ch)"
  col-margin: "280px"
  col-gap: "72px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.micro}"
    rounded: "{rounded.hair}"
    padding: "1rem 1.625rem"
  button-primary-hover:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.micro}"
    rounded: "{rounded.hair}"
    padding: "1rem 1.625rem"
  chip-policy:
    backgroundColor: "{colors.paper-3}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.meta}"
    rounded: "{rounded.hair}"
    padding: "0.25rem 0.5rem"
  callout-interpretation:
    backgroundColor: "{colors.stamp-fade}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
  case-file:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
---

# Design System: The Disagreement Dataset

## 1. Overview

**Creative North Star: "The Case File."**

The artifact is a long-form treatise that happens to be interactive. The case file is the substrate; everything else, walkthrough phrases, persona panels, the calibration reveal, is annotation laid against it. The reader's primary act is reading. Their secondary act is watching three readings of the same document diverge in front of them. The interface earns its place by letting the disagreement emerge, not by being clever for its own sake.

The system commits to one register hard: warm-paper editorial. Source Serif 4 carries body, display, and italic emphasis; JetBrains Mono carries metadata, indicators, and the small civic-record voice that marks chips, rails, and case-file headers. There is no sans-serif at all. The page does not have a "UI layer" that sits on top of the content; the content IS the layer, and chrome is reduced to hairline rules, mono labels, and a single signature red used for emphasis and interpretation questions.

The system explicitly rejects: SaaS dashboard chrome; AI demo aesthetics (neon, glow, glassmorphism); civic-tech beige cheerfulness; navy-and-gold government defaults; cream-plus-serif "Anthropic / NYT pastiche"; three-column persona comparison cards (the obvious shape, refused); the hero-metric template; gradient text.

**Key Characteristics:**
- Document register, not product register. Design IS the deliverable.
- Type does most of the design work. Hierarchy from scale + weight + italic, almost never from boxes.
- Warm paper ground (`paper`, tinted toward hue 75), not pure white.
- Document-grid layout: left rail (chips, ornaments), center column (~70ch body), right margin (annotations). Collapses to single column under 1180px.
- One accent red (`stamp`, hue 28) used sparingly. Three persona hues (green / blue / gold) used contextually.
- No card grids. Hairline rules and whitespace separate sections.

## 2. Colors

A tinted-neutral system on a warm paper ground. Hue 75 (warm cream) anchors every neutral. One signature red anchors interpretation moments. Three persona hues (oxidized green, graphite blue, dust gold) carry the disagreement mechanic and never appear outside a persona context.

### Primary
- **Stamp Red** (`oklch(0.50 0.135 28)`, `--stamp`): the signature red. Italic display emphasis (the word "Disagreement" in the hero, "expert" in the thesis, "three-way split" in the reveal). Stamps interpretation-question callouts. Marks HR1 / Big Beautiful Bill chips in the scenario rail. Primary CTA hover state. The red is *muted and oxidized*, not pure red; closer to a stamped ink mark than to a button accent.
- **Stamp Soft** (`oklch(0.72 0.085 28)`, `--stamp-soft`): faded variant for de-emphasized red states.
- **Stamp Fade** (`oklch(0.92 0.04 28)`, `--stamp-fade`): background for the interpretation-question callout, and the page selection background.

### Tertiary: Persona Triad
The three personas each carry a hue family with three steps: solid (used on weight-bar fills and active button tones), soft (used on highlighted marks in the case file and persona panel backgrounds), and ink (used on persona labels, persona-cue strong text, and italic em in the persona name).

- **Legal Oxidized Green** (`oklch(0.46 0.085 158)`, `--legal` / `legal-soft` / `legal-ink`): the legal aid attorney. *Pushes toward eligibility.*
- **Worker Graphite Blue** (`oklch(0.43 0.045 248)`, `--worker` / `worker-soft` / `worker-ink`): the eligibility worker. *Verifies before deciding.*
- **Director Dust Gold** (`oklch(0.52 0.085 78)`, `--director` / `director-soft` / `director-ink`): the SNAP director. *What does guidance say today.*

Persona colors are never decorative. If a persona hue shows up, it means: "this element belongs to that persona's reading."

### Neutral: Warm Paper Stack
The neutrals are a tinted stack at hue 75, both for surfaces and for ink. There is no pure white and no pure black anywhere in the system.

- **Paper** (`oklch(0.972 0.008 75)`, `--paper`): the primary surface. The page ground.
- **Paper 2** (`oklch(0.946 0.012 75)`, `--paper-2`): alternate surface for inset panels (model-alone panel in the reveal).
- **Paper 3** (`oklch(0.915 0.018 75)`, `--paper-3`): slightly warmer; chip backgrounds.
- **Paper Deep** (`oklch(0.881 0.024 75)`, `--paper-deep`): the warm-highlight tint applied to a generic walkthrough mark before persona context kicks in.
- **Ink** (`oklch(0.20 0.012 85)`, `--ink`): primary text and the default CTA fill.
- **Ink Soft** (`oklch(0.42 0.012 85)`, `--ink-soft`): secondary text, lede, body in persona-card / persona-panel contexts.
- **Ink Faint** (`oklch(0.60 0.012 85)`, `--ink-faint`): tertiary text, metadata labels, micro-fraction indicators.
- **Ink Ghost** (`oklch(0.78 0.010 75)`, `--ink-ghost`): the lightest mono ornament tier (the hero's "01" decoration, scenario-rail ornaments).
- **Rule** (`oklch(0.84 0.014 75)`, `--rule`): section dividers, ghost-button borders, primary structural hairlines.
- **Hairline** (`oklch(0.90 0.012 75)`, `--hairline`): the subtler divider; case-file top/bottom borders, persona-column anchor rules.

### Atmospheric Ground
The page body carries two fixed radial gradients (defined in `base.css`): warm cream in the top-right at hue 75, warm taupe in the bottom-left at hue 75. These are atmospheric, never functional. They are intentionally subtle (transparent past ~60%) and should never carry information.

### Named Rules

**The Single Red Rule.** There is exactly one accent color in this system, and it is `stamp`. Persona colors are not accents; they are taxonomic markers for "whose reading is this." Do not introduce a second accent for "alerts" or "warnings" or "success states." This artifact has no such states.

**The Tinted Neutral Rule.** No neutral may have chroma 0. Every paper and ink value carries chroma 0.008–0.024 at hue 75–85. Pure-grey `#fff` / `#000` / `oklch(* 0 *)` is forbidden; it reads cold and breaks the warm-paper ground.

**The Persona Color Means Persona Rule.** If you use `--legal`, `--worker`, or `--director` (in any variant), the element must belong to that persona's reading. Never use persona colors as a decorative palette.

## 3. Typography

**Display Font:** Source Serif 4 (with Source Serif Pro, Georgia, serif fallback). Variable axis: opsz 8..60, weight 300..900, italic.
**Body Font:** Source Serif 4 (same family: display and body share the typeface; the optical-size axis does the differentiation).
**Label / Mono Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo fallback). Weights 400–600.

**Character:** Source Serif 4 is doing the heavy lift. Its optical-size axis lets the same family carry a 9rem display and a 1rem body without feeling inconsistent: at opsz 60 the letterforms thin and tighten for headlines; at opsz auto they thicken and open for legibility. The italic includes real swash forms (the lowercase "g" and "f" especially); the design uses italics deliberately on persona names, marquee emphasis words, and reveal punchlines.

JetBrains Mono carries everything that is not body prose: chips, micro labels, step indicators, persona labels, case-file section headers, button text. It is the *civic-record voice*, the metadata that surrounds the document.

There is no sans-serif anywhere. Resist the reflex to introduce one.

### Hierarchy
- **Display XL** (weight 380, `clamp(4rem, 11vw, 9rem)`, line-height 0.92, letter-spacing -0.04em, opsz 60): hero title only. The "Disagreement" word is italic at weight 320 in `--stamp` red.
- **Display L** (weight 400, `clamp(2rem, 5vw, 3.75rem)`, line-height 1.04, letter-spacing -0.025em, opsz 36): scenario page titles, calibration-reveal punchline.
- **Lede** (weight 380, `clamp(1.125rem, 1.6vw, 1.375rem)`, line-height 1.5, letter-spacing -0.005em): hero subhead, reveal body, persona reading frame. Capped at 56ch.
- **Body** (weight 380, 1.0625rem, line-height 1.65, letter-spacing -0.005em): case-file text, thesis prose, persona-panel body. Capped at 70ch.
- **Caption** (mono, 0.8125rem, line-height 1.45, letter-spacing 0.01em): case-file section sub-labels, secondary mono text.
- **Micro** (mono, 0.75rem, weight 550, line-height 1.35, letter-spacing 0.1em, uppercase): section headers ("CASE FACTS", "THE THREE LENSES", "THE CALIBRATION REVEAL"). Always uppercase.
- **Meta** (mono, 0.75rem, weight 500, line-height 1.0, letter-spacing 0.05em): masthead bylines, step indicators, page-corner ornaments.

### Named Rules

**The Two-Family Rule.** Two type families and no third. Source Serif 4 carries everything readable; JetBrains Mono carries everything that frames the reading. No sans-serif. Adding one breaks the document register.

**The Italic-Is-Meaningful Rule.** Italic Source Serif is a semantic mark, not a decorative flourish. Use it for: persona name italic em (the "advocate" / "careful processor" / "institution" words), the hero's "Disagreement" word, calibration-reveal emphasis ("three-way split"), occasional thesis emphasis ("expert"). The italic em often carries an accent color (stamp red in the hero, persona color in the persona names). Do not italicize for typographic variety.

**The 70-character Rule.** Body line length never exceeds 70ch. The lede is capped at 56ch. Persona-panel bodies (which sit in narrower columns) cap at 32ch. Lines longer than 70ch are an immediate edit signal.

## 4. Elevation

**The system is flat.** There are no `box-shadow` declarations on cards, panels, dialogs, or buttons. Depth, where it exists, is conveyed through tonal layering on warm-paper tints (`paper` / `paper-2` / `paper-3` / `paper-deep`) and through hairline rules (`hairline` / `rule`). The visual page is a single sheet with sections divided by thin lines, not a stack of floating surfaces.

There is one exception: a transient `box-shadow` pulse on case-file marks at the moment they become active. It rises from 0 to a 6px halo in `currentColor` at 15% alpha and then collapses to 0 over 1400ms (ease-out-expo). This is not elevation; it is attention. The shadow exists for ~1.4 seconds and never persists.

### Named Rules

**The Flat Document Rule.** The page is a document, not a UI. Surfaces are flat at rest. If you find yourself reaching for `box-shadow` to separate a container from its background, you should be reaching for `border-top: 1px solid var(--hairline)` instead. Whitespace and rules separate; shadows lift, and nothing in this artifact should feel lifted.

**The Pulse-Is-Attention Rule.** A transient halo on a mark is acceptable. A persistent halo is forbidden. Animations of this kind end with the element returning to flat.

## 5. Components

### Buttons
- **Shape:** Sharp, near-rectangular (`border-radius: 2px`). Never pill-shaped, never circular.
- **Primary** (`button-primary`): solid `--ink` background, `--paper` text, 1rem 1.625rem padding, mono micro typography (`0.8125rem`, weight 500, letter-spacing 0.08em, uppercase). A right-arrow glyph follows the label and translates 3px on hover. Used for "BEGIN WALKTHROUGH", "NEXT PHRASE", "NEXT PERSONA", "END OF SCENARIO".
- **Primary tonal variants:** the same primary button takes a `data-tone="legal|worker|director"` attribute, which swaps the background to the persona's `--legal` / `--worker` / `--director`. Used when the next step transitions into a persona panel: the button color previews who's about to speak.
- **Primary hover:** background swaps from `--ink` to `--stamp`; the right-arrow translates 3px. The "next" action ALWAYS goes red on hover.
- **Ghost** (`button-ghost`): transparent background, `--ink-soft` text, 1px `--rule` border. Used for "← Previous". On hover: border darkens to `--ink-soft`, text darkens to `--ink`, left-arrow translates -3px.

### Chips
Chips appear in three places: the scenario list (policy zone + persona-relevance markers), the scenario rail (the active scenario's policy zone), and the masthead (issue ornament). All are mono, uppercase, with thin borders or tinted backgrounds.

- **Policy Zone Chip:** `paper-3` background, `ink-soft` text, mono meta typography, 0.25rem 0.5rem padding, 2px radius.
- **Persona Relevance Chip (on scenario list):** `paper-3` background, persona-ink text color, persona-soft border. Indicates which lenses each scenario most activates.
- **HR1 Chip:** `stamp` text color, no background fill. The HR1 / Big Beautiful Bill mark in the scenario rail uses this; it is the only persistent appearance of stamp red as text.

### Case File
The signature component of the artifact. Editorial body text with embedded `<mark>` elements that respond to step state.

- **Container:** flat. Top and bottom borders are `1px solid var(--hairline)`. Above the body: a two-column micro header (mono micro caps): "CASE FACTS" on the left, an italicized sub-caption on the right ("Synthetic, grounded in real manual ambiguity"). No background fill. No card chrome.
- **Body:** Source Serif 4, 1.0625rem, line-height 1.65, weight 380, hyphens auto. Paragraphs separated by 1.25rem bottom margin.
- **Mark states** (load-bearing data attributes; the highlight logic in `CaseFile.vue` toggles these):
  - `mark` default: invisible. Transparent background, inherits ink color.
  - `mark[data-highlighted]`: warm `--paper-deep` background. Default highlight for walkthrough steps before persona context.
  - `mark[data-highlighted][data-persona="legal|worker|director"]`: background swaps to `--{persona}-soft` at 85% mix, text color swaps to `--{persona}-ink`. The case file *re-reads in the persona's color* when a persona panel is active.
  - `mark[data-pulse]`: triggers the 1400ms `highlightPulse` halo (ease-out-expo, transient `box-shadow`).
- **Transitions:** 480ms background, 240ms color (both `var(--ease-out)`).

### Persona Panel
Appears below the case file when a persona step is active.

- **Container:** `--{persona}-soft` background at lower opacity, no border. Padded; inset slightly from the column rule.
- **Header:** mono micro label ("LEGAL AID ATTORNEY · Pushes toward eligibility"), persona-ink color.
- **Title:** Source Serif italic ("The advocate"), persona color on the italic em.
- **Body:** Source Serif body weight, ink-soft.
- **Weight Table:** "HOW THEY WEIGHT THE INTERPRETATIONS". A small mono-labeled table with three rows, each row a left-aligned interpretation phrase and a right-aligned percentage. A horizontal bar in the persona color fills proportionally beneath each row.

### Persona Introduction Columns (Index)
The "THE THREE LENSES" section at the foot of the index. Three typographic columns, no card chrome.

- **Layout:** `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3.25rem;` at ≥960px. Stacks to single column below.
- **Each column:** `border-top: 1px solid var(--hairline)`. No background fill. No border-bottom. No side borders.
- **Persona label:** mono micro caps, persona-ink color.
- **Persona name:** Source Serif italic em carries the persona color (`--legal` / `--worker` / `--director`).
- **Body:** ink-soft, max-width 32ch (column-narrowed).
- **Cue:** separated by a hairline top rule; mono caps label ("DEFAULT FRAME") sits above a serif sentence with the strong text in persona-ink.

### Scenario Rail (Document-Grid Left Rail)
A 200px sticky column at the left of the scenario view, ≥1180px. Below 1180px, it un-stickies and reflows to an inline auto-fit row.

- **Rail blocks:** stacked vertically with `border-top: 1px solid var(--rule)` between. Each block has a micro mono label, then content.
- **Scenario number:** Source Serif 3.25rem, weight 320, opsz 48, letter-spacing -0.03em, line-height 1.
- **Rail tags:** mono uppercase, 0.8125rem. HR1 / Big Beautiful Bill tag is in stamp red; others in default ink.

### Interpretation-Question Callout
Used inside the scenario view between case facts and the walkthrough intro.

- **Container:** `stamp-fade` background, no border, no radius (or `rounded.hair`). Padded 1.5rem.
- **Label:** small mono uppercase ("INTERPRETATION QUESTION") in `stamp` red.
- **Question:** Source Serif body, often with the verb italicized in `stamp` red.
- The callout never appears in a non-stamp color. Other "callouts" should not be invented; this is the only one.

### Calibration Reveal (Two-Panel)
The artifact's final beat. Two side-by-side panels under a Display-L punchline.

- **Container:** `display: grid; grid-template-columns: 1fr 1fr; gap: 1px;` with `background: var(--rule)` (the divider mechanic is intentional here: it conveys *side-by-side comparison*, which IS the point: model-alone vs three-lenses).
- **Panel 1, "AFTER PROMPTING / SINGLE ANSWER":** `paper-2` background. Big serif number ("95"), micro "% confident" label, body italic ("Not in household") and a paragraph below.
- **Panel 2, "AFTER DISAGGREGATION / THREE LENSES":** `paper` background. Three rows, one per persona, each with the persona-color weight bar and the percentage on the right.
- **Punchline:** Display L weight 400, italic em on the closing phrase in stamp red.

**Note:** this is the *one* place a divider-grid layout is acceptable in the artifact, because the divider visually performs the comparison being argued for. Anywhere else, the divider mechanic is forbidden.

### Step Controls
Bottom of every scenario view.

- **Container:** `border-top: 1px solid var(--rule)`, generous top padding.
- **Step indicator:** centered above the buttons. Mono small caps label ("READ THE FACTS", "WALKTHROUGH 4 OF 9", "LEGAL AID 7 / 11") in ink-soft, with a smaller "fraction" line ("5 / 11") below in ink-faint.
- **Buttons:** Previous (ghost, left) and Next (primary, right). Next button takes the next-step's persona tone when the next step is a persona panel.

### Named Rules

**The Mark-Is-The-UI Rule.** The `<mark>` element with `data-key` attributes is the load-bearing UI primitive of the entire scenario view. Walkthrough steps highlight marks; persona steps swap mark colors; the reveal highlights all marks together. New scenarios MUST use `<mark data-key="...">` with keys that exactly match the corresponding `walkthrough[*].key` and `personas[*].pulls[*].key` entries. Mismatched keys silently fail to highlight; there is no validation.

**The Document-Grid Rule.** Scenario views must use the three-column document grid (rail 200px, body ~70ch, margin 280px) at ≥1180px. The grid collapses below that breakpoint; do not invent intermediate layouts. The rail un-stickies and reflows. The right margin's annotations move inline between paragraphs.

## 6. Do's and Don'ts

### Do:
- **Do** treat the case file as the substrate of the design. Everything else is annotation.
- **Do** use Source Serif 4 for every readable surface, including small body text. Resist the impulse to introduce a sans for "UI text"; the mono is the UI text.
- **Do** use mono micro labels (uppercase, letter-spacing 0.1em+) for every section header, chip, indicator, and metadata strip. The mono is the document's civic-record voice.
- **Do** italicize Source Serif em with intent, always with an accent color (`stamp`, or a persona color). Italic is semantic.
- **Do** put persona colors on letterforms (label color, italic em, strong text in the cue) before reaching for backgrounds.
- **Do** use hairline rules (`--hairline`) to anchor each column or section. Whitespace + rule is the default; container chrome is the exception.
- **Do** apply persona color shifts to case-file marks when a persona panel is active. The document re-reads in the persona's color.
- **Do** end mark animations with the element returning to flat. Pulses are transient.
- **Do** use the `data-tone` attribute on the primary CTA when the next step transitions into a persona panel. The button color previews who's about to speak.

### Don't:
- **Don't** use three-column persona comparison cards on any surface other than the calibration reveal (the one place where side-by-side IS the argument). The obvious shape for "three personas" is refused everywhere else.
- **Don't** use the divider-grid mechanic (`gap: 1px; background: var(--rule)`) outside the calibration reveal. It reads as SaaS comparison table.
- **Don't** introduce a sans-serif. Source Serif and JetBrains Mono cover every surface. Adding a sans breaks the document register.
- **Don't** use `--legal`, `--worker`, or `--director` as a decorative palette. Persona colors mean: "this is that persona's reading."
- **Don't** use `box-shadow` for elevation. The page is flat; depth comes from tonal layers and hairline rules. The single permitted shadow is the transient mark-pulse.
- **Don't** use `border-left` (or `border-right`) greater than 1px as a colored stripe accent on any container. The side-stripe is forbidden.
- **Don't** use gradient text. `background-clip: text` over any gradient, no matter how subtle, is forbidden. Emphasis is a solid `stamp` red.
- **Don't** use glassmorphism, `backdrop-filter` blurs, frosted-glass cards, or any "AI demo" decorative effect. The body radials are atmospheric and subtle by design; nothing else uses blur.
- **Don't** use the hero-metric template (big number + small label + supporting stats + gradient accent). The artifact's hero is a Display-XL title and a lede. Nothing else.
- **Don't** use em dashes (`—` or `--`) anywhere. Use commas, colons, semicolons, periods, or parentheses. Em dashes are an absolute ban; they leak the AI-prose reflex this artifact most needs to refuse.
- **Don't** invent a second accent color. There is one red, and it is `stamp`. Persona colors are not accents; they are taxonomic markers.
- **Don't** use `#fff`, `#000`, or any pure-grey neutral. Every neutral carries chroma 0.008–0.024 at hue 75–85.
- **Don't** exceed 70ch on body lines, 56ch on the lede, 32ch on narrow-column body.
- **Don't** echo civic-tech defaults (navy + gold, beige cheerfulness, dashboard chrome) or the Anthropic/NYT cream-plus-serif editorial pastiche. The artifact has its own warm-paper register and should not converge on either reflex.
