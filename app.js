// The Tapestry — main app.
// Builds the radial knowledge map, wires click/zoom/pan, and opens the
// detail panel with a live simulation when a node is selected.

(function () {
  const svg     = document.getElementById('map');
  const viewport = document.getElementById('viewport');
  const legend  = document.getElementById('legend');
  const panel   = document.getElementById('panel');
  const panelBody = document.getElementById('panelBody');
  const panelClose = document.getElementById('panelClose');
  const intro   = document.getElementById('intro');
  const introBtn = document.getElementById('introBtn');
  const resetBtn = document.getElementById('resetBtn');
  const helpBtn  = document.getElementById('helpBtn');

  // ── 1. compute layer (dependency depth) for each node ───────────
  const byId = new Map(LAWS.map(l => [l.id, l]));
  const layerCache = new Map();
  function layerOf(id) {
    if (layerCache.has(id)) return layerCache.get(id);
    const node = byId.get(id);
    if (!node || node.deps.length === 0) { layerCache.set(id, 0); return 0; }
    const L = 1 + Math.max(...node.deps.map(layerOf));
    layerCache.set(id, L);
    return L;
  }
  LAWS.forEach(l => { l.layer = layerOf(l.id); });
  const maxLayer = Math.max(...LAWS.map(l => l.layer));

  // ── 2. vertical tower layout ────────────────────────────────────
  // Foundations at the BOTTOM (y = +), emergence/cosmos at the TOP (y = −).
  // Each layer is one step up the ladder. Within a layer, nodes are laid
  // out left-to-right grouped by domain so related ideas sit together.
  // This is literal: you start at the bottom and climb up the tower.

  const DOMAIN_ORDER = [
    'math', 'principle',
    'mechanics', 'thermo', 'em',
    'relativity', 'quantum', 'forces',
    'chemistry', 'biology',
    'info', 'emergence', 'cosmos',
  ];

  // group by layer; inside a layer sort by domain order
  const byLayer = {};
  LAWS.forEach(l => {
    if (!byLayer[l.layer]) byLayer[l.layer] = [];
    byLayer[l.layer].push(l);
  });
  Object.values(byLayer).forEach(arr => {
    arr.sort((a, b) =>
      DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain)
    );
  });

  const ROW_H = 150;    // vertical spacing between layers
  const COL_W = 170;    // horizontal spacing between siblings in a layer
  LAWS.forEach(l => {
    const row = byLayer[l.layer];
    const i = row.indexOf(l);
    const width = (row.length - 1) * COL_W;
    // y is negative upward — bottom of screen = layer 0
    // We want layer 0 near the bottom of the map.
    l.pos = {
      x: i * COL_W - width / 2,
      y: -l.layer * ROW_H + (maxLayer * ROW_H) / 2,
    };
  });

  // ── 4. camera / zoom ─────────────────────────────────────────────
  // Start looking at the base of the tower: the "Logic" node near the
  // bottom, with a hint of what's stacked above it.
  const startNode = byId.get('logic') || LAWS[0];
  let cam = {
    x: -startNode.pos.x * 0.8,
    y: -startNode.pos.y * 0.8 + 120,
    scale: 0.8,
  };
  function applyCam() {
    const w = svg.clientWidth, h = svg.clientHeight;
    viewport.setAttribute(
      'transform',
      `translate(${w / 2 + cam.x}, ${h / 2 + cam.y}) scale(${cam.scale})`
    );
  }

  function setCam(c) {
    cam = c; applyCam();
  }

  // ── 5. draw ──────────────────────────────────────────────────────
  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  // Horizontal "shelves" — one faint line per layer, with a label on the left
  const shelves = svgEl('g', { class: 'shelves' });
  const LAYER_LABELS = [
    'Foundations',
    'Counting & Shapes',
    'Form & Change',
    'Deep Principles',
    'Classical World',
    'Heat & Light',
    'Relativity & Waves',
    'Quantum Realm',
    'Fundamental Forces',
    'Matter',
    'Chemistry',
    'Life',
    'Evolution',
    'Ecology & Mind',
    'Emergence',
    'Complexity',
    'The Cosmos',
  ];
  const towerLeft  = -COL_W * 5;
  const towerRight =  COL_W * 5;
  for (let L = 0; L <= maxLayer; L++) {
    const y = -L * ROW_H + (maxLayer * ROW_H) / 2;
    shelves.appendChild(svgEl('line', {
      x1: towerLeft, y1: y, x2: towerRight, y2: y,
      'stroke-width': 1,
      'stroke-dasharray': '2 8',
      style: 'stroke: var(--shelf)',
    }));
    const label = svgEl('text', {
      x: towerLeft - 20, y: y + 5,
      'text-anchor': 'end',
      'font-family': 'Didot, Georgia, serif',
      'font-style': 'italic',
      'font-size': 16,
      'letter-spacing': 2,
      style: 'fill: var(--label-dim)',
    });
    label.textContent = LAYER_LABELS[L] || `Layer ${L}`;
    shelves.appendChild(label);
  }
  viewport.appendChild(shelves);

  // Central "spine" — a subtle glowing vertical line suggesting the tower
  const spine = svgEl('line', {
    x1: 0, y1: (maxLayer * ROW_H) / 2 + 60,
    x2: 0, y2: -(maxLayer * ROW_H) / 2 - 60,
    'stroke-width': 1,
    filter: 'url(#softglow)',
    style: 'stroke: var(--accent); opacity: 0.15',
  });
  viewport.appendChild(spine);

  // Dependency edges + flowing particles along each
  const edgeLayer = svgEl('g', { class: 'edges' });
  viewport.appendChild(edgeLayer);
  const edges = [];
  LAWS.forEach(l => {
    l.deps.forEach(dep => {
      const src = byId.get(dep);
      if (!src) return;
      const line = svgEl('line', {
        x1: src.pos.x, y1: src.pos.y,
        x2: l.pos.x,   y2: l.pos.y,
        stroke: DOMAINS[l.domain].color,
        'stroke-width': 1,
        'stroke-opacity': 0.22,
        filter: 'url(#softglow)',
      });
      edgeLayer.appendChild(line);
      // particle that flows from dep → dependent
      const particle = svgEl('circle', {
        r: 1.6,
        fill: DOMAINS[l.domain].color,
        filter: 'url(#softglow)',
      });
      edgeLayer.appendChild(particle);
      edges.push({
        from: src.pos, to: l.pos, line, particle,
        t: Math.random(),
        speed: 0.0015 + Math.random() * 0.0015,
        domain: l.domain,
      });
    });
  });

  function animateParticles() {
    edges.forEach(e => {
      e.t += e.speed;
      if (e.t > 1) e.t = 0;
      const x = e.from.x + (e.to.x - e.from.x) * e.t;
      const y = e.from.y + (e.to.y - e.from.y) * e.t;
      e.particle.setAttribute('cx', x);
      e.particle.setAttribute('cy', y);
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Nodes
  const nodeLayer = svgEl('g', { class: 'nodes' });
  viewport.appendChild(nodeLayer);
  const nodeEls = new Map();
  LAWS.forEach(l => {
    const g = svgEl('g', {
      class: 'node',
      transform: `translate(${l.pos.x}, ${l.pos.y})`,
      'data-id': l.id,
    });

    // outer glow halo (breathing)
    const halo = svgEl('circle', {
      cx: 0, cy: 0, r: 44,
      fill: DOMAINS[l.domain].color,
      opacity: 0.06,
      filter: 'url(#glow)',
    });
    g.appendChild(halo);

    const glow = svgEl('circle', {
      cx: 0, cy: 0, r: 30,
      fill: DOMAINS[l.domain].color,
      opacity: 0.14,
      class: 'node-glow',
      style: `animation-delay: ${(l.layer * 0.3).toFixed(2)}s`,
    });
    g.appendChild(glow);

    const disc = svgEl('circle', {
      cx: 0, cy: 0, r: 22,
      stroke: DOMAINS[l.domain].color,
      'stroke-width': 2.5,
      filter: 'url(#softglow)',
      style: 'fill: var(--node-bg)',
    });
    g.appendChild(disc);

    const sym = svgEl('text', {
      x: 0, y: 5,
      'text-anchor': 'middle',
      fill: DOMAINS[l.domain].color,
      'font-size': 13,
      'font-weight': 600,
    });
    sym.textContent = l.symbol;
    g.appendChild(sym);

    const name = svgEl('text', {
      x: 0, y: 42,
      'text-anchor': 'middle',
      'font-size': 12,
      'font-family': 'system-ui',
      'pointer-events': 'none',
      style: 'fill: var(--ink)',
    });
    name.textContent = l.name;
    g.appendChild(name);

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof Sound !== 'undefined') Sound.click(l.layer);
      openPanel(l);
      focusNode(l);
    });
    g.addEventListener('mouseenter', () => {
      disc.setAttribute('r', 26);
      glow.setAttribute('opacity', 0.32);
      halo.setAttribute('opacity', 0.18);
      if (typeof Sound !== 'undefined') Sound.hover(l.layer);
      highlightDeps(l.id);
    });
    g.addEventListener('mouseleave', () => {
      disc.setAttribute('r', 22);
      glow.setAttribute('opacity', 0.14);
      halo.setAttribute('opacity', 0.06);
      unhighlight();
    });

    nodeLayer.appendChild(g);
    nodeEls.set(l.id, { g, disc, glow, halo });
  });

  // ── START HERE beacon — draws attention to Logic as the root ───────
  const start = byId.get('logic');
  if (start) {
    const beacon = svgEl('g', {
      transform: `translate(${start.pos.x + 90}, ${start.pos.y})`,
      class: 'start-beacon',
    });
    // arrow
    const arrow = svgEl('path', {
      d: 'M -60 0 L -10 0 M -20 -8 L -10 0 L -20 8',
      'stroke-width': 2.5,
      fill: 'none',
      'stroke-linecap': 'round',
      filter: 'url(#softglow)',
      style: 'stroke: var(--accent)',
    });
    beacon.appendChild(arrow);
    const label = svgEl('text', {
      x: 10, y: -22,
      'font-family': 'Didot, Georgia, serif',
      'font-style': 'italic',
      'font-size': 20,
      filter: 'url(#softglow)',
      style: 'fill: var(--accent)',
    });
    label.textContent = 'Start here';
    beacon.appendChild(label);
    const sub = svgEl('text', {
      x: 10, y: 0,
      'font-family': 'system-ui',
      'font-size': 10,
      'letter-spacing': 2,
      style: 'fill: var(--accent); opacity: 0.7',
    });
    sub.textContent = 'CLIMB UPWARD →';
    beacon.appendChild(sub);
    nodeLayer.appendChild(beacon);

    // pulsing ring around Logic
    const pulse = svgEl('circle', {
      cx: start.pos.x, cy: start.pos.y,
      r: 30,
      fill: 'none',
      'stroke-width': 2,
      class: 'logic-pulse',
      style: 'stroke: var(--accent)',
    });
    nodeLayer.insertBefore(pulse, nodeEls.get('logic').g);
  }

  function highlightDeps(id) {
    const chain = new Set();
    (function walk(x) {
      if (chain.has(x)) return;
      chain.add(x);
      const n = byId.get(x);
      if (n) n.deps.forEach(walk);
    })(id);
    // edges: dim all, then relight members of the chain
    let ei = 0;
    LAWS.forEach(l => {
      l.deps.forEach(() => {
        const edge = edges[ei++];
        if (!edge) return;
        if (chain.has(l.id)) {
          edge.line.setAttribute('stroke-opacity', 0.9);
          edge.line.setAttribute('stroke-width', 2);
          edge.particle.setAttribute('r', 2.8);
        } else {
          edge.line.setAttribute('stroke-opacity', 0.07);
          edge.line.setAttribute('stroke-width', 1);
          edge.particle.setAttribute('r', 1);
        }
      });
    });
    nodeEls.forEach(({ disc, glow, halo, g }, nid) => {
      if (chain.has(nid)) {
        disc.setAttribute('stroke-width', 3.5);
        g.setAttribute('opacity', 1);
      } else {
        g.setAttribute('opacity', 0.28);
      }
    });
  }
  function unhighlight() {
    edges.forEach(e => {
      e.line.setAttribute('stroke-opacity', 0.22);
      e.line.setAttribute('stroke-width', 1);
      e.particle.setAttribute('r', 1.6);
    });
    nodeEls.forEach(({ disc, g }) => {
      disc.setAttribute('stroke-width', 2.5);
      g.setAttribute('opacity', 1);
    });
  }

  // ── 6. pan & zoom ────────────────────────────────────────────────
  let dragging = false, dragStart = null, camStart = null;
  svg.addEventListener('mousedown', (e) => {
    dragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    camStart = { ...cam };
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    cam.x = camStart.x + (e.clientX - dragStart.x);
    cam.y = camStart.y + (e.clientY - dragStart.y);
    applyCam();
  });
  window.addEventListener('mouseup', () => { dragging = false; });

  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2 - cam.x;
    const my = e.clientY - rect.top  - rect.height / 2 - cam.y;
    const factor = Math.exp(-e.deltaY * 0.001);
    const newScale = Math.max(0.25, Math.min(4, cam.scale * factor));
    const ratio = newScale / cam.scale;
    cam.x -= mx * (ratio - 1);
    cam.y -= my * (ratio - 1);
    cam.scale = newScale;
    applyCam();
    if (typeof Sound !== 'undefined' && Math.random() < 0.08) Sound.zoom(-e.deltaY);
  }, { passive: false });

  // touch: pinch + pan
  let touchStart = null;
  svg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      dragging = true;
      dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      camStart = { ...cam };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStart = { d: Math.hypot(dx, dy), scale: cam.scale };
    }
  });
  svg.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      cam.x = camStart.x + (e.touches[0].clientX - dragStart.x);
      cam.y = camStart.y + (e.touches[0].clientY - dragStart.y);
      applyCam();
    } else if (e.touches.length === 2 && touchStart) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d  = Math.hypot(dx, dy);
      cam.scale = Math.max(0.25, Math.min(4, touchStart.scale * d / touchStart.d));
      applyCam();
    }
  }, { passive: false });
  svg.addEventListener('touchend', () => { dragging = false; touchStart = null; });

  // ── 7. focus helper ──────────────────────────────────────────────
  function focusNode(l) {
    const target = { x: -l.pos.x * 1.8, y: -l.pos.y * 1.8, scale: 1.8 };
    const start = { ...cam };
    const t0 = performance.now();
    const dur = 500;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function tick(now) {
      const t = Math.min(1, (now - t0) / dur);
      const k = ease(t);
      cam.x = start.x + (target.x - start.x) * k;
      cam.y = start.y + (target.y - start.y) * k;
      cam.scale = start.scale + (target.scale - start.scale) * k;
      applyCam();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function resetCam() {
    const start = { ...cam };
    const target = {
      x: -startNode.pos.x * 0.8,
      y: -startNode.pos.y * 0.8 + 120,
      scale: 0.8,
    };
    const t0 = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - t0) / 500);
      const k = 1 - Math.pow(1 - t, 3);
      cam.x = start.x + (target.x - start.x) * k;
      cam.y = start.y + (target.y - start.y) * k;
      cam.scale = start.scale + (target.scale - start.scale) * k;
      applyCam();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── 8. detail panel ─────────────────────────────────────────────
  let activeSim = null;
  function openPanel(l) {
    if (activeSim) { activeSim.stop(); activeSim = null; }

    const depsList = l.deps.length
      ? l.deps.map(id => {
          const d = byId.get(id);
          return d
            ? `<a class="dep" data-go="${d.id}" style="color:${DOMAINS[d.domain].color}">${d.name}</a>`
            : id;
        }).join(' · ')
      : '<em style="opacity:.5">nothing — this is a foundation</em>';

    const leadsTo = LAWS.filter(x => x.deps.includes(l.id));
    const leadsList = leadsTo.length
      ? leadsTo.map(d =>
          `<a class="dep" data-go="${d.id}" style="color:${DOMAINS[d.domain].color}">${d.name}</a>`
        ).join(' · ')
      : '<em style="opacity:.5">…the sky</em>';

    const color = DOMAINS[l.domain].color;
    const heroImg = l.image
      ? `<img class="hero-photo" src="${l.image}" alt="${l.name}" onerror="this.style.display='none'">`
      : '';
    const heroCaption = l.caption
      ? `<div class="hero-caption">${l.caption}</div>`
      : '';
    const heroBg = `background: linear-gradient(135deg, ${color}33, ${color}08 60%, transparent), radial-gradient(ellipse at top, ${color}44, transparent 75%);`;

    // gather depth levels (backward-compat if only eli5/deeper)
    const eli5 = l.eli5 || '';
    const intermediate = l.intermediate || l.deeper || '';
    const expert = l.expert || '';
    const surprise = l.surprise || '';
    const history = l.history || '';

    panelBody.innerHTML = `
      <div class="panel-hero" style="${heroBg}">
        ${heroImg}
        <div class="hero-overlay">
          <div class="hero-symbol" style="color:${color}">${l.symbol}</div>
          <div class="hero-label" style="color:${color}">${DOMAINS[l.domain].label}</div>
        </div>
        ${heroCaption}
      </div>

      <div class="panel-head">
        <div class="panel-title">${l.name}</div>
        <div class="panel-tagline">${l.tagline}</div>
      </div>

      ${l.equation ? `<div class="panel-eq">${l.equation}</div>` : ''}

      ${l.sim ? `<canvas id="simCanvas" class="panel-sim"></canvas>` : ''}

      ${eli5 ? `
      <div class="depth-section">
        <span class="depth-badge eli5">For a 5-year-old</span>
        <div class="depth-text">${eli5}</div>
      </div>` : ''}

      ${intermediate ? `
      <div class="depth-section">
        <span class="depth-badge inter">For a curious reader</span>
        <div class="depth-text">${intermediate}</div>
      </div>` : ''}

      ${expert ? `
      <div class="depth-section">
        <span class="depth-badge expert">For a graduate / expert</span>
        <div class="depth-text">${expert}</div>
      </div>` : ''}

      ${surprise ? `
      <div class="callout callout-surprise">
        <span class="callout-label">One astonishing thing</span>
        ${surprise}
      </div>` : ''}

      ${history ? `
      <div class="callout callout-history">
        <span class="callout-label">History</span>
        ${history}
      </div>` : ''}

      <div class="panel-section">
        <div class="panel-label">Rests on</div>
        <div class="panel-links">${depsList}</div>
      </div>

      <div class="panel-section">
        <div class="panel-label">Leads to</div>
        <div class="panel-links">${leadsList}</div>
      </div>
    `;
    panel.classList.add('open');
    if (typeof Sound !== 'undefined') Sound.openPanel();

    if (l.sim) {
      const canvas = document.getElementById('simCanvas');
      setTimeout(() => { activeSim = startSim(l.sim, canvas); }, 50);
    }

    panelBody.querySelectorAll('.dep').forEach(a => {
      a.addEventListener('click', () => {
        const d = byId.get(a.dataset.go);
        if (d) { openPanel(d); focusNode(d); }
      });
    });
  }

  panelClose.addEventListener('click', () => {
    panel.classList.remove('open');
    if (typeof Sound !== 'undefined') Sound.closePanel();
    if (activeSim) { activeSim.stop(); activeSim = null; }
  });

  // ── 9. legend ────────────────────────────────────────────────────
  DOMAIN_ORDER.forEach(d => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<span class="dot" style="background:${DOMAINS[d].color}"></span>${DOMAINS[d].label}`;
    legend.appendChild(item);
  });

  // ── theme switcher ───────────────────────────────────────────────
  const THEMES = ['cosmos', 'paper', 'blueprint'];
  let currentTheme = localStorage.getItem('tapestry-theme') || 'cosmos';
  function applyTheme(t) {
    currentTheme = t;
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('tapestry-theme', t);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === t);
    });
    // Swap background canvas mode
    if (window.__bgSetTheme) window.__bgSetTheme(t);
  }
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      if (typeof Sound !== 'undefined' && Sound.started) Sound.hover(2);
    });
  });
  applyTheme(currentTheme);

  // ── 10. intro + sound ───────────────────────────────────────────
  const muteBtn = document.getElementById('muteBtn');
  introBtn.addEventListener('click', () => {
    intro.classList.add('hidden');
    if (typeof Sound !== 'undefined') Sound.init();
  });
  resetBtn.addEventListener('click', resetCam);
  helpBtn.addEventListener('click', () => { intro.classList.remove('hidden'); });
  muteBtn.addEventListener('click', () => {
    if (typeof Sound === 'undefined' || !Sound.started) {
      if (typeof Sound !== 'undefined') Sound.init();
      muteBtn.textContent = '♪ on';
      return;
    }
    const m = Sound.toggleMute();
    muteBtn.textContent = m ? '♪ off' : '♪ on';
  });

  window.addEventListener('resize', applyCam);
  applyCam();

  // keyboard: escape closes panel, r resets camera, m mutes
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.classList.remove('open');
      if (typeof Sound !== 'undefined') Sound.closePanel();
      if (activeSim) { activeSim.stop(); activeSim = null; }
    }
    if (e.key === 'r' || e.key === 'R') resetCam();
    if (e.key === 'm' || e.key === 'M') {
      if (typeof Sound !== 'undefined' && Sound.started) {
        const m = Sound.toggleMute();
        muteBtn.textContent = m ? '♪ off' : '♪ on';
      }
    }
  });
})();
