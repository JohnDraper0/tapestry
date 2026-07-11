// Interactive canvas simulations for each law.
// Each factory returns { stop } and starts its own animation loop.

const SIMS = {};

function fit(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.floor(rect.width  * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

// ─────────────────────────── PYTHAGORAS ──────────────────────────────
SIMS.pythagoras = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let a = 100, b = 70;
  let dragging = null;

  const origin = () => ({ x: w * 0.4, y: h * 0.72 });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const o = origin();
    const A = { x: o.x + a, y: o.y };
    const B = { x: o.x, y: o.y - b };

    // squares
    ctx.fillStyle = 'rgba(255, 183, 77, 0.25)';
    ctx.fillRect(o.x, o.y, a, a);
    ctx.fillStyle = 'rgba(100, 255, 218, 0.25)';
    ctx.fillRect(o.x - b, o.y - b, b, b);

    // hypotenuse square (tilted)
    const dx = A.x - B.x, dy = A.y - B.y;
    const c = Math.hypot(dx, dy);
    const ux = dx / c, uy = dy / c;
    const px = -uy, py = ux;
    ctx.fillStyle = 'rgba(233, 30, 99, 0.25)';
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(B.x + px * c, B.y + py * c);
    ctx.lineTo(A.x + px * c, A.y + py * c);
    ctx.closePath();
    ctx.fill();

    // triangle
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.closePath();
    ctx.stroke();

    // handles
    [['a', A, '#ffb74d'], ['b', B, '#64ffda']].forEach(([, p, c]) => {
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
    });

    // labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px system-ui';
    ctx.fillText(`a² = ${(a * a).toFixed(0)}`, o.x + a / 2 - 24, o.y + a / 2);
    ctx.fillText(`b² = ${(b * b).toFixed(0)}`, o.x - b - 6, o.y - b / 2);
    ctx.fillText(`c² = ${(c * c).toFixed(0)}`, (A.x + B.x) / 2 + 12, (A.y + B.y) / 2 - 6);

    ctx.font = '16px system-ui';
    ctx.fillStyle = '#e91e63';
    ctx.fillText(`${(a * a).toFixed(0)} + ${(b * b).toFixed(0)} = ${(a * a + b * b).toFixed(0)}`,
      20, h - 20);
  }

  function pick(ev) {
    const r = canvas.getBoundingClientRect();
    const mx = ev.clientX - r.left, my = ev.clientY - r.top;
    const o = origin();
    if (Math.hypot(mx - (o.x + a), my - o.y) < 12) return 'a';
    if (Math.hypot(mx - o.x, my - (o.y - b)) < 12) return 'b';
    return null;
  }
  const down = (e) => { dragging = pick(e); };
  const move = (e) => {
    if (!dragging) return;
    const r = canvas.getBoundingClientRect();
    const o = origin();
    if (dragging === 'a') a = Math.max(20, Math.min(w * 0.5, e.clientX - r.left - o.x));
    else b = Math.max(20, Math.min(h * 0.6, o.y - (e.clientY - r.top)));
    draw();
  };
  const up = () => { dragging = null; };
  canvas.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);

  draw();
  return {
    stop() {
      canvas.removeEventListener('mousedown', down);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    }
  };
};

// ─────────────────────────── CALCULUS ────────────────────────────────
SIMS.calculus = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let t = 0, raf;
  const f  = (x) => 0.4 * Math.sin(x * 0.05) * 60 + 0.002 * x * x;
  const fp = (x) => 0.4 * Math.cos(x * 0.05) * 60 * 0.05 + 0.004 * x;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cy = h * 0.55;

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // curve
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = cy - f(x - w / 2);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // moving tangent
    const cx = w / 2 + Math.sin(t) * w * 0.35;
    const x0 = cx - w / 2;
    const y0 = cy - f(x0);
    const slope = fp(x0);

    ctx.strokeStyle = '#ffb74d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 120, y0 + slope * 120);
    ctx.lineTo(cx + 120, y0 - slope * 120);
    ctx.stroke();

    ctx.fillStyle = '#e91e63';
    ctx.beginPath(); ctx.arc(cx, y0, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '14px system-ui';
    ctx.fillText(`slope (derivative) = ${(-slope).toFixed(2)}`, 20, 26);
    ctx.fillText(`the tangent kisses the curve at one point`, 20, h - 20);

    t += 0.01;
    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── LEAST ACTION / BRACHISTOCHRONE ──────────
SIMS.action = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const A = { x: w * 0.15, y: h * 0.2 };
  const B = { x: w * 0.85, y: h * 0.85 };
  const g = 600;

  // three paths: straight, cycloid-ish, arc
  const N = 120;
  function straight(t) { return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t }; }
  function cycloid(t) {
    // brachistochrone-ish
    const theta = t * Math.PI;
    const r = (B.y - A.y) / 2;
    return { x: A.x + (B.x - A.x) * (theta - Math.sin(theta)) / Math.PI,
             y: A.y + r * (1 - Math.cos(theta)) };
  }
  function arc(t) {
    const cx = (A.x + B.x) / 2, cy = A.y + (B.y - A.y) * 1.4;
    const r  = Math.hypot(A.x - cx, A.y - cy);
    const a0 = Math.atan2(A.y - cy, A.x - cx);
    const a1 = Math.atan2(B.y - cy, B.x - cx);
    const ang = a0 + (a1 - a0) * t;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  }
  const paths = [
    { name: 'straight', fn: straight, color: '#ffb74d' },
    { name: 'arc',      fn: arc,      color: '#4facfe' },
    { name: 'cycloid',  fn: cycloid,  color: '#e91e63' },
  ];

  // precompute arrival times (race beads rolling under gravity along each path)
  paths.forEach((p) => {
    let t = 0, v = 0, time = 0;
    const pts = [];
    for (let i = 0; i <= N; i++) pts.push(p.fn(i / N));
    p.pts = pts;
    p.times = [0];
    for (let i = 1; i <= N; i++) {
      const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
      const ds = Math.hypot(dx, dy);
      const h2 = pts[i].y - A.y;
      const v2 = Math.sqrt(Math.max(0, 2 * g * h2));
      const vAvg = 0.5 * (v + v2) || 1;
      time += ds / vAvg;
      v = v2;
      p.times.push(time);
    }
    p.total = time;
  });
  const maxT = Math.max(...paths.map(p => p.total));

  let t0 = performance.now(), raf;
  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    const elapsed = ((now - t0) / 1000) % (maxT * 1.3);

    paths.forEach((p) => {
      ctx.strokeStyle = p.color + '66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      p.pts.forEach((pt, i) => i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y));
      ctx.stroke();

      // bead position
      let idx = 0;
      while (idx < N && p.times[idx] < elapsed) idx++;
      const pt = p.pts[Math.min(idx, N)];
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('3 beads, 3 paths, same start & finish', 20, 26);
    ctx.fillStyle = '#e91e63';
    ctx.fillText('pink (cycloid) always wins — that\'s "least action"', 20, 46);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── COLLISION / CONSERVATION ────────────────
SIMS.collision = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const balls = [
    { x: w * 0.25, y: h * 0.5, vx:  120, vy: 0, r: 22, m: 2, c: '#ffb74d' },
    { x: w * 0.75, y: h * 0.5, vx: -60,  vy: 0, r: 16, m: 1, c: '#4facfe' },
  ];
  let last = performance.now(), raf;

  function step(dt) {
    balls.forEach(b => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx; }
      if (b.x + b.r > w) { b.x = w - b.r; b.vx = -b.vx; }
      if (b.y - b.r < 0) { b.y = b.r; b.vy = -b.vy; }
      if (b.y + b.r > h) { b.y = h - b.r; b.vy = -b.vy; }
    });
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], b = balls[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d  = Math.hypot(dx, dy);
        if (d < a.r + b.r && d > 0) {
          const nx = dx / d, ny = dy / d;
          const p = 2 * ((a.vx - b.vx) * nx + (a.vy - b.vy) * ny) / (a.m + b.m);
          a.vx -= p * b.m * nx; a.vy -= p * b.m * ny;
          b.vx += p * a.m * nx; b.vy += p * a.m * ny;
          const overlap = a.r + b.r - d;
          a.x -= nx * overlap / 2; a.y -= ny * overlap / 2;
          b.x += nx * overlap / 2; b.y += ny * overlap / 2;
        }
      }
    }
  }

  function draw(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, w, h);
    balls.forEach(b => {
      ctx.fillStyle = b.c;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    });
    const p = balls.reduce((s, b) => s + b.m * b.vx, 0);
    const E = balls.reduce((s, b) => s + 0.5 * b.m * (b.vx * b.vx + b.vy * b.vy), 0);
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText(`total momentum (p): ${p.toFixed(0)} — unchanging`,  20, 22);
    ctx.fillText(`total energy (E):   ${E.toFixed(0)} — unchanging`,  20, 42);
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── NEWTON: F = ma ──────────────────────────
SIMS.newton = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const box = { x: w / 2, y: h / 2, vx: 0, vy: 0, m: 1, size: 30 };
  let force = { x: 0, y: 0 };
  let raf, last = performance.now();

  const keys = {};
  const kd = (e) => { keys[e.key] = true; };
  const ku = (e) => { keys[e.key] = false; };
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);

  function step(dt) {
    force = { x: 0, y: 0 };
    if (keys.ArrowLeft)  force.x -= 200;
    if (keys.ArrowRight) force.x += 200;
    if (keys.ArrowUp)    force.y -= 200;
    if (keys.ArrowDown)  force.y += 200;
    box.vx += (force.x / box.m) * dt;
    box.vy += (force.y / box.m) * dt;
    box.vx *= 0.995; box.vy *= 0.995;
    box.x += box.vx * dt;
    box.y += box.vy * dt;
    if (box.x < 0) { box.x = 0; box.vx = -box.vx * 0.6; }
    if (box.y < 0) { box.y = 0; box.vy = -box.vy * 0.6; }
    if (box.x > w) { box.x = w; box.vx = -box.vx * 0.6; }
    if (box.y > h) { box.y = h; box.vy = -box.vy * 0.6; }
  }

  function draw(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#4facfe';
    ctx.fillRect(box.x - 15, box.y - 15, 30, 30);

    // velocity arrow
    ctx.strokeStyle = '#ffb74d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(box.x + box.vx * 0.15, box.y + box.vy * 0.15);
    ctx.stroke();

    // force arrow
    if (force.x || force.y) {
      ctx.strokeStyle = '#e91e63';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(box.x, box.y);
      ctx.lineTo(box.x + force.x * 0.1, box.y + force.y * 0.1);
      ctx.stroke();
    }

    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('arrow keys push the block — it coasts when you stop',  20, 22);
    ctx.fillStyle = '#ffb74d';
    ctx.fillText('orange: velocity (memory of past forces)',  20, 42);
    ctx.fillStyle = '#e91e63';
    ctx.fillText('pink: force you\'re applying right now',  20, 62);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return {
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    }
  };
};

// ─────────────────────────── ORBITS ──────────────────────────────────
SIMS.orbit = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const sun = { x: w / 2, y: h / 2, m: 3000 };
  const planets = [
    { x: w/2 + 80, y: h/2, vx: 0, vy: -180, r: 5, c: '#ffb74d', trail: [] },
    { x: w/2 + 140, y: h/2, vx: 0, vy: -135, r: 7, c: '#4facfe', trail: [] },
    { x: w/2 + 200, y: h/2, vx: 0, vy: -115, r: 9, c: '#e91e63', trail: [] },
  ];
  let raf, last = performance.now();

  function step(dt) {
    planets.forEach(p => {
      const dx = sun.x - p.x, dy = sun.y - p.y;
      const r2 = dx * dx + dy * dy;
      const r  = Math.sqrt(r2);
      const a  = sun.m / r2;
      p.vx += (dx / r) * a * dt * 60;
      p.vy += (dy / r) * a * dt * 60;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 240) p.trail.shift();
    });
  }
  function draw(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, w, h);

    // sun
    const g = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, 40);
    g.addColorStop(0, '#fff4a3');
    g.addColorStop(1, 'rgba(255,200,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(sun.x, sun.y, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff176';
    ctx.beginPath(); ctx.arc(sun.x, sun.y, 12, 0, Math.PI * 2); ctx.fill();

    // planets + trails
    planets.forEach(p => {
      ctx.strokeStyle = p.c + '55';
      ctx.lineWidth = 1;
      ctx.beginPath();
      p.trail.forEach((pt, i) => i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y));
      ctx.stroke();
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('3 planets, one gravity rule — F = Gm₁m₂/r²', 20, 22);
    ctx.fillText('inner planets orbit faster (Kepler\'s 3rd law)', 20, 42);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── ENTROPY (GAS MIXING) ────────────────────
SIMS.entropy = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const N = 120;
  const parts = [];
  for (let i = 0; i < N; i++) {
    const left = i < N / 2;
    parts.push({
      x: left ? Math.random() * w * 0.45 : w * 0.55 + Math.random() * w * 0.45,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 120,
      vy: (Math.random() - 0.5) * 120,
      c: left ? '#ffb74d' : '#4facfe',
    });
  }
  let divider = true, raf, last = performance.now();
  setTimeout(() => { divider = false; }, 1500);

  function step(dt) {
    parts.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (divider) {
        if (p.c === '#ffb74d' && p.x > w * 0.48) { p.x = w * 0.48; p.vx = -p.vx; }
        if (p.c === '#4facfe' && p.x < w * 0.52) { p.x = w * 0.52; p.vx = -p.vx; }
      }
      if (p.x < 3)     { p.x = 3;     p.vx = -p.vx; }
      if (p.x > w - 3) { p.x = w - 3; p.vx = -p.vx; }
      if (p.y < 3)     { p.y = 3;     p.vy = -p.vy; }
      if (p.y > h - 3) { p.y = h - 3; p.vy = -p.vy; }
    });
  }
  function draw(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, w, h);
    parts.forEach(p => {
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    });
    if (divider) {
      ctx.strokeStyle = '#fff';
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
      ctx.setLineDash([]);
    }
    // entropy estimate: how mixed?
    let left0 = 0, left1 = 0;
    parts.forEach(p => {
      if (p.x < w / 2) { if (p.c === '#ffb74d') left0++; else left1++; }
    });
    const total = left0 + left1 || 1;
    const p0 = left0 / total, p1 = left1 / total;
    const S = -((p0 > 0 ? p0 * Math.log2(p0) : 0) + (p1 > 0 ? p1 * Math.log2(p1) : 0));
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('divider vanishes → particles mix, never unmix',  20, 22);
    ctx.fillText(`entropy of left half: ${S.toFixed(3)} bits (rises toward 1)`, 20, 42);
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── EM WAVE ─────────────────────────────────
SIMS.wave = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let t = 0, raf;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cy = h / 2;
    // E field (sin)
    ctx.strokeStyle = '#ffb74d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = cy - Math.sin((x - t) * 0.03) * 60;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // B field (cos, perpendicular — we draw as dashed mirror)
    ctx.strokeStyle = '#4facfe';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = cy + Math.cos((x - t) * 0.03) * 60;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('orange: electric field    blue: magnetic field', 20, 22);
    ctx.fillText('they drag each other along at c — that\'s light', 20, 42);
    t += 2;
    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── LIGHT CLOCK (TIME DILATION) ─────────────
SIMS.lightclock = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let v = 0.0, raf;
  let clockX = 40, photonY = 20, dir = 1;
  const height = 120;
  const clockTop = h / 2 - height / 2;
  const clockBot = h / 2 + height / 2;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // oscillate velocity 0 → 0.9c slowly
    v = 0.45 + 0.45 * Math.sin(performance.now() / 3000);
    const gamma = 1 / Math.sqrt(1 - v * v);

    // move clock across screen
    clockX += v * 2;
    if (clockX > w - 40) clockX = 40;

    // photon bounces — but time dilation makes period gamma× longer for observer
    const speed = 2.5 / gamma;
    photonY += dir * speed;
    if (photonY > height) { photonY = height; dir = -1; }
    if (photonY < 0)      { photonY = 0;      dir =  1; }

    // clock walls
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.strokeRect(clockX, clockTop, 40, height);

    // photon
    ctx.fillStyle = '#ffb74d';
    ctx.beginPath();
    ctx.arc(clockX + 20, clockTop + photonY, 6, 0, Math.PI * 2);
    ctx.fill();

    // diagonal path (as seen by stationary observer)
    ctx.strokeStyle = 'rgba(255,183,77,0.35)';
    ctx.beginPath();
    ctx.moveTo(clockX + 20 - v * 60, clockTop);
    ctx.lineTo(clockX + 20, clockTop + height);
    ctx.lineTo(clockX + 20 + v * 60, clockTop);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText(`clock speed:   v = ${v.toFixed(2)} c`, 20, 22);
    ctx.fillText(`time slowdown: γ = ${gamma.toFixed(2)}× (moving clocks run slow)`, 20, 42);

    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── SPACETIME SHEET ─────────────────────────
SIMS.spacetime = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf, t = 0;
  const masses = [
    { x: w * 0.35, y: h * 0.5, m: 50 },
    { x: w * 0.7,  y: h * 0.55, m: 30 },
  ];
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 1;
    const N = 22;
    for (let i = 0; i <= N; i++) {
      ctx.beginPath();
      const y0 = (i / N) * h;
      for (let x = 0; x <= w; x += 6) {
        let dy = 0;
        masses.forEach(m => {
          const dx = x - m.x, d = Math.hypot(dx, y0 - m.y);
          dy += m.m * 600 / (d * d + 400);
        });
        if (x === 0) ctx.moveTo(x, y0 + dy); else ctx.lineTo(x, y0 + dy);
      }
      ctx.stroke();
    }
    for (let j = 0; j <= N; j++) {
      ctx.beginPath();
      const x0 = (j / N) * w;
      for (let y = 0; y <= h; y += 6) {
        let dy = 0;
        masses.forEach(m => {
          const dx = x0 - m.x, d = Math.hypot(dx, y - m.y);
          dy += m.m * 600 / (d * d + 400);
        });
        if (y === 0) ctx.moveTo(x0, y + dy); else ctx.lineTo(x0, y + dy);
      }
      ctx.stroke();
    }
    masses.forEach(m => {
      ctx.fillStyle = '#ffb74d';
      ctx.beginPath(); ctx.arc(m.x, m.y + 30, 8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('mass bends spacetime — light and planets just follow the curves', 20, 22);
    // drift
    masses[1].x = w * 0.7 + Math.sin(t) * 40;
    t += 0.01;
    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── DOUBLE SLIT ─────────────────────────────
SIMS.doubleslit = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const screenX = w - 40;
  const slitX   = w * 0.35;
  const slit1   = { x: slitX, y: h * 0.42 };
  const slit2   = { x: slitX, y: h * 0.58 };
  const lambda  = 18;
  const hits = new Array(Math.floor(h)).fill(0);
  let raf, frame = 0;

  function intensity(y) {
    const r1 = Math.hypot(screenX - slit1.x, y - slit1.y);
    const r2 = Math.hypot(screenX - slit2.x, y - slit2.y);
    const dr = r1 - r2;
    return Math.cos((dr / lambda) * Math.PI) ** 2;
  }

  function draw() {
    frame++;
    // waves
    ctx.fillStyle = 'rgba(10, 14, 30, 0.25)';
    ctx.fillRect(0, 0, w, h);

    // source
    ctx.fillStyle = '#ffb74d';
    ctx.beginPath(); ctx.arc(40, h / 2, 6, 0, Math.PI * 2); ctx.fill();

    // wavefronts: two sources from the slits
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.35)';
    for (let k = 0; k < 10; k++) {
      const r = (frame * 2 + k * 30) % 400;
      ctx.beginPath(); ctx.arc(slit1.x, slit1.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(slit2.x, slit2.y, r, 0, Math.PI * 2); ctx.stroke();
    }

    // barrier
    ctx.fillStyle = '#222';
    ctx.fillRect(slitX - 4, 0, 8, slit1.y - 10);
    ctx.fillRect(slitX - 4, slit1.y + 10, 8, slit2.y - slit1.y - 20);
    ctx.fillRect(slitX - 4, slit2.y + 10, 8, h - slit2.y - 10);

    // accumulating hits on screen
    for (let i = 0; i < 3; i++) {
      const y = Math.floor(Math.random() * h);
      if (Math.random() < intensity(y)) hits[y]++;
    }
    const max = Math.max(...hits, 1);
    for (let y = 0; y < h; y++) {
      const a = Math.min(1, hits[y] / max);
      ctx.fillStyle = `rgba(255, 183, 77, ${a})`;
      ctx.fillRect(screenX, y, 30, 1);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('single particles pass through both slits at once…', 20, 22);
    ctx.fillText('and pile up into an interference pattern', 20, 42);

    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── EVOLUTION ────────────────────────────────
SIMS.evolution = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  // A target color that creatures "adapt to"
  const target = { r: 80, g: 220, b: 120 };
  const pop = [];
  for (let i = 0; i < 80; i++) {
    pop.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    });
  }
  let gen = 0, raf, tick = 0;

  function fitness(c) {
    const d = Math.hypot(c.r - target.r, c.g - target.g, c.b - target.b);
    return 1 / (1 + d / 30);
  }
  function nextGen() {
    pop.sort((a, b) => fitness(b) - fitness(a));
    const parents = pop.slice(0, 20);
    for (let i = 20; i < pop.length; i++) {
      const p = parents[Math.floor(Math.random() * parents.length)];
      pop[i].r = Math.max(0, Math.min(255, p.r + (Math.random() - 0.5) * 40));
      pop[i].g = Math.max(0, Math.min(255, p.g + (Math.random() - 0.5) * 40));
      pop[i].b = Math.max(0, Math.min(255, p.b + (Math.random() - 0.5) * 40));
      pop[i].x = Math.random() * w;
      pop[i].y = Math.random() * h;
    }
    gen++;
  }

  function draw() {
    tick++;
    if (tick % 60 === 0) nextGen();
    ctx.clearRect(0, 0, w, h);
    // target swatch
    ctx.fillStyle = `rgb(${target.r},${target.g},${target.b})`;
    ctx.fillRect(w - 60, 20, 40, 40);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(w - 60, 20, 40, 40);

    pop.forEach(c => {
      ctx.fillStyle = `rgb(${c.r|0},${c.g|0},${c.b|0})`;
      ctx.beginPath(); ctx.arc(c.x, c.y, 8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText(`generation: ${gen}`, 20, 22);
    ctx.fillText('fittest colours breed; their kids mutate; repeat', 20, 42);
    ctx.fillText('the population drifts toward the target →', 20, 62);

    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── GAME OF LIFE ─────────────────────────────
SIMS.life = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const cell = 6;
  const cols = Math.floor(w / cell);
  const rows = Math.floor(h / cell);
  let grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(Math.random() < 0.25 ? 1 : 0);
    grid.push(row);
  }
  let raf, tick = 0;
  function step() {
    const next = grid.map(r => r.slice());
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (!dr && !dc) continue;
            const rr = (r + dr + rows) % rows;
            const cc = (c + dc + cols) % cols;
            n += grid[rr][cc];
          }
        if (grid[r][c] && (n < 2 || n > 3)) next[r][c] = 0;
        else if (!grid[r][c] && n === 3) next[r][c] = 1;
      }
    }
    grid = next;
  }
  function draw() {
    tick++;
    if (tick % 4 === 0) step();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#64ffda';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
      }
    }
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText("Conway's Game of Life — 4 rules, infinite complexity", 20, 22);
    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── EXPANDING UNIVERSE ──────────────────────
SIMS.expansion = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const N = 60;
  const gal = [];
  for (let i = 0; i < N; i++) {
    gal.push({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      r: 1 + Math.random() * 3,
    });
  }
  let scale = 1, raf;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    gal.forEach(g => {
      const x = w / 2 + g.x * scale;
      const y = h / 2 + g.y * scale;
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.arc(x, y, g.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    scale *= 1.004;
    if (scale > 3.2) scale = 1;
    ctx.fillStyle = '#fff';
    ctx.font = '13px system-ui';
    ctx.fillText('every galaxy moves away from every other — space itself expands', 20, 22);
    ctx.fillText('the farther they are, the faster they recede (Hubble\'s law)', 20, 42);
    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────── LOTKA–VOLTERRA ──────────────────────────────
SIMS.lotka_volterra = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  // α prey birth-rate, β predation rate, δ conversion efficiency, γ predator death-rate
  // Coexistence equilibrium: x* = γ/δ = 10,  y* = α/β = 8
  // Period ≈ 2π / √(αγ) ≈ 9.9 model-units; at dt=0.05/frame @60fps ≈ 3.3 s/cycle
  const α = 0.8, β = 0.1, δ = 0.05, γ = 0.5;
  let x = 15, y = 4;   // prey, predator — off-equilibrium start

  const HIST = 380;
  const hist = [];
  let raf;

  function rk4() {
    const dt = 0.05;
    const dx = (px, py) => α * px - β * px * py;
    const dy = (px, py) => δ * px * py - γ * py;
    const k1x = dx(x, y),                           k1y = dy(x, y);
    const k2x = dx(x+dt/2*k1x, y+dt/2*k1y),        k2y = dy(x+dt/2*k1x, y+dt/2*k1y);
    const k3x = dx(x+dt/2*k2x, y+dt/2*k2y),        k3y = dy(x+dt/2*k2x, y+dt/2*k2y);
    const k4x = dx(x+dt*k3x,   y+dt*k3y),           k4y = dy(x+dt*k3x,   y+dt*k3y);
    x = Math.max(0.01, x + dt/6 * (k1x + 2*k2x + 2*k3x + k4x));
    y = Math.max(0.01, y + dt/6 * (k1y + 2*k2y + 2*k3y + k4y));
  }

  function draw() {
    rk4();
    hist.push({ x, y });
    if (hist.length > HIST) hist.shift();
    ctx.clearRect(0, 0, w, h);

    // ── TOP 55%: time-series ────────────────────────────────────────────
    const SPLIT = Math.floor(h * 0.55);
    const maxPop = 30;

    ctx.lineWidth = 1.5;
    [['#8bc34a', 'x'], ['#ef5350', 'y']].forEach(([col, key]) => {
      ctx.strokeStyle = col;
      ctx.beginPath();
      hist.forEach((p, i) => {
        const px = (i / HIST) * w;
        const py = SPLIT - 6 - Math.max(0, Math.min(1, p[key] / maxPop)) * (SPLIT - 16);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
    });

    ctx.font = '12px system-ui';
    ctx.fillStyle = '#8bc34a'; ctx.fillText(`prey  ${x.toFixed(1)}`, 10, 16);
    ctx.fillStyle = '#ef5350'; ctx.fillText(`predators  ${y.toFixed(1)}`, 10, 32);
    ctx.fillStyle = 'rgba(180,180,180,0.55)'; ctx.font = '10px system-ui';
    ctx.fillText('prey peak leads predator peak by a quarter-cycle', 10, 50);

    // divider
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(0, SPLIT + 2); ctx.lineTo(w, SPLIT + 2); ctx.stroke();
    ctx.setLineDash([]);

    // ── BOTTOM 45%: phase portrait ──────────────────────────────────────
    const pHh = h - SPLIT - 20;
    const pX0 = 42, pY0 = SPLIT + 8;
    const pW  = w - pX0 - 16;
    const maxX = 30, maxY = 22;

    const ppX = v => pX0 + Math.max(0, Math.min(1, v / maxX)) * pW;
    const ppY = v => pY0 + pHh - Math.max(0, Math.min(1, v / maxY)) * pHh;

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pX0, pY0); ctx.lineTo(pX0, pY0 + pHh);
    ctx.moveTo(pX0, pY0 + pHh); ctx.lineTo(pX0 + pW, pY0 + pHh);
    ctx.stroke();

    // orbit trail
    if (hist.length > 2) {
      ctx.strokeStyle = 'rgba(100, 190, 255, 0.5)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      hist.forEach((p, i) =>
        i === 0 ? ctx.moveTo(ppX(p.x), ppY(p.y)) : ctx.lineTo(ppX(p.x), ppY(p.y))
      );
      ctx.stroke();
    }

    // equilibrium crosshair
    const eqX = ppX(γ / δ), eqY = ppY(α / β);
    ctx.strokeStyle = 'rgba(255,210,80,0.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(eqX - 6, eqY); ctx.lineTo(eqX + 6, eqY);
    ctx.moveTo(eqX, eqY - 6); ctx.lineTo(eqX, eqY + 6);
    ctx.stroke();

    // current-state dot
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ppX(x), ppY(y), 4, 0, Math.PI * 2); ctx.fill();

    // axis labels
    ctx.fillStyle = 'rgba(160,160,160,0.65)'; ctx.font = '10px system-ui';
    ctx.fillText('prey →', pX0 + pW - 44, pY0 + pHh + 14);
    ctx.fillText('pred ↑', 2, pY0 + 10);
    ctx.fillStyle = 'rgba(255,210,80,0.8)';
    ctx.fillText('equilibrium', eqX + 8, eqY - 4);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── IDEAL GAS ───────────────────────────────
SIMS.ideal_gas = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const N = 80, R = 4;
  const mg = 38;
  const bL = mg, bR = w - mg, bT = mg + 26, bB = h - mg;
  const bW = bR - bL, bH = bB - bT;

  // Box-Muller: velocity components drawn from N(0, √T)
  function mbVel(T) {
    const sig = Math.sqrt(T);
    const r1 = Math.max(Math.random(), 1e-9), r2 = Math.random();
    const a = Math.sqrt(-2 * Math.log(r1));
    return {
      vx: a * Math.cos(2 * Math.PI * r2) * sig,
      vy: a * Math.sin(2 * Math.PI * r2) * sig,
    };
  }

  const parts = Array.from({ length: N }, () => {
    const { vx, vy } = mbVel(80);
    return {
      x: bL + R + Math.random() * (bW - 2 * R),
      y: bT + R + Math.random() * (bH - 2 * R),
      vx, vy,
    };
  });

  let pAcc = 0, tAcc = 0, displayP = 0;
  let raf, last = performance.now();

  canvas.addEventListener('click', () => {
    // heat: multiply all speeds by √1.8 → T scales by 1.8
    const f = Math.sqrt(1.8);
    parts.forEach(p => { p.vx *= f; p.vy *= f; });
  });

  function getT() {
    return parts.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / (2 * N);
  }

  function step(dt) {
    tAcc += dt;
    parts.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < bL + R) { p.x = bL + R; pAcc += 2 * Math.abs(p.vx); p.vx =  Math.abs(p.vx); }
      if (p.x > bR - R) { p.x = bR - R; pAcc += 2 * Math.abs(p.vx); p.vx = -Math.abs(p.vx); }
      if (p.y < bT + R) { p.y = bT + R; pAcc += 2 * Math.abs(p.vy); p.vy =  Math.abs(p.vy); }
      if (p.y > bB - R) { p.y = bB - R; pAcc += 2 * Math.abs(p.vy); p.vy = -Math.abs(p.vy); }
    });
    if (tAcc > 0.3) {
      // pressure = total wall impulse / (time × perimeter)
      // kinetic theory gives P = NT/A, so PV/NT → 1
      displayP = pAcc / (tAcc * 2 * (bW + bH));
      pAcc = 0; tAcc = 0;
    }
  }

  function draw(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, w, h);

    // box
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(bL, bT, bW, bH);

    // particles: colour by speed (blue=slow, orange=fast)
    const T = getT();
    const vMax = Math.sqrt(6 * T + 1);
    parts.forEach(p => {
      const t = Math.min(Math.hypot(p.vx, p.vy) / vMax, 1);
      ctx.fillStyle = `rgb(${Math.round(70 + 185 * t)},${Math.round(185 - 105 * t)},${Math.round(255 - 220 * t)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill();
    });

    // HUD
    const PV = displayP * bW * bH;
    const NT = N * T;
    const ratio = NT > 0 ? (PV / NT).toFixed(2) : '—';
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '12px system-ui';
    ctx.fillText(`T = ${T.toFixed(0)}   P = ${displayP.toFixed(2)}   PV / NT = ${ratio}`, bL + 4, bT - 9);
    ctx.fillStyle = 'rgba(200,200,200,0.45)'; ctx.font = '11px system-ui';
    ctx.fillText('click to heat', bR - 76, bB + 16);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── FOURIER ──────────────────────────────
SIMS.fourier = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  // Square-wave: f(t) = (4/π) Σ_{k=0}^{N-1} sin((2k+1)ωt) / (2k+1)
  const N = 7;
  const harmonics = Array.from({ length: N }, (_, k) => ({
    n: 2 * k + 1,
    amp: (4 / Math.PI) / (2 * k + 1),
  }));

  const cx = w * 0.33;
  const cy = h * 0.50;
  const scale = h * 0.12;   // pixels per unit amplitude
  const omega = 1.5;        // rad/s

  const traceLeft = w * 0.56;
  const traceW    = w * 0.41;
  const maxPts    = 260;
  const pts       = [];     // rolling y-values
  let t = 0, raf;

  function draw() {
    t += 1 / 60;
    ctx.clearRect(0, 0, w, h);

    // ── phasor chain ──
    let px = cx, py = cy;
    harmonics.forEach(({ n, amp }, i) => {
      const r  = amp * scale;
      const θ  = n * omega * t;
      const nx = px + r * Math.cos(θ - Math.PI / 2);
      const ny = py + r * Math.sin(θ - Math.PI / 2);

      // orbit circle (faint)
      ctx.strokeStyle = `rgba(100, 210, 255, ${0.10 + 0.04 * (N - i)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.stroke();

      // spoke
      ctx.strokeStyle = `rgba(100, 210, 255, ${0.6 + 0.05 * (N - i)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();

      px = nx; py = ny;
    });

    // tip dot
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();

    // ── trace buffer ──
    pts.unshift(py);
    if (pts.length > maxPts) pts.pop();

    // dashed guide from tip to trace
    ctx.strokeStyle = 'rgba(255, 107, 107, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(traceLeft, pts[0]); ctx.stroke();
    ctx.setLineDash([]);

    // waveform
    if (pts.length > 1) {
      const step = traceW / maxPts;
      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      pts.forEach((y, i) => {
        const x = traceLeft + i * step;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // labels
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '11px system-ui';
    ctx.fillText(`${N} odd harmonics → square wave`, traceLeft + 2, h - 12);
    ctx.fillText('phasor chain', 6, h - 12);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ──────────────────────── GAME THEORY ───────────────────────────────
// Spatial prisoner's dilemma — Nowak & May, Nature 359:826 (1992).
// Each cell plays C or D against its 4 neighbours + self each generation.
// Cells copy the strategy of their highest-scoring neighbour.
// At b = 1.85 cooperators and defectors coexist in fractal-like clusters.
// 4-colour code: blue=stable C, red=stable D, yellow=newly C, green=newly D.
SIMS.gametheory = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const CELL = 6;
  const COLS = Math.floor(w / CELL);
  const ROWS = Math.floor(h / CELL);
  const N = COLS * ROWS;
  const B = 1.85; // temptation to defect — cooperators persist for 1 < b < 2

  let grid  = new Uint8Array(N); // 0 = cooperate, 1 = defect
  let next  = new Uint8Array(N);
  let scores = new Float32Array(N);
  let gen = 0, raf;

  const idx = (x, y) =>
    ((y + ROWS) % ROWS) * COLS + ((x + COLS) % COLS);

  const pay = (me, opp) =>
    me === 1 && opp === 0 ? B : (me === 0 && opp === 0 ? 1 : 0);

  function init() {
    grid.fill(0); next.fill(0);
    const cx = Math.floor(COLS / 2), cy = Math.floor(ROWS / 2);
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++)
        grid[idx(cx + dx, cy + dy)] = 1;
    gen = 0;
  }

  function reset() {
    for (let i = 0; i < N; i++) grid[i] = next[i] = Math.random() < 0.5 ? 1 : 0;
    gen = 0;
  }

  function step() {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const me = grid[y * COLS + x];
        scores[y * COLS + x] = pay(me, me)
          + pay(me, grid[idx(x-1, y)]) + pay(me, grid[idx(x+1, y)])
          + pay(me, grid[idx(x, y-1)]) + pay(me, grid[idx(x, y+1)]);
      }
    }
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let best = scores[y * COLS + x], strat = grid[y * COLS + x];
        for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
          const ni = idx(nx, ny);
          if (scores[ni] > best) { best = scores[ni]; strat = grid[ni]; }
        }
        next[y * COLS + x] = strat;
      }
    }
    const tmp = grid; grid = next; next = tmp; // grid=new, next=old (for 4-colour)
    gen++;
    if (gen > 350) reset();
  }

  function draw() {
    step();
    let nC = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x;
        const newS = grid[i], oldS = next[i];
        if (newS === 0) nC++;
        ctx.fillStyle = newS === 0
          ? (oldS === 0 ? '#4488ff' : '#ffcc00')   // stable-C=blue, newly-C=yellow
          : (oldS === 1 ? '#ff4444' : '#44cc44');  // stable-D=red,  newly-D=green
        ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
      }
    }
    // Status bar
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, h - 22, w, 22);
    ctx.fillStyle = '#fff'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`gen ${gen}   cooperators ${((nC/N)*100).toFixed(1)}%   (b = ${B})`, 6, h - 6);
    // Colour legend
    const LEG = [['#4488ff','C stable'],['#ffcc00','→ C'],['#ff4444','D stable'],['#44cc44','→ D']];
    let lx = 6;
    ctx.font = '10px system-ui';
    LEG.forEach(([col, label]) => {
      ctx.fillStyle = col; ctx.fillRect(lx, 6, 8, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(label, lx + 10, 15);
      lx += ctx.measureText(label).width + 22;
    });
    raf = requestAnimationFrame(draw);
  }

  init();
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── KEPLER ──────────────────────────────────
SIMS.kepler = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  // Orbit parameters — use an obvious eccentricity so Laws 1 & 2 are vivid
  const GM = 40000;
  const e  = 0.62;
  const a  = Math.min(w, h) * 0.30;
  const b  = a * Math.sqrt(1 - e * e);

  // Sun sits at right focus; centre of ellipse is to the left of sun
  const sunX = w * 0.52, sunY = h * 0.50;

  // Perihelion (closest point) is to the left of the sun
  const r_peri = a * (1 - e);
  const v_peri = Math.sqrt(GM * (1 + e) / r_peri);

  // State: planet starts at perihelion moving "up" (vy < 0 in canvas coords)
  let px = sunX - r_peri, py = sunY;
  let vx = 0, vy = -v_peri;

  // Period: T = 2π √(a³/GM)
  const T = 2 * Math.PI * Math.sqrt(a * a * a / GM);
  const SLICES = 6;
  const sliceDur = T / SLICES;
  const PALETTE = ['#ff6b6b50','#ffd93d50','#6bcb7750','#4d96ff50','#c77dff50','#ff9f4350'];

  let sliceTimer = 0, colorIdx = 0;
  let sliceStart = { x: px, y: py };
  let slicePath  = [];
  let done = [];   // completed sweep sectors
  let trail = [];
  let raf, last = performance.now();

  // Leapfrog integrator — conserves energy well
  function accel(x, y) {
    const dx = sunX - x, dy = sunY - y;
    const r3 = Math.pow(dx * dx + dy * dy, 1.5);
    return { ax: GM * dx / r3, ay: GM * dy / r3 };
  }

  const SUBSTEPS = 6;
  function step(realDt) {
    const dt = Math.min(realDt * 1.4, 0.05) / SUBSTEPS;
    for (let s = 0; s < SUBSTEPS; s++) {
      let { ax, ay } = accel(px, py);
      vx += ax * dt * 0.5; vy += ay * dt * 0.5;
      px += vx * dt;       py += vy * dt;
      ({ ax, ay } = accel(px, py));
      vx += ax * dt * 0.5; vy += ay * dt * 0.5;

      sliceTimer += dt;
      slicePath.push({ x: px, y: py });
      trail.push({ x: px, y: py });

      if (sliceTimer >= sliceDur) {
        done.push({ start: sliceStart, path: slicePath, col: PALETTE[colorIdx % SLICES] });
        if (done.length > SLICES * 2) done.shift();
        colorIdx++;
        sliceTimer = 0;
        sliceStart = { x: px, y: py };
        slicePath = [];
      }
    }
    if (trail.length > 800) trail = trail.slice(-800);
  }

  function fillSector(start, path, col) {
    if (path.length < 2) return;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(start.x, start.y);
    path.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
  }

  function draw(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    step(dt);

    ctx.clearRect(0, 0, w, h);

    // Faint ellipse guide
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.ellipse(sunX - a * e, sunY, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Sweep sectors
    done.forEach(s => fillSector(s.start, s.path, s.col));
    if (slicePath.length > 1) fillSector(sliceStart, slicePath, PALETTE[colorIdx % SLICES]);

    // Orbit trail
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    trail.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.stroke();

    // Sun
    const g = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 28);
    g.addColorStop(0, '#fff7b0'); g.addColorStop(1, 'rgba(255,210,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(sunX, sunY, 28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe04a';
    ctx.beginPath(); ctx.arc(sunX, sunY, 9, 0, Math.PI * 2); ctx.fill();

    // Planet
    ctx.shadowBlur = 10; ctx.shadowColor = '#82cfff';
    ctx.fillStyle = '#82cfff';
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Laws
    ctx.font = 'bold 12px system-ui'; ctx.fillStyle = '#eee';
    ctx.fillText('Kepler\'s Three Laws', 10, 20);
    ctx.font = '11px system-ui'; ctx.fillStyle = '#bbb';
    ctx.fillText('① Orbits are ellipses — Sun at one focus', 10, 38);
    ctx.fillText('② Each coloured slice = equal time → equal area', 10, 54);
    ctx.fillText('③ T ² ∝ a ³ — larger orbit, slower year', 10, 70);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────── MAXWELL–BOLTZMANN ───────────────────────────
SIMS.statmech = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  const N = 100, R = 3.5;

  // Box-Muller: velocity component from N(0, sqrt(T))
  function mbComp(T) {
    const r1 = Math.max(Math.random(), 1e-9), r2 = Math.random();
    return Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2) * Math.sqrt(T);
  }

  const SPLIT = Math.floor(h * 0.55);
  const mg = 8;
  const bL = mg, bR = w - mg, bTop = 24, bBot = SPLIT - 4;
  const bW = bR - bL, bH = bBot - bTop;

  const parts = Array.from({ length: N }, () => ({
    x: bL + R + Math.random() * (bW - 2 * R),
    y: bTop + R + Math.random() * (bH - 2 * R),
    vx: mbComp(80), vy: mbComp(80),
  }));

  let raf, last = performance.now();

  function getT() {
    return parts.reduce((s, p) => s + p.vx * p.vx + p.vy * p.vy, 0) / (2 * N);
  }

  // 2D Maxwell-Boltzmann PDF: f(v) = (v/T) exp(-v²/2T)
  function mbPDF(v, t) { return (v / t) * Math.exp(-v * v / (2 * t)); }

  canvas.addEventListener('click', () => {
    const f = Math.sqrt(1.6);
    parts.forEach(p => { p.vx *= f; p.vy *= f; });
  });

  const BINS = 22;

  function step(dt) {
    parts.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < bL + R) { p.x = bL + R; p.vx = Math.abs(p.vx); }
      if (p.x > bR - R) { p.x = bR - R; p.vx = -Math.abs(p.vx); }
      if (p.y < bTop + R) { p.y = bTop + R; p.vy = Math.abs(p.vy); }
      if (p.y > bBot - R) { p.y = bBot - R; p.vy = -Math.abs(p.vy); }
    });
  }

  function draw(now) {
    const dt = Math.min(0.028, (now - last) / 1000); last = now;
    step(dt);
    ctx.clearRect(0, 0, w, h);

    const Tcur = Math.max(getT(), 1);
    const vMaxHist = 4.5 * Math.sqrt(Tcur);
    const binW = vMaxHist / BINS;
    const vRms = Math.sqrt(2 * Tcur);

    // ── TOP: particles coloured by speed ────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
    ctx.strokeRect(bL, bTop, bW, bH);

    parts.forEach(p => {
      const t = Math.min(Math.hypot(p.vx, p.vy) / (1.8 * vRms), 1);
      ctx.fillStyle = `rgb(${Math.round(50 + 200 * t)},${Math.round(160 - 80 * t)},${Math.round(255 - 210 * t)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '12px system-ui';
    ctx.fillText(`T = ${Tcur.toFixed(0)}  (click to heat)`, bL + 4, bTop - 8);

    // divider
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(0, SPLIT + 2); ctx.lineTo(w, SPLIT + 2); ctx.stroke();
    ctx.setLineDash([]);

    // ── BOTTOM: speed histogram + theoretical MB curve ───────────
    const hX = mg + 10, hY = SPLIT + 8;
    const hW = w - hX - mg, hH = h - hY - mg - 18;
    const barW = hW / BINS;

    const bins = new Array(BINS).fill(0);
    parts.forEach(p => {
      const i = Math.min(Math.floor(Math.hypot(p.vx, p.vy) / binW), BINS - 1);
      bins[i]++;
    });
    const binMax = Math.max(...bins, 1);

    bins.forEach((cnt, i) => {
      const barH = (cnt / binMax) * hH;
      const t = Math.min(((i + 0.5) * binW) / (1.8 * vRms), 1);
      ctx.fillStyle = `hsla(${210 - 160 * t}, 80%, 60%, 0.55)`;
      ctx.fillRect(hX + i * barW, hY + hH - barH, barW - 1, barH);
    });

    // Theoretical MB curve, peak normalised to hH
    const mbPeak = mbPDF(Math.sqrt(Tcur), Tcur);
    ctx.beginPath(); ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2;
    for (let i = 0; i <= Math.floor(hW); i++) {
      const v = (i / hW) * vMaxHist;
      const y = hY + hH - (mbPDF(v, Tcur) / mbPeak) * hH * 0.92;
      i === 0 ? ctx.moveTo(hX + i, y) : ctx.lineTo(hX + i, y);
    }
    ctx.stroke();

    // Key speed markers
    [[Math.sqrt(Tcur), 'v_p', '#64ffda'],
     [Math.sqrt(Math.PI * Tcur / 2), 'v̄', '#80d8ff'],
     [vRms, 'v_rms', '#ff8a80']].forEach(([v, lbl, col]) => {
      if (v >= vMaxHist) return;
      const x = hX + (v / vMaxHist) * hW;
      ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(x, hY + hH); ctx.lineTo(x, hY + 4); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = col; ctx.font = '10px system-ui';
      ctx.fillText(lbl, x - 8, hY + hH + 14);
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(hX, hY + hH); ctx.lineTo(hX + hW, hY + hH); ctx.stroke();

    ctx.fillStyle = '#ffcc00'; ctx.font = '10px system-ui';
    ctx.fillText('— MB theory', hX + 4, hY + 13);
    ctx.fillStyle = 'rgba(200,200,200,0.45)';
    ctx.fillText('speed →', hX + hW - 48, hY + hH + 14);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── UNCERTAINTY ─────────────────────────────
SIMS.uncertainty = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf, t = 0;
  const N = 300;
  const pad = 18;
  const mid = w / 2;
  const cy = h * 0.60;
  const ampMax = h * 0.44;
  const xRange = 3.0, pRange = 3.0;

  function draw() {
    t += 0.018;
    // σ_x breathes between 0.5 and 1.2 (~7 s period)
    const sigma  = 0.5 + 0.7 * (1 - Math.cos(t * 0.8)) / 2;
    const sigmaP = 0.5 / sigma; // Δx · Δp = ℏ/2 (minimum uncertainty state)

    ctx.fillStyle = '#0a0e1e';
    ctx.fillRect(0, 0, w, h);

    // ── LEFT PANEL: position space ──────────────────────────────────
    function xToPx(x) { return pad + ((x + xRange) / (2 * xRange)) * (mid - 2 * pad); }

    // filled envelope
    ctx.beginPath();
    ctx.fillStyle = 'rgba(79,195,247,0.12)';
    ctx.moveTo(xToPx(-xRange), cy);
    for (let i = 0; i <= N; i++) {
      const x = -xRange + (i / N) * 2 * xRange;
      ctx.lineTo(xToPx(x), cy - Math.exp(-x * x / (2 * sigma * sigma)) * ampMax);
    }
    ctx.lineTo(xToPx(xRange), cy);
    ctx.closePath(); ctx.fill();

    // oscillating real part of ψ inside the envelope
    ctx.beginPath(); ctx.strokeStyle = '#4fc3f7'; ctx.lineWidth = 1.8;
    for (let i = 0; i <= N; i++) {
      const x = -xRange + (i / N) * 2 * xRange;
      const amp = Math.exp(-x * x / (4 * sigma * sigma)) * Math.cos(5 * x - t * 2.5);
      i === 0 ? ctx.moveTo(xToPx(x), cy - amp * ampMax)
              : ctx.lineTo(xToPx(x), cy - amp * ampMax);
    }
    ctx.stroke();

    // baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, cy); ctx.lineTo(mid - pad, cy); ctx.stroke();

    // ±σ dashed markers (at 1/e half-height of |ψ|²)
    ctx.strokeStyle = 'rgba(79,195,247,0.55)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    [-sigma, sigma].forEach(s => {
      const px = xToPx(s);
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, cy - Math.exp(-0.5) * ampMax); ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.fillStyle = '#4fc3f7'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Position  |ψ(x)|²', pad + 2, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '12px system-ui';
    ctx.fillText(`Δx = ${sigma.toFixed(3)}`, pad + 2, 36);

    // ── RIGHT PANEL: momentum space ─────────────────────────────────
    function pToPx(p) { return mid + pad + ((p + pRange) / (2 * pRange)) * (mid - 2 * pad); }

    // filled envelope
    ctx.beginPath();
    ctx.fillStyle = 'rgba(239,154,154,0.12)';
    ctx.moveTo(pToPx(-pRange), cy);
    for (let i = 0; i <= N; i++) {
      const p = -pRange + (i / N) * 2 * pRange;
      ctx.lineTo(pToPx(p), cy - Math.exp(-p * p / (2 * sigmaP * sigmaP)) * ampMax);
    }
    ctx.lineTo(pToPx(pRange), cy);
    ctx.closePath(); ctx.fill();

    // curve
    ctx.beginPath(); ctx.strokeStyle = '#ef9a9a'; ctx.lineWidth = 1.8;
    for (let i = 0; i <= N; i++) {
      const p = -pRange + (i / N) * 2 * pRange;
      const env = Math.exp(-p * p / (2 * sigmaP * sigmaP));
      i === 0 ? ctx.moveTo(pToPx(p), cy - env * ampMax)
              : ctx.lineTo(pToPx(p), cy - env * ampMax);
    }
    ctx.stroke();

    // baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mid + pad, cy); ctx.lineTo(w - pad, cy); ctx.stroke();

    // ±σ_p dashed markers
    ctx.strokeStyle = 'rgba(239,154,154,0.55)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
    [-sigmaP, sigmaP].forEach(s => {
      const px = pToPx(s);
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, cy - Math.exp(-0.5) * ampMax); ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.fillStyle = '#ef9a9a'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Momentum  |φ(p)|²', mid + pad + 2, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '12px system-ui';
    ctx.fillText(`Δp = ${sigmaP.toFixed(3)}`, mid + pad + 2, 36);

    // centre divider
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mid, 0); ctx.lineTo(mid, h); ctx.stroke();

    // product label (saturates bound — squeeze one, stretch the other)
    ctx.fillStyle = '#b9f6ca'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(`Δx · Δp = ${(sigma * sigmaP).toFixed(3)} = ℏ/2`, mid, h - 8);
    ctx.textAlign = 'left';

    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── PAULI ───────────────────────────────────
SIMS.pauli = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf, frame = 0;
  const BW = 36, BH = 22, PAD = 5, SGAP = 12;

  // [shell n, label, colour, orbital-count] in aufbau order
  const SUBSHELLS = [
    [1, '1s', '#4fc3f7', 1],
    [2, '2s', '#81c784', 1], [2, '2p', '#81c784', 3],
    [3, '3s', '#ffb74d', 1], [3, '3p', '#ffb74d', 3],
  ];

  // Build flat orbital list with canvas positions
  const rowY = [0, h * 0.18, h * 0.42, h * 0.62];
  const orbs = [];
  { let lastN = 0, cx = 0;
    SUBSHELLS.forEach(([n, lbl, col, nOrb]) => {
      if (n !== lastN) { lastN = n; cx = w * 0.18; } else { cx += SGAP; }
      for (let i = 0; i < nOrb; i++, cx += BW + PAD)
        orbs.push({ x: cx, y: rowY[n], col, lbl: i === 0 ? lbl : '', n });
    });
  }

  // Element symbols and names for Z = 1–18
  const ELEMS = [null,
    ['H','Hydrogen'],  ['He','Helium'],    ['Li','Lithium'],   ['Be','Beryllium'],
    ['B','Boron'],     ['C','Carbon'],     ['N','Nitrogen'],   ['O','Oxygen'],
    ['F','Fluorine'],  ['Ne','Neon'],      ['Na','Sodium'],    ['Mg','Magnesium'],
    ['Al','Aluminium'],['Si','Silicon'],   ['P','Phosphorus'], ['S','Sulfur'],
    ['Cl','Chlorine'], ['Ar','Argon'],
  ];

  const CFGS = ['', '1s¹', '1s²',
    '[He]2s¹', '[He]2s²', '[He]2s²2p¹', '[He]2s²2p²', '[He]2s²2p³',
    '[He]2s²2p⁴', '[He]2s²2p⁵', '[He]2s²2p⁶',
    '[Ne]3s¹', '[Ne]3s²', '[Ne]3s²3p¹', '[Ne]3s²3p²', '[Ne]3s²3p³',
    '[Ne]3s²3p⁴', '[Ne]3s²3p⁵', '[Ne]3s²3p⁶',
  ];

  // Aufbau + Hund: fill spin-up across all orbitals of a subshell first, then spin-down
  function occupation(Z) {
    const o = orbs.map(() => ({ up: false, dn: false }));
    let rem = Z, idx = 0;
    for (const [, , , nOrb] of SUBSHELLS) {
      if (!rem) break;
      const up = Math.min(rem, nOrb); for (let k = 0; k < up; k++) o[idx + k].up = true; rem -= up;
      const dn = Math.min(rem, nOrb); for (let k = 0; k < dn; k++) o[idx + k].dn  = true; rem -= dn;
      idx += nOrb;
    }
    return o;
  }

  // Spin arrow centred at (cx, cy): dir = 'up' or 'dn'
  function arw(cx, cy, dir, sz) {
    const hw = sz * 0.45, hd = sz * 0.5, sh = 2.5;
    ctx.beginPath();
    if (dir === 'up') {
      ctx.moveTo(cx, cy - sz); ctx.lineTo(cx - hw, cy - sz + hd); ctx.lineTo(cx + hw, cy - sz + hd);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(cx - sh / 2, cy - sz + hd, sh, sz - hd + 2);
    } else {
      ctx.moveTo(cx, cy + sz); ctx.lineTo(cx - hw, cy + sz - hd); ctx.lineTo(cx + hw, cy + sz - hd);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(cx - sh / 2, cy - 2, sh, sz - hd + 2);
    }
  }

  function draw() {
    frame++;
    const STEP = 55, HOLD = 120, cycle = STEP * 18 + HOLD;
    const ph = frame % cycle;
    const Z = ph < STEP * 18 ? Math.floor(ph / STEP) + 1 : 18;
    const pulse = 0.55 + 0.45 * Math.sin(frame * 0.22);

    const cur = occupation(Z), prev = occupation(Math.max(0, Z - 1));
    let ni = -1, ns = '';
    for (let i = 0; i < orbs.length; i++) {
      if (cur[i].up && !prev[i].up) { ni = i; ns = 'up'; break; }
      if (cur[i].dn && !prev[i].dn) { ni = i; ns = 'dn'; break; }
    }

    ctx.fillStyle = '#0a0e1e'; ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#b9f6ca'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Electron Shell Filling — Pauli Exclusion', 8, 15);

    // Shell row labels
    [1, 2, 3].forEach(n => {
      const oy = orbs.find(o => o.n === n)?.y;
      if (oy == null) return;
      ctx.fillStyle = n === 1 ? '#4fc3f7' : n === 2 ? '#81c784' : '#ffb74d';
      ctx.font = '11px system-ui'; ctx.textAlign = 'right';
      ctx.fillText(`n=${n}`, w * 0.15, oy + BH * 0.5 + 4);
    });

    // Orbital boxes with spin arrows
    orbs.forEach((o, i) => {
      const c = cur[i], full = c.up && c.dn, isN = i === ni;
      ctx.strokeStyle = full ? o.col : 'rgba(255,255,255,0.28)';
      ctx.lineWidth = full ? 1.8 : 1;
      ctx.strokeRect(o.x, o.y, BW, BH);
      if (full) { ctx.fillStyle = o.col + '18'; ctx.fillRect(o.x, o.y, BW, BH); }

      const sz = BH * 0.38, cy = o.y + BH / 2;
      if (c.up) {
        ctx.fillStyle = `rgba(79,195,247,${isN && ns === 'up' ? pulse : 1})`;
        arw(o.x + BW * 0.28, cy, 'up', sz);
      }
      if (c.dn) {
        ctx.fillStyle = `rgba(239,154,154,${isN && ns === 'dn' ? pulse : 1})`;
        arw(o.x + BW * 0.72, cy, 'dn', sz);
      }

      if (o.lbl) {
        ctx.fillStyle = o.col; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
        ctx.fillText(o.lbl, o.x + BW / 2, o.y - 3);
      }
    });

    // Element info panel
    const el = ELEMS[Z];
    if (el) {
      const by = h * 0.82;
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
      ctx.fillText(`Z = ${Z}`, 10, by);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 26px system-ui';
      ctx.fillText(el[0], 10, by + 24);
      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '13px system-ui';
      ctx.fillText(el[1], 56, by + 12);
      ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '11px system-ui';
      ctx.fillText(CFGS[Z], 56, by + 27);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    ctx.fillText('↑ spin-up   ↓ spin-down   max 2 per orbital', w - 6, h - 5);

    raf = requestAnimationFrame(draw);
  }
  draw();
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────── STEFAN–BOLTZMANN ────────────────────────────
// Auto-cycles a blackbody from 1500 K to 10000 K. The Planck spectrum
// rescales massively (P ∝ T⁴) and slides toward shorter λ (Wien's law),
// while a side bar tracks total radiated flux σT⁴ and a glowing disk
// shows the emitter's apparent colour.
SIMS.stefan_boltzmann = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  const h_p   = 6.62607015e-34;
  const c_l   = 2.998e8;
  const k_B   = 1.380649e-23;
  const sigma = 5.670374e-8;            // W·m⁻²·K⁻⁴

  const LAM_MIN = 80e-9, LAM_MAX = 3000e-9;
  const N = 220;
  const T_MIN = 1500, T_MAX = 10000;

  const padL = 38, padR = 6, padT = 16, padB = 30;
  const sideRes = 92;
  const plotL = padL;
  const plotR = w - padR - sideRes;
  const plotT = padT;
  const plotB = h - padB;
  const plotW = plotR - plotL;
  const plotH = plotB - plotT;
  const sideX = plotR + 8;
  const sideW = w - sideX - padR;

  function planck(lam, T) {
    const a = 2 * h_p * c_l * c_l / Math.pow(lam, 5);
    const x = h_p * c_l / (lam * k_B * T);
    return a / Math.expm1(x);
  }
  const lamPeakAtMax = 2.8978e-3 / T_MAX;
  const Bmax = planck(Math.max(lamPeakAtMax, LAM_MIN), T_MAX);

  // Tanner Helland blackbody-RGB approximation (clamped 0–255)
  function bbColor(T) {
    const Th = Math.max(1000, Math.min(40000, T)) / 100;
    let r, g, b;
    r = Th <= 66 ? 255 : 329.7 * Math.pow(Th - 60, -0.1332);
    g = Th <= 66 ? 99.47 * Math.log(Th) - 161.12
                 : 288.12 * Math.pow(Th - 60, -0.0755);
    b = Th >= 66 ? 255
        : (Th <= 19 ? 0 : 138.52 * Math.log(Th - 10) - 305.0448);
    const cl = v => Math.max(0, Math.min(255, v | 0));
    return { r: cl(r), g: cl(g), b: cl(b) };
  }

  function lamToPx(lam) {
    return plotL + (lam - LAM_MIN) / (LAM_MAX - LAM_MIN) * plotW;
  }
  function bToPx(B) {
    return plotB - Math.min(1, B / Bmax) * plotH;
  }

  let raf, t0 = performance.now();

  function draw(now) {
    const phase = ((now - t0) / 5500) % (Math.PI * 2);
    const u = (1 - Math.cos(phase)) / 2;          // 0 → 1 → 0 ease
    const T = T_MIN + (T_MAX - T_MIN) * u;
    const lamPeak = 2.8978e-3 / T;
    const P    = sigma * Math.pow(T, 4);
    const Pmax = sigma * Math.pow(T_MAX, 4);
    const c1 = bbColor(T);
    const colStr  = `rgb(${c1.r},${c1.g},${c1.b})`;
    const colSoft = `rgba(${c1.r},${c1.g},${c1.b},0.18)`;
    const colHalo = `rgba(${c1.r},${c1.g},${c1.b},0.45)`;
    const colNone = `rgba(${c1.r},${c1.g},${c1.b},0)`;

    ctx.clearRect(0, 0, w, h);

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB); ctx.lineTo(plotR, plotB);
    ctx.stroke();

    // λ ticks (nm)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    [500, 1000, 1500, 2000, 2500].forEach(nm => {
      const x = lamToPx(nm * 1e-9);
      ctx.beginPath(); ctx.moveTo(x, plotB); ctx.lineTo(x, plotB + 4); ctx.stroke();
      ctx.fillText(String(nm), x, plotB + 15);
    });
    ctx.fillText('λ (nm)', (plotL + plotR) / 2, plotB + 27);

    // visible-spectrum band along the floor (380–750 nm)
    {
      const xmin = lamToPx(380e-9), xmax = lamToPx(750e-9);
      const grd = ctx.createLinearGradient(xmin, 0, xmax, 0);
      grd.addColorStop(0.00, '#7a4eff');
      grd.addColorStop(0.18, '#3a64ff');
      grd.addColorStop(0.38, '#1fc7ff');
      grd.addColorStop(0.55, '#3cd86d');
      grd.addColorStop(0.72, '#fff04a');
      grd.addColorStop(0.86, '#ff8a3c');
      grd.addColorStop(1.00, '#ff3434');
      ctx.fillStyle = grd;
      ctx.fillRect(xmin, plotB - 5, xmax - xmin, 5);
    }

    // Planck curve — filled
    ctx.beginPath();
    ctx.moveTo(plotL, plotB);
    for (let i = 0; i <= N; i++) {
      const lam = LAM_MIN + (i / N) * (LAM_MAX - LAM_MIN);
      ctx.lineTo(lamToPx(lam), bToPx(planck(lam, T)));
    }
    ctx.lineTo(plotR, plotB);
    ctx.closePath();
    ctx.fillStyle = colSoft;
    ctx.fill();

    // Planck curve — outline
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const lam = LAM_MIN + (i / N) * (LAM_MAX - LAM_MIN);
      const px = lamToPx(lam), py = bToPx(planck(lam, T));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = colStr; ctx.lineWidth = 1.8;
    ctx.stroke();

    // Wien peak marker (vertical guide)
    if (lamPeak > LAM_MIN && lamPeak < LAM_MAX) {
      const xPk = lamToPx(lamPeak);
      const yPk = bToPx(planck(lamPeak, T));
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(xPk, plotB); ctx.lineTo(xPk, yPk); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Header labels
    ctx.fillStyle = '#eee'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Blackbody  Bλ(T)', plotL + 4, plotT + 12);
    ctx.font = '11px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillText(`T = ${T.toFixed(0)} K`, plotL + 4, plotT + 28);
    ctx.fillText(`λpeak = ${(lamPeak * 1e9).toFixed(0)} nm`, plotL + 4, plotT + 44);

    // ── RIGHT COLUMN: glowing disk + power bar ─────────────────────────
    const cx = sideX + sideW * 0.5;
    const cy = plotT + 30;
    const rad = Math.min(22, sideW * 0.30);

    // halo
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * 2.6);
    halo.addColorStop(0, colStr);
    halo.addColorStop(0.45, colHalo);
    halo.addColorStop(1, colNone);
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, rad * 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = colStr;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();

    // power bar
    const barX = sideX + 14;
    const barW = sideW - 28;
    const barTop = cy + rad + 18;
    const barBot = plotB - 2;
    const barH   = barBot - barTop;
    ctx.strokeStyle = 'rgba(255,255,255,0.30)'; ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barTop + 0.5, barW, barH);
    const fillH = barH * (P / Pmax);
    const grd = ctx.createLinearGradient(0, barBot, 0, barTop);
    grd.addColorStop(0, '#ff5a3c');
    grd.addColorStop(0.5, '#ffb547');
    grd.addColorStop(1, '#dff7ff');
    ctx.fillStyle = grd;
    ctx.fillRect(barX + 1, barBot - fillH, barW - 1, fillH);

    // bar labels
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('P ∝ T⁴', sideX + sideW * 0.5, barTop - 6);
    ctx.fillStyle = '#ffd166'; ctx.font = 'bold 10px system-ui';
    ctx.fillText(`${(P / 1e6).toFixed(1)} MW/m²`, sideX + sideW * 0.5, barBot + 14);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ──────────────────── LOGISTIC-MAP BIFURCATION ───────────────────────
// For the `complexity` node: visualises x → r·x(1−x) as r sweeps,
// drawing the bifurcation diagram on the left and a live cobweb on
// the right. Period-doubling cascade, onset of chaos near r ≈ 3.5699,
// and the famous period-3 window near r ≈ 3.83 all appear naturally.
SIMS.complexity = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  const R_MIN = 2.5, R_MAX = 4.0;
  const padL = 32, padR = 10, padT = 22, padB = 22;

  // Split: bifurcation diagram on the left (~62%), cobweb on the right.
  const splitX = Math.max(w * 0.58, w - 200);
  const bL = padL, bR = splitX - 10;
  const bT = padT, bB = h - padB;
  const bW = bR - bL, bH = bB - bT;

  const cL = splitX + 4, cR = w - padR;
  const cT = padT, cB = h - padB;
  const cSide = Math.min(cR - cL, cB - cT);
  const cX = cL, cY = cT + (cB - cT - cSide) / 2;

  function rToPx(r) { return bL + (r - R_MIN) / (R_MAX - R_MIN) * bW; }

  // Precompute bifurcation diagram into an offscreen canvas, one column
  // per draw call so the page stays smooth.
  const COLS = Math.max(160, Math.floor(bW * 1.5));
  const off  = document.createElement('canvas');
  off.width  = Math.max(2, Math.floor(bW));
  off.height = Math.max(2, Math.floor(bH));
  const octx = off.getContext('2d');
  octx.fillStyle = 'rgba(150, 210, 255, 0.55)';
  let computed = 0;

  function computeColumn(col) {
    const r = R_MIN + (col / (COLS - 1)) * (R_MAX - R_MIN);
    const px = (col / (COLS - 1)) * (off.width - 1);
    let x = 0.5;
    for (let i = 0; i < 240; i++) x = r * x * (1 - x);          // burn-in
    for (let i = 0; i < 160; i++) {
      x = r * x * (1 - x);
      octx.fillRect(px, (1 - x) * (off.height - 1), 1, 1);
    }
  }

  // r oscillates slowly across its range with an ease so milestones linger.
  const SWEEP_MS = 18000;
  let raf, t0 = performance.now();

  function periodLabel(r) {
    if (r < 3)            return 'fixed point';
    if (r < 3.4495)       return 'period 2';
    if (r < 3.5441)       return 'period 4';
    if (r < 3.5644)       return 'period 8';
    if (r < 3.5699)       return 'cascade';
    if (r > 3.828 && r < 3.857) return 'period 3 window';
    return 'chaos';
  }

  function draw(now) {
    if (computed < COLS) {
      const batch = Math.min(12, COLS - computed);
      for (let k = 0; k < batch; k++) computeColumn(computed++);
    }

    const phase = ((now - t0) / SWEEP_MS) % 1;
    const u = (1 - Math.cos(phase * Math.PI * 2)) / 2;
    const r = R_MIN + (R_MAX - R_MIN) * u;

    ctx.clearRect(0, 0, w, h);

    // Bifurcation diagram (scaled blit)
    ctx.drawImage(off, bL, bT, bW, bH);

    // Frame + r-axis ticks
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bL, bT); ctx.lineTo(bL, bB); ctx.lineTo(bR, bB);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    [2.5, 3.0, 3.5, 4.0].forEach(rt => {
      const x = rToPx(rt);
      ctx.beginPath(); ctx.moveTo(x, bB); ctx.lineTo(x, bB + 3); ctx.stroke();
      ctx.fillText(rt.toFixed(1), x, bB + 13);
    });

    // Period-3 window marker (the famous Sarkovskii surprise)
    {
      const x = rToPx(3.83);
      ctx.strokeStyle = 'rgba(255,210,120,0.35)';
      ctx.setLineDash([2, 3]); ctx.beginPath();
      ctx.moveTo(x, bT); ctx.lineTo(x, bB); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Current-r vertical guide
    const xCur = rToPx(r);
    ctx.strokeStyle = 'rgba(255,201,89,0.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(xCur, bT - 3); ctx.lineTo(xCur, bB + 3); ctx.stroke();

    // Title + readout
    ctx.fillStyle = '#eee'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('x ← r · x (1 − x)', bL + 2, bT - 7);
    ctx.fillStyle = '#ffd166'; ctx.font = 'bold 11px system-ui';
    ctx.fillText(`r = ${r.toFixed(3)}`, bL + 4, bT + 12);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '10px system-ui';
    ctx.fillText(periodLabel(r), bL + 4, bT + 25);

    // ── Cobweb plot ────────────────────────────────────────────────────
    function px(xx) { return cX + xx * cSide; }
    function py(xx) { return cY + (1 - xx) * cSide; }

    ctx.strokeStyle = 'rgba(255,255,255,0.20)';
    ctx.strokeRect(cX + 0.5, cY + 0.5, cSide, cSide);

    // y = x diagonal
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(1), py(1)); ctx.stroke();
    ctx.setLineDash([]);

    // Parabola y = r·x(1−x)
    ctx.strokeStyle = 'rgba(130,207,255,0.9)'; ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const xx = i / 64;
      const yy = r * xx * (1 - xx);
      i === 0 ? ctx.moveTo(px(xx), py(yy)) : ctx.lineTo(px(xx), py(yy));
    }
    ctx.stroke();

    // Cobweb trace — burn in then draw a few dozen steps
    let x0 = 0.15;
    for (let i = 0; i < 60; i++) x0 = r * x0 * (1 - x0);
    ctx.strokeStyle = 'rgba(255,201,89,0.75)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px(x0), py(x0));
    for (let i = 0; i < 90; i++) {
      const xn = r * x0 * (1 - x0);
      ctx.lineTo(px(x0), py(xn));
      ctx.lineTo(px(xn), py(xn));
      x0 = xn;
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '10px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('cobweb', cX + 4, cY + 11);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ──────────────────── SNELL'S LAW (REFRACTION + TIR) ─────────────────
// For the `snells_law` node: a yellow ray strikes the interface between
// two media; a green refracted ray emerges in the lower medium per
// n₁ sin θ₁ = n₂ sin θ₂. Cycles through air→water, air→glass, glass→air,
// and air→diamond. When going from denser to rarer past the critical
// angle, the refracted ray vanishes and the reflected ray brightens —
// total internal reflection in the act.
SIMS.snells_law = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf;
  const t0 = performance.now();

  const intY = Math.round(h * 0.5);
  const cx   = w * 0.5;

  // (upper, lower) pairs to cycle through.
  const PAIRS = [
    { up: { n: 1.00, name: 'air'   }, lo: { n: 1.33, name: 'water'   }, tintLo: 'rgba(60,150,220,0.16)', tintUp: null },
    { up: { n: 1.00, name: 'air'   }, lo: { n: 1.50, name: 'glass'   }, tintLo: 'rgba(140,210,230,0.16)', tintUp: null },
    { up: { n: 1.50, name: 'glass' }, lo: { n: 1.00, name: 'air'     }, tintLo: null,                    tintUp: 'rgba(140,210,230,0.16)' },
    { up: { n: 1.00, name: 'air'   }, lo: { n: 2.42, name: 'diamond' }, tintLo: 'rgba(220,205,255,0.20)', tintUp: null },
  ];
  const CYCLE_MS = 6500;

  function arrow(x0, y0, x1, y1, col) {
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = col; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 8 * Math.cos(a - 0.42), y1 - 8 * Math.sin(a - 0.42));
    ctx.lineTo(x1 - 8 * Math.cos(a + 0.42), y1 - 8 * Math.sin(a + 0.42));
    ctx.closePath(); ctx.fill();
  }

  function draw(now) {
    const T = now - t0;
    const idx = Math.floor(T / CYCLE_MS) % PAIRS.length;
    const phase = (T % CYCLE_MS) / CYCLE_MS;        // 0 → 1
    const p = PAIRS[idx];
    const n1 = p.up.n, n2 = p.lo.n;

    // ease angle 5° → max → 5° over one cycle
    const u = (1 - Math.cos(phase * Math.PI * 2)) / 2;
    const thetaMax = (n1 > n2) ? 78 : 75;            // push past critical for TIR pairs
    const theta1 = ((5 + u * (thetaMax - 5)) * Math.PI) / 180;
    const sinT2  = (n1 / n2) * Math.sin(theta1);
    const tir    = sinT2 >= 1;
    const theta2 = tir ? 0 : Math.asin(sinT2);
    const critRad = (n1 > n2) ? Math.asin(n2 / n1) : null;

    ctx.clearRect(0, 0, w, h);
    if (p.tintUp) { ctx.fillStyle = p.tintUp; ctx.fillRect(0, 0, w, intY); }
    if (p.tintLo) { ctx.fillStyle = p.tintLo; ctx.fillRect(0, intY, w, h - intY); }

    // interface
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, intY); ctx.lineTo(w, intY); ctx.stroke();

    // normal (dashed)
    ctx.strokeStyle = 'rgba(255,255,255,0.30)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, 14); ctx.lineTo(cx, h - 14); ctx.stroke();
    ctx.setLineDash([]);

    const L = Math.min(intY, h - intY) - 16;

    // incident (upper-left → interface)
    const iX = cx - Math.sin(theta1) * L;
    const iY = intY - Math.cos(theta1) * L;
    arrow(iX, iY, cx, intY, '#ffd166');

    // reflected (mirror of incident, going up-right)
    const flX = cx + Math.sin(theta1) * L;
    const flY = intY - Math.cos(theta1) * L;
    const reflCol = tir ? '#ffd166' : 'rgba(255,209,102,0.32)';
    if (tir) {
      arrow(cx, intY, flX, flY, reflCol);
    } else {
      ctx.strokeStyle = reflCol; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx, intY); ctx.lineTo(flX, flY); ctx.stroke();
    }

    // refracted (lower-right) — only if not TIR
    if (!tir) {
      const rX = cx + Math.sin(theta2) * L;
      const rY = intY + Math.cos(theta2) * L;
      arrow(cx, intY, rX, rY, '#69f0ae');
    }

    // angle arcs
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(cx, intY, 26, -Math.PI / 2 - theta1, -Math.PI / 2); ctx.stroke();
    if (!tir) {
      ctx.strokeStyle = '#69f0ae';
      ctx.beginPath(); ctx.arc(cx, intY, 26, Math.PI / 2 - theta2, Math.PI / 2); ctx.stroke();
    }

    // labels — media
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText(`n₁ = ${n1.toFixed(2)}  ${p.up.name}`, 10, 18);
    ctx.fillText(`n₂ = ${n2.toFixed(2)}  ${p.lo.name}`, 10, h - 8);

    // angles (live)
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`θ₁ = ${(theta1 * 180 / Math.PI).toFixed(1)}°`, 10, intY - 8);
    if (!tir) {
      ctx.fillStyle = '#69f0ae';
      ctx.fillText(`θ₂ = ${(theta2 * 180 / Math.PI).toFixed(1)}°`, 10, intY + 20);
    } else {
      ctx.fillStyle = '#ff8a65';
      ctx.fillText('total internal reflection', 10, intY + 20);
      if (critRad != null) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(`θc = ${(critRad * 180 / Math.PI).toFixed(1)}°`, 10, intY + 34);
      }
    }

    // right-side Snell-ratio readout (skip on narrow canvases)
    if (w > 360) {
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.68)';
      ctx.font = '11px system-ui';
      ctx.fillText(`n₁ sin θ₁ = ${(n1 * Math.sin(theta1)).toFixed(3)}`, w - 10, intY - 8);
      if (!tir) {
        ctx.fillText(`n₂ sin θ₂ = ${(n2 * sinT2).toFixed(3)}`, w - 10, intY + 20);
      }
    }

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────── HERTZSPRUNG–RUSSELL DIAGRAM ─────────────────────
SIMS.stars = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  // x = log T, with the hot end on the LEFT (astronomy convention).
  // y = log L / L_sun, faint at the bottom, luminous at the top.
  const LT_MAX = 4.65, LT_MIN = 3.45;
  const LL_MIN = -4,   LL_MAX = 6;

  const padL = 44, padR = 12, padT = 22, padB = 30;
  const plotL = padL, plotR = w - padR;
  const plotT = padT, plotB = h - padB;
  const plotW = plotR - plotL, plotH = plotB - plotT;
  const xOf = lt => plotR - (lt - LT_MIN) / (LT_MAX - LT_MIN) * plotW;
  const yOf = ll => plotB - (ll - LL_MIN) / (LL_MAX - LL_MIN) * plotH;

  // Tanner Helland blackbody-RGB approximation
  function bbColor(T) {
    const Th = Math.max(1000, Math.min(40000, T)) / 100;
    let r, g, b;
    r = Th <= 66 ? 255 : 329.7 * Math.pow(Th - 60, -0.1332);
    g = Th <= 66 ? 99.47 * Math.log(Th) - 161.12
                 : 288.12 * Math.pow(Th - 60, -0.0755);
    b = Th >= 66 ? 255
        : (Th <= 19 ? 0 : 138.52 * Math.log(Th - 10) - 305.0448);
    const cl = v => Math.max(0, Math.min(255, v | 0));
    return `rgb(${cl(r)},${cl(g)},${cl(b)})`;
  }

  // Smooth cubic through main-sequence anchors:
  //   (3.45,-3), (3.762,0), (4.2,+3.5), (4.6,+5.6)
  const ms = lt => {
    const x = lt - 3.762;
    return 7.2 * x + 0.5 * x * x - 0.2 * x * x * x;
  };

  // Sample a fixed population once per open
  const POP = [];
  const push = (n, fn) => { for (let i = 0; i < n; i++) POP.push(fn()); };
  push(240, () => {                                // main sequence
    const lt = 3.45 + Math.random() * 1.18;
    return { lt, ll: ms(lt) + (Math.random() - 0.5) * 0.45,
             r: 1.1 + Math.random() * 1.3 };
  });
  push(70, () => ({ lt: 3.54 + Math.random() * 0.20,
                    ll: 1.4 + Math.random() * 1.8,
                    r: 1.4 + Math.random() * 1.6 })); // red giant branch
  push(16, () => ({ lt: 3.55 + Math.random() * 1.00,
                    ll: 4.6 + Math.random() * 1.2,
                    r: 1.9 + Math.random() * 1.6 })); // supergiants
  push(38, () => ({ lt: 3.95 + Math.random() * 0.55,
                    ll: -3.2 + Math.random() * 0.9,
                    r: 1.0 + Math.random() * 0.5 })); // white dwarfs

  // 1 M_sun evolutionary track keyframes (u, log T, log L, phase)
  const TRACK = [
    { u: 0.00, lt: 3.762, ll: -0.02, phase: 'main sequence' },
    { u: 0.50, lt: 3.757, ll:  0.13, phase: 'main sequence' },
    { u: 0.65, lt: 3.700, ll:  1.20, phase: 'subgiant' },
    { u: 0.75, lt: 3.560, ll:  3.30, phase: 'red giant' },
    { u: 0.83, lt: 3.500, ll:  4.10, phase: 'asymptotic giant' },
    { u: 0.89, lt: 4.640, ll:  3.70, phase: 'planetary nebula' },
    { u: 0.95, lt: 4.500, ll:  0.30, phase: 'white dwarf' },
    { u: 1.00, lt: 4.100, ll: -2.60, phase: 'white dwarf' },
  ];
  function trackPoint(u) {
    for (let i = 1; i < TRACK.length; i++) {
      if (u <= TRACK[i].u) {
        const a = TRACK[i - 1], b = TRACK[i];
        const t = (u - a.u) / (b.u - a.u);
        return { lt: a.lt + (b.lt - a.lt) * t,
                 ll: a.ll + (b.ll - a.ll) * t,
                 phase: a.phase };
      }
    }
    return TRACK[TRACK.length - 1];
  }

  const PERIOD_MS = 16000;
  const t0 = performance.now();
  let raf;

  const T_TICKS = [40000, 20000, 10000, 6000, 4000, 3000];
  const Y_TICKS = [
    [-4, '10⁻⁴'], [-2, '10⁻²'], [0, '10⁰'],
    [ 2, '10²' ], [ 4, '10⁴' ], [ 6, '10⁶'],
  ];

  function draw(now) {
    const u = ((now - t0) / PERIOD_MS) % 1;
    ctx.clearRect(0, 0, w, h);

    // Frame
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(plotL, plotT, plotW, plotH);

    ctx.font = '10px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';

    ctx.textAlign = 'center';
    T_TICKS.forEach(T => {
      const x = xOf(Math.log10(T));
      if (x < plotL - 2 || x > plotR + 2) return;
      ctx.beginPath(); ctx.moveTo(x, plotB); ctx.lineTo(x, plotB + 4); ctx.stroke();
      ctx.fillText(T >= 10000 ? `${T / 1000}k` : String(T), x, plotB + 14);
    });
    ctx.fillText('T (K)  ← hot   cool →', (plotL + plotR) / 2, plotB + 26);

    ctx.textAlign = 'right';
    Y_TICKS.forEach(([ll, lbl]) => {
      const y = yOf(ll);
      if (y < plotT - 2 || y > plotB + 2) return;
      ctx.beginPath(); ctx.moveTo(plotL - 4, y); ctx.lineTo(plotL, y); ctx.stroke();
      ctx.fillText(lbl, plotL - 6, y + 3);
    });
    ctx.save();
    ctx.translate(12, (plotT + plotB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('L / L☉', 0, 0);
    ctx.restore();

    // Background population — each star at its blackbody colour
    ctx.globalAlpha = 0.82;
    POP.forEach(s => {
      const x = xOf(s.lt), y = yOf(s.ll);
      if (x < plotL || x > plotR || y < plotT || y > plotB) return;
      ctx.fillStyle = bbColor(Math.pow(10, s.lt));
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Region labels (faint)
    ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.fillText('main sequence', xOf(3.88), yOf(0.85));
    ctx.fillText('red giants',    xOf(3.60), yOf(2.80));
    ctx.fillText('supergiants',   xOf(3.95), yOf(5.30));
    ctx.fillText('white dwarfs',  xOf(4.20), yOf(-2.70));

    // Recent evolutionary track ghost + current Sun-like star
    for (let i = 14; i > 0; i--) {
      const uu = u - i * 0.005;
      if (uu < 0) continue;
      const p = trackPoint(uu);
      ctx.fillStyle = `rgba(255,255,255,${(1 - i / 14) * 0.16})`;
      ctx.beginPath();
      ctx.arc(xOf(p.lt), yOf(p.ll), 1.7, 0, Math.PI * 2); ctx.fill();
    }
    const pt = trackPoint(u);
    const col = bbColor(Math.pow(10, pt.lt));
    ctx.shadowBlur = 14; ctx.shadowColor = col;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(xOf(pt.lt), yOf(pt.ll), 5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Title + live phase readout
    ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillStyle = '#eee';
    ctx.fillText('Hertzsprung–Russell diagram', plotL, plotT - 8);
    ctx.font = '11px system-ui'; ctx.textAlign = 'right';
    ctx.fillStyle = col;
    ctx.fillText(`Sun-like star → ${pt.phase}`, plotR, plotT - 8);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── CENTRAL LIMIT THEOREM ───────────────────
// Galton board: balls bounce through a triangle of pegs, each peg a
// 50/50 left/right coin flip. After ROWS coins, the slot a ball lands
// in is a Binomial(ROWS, ½) draw. As balls pile up, the histogram
// converges to the analytic 𝒩(μ = n/2, σ² = n/4) overlaid in red.
SIMS.clt = function (canvas) {
  const { ctx, w, h } = fit(canvas);

  const ROWS = 12;
  const BINS = ROWS + 1;
  const padT = 24, padB = 28, padX = 18;
  const topY = padT + 4;
  const pegBotY = padT + (h - padT - padB) * 0.55;
  const binTopY = pegBotY + 8;
  const binBotY = h - padB;
  const colW = Math.min(28, (w - 2 * padX) / BINS);
  const fieldW = colW * BINS;
  const xLeft = (w - fieldW) / 2;
  const xCenter = w / 2;
  const rowH = (pegBotY - topY) / (ROWS + 1);

  const pegs = [];
  for (let r = 0; r < ROWS; r++) {
    const y = topY + (r + 1) * rowH;
    for (let i = 0; i <= r; i++) {
      pegs.push({ x: xCenter + (i - r / 2) * colW, y });
    }
  }

  const bins = new Array(BINS).fill(0);
  let total = 0;
  const balls = [];
  let raf, last = performance.now(), spawn = 0;

  const SPAWN_RATE = 22;
  const MAX_BALLS = 28;
  const MAX_TOTAL = 9000;

  function newBall() {
    balls.push({
      x: xCenter + (Math.random() - 0.5) * 3,
      y: topY - 4,
      vy: 90,
      row: 0,
      slot: 0,
      nextY: topY + rowH,
    });
  }

  function step(dt) {
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      b.vy += 260 * dt;
      b.y += b.vy * dt;
      if (b.row < ROWS && b.y >= b.nextY) {
        if (Math.random() < 0.5) { b.x += colW / 2; b.slot++; }
        else                     { b.x -= colW / 2; }
        b.row++;
        b.nextY = topY + (b.row + 1) * rowH;
        b.vy *= 0.78;
      }
      if (b.row >= ROWS && b.y >= binBotY - 6) {
        bins[b.slot]++;
        total++;
        balls.splice(i, 1);
      }
    }
  }

  const mu = ROWS / 2;
  const variance = ROWS / 4;
  const sigma = Math.sqrt(variance);
  const gaussPDF = (k) => {
    const z = (k - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  };

  function draw(now) {
    const dt = Math.min(0.032, (now - last) / 1000); last = now;
    spawn += dt * SPAWN_RATE;
    while (spawn >= 1 && balls.length < MAX_BALLS && total < MAX_TOTAL) {
      spawn -= 1; newBall();
    }
    step(dt);

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    pegs.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2); ctx.fill();
    });

    const binH = binBotY - binTopY;
    const scaleRef = Math.max(...bins, total * gaussPDF(mu), 1);
    for (let i = 0; i < BINS; i++) {
      const x = xLeft + i * colW;
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.strokeRect(x + 0.5, binTopY + 0.5, colW - 1, binH - 1);
      const bh = (bins[i] / scaleRef) * (binH - 2);
      ctx.fillStyle = '#4facfe';
      ctx.fillRect(x + 2, binBotY - 1 - bh, colW - 4, bh);
    }

    if (total > 40) {
      ctx.strokeStyle = '#e91e63';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let s = 0; s <= 200; s++) {
        const k = (s / 200) * BINS - 0.5;
        const x = xLeft + ((k + 0.5) / BINS) * fieldW;
        const expected = total * gaussPDF(k);
        const y = binBotY - 1 - (expected / scaleRef) * (binH - 2);
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.fillStyle = '#ffd166';
    balls.forEach(b => {
      ctx.beginPath(); ctx.arc(b.x, b.y, 2.6, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#eee';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText('Galton board → bell curve', padX, 16);

    ctx.font = '11px system-ui';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`n = ${total}`, w - padX, 16);

    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${ROWS} coin flips per ball`, padX, h - 10);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e91e63';
    ctx.fillText(`𝒩(${mu}, ${variance.toFixed(0)})`, w - padX, h - 10);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ───────────────────── EQUIVALENCE PRINCIPLE ─────────────────────────
// Side-by-side rendering of Einstein's "happiest thought." LEFT: a sealed
// box at rest on Earth; the released ball falls under gravity. RIGHT: an
// identical box accelerating at g in deep space; the ball stays inertial
// while the box's floor races up to meet it. The interior-frame trajectory
// is identical in both — same parabola, same arrival time. A horizontal
// light pulse traversing each box likewise bends downward by the same
// amount, foreshadowing GR's prediction that gravity bends light.
SIMS.equivalence = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf;
  const t0 = performance.now();

  const PAD = 12;
  const headerH = 18;
  const footerH = 16;
  const paneW = (w - PAD * 3) / 2;
  const paneH = h - PAD * 2 - headerH - footerH;
  const leftX = PAD;
  const rightX = PAD * 2 + paneW;
  const topY = PAD + headerH;

  const BMX = 16, BMY = 10;
  const boxW = paneW - BMX * 2;
  const boxH = paneH - BMY * 2;

  // Ball trajectory: start near the top, reach the floor in CYCLE_DROP seconds.
  const CYCLE_DROP = 1.7;
  const HOLD       = 0.7;
  const FULL       = CYCLE_DROP + HOLD;
  const startY     = boxH * 0.20;
  const endY       = boxH * 0.92;
  const drop       = endY - startY;
  // s = ½ g t² ⇒ g = 2·drop / CYCLE_DROP² (in pixel units)
  const g = 2 * drop / (CYCLE_DROP * CYCLE_DROP);

  // Light pulse crosses the box faster than the ball falls — but follows the
  // same downward acceleration in the box frame.
  const lightDur = CYCLE_DROP * 0.55;

  // Deterministic starfield for the right pane.
  const stars = [];
  for (let i = 0; i < 32; i++) {
    stars.push({
      x: ((i * 73 + 11) % 100) / 100,
      y: ((i * 41 + 7)  % 100) / 100,
      s: 0.5 + ((i * 17) % 12) / 14,
    });
  }

  function arrow(x0, y0, x1, y1, col) {
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 5 * Math.cos(a - 0.5), y1 - 5 * Math.sin(a - 0.5));
    ctx.lineTo(x1 - 5 * Math.cos(a + 0.5), y1 - 5 * Math.sin(a + 0.5));
    ctx.closePath(); ctx.fill();
  }

  function drawPane(x, y, mode, phase) {
    const innerX = x + BMX;
    const innerY = y + BMY;
    const color = mode === 'gravity' ? '#ffd166' : '#80cbc4';

    if (mode === 'gravity') {
      const grd = ctx.createLinearGradient(0, y, 0, y + paneH);
      grd.addColorStop(0, 'rgba(80,140,200,0.10)');
      grd.addColorStop(1, 'rgba(140,170,90,0.18)');
      ctx.fillStyle = grd;
      ctx.fillRect(x, y, paneW, paneH);
      const groundY = innerY + boxH + 4;
      ctx.fillStyle = 'rgba(140,170,90,0.32)';
      ctx.fillRect(x + 2, groundY, paneW - 4, paneH - (groundY - y) - 2);
      ctx.strokeStyle = 'rgba(140,170,90,0.55)';
      ctx.lineWidth = 1;
      for (let xx = x + 6; xx < x + paneW - 8; xx += 9) {
        ctx.beginPath();
        ctx.moveTo(xx, groundY + 2);
        ctx.lineTo(xx + 5, groundY - 3);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = 'rgba(30, 36, 60, 0.30)';
      ctx.fillRect(x, y, paneW, paneH);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(x + 4 + s.x * (paneW - 8), y + 4 + s.y * (paneH - 8), s.s, 0, Math.PI * 2);
        ctx.fill();
      }
      // Rocket flame jutting below the box.
      const flameTop = innerY + boxH;
      const flameCx  = innerX + boxW / 2;
      const flameH   = (paneH - (flameTop - y)) - 2;
      const flick = 0.82 + 0.18 * Math.sin(performance.now() / 80);
      const fg = ctx.createLinearGradient(0, flameTop, 0, flameTop + flameH * flick);
      fg.addColorStop(0,   'rgba(255,210,90,0.95)');
      fg.addColorStop(0.55,'rgba(255,120,60,0.70)');
      fg.addColorStop(1,   'rgba(180,40,40,0.0)');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(flameCx - boxW * 0.20, flameTop);
      ctx.lineTo(flameCx + boxW * 0.20, flameTop);
      ctx.lineTo(flameCx,                flameTop + flameH * flick);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(innerX + 0.5, innerY + 0.5, boxW, boxH);

    ctx.fillStyle = color;
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(mode === 'gravity' ? 'AT REST ON EARTH'
                                    : 'ACCELERATING IN DEEP SPACE',
                 x + paneW / 2, y - 6);

    // Ghost trajectory.
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 0; k <= 30; k++) {
      const tk = (k / 30) * CYCLE_DROP;
      const yk = Math.min(startY + 0.5 * g * tk * tk, endY);
      const xx = innerX + boxW / 2;
      if (k === 0) ctx.moveTo(xx, innerY + yk);
      else         ctx.lineTo(xx, innerY + yk);
    }
    ctx.stroke();

    // Release marker — tiny horizontal tick at the start point.
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1;
    const rx = innerX + boxW / 2;
    ctx.beginPath();
    ctx.moveTo(rx - 6, innerY + startY - 2);
    ctx.lineTo(rx + 6, innerY + startY - 2);
    ctx.stroke();

    // Ball.
    const t = Math.min(phase, CYCLE_DROP);
    const sy = Math.min(startY + 0.5 * g * t * t, endY);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(rx, innerY + sy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Light pulse — parabolic in box frame.
    const tl = Math.min(phase, lightDur);
    if (tl >= 0) {
      const lt = tl / lightDur;
      const ly0 = innerY + boxH * 0.12;
      ctx.strokeStyle = 'rgba(255,209,102,0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const STEP = 0.04;
      for (let u = 0; u <= lt + 1e-6; u += STEP) {
        const ux = innerX + u * boxW;
        const tu = u * lightDur;
        const uy = ly0 + 0.5 * g * tu * tu;
        if (u === 0) ctx.moveTo(ux, uy);
        else         ctx.lineTo(ux, uy);
      }
      ctx.stroke();
      if (lt <= 1) {
        const lx = innerX + lt * boxW;
        const ly = ly0 + 0.5 * g * tl * tl;
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(lx, ly, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Local acceleration arrow + label inside the box.
    ctx.font = '10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    if (mode === 'gravity') {
      ctx.fillText('g', innerX + 6, innerY + 14);
      arrow(innerX + 14, innerY + 6, innerX + 14, innerY + 26, color);
    } else {
      ctx.fillText('a = g', innerX + 6, innerY + 14);
      arrow(innerX + 24, innerY + 26, innerX + 24, innerY + 6, color);
    }
  }

  function draw(now) {
    const T = (now - t0) / 1000;
    const phase = T % FULL;

    ctx.fillStyle = '#0a0e1e';
    ctx.fillRect(0, 0, w, h);

    drawPane(leftX,  topY, 'gravity', phase);
    drawPane(rightX, topY, 'rocket',  phase);

    ctx.fillStyle = '#b9f6ca';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('No experiment inside the box can tell gravity from acceleration.',
                 w / 2, h - 4);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────── PHOTOELECTRIC EFFECT ────────────────────────
// Monochromatic photons rain down on a cesium plate (φ = 2.14 eV).
// Below the threshold wavelength (~579 nm) NO electrons are ejected
// however many photons arrive — the wave picture predicts intensity
// should matter; it doesn't. Above threshold, each landing photon
// ejects one electron with KE = hν − φ, made visible as its exit
// speed. Auto-cycles red → yellow → cyan → blue → near-UV → deep-UV.
SIMS.photoelectric = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf;
  const t0 = performance.now();

  const PHI = 2.14;                                // work function, eV (cesium)
  const LAM_THRESH = 1240 / PHI;                   // ≈ 579 nm (E[eV] = 1240/λ[nm])
  const STOPS = [
    { lam: 700, name: 'red',      dwell: 2200 },
    { lam: 580, name: 'yellow',   dwell: 2200 },   // right at threshold
    { lam: 500, name: 'cyan',     dwell: 2200 },
    { lam: 440, name: 'blue',     dwell: 2200 },
    { lam: 350, name: 'near UV',  dwell: 2400 },
    { lam: 250, name: 'deep UV',  dwell: 2600 },
  ];
  const TOTAL = STOPS.reduce((s, x) => s + x.dwell, 0);

  const plateY = h - 42;
  const plateH = 18;

  // Approximate wavelength → sRGB. UV rendered as a pale glowing violet.
  function wlColor(lam) {
    let r, g, b;
    if (lam < 380)      { r = 180; g = 120; b = 255; }             // UV
    else if (lam < 440) { r = 130 + (lam - 380) * 2; g = 0; b = 255; }
    else if (lam < 490) { r = 0; g = (lam - 440) * 5.1; b = 255; }
    else if (lam < 510) { r = 0; g = 255; b = 255 - (lam - 490) * 12.75; }
    else if (lam < 580) { r = (lam - 510) * 3.64; g = 255; b = 0; }
    else if (lam < 645) { r = 255; g = 255 - (lam - 580) * 3.92; b = 0; }
    else                { r = 255; g = 0; b = 0; }                 // red
    return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
  }

  const photons   = [];
  const electrons = [];
  let lastSpawn = 0;
  const SPAWN_MS = 130;

  function currentStop(T) {
    let t = T % TOTAL;
    for (const s of STOPS) { if (t < s.dwell) return { s, t }; t -= s.dwell; }
    return { s: STOPS[0], t: 0 };
  }

  function draw(now) {
    const T   = now - t0;
    const cur = currentStop(T).s;
    const lam = cur.lam;
    const eV  = 1240 / lam;
    const above = eV > PHI;
    const col = wlColor(lam);

    if (now - lastSpawn > SPAWN_MS) {
      lastSpawn = now;
      photons.push({
        x: 20 + Math.random() * (w - 40),
        y: -8,
        vy: 190 + Math.random() * 40,
        col,
      });
    }

    const dt = 1 / 60;
    for (let i = photons.length - 1; i >= 0; i--) {
      const p = photons[i];
      p.y += p.vy * dt;
      if (p.y >= plateY - 2) {
        if (above) {
          const KE = eV - PHI;
          const v  = -(85 + 95 * Math.sqrt(KE));
          electrons.push({ x: p.x, y: plateY - 3, vy: v });
        }
        photons.splice(i, 1);
      }
    }
    for (let i = electrons.length - 1; i >= 0; i--) {
      const e = electrons[i];
      e.y += e.vy * dt;
      if (e.y < -8) electrons.splice(i, 1);
    }

    // dark background — colour photons need contrast
    ctx.fillStyle = '#0a0e1e';
    ctx.fillRect(0, 0, w, h);

    // title
    ctx.fillStyle = '#b9f6ca';
    ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Photoelectric Effect — cesium plate, φ = 2.14 eV', 8, 15);

    // readouts (top-right)
    ctx.textAlign = 'right';
    ctx.font = '11px system-ui';
    ctx.fillStyle = col;
    ctx.fillText(`λ = ${lam} nm  (${cur.name})`, w - 8, 15);
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillText(`hν = ${eV.toFixed(2)} eV`, w - 8, 30);
    if (above) {
      ctx.fillStyle = '#69f0ae';
      ctx.fillText(`KE = ${(eV - PHI).toFixed(2)} eV`, w - 8, 45);
    } else {
      ctx.fillStyle = '#ff8a65';
      ctx.fillText('no ejection', w - 8, 45);
    }

    // photons
    for (const p of photons) {
      ctx.fillStyle = p.col;
      ctx.shadowColor = p.col; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;

    // plate
    const grd = ctx.createLinearGradient(0, plateY, 0, plateY + plateH);
    grd.addColorStop(0, '#a4abc0');
    grd.addColorStop(1, '#42485a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, plateY, w, plateH);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.moveTo(0, plateY); ctx.lineTo(w, plateY); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Cs cathode', w / 2, plateY + 12);

    // electrons
    for (const e of electrons) {
      ctx.fillStyle = '#e0f7fa';
      ctx.shadowColor = '#4facfe'; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(e.x, e.y, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;

    // spectrum scale strip along the bottom
    const scaleY = h - 12;
    const scaleL = 20, scaleR = w - 20;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(scaleL, scaleY); ctx.lineTo(scaleR, scaleY); ctx.stroke();
    const nmToX = (nm) => scaleL + (720 - nm) / (720 - 200) * (scaleR - scaleL);

    const tx = nmToX(LAM_THRESH);
    ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(tx, scaleY - 4); ctx.lineTo(tx, scaleY + 4); ctx.stroke();
    ctx.fillStyle = '#ffd166'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(`threshold ${LAM_THRESH.toFixed(0)} nm`, tx, scaleY - 6);

    const cx = nmToX(lam);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(cx, scaleY, 3, 0, Math.PI * 2); ctx.fill();

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── FARADAY ────────────────────────────────
// A bar magnet slides in and out of a coil; the galvanometer needle
// deflects with −dΦ/dt. Needle rests at zero at the turnaround points
// (v = 0) AND when the magnet is centred inside the coil (dΦ/dy = 0),
// peaking halfway between — the exact physics of Faraday's law.
SIMS.faraday = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf;
  const t0 = performance.now();

  // Layout.
  const coilCx  = w * 0.34;
  const coilCy  = h * 0.50;
  const coilRx  = Math.min(74, w * 0.16);
  const coilRy  = 5;
  const N       = 8;
  const spacing = Math.min(11, (h * 0.45) / (N - 1));
  const coilTop = coilCy - (N - 1) / 2 * spacing;
  const coilBot = coilTop + (N - 1) * spacing;

  const meterCx = w * 0.74;
  const meterCy = h * 0.55;
  const meterR  = Math.min(62, Math.min(h * 0.30, w * 0.18));

  const magW    = coilRx * 0.95;
  const magHalf = 22;

  const AMP     = Math.min(120, h * 0.32);
  const PERIOD  = 3200; // ms
  const omega   = 2 * Math.PI / (PERIOD / 1000);

  // Bar-magnet on-axis dipole field ∝ 1 / (a² + z²)^{3/2}, summed over loops.
  const a2 = (coilRx * 0.9) ** 2;
  function flux(yMag) {
    let s = 0;
    for (let i = 0; i < N; i++) {
      const z = (coilTop + i * spacing) - yMag;
      s += 1 / Math.pow(a2 + z * z, 1.5);
    }
    return s;
  }
  // Empirical EMF normaliser so full-scale deflection matches the actual peak.
  let emfMax = 1e-9;

  function draw(now) {
    const t = (now - t0) / 1000;
    const yMag = coilCy + AMP * Math.sin(omega * t);
    const vMag = AMP * omega * Math.cos(omega * t);

    const dy = 1;
    const dPhi = (flux(yMag + dy) - flux(yMag - dy)) / (2 * dy);
    const emf  = -dPhi * vMag;
    emfMax = Math.max(emfMax, Math.abs(emf));
    const emfNorm = Math.max(-1, Math.min(1, emf / emfMax));

    ctx.clearRect(0, 0, w, h);

    // ── coil: back arcs (top half of ellipse) first ────────────────────
    ctx.strokeStyle = 'rgba(255, 210, 130, 0.90)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < N; i++) {
      const y = coilTop + i * spacing;
      ctx.beginPath();
      ctx.ellipse(coilCx, y, coilRx, coilRy, 0, Math.PI, 2 * Math.PI);
      ctx.stroke();
    }

    // ── magnet ────────────────────────────────────────────────────────
    const magTop = yMag - magHalf;
    ctx.fillStyle = '#ff5b5b';
    ctx.fillRect(coilCx - magW / 2, magTop, magW, magHalf);
    ctx.fillStyle = '#3aa1ff';
    ctx.fillRect(coilCx - magW / 2, yMag, magW, magHalf);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(coilCx - magW / 2 + 0.5, magTop + 0.5, magW - 1, magHalf * 2 - 1);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('N', coilCx, yMag - magHalf / 2);
    ctx.fillText('S', coilCx, yMag + magHalf / 2);

    // ── coil: front arcs (bottom half) drawn last, so they cross in front
    ctx.strokeStyle = 'rgba(255, 210, 130, 0.95)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < N; i++) {
      const y = coilTop + i * spacing;
      ctx.beginPath();
      ctx.ellipse(coilCx, y, coilRx, coilRy, 0, 0, Math.PI);
      ctx.stroke();
    }

    // ── wires from coil top/bottom to galvanometer ────────────────────
    ctx.strokeStyle = 'rgba(255,210,130,0.75)';
    ctx.lineWidth = 1.4;
    const wireX = coilCx + coilRx + 6;
    const meterInL = meterCx - meterR * 0.55;
    const meterInR = meterCx + meterR * 0.55;
    ctx.beginPath();
    ctx.moveTo(coilCx + coilRx, coilTop);
    ctx.lineTo(wireX, coilTop);
    ctx.lineTo(wireX, coilTop - 12);
    ctx.lineTo(meterInL, meterCy - meterR * 0.95);
    ctx.moveTo(coilCx + coilRx, coilBot);
    ctx.lineTo(wireX, coilBot);
    ctx.lineTo(wireX, coilBot + 12);
    ctx.lineTo(meterInR, meterCy - meterR * 0.95);
    ctx.stroke();

    // ── galvanometer body ─────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(meterCx, meterCy, meterR, Math.PI * 1.10, Math.PI * 1.90, false);
    ctx.moveTo(meterCx - meterR, meterCy);
    ctx.lineTo(meterCx + meterR, meterCy);
    ctx.stroke();
    // Ticks.
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    for (let k = -5; k <= 5; k++) {
      const a = Math.PI * 1.5 + k * (Math.PI * 0.4 / 5);
      const inner = (k === 0 || k === 5 || k === -5) ? meterR - 9 : meterR - 4;
      ctx.beginPath();
      ctx.moveTo(meterCx + Math.cos(a) * meterR, meterCy + Math.sin(a) * meterR);
      ctx.lineTo(meterCx + Math.cos(a) * inner, meterCy + Math.sin(a) * inner);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('−', meterCx - meterR * 0.82, meterCy - meterR * 0.02);
    ctx.fillText('+', meterCx + meterR * 0.82, meterCy - meterR * 0.02);
    ctx.fillText('0', meterCx, meterCy - meterR + 3);

    // Needle.
    const needleA = Math.PI * 1.5 + emfNorm * (Math.PI * 0.4);
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meterCx, meterCy);
    ctx.lineTo(meterCx + Math.cos(needleA) * (meterR - 6),
               meterCy + Math.sin(needleA) * (meterR - 6));
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(meterCx, meterCy, 3, 0, Math.PI * 2); ctx.fill();

    // Labels.
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('galvanometer', meterCx, meterCy + 22);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '10px system-ui';
    ctx.fillText('ε = −dΦ/dt', meterCx, meterCy + 38);
    ctx.textAlign = 'left';
    ctx.fillText('coil of N turns', coilCx - coilRx, coilBot + 26);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── ENTANGLEMENT ────────────────────────────
// Singlet Bell pair: source emits, Alice & Bob measure along tilted axes.
// Empirical ⟨A·B⟩ builds up on the theoretical −cos(Δθ) curve.
SIMS.entanglement = function (canvas) {
  const { ctx, w, h } = fit(canvas);
  let raf;
  const t0 = performance.now();

  const srcX = w * 0.50, srcY = h * 0.24;
  const aliceX = w * 0.13, bobX = w * 0.87;
  const detR   = Math.max(14, Math.min(22, w * 0.045));

  const NBINS  = 30;
  const bins   = Array.from({ length: NBINS }, () => ({ n: 0, s: 0 }));
  const pairs  = [];              // in-flight photon pairs
  const EMIT_MS = 320, TRANSIT_MS = 720;
  let lastEmit = 0, totalN = 0;

  let flashA = -1e9, flashB = -1e9;
  let lastA = 0, lastB = 0;

  const plotT = h * 0.54, plotB = h - 20;
  const plotL = Math.max(28, w * 0.10), plotR = w - 12;
  const midY  = (plotT + plotB) / 2;

  const xFromD = d => plotL + ((d + Math.PI) / (2 * Math.PI)) * (plotR - plotL);
  const yFromE = E => plotT + (1 - (E + 1) / 2) * (plotB - plotT);

  function drawDetector(cx, cy, angle, label, flashT, out) {
    const flashU = Math.max(0, 1 - (performance.now() - flashT) / 380);
    if (flashU > 0) {
      const col = out > 0 ? 'rgba(139, 195, 74,' : 'rgba(239, 154, 154,';
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, detR + 12);
      g.addColorStop(0, col + (0.55 * flashU) + ')');
      g.addColorStop(1, col + '0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, detR + 12, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(cx, cy, detR, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#82cfff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * detR, cy + Math.sin(angle) * detR);
    ctx.lineTo(cx - Math.cos(angle) * detR, cy - Math.sin(angle) * detR);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + detR + 14);
    ctx.fillStyle = 'rgba(255,255,255,0.50)'; ctx.font = '10px system-ui';
    ctx.fillText(`${Math.round(angle * 180 / Math.PI)}°`, cx, cy + detR + 26);
  }

  function draw(now) {
    const t = now - t0;

    if (now - lastEmit > EMIT_MS) { pairs.push({ born: now }); lastEmit = now; }

    const thetaA = 0;
    const thetaB = (t / 18000 * Math.PI * 2) % (Math.PI * 2);
    let dTheta   = thetaB - thetaA;
    while (dTheta >  Math.PI) dTheta -= 2 * Math.PI;
    while (dTheta <= -Math.PI) dTheta += 2 * Math.PI;

    for (let i = pairs.length - 1; i >= 0; i--) {
      const u = (now - pairs[i].born) / TRANSIT_MS;
      if (u >= 1) {
        const pSame = Math.sin(dTheta / 2) ** 2;
        const outA  = Math.random() < 0.5 ? +1 : -1;
        const outB  = (Math.random() < pSame) ? outA : -outA;
        const bIdx  = Math.min(NBINS - 1, Math.max(0,
          Math.floor(((dTheta + Math.PI) / (2 * Math.PI)) * NBINS)));
        bins[bIdx].n++; if (outA === outB) bins[bIdx].s++;
        totalN++;
        flashA = now; flashB = now; lastA = outA; lastB = outB;
        pairs.splice(i, 1);
      }
    }

    ctx.clearRect(0, 0, w, h);

    // Central source
    const sg = ctx.createRadialGradient(srcX, srcY, 0, srcX, srcY, 26);
    sg.addColorStop(0, 'rgba(233,30,99,0.75)');
    sg.addColorStop(1, 'rgba(233,30,99,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(srcX, srcY, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffb3d1';
    ctx.beginPath(); ctx.arc(srcX, srcY, 4.5, 0, Math.PI * 2); ctx.fill();

    // Beamline rails
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(aliceX + detR, srcY); ctx.lineTo(srcX - 10, srcY);
    ctx.moveTo(srcX + 10, srcY);     ctx.lineTo(bobX - detR, srcY);
    ctx.stroke();

    // In-flight pairs (dashed link hints at "shared fate")
    for (const p of pairs) {
      const u  = Math.max(0, Math.min(1, (now - p.born) / TRANSIT_MS));
      const ax = srcX + (aliceX - srcX) * u;
      const bx = srcX + (bobX   - srcX) * u;
      ctx.strokeStyle = 'rgba(184,130,255,0.22)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(ax, srcY); ctx.lineTo(bx, srcY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(200,160,255,0.90)';
      ctx.beginPath(); ctx.arc(ax, srcY, 3.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, srcY, 3.4, 0, Math.PI * 2); ctx.fill();
    }

    drawDetector(aliceX, srcY, thetaA, 'Alice', flashA, lastA);
    drawDetector(bobX,   srcY, thetaB, 'Bob',   flashB, lastB);

    ctx.fillStyle = '#eee'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Singlet Bell pair — Alice & Bob measure', 10, 16);

    // Plot frame
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(plotL, plotT); ctx.lineTo(plotL, plotB);
    ctx.moveTo(plotL, midY);  ctx.lineTo(plotR, midY);
    ctx.moveTo(plotL, plotB); ctx.lineTo(plotR, plotB);
    ctx.stroke();

    // Theoretical curve E = −cos(Δθ)
    ctx.strokeStyle = 'rgba(233,30,99,0.55)'; ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]); ctx.beginPath();
    for (let i = 0; i <= 96; i++) {
      const d = -Math.PI + (i / 96) * 2 * Math.PI;
      const x = xFromD(d), y = yFromE(-Math.cos(d));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Empirical bin points — E = 2·P(same) − 1
    ctx.fillStyle = '#82cfff';
    for (let i = 0; i < NBINS; i++) {
      if (bins[i].n < 2) continue;
      const E = 2 * bins[i].s / bins[i].n - 1;
      const d = -Math.PI + ((i + 0.5) / NBINS) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(xFromD(d), yFromE(E), 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Live Δθ cursor
    ctx.strokeStyle = 'rgba(130,207,255,0.40)'; ctx.setLineDash([2, 3]);
    const mx = xFromD(dTheta);
    ctx.beginPath(); ctx.moveTo(mx, plotT); ctx.lineTo(mx, plotB); ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('−180°', plotL + 12, plotB + 12);
    ctx.fillText('0°',    (plotL + plotR) / 2, plotB + 12);
    ctx.fillText('+180°', plotR - 16, plotB + 12);
    ctx.textAlign = 'right';
    ctx.fillText('+1', plotL - 4, plotT + 4);
    ctx.fillText(' 0', plotL - 4, midY + 4);
    ctx.fillText('−1', plotL - 4, plotB + 4);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#eee'; ctx.font = 'bold 11px system-ui';
    ctx.fillText('⟨A·B⟩ = −cos(θ_B − θ_A)', plotL + 4, plotT - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '11px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(`Δθ = ${Math.round(dTheta * 180 / Math.PI)}°   pairs: ${totalN}`,
                 plotR - 2, plotT - 4);

    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { stop() { cancelAnimationFrame(raf); } };
};

// ─────────────────────────── REGISTRY ────────────────────────────────
function startSim(name, canvas) {
  const factory = SIMS[name];
  if (!factory) return null;
  return factory(canvas);
}
