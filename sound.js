// Generative ambient audio + interaction sound effects.
// Everything synthesized on the fly — no samples, no network.
// Audio must be started inside a user gesture (browser policy),
// so Sound.init() is called on the intro "Begin" button.

const Sound = (function () {
  let ctx, master, musicBus, sfxBus, reverbBus;
  let started = false, muted = false;

  // A-minor pentatonic, multiple octaves — sounds "cosmic" and never clashes.
  const SCALE = [
    220.00, 261.63, 293.66, 329.63, 392.00,   // A3 C4 D4 E4 G4
    440.00, 523.25, 587.33, 659.25, 783.99,   // A4 C5 D5 E5 G5
    880.00, 1046.5, 1174.7, 1318.5, 1568.0,   // A5 C6 D6 E6 G6
  ];

  // ─── a convolution reverb, built from a decaying noise buffer ─────────
  function makeReverb(duration = 3.2, decay = 2.5) {
    const sr = ctx.sampleRate;
    const len = sr * duration;
    const buf = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  // ─── init: build graph, start drone/pad/noise ─────────────────────────
  function init() {
    if (started) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);

    // reverb send bus
    const reverb = makeReverb(4.2, 2.8);
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.45;
    reverb.connect(wetGain).connect(master);
    reverbBus = reverb;

    musicBus = ctx.createGain();
    musicBus.gain.value = 0; // fade in
    musicBus.connect(master);
    musicBus.connect(reverbBus);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.6;
    sfxBus.connect(master);
    sfxBus.connect(reverbBus);

    buildDrone();
    buildPad();
    buildNoise();
    scheduleBells();
    scheduleHarmony();

    musicBus.gain.setValueAtTime(0, ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(1, ctx.currentTime + 4);

    started = true;
  }

  // ─── deep drone (root + fifth) ────────────────────────────────────────
  function buildDrone() {
    const now = ctx.currentTime;
    [55, 82.4, 110].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = [0.18, 0.08, 0.06][i];
      osc.connect(g).connect(musicBus);
      osc.start(now);

      // very slow vibrato
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.6;
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start(now);
    });
  }

  // ─── evolving chord pad (triangle waves through a sweeping LPF) ───────
  let padOscs = [];
  function buildPad() {
    const now = ctx.currentTime;
    // A minor ninth-ish
    [220, 261.63, 329.63, 440, 587.33].forEach((f, i) => {
      const o1 = ctx.createOscillator();
      o1.type = 'triangle';
      o1.frequency.value = f;
      o1.detune.value = (Math.random() - 0.5) * 14;
      const o2 = ctx.createOscillator();
      o2.type = 'sawtooth';
      o2.frequency.value = f;
      o2.detune.value = (Math.random() - 0.5) * 24;

      const g = ctx.createGain();
      g.gain.value = 0.025;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      filter.Q.value = 3;

      o1.connect(filter);
      o2.connect(filter);
      filter.connect(g).connect(musicBus);
      o1.start(now); o2.start(now);
      padOscs.push({ o1, o2, filter, g });

      // slow filter sweep
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + Math.random() * 0.04;
      const lg = ctx.createGain();
      lg.gain.value = 600 + Math.random() * 400;
      lfo.connect(lg).connect(filter.frequency);
      lfo.start(now);
    });
  }

  // transpose pad periodically through cosmic changes
  function scheduleHarmony() {
    const progression = [
      [220, 261.63, 329.63, 440,   587.33],  // Am9
      [174.61, 220, 261.63, 349.23, 523.25], // Fmaj7
      [196.00, 246.94, 293.66, 392,  493.88], // Gmaj
      [164.81, 196.00, 261.63, 329.63, 493.88],// Em
    ];
    let i = 0;
    function change() {
      if (!started) return;
      const chord = progression[i % progression.length];
      padOscs.forEach((p, j) => {
        if (p.o1 && chord[j]) {
          p.o1.frequency.exponentialRampToValueAtTime(chord[j], ctx.currentTime + 3);
          p.o2.frequency.exponentialRampToValueAtTime(chord[j], ctx.currentTime + 3);
        }
      });
      i++;
      setTimeout(change, 14000);
    }
    setTimeout(change, 10000);
  }

  // ─── space wind (filtered pink noise) ─────────────────────────────────
  function buildNoise() {
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, sr * 4, sr);
    const d = buf.getChannelData(0);
    // pink-ish
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.96300 * b1 + w * 0.2965164;
      b2 = 0.57000 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.15;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 700;
    f.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    src.connect(f).connect(g).connect(musicBus);
    src.start();

    // slow filter sweep for "wind"
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.03;
    const lg = ctx.createGain();
    lg.gain.value = 400;
    lfo.connect(lg).connect(f.frequency);
    lfo.start();
  }

  // ─── occasional bells (random notes from scale) ───────────────────────
  function scheduleBells() {
    function tick() {
      if (!started) return;
      const f = SCALE[8 + Math.floor(Math.random() * 6)]; // C5..G5
      bell(f, 0.06, 3.2);
      setTimeout(tick, 5000 + Math.random() * 9000);
    }
    setTimeout(tick, 3500);
  }

  // ─── primitive voices ─────────────────────────────────────────────────
  function bell(freq, vol = 0.1, dur = 2.0) {
    if (!started) return;
    const now = ctx.currentTime;
    // fundamental
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(sfxBus);
    o.start(now);
    o.stop(now + dur);
    // harmonic (adds bell shimmer)
    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = freq * 2.76;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(vol * 0.35, now + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.7);
    o2.connect(g2).connect(sfxBus);
    o2.start(now);
    o2.stop(now + dur * 0.7);
  }

  function pluck(freq, vol = 0.08) {
    if (!started) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = freq;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = freq * 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    o.connect(f).connect(g).connect(sfxBus);
    o.start(now);
    o.stop(now + 0.6);
  }

  function sweep(from, to, dur = 0.6, vol = 0.07) {
    if (!started) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(from, now);
    o.frequency.exponentialRampToValueAtTime(to, now + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(sfxBus);
    o.start(now);
    o.stop(now + dur);
  }

  function whoosh(up = true) {
    if (!started) return;
    const now = ctx.currentTime;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, sr * 0.8, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 3;
    f.frequency.setValueAtTime(up ? 300 : 1400, now);
    f.frequency.exponentialRampToValueAtTime(up ? 1800 : 220, now + 0.7);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    src.connect(f).connect(g).connect(sfxBus);
    src.start(now);
    src.stop(now + 0.8);
  }

  // ─── public SFX ───────────────────────────────────────────────────────
  function hover(depth = 0) {
    if (!started) return;
    // depth-based pitch: deeper nodes get higher chimes
    const idx = Math.min(SCALE.length - 1, 7 + depth);
    pluck(SCALE[idx], 0.03);
  }
  function click(depth = 0) {
    if (!started) return;
    const idx = Math.min(SCALE.length - 1, 5 + depth);
    bell(SCALE[idx],     0.09, 2.4);
    setTimeout(() => bell(SCALE[idx + 2] || SCALE[idx], 0.05, 1.8), 70);
  }
  function openPanel() { sweep(200, 900, 0.5, 0.08); whoosh(true); }
  function closePanel() { sweep(800, 180, 0.4, 0.06); whoosh(false); }
  function zoom(dir) { pluck(dir > 0 ? 700 : 350, 0.015); }

  function toggleMute() {
    if (!started) return false;
    muted = !muted;
    master.gain.linearRampToValueAtTime(muted ? 0 : 0.55, ctx.currentTime + 0.3);
    return muted;
  }

  return {
    init, hover, click, openPanel, closePanel, zoom, toggleMute,
    get started() { return started; },
    get muted()   { return muted;   },
  };
})();
