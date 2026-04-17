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

- Nodes: 58 (47 known, 11 frontier). Domains: 14. Sims: 18. Analogous
  cross-links populated: 11. Images mirrored locally: 0.
- Last updated: 2026-04-17.

## The atlas we want (inventory)

A rough picture of full coverage. Today's node count in each domain is in
parens; the target for "good coverage" follows. Treat the targets as aim
points, not quotas.

| Domain          | Today | Target | Gaps worth filling next                                   |
|-----------------|------:|-------:|-----------------------------------------------------------|
| math            |   9   |   14   | topology, group theory, Gödel's theorems, graph theory    |
| principle       |   3   |    5   | variational principles, gauge invariance                  |
| mechanics       |   3   |    6   | Navier–Stokes, rigid-body, continuum elasticity           |
| thermo          |   4   |    7   | Wien displacement, Carnot, chemical potential             |
| em              |   2   |    5   | Faraday induction, Snell, Poynting, plasma                |
| relativity      |   2   |    4   | equivalence principle, Schwarzschild, gravitational waves |
| quantum         |   4   |    7   | entanglement, decoherence, photoelectric effect           |
| forces          |   2   |    4   | QCD / confinement, electroweak unification                |
| chemistry       |   3   |    7   | catalysis, Le Chatelier, reaction kinetics, acid–base     |
| biology         |   4   |    9   | Hardy–Weinberg, ATP, Hodgkin–Huxley, immunity, development|
| info            |   2   |    5   | Kolmogorov complexity, channel coding, error correction   |
| emergence       |   4   |    7   | self-organised criticality, Zipf, networks, cellular auto |
| cosmos          |   4   |    8   | CMB, inflation, structure formation, Drake, Roche         |
| neuro (new)     |   0   |    4   | neuron, synapse, action potential, cortex / maps          |
| earth (new)     |   0   |    4   | plate tectonics, climate system, biogeochemistry          |
| unknown         |  11   |   15   | strong CP, hierarchy, Riemann, turbulence, pre-BB state   |

Totals aimed at: ~100 nodes. Getting there is the work of months, not weeks.
**Quality always beats quantity.** One excellent node per run beats three thin
ones.

## Category rotation (so nothing stagnates)

Each run picks ONE category. Rough target ratio over 10 consecutive runs:

| Category                          | Frequency |
|-----------------------------------|-----------|
| A. Deepen existing content        | 3 in 10   |
| B. Add a new node                 | 3 in 10   |
| C. New or better simulation       | 2 in 10   |
| D. Imagery / offline verification | 1 in 10   |
| E. Cross-links / visual polish    | 1 in 10   |

Read `git log --oneline -20` at the start of every run. If the last 5 runs
were all Bs, do an A or C. If sims haven't been touched in a week, pick C.

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

1. **Photoelectric effect** (quantum) — the pivot from classical to quantum.
2. **Faraday's law of induction** (em) — the thread from magnetism to power.
3. **Hardy–Weinberg equilibrium** (biology) — the null model of evolution.
4. **Hodgkin–Huxley** (neuro) — voltage gives life its thinking tempo.
5. **ATP / chemiosmosis** (biology) — life's universal energy currency.
6. **Navier–Stokes** (mechanics) — the fluid law we can't prove well-posed.
7. **Wien's displacement law** (thermo) — hot things glow in predictable hues.
8. **Plate tectonics** (earth) — the Earth as a slow, convecting engine.
9. **Central limit theorem** (math/probability) — why bell curves everywhere.
10. **Kolmogorov complexity** (info) — the absolute information of a string.
11. **Self-organised criticality** (emergence) — Bak's sandpile universality.
12. **Gravitational waves** (relativity) — Einstein's 1916 prediction, 2015 found.
13. **Entanglement** (quantum) — "spooky action" and Bell's theorem.
14. **Neuron action potential** (neuro) — how a cell fires a signal.
15. **Entropy–information link / Landauer** (thermo-info bridge node).

**Frontier (known: false) additions worth having:**
Riemann hypothesis · Yang–Mills mass gap · turbulence · strong CP problem ·
hierarchy problem · nature of time · hard problem of consciousness
(strengthen) · pre-Big-Bang state · Fermi paradox.

**Sims still missing on existing nodes, ranked by teachability:**
- `uncertainty` — wave packet with inverse Δx↔Δp width.
- `statmech` — Maxwell–Boltzmann speed distribution, live.
- `pauli` — electron-shell filling by aufbau + exclusion.
- `kepler` — three-law visualiser (ellipses, equal areas, T²∝a³).
- `stars` — HR diagram with a live evolving track.
- `maxwell` / `ohms_law` — EM wave propagation + resistor-network.
- `standard` — particle zoo with interaction vertices.
- `periodic` — interactive table colouring by property.
- `selfrep` / `centraldogma` — transcription-translation micro-machine.
- `ecosystems` — energy-pyramid or trophic-cascade toy.

**Analogous cross-links to populate (using `addAnalogous(a, b, note)`
pattern at the bottom of `LAWS[]`):**
- `lotka_volterra` ↔ `gametheory` — replicator dynamics duality.
- `entropy` ↔ `information` — Shannon–Boltzmann bridge.
- `action` ↔ `quantum` — Feynman path integral as classical limit.
- `emergence` ↔ `complexity` ↔ `life sim`.
- `pauli` ↔ `chandrasekhar` — exclusion pressure as stellar brake.

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
