import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { triplanar, impostorMaterial } from "../project3d/materials";

// A small, realistic floating "slice of land" used as a hero 3D model across the site.
// Variants: "home" (modern house on a plot), "pin" (office + map pin), "layout" (plots where homes keep rising).

const BASE = "/flythrough";
const DEG = Math.PI / 180;
const SUN = new THREE.Vector3(Math.cos(48 * DEG) * Math.cos(-43 * DEG), Math.sin(48 * DEG), Math.cos(48 * DEG) * Math.sin(-43 * DEG));
const _m = new THREE.Matrix4();
const easeOutBack = (t) => {
  const c1 = 1.6, c3 = c1 + 1;
  return t <= 0 ? 0 : t >= 1 ? 1 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

let assetCache = null;
function loadShared(renderer) {
  if (assetCache) return assetCache;
  const tl = new THREE.TextureLoader();
  const tex = (n, srgb = true) =>
    tl.loadAsync(`${BASE}/tex/${n}.webp`).then((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 8;
      return [n, t];
    });
  const names = ["lawn", "dirt", "plaster", "concrete", "wood", "paver", "asphalt", "brick", "wall", "stone"];
  assetCache = Promise.all([
    Promise.all(names.map((n) => tex(n))).then(Object.fromEntries),
    new HDRLoader().loadAsync(`${BASE}/sky/day.hdr`),
    tl.loadAsync(`${BASE}/trees/jacaranda.webp`).then((t) => ((t.colorSpace = THREE.SRGBColorSpace), t)),
    tl.loadAsync(`${BASE}/trees/searsia.webp`).then((t) => ((t.colorSpace = THREE.SRGBColorSpace), t)),
    fetch(`${BASE}/trees/trees.json`).then((r) => r.json()),
  ]).then(([t, hdr, jac, sea, meta]) => ({ tex: t, hdr, atlas: { jac, sea }, meta }));
  assetCache.catch(() => (assetCache = null));
  return assetCache;
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, "rgba(15,23,42,0.45)");
  grd.addColorStop(0.55, "rgba(15,23,42,0.18)");
  grd.addColorStop(1, "rgba(15,23,42,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function signTexture(text, sub) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#1e40af";
  g.fillRect(0, 0, 1024, 256);
  g.fillStyle = "#f97316";
  g.fillRect(0, 230, 1024, 26);
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `600 96px Poppins, Arial, sans-serif`;
  g.fillText(text, 512, sub ? 100 : 118);
  if (sub) {
    g.font = `500 44px Poppins, Arial, sans-serif`;
    g.fillStyle = "#fed7aa";
    g.fillText(sub, 512, 180);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default class DioramaScene {
  constructor(canvas, { variant = "home", onReady, isMobile = false } = {}) {
    this.canvas = canvas;
    this.variant = variant;
    this.onReady = onReady;
    this.isMobile = isMobile;
    this.running = false;
    this.disposed = false;
    this.time = 0;
    this.yaw = -0.5;
    this.yawVel = 0;
    this.dragging = false;
    this.pointer = new THREE.Vector2();
    this.tilt = new THREE.Vector2();
    this.hover = 0;
    this.scrollYaw = 0;
    this.rising = [];
    this.tick = this.tick.bind(this);
  }

  async init() {
    const r = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer = r;
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 1.75));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(26, 1, 1, 400);
    const A = await loadShared(r);
    if (this.disposed) return;
    this.A = A;
    const pmrem = new THREE.PMREMGenerator(r);
    this.env = pmrem.fromEquirectangular(A.hdr).texture;
    pmrem.dispose();
    this.scene.environment = this.env;
    this.scene.environmentIntensity = 0.95;
    this.scene.environmentRotation.set(0, 77.3 * DEG, 0);

    const sun = new THREE.DirectionalLight("#fff3e0", 2.4);
    sun.position.copy(SUN).multiplyScalar(40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = sc.bottom = -13;
    sc.right = sc.top = 13;
    sc.near = 5;
    sc.far = 90;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 3;
    this.scene.add(sun);
    this.sun = sun;

    this.root = new THREE.Group();
    this.model = new THREE.Group();
    this.root.add(this.model);
    this.scene.add(this.root);

    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -4.2;
    this.contactShadow = shadow;
    this.scene.add(shadow);

    this.buildMaterials();
    this.buildTile();
    if (this.variant === "pin") this.buildPin();
    else if (this.variant === "layout") this.buildLayout();
    else this.buildHome();
    this.resize();
    // Upload textures a few per frame and compile shaders asynchronously so the page never stutters.
    const nextFrame = () => new Promise((res) => requestAnimationFrame(res));
    let budget = performance.now();
    for (const t of [...Object.values(A.tex), A.atlas.jac, A.atlas.sea]) {
      r.initTexture(t);
      if (performance.now() - budget > 10) {
        await nextFrame();
        if (this.disposed) return;
        budget = performance.now();
      }
    }
    await r.compileAsync(this.scene, this.camera);
    if (this.disposed) return;
    this.renderFrame();
    this.ready = true;
    this.onReady?.();
  }

  // ---- materials ------------------------------------------------------------
  buildMaterials() {
    const t = this.A.tex;
    const std = (color, roughness = 0.85, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
    this.M = {
      soil: triplanar(std("#c19670", 1), { map: t.dirt, scale: 3, mode: "detail", amount: 0.9, mean: 0.12 }),
      soilDark: triplanar(std("#7c563c", 1), { map: t.dirt, scale: 2.5, mode: "detail", amount: 0.9, mean: 0.12 }),
      grass: triplanar(std("#7fae52", 1), { map: t.lawn, scale: 3.5, mode: "detail", amount: 0.9, mean: 0.2 }),
      asphalt: triplanar(std("#8a8f96", 0.92), { map: t.asphalt, scale: 4, mode: "detail", amount: 0.8, mean: 0.06 }),
      paver: triplanar(std("#c4b9a8", 0.9), { map: t.paver, scale: 1.6, mode: "detail", amount: 0.9, mean: 0.09 }),
      plaster: triplanar(std("#f4efe6", 0.9), { map: t.plaster, scale: 2.2, mode: "detail", amount: 0.55, mean: 0.157 }),
      plasterWarm: triplanar(std("#efe2cf", 0.9), { map: t.plaster, scale: 2.2, mode: "detail", amount: 0.55, mean: 0.157 }),
      concrete: triplanar(std("#d7d3cc", 0.95), { map: t.concrete, scale: 2.4, mode: "detail", amount: 0.85, mean: 0.157 }),
      wall: triplanar(std("#efe8dc", 0.9), { map: t.wall, scale: 2, mode: "detail", amount: 0.6, mean: 0.387 }),
      wood: triplanar(std("#8a5a36", 0.55), { map: t.wood, scale: 1.1, mode: "detail", amount: 0.8, mean: 0.034 }),
      stone: triplanar(std("#b8b2a8", 0.8), { map: t.stone, scale: 1.4, mode: "detail", amount: 0.8, mean: 0.1 }),
      brick: triplanar(std("#ffffff", 0.9), { map: t.brick, scale: 1.2 }),
      glass: new THREE.MeshStandardMaterial({ color: "#26405a", roughness: 0.04, metalness: 0.9, emissive: new THREE.Color("#ffbf73"), emissiveIntensity: 0.08 }),
      dark: std("#232b36", 0.35, 0.6),
      white: std("#f8fafc", 0.5),
      accent: std("#f97316", 0.45),
      blue: std("#1e40af", 0.5),
      paint: new THREE.MeshPhysicalMaterial({ color: "#1d4ed8", roughness: 0.25, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.05 }),
      tyre: std("#111827", 0.9),
      lamp: new THREE.MeshStandardMaterial({ color: "#fff7e6", emissive: new THREE.Color("#ffc97a"), emissiveIntensity: 1.6 }),
      railGlass: new THREE.MeshPhysicalMaterial({ color: "#d6ecff", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35, depthWrite: false }),
      solar: std("#1b2f6b", 0.12, 0.75),
      tank: std("#1f2937", 0.5),
      pin: new THREE.MeshPhysicalMaterial({ color: "#f97316", roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08, emissive: new THREE.Color("#c2410c"), emissiveIntensity: 0.25 }),
    };
    const meta = this.A.meta;
    this.jacMat = impostorMaterial(this.A.atlas.jac, meta.jacaranda, 0);
    this.jacMat.color.setScalar(1.3);
    this.seaMats = [0, 1].map((v) => {
      const m = impostorMaterial(this.A.atlas.sea, meta.searsia, v);
      m.color.setScalar(1.25);
      return m;
    });
    this.quad = new THREE.PlaneGeometry(1, 1);
  }

  box(w, h, d, x, y, z, mat, parent = this.model, { cast = true, round = 0 } = {}) {
    const geo = round ? new RoundedBoxGeometry(w, h, d, 2, round) : new THREE.BoxGeometry(w, h, d);
    geo.translate(0, h / 2, 0);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  tree(x, z, s, parent = this.model) {
    const card = new THREE.InstancedMesh(this.quad, this.jacMat, 1);
    card.setMatrixAt(0, _m.makeScale(s, s, s));
    card.frustumCulled = false;
    card.position.set(x, 0, z);
    parent.add(card);
    const v = this.A.meta.jacaranda.variants[0];
    const proxy = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
    proxy.scale.set(v.rxz * s * 0.7, v.height * s * 0.3, v.rxz * s * 0.7);
    proxy.position.set(x, v.height * s * 0.62, z);
    proxy.castShadow = true;
    parent.add(proxy);
    return card;
  }

  bush(x, z, s, variant = 0, parent = this.model) {
    const card = new THREE.InstancedMesh(this.quad, this.seaMats[variant], 1);
    card.setMatrixAt(0, _m.makeScale(s, s, s));
    card.frustumCulled = false;
    card.position.set(x, 0, z);
    parent.add(card);
  }

  // ---- floating slice of land ------------------------------------------------
  buildTile() {
    const M = this.M;
    const S = 16;
    this.box(S, 2.4, S, 0, -3.0, 0, M.soilDark, this.model, { round: 0.5 });
    this.box(S + 0.06, 0.9, S + 0.06, 0, -1.2, 0, M.soil, this.model, { round: 0.35 });
    this.box(S + 0.1, 0.35, S + 0.1, 0, -0.33, 0, M.grass, this.model, { round: 0.17 });
    // road + footpath across the front edge
    this.box(S, 0.06, 3.4, 0, 0, 6.3, M.asphalt, this.model, { cast: false });
    for (let x = -7; x < 7.5; x += 2.4) this.box(1.2, 0.02, 0.14, x, 0.06, 6.3, M.white, this.model, { cast: false });
    this.box(S, 0.12, 1.3, 0, 0, 4.0, M.paver, this.model, { cast: false });
    this.box(S, 0.18, 0.18, 0, 0, 4.7, M.concrete, this.model, { cast: false });
    // street lamp
    this.box(0.14, 5.2, 0.14, -6.6, 0, 4.2, M.dark);
    this.box(1.4, 0.1, 0.12, -6.0, 5.1, 4.2, M.dark);
    this.box(0.6, 0.12, 0.3, -5.4, 4.98, 4.2, M.lamp, this.model, { cast: false });
  }

  compoundWall(x0, x1, z0, z1, gate = [-1.6, 1.8]) {
    const M = this.M;
    const h = 1.15, t = 0.18;
    this.box(gate[0] - x0, h, t, (x0 + gate[0]) / 2, 0, z1, M.wall);
    this.box(x1 - gate[1], h, t, (gate[1] + x1) / 2, 0, z1, M.wall);
    this.box(x1 - x0, h, t, (x0 + x1) / 2, 0, z0, M.wall);
    this.box(t, h, z1 - z0, x0, 0, (z0 + z1) / 2, M.wall);
    this.box(t, h, z1 - z0, x1, 0, (z0 + z1) / 2, M.wall);
    for (const x of gate) {
      this.box(0.42, 1.6, 0.42, x, 0, z1, M.stone);
      this.box(0.46, 0.08, 0.46, x, 1.6, z1, M.accent);
      this.box(0.24, 0.24, 0.24, x, 1.68, z1, M.lamp, this.model, { cast: false });
    }
    const gateW = gate[1] - gate[0] - 0.5;
    const g = this.box(gateW, 1.3, 0.06, (gate[0] + gate[1]) / 2, 0.08, z1 - 0.05, M.dark);
    for (let i = 0; i < 4; i++) this.box(gateW, 0.05, 0.02, 0, 0.25 + i * 0.28 - 0.08, 0.04, M.accent, g, { cast: false });
  }

  // ---- variant: modern home ------------------------------------------------------
  buildHome() {
    const M = this.M;
    const H = new THREE.Group();
    this.model.add(H);
    this.compoundWall(-7.2, 7.2, -7.2, 3.3);
    this.box(3.1, 0.06, 5.2, 0.1, 0, 0.7, M.paver, H, { cast: false });
    // plinth + ground floor
    this.box(8.6, 0.5, 6.6, 0, 0, -3.6, M.concrete, H);
    this.box(8.0, 3.0, 6.0, 0, 0.5, -3.7, M.plaster, H);
    this.box(3.4, 2.0, 0.08, 1.9, 1.1, -0.66, M.glass, H, { cast: false });
    this.box(3.6, 0.08, 0.6, 1.9, 3.15, -0.4, M.concrete, H);
    this.box(1.1, 2.3, 0.1, -2.6, 0.5, -0.66, M.wood, H);
    this.box(1.1, 3.0, 0.12, -1.5, 0.5, -0.63, M.stone, H);
    this.box(2.6, 0.18, 1.8, -2.6, 3.0, 0.1, M.dark, H);
    for (let i = 0; i < 3; i++) this.box(1.4, 0.16, 0.4, -2.6, 0.5 - (i + 1) * 0.16, -0.4 + i * 0.35, M.concrete, H, { cast: false });
    // first floor (cantilevered forward)
    this.box(8.8, 0.3, 7.4, 0, 3.5, -3.1, M.concrete, H);
    this.box(8.0, 3.0, 6.2, 0, 3.8, -3.3, M.plasterWarm, H);
    this.box(4.4, 2.3, 0.08, -1.4, 4.1, -0.17, M.glass, H, { cast: false });
    this.box(2.6, 3.0, 0.14, 2.7, 3.8, -0.14, M.wood, H);
    for (let i = 0; i < 9; i++) this.box(0.08, 2.9, 0.1, 1.55 + i * 0.29, 3.85, -0.02, M.wood, H, { cast: false });
    this.box(4.8, 0.2, 1.4, -1.4, 3.6, 0.5, M.concrete, H);
    this.box(4.8, 1.0, 0.05, -1.4, 3.8, 1.18, M.railGlass, H, { cast: false });
    this.box(4.8, 0.06, 0.1, -1.4, 4.8, 1.18, M.dark, H);
    this.box(0.35, 3.3, 1.9, -4.2, 3.5, -0.9, M.dark, H);
    // side windows
    for (const z of [-2.2, -5.0]) {
      this.box(0.08, 1.4, 1.6, 4.02, 1.2, z, M.glass, H, { cast: false });
      this.box(0.08, 1.4, 1.6, 4.02, 4.3, z, M.glass, H, { cast: false });
    }
    // roof: slab, parapet, stair cabin, tank, solar
    this.box(8.8, 0.3, 7.4, 0, 6.8, -3.1, M.concrete, H);
    this.box(8.8, 0.8, 0.16, 0, 7.1, 0.52, M.plaster, H);
    this.box(8.8, 0.12, 0.18, 0, 7.55, 0.55, M.accent, H, { cast: false });
    this.box(8.8, 0.8, 0.16, 0, 7.1, -6.72, M.plaster, H);
    this.box(0.16, 0.8, 7.4, -4.32, 7.1, -3.1, M.plaster, H);
    this.box(0.16, 0.8, 7.4, 4.32, 7.1, -3.1, M.plaster, H);
    this.box(2.6, 2.4, 2.6, -2.5, 7.1, -5.0, M.plaster, H);
    this.box(2.9, 0.16, 2.9, -2.5, 9.5, -5.0, M.concrete, H);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.1, 20).translate(0, 0.55, 0), M.tank);
    tank.position.set(-2.8, 9.66, -5.2);
    tank.castShadow = true;
    H.add(tank);
    for (let i = 0; i < 3; i++) {
      const p = this.box(1.1, 0.06, 1.8, 0.6 + i * 1.25, 7.5, -3.4, M.solar, H);
      p.rotation.x = -0.3;
    }
    // car
    const car = new THREE.Group();
    car.position.set(0.1, 0.06, 1.6);
    H.add(car);
    this.box(1.8, 0.75, 4.0, 0, 0.32, 0, M.paint, car, { round: 0.22 });
    this.box(1.6, 0.6, 2.1, 0, 1.0, -0.25, M.glass, car, { round: 0.2 });
    for (const [x, z] of [[-0.86, 1.25], [0.86, 1.25], [-0.86, -1.25], [0.86, -1.25]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16).rotateZ(Math.PI / 2), M.tyre);
      w.position.set(x, 0.34, z);
      car.add(w);
    }
    // greenery
    this.tree(-5.6, -6.0, 0.24);
    this.tree(5.8, 1.9, 0.17);
    this.tree(5.9, -6.2, 0.2);
    [[-6.4, 1.5, 0], [-6.4, -1.5, 1], [-6.4, -4, 0], [6.5, -3.2, 1], [3.6, 2.6, 0], [-3.9, 2.7, 1]].forEach(([x, z, v]) => this.bush(x, z, 0.9 + (v ? 0.1 : 0.2), v));
    H.traverse((o) => (o.receiveShadow = true));
  }

  // ---- variant: office with a map pin (contact) ----------------------------------------
  buildPin() {
    const M = this.M;
    this.compoundWall(-7.2, 7.2, -7.2, 3.3, [-2.2, 2.2]);
    this.box(4.2, 0.06, 5.5, 0, 0, 0.6, M.paver, this.model, { cast: false });
    this.box(10, 0.4, 6, 0, 0, -4, M.concrete);
    this.box(9.4, 3.4, 5.4, 0, 0.4, -4.1, M.plaster);
    this.box(6.6, 2.3, 0.08, -0.6, 0.9, -1.36, M.glass, this.model, { cast: false });
    this.box(1.3, 2.5, 0.12, 3.6, 0.4, -1.34, M.wood);
    this.box(10.2, 0.3, 6.4, 0, 3.8, -4, M.concrete);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.6), new THREE.MeshStandardMaterial({ map: signTexture("DANGE ASSOCIATES", "Kalmeshwar"), roughness: 0.5, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.12 }));
    sign.material.emissiveMap = sign.material.map;
    sign.position.set(0, 3.2, -1.3);
    this.model.add(sign);
    this.tree(-5.6, -6, 0.22);
    this.tree(5.6, -6.1, 0.2);
    this.tree(6.1, 1.8, 0.15);
    [[-6.2, 1.6, 0], [-6.3, -1.4, 1], [4.2, 2.6, 0]].forEach(([x, z, v]) => this.bush(x, z, 1, v));
    // the pin
    const pin = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.35, 40, 24), M.pin);
    head.position.y = 2.3;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.6, 40).rotateX(Math.PI), M.pin);
    tip.position.y = 0.75;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), M.white);
    dot.position.set(0, 2.3, 1.05);
    [head, tip, dot].forEach((m) => (m.castShadow = true));
    pin.add(head, tip, dot);
    pin.position.set(0, 6.6, -2.5);
    this.model.add(pin);
    this.pin = pin;
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.15, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#f97316", transparent: true, depthWrite: false }));
    ring.position.set(0, 4.15, -2.5);
    this.model.add(ring);
    this.ring = ring;
  }

  // ---- variant: plots where homes keep rising (about) --------------------------------------
  buildLayout() {
    const M = this.M;
    // internal road splitting two rows of plots
    this.box(16, 0.06, 2.6, 0, 0, -1.6, M.asphalt, this.model, { cast: false });
    for (let x = -7; x < 7.5; x += 2.4) this.box(1.1, 0.02, 0.12, x, 0.06, -1.6, M.white, this.model, { cast: false });
    const plots = [];
    for (const z of [-5.2, 1.3]) for (const x of [-5.4, 0, 5.4]) plots.push([x, z]);
    const face = (z) => (z < -1.6 ? 1 : -1);
    plots.forEach(([x, z], i) => {
      this.box(5.1, 0.08, 3.2, x, 0, z, M.soil, this.model, { cast: false });
      for (const dx of [-2.55, 2.55]) for (const dz of [-1.6, 1.6]) {
        this.box(0.14, 0.45, 0.14, x + dx, 0, z + dz, M.white);
        this.box(0.16, 0.1, 0.16, x + dx, 0.45, z + dz, M.accent, this.model, { cast: false });
      }
      const g = new THREE.Group();
      g.position.set(x, 0.08, z);
      this.model.add(g);
      const f = face(z);
      this.box(3.8, 2.6 + (i % 3) * 0.6, 2.4, 0, 0, -0.1 * f, i % 2 ? M.plaster : M.plasterWarm, g);
      const top = 2.6 + (i % 3) * 0.6;
      this.box(4.1, 0.18, 2.7, 0, top, -0.1 * f, M.concrete, g);
      this.box(1.8, 1.0, 0.06, 0.6, 0.9, 1.1 * f, M.glass, g, { cast: false });
      this.box(0.8, 1.7, 0.08, -1.2, 0, 1.1 * f, M.wood, g);
      this.box(0.9, 0.9, 0.9, -1.1, top + 0.18, -0.6 * f, M.plaster, g);
      g.scale.y = 0.001;
      this.rising.push({ g, delay: i * 0.55 });
    });
    this.tree(-7.0, 5.0, 0.16);
    this.tree(7.0, -7.2, 0.18);
    this.tree(-7.2, -7.0, 0.15);
    this.bush(7.0, 4.6, 1.1, 0);
  }

  // ---- interaction --------------------------------------------------------------------------
  setPointer(x, y) {
    this.pointer.set(x, y);
  }
  setHover(h) {
    this.hover = h ? 1 : 0;
  }
  setScroll(p) {
    this.scrollYaw = p;
  }
  dragBy(dx) {
    this.yawVel = dx * 0.012;
    this.yaw += dx * 0.012;
  }
  setDragging(d) {
    this.dragging = d;
  }

  start() {
    if (this.running || !this.ready || this.disposed) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!this.renderer || !parent) return;
    const w = parent.clientWidth, h = parent.clientHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / Math.max(1, h);
    this.camera.aspect = aspect;
    // keep the whole slice in frame for any aspect ratio
    const dist = aspect < 1 ? 62 / Math.max(aspect, 0.55) : 58;
    const dir = new THREE.Vector3(0.62, 0.5, 0.6).normalize();
    this.camera.position.copy(dir.multiplyScalar(dist));
    this.camera.lookAt(0, this.variant === "pin" ? 1.8 : 1.2, 0);
    this.camera.updateProjectionMatrix();
  }

  tick() {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    const t = this.time;
    if (!this.dragging) {
      this.yawVel *= Math.pow(0.04, dt);
      this.yaw += this.yawVel + dt * 0.16;
    }
    this.tilt.lerp(this.pointer, 1 - Math.exp(-dt * 4));
    const hov = (this.hoverS = (this.hoverS || 0) + (this.hover - (this.hoverS || 0)) * (1 - Math.exp(-dt * 6)));
    this.root.rotation.set(-this.tilt.y * 0.12, this.yaw + this.tilt.x * 0.35 + this.scrollYaw * 1.2, 0);
    const bob = Math.sin(t * 1.1) * 0.35;
    this.root.position.y = bob;
    this.root.scale.setScalar(1 + hov * 0.04);
    this.contactShadow.scale.setScalar(1 - bob * 0.04 + hov * 0.03);
    this.contactShadow.material.opacity = 0.9 - bob * 0.1;
    if (this.pin) {
      this.pin.position.y = 6.6 + Math.sin(t * 2) * 0.45;
      this.pin.rotation.y = t * 1.3;
      const k = (t * 0.7) % 1;
      this.ring.scale.setScalar(1 + k * 3.5);
      this.ring.material.opacity = (1 - k) * 0.8;
    }
    if (this.rising.length) {
      const cycle = 9;
      const c = t % cycle;
      for (const r of this.rising) {
        const up = easeOutBack(Math.min(1, Math.max(0, (c - r.delay) / 0.9)));
        const down = Math.min(1, Math.max(0, (c - (cycle - 0.8)) / 0.6));
        r.g.scale.y = Math.max(0.001, up * (1 - down));
      }
    }
    this.renderFrame();
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    if (!this.scene) return;
    this.scene.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      mats.forEach((m) => {
        if (m.map && !Object.values(this.A?.tex || {}).includes(m.map) && m.map !== this.A?.atlas?.jac && m.map !== this.A?.atlas?.sea) m.map.dispose();
        m.dispose();
      });
    });
    this.env?.dispose();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss?.();
  }
}
