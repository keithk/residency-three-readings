<script setup lang="ts">
import { useRoute } from "@/composables/useRoute";

const { navigate } = useRoute();
</script>

<template>
  <section class="view about-view">
    <div class="about-body">

      <header class="about-header">
        <span class="micro label">About this project</span>
        <h1 class="about-title">Beyond <em>Average</em></h1>
        <p class="about-lede">
          A research artifact built during my AI residency at Propel, exploring what it means
          for a model to be "confident" on a determination where the right answer is
          genuinely contested.
        </p>
      </header>

      <div class="about-sections">

        <section class="about-section">
          <h2 class="section-head">The question</h2>
          <p>
            SNAP eligibility determinations are not factual lookups. They are interpretations
            of ambiguous household arrangements, income definitions, and categorical rules,
            read through the lens of whoever is making the call. A legal aid attorney and a
            frontline eligibility worker can read the same application and reach opposite
            conclusions, each correctly, from their own professional framework.
          </p>
          <p>
            When a model returns "74% confident: not in household" (its measured single-answer
            behavior on the first case in this set), that number describes the model's
            certainty about a reading it chose. It says nothing about whether a different
            reading is legitimate, or what the distribution of expert opinion actually
            looks like.
          </p>
          <p>
            This project asks: what would it look like to report that uncertainty honestly?
          </p>
        </section>

        <section class="about-section">
          <h2 class="section-head">The approach</h2>
          <p>
            Ten scenarios, five published at launch, drawn from real areas of legal
            ambiguity in SNAP eligibility rules. For each one: three personas read the same
            case from their own professional frames. The personas are not character
            sketches; each is a written description of a real job and its pressures, tested
            to make sure it reads cases the way that job actually would, with every test
            published. Then the model is asked to read the case twice, once for a single
            answer, once through all three lenses.
          </p>
          <p>
            The result is a calibration dataset and an argument. Single-answer confidence
            scores collapse real disagreement into a number that looks certain. A
            disaggregated reading, one that names the competing interpretations and their
            relative weight, describes the actual state of expert opinion. We tested this
            directly: told only the three job titles, the model collapses the lenses back
            into one answer. Given the full job descriptions, the disagreement returns.
          </p>
          <p>
            When the stakes are whether someone eats next month, the difference between
            those two descriptions matters.
          </p>
        </section>

        <div class="propel-section">
          <div class="propel-section-inner">
            <div class="propel-brand">
              <a
                href="https://www.joinpropel.com"
                target="_blank"
                rel="noopener"
                class="propel-logo-link"
                aria-label="Propel"
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <path d="M27 0H9C4.02944 0 0 4.02944 0 9V27C0 31.9706 4.02944 36 9 36H27C31.9706 36 36 31.9706 36 27V9C36 4.02944 31.9706 0 27 0Z" fill="white"/>
                  <path d="M19.029 10.329C19.362 9.348 19.071 7.833 18.057 6.903C17.34 6.273 16.728 6.087 15.954 5.853C15.408 5.688 14.79 5.499 13.956 5.103C13.584 4.926 13.209 4.944 12.924 5.151C12.894 5.172 12.864 5.199 12.837 5.223C12.684 5.34 12.114 5.778 11.655 6.222C11.367 6.48 11.388 6.774 11.403 6.99V7.02C11.46 7.722 11.589 9.363 12.729 10.602C13.092 10.995 13.485 11.25 13.86 11.415C12.996 11.796 12.192 12.282 11.364 12.912C11.199 13.032 11.04 13.158 10.884 13.29C10.842 13.323 10.8 13.356 10.758 13.392C10.74 13.407 10.725 13.422 10.713 13.437C8.81998 15.117 7.62598 17.565 7.62598 20.286C7.62598 24.387 10.338 27.87 14.064 29.031C14.085 29.04 14.103 29.049 14.127 29.055C15.432 29.436 16.677 29.628 17.925 29.628C18.867 29.628 19.812 29.52 20.781 29.304C20.784 29.304 20.79 29.301 20.793 29.301C25.119 28.371 28.371 24.519 28.371 19.92C28.371 14.712 24.204 10.461 19.029 10.329ZM18.207 23.79C17.379 23.67 16.614 23.289 16.011 22.686C15.273 21.948 14.865 20.967 14.865 19.923C14.865 18.519 15.609 17.286 16.722 16.596C16.809 16.59 16.899 16.584 16.989 16.584C19.032 16.584 20.694 18.246 20.694 20.289C20.694 21.906 19.653 23.283 18.204 23.787L18.207 23.79Z" fill="black"/>
                  <path d="M17.5441 7.47005C16.9561 6.95405 16.4701 6.80705 15.7321 6.58205C15.1891 6.41705 14.5141 6.21305 13.6291 5.79305C13.5661 5.76305 13.5031 5.74805 13.4551 5.74805C13.4221 5.74805 13.3951 5.75405 13.3771 5.76905C13.3291 5.80505 13.2811 5.91605 13.3081 6.11105C13.4071 6.86705 13.9441 9.01205 15.2341 9.87605C16.1401 10.482 17.6281 10.434 18.1681 10.32C18.1891 10.314 18.2011 10.305 18.2071 10.296C18.7111 9.47405 18.1651 8.04005 17.5441 7.47305V7.47005Z" fill="#77CB46"/>
                  <path d="M18.7772 11.0913C13.9082 11.0913 9.94824 15.0513 9.94824 19.9203C9.94824 22.2783 10.8662 24.4953 12.5342 26.1633C14.2022 27.8313 16.4192 28.7493 18.7772 28.7493C23.6462 28.7493 27.6062 24.7893 27.6062 19.9203C27.6062 15.0513 23.6462 11.0913 18.7772 11.0913ZM22.0802 23.2263C21.1982 24.1083 20.0222 24.5943 18.7742 24.5943C17.5262 24.5943 16.3502 24.1083 15.4682 23.2263C14.5862 22.3443 14.1002 21.1683 14.1002 19.9203C14.1002 17.3433 16.1972 15.2463 18.7742 15.2463C21.3512 15.2463 23.4482 17.3433 23.4482 19.9203C23.4482 21.1683 22.9622 22.3443 22.0802 23.2263Z" fill="#FFBE00"/>
                </svg>
              </a>
            </div>

            <div class="propel-content">
              <h2 class="propel-head">
                The <a href="https://www.joinpropel.com" target="_blank" rel="noopener">Propel</a> AI Residency
              </h2>
              <p>
                Propel builds the software that benefits recipients use to manage their EBT cards,
                find food, and navigate the eligibility system. More than five million families
                use Propel's app. That scale puts the company at an unusual position: directly
                inside the gap between how the system was designed and how it is actually
                experienced.
              </p>
              <p>
                The AI residency is Propel's effort to think carefully about what responsible
                AI deployment looks like in government benefits contexts, where the cost of a
                wrong answer is not a failed query but a denied application.
              </p>
              <p>
                This artifact is my research contribution to that question.
              </p>
            </div>
          </div>
        </div>

        <section class="about-section">
          <h2 class="section-head">The scenarios</h2>
          <p>
            The ten cases in this dataset are synthetic, constructed to isolate real
            categories of legal ambiguity in SNAP eligibility determination: household
            composition rules, student exclusions, income attribution, categorical
            eligibility triggers. Each scenario is anchored in provisions that trained
            eligibility workers genuinely disagree on.
          </p>
          <p>
            The personas are not caricatures. The legal aid attorney, the eligibility
            worker, and the SNAP director each represent a coherent professional stance,
            grounded in the priorities and constraints of that role. None of them is
            wrong.
          </p>
        </section>

        <footer class="about-footer">
          <button
            class="btn-primary"
            @click="navigate({ view: 'index' })"
          >
            Read the scenarios <span class="btn-arrow" aria-hidden="true">→</span>
          </button>
          <p class="about-footer-meta meta">Propel AI Residency · April 2026</p>
        </footer>

      </div>
    </div>
  </section>
</template>

<style scoped>
.view {
  animation: fadeIn 520ms var(--ease-out);
  padding: var(--pad-y) var(--pad-x);
  max-width: 1400px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.about-body {
  max-width: 68ch;
}

/* ── Header ── */
.about-header {
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--rule);
  display: grid;
  gap: 1.25rem;
}

.label {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.about-title {
  font-family: var(--serif);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 380;
  font-variation-settings: "opsz" 48;
  letter-spacing: -0.03em;
  line-height: 1.0;
  color: var(--ink);
  margin: 0;
}

.about-title em {
  font-style: italic;
  color: var(--stamp);
  font-weight: 320;
}

.about-lede {
  font-family: var(--serif);
  font-size: clamp(1.125rem, 1.8vw, 1.3125rem);
  font-weight: 380;
  line-height: 1.5;
  letter-spacing: -0.005em;
  color: var(--ink-soft);
  margin: 0;
  max-width: 56ch;
}

/* ── Sections ── */
.about-sections {
  display: grid;
  gap: 0;
}

.about-section {
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--hairline);
  display: grid;
  gap: 1.125rem;
}

.section-head {
  font-family: var(--serif);
  font-size: 1.125rem;
  font-weight: 540;
  font-variation-settings: "opsz" 18;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0;
}

.about-section p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  font-weight: 380;
  line-height: 1.65;
  letter-spacing: -0.005em;
  color: var(--ink-soft);
  margin: 0;
  max-width: 65ch;
}

/* ── Propel section ── */
.propel-section {
  padding: 2.5rem 0;
  border-bottom: 1px solid var(--hairline);
}

.propel-section-inner {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.75rem;
  align-items: start;
  background: oklch(0.96 0.022 135);
  border: 1px solid oklch(0.88 0.05 135);
  padding: 1.75rem;
}

@media (max-width: 520px) {
  .propel-section-inner {
    grid-template-columns: 1fr;
  }
}

.propel-logo-link {
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 8px;
  transition: opacity 160ms var(--ease-out);
}

.propel-logo-link:hover { opacity: 0.8; }

.propel-logo-link:focus-visible {
  outline: 2px solid oklch(0.48 0.145 135);
  outline-offset: 3px;
  border-radius: 9px;
}

.propel-logo-link svg {
  display: block;
  border-radius: 7px;
  border: 1px solid oklch(0.82 0.07 135);
}

.propel-content {
  display: grid;
  gap: 1rem;
}

.propel-head {
  font-family: var(--serif);
  font-size: 1.125rem;
  font-weight: 540;
  font-variation-settings: "opsz" 18;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0;
}

.propel-head a {
  color: oklch(0.38 0.14 135);
  text-decoration: none;
  border-bottom: 1px solid oklch(0.70 0.10 135);
  transition: border-color 160ms var(--ease-out);
}

.propel-head a:hover {
  border-bottom-color: oklch(0.38 0.14 135);
}

.propel-content p {
  font-family: var(--serif);
  font-size: 1.0625rem;
  font-weight: 380;
  line-height: 1.65;
  letter-spacing: -0.005em;
  color: oklch(0.36 0.06 135);
  margin: 0;
  max-width: 60ch;
}

/* ── Footer ── */
.about-footer {
  padding-top: 2.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.625rem;
  background: var(--ink);
  color: var(--paper);
  border: none;
  border-radius: 2px;
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms var(--ease-out);
}

.btn-primary:hover {
  background: var(--stamp);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--stamp);
  outline-offset: 3px;
}

.btn-arrow {
  display: inline-block;
  transition: transform 200ms var(--ease-out);
}

.btn-primary:hover .btn-arrow {
  transform: translateX(3px);
}

.about-footer-meta {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0;
}

.about-footer-meta a {
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  transition: color 160ms var(--ease-out), border-color 160ms var(--ease-out);
}

.about-footer-meta a:hover {
  color: var(--ink);
  border-bottom-color: var(--ink-soft);
}
</style>
