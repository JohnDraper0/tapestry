# Session log

Retros for serious work sessions. Newest entry at the top. Keep entries short.

See `~/Code/METHODOLOGY.md` for the full session lifecycle.

---

## 2026-05-31 — Grueling deep-pass (every node, sim & interaction, live)

**Goal:** "Leave no stone unturned" — verify what's actually on screen matches
what should be there, node by node, assuming nothing.

**Changed:**
- `data.js` grav_waves: raw LaTeX (`\bar{h}`, `\dddot{Q}`) was leaking into the
  expert prose as literal backslash text → Unicode (h̄, d³Q/dt³).
- `data.js` kolmogorov: hero was a turbulence-spectrum *diagram*, not a portrait
  (its caption names the man) → swapped to a photo of Kolmogorov lecturing. Also
  the Kleene star `x*` collided with `*time*` emphasis in the markdown converter,
  stranding an asterisk → `x∗` (Unicode).
- `data.js` fourier / hardy_weinberg: bare math asterisks (`f * g`, `q*`) → Unicode
  `∗`, so ASCII `*` is now exclusively markdown emphasis and em() is provably safe.
- `app.js`: removed KaTeX's single-`$` inline delimiter (no content uses it; it
  risked rendering currency like "$1 million" as garbled math).

**Result:** Objective sweep across all 67 nodes is clean — every equation renders
(0 KaTeX errors, 0 leaked LaTeX, 0 stray asterisks), 67/67 hero images load. All
24 sims screenshotted and judged correct (several numerically exact: Wien λ_peak,
γ at 0.55c, Δx·Δp = ℏ/2, Stefan–Boltzmann 0.3 MW/m²). Every interaction verified:
dep-link nav, search incl. no-results, tour (Escape stops), narrate, print, mute,
hover dependency-highlight, zoom, theme persistence, iceberg, 3D enter/exit. The
two newer nodes (entanglement, ATP) read accurately and well.

**Open:** Mobile one-column layout still pending (unchanged from prior entry).

**Lessons:** A "verified" filename from an API search is not a verified *subject* —
the Kolmogorov image existed and loaded fine but depicted the wrong thing (a
diagram, not the man). Look at the pixels, not just the HTTP status.

## 2026-05-31 — Overnight QA + polish pass (full app, live in browser)

**Goal:** Step through every square inch of the app in a real browser, find
anything broken or inconsistent, and lift the experience toward "Steve Jobs"
polish. Drove the live page via a headless preview (screenshots + JS eval),
not just code reading.

**Changed:**
- `three3d.js` — **3D mode was completely dead.** The module is injected with
  `type="module"`, so its top-level `const Tapestry3D` was module-scoped and
  never on `window`; app.js (a classic script) couldn't reach it, so the 3D
  button silently did nothing. Added `window.Tapestry3D = Tapestry3D;`. Also
  added a window-resize handler (it had none — sized once at enter and never
  adapted; also recovers a 0×0 canvas if entered before layout settled).
- `app.js` — rewrote `LAYER_LABELS`: 20 of 21 shelf labels were wrong (graph
  had grown past them — Newton's layer read "Quantum Realm", and layers 17–20
  showed raw "Layer 17"…"Layer 20"). Now 21 accurate, evocative labels.
  Added `syncIcebergCounts()` (counts now derived from `LAWS`, can't drift).
  Added `*italic*` / `**bold**` → `<em>`/`<strong>` rendering for panel prose.
- `data.js` — fixed 10 dead Wikimedia hero images (all hard 404s; verified the
  replacements load through the real `Special:FilePath?width=900` path before
  committing). calculus image is now Leibniz (no Newton-notebook file exists;
  caption updated). Reworded the ideal-gas "surprise" (the Charles balloon
  causal claim was muddled).
- `styles.css` — `.panel-sim` now a fixed dark "instrument screen" in every
  theme; previously it inherited `--bg`, turning parchment-pale in paper theme
  and washing out the sims (which draw hardcoded light ink).
- `index.html` — iceberg stats corrected (40→53 known) and made data-driven
  via ids; frontier essay split "dark matter and dark energy" so the list
  enumerates exactly 11; intro key hint "reset"→"recentre" (matched the hint
  bar + button title).

**Result:** 3D mode works; all 64 hero images load (was 54/64); 21 shelf
labels match their contents; sims legible in all 3 themes; iceberg shows
53/11 from the data; markdown emphasis renders (no stray `*`); no console
errors anywhere. Search, tour (53 known), themes, panels (top→bottom) all
verified live. Dependency graph already clean: 64 nodes, 0 missing deps, 0
cycles, nothing deeper than its deps, all 22 sims wired.

**Open:**
- Mobile layout still desktop-shaped (header wraps, search overlaps a node) —
  usable but a real one-column pass is still a ROADMAP item.
- Static sims (e.g. pythagoras) draw once in `fit()`; if `fit()` ever runs
  before layout settles they can render squashed and won't self-correct (no
  rAF redraw). Not seen in normal click-to-open flow. A ResizeObserver redraw
  would harden it — deferred (touches all 22 sims).
- Two intentional math asterisks remain literal (fourier `f * g` convolution,
  hardy_weinberg `q*`); correct as-is.

**Lessons:** A module injected at runtime won't expose its top-level bindings
to classic scripts — assign to `window` explicitly. And Python `http.server`
sends no cache headers, so a plain reload serves stale JS; force-refetch with
`fetch(url, {cache:'reload'})` before reloading when verifying JS edits.

<!--
Template — copy this block to the top for each new retro:

## YYYY-MM-DD — <short topic>

**Goal:** what we set out to do
**Changed:** files/systems touched (paths, commits)
**Result:** what works now that didn't before
**Open:** anything left undone, blockers, follow-ups
**Lessons:** anything worth remembering (rare — only when genuine)

-->
