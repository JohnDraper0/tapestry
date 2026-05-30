# Session log

Retros for serious work sessions. Newest entry at the top. Keep entries short.

See `~/Code/METHODOLOGY.md` for the full session lifecycle.

---

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
