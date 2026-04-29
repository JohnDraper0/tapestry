// Theme-aware animated background canvas.
//   cosmos    — drifting nebulae + twinkling stars + shooting stars
//   paper     — soft parchment grain with faint vignette
//   blueprint — pale engineering grid with drifting compass marks

(function () {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  let theme = 'cosmos';
  let stars = [], nebulae = [], shooters = [], dust = [];
  // Honour prefers-reduced-motion: paint a single still frame instead of looping.
  const reduceMotionMQ = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  let reduceMotion = reduceMotionMQ.matches;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initCosmos() {
    stars = [];
    for (let i = 0; i < 520; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.1
          ? `hsl(${200 + Math.random() * 60}, 70%, 80%)`
          : 'rgba(255,255,255,1)',
      });
    }
    nebulae = [];
    const palette = [
      'rgba(120,  80, 200, 0.18)',
      'rgba( 40,  80, 180, 0.14)',
      'rgba(220,  60, 140, 0.12)',
      'rgba(100, 255, 220, 0.08)',
      'rgba(255, 140,  60, 0.10)',
    ];
    for (let i = 0; i < 7; i++) {
      nebulae.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 280 + Math.random() * 400,
        c: palette[i % palette.length],
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
      });
    }
    dust = [];
    for (let i = 0; i < 40; i++) {
      dust.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 0.6 + Math.random() * 1.4,
        a: 0.05 + Math.random() * 0.1,
      });
    }
  }

  function maybeShooter() {
    if (Math.random() < 0.003 && shooters.length < 2) {
      shooters.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.6,
        vx: 4 + Math.random() * 4,
        vy: 1 + Math.random() * 2,
        life: 1,
      });
    }
  }

  // Theme renderers ───────────────────────────────────────────────
  function drawCosmos() {
    ctx.fillStyle = 'rgba(5, 7, 15, 0.28)';
    ctx.fillRect(0, 0, W, H);

    nebulae.forEach(n => {
      n.phase += 0.004;
      const rr = n.r * (0.92 + 0.08 * Math.sin(n.phase));
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr);
      g.addColorStop(0, n.c);
      g.addColorStop(1, 'rgba(5, 7, 15, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      n.x += n.vx; n.y += n.vy;
      if (n.x < -rr)      n.x = W + rr;
      if (n.x > W + rr)   n.x = -rr;
      if (n.y < -rr)      n.y = H + rr;
      if (n.y > H + rr)   n.y = -rr;
    });

    dust.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.fillStyle = `rgba(180, 200, 255, ${d.a})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });

    stars.forEach(s => {
      s.tw += 0.015 + s.z * 0.03;
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(s.tw));
      const size = 0.3 + s.z * 1.6;
      const alpha = twinkle * (0.35 + s.z * 0.65);
      if (typeof s.hue === 'string' && s.hue.startsWith('hsl')) {
        ctx.fillStyle = s.hue.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
      ctx.fill();
      if (s.z > 0.85 && twinkle > 0.85) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x - 4, s.y); ctx.lineTo(s.x + 4, s.y);
        ctx.moveTo(s.x, s.y - 4); ctx.lineTo(s.x, s.y + 4);
        ctx.stroke();
      }
    });

    maybeShooter();
    shooters = shooters.filter(s => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${s.life * 0.85})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
      ctx.stroke();
      s.x += s.vx; s.y += s.vy;
      s.life -= 0.012;
      return s.life > 0 && s.x < W + 50 && s.y < H + 50;
    });
  }

  function drawPaper() {
    // parchment wash with noise grain
    ctx.fillStyle = 'rgba(243, 234, 216, 1)';
    ctx.fillRect(0, 0, W, H);
    // sepia vignette
    const g = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.2, W/2, H/2, Math.max(W,H)*0.75);
    g.addColorStop(0, 'rgba(120, 80, 30, 0)');
    g.addColorStop(1, 'rgba(120, 80, 30, 0.15)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // noise grain
    const grain = 3000;
    ctx.fillStyle = 'rgba(80, 50, 20, 0.05)';
    for (let i = 0; i < grain; i++) {
      ctx.fillRect(Math.random()*W, Math.random()*H, 1, 1);
    }
  }

  let bpPhase = 0;
  function drawBlueprint() {
    bpPhase += 0.002;
    ctx.fillStyle = 'rgba(7, 24, 51, 1)';
    ctx.fillRect(0, 0, W, H);
    // major + minor grid
    ctx.strokeStyle = 'rgba(160, 220, 255, 0.07)';
    ctx.lineWidth = 1;
    const minor = 40;
    for (let x = 0; x < W; x += minor) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += minor) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(160, 220, 255, 0.14)';
    const major = 200;
    for (let x = 0; x < W; x += major) {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += major) {
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }
    // drifting compass rose
    const cx = W * 0.18 + Math.sin(bpPhase) * 30;
    const cy = H * 0.78;
    ctx.strokeStyle = 'rgba(160, 220, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + bpPhase;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40);
      ctx.lineTo(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60);
      ctx.stroke();
    }
  }

  function drawTheme() {
    if      (theme === 'cosmos')    drawCosmos();
    else if (theme === 'paper')     drawPaper();
    else if (theme === 'blueprint') drawBlueprint();
  }
  function paintStill() {
    // Cosmos fades the canvas with a 28%-black overlay each frame, so a single
    // call would look washed out. Lay down opaque space first, then draw.
    if (theme === 'cosmos') {
      ctx.fillStyle = 'rgb(5, 7, 15)';
      ctx.fillRect(0, 0, W, H);
    }
    drawTheme();
  }
  function frame() {
    drawTheme();
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  window.__bgSetTheme = function (t) {
    theme = t;
    if (theme === 'cosmos') initCosmos();
    if (reduceMotion) paintStill();
  };

  window.addEventListener('resize', () => {
    resize();
    initCosmos();
    if (reduceMotion) paintStill();
  });
  // React to live changes of the user's motion preference.
  if (reduceMotionMQ.addEventListener) {
    reduceMotionMQ.addEventListener('change', e => {
      const wasReduced = reduceMotion;
      reduceMotion = e.matches;
      if (wasReduced && !reduceMotion) frame();         // resume looping
      else if (!wasReduced && reduceMotion) paintStill(); // settle on a still frame
    });
  }

  resize();
  initCosmos();
  if (reduceMotion) paintStill();
  else frame();
})();
