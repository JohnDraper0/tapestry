// Tapestry 3D mode — a spiral staircase through the knowledge tower,
// rendered with three.js. Loaded lazily when the user hits "3D".
// Clicking nodes still opens the regular detail panel.

const Tapestry3D = (function () {
  let THREE, renderer, scene, camera, active = false, canvas;
  let nodes3d = [];
  let raycaster, mouse, onClickHandler;
  let angleOffset = 0;

  async function loadThree() {
    if (THREE) return THREE;
    const mod = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    THREE = mod;
    return THREE;
  }

  async function enter() {
    if (active) return;
    await loadThree();
    canvas = document.createElement('canvas');
    canvas.id = 'map3d';
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:1;cursor:grab;';
    document.body.appendChild(canvas);

    const W = window.innerWidth, H = window.innerHeight;
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x04060e, 0);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x04060e, 80, 400);

    camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 1000);
    camera.position.set(0, -40, 80);
    camera.lookAt(0, 0, 0);

    // ambient + key light
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.PointLight(0x64ffda, 2.2, 400);
    key.position.set(0, 60, 40);
    scene.add(key);
    const fill = new THREE.PointLight(0xffb74d, 1.0, 400);
    fill.position.set(-80, -40, 60);
    scene.add(fill);

    buildTower();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    onClickHandler = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nodes3d.map(n => n.mesh));
      if (hits.length) {
        const n = nodes3d.find(x => x.mesh === hits[0].object);
        if (n && typeof window.__openPanel === 'function') {
          window.__openPanel(n.law);
        }
      }
    };
    canvas.addEventListener('click', onClickHandler);

    // orbit controls — simple drag to spin
    let dragging = false, lastX = 0, lastY = 0;
    let camAngle = 0, camHeight = -40, camDist = 80;
    canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
    canvas.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      camAngle += (e.clientX - lastX) * 0.005;
      camHeight += (e.clientY - lastY) * 0.4;
      lastX = e.clientX; lastY = e.clientY;
    });
    canvas.addEventListener('mouseup', () => dragging = false);
    canvas.addEventListener('wheel', (e) => {
      camDist = Math.max(30, Math.min(220, camDist + e.deltaY * 0.1));
      e.preventDefault();
    }, { passive: false });

    active = true;
    function animate() {
      if (!active) return;
      angleOffset += 0.001;
      camera.position.x = Math.sin(camAngle) * camDist;
      camera.position.z = Math.cos(camAngle) * camDist;
      camera.position.y = camHeight;
      camera.lookAt(0, 0, 0);
      // gentle node bob
      nodes3d.forEach((n, i) => {
        n.mesh.rotation.y += 0.01;
        n.glow.material.opacity = 0.35 + 0.15 * Math.sin(angleOffset * 5 + i);
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  function buildTower() {
    nodes3d = [];
    // Use the same LAWS array the 2D view uses.
    const laws = window.LAWS || [];
    const maxLayer = Math.max(...laws.map(l => l.layer || 0));
    const radius = 28;

    laws.forEach((l, idx) => {
      // spiral parameters
      const layer = l.layer || 0;
      const domainAngle = (['math','principle','mechanics','thermo','em','relativity','quantum','forces','chemistry','biology','info','emergence','cosmos','unknown']
        .indexOf(l.domain) / 14) * Math.PI * 2;
      const twist = layer * 0.35;
      const angle = domainAngle + twist;
      const y = layer * 6 - maxLayer * 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const color = parseInt((window.DOMAINS[l.domain].color || '#64ffda').slice(1), 16);
      const geo = new THREE.SphereGeometry(1.6, 24, 18);
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.4,
        metalness: 0.3, roughness: 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);

      // halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(2.6, 16, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })
      );
      halo.position.copy(mesh.position);
      scene.add(halo);

      nodes3d.push({ law: l, mesh, glow: halo });
    });

    // dependency edges as thin lines
    laws.forEach(l => {
      (l.deps || []).forEach(depId => {
        const a = nodes3d.find(n => n.law.id === l.id);
        const b = nodes3d.find(n => n.law.id === depId);
        if (!a || !b) return;
        const g = new THREE.BufferGeometry().setFromPoints([a.mesh.position, b.mesh.position]);
        const color = parseInt((window.DOMAINS[l.domain].color || '#64ffda').slice(1), 16);
        const line = new THREE.Line(g,
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 }));
        scene.add(line);
      });
    });
  }

  function exit() {
    if (!active) return;
    active = false;
    canvas.removeEventListener('click', onClickHandler);
    renderer.dispose();
    canvas.remove();
    nodes3d = [];
  }

  return { enter, exit, isActive: () => active };
})();
