# The Tapestry

An interactive cosmology of knowledge — every natural law, from logic at the
foundations to the stars and galaxies, arranged as a vertical tower you can
climb rung by rung.

## What it is

Open `index.html` in a browser. You'll see a tower of ~40 natural laws, each
rung built from the rungs beneath it. Logic sits at the bottom. Above it:
numbers, geometry, algebra, calculus. Above those: symmetry, least action,
conservation. Then Newton, gravity, thermodynamics, Maxwell, Einstein, the
quantum, the Standard Model, atoms, DNA, evolution, emergence, Big Bang, stars.

Click any node and you get:
- a **hero image** (real public-domain imagery)
- a **five-year-old's explanation**
- an **intermediate explanation** for a curious teenager or adult
- an **expert explanation** for a graduate-level reader
- one **astonishing fact**
- a short **history** of the discovery
- the canonical **equation**
- a live, interactive **simulation** for the headline laws
- **"Rests on"** and **"leads to"** links to neighbouring rungs

## Themes

Three visual themes switch live from the header:
- **Cosmos** — dark starfield with drifting nebulae, generative ambient music
- **Paper** — warm vintage manuscript, sepia ink, parchment grain
- **Blueprint** — navy engineering drawing with pale cyan grid

## Audio

Generative ambient music via the Web Audio API:
- Drone (A1/E2) + evolving triangle/saw pad through a sweeping low-pass
- Pink-noise "space wind" through a slowly drifting band-pass
- Scheduled bells from an A-minor pentatonic
- Chord progression (Am9 → Fmaj7 → Gmaj → Em) modulating every 14 seconds
- Hover/click/panel SFX: depth-pitched bells, whooshes, zoom blips

Click **Begin** to start audio (browser autoplay policy). Toggle with `M`.

## Controls

| Key / Action | Effect |
|---|---|
| Click a node | Open detail card |
| Drag | Pan the map |
| Scroll | Zoom |
| `R` | Recenter on Logic |
| `M` | Mute / unmute |
| `Esc` | Close panel |

## Structure

```
index.html   — shell
styles.css   — themed CSS variables (Cosmos / Paper / Blueprint)
data.js      — the 40+ laws, hero images, depth levels, dependencies
sims.js      — ~14 canvas simulations (orbits, doubleslit, life, etc.)
sound.js     — generative Web Audio synthesis
bg.js        — animated background canvas, theme-aware
app.js       — layout, zoom/pan, panel, theme switcher, wiring
```

All offline-capable except for the hero images, which load from Wikimedia
Commons (they fall back gracefully to a gradient if a URL hiccups).

## Nothing to install

No build step. No bundler. Double-click `index.html` and it runs.
