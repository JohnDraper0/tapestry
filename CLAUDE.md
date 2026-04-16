# Tapestry — project notes for Claude

## What this is
A single-page interactive "cosmology of knowledge." Every natural law as a
node in a vertical tower, with dependencies drawn between them. Click any
node to get multi-depth explanations, real imagery, and live simulations.

## Architecture
Pure vanilla HTML/JS/CSS. No build step. Open `index.html`, done.

```
index.html   shell
styles.css   themed CSS vars (cosmos / paper / blueprint)
data.js      LAWS[] — each with eli5 / intermediate / expert / surprise / history
sims.js      canvas sims per-law (SIMS.pythagoras, SIMS.orbit, …)
sound.js     generative Web Audio (drone, pad, noise, bells, SFX)
bg.js        animated background canvas, theme-aware
app.js       layout + zoom/pan + panel + theme + wiring
```

## Layout
- Vertical tower. `layerOf(l)` = 1 + max(layer of deps). y = −layer × ROW_H.
- Layer 0 is Logic, at the bottom. Camera opens focused on Logic with a
  pulsing "Start here" beacon.
- X positions group siblings in a layer by `DOMAIN_ORDER`.

## Rules when editing
- **Keep `eli5` genuinely simple** — a five-year-old should follow it.
- **Keep `intermediate`** for a curious teenager or non-specialist adult.
- **Keep `expert`** technically rigorous — equations, formalism, open
  questions, actual constants where relevant.
- **`surprise`** should be one *punchy* astonishing fact, not a summary.
- **`history`** is short: who, when, how, with a human detail.
- Don't break the dependency graph. If you add a law, `deps` must point at
  existing ids, and nothing should be deeper than the rung it depends on.

## Themes
Three themes via `[data-theme]` on `<body>`:
- `cosmos`    — dark starfield, generative audio feels natural here
- `paper`     — warm parchment, sepia ink, vintage manuscript
- `blueprint` — navy grid + compass, engineering drawing

Theme is persisted in `localStorage.tapestry-theme`. The bg canvas hook
`window.__bgSetTheme(t)` switches renderers.

## Known gotchas
- Hero images are Wikimedia Commons `Special:FilePath` redirects — stable
  when the filename is correct, but a few may 404 in the future. The hero
  card `<img>` has `onerror` that hides broken images, leaving the gradient
  fallback. If you find a broken one, replace the filename in `IMAGES` in
  `data.js`.
- Audio must start inside a user gesture. It's wired to the intro "Begin"
  button. Don't move the init call away from there.
- SVG colors that need to adapt to themes are set via `style="fill: var(...)"`
  rather than `fill="..."` attributes — attributes override CSS.

## Recurring improvement trigger
A remote trigger runs every 30 minutes and iterates on this project:
refining explanations, checking image links, adding laws, polishing sims.
See `RemoteTrigger({list})` for the exact config. If you're that trigger
reading this file: focus on **content quality over adding new features**.
One small, solid improvement per run beats ten rough ones.

See `ROADMAP.md` for the long-arc plan: the atlas we're aiming at, the
category rotation policy, the ranked gap list, and features to build once
content has room to breathe. Read it each run. Occasionally edit it —
refresh the snapshot line, tick off filled gaps, add new ones you notice.
