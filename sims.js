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

// ─────────────────────────── REGISTRY ────────────────────────────────
function startSim(name, canvas) {
  const factory = SIMS[name];
  if (!factory) return null;
  return factory(canvas);
}
