# Tapestry — roadmap

The long-arc plan. Future runs: read this, pick one thing, leave.

## North star

A single page where a curious human can come once and leave with the shape of
everything humanity understands about the natural world — and where the
understanding *stops*. Not a textbook; a map. Not a feed; a monument.

The success criterion: a visitor spends an hour, closes the tab, and never
needs to ask "what is the foundation of X?" again, because they have the
architecture in their head and know which rungs hold which weight.

## Snapshot (refresh this line each run)

- Nodes: 80 (63 known, 17 frontier). Domains: 15. Sims: 37. Analogous
  cross-links populated: 32. Images mirrored locally: 0 (all hot-linked hero
  URLs verified loading 2026-05-31; 10 dead ones replaced that run).
  Verification retry attempted 2026-08-27 blocked by the sandbox proxy.
- Last updated: 2026-09-04. Category C — the `ecosystems` node finally
  has a sim: Lindeman's 10% rule played as a live trophic pyramid. Sun
  in the corner drops rays onto the primary-producers band; calorie
  packets rise, and at each trophic boundary 90% turn into red heat
  puffs drifting sideways while 10% pass upward. The apex band sees
  roughly one packet per thousand the plants absorbed — visually
  reinforcing the rule Lindeman worked out at Cedar Bog Lake before
  dying at 27. Band widths use sqrt-scaled shares so the top level
  stays visible; percentages are the true ones. Recent history-run
  streak (bonding, probability, conservation, Noether, Newton, quantum)
  broken by a sim.

## The atlas we want (inventory)

A rough picture of full coverage. Today's node count in each domain is in
parens; the target for "good coverage" follows. Treat the targets as aim
points, not quotas.

| Domain          | Today | Target | Gaps worth filling next                                   |
|-----------------|------:|-------:|-----------------------------------------------------------|
| math            |  10   |   14   | topology, group theory, Gödel's theorems, graph theory    |
| principle       |   3   |    5   | variational principles, gauge invariance                  |
| mechanics       |   3   |    6   | Navier–Stokes, rigid-body, continuum elasticity           |
| thermo          |   5   |    7   | Carnot efficiency, chemical potential                     |
| em              |   4   |    5   | Poynting vector, plasma                                   |
| relativity      |   3   |    4   | equivalence principle, Schwarzschild                      |
| quantum         |   6   |    7   | decoherence, spin-statistics                              |
| forces          |   2   |    4   | QCD / confinement, electroweak unification                |
| chemistry       |   4   |    7   | catalysis, reaction kinetics, acid–base                   |
| biology         |   6   |    9   | Hodgkin–Huxley, immunity, development                     |
| info            |   3   |    5   | channel coding, error correction, Landauer bridge         |
| emergence       |   5   |    7   | Zipf, networks, cellular auto                             |
| cosmos          |   4   |    8   | CMB, inflation, structure formation, Drake, Roche         |
| neuro (new)     |   0   |    4   | neuron, synapse, action potential, cortex / maps          |
| earth (new)     |   1   |    4   | climate system, biogeochemistry, hydrologic cycle         |
| unknown         |  17   |   17   | nature of time, pre-Big-Bang state (target hit)           |

Totals aimed at: ~100 nodes. Getting there is the work of months, not weeks.
**Quality always beats quantity.** One excellent node per run beats three thin
ones.

## Category rotation (so nothing stagnates)

Each run picks ONE category. Rough target ratio over 10 consecutive runs:

| Category                               | Frequency |
|----------------------------------------|-----------|
| A. Deepen existing content             | 3 in 10   |
| B. Add a new node                      | 2 in 10   |
| C. New or better simulation            | 2 in 10   |
| D. Imagery / offline verification      | 1 in 10   |
| E. Cross-links / copy polish           | 1 in 10   |
| F. UI, mobile, aesthetics, a11y polish | 1 in 10   |

Read `git log --oneline -20` at the start of every run. If the last 5 runs
were all Bs, do an A or C. If sims haven't been touched in a week, pick C.
If the presentation layer hasn't moved in two weeks, pick F.

## Per-run workflow (tight)

1. `git fetch origin && git checkout master && git pull --ff-only`
2. Read `CLAUDE.md`, `ROADMAP.md`, `git log --oneline -20`.
3. Pick ONE category → ONE specific task. Write the change.
4. `node -c` every file touched. Re-read the edit to eyeball it.
5. Commit `[tapestry] <specific subject>`. Pull rebase. Push.
6. Exit with clean tree. Three-line summary.

25-minute budget. If overrunning, commit `[tapestry WIP]` and leave the next
run a breadcrumb in the commit message.

## Concrete gap list (refill as things get done)

**High-value new nodes, in rough priority order.** Each should land with
eli5/intermediate/expert/surprise/history, a real Wikimedia image, a LaTeX
equation, and valid `deps`:

1. ~~**Photoelectric effect** (quantum)~~ — added 2026-04-17.
2. ~~**Faraday's law of induction** (em)~~ — added 2026-04-17.
3. ~~**Hardy–Weinberg equilibrium** (biology) — the null model of evolution.~~ — added 2026-04-17.
4. **Hodgkin–Huxley** (neuro) — voltage gives life its thinking tempo.
5. ~~**ATP / chemiosmosis** (biology) — life's universal energy currency.~~ — added 2026-04-21.
6. ~~**Navier–Stokes** (mechanics)~~ — added 2026-04-17.
7. ~~**Wien's displacement law** (thermo)~~ — added 2026-04-17.
8. ~~**Plate tectonics** (earth) — the Earth as a slow, convecting engine.~~ — added 2026-08-25.
9. ~~**Central limit theorem** (math/probability)~~ — added 2026-04-17.
10. ~~**Kolmogorov complexity** (info)~~ — added 2026-05-16.
11. ~~**Self-organised criticality** (emergence) — Bak's sandpile universality.~~ — added 2026-06-13.
12. ~~**Gravitational waves** (relativity)~~ — added 2026-04-17.
13. ~~**Entanglement** (quantum) — "spooky action" and Bell's theorem.~~ — added 2026-04-18.
14. **Neuron action potential** (neuro) — how a cell fires a signal.
15. ~~**Entropy–information link / Landauer** (thermo-info bridge node).~~ — added 2026-07-05.

**Frontier (known: false) additions worth having:**
~~Riemann hypothesis~~ (added 2026-06-03) ·
~~Yang–Mills mass gap~~ (added 2026-08-02) ·
~~turbulence~~ (added 2026-07-20) ·
~~strong CP problem~~ (added 2026-07-09) ·
~~hierarchy problem~~ (added 2026-07-30) · nature of time ·
hard problem of consciousness (strengthen) · pre-Big-Bang state ·
~~Fermi paradox~~ (added 2026-07-25).

**Sims still missing on existing nodes, ranked by teachability:**
- ~~`uncertainty` — wave packet with inverse Δx↔Δp width.~~ — added 2026-04-17.
- ~~`statmech` — Maxwell–Boltzmann speed distribution, live.~~ — added 2026-04-17.
- `pauli` — electron-shell filling by aufbau + exclusion.
- `kepler` — three-law visualiser (ellipses, equal areas, T²∝a³).
- `stars` — HR diagram with a live evolving track.
- ~~`ohms_law` — DC loop with V/R oscillators, drift ∝ I, heat glow ∝ P.~~
  — added 2026-07-16.
- ~~`maxwell` — full EM wave propagation (`sim: 'wave'` today is a generic
  transverse wave; upgrade to real E-and-B travelling together).~~
  — added 2026-07-17 as `SIMS.maxwell`: E vertical, B along an
  axonometric z, both sin(kx − ωt) in phase.
- `standard` — particle zoo with interaction vertices.
- `periodic` — interactive table colouring by property.
- `selfrep` / `centraldogma` — transcription-translation micro-machine.
- ~~`ecosystems` — energy-pyramid or trophic-cascade toy.~~ — added
  2026-09-04 as `SIMS.ecosystems`: sun-fed pyramid where 90% of each
  band's calories exit sideways as heat and 10% ascend, so the apex
  sees ~1 packet per 1000 the plants got.

**Analogous cross-links to populate (using `addAnalogous(a, b, note)`
pattern at the bottom of `LAWS[]`):**
- `lotka_volterra` ↔ `gametheory` — replicator dynamics duality.
- `entropy` ↔ `information` — Shannon–Boltzmann bridge.
- `action` ↔ `quantum` — Feynman path integral as classical limit.
- `emergence` ↔ `complexity` ↔ `life sim`.
- `pauli` ↔ `chandrasekhar` — exclusion pressure as stellar brake.

## UI, mobile, aesthetics — the presentation layer

The content is most of the value, but the vessel matters. Tapestry should
feel like a **planetarium crossed with an Edward Tufte poster** — calm,
dense, readable, never frantic. Today the desktop experience delivers that
on cosmos/paper/blueprint themes, but the **phone experience is thin** and
several small aesthetic details undersell the work.

Treat this list as a backlog: each bullet is a single-run-sized task.
One bullet per F-category run. Order is roughly priority.

### Mobile & touch (biggest gap)
1. ~~**Panel becomes a bottom sheet on narrow viewports.**~~ — done
   2026-07-04. Below 640 px `#panel` docks as an 86 vh bottom sheet with a
   grab handle, rounded top, and flick-down-to-dismiss (pointer events,
   110 px threshold). Desktop side drawer unchanged.
2. ~~**Touch pan + pinch-zoom on the SVG map.**~~ — already in place
   (`app.js` touchstart/touchmove handlers do single-finger pan + two-finger
   pinch). Could still improve: zoom toward the pinch centroid, not viewport
   centre.
3. ~~**Collapse the 7-button header behind an overflow `⋯` menu on phones.**~~
   — done 2026-07-04. Below 640 px, tour/3D/iceberg/print/mute/help collapse
   into a `⋯` dropdown anchored below the header; search, theme switcher and
   reset stay inline. Menu closes on pick or outside click; ⋯ is a 44 px
   target.
4. ~~**Tap targets ≥44 × 44 px everywhere.**~~ — done 2026-07-22. A
   `@media (max-width: 640px)` block bumps `.theme-btn`, `#resetBtn`,
   `.overflow-toggle`, the search input, `#panelClose`, and `#narrateBtn`
   to a minimum 44 × 44 tap area (WCAG 2.5.5). Panel-close and narrate
   buttons keep the 34 × 34 desktop size where a cursor rules.
5. **Depth tabs respond to horizontal swipe** on the open panel, so a
   reader can thumb through ELI5 → intermediate → expert without
   hunting for small tab buttons.
6. ~~**Hero image responsive widths.**~~ — done 2026-07-04. The panel `<img>`
   now ships a 480 / 900 / 1400 `srcset` with `sizes="(max-width: 640px)
   100vw, 560px"`; Wikimedia's `Special:FilePath` honours the widths, so
   cellular phones pull ~480 and retina desktops pull ~1400 without any
   extra bookkeeping — ~75% fewer image bytes on a phone.
7. ~~**Compress the intro overlay on mobile.**~~ — done 2026-08-01.
   Below 640 px, only the first paragraph shows by default; the other
   two collapse behind a "Tell me more" pill that also reveals the
   keyboard-hint row (hidden on phones by default — those keys don't
   exist on a touch device). Title/sub/body sizes trimmed so the whole
   overlay fits above the fold on a 6-inch phone in portrait.

### Readability
8. ~~**Cap KaTeX line width to the panel and enable horizontal scroll.**~~
   — done 2026-04-26. `.panel-eq` is now `overflow-x: auto` with a thin
   accent-tinted scrollbar; long equations (Navier–Stokes, EFE) scroll
   horizontally instead of overflowing the panel.
9. **Audit every equation for unicode characters.** LaTeX-ify stray `·`,
   `→`, `×`, `−`, `↔`, `#`, `∅`, `∞` into `\cdot`, `\to`, `\times`, `-`,
   `\leftrightarrow`, `\#`, `\emptyset`, `\infty`. KaTeX renders these
   cleanly; raw unicode looks slightly sloppy.
10. ~~**Base type scale pass.**~~ — done 2026-08-19. Phone `.depth-text`
    is 16 px / 1.55 (was 15 / 1.72); `.callout` 15 / 1.6, `.panel-links`
    and `.panel-kindred` 14, `.kindred-note` 13, `.panel-tagline` 15.
    Line-length gets a global `max-width: 72ch` on `.depth-text` so
    prose can't sprawl on wider layouts. Desktop unchanged.
11. **Contrast audit per theme.** `ink-dim` on `paper` theme is close to
    WCAG AA borderline; use a contrast checker on every `--ink*` token
    in each theme.
12. **Italicise emphasis, not colour alone.** A couple of panel copies
    lean on colour to highlight terms — add italic or weight shift so
    colour-blind readers still see emphasis.

### Aesthetics
13. **Consistent icon set.** The header currently mixes Unicode symbols
    (◐ ◧ ◨ ▶ ◎ 🧊 ⎙ ♪ ⌂ ?) which render inconsistently across OSes —
    especially 🧊 on Linux. Replace with a cohesive inline-SVG icon set
    (~10 icons, <2 KB total).
14. **Soften the hero-card gradient fallback.** When an image 404s the
    gradient is abrupt; use a theme-tinted radial gradient so the gap
    reads as intentional rather than missing.
15. **Depth-tab transition polish.** Cross-fade the body between depth
    levels instead of hard-swap; 180 ms fade is enough.
16. **Accent-glow subtlety on `paper` theme.** The cosmos-style glow
    filter leaks into paper/blueprint as a faint blue aura; scope
    `filter: url(#glow)` per theme.
17. **Legend polish.** The domain legend in the corner uses coloured
    circles; add a 1-line description per domain on hover / tap so
    visitors learn the taxonomy without opening every node.

### Accessibility
18. **Keyboard navigation across the graph.** Arrow keys move focus
    between nodes along dependency edges; Enter opens the panel.
19. **ARIA landmarks + live regions.** `<main>`, `<nav>`, `<aside>`
    annotated; announce panel opens via `aria-live="polite"`.
20. ~~**`prefers-reduced-motion`.** Halt the background canvas drift, the
    tour auto-pan, the camera ease-out, and the intro glow when the
    viewer has asked for reduced motion.~~ — done 2026-06-01, extended
    2026-06-07. CSS media query collapses all keyframes + transitions;
    `bg.js` skips its rAF loop (one-shot repaint on theme/resize);
    `app.js` freezes the edge-particle flow and snaps the camera instead
    of easing it; `three3d.js` now skips the per-node bob and halo pulse
    while keeping drag-spin/wheel-zoom (user controls are not motion).
21. **Skip-to-content link.** Lets screen-reader users bypass the map.
22. **Colour-blind-safe theme variant.** A fourth theme (or a toggle on
    cosmos) that uses shape + pattern in addition to hue for domain
    differentiation.

### Performance
23. **Lazy-load KaTeX only when a panel first opens.** Saves ~300 KB on
    first paint for the ~50% of visitors who never open a panel.
24. **Defer three.js until the 3D button is pressed.** Currently
    lazy-loaded — verify and document.
25. **`content-visibility: auto` on off-screen panel sections** once the
    panel is very long (multi-depth content).

### Theme-system niceties
26. ~~**Honour `prefers-color-scheme: light`** as the initial theme on
    first visit (paper), while still persisting a user override.~~
    — done 2026-09-01. Inline `<head>` script sets `data-theme` on
    `<html>` pre-paint: stored choice wins, else `matchMedia(
    '(prefers-color-scheme: light)')` picks `paper`, otherwise
    `cosmos`. `applyTheme()` now targets `documentElement`, so any
    later toggle stays consistent with the first-paint attribute.
27. **Theme transition** — animate CSS variable changes (~250 ms) so
    switching themes feels curated, not jarring.

## Features to build (when content has room to breathe)

Not urgent; do these when a content run feels repetitive.

- **Citations layer.** Each claim in an expert block optionally footnotes a
  paper or textbook. Stored as `sources: [{label, url}]` on the node.
- **"How we measured it" depth level.** Below expert, an optional experimental
  history: apparatus, precision, disagreements, current best value.
- **Guided journeys.** Curated paths: "logic → consciousness (2 hours)",
  "number → black hole (90 min)". Data-driven, not code-driven.
- **Timeline overlay.** Laws pinned to the century they crystallised.
- **Image mirroring.** Run `scripts/mirror_images.sh` and ship `assets/img/`
  so the page runs 100% offline. Verify each `WM()` URL first.
- **Mobile layout pass.** The tower is currently desktop-shaped. A one-column
  phone layout with swipe-between-depths would open this to a wider audience.
- **Accessibility sweep.** Keyboard navigation across the graph. ARIA roles
  on the depth tabs. Colour-blind-safe theme variants.
- **"Unknowns radar" view.** Surface the frontier domain as its own page-mode
  so visitors can clearly see the edges of knowledge.

## Hard rules (non-negotiable)

- Facts are real. Check dates, names, constants with WebSearch when unsure.
- Never break the dependency graph. Every `deps` entry must exist; nothing
  deeper than what it depends on.
- `node -c` every JS file touched before committing.
- One focused change per run. No sweeps across many files.
- Never reduce quality. A rewrite must be clearer, more accurate, more vivid.
- Respect Fred's voice: direct, playful, grown-up. Not academic, not cute.
- No new frameworks, build steps, or CDN dependencies beyond KaTeX + three.js.

## When to revisit this file

Monthly or when the snapshot line gets stale. Add new gaps as they appear;
strike items as they're filled. Keep the atlas table honest.
