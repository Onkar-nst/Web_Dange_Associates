import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import * as P from "./layoutPlan";
import * as T from "./textures";

const { clamp01, range, lerp, easeOutBack, easeOutCubic, easeInOutCubic, rng, heroPlot, BLOCK_H } = P;

// Scroll ranges (0 → 1 across the whole fly-through). Keep in sync with the chapter list in LayoutFlythrough.jsx.
export const TIMELINE = {
  sweep: [0.37, 0.5],
  markerIn: [0.6, 0.64],
  markerOut: [0.7, 0.73],
  build: [0.69, 0.87],
  society: [0.875, 0.975],
  dusk: [0.9, 1.0],
};

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _e = new THREE.Euler();
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _s = new THREE.Vector3();
const _c = new THREE.Color();
const Y_AXIS = new THREE.Vector3(0, 1, 0);

const std = (color, roughness = 0.85, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });

// ---------------------------------------------------------------------------
// Static geometry batching: many small coloured meshes → one draw call.
class Batch {
  constructor() {
    this.parts = [];
  }
  push(geo, color, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    if (g !== geo) geo.dispose();
    _e.set(rx, ry, rz);
    _q.setFromEuler(_e);
    _m.compose(_v.set(x, y, z), _q, _s.set(sx, sy, sz));
    g.applyMatrix4(_m);
    _c.set(color);
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = _c.r;
      arr[i * 3 + 1] = _c.g;
      arr[i * 3 + 2] = _c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(arr, 3));
    for (const k of Object.keys(g.attributes)) if (k !== "position" && k !== "normal" && k !== "color") g.deleteAttribute(k);
    this.parts.push(g);
  }
  // y is the base of the box
  box(w, h, d, x, y, z, color, ry = 0) {
    this.push(new THREE.BoxGeometry(w, h, d), color, x, y + h / 2, z, 0, ry, 0);
  }
  cyl(rt, rb, h, x, y, z, color, seg = 8) {
    this.push(new THREE.CylinderGeometry(rt, rb, h, seg), color, x, y + h / 2, z);
  }
  cone(r, h, x, y, z, color, seg = 8, ry = 0) {
    this.push(new THREE.ConeGeometry(r, h, seg), color, x, y + h / 2, z, 0, ry, 0);
  }
  sphere(r, x, y, z, color, sy = 1) {
    this.push(new THREE.IcosahedronGeometry(r, 1), color, x, y, z, 0, 0, 0, 1, sy, 1);
  }
  build(material, cast = true, receive = true) {
    if (!this.parts.length) return null;
    const merged = mergeGeometries(this.parts, false);
    this.parts.forEach((g) => g.dispose());
    this.parts = [];
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    return mesh;
  }
}

const unitBox = () => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);

function palmCrownGeometry() {
  const leaves = [];
  for (let i = 0; i < 9; i++) {
    const g = new THREE.BoxGeometry(0.5, 0.05, 2.7).translate(0, 0, 1.35);
    g.rotateX(0.62 + (i % 2) * 0.18);
    g.rotateY((i / 9) * Math.PI * 2);
    leaves.push(g);
  }
  for (let i = 0; i < 6; i++) {
    const g = new THREE.BoxGeometry(0.4, 0.05, 1.7).translate(0, 0, 0.85);
    g.rotateX(-0.55);
    g.rotateY((i / 6) * Math.PI * 2 + 0.3);
    leaves.push(g);
  }
  const merged = mergeGeometries(leaves, false);
  leaves.forEach((g) => g.dispose());
  return merged;
}

// ---------------------------------------------------------------------------
export default class LayoutScene {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = opts;
    this.isMobile = !!opts.isMobile;
    this.reducedMotion = !!opts.reducedMotion;
    this.target = 0;
    this.progress = 0;
    this.pointer = new THREE.Vector2();
    this.pointerSmooth = new THREE.Vector2();
    this.time = 0;
    this.labels = [];
    this.running = false;
    this.disposed = false;
    this._lastSociety = -1;
    this._lastBuild = -1;
    this.tick = this.tick.bind(this);
  }

  // ---- lifecycle ----------------------------------------------------------
  async init() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !this.isMobile;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.5, 4200);

    try {
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]);
    } catch {
      /* fonts are optional */
    }

    const steps = [
      () => this.buildEnvironment(),
      () => this.buildGround(),
      () => this.buildRoadsideAndWalls(),
      () => this.buildBlocks(),
      () => this.buildAmenities(),
      () => this.buildTrees(),
      () => this.buildVehicles(),
      () => this.buildSociety(),
      () => this.buildHero(),
      () => this.buildMarkers(),
      () => this.buildCameraPath(),
    ];
    for (let i = 0; i < steps.length; i++) {
      if (this.disposed) return;
      steps[i]();
      this.opts.onProgress?.((i + 1) / steps.length);
      await new Promise((r) => requestAnimationFrame(r));
    }
    if (this.disposed) return;
    this.resize();
    this.update(0, true);
    // Compile every shader up front so later chapters don't hitch.
    const hidden = [];
    this.scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    renderer.compile(this.scene, this.camera);
    hidden.forEach((o) => (o.visible = false));
    this.update(0, true);
    renderer.render(this.scene, this.camera);
    this.ready = true;
    this.opts.onReady?.();
  }

  start() {
    if (this.running || this.disposed || !this.ready) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  setProgress(p) {
    this.target = clamp01(p);
  }

  setPointer(x, y) {
    this.pointer.set(x, y);
  }

  setLabels(list) {
    this.labels = list.map((l) => ({ ...l, pos: new THREE.Vector3(...l.pos) }));
  }

  resize() {
    if (!this.renderer) return;
    const parent = this.canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h, false);
    const aspect = w / Math.max(1, h);
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 0.75 ? 62 : aspect < 1.2 ? 50 : 40;
    // On portrait screens the story card covers the lower part: lift the subject into the upper half.
    if (aspect < 0.8) this.camera.setViewOffset(w, h, 0, h * 0.17, w, h);
    else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.disposed = true;
    this.stop();
    if (!this.scene) return;
    const textures = new Set();
    this.scene.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        for (const k of ["map", "alphaMap", "emissiveMap"]) if (m[k]) textures.add(m[k]);
        m.dispose();
      }
    });
    textures.forEach((t) => t.dispose());
    this.renderer?.dispose();
    this.renderer?.forceContextLoss?.();
  }

  // ---- frame loop -----------------------------------------------------------
  tick() {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.tick);
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.time += dt;
    const k = 1 - Math.exp(-dt * 5);
    this.progress += (this.target - this.progress) * k;
    if (Math.abs(this.target - this.progress) < 1e-5) this.progress = this.target;
    this.pointerSmooth.lerp(this.pointer, 1 - Math.exp(-dt * 3));
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
    this.updateLabels();
    this.opts.onFrame?.(this.progress);
  }

  update(dt, force = false) {
    const p = this.progress;
    const t = this.time;
    this.updateCamera(p, t);

    const dusk = easeInOutCubic(range(p, ...TIMELINE.dusk));
    this.updateDusk(dusk);

    // Plot sweep light across the grid
    const sweepEnv = Math.min(range(p, TIMELINE.sweep[0], TIMELINE.sweep[0] + 0.03), 1 - range(p, TIMELINE.sweep[1] - 0.03, TIMELINE.sweep[1]));
    this.sweep.visible = sweepEnv > 0.001;
    if (this.sweep.visible) {
      const front = lerp(-150, 130, range(p, TIMELINE.sweep[0], TIMELINE.sweep[1]));
      P.plots.forEach((pl, i) => {
        const d = pl.cx + pl.cz * 0.45 - front;
        const glow = Math.exp(-(d * d) / 110) * 0.42;
        _c.setRGB(0.98, 0.36, 0.05).multiplyScalar(glow * sweepEnv);
        this.sweep.setColorAt(i, _c);
      });
      this.sweep.instanceColor.needsUpdate = true;
    }

    // Plot marker
    const mk = Math.min(range(p, ...TIMELINE.markerIn), 1 - range(p, ...TIMELINE.markerOut));
    this.marker.visible = mk > 0.001;
    if (this.marker.visible) {
      const e = easeOutCubic(mk);
      const pulse = 0.65 + 0.35 * Math.sin(t * 3.2);
      this.markerOutlineMat.opacity = e * (0.75 + 0.25 * pulse);
      this.markerFillMat.opacity = e * 0.28 * pulse;
      this.pin.position.y = 7.5 + Math.sin(t * 2) * 0.5 + (1 - e) * 10;
      this.pin.rotation.y = t * 1.2;
      this.pin.scale.setScalar(Math.max(0.001, e));
      const ring = (t * 0.6) % 1;
      this.ring.scale.setScalar(1 + ring * 9);
      this.ringMat.opacity = (1 - ring) * 0.6 * e;
    }

    const build = range(p, ...TIMELINE.build);
    if (force || build !== this._lastBuild || (build > 0 && build < 1)) {
      this.updateHero(build, t);
      this._lastBuild = build;
    }
    this.updateHeroLive(build, t);

    const society = range(p, ...TIMELINE.society);
    if (force || society !== this._lastSociety) {
      this.updateSociety(society);
      this._lastSociety = society;
    }

    this.updateVehicles(dt, society);
    if (this.merryGoRound) this.merryGoRound.rotation.y += dt * 0.8;
    if (this.fountainJet) this.fountainJet.scale.y = 1 + Math.sin(t * 4) * 0.08;
    if (this.poolMat) this.poolMat.emissiveIntensity = 0.22 + Math.sin(t * 1.3) * 0.04 + dusk * 0.8;
  }

  // ---- camera ----------------------------------------------------------------
  buildCameraPath() {
    const hx = heroPlot.cx;
    const hz = heroPlot.cz;
    const orbit = (p, deg, R, h, ty) => {
      const a = (deg * Math.PI) / 180;
      return [p, [hx + R * Math.sin(a), h, hz + R * Math.cos(a)], [hx, ty, hz - 0.5]];
    };
    const keys = [
      [0.0, [205, 250, 285], [12, 0, -8]],
      [0.07, [172, 200, 232], [16, 0, -8]],
      [0.135, [238, 88, 120], [140, 0, -18]],
      [0.195, [200, 30, 34], [134, 5, -20]],
      [0.25, [166, 9, -8], [130, 6.2, -21]],
      [0.295, [140, 5.4, -23.5], [100, 4.8, -22.5]],
      [0.34, [86, 10, -22.2], [30, 3, -20]],
      [0.39, [32, 30, 12], [-10, 0, -30]],
      [0.44, [-22, 38, 42], [-40, 0, -8]],
      [0.49, [-40, 72, 118], [-32, 0, 12]],
      [0.545, [52, 56, 122], [100, 0, 45]],
      [0.595, [58, 42, 2], [106, 0, -62]],
      [0.64, [64, 34, 50], [hx, 0, hz]],
      orbit(0.69, 31, 27, 17, 1.2),
      orbit(0.73, 10, 25, 16, 2),
      orbit(0.77, -22, 24, 16.5, 3),
      orbit(0.81, -46, 25, 17, 3.5),
      orbit(0.845, -16, 27, 14, 3),
      orbit(0.875, 16, 29, 13, 2.2),
      [0.915, [hx + 50, 50, hz + 92], [22, 2, -4]],
      [0.955, [140, 95, 185], [5, 0, -30]],
      [1.0, [196, 92, 238], [-10, 0, -70]],
    ];
    this.camKeys = keys.map((k) => k[0]);
    this.posCurve = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k[1])), false, "centripetal");
    this.tgtCurve = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k[2])), false, "centripetal");
    this.camPos = new THREE.Vector3();
    this.camTgt = new THREE.Vector3();
  }

  updateCamera(p, t) {
    const ks = this.camKeys;
    let i = 0;
    while (i < ks.length - 2 && p > ks[i + 1]) i++;
    const local = clamp01((p - ks[i]) / (ks[i + 1] - ks[i]));
    const u = (i + local) / (ks.length - 1);
    this.posCurve.getPoint(u, this.camPos);
    this.tgtCurve.getPoint(u, this.camTgt);
    const cam = this.camera;
    cam.position.copy(this.camPos);
    const dist = this.camPos.distanceTo(this.camTgt);
    // gentle hand-held drift + pointer parallax
    const amp = dist * 0.018;
    _v.subVectors(this.camTgt, this.camPos).normalize();
    _v2.crossVectors(_v, Y_AXIS).normalize(); // right
    const drift = this.reducedMotion ? 0 : 1;
    cam.position.addScaledVector(_v2, (this.pointerSmooth.x * amp + Math.sin(t * 0.35) * dist * 0.003 * drift));
    cam.position.y += this.pointerSmooth.y * amp * 0.6 + Math.sin(t * 0.5) * dist * 0.002 * drift;
    cam.lookAt(this.camTgt);
    this.sky.position.copy(cam.position);
  }

  updateLabels() {
    if (!this.labels.length) return;
    const p = this.progress;
    for (const l of this.labels) {
      const vis = Math.min(range(p, l.from, l.from + 0.02), 1 - range(p, l.to - 0.02, l.to));
      if (vis <= 0.001) {
        if (l.el.style.opacity !== "0") l.el.style.opacity = "0";
        continue;
      }
      _v.copy(l.pos).project(this.camera);
      const behind = _v.z > 1 || Math.abs(_v.x) > 1.2 || Math.abs(_v.y) > 1.2;
      const x = (_v.x * 0.5 + 0.5) * this.width;
      const y = (-_v.y * 0.5 + 0.5) * this.height;
      l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      l.el.style.opacity = behind ? "0" : vis.toFixed(3);
    }
  }

  // ---- environment -------------------------------------------------------------
  buildEnvironment() {
    const scene = this.scene;
    this.skyDay = { top: new THREE.Color("#4a8be0"), horizon: new THREE.Color("#dcecfb") };
    this.skyDusk = { top: new THREE.Color("#2d3f91"), horizon: new THREE.Color("#fb9a57") };
    this.skyUniforms = {
      top: { value: this.skyDay.top.clone() },
      horizon: { value: this.skyDay.horizon.clone() },
      sunDir: { value: new THREE.Vector3(0.55, 0.62, -0.5).normalize() },
      sunColor: { value: new THREE.Color("#fff1d6") },
      glow: { value: 0.35 },
    };
    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 top; uniform vec3 horizon; uniform vec3 sunDir; uniform vec3 sunColor; uniform float glow;
        varying vec3 vDir;
        void main() {
          float h = clamp(vDir.y, 0.0, 1.0);
          vec3 col = mix(horizon, top, pow(h, 0.5));
          float s = max(dot(normalize(vDir), normalize(sunDir)), 0.0);
          col += sunColor * (pow(s, 90.0) * 1.2 + pow(s, 8.0) * 0.35) * glow;
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), skyMat);
    this.sky.renderOrder = -1;
    scene.add(this.sky);

    scene.fog = new THREE.Fog(this.skyDay.horizon.clone(), 520, 2300);

    this.hemi = new THREE.HemisphereLight("#dbeafe", "#6f8a4a", 1.15);
    scene.add(this.hemi);

    const sun = new THREE.DirectionalLight("#fff3df", 2.7);
    this.sun = sun;
    this.sunDay = new THREE.Vector3(150, 190, -140);
    this.sunDusk = new THREE.Vector3(-300, 62, -210);
    sun.position.copy(this.sunDay);
    sun.target.position.set(20, 0, 0);
    sun.castShadow = !this.isMobile;
    if (sun.castShadow) {
      sun.shadow.mapSize.set(4096, 4096);
      const sc = sun.shadow.camera;
      sc.left = -185;
      sc.right = 185;
      sc.top = 170;
      sc.bottom = -170;
      sc.near = 10;
      sc.far = 700;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.04;
      sun.shadow.radius = 2;
    }
    sun.position.add(sun.target.position);
    scene.add(sun, sun.target);
  }

  updateDusk(d) {
    if (d === this._lastDusk) return;
    this._lastDusk = d;
    const u = this.skyUniforms;
    u.top.value.copy(this.skyDay.top).lerp(this.skyDusk.top, d);
    u.horizon.value.copy(this.skyDay.horizon).lerp(this.skyDusk.horizon, d);
    u.sunColor.value.set("#fff1d6").lerp(_c.set("#ff8a3d"), d);
    u.glow.value = 0.35 + d * 1.4;
    this.scene.fog.color.copy(u.horizon.value);
    this.sun.color.set("#fff3df").lerp(_c.set("#ffa45c"), d);
    this.sun.intensity = lerp(2.7, 2.1, d);
    this.sun.position.copy(this.sunDay).lerp(this.sunDusk, d).add(this.sun.target.position);
    u.sunDir.value.copy(this.sun.position).sub(this.sun.target.position).normalize();
    this.hemi.intensity = lerp(1.15, 0.78, d);
    this.hemi.color.set("#dbeafe").lerp(_c.set("#c4b1e0"), d);
    this.hemi.groundColor.set("#6f8a4a").lerp(_c.set("#7a5a3a"), d);
    this.renderer.toneMappingExposure = lerp(1.08, 1.18, d);
    const lights = range(d, 0.3, 0.85);
    this.glassLitMat.emissiveIntensity = lights * 2.4;
    this.heroGlass.emissiveIntensity = lights * 2.6;
    this.lampMat.emissiveIntensity = 0.1 + lights * 3.2;
    this.clubGlass.emissiveIntensity = lights * 1.6;
    this.glowPoints.material.opacity = lights * 0.95;
    this.glowPoints.visible = lights > 0.01;
  }

  buildGround() {
    const scene = this.scene;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      new THREE.MeshStandardMaterial({ map: T.grassTexture(this.renderer), roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Master site plan: roads, markings, lawns, park, courts
    const size = this.isMobile ? 2048 : 4096;
    const sw = P.SITE_TEX.x1 - P.SITE_TEX.x0;
    const site = new THREE.Mesh(
      new THREE.PlaneGeometry(sw, P.SITE_TEX.z1 - P.SITE_TEX.z0),
      new THREE.MeshStandardMaterial({ map: T.sitePlanTexture(this.renderer, size), roughness: 0.95 }),
    );
    site.rotation.x = -Math.PI / 2;
    site.position.set((P.SITE_TEX.x0 + P.SITE_TEX.x1) / 2, 0.02, (P.SITE_TEX.z0 + P.SITE_TEX.z1) / 2);
    site.receiveShadow = true;
    scene.add(site);

    // Highway
    const HW = P.HIGHWAY;
    const len = 1400;
    const hw = new THREE.Mesh(
      new THREE.PlaneGeometry(HW.x1 - HW.x0, len),
      new THREE.MeshStandardMaterial({ map: T.highwayTexture(this.renderer, len / 40), roughness: 0.9 }),
    );
    hw.rotation.x = -Math.PI / 2;
    hw.position.set((HW.x0 + HW.x1) / 2, 0.04, 0);
    hw.receiveShadow = true;
    scene.add(hw);
    const link = new THREE.Mesh(new THREE.PlaneGeometry(5, P.ENTRANCE.w - 3.2), std(T.COLORS.asphalt, 0.95));
    link.rotation.x = -Math.PI / 2;
    link.position.set(139.5, 0.05, P.ENTRANCE.z);
    link.receiveShadow = true;
    scene.add(link);

    // Farmland patches
    const r = rng(404);
    const fieldTex = T.fieldTexture(this.renderer);
    const fieldColors = ["#9cc85a", "#b9cf6a", "#7fb24a", "#cdbb7a", "#a7c95f", "#8ab94f", "#c4c96c"];
    this.fields = [];
    let tries = 0;
    while (this.fields.length < (this.isMobile ? 16 : 30) && tries++ < 400) {
      const w = 50 + r() * 90;
      const d = 40 + r() * 110;
      const a = r() * Math.PI * 2;
      const dist = 190 + r() * 520;
      const x = 20 + Math.cos(a) * dist;
      const z = Math.sin(a) * dist;
      const pad = Math.max(w, d) / 2 + 12;
      if (x + pad > -110 && x - pad < 180 && z + pad > -125 && z - pad < 125) continue;
      if (x + pad > 125 && x - pad < 185) continue;
      if (this.fields.some((f) => Math.abs(f.x - x) < (f.w + w) / 2 + 6 && Math.abs(f.z - z) < (f.d + d) / 2 + 6)) continue;
      const mat = new THREE.MeshStandardMaterial({ color: fieldColors[Math.floor(r() * fieldColors.length)], map: fieldTex, roughness: 1 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      m.rotation.set(-Math.PI / 2, 0, (r() - 0.5) * 0.3);
      m.position.set(x, 0.03, z);
      m.receiveShadow = true;
      scene.add(m);
      this.fields.push({ x, z, w, d });
    }

    // Distant hills
    const hills = new Batch();
    const hr = rng(77);
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * Math.PI * 2 + hr() * 0.1;
      const dist = 1350 + hr() * 450;
      const rad = 160 + hr() * 200;
      const h = 35 + hr() * 70;
      hills.push(new THREE.ConeGeometry(rad, h, 7), hr() > 0.5 ? "#6f8f5d" : "#7c9873", 20 + Math.cos(a) * dist, h / 2 - 4, Math.sin(a) * dist, 0, hr() * 3, 0, 1, 1, 0.6 + hr() * 0.6);
    }
    const hillMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true });
    scene.add(hills.build(hillMat, false, false));
  }

  // ---- roadside furniture, compound wall, gate ----------------------------------
  buildRoadsideAndWalls() {
    const scene = this.scene;
    const b = new Batch();
    const lamps = new Batch();
    const glow = [];
    const S = P.SITE;
    const WALL = "#efe6d6";
    const COPING = "#c9bda8";
    // Compound wall with pilasters, gap for the gate
    const wallH = 1.9;
    const seg = (x0, z0, x1, z1) => {
      const len = Math.hypot(x1 - x0, z1 - z0);
      const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
      const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      b.box(alongX ? len : 0.3, wallH, alongX ? 0.3 : len, cx, 0, cz, WALL);
      b.box(alongX ? len : 0.42, 0.12, alongX ? 0.42 : len, cx, wallH, cz, COPING);
      const n = Math.floor(len / 6);
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        b.box(0.55, wallH + 0.25, 0.55, lerp(x0, x1, t), 0, lerp(z0, z1, t), "#e4d7c1");
      }
    };
    seg(S.x0, S.z0, S.x1, S.z0);
    seg(S.x0, S.z1, S.x1, S.z1);
    seg(S.x0, S.z0, S.x0, S.z1);
    seg(S.x1, S.z0, S.x1, P.GATE.z0 - 1.5);
    seg(S.x1, P.GATE.z1 + 1.5, S.x1, S.z1);

    // Gate arch
    const gx = P.GATE.x;
    for (const z of [P.GATE.z0 - 1, P.GATE.z1 + 1]) {
      b.box(2.2, 10, 2.2, gx, 0, z, "#f3ede2");
      b.box(2.4, 0.8, 2.4, gx, 0, z, "#1e40af");
      b.box(2.35, 0.35, 2.35, gx, 8.2, z, "#f97316");
      b.box(2.6, 0.4, 2.6, gx, 10, z, "#d9ccb4");
    }
    b.box(1.8, 1.3, P.GATE.z1 - P.GATE.z0 + 5, gx, 10.1, (P.GATE.z0 + P.GATE.z1) / 2, "#f3ede2");
    b.box(0.5, 2.3, 16.4, gx, 7.0, (P.GATE.z0 + P.GATE.z1) / 2, "#1e3a8a");
    const boardTex = T.boardTexture(this.renderer, this.opts.gateTitle || "SHREE RAM NAGRI - 1", this.opts.gateSubtitle || "by Dange Associates");
    const boardMat = new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.5, emissive: new THREE.Color("#ffffff"), emissiveMap: boardTex, emissiveIntensity: 0.15 });
    for (const side of [1, -1]) {
      const board = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.1), boardMat);
      board.position.set(gx + side * 0.26, 8.15, (P.GATE.z0 + P.GATE.z1) / 2);
      board.rotation.y = side * Math.PI / 2;
      scene.add(board);
    }
    // Security cabin
    b.box(4.2, 3, 3.4, gx - 5, 0, P.GATE.z0 - 6, "#f3ede2");
    b.box(4.8, 0.25, 4, gx - 5, 3, P.GATE.z0 - 6, "#1e40af");
    b.box(0.08, 1.1, 2.2, gx - 2.88, 1.2, P.GATE.z0 - 6, "#2a4863");

    // Street lights along the east-west roads (south footpath) and the avenue median
    const lamp = (x, z, dirX, dirZ) => {
      b.cyl(0.09, 0.13, 7, x, 0, z, "#475569", 6);
      b.box(Math.abs(dirX) * 1.6 + 0.12, 0.12, Math.abs(dirZ) * 1.6 + 0.12, x + dirX * 0.8, 6.9, z + dirZ * 0.8, "#475569");
      lamps.box(0.7, 0.16, 0.34, x + dirX * 1.5, 6.78, z + dirZ * 1.5, "#ffffff");
      glow.push(x + dirX * 1.5, 6.5, z + dirZ * 1.5);
    };
    const inJunctionX = (x, pad) => P.nsRoads.some((n) => Math.abs(x - n.x) < n.w / 2 + pad);
    const inJunctionZ = (z, pad) => P.ewRoads.some((e) => Math.abs(z - e) < 5 + pad);
    const heroRoad = heroPlot.cz + heroPlot.face * (P.PD / 2 + 5);
    for (const z of P.ewRoads) {
      for (let x = P.OUT_W + 10; x < P.OUT_E - 4; x += 22) {
        if (inJunctionX(x, 4)) continue;
        if (z === heroRoad && Math.abs(x - heroPlot.cx) < 9) continue;
        lamp(x, z + 4.3, 0, -1);
      }
    }
    for (let i = 0; i < P.ewRoads.length - 1; i++) for (let z = P.ewRoads[i] + 20; z < P.ewRoads[i + 1] - 10; z += 16) {
      b.cyl(0.1, 0.14, 7.5, 0, 0, z, "#475569", 6);
      b.box(3.4, 0.12, 0.12, 0, 7.35, z, "#475569");
      for (const s of [-1, 1]) {
        lamps.box(0.7, 0.16, 0.34, s * 1.6, 7.22, z, "#ffffff");
        glow.push(s * 1.6, 6.9, z);
      }
    }
    for (let x = 80; x < 128; x += 12) {
      lamp(x, P.ENTRANCE.z - P.ENTRANCE.w / 2 + 0.8, 0, 1);
      lamp(x + 6, P.ENTRANCE.z + P.ENTRANCE.w / 2 - 0.8, 0, -1);
    }

    // Plot corner stones (white with an orange cap), like on site
    const stones = [];
    for (const blk of P.blocks) {
      for (let c = 0; c <= blk.cols; c++) {
        for (const z of [blk.z0, blk.z0 + P.PD, blk.z1]) {
          stones.push([blk.x0 + c * P.PW, z]);
        }
      }
    }
    const stoneBody = new THREE.InstancedMesh(unitBox(), std("#f8f7f2", 0.7), stones.length);
    const stoneCap = new THREE.InstancedMesh(unitBox(), std("#f97316", 0.6), stones.length);
    stones.forEach(([x, z], i) => {
      _m.compose(_v.set(x, BLOCK_H, z), _q.identity(), _s.set(0.26, 0.5, 0.26));
      stoneBody.setMatrixAt(i, _m);
      _m.compose(_v.set(x, BLOCK_H + 0.5, z), _q, _s.set(0.28, 0.14, 0.28));
      stoneCap.setMatrixAt(i, _m);
    });
    stoneBody.castShadow = stoneCap.castShadow = true;
    scene.add(stoneBody, stoneCap);

    this.lampMat = new THREE.MeshStandardMaterial({ vertexColors: true, emissive: new THREE.Color("#ffd49a"), emissiveIntensity: 0.1, roughness: 0.4 });
    this.lampGlow = glow;
    scene.add(b.build(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 })));
    scene.add(lamps.build(this.lampMat, false, false));
  }

  // ---- plot blocks -----------------------------------------------------------------
  buildBlocks() {
    const ppm = this.isMobile ? 10 : 16;
    const side = std("#b99a78", 1);
    for (const blk of P.blocks) {
      const w = blk.x1 - blk.x0;
      const d = blk.z1 - blk.z0;
      const top = new THREE.MeshStandardMaterial({ map: T.blockTexture(this.renderer, blk, ppm, heroPlot.n), roughness: 1 });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, BLOCK_H, d), [side, side, top, side, side, side]);
      mesh.position.set((blk.x0 + blk.x1) / 2, BLOCK_H / 2, (blk.z0 + blk.z1) / 2);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
    // Light sweep (one additive quad per plot)
    const sweepMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const sweep = new THREE.InstancedMesh(new THREE.PlaneGeometry(P.PW - 0.5, P.PD - 0.5).rotateX(-Math.PI / 2), sweepMat, P.plots.length);
    P.plots.forEach((pl, i) => {
      _m.makeTranslation(pl.cx, BLOCK_H + 0.04, pl.cz);
      sweep.setMatrixAt(i, _m);
      sweep.setColorAt(i, _c.setRGB(0, 0, 0));
    });
    sweep.renderOrder = 2;
    this.sweep = sweep;
    this.scene.add(sweep);
  }

  // ---- clubhouse, pool, park, play area ---------------------------------------------
  buildAmenities() {
    const scene = this.scene;
    const b = new Batch();
    const glassB = new Batch();
    const lamps = this.lampGlow;
    const WHITE = "#f7f4ee";
    const WOOD = "#9a6a3f";

    // Clubhouse
    const C = P.CLUB;
    const cx = (C.x0 + C.x1) / 2, cz = (C.z0 + C.z1) / 2;
    b.box(5, 3.8, C.z1 - C.z0, C.x0 + 2.5, 0, cz, WHITE);
    glassB.box(C.x1 - C.x0 - 5, 3.6, C.z1 - C.z0 - 1, cx + 2.5, 0, cz, "#ffffff");
    b.box(C.x1 - C.x0 + 1.2, 3.4, 18.5, cx + 0.6, 3.8, cz + 2, WHITE);
    b.box(C.x1 - C.x0 + 1.8, 0.35, 19.2, cx + 0.6, 7.2, cz + 2, "#d8d2c7");
    glassB.box(0.12, 2.2, 15.5, C.x1 + 1.25, 4.4, cz + 2, "#ffffff");
    glassB.box(17, 2.2, 0.12, cx + 0.6, 4.4, cz + 11.3, "#ffffff");
    b.box(0.35, 3.4, 18.5, C.x1 + 1.3, 3.8, cz + 2, "#334155");
    b.box(8, 0.25, 4.5, cx + 1, 3.3, C.z1 + 2, "#334155");
    b.box(0.25, 3.3, 0.25, cx - 2.8, 0, C.z1 + 4, "#334155");
    b.box(0.25, 3.3, 0.25, cx + 4.8, 0, C.z1 + 4, "#334155");
    b.box(0.9, 7.8, 0.9, C.x0 + 2.5, 0, C.z1 - 0.6, "#f97316");
    for (let i = 0; i < 6; i++) b.push(new THREE.BoxGeometry(2.4, 0.08, 1.5), "#1e3a8a", C.x0 + 4 + (i % 3) * 3.4, 7.75, cz + (i < 3 ? -2 : 2.5), -0.25, 0, 0);
    for (let i = 0; i < 7; i++) b.box(0.18, 0.6, 12, C.x0 + 3 + i * 2.2, 7.55, cz + 8, WOOD);

    // Pool: coping, water, loungers, umbrellas
    const PL = P.POOL;
    b.box(PL.x1 - PL.x0 + 1.2, 0.16, 0.6, (PL.x0 + PL.x1) / 2, 0, PL.z0 - 0.3, "#ffffff");
    b.box(PL.x1 - PL.x0 + 1.2, 0.16, 0.6, (PL.x0 + PL.x1) / 2, 0, PL.z1 + 0.3, "#ffffff");
    b.box(0.6, 0.16, PL.z1 - PL.z0, PL.x0 - 0.3, 0, (PL.z0 + PL.z1) / 2, "#ffffff");
    b.box(0.6, 0.16, PL.z1 - PL.z0, PL.x1 + 0.3, 0, (PL.z0 + PL.z1) / 2, "#ffffff");
    this.poolMat = new THREE.MeshStandardMaterial({ color: "#2fb6ea", roughness: 0.06, metalness: 0.05, transparent: true, opacity: 0.9, emissive: new THREE.Color("#0b6fa0"), emissiveIntensity: 0.22 });
    const water = new THREE.Mesh(new THREE.PlaneGeometry(PL.x1 - PL.x0, PL.z1 - PL.z0), this.poolMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set((PL.x0 + PL.x1) / 2, 0.1, (PL.z0 + PL.z1) / 2);
    water.receiveShadow = true;
    scene.add(water);
    for (let i = 0; i < 6; i++) {
      const x = PL.x0 + 2 + i * 3.6;
      b.push(new THREE.BoxGeometry(0.75, 0.3, 1.9), WHITE, x, 0.35, PL.z0 - 2.6, 0, 0, 0);
      b.push(new THREE.BoxGeometry(0.75, 0.08, 0.8), WHITE, x, 0.7, PL.z0 - 3.3, -0.6, 0, 0);
      if (i % 2 === 0) {
        b.cyl(0.05, 0.05, 2.4, x + 1.8, 0, PL.z0 - 2.8, "#e5e7eb", 5);
        b.cone(1.5, 0.6, x + 1.8, 2.3, PL.z0 - 2.8, i % 4 === 0 ? "#f97316" : "#1e40af", 8);
      }
    }
    // Courts: nets + fence
    const CO = P.COURT;
    const ccx = (CO.x0 + CO.x1) / 2;
    for (const czz of [CO.z0 + 9, CO.z1 - 9]) {
      b.box(0.06, 1.05, 12.6, ccx, 0, czz, "#f8fafc");
      b.box(0.12, 1.1, 0.12, ccx, 0, czz - 6.3, "#1f2937");
      b.box(0.12, 1.1, 0.12, ccx, 0, czz + 6.3, "#1f2937");
    }
    const fenceMat = new THREE.MeshStandardMaterial({ color: "#14532d", transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false });
    const fh = 3.6;
    const fences = [
      [CO.x1 - CO.x0, ccx, CO.z0, 0], [CO.x1 - CO.x0, ccx, CO.z1, 0],
      [CO.z1 - CO.z0, CO.x0, (CO.z0 + CO.z1) / 2, Math.PI / 2], [CO.z1 - CO.z0, CO.x1, (CO.z0 + CO.z1) / 2, Math.PI / 2],
    ];
    for (const [len, x, z, ry] of fences) {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(len, fh), fenceMat);
      f.position.set(x, fh / 2, z);
      f.rotation.y = ry;
      scene.add(f);
    }
    for (let x = CO.x0; x <= CO.x1 + 0.01; x += 3.83) {
      b.box(0.12, fh, 0.12, x, 0, CO.z0, "#14532d");
      b.box(0.12, fh, 0.12, x, 0, CO.z1, "#14532d");
    }
    for (let z = CO.z0; z <= CO.z1 + 0.01; z += 3.6) {
      b.box(0.12, fh, 0.12, CO.x0, 0, z, "#14532d");
      b.box(0.12, fh, 0.12, CO.x1, 0, z, "#14532d");
    }

    // Park: fountain, gazebo, benches, lamps
    const PK = P.PARK;
    const pc = { x: (PK.x0 + PK.x1) / 2, z: (PK.z0 + PK.z1) / 2 + 2 };
    b.cyl(4, 4.2, 0.6, pc.x, 0, pc.z, "#e9e2d3", 24);
    b.cyl(0.55, 0.7, 1.7, pc.x, 0, pc.z, "#e9e2d3", 12);
    b.cyl(1.3, 0.9, 0.3, pc.x, 1.7, pc.z, "#e9e2d3", 16);
    const fWater = new THREE.Mesh(new THREE.CircleGeometry(3.7, 32), this.poolMat);
    fWater.rotation.x = -Math.PI / 2;
    fWater.position.set(pc.x, 0.55, pc.z);
    scene.add(fWater);
    const sprayMat = new THREE.MeshStandardMaterial({ color: "#e0f2fe", transparent: true, opacity: 0.5, roughness: 0.1, emissive: new THREE.Color("#7dd3fc"), emissiveIntensity: 0.35, depthWrite: false, side: THREE.DoubleSide });
    const jet = new THREE.Group();
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 2.6, 8).translate(0, 1.3, 0), sprayMat);
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.9, 20, 1, true).translate(0, 0.95, 0), sprayMat);
    canopy.position.y = 0.75;
    jet.add(column, canopy);
    jet.position.set(pc.x, 1.95, pc.z);
    scene.add(jet);
    this.fountainJet = jet;
    const gz = { x: PK.x0 + 12, z: PK.z1 - 15 };
    b.cyl(3.4, 3.4, 0.35, gz.x, 0, gz.z, "#e9e2d3", 6);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      b.box(0.22, 2.8, 0.22, gz.x + Math.cos(a) * 2.8, 0.35, gz.z + Math.sin(a) * 2.8, WHITE);
    }
    b.cone(3.8, 1.8, gz.x, 3.1, gz.z, "#b45309", 6);
    const benchSpots = [[pc.x - 10, PK.z0 + 8], [pc.x + 10, PK.z0 + 8], [pc.x - 10, PK.z1 - 8], [pc.x + 10, PK.z1 - 8], [PK.x0 + 8, pc.z - 14], [PK.x1 - 8, pc.z + 14], [PK.x0 + 8, pc.z + 20], [PK.x1 - 8, pc.z - 20]];
    for (const [x, z] of benchSpots) {
      b.box(1.8, 0.45, 0.55, x, 0, z, WOOD);
      b.box(1.8, 0.5, 0.1, x, 0.45, z - 0.25, WOOD);
    }
    const heads = new Batch();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const x = pc.x + Math.cos(a) * 20, z = pc.z + Math.sin(a) * 34;
      b.cyl(0.06, 0.08, 3.4, x, 0, z, "#334155", 5);
      heads.sphere(0.28, x, 3.6, z, "#ffffff");
      lamps.push(x, 3.6, z);
    }
    scene.add(heads.build(this.lampMat, false, false));

    // Kids play area
    const slide = { x: 89, z: 5 };
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) b.box(0.16, 2.8, 0.16, slide.x + dx, 0, slide.z + dz, "#1e40af");
    b.box(2.3, 0.18, 2.3, slide.x, 1.5, slide.z, "#f97316");
    b.cone(1.8, 1.3, slide.x, 2.8, slide.z, "#ef4444", 4, Math.PI / 4);
    b.push(new THREE.BoxGeometry(0.95, 0.1, 3.6), "#facc15", slide.x, 0.8, slide.z + 2.6, 0.45, 0, 0);
    for (let i = 0; i < 5; i++) b.box(0.9, 0.08, 0.12, slide.x, 0.3 * i + 0.2, slide.z - 1.35, "#1e40af");
    const sw = { x: 108, z: 4 };
    for (const dx of [-2.3, 2.3]) {
      b.push(new THREE.BoxGeometry(0.14, 3, 0.14), "#1e40af", sw.x + dx, 1.45, sw.z - 0.7, 0.35, 0, 0);
      b.push(new THREE.BoxGeometry(0.14, 3, 0.14), "#1e40af", sw.x + dx, 1.45, sw.z + 0.7, -0.35, 0, 0);
    }
    b.box(4.8, 0.14, 0.14, sw.x, 2.8, sw.z, "#1e40af");
    for (const dx of [-1, 1]) {
      b.box(0.03, 2.1, 0.03, sw.x + dx - 0.25, 0.7, sw.z, "#94a3b8");
      b.box(0.03, 2.1, 0.03, sw.x + dx + 0.25, 0.7, sw.z, "#94a3b8");
      b.box(0.6, 0.07, 0.3, sw.x + dx, 0.65, sw.z, "#f97316");
    }
    b.box(0.4, 0.5, 0.4, 97, 0, 12, "#16a34a");
    b.push(new THREE.BoxGeometry(4.2, 0.1, 0.35), "#facc15", 97, 0.62, 12, 0, 0, 0.18);
    b.box(2.2, 1.6, 2, 121, 0, 10, "#fde68a");
    b.cone(1.8, 1.1, 121, 1.6, 10, "#f97316", 4, Math.PI / 4);
    const mgr = new THREE.Group();
    const mb = new Batch();
    mb.cyl(1.5, 1.5, 0.15, 0, 0.25, 0, "#3b82f6", 20);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      mb.box(0.08, 0.9, 0.08, Math.cos(a) * 1.1, 0.4, Math.sin(a) * 1.1, i % 2 ? "#f97316" : "#facc15");
    }
    mb.cyl(0.1, 0.1, 1.2, 0, 0.2, 0, "#e5e7eb", 6);
    mgr.add(mb.build(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 })));
    mgr.position.set(100, 0, -2);
    scene.add(mgr);
    this.merryGoRound = mgr;

    scene.add(b.build(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 })));
    this.clubGlass = new THREE.MeshStandardMaterial({ color: "#3f6a90", roughness: 0.12, metalness: 0.15, emissive: new THREE.Color("#ffb45e"), emissiveIntensity: 0, vertexColors: true });
    scene.add(glassB.build(this.clubGlass));
  }

  // ---- trees (instanced) -----------------------------------------------------------
  buildTrees() {
    const r = rng(2024);
    const round = []; // [x, z, trunkH, canopyR, colorIndex]
    const palms = []; // [x, z, h, s]
    const inJunctionX = (x, pad) => P.nsRoads.some((n) => Math.abs(x - n.x) < n.w / 2 + pad);
    const inJunctionZ = (z, pad) => P.ewRoads.some((e) => Math.abs(z - e) < 5 + pad);

    // Avenue trees on every road
    const heroRoad = heroPlot.cz + heroPlot.face * (P.PD / 2 + 5);
    for (const z of P.ewRoads) {
      for (let x = P.OUT_W + 4; x < P.OUT_E - 2; x += 11) {
        if (inJunctionX(x, 3)) continue;
        if (z === heroRoad && Math.abs(x - heroPlot.cx) < 10) continue;
        for (const s of [-1, 1]) round.push([x, z + s * 4.2, 2.2 + r() * 0.8, 1.7 + r() * 0.6, r()]);
      }
    }
    for (const n of P.nsRoads) {
      for (let z = P.OUT_N + 4; z < P.OUT_S - 2; z += 11) {
        if (inJunctionZ(z, 3)) continue;
        for (const s of [-1, 1]) round.push([n.x + s * (n.w / 2 - 0.8), z, 2.2 + r() * 0.8, 1.7 + r() * 0.6, r()]);
      }
    }
    // Palms: avenue median + entrance boulevard
    for (let i = 0; i < P.ewRoads.length - 1; i++) {
      for (let z = P.ewRoads[i] + 12; z < P.ewRoads[i + 1] - 10; z += 16) palms.push([0, z, 5.5 + r() * 1.2, 1 + r() * 0.2]);
    }
    for (let x = P.ENTRANCE.median[0] + 2; x < P.ENTRANCE.median[1] - 7; x += 7) palms.push([x, P.ENTRANCE.z, 5 + r() * 1, 1 + r() * 0.2]);
    // Park perimeter & clusters
    const PK = P.PARK;
    for (let x = PK.x0 + 1.5; x < PK.x1; x += 7) {
      round.push([x, PK.z0 + 1.5, 2.6, 2.4 + r() * 0.6, r()]);
      round.push([x, PK.z1 - 1.5, 2.6, 2.4 + r() * 0.6, r()]);
    }
    for (let z = PK.z0 + 8; z < PK.z1 - 4; z += 7) {
      round.push([PK.x0 + 1.5, z, 2.6, 2.4 + r() * 0.6, r()]);
      round.push([PK.x1 - 1.5, z, 2.6, 2.4 + r() * 0.6, r()]);
    }
    const pcx = (PK.x0 + PK.x1) / 2, pcz = (PK.z0 + PK.z1) / 2 + 2;
    for (const [x, z] of [[pcx - 15, pcz - 26], [pcx + 16, pcz - 24], [pcx - 16, pcz + 28], [pcx + 15, pcz + 26], [pcx + 17, pcz + 2], [pcx - 17, pcz - 2]]) {
      for (let k = 0; k < 3; k++) round.push([x + (r() - 0.5) * 6, z + (r() - 0.5) * 6, 2.8, 2.6 + r(), r()]);
    }
    for (let x = P.PLAY.x0 + 2; x < P.PLAY.x1; x += 9) round.push([x, P.PLAY.z0 - 1.5, 2.4, 2, r()]);
    for (let z = -104; z < -64; z += 8) round.push([129.5, z, 2.4, 2.2, r()]);
    for (let z = -54; z < -40; z += 6) palms.push([128.5, z, 5, 1]);
    // Inside the compound wall on the west, north and south edges
    for (let x = P.SITE.x0 + 3; x < P.OUT_E; x += 9) {
      round.push([x, P.SITE.z0 + 1.5, 2.6, 2.2 + r() * 0.5, r()]);
      round.push([x, P.SITE.z1 - 1.5, 2.6, 2.2 + r() * 0.5, r()]);
    }
    for (let z = P.SITE.z0 + 3; z < P.SITE.z1; z += 9) round.push([P.SITE.x0 + 1.5, z, 2.6, 2.2 + r() * 0.5, r()]);

    // Countryside: dense rows along the highway, forest around the site
    for (let z = -620; z < 620; z += 9 + r() * 4) {
      if (Math.abs(z - P.ENTRANCE.z) < 14) continue;
      round.push([P.HIGHWAY.x0 - 3 - r() * 2, z, 3 + r(), 3 + r() * 1.5, r()]);
      round.push([P.HIGHWAY.x1 + 3 + r() * 3, z, 3 + r(), 3 + r() * 1.5, r()]);
    }
    const forestCount = this.isMobile ? 800 : 1900;
    let placed = 0, tries = 0;
    while (placed < forestCount && tries++ < forestCount * 6) {
      const a = r() * Math.PI * 2;
      const dist = 125 + Math.pow(r(), 1.4) * 620;
      const x = 20 + Math.cos(a) * dist;
      const z = Math.sin(a) * dist * 0.95;
      if (x > -104 && x < 136 && z > -116 && z < 116) continue;
      if (x > 132 && x < 176) continue;
      if (this.fields.some((f) => Math.abs(f.x - x) < f.w / 2 + 3 && Math.abs(f.z - z) < f.d / 2 + 3)) continue;
      // clusters: skip some to create clearings
      if (Math.sin(x * 0.03) * Math.cos(z * 0.027) > 0.55) continue;
      round.push([x, z, 3 + r() * 1.5, 3 + r() * 3.2, r()]);
      placed++;
    }

    const canopyColors = ["#4f7f2c", "#5b8f33", "#3f6f25", "#6b9e3a", "#7aa843", "#557f2a", "#658f35"].map((c) => new THREE.Color(c));
    const trunkMat = std("#6b4a2f", 0.95);
    const canopyMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, flatShading: true });
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.2, 1, 5).translate(0, 0.5, 0), trunkMat, round.length + palms.length);
    const canopies = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), canopyMat, round.length);
    round.forEach(([x, z, th, cr, ci], i) => {
      const ts = 0.7 + cr * 0.18;
      _m.compose(_v.set(x, 0, z), _q.identity(), _s.set(ts, th, ts));
      trunks.setMatrixAt(i, _m);
      _q.setFromAxisAngle(Y_AXIS, ci * 6.28);
      _m.compose(_v.set(x, th + cr * 0.62, z), _q, _s.set(cr, cr * (0.82 + ci * 0.2), cr));
      canopies.setMatrixAt(i, _m);
      canopies.setColorAt(i, canopyColors[Math.floor(ci * canopyColors.length) % canopyColors.length]);
    });
    const crowns = new THREE.InstancedMesh(palmCrownGeometry(), new THREE.MeshStandardMaterial({ color: "#3f7a2a", roughness: 0.85, side: THREE.DoubleSide }), palms.length);
    palms.forEach(([x, z, h, s], j) => {
      _m.compose(_v.set(x, 0, z), _q.identity(), _s.set(0.55, h, 0.55));
      trunks.setMatrixAt(round.length + j, _m);
      _q.setFromAxisAngle(Y_AXIS, j * 1.7);
      _m.compose(_v.set(x, h, z), _q, _s.set(s * 1.2, s, s * 1.2));
      crowns.setMatrixAt(j, _m);
    });
    for (const m of [trunks, canopies, crowns]) {
      m.castShadow = true;
      m.receiveShadow = true;
      this.scene.add(m);
    }
    this.canopyColors = canopyColors;
    this.trunkMat = trunkMat;
    this.canopyMat = canopyMat;

    // Highway median shrubs
    const shrubs = [];
    for (let z = -640; z < 640; z += 3.2) shrubs.push(z);
    const sh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: "#4d7c2a", roughness: 1, flatShading: true }), shrubs.length);
    shrubs.forEach((z, i) => {
      _m.compose(_v.set(153, 0.4, z), _q.identity(), _s.set(1.1, 0.7, 1.3));
      sh.setMatrixAt(i, _m);
    });
    this.scene.add(sh);

    // Lamp glows (dusk)
    const pts = new Float32Array(this.lampGlow);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    this.glowPoints = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ size: 7, map: T.glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, sizeAttenuation: true, toneMapped: false }),
    );
    this.glowPoints.visible = false;
    this.scene.add(this.glowPoints);
  }

  // ---- vehicles -----------------------------------------------------------------
  buildVehicles() {
    const r = rng(99);
    const TYPES = {
      car: { lower: [1.8, 0.78, 4.2], upper: [1.62, 0.6, 2.2], upperY: 0.78, upperZ: -0.2, colors: ["#f8fafc", "#94a3b8", "#b91c1c", "#1d4ed8", "#111827", "#6b7280", "#e5e7eb"], upperColor: "#1f2937" },
      bus: { lower: [2.5, 2.8, 11], upper: [2.56, 0.85, 10.2], upperY: 1.45, upperZ: 0, colors: ["#b91c1c"], upperColor: "#1f2937" },
      truck: { lower: [2.4, 2.6, 6.6], upper: [2.4, 2.3, 2.1], upperY: 0, upperZ: 4.45, colors: ["#f59e0b", "#ea580c", "#16a34a", "#2563eb"], upperColor: "#f8fafc" },
    };
    const list = [];
    const HW = P.HIGHWAY;
    for (let i = 0; i < 34; i++) {
      const roll = r();
      const type = roll < 0.66 ? "car" : roll < 0.82 ? "bus" : "truck";
      const dirPos = i % 2 === 0;
      const lanes = dirPos ? HW.lanesA : HW.lanesB;
      const lane = type === "car" ? lanes[Math.floor(r() * 3)] : lanes[dirPos ? 2 : 0];
      list.push({ type, axis: "z", lane, dir: dirPos ? 1 : -1, pos: -650 + r() * 1300, speed: type === "car" ? 15 + r() * 7 : 10 + r() * 3, min: -650, max: 650, group: "hw" });
    }
    // A few residents' cars on internal roads once the society is built
    const internal = [-60, -20, 20, 60];
    for (let i = 0; i < 12; i++) {
      const z = internal[i % 4];
      const dir = i % 2 === 0 ? 1 : -1;
      list.push({ type: "car", axis: "x", lane: z + dir * 1.7, dir, pos: P.OUT_W + r() * (P.OUT_E - P.OUT_W), speed: 6 + r() * 3, min: P.OUT_W + 2, max: P.OUT_E - 2, group: "soc" });
    }
    this.vehicles = list;
    this.vehicleTypes = TYPES;
    const lower = new THREE.InstancedMesh(unitBox(), std("#ffffff", 0.45, 0.25), list.length);
    const upper = new THREE.InstancedMesh(unitBox(), std("#ffffff", 0.3, 0.3), list.length);
    list.forEach((v, i) => {
      const tp = TYPES[v.type];
      lower.setColorAt(i, _c.set(tp.colors[Math.floor(r() * tp.colors.length)]));
      upper.setColorAt(i, _c.set(tp.upperColor));
    });
    for (const m of [lower, upper]) {
      m.frustumCulled = false;
      m.castShadow = true;
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      this.scene.add(m);
    }
    this.vLower = lower;
    this.vUpper = upper;
  }

  updateVehicles(dt, society) {
    const socScale = easeOutCubic(range(society, 0.5, 1));
    this.vehicles.forEach((v, i) => {
      v.pos += v.dir * v.speed * dt;
      if (v.pos > v.max) v.pos = v.min;
      if (v.pos < v.min) v.pos = v.max;
      const tp = this.vehicleTypes[v.type];
      const s = v.group === "soc" ? socScale : 1;
      const heading = v.axis === "z" ? (v.dir > 0 ? 0 : Math.PI) : v.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      _q.setFromAxisAngle(Y_AXIS, heading);
      const x = v.axis === "z" ? v.lane : v.pos;
      const z = v.axis === "z" ? v.pos : v.lane;
      const yb = v.axis === "z" ? 0.38 : 0.36;
      _m.compose(_v.set(x, yb, z), _q, _s.set(tp.lower[0] * s, tp.lower[1] * s, tp.lower[2] * s));
      this.vLower.setMatrixAt(i, _m);
      _v2.set(0, tp.upperY * s, tp.upperZ * s).applyQuaternion(_q);
      _m.compose(_v.set(x + _v2.x, yb + _v2.y, z + _v2.z), _q, _s.set(tp.upper[0] * s, tp.upper[1] * s, tp.upper[2] * s));
      this.vUpper.setMatrixAt(i, _m);
    });
    this.vLower.instanceMatrix.needsUpdate = true;
    this.vUpper.instanceMatrix.needsUpdate = true;
  }

  // ---- the society: a home on every plot -------------------------------------------
  buildSociety() {
    const BODY = ["#f6f1e7", "#efe4d0", "#ebe1d3", "#f4e7d4", "#dfe7f0", "#f2d6c0", "#e7e2d9", "#f8f4ec", "#efe0cf", "#e8d2bd", "#dde5d6", "#f3e3c3"];
    const ACCENT = ["#f97316", "#c2410c", "#8b5a33", "#1e40af", "#475569", "#b45309", "#9a3412", "#334155"];
    const CARS = ["#f8fafc", "#94a3b8", "#b91c1c", "#1d4ed8", "#111827", "#6b7280", "#e5e7eb", "#7c2d12"];
    this.glassLitMat = new THREE.MeshStandardMaterial({ color: "#46729a", roughness: 0.18, metalness: 0.1, emissive: new THREE.Color("#ffbd6e"), emissiveIntensity: 0 });
    const registry = {};
    const reg = (name, geo, mat, cast = true) => (registry[name] = { geo, mat, cast, items: [] });
    reg("body", unitBox(), std("#ffffff", 0.85));
    reg("roof", unitBox(), std("#ffffff", 0.9));
    reg("glassLit", unitBox(), this.glassLitMat, false);
    reg("glassDark", unitBox(), std("#3b6286", 0.2, 0.1), false);
    reg("trim", unitBox(), std("#ffffff", 0.6));
    reg("dark", unitBox(), std("#ffffff", 0.6));
    reg("solar", unitBox(), std("#1e3a8a", 0.25, 0.5));
    reg("tank", new THREE.CylinderGeometry(1, 1, 1, 10).translate(0, 0.5, 0), std("#ffffff", 0.5));
    reg("wall", unitBox(), std("#ffffff", 0.9));
    reg("carLower", unitBox(), std("#ffffff", 0.4, 0.3));
    reg("carUpper", unitBox(), std("#ffffff", 0.3, 0.3));
    reg("trunk", new THREE.CylinderGeometry(0.12, 0.2, 1, 5).translate(0, 0.5, 0), this.trunkMat);
    reg("canopy", new THREE.IcosahedronGeometry(1, 1), this.canopyMat);

    this.houses = [];
    const add = (name, house, pos, scl, color, { phase = "b", mode = "y", rotX = 0 } = {}) => {
      registry[name].items.push({ house, pos: new THREE.Vector3(...pos), scl: new THREE.Vector3(...scl), color, phase, mode, rotX });
    };
    const maxD = 170;
    for (const pl of P.plots) {
      if (pl === heroPlot) continue;
      const r = rng(pl.n * 131 + 7);
      const h = this.houses.length;
      const dist = Math.hypot(pl.cx - heroPlot.cx, pl.cz - heroPlot.cz);
      this.houses.push({ plot: pl, delay: Math.min(1, dist / maxD) * 0.62 + r() * 0.05, angle: pl.face > 0 ? 0 : Math.PI });
      const floors = r() < 0.18 ? 1 : r() < 0.75 ? 2 : 3;
      const H = 0.5 + floors * 3.2;
      const body = BODY[Math.floor(r() * BODY.length)];
      const accent = ACCENT[Math.floor(r() * ACCENT.length)];
      const roofC = "#d8d3cb";
      const FZ = 3.2; // front face
      add("body", h, [0, 0, -1.2], [7.2, H, 8.8], body);
      add("roof", h, [0, H, -1.2], [7.6, 0.26, 9.2], roofC);
      add("body", h, [-2.1, H + 0.26, -4], [2.6, 2.6, 2.8], body);
      add("roof", h, [-2.1, H + 2.86, -4], [2.9, 0.15, 3.1], roofC);
      add("tank", h, [-2.3, H + 3.0, -4.4], [0.55, 1.0, 0.55], "#1f2937");
      for (let f = 0; f < floors; f++) {
        const y0 = 0.5 + f * 3.2;
        add(r() < 0.68 ? "glassLit" : "glassDark", h, [1.3, y0 + 0.85, FZ + 0.02], [3.4, 1.45, 0.12], "#ffffff");
        add(r() < 0.6 ? "glassLit" : "glassDark", h, [3.62, y0 + 0.9, -1.8], [0.12, 1.3, 2.2], "#ffffff");
        add("roof", h, [1.3, y0 + 2.42, FZ + 0.3], [3.9, 0.08, 0.6], roofC);
        if (f > 0) {
          add("roof", h, [1.3, y0 - 0.12, FZ + 0.65], [3.9, 0.18, 1.3], roofC);
          add("dark", h, [1.3, y0 + 0.06, FZ + 1.27], [3.9, 0.9, 0.06], "#334155");
        }
      }
      add("trim", h, [-1.9, 0.5, FZ + 0.02], [1.1, 2.2, 0.12], "#7c4a24");
      add("trim", h, [-3.1, 0, FZ + 0.25], [0.9, H + 0.35, 0.5], accent);
      if (floors >= 2 && r() < 0.5) add("solar", h, [1.4, H + 0.35, -1.5], [3.4, 0.08, 2.2], "#ffffff", { mode: "u", rotX: -0.22 });
      const e = { phase: "e" };
      add("wall", h, [-3.3, 0, 7.35], [2.2, 1.3, 0.2], "#ece4d6", e);
      add("wall", h, [3.3, 0, 7.35], [2.2, 1.3, 0.2], "#ece4d6", e);
      add("wall", h, [-4.4, 0, 0], [0.2, 1.3, 14.9], "#ece4d6", e);
      add("wall", h, [4.4, 0, 0], [0.2, 1.3, 14.9], "#ece4d6", e);
      add("wall", h, [0, 0, -7.35], [8.8, 1.3, 0.2], "#ece4d6", e);
      add("wall", h, [0.1, 0, 5.3], [4.0, 0.04, 4.1], "#b5aea3", e);
      add("dark", h, [0.1, 0, 7.35], [4.2, 1.2, 0.06], "#1f2937", e);
      if (r() < 0.42) {
        add("carLower", h, [0.1, 0.3, 5.3], [1.75, 0.75, 3.9], CARS[Math.floor(r() * CARS.length)], { phase: "e", mode: "u" });
        add("carUpper", h, [0.1, 1.05, 5.1], [1.58, 0.58, 2.1], "#1f2937", { phase: "e", mode: "u" });
      }
      if (r() < 0.6) {
        const cr = 1.3 + r() * 0.5;
        add("trunk", h, [3.2, 0, 5.6], [0.6, 2.1, 0.6], "#ffffff", { phase: "e", mode: "u" });
        add("canopy", h, [3.2, 2.1 + cr * 0.6, 5.6], [cr, cr * 0.9, cr], this.canopyColors[Math.floor(r() * this.canopyColors.length)].getStyle(), { phase: "e", mode: "u" });
      }
    }
    this.societyParts = [];
    for (const name of Object.keys(registry)) {
      const R = registry[name];
      const mesh = new THREE.InstancedMesh(R.geo, R.mat, R.items.length);
      mesh.castShadow = R.cast;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      R.items.forEach((it, i) => mesh.setColorAt(i, _c.set(it.color)));
      mesh.visible = false;
      this.scene.add(mesh);
      this.societyParts.push({ mesh, items: R.items });
    }
  }

  updateSociety(s) {
    const visible = s > 0.0001;
    for (const part of this.societyParts) part.mesh.visible = visible;
    if (!visible) return;
    const hs = this.houses.map((h) => {
      const hp = range(s, h.delay, h.delay + 0.33);
      return [easeOutBack(range(hp, 0, 0.62)), easeOutCubic(range(hp, 0.4, 1))];
    });
    for (const part of this.societyParts) {
      part.items.forEach((it, i) => {
        const h = this.houses[it.house];
        const k = it.phase === "b" ? hs[it.house][0] : hs[it.house][1];
        const ks = Math.max(k, 0.0001);
        _q.setFromAxisAngle(Y_AXIS, h.angle);
        if (it.rotX) _q.multiply(_q2.setFromAxisAngle(_v2.set(1, 0, 0), it.rotX));
        const py = it.mode === "y" || it.phase === "b" ? it.pos.y * ks : it.pos.y;
        _v.set(it.pos.x, py, it.pos.z).applyAxisAngle(Y_AXIS, h.angle);
        _v.x += h.plot.cx;
        _v.y += BLOCK_H;
        _v.z += h.plot.cz;
        if (it.mode === "y") _s.set(it.scl.x, it.scl.y * ks, it.scl.z);
        else _s.copy(it.scl).multiplyScalar(ks);
        _m.compose(_v, _q, _s);
        part.mesh.setMatrixAt(i, _m);
      });
      part.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  // ---- hero plot: the home that gets built -----------------------------------------
  buildHero() {
    const hero = new THREE.Group();
    hero.position.set(heroPlot.cx, BLOCK_H, heroPlot.cz);
    hero.rotation.y = heroPlot.face > 0 ? 0 : Math.PI;
    this.scene.add(hero);
    this.hero = hero;

    const M = {
      concrete: std("#a9aeb4", 0.95),
      wall: std("#b5573c", 0.9),
      wood: std("#8a5a34", 0.65),
      dark: std("#2b3442", 0.55),
      cream: std("#efe7d8", 0.9),
      accent: std("#f97316", 0.5),
      lawn: std("#6aa84a", 1),
      paver: std("#b8b1a6", 1),
      soil: std("#8d6b4a", 1),
      brick: std("#b5573c", 0.9),
      car: std("#1d4ed8", 0.3, 0.35),
      tyre: std("#111827", 0.9),
      craneSolid: std("#f5b301", 0.55),
      white: std("#f8fafc", 0.6),
    };
    this.heroMats = M;
    this.heroGlass = new THREE.MeshStandardMaterial({ color: "#4f7fa8", roughness: 0.12, metalness: 0.1, emissive: new THREE.Color("#ffb45e"), emissiveIntensity: 0 });
    const railGlass = new THREE.MeshStandardMaterial({ color: "#cfe8ff", transparent: true, opacity: 0.38, roughness: 0.05, metalness: 0.1, depthWrite: false });
    const lampMat = this.lampMat;

    const box = (parent, w, h, d, x, y, z, mat, cast = true) => {
      const geo = new THREE.BoxGeometry(w, h, d).translate(0, h / 2, 0);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const group = (y = 0) => {
      const g = new THREE.Group();
      g.position.y = y;
      hero.add(g);
      return g;
    };

    this.pops = []; // { obj, a, b, mode }
    const pop = (obj, a, b, mode = "all") => {
      this.pops.push({ obj, a, b, mode });
      return obj;
    };

    // Footprint: x ±3.6, z -5.6 … 4.0 (front faces +z / the road)
    const X0 = -3.6, X1 = 3.6, ZR = -5.6, ZF = 4.0, t = 0.23;
    const zc = (ZR + ZF) / 2, depth = ZF - ZR;

    // Lime marking
    const mark = group(0.02);
    const lime = std("#ffffff", 1);
    box(mark, 7.4, 0.02, 0.12, 0, 0, ZF, lime, false);
    box(mark, 7.4, 0.02, 0.12, 0, 0, ZR, lime, false);
    box(mark, 0.12, 0.02, depth, X0, 0, zc, lime, false);
    box(mark, 0.12, 0.02, depth, X1, 0, zc, lime, false);
    this.heroMark = mark;

    // Plinth
    this.plinth = box(hero, 7.7, 0.6, depth + 0.3, 0, 0, zc, M.concrete);

    // Columns
    const colPos = [];
    for (const x of [-3.45, 0, 3.45]) for (const z of [ZF - 0.15, zc, ZR + 0.15]) colPos.push([x, z]);
    const colsGF = group(0.6);
    const colsFF = group(3.82);
    colPos.forEach(([x, z], i) => {
      pop(box(colsGF, 0.3, 3.0, 0.3, x, 0, z, M.concrete), 0.14 + i * 0.008, 0.22 + i * 0.008, "y");
      pop(box(colsFF, 0.3, 3.0, 0.3, x, 0, z, M.concrete), 0.36 + i * 0.008, 0.43 + i * 0.008, "y");
    });

    // Walls with openings
    const finish = [];
    const wallX = (parent, x0, x1, z, h, openings) => {
      let cur = x0;
      for (const o of openings) {
        if (o.a > cur) box(parent, o.a - cur, h, t, (cur + o.a) / 2, 0, z, M.wall);
        if (o.y0 > 0) box(parent, o.b - o.a, o.y0, t, (o.a + o.b) / 2, 0, z, M.wall);
        if (o.y1 < h) box(parent, o.b - o.a, h - o.y1, t, (o.a + o.b) / 2, o.y1, z, M.wall);
        finish.push({ parent, kind: o.kind || "win", w: o.b - o.a, h: o.y1 - o.y0, x: (o.a + o.b) / 2, y: o.y0, z, axis: "x" });
        cur = o.b;
      }
      if (cur < x1) box(parent, x1 - cur, h, t, (cur + x1) / 2, 0, z, M.wall);
    };
    const wallZ = (parent, z0, z1, x, h, openings) => {
      let cur = z0;
      for (const o of openings) {
        if (o.a > cur) box(parent, t, h, o.a - cur, x, 0, (cur + o.a) / 2, M.wall);
        if (o.y0 > 0) box(parent, t, o.y0, o.b - o.a, x, 0, (o.a + o.b) / 2, M.wall);
        if (o.y1 < h) box(parent, t, h - o.y1, o.b - o.a, x, o.y1, (o.a + o.b) / 2, M.wall);
        finish.push({ parent, kind: "win", w: o.b - o.a, h: o.y1 - o.y0, x, y: o.y0, z: (o.a + o.b) / 2, axis: "z" });
        cur = o.b;
      }
      if (cur < z1) box(parent, t, h, z1 - cur, x, 0, (cur + z1) / 2, M.wall);
    };
    const FH = 3.0;
    const wallsGF = group(0.6);
    wallX(wallsGF, X0, X1, ZF - t / 2, FH, [{ a: -2.9, b: -1.8, y0: 0, y1: 2.25, kind: "door" }, { a: -0.5, b: 2.9, y0: 0.85, y1: 2.3 }]);
    wallX(wallsGF, X0, X1, ZR + t / 2, FH, [{ a: -1.0, b: 1.0, y0: 1.0, y1: 2.2 }]);
    wallZ(wallsGF, ZR + t, ZF - t, X0 + t / 2, FH, [{ a: -2.8, b: -1.3, y0: 0.9, y1: 2.2 }]);
    wallZ(wallsGF, ZR + t, ZF - t, X1 - t / 2, FH, [{ a: -0.6, b: 1.0, y0: 0.9, y1: 2.2 }]);
    const wallsFF = group(3.82);
    wallX(wallsFF, X0, X1, ZF - t / 2, FH, [{ a: -3.0, b: 0.4, y0: 0.05, y1: 2.45, kind: "slide" }, { a: 1.2, b: 3.0, y0: 0.85, y1: 2.3 }]);
    wallX(wallsFF, X0, X1, ZR + t / 2, FH, [{ a: -1.2, b: 1.2, y0: 1.0, y1: 2.2 }]);
    wallZ(wallsFF, ZR + t, ZF - t, X0 + t / 2, FH, [{ a: -2.6, b: -1.1, y0: 0.9, y1: 2.2 }]);
    wallZ(wallsFF, ZR + t, ZF - t, X1 - t / 2, FH, [{ a: -1.6, b: 0.4, y0: 0.9, y1: 2.2 }]);
    this.wallsGF = wallsGF;
    this.wallsFF = wallsFF;

    // Slabs
    this.slab1 = pop(box(hero, 7.9, 0.22, depth + 0.4, 0, 3.6, zc, M.concrete), 0.3, 0.38, "xz");
    this.balconySlab = pop(box(hero, 4.1, 0.22, 1.6, -1.25, 3.6, ZF + 0.8, M.concrete), 0.34, 0.4, "xz");
    this.roofSlab = pop(box(hero, 8.0, 0.24, depth + 0.5, 0, 6.82, zc, M.concrete), 0.52, 0.58, "xz");

    // Roof: parapet, stair cabin, water tank, solar
    const roof = group(7.06);
    box(roof, 7.9, 0.9, 0.2, 0, 0, ZF + 0.12, M.wall);
    box(roof, 7.9, 0.9, 0.2, 0, 0, ZR - 0.12, M.wall);
    box(roof, 0.2, 0.9, depth + 0.2, X0 - 0.12, 0, zc, M.wall);
    box(roof, 0.2, 0.9, depth + 0.2, X1 + 0.12, 0, zc, M.wall);
    box(roof, 2.6, 2.7, 2.8, -2.2, 0, ZR + 1.6, M.wall);
    box(roof, 2.9, 0.16, 3.1, -2.2, 2.7, ZR + 1.6, M.concrete);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.1, 14).translate(0, 0.55, 0), std("#111827", 0.5));
    tank.position.set(-2.4, 2.86, ZR + 1.3);
    tank.castShadow = true;
    roof.add(tank);
    this.roofGroup = roof;
    const solar = group(7.06);
    for (let i = 0; i < 3; i++) {
      const p = box(solar, 1.1, 0.06, 1.9, 0.6 + i * 1.2, 0.5, -0.6, std("#1e3a8a", 0.25, 0.5));
      p.rotation.x = -0.28;
      pop(p, 0.74 + i * 0.015, 0.8 + i * 0.015);
    }
    const orangeBand = pop(box(hero, 7.92, 0.14, 0.04, 0, 7.55, ZF + 0.23, M.accent, false), 0.7, 0.76, "x");

    // Finishing: glass, door, sunshades, frame, cladding, porch
    finish.forEach((f, i) => {
      const a = 0.66 + (i % 8) * 0.012;
      if (f.kind === "door") {
        pop(box(f.parent, f.w - 0.1, f.h - 0.05, 0.08, f.x, f.y, f.z + 0.04, M.wood), a, a + 0.05);
        return;
      }
      const g = f.axis === "x" ? box(f.parent, f.w - 0.06, f.h - 0.06, 0.06, f.x, f.y + 0.03, f.z, this.heroGlass, false) : box(f.parent, 0.06, f.h - 0.06, f.w - 0.06, f.x, f.y + 0.03, f.z, this.heroGlass, false);
      pop(g, a, a + 0.05);
      if (f.axis === "x" && f.z > 0 && f.kind !== "slide") pop(box(f.parent, f.w + 0.5, 0.08, 0.65, f.x, f.y + f.h + 0.12, f.z + 0.32, M.concrete), a + 0.02, a + 0.07, "xz");
    });
    pop(box(hero, 0.32, 3.55, 1.0, X0 - 0.16, 3.6, ZF + 0.35, M.dark), 0.68, 0.74, "y");
    pop(box(hero, 0.32, 3.55, 1.0, X1 + 0.16, 3.6, ZF + 0.35, M.dark), 0.69, 0.75, "y");
    pop(box(hero, 1.2, 3.0, 0.06, -1.15, 0.6, ZF + 0.03, M.wood), 0.7, 0.76, "y");
    pop(box(hero, 1.9, 2.9, 0.06, 2.15, 3.85, ZF + 0.03, M.wood), 0.71, 0.77, "y");
    pop(box(hero, 1.8, 0.12, 1.3, -2.35, 2.85, ZF + 0.65, M.dark), 0.7, 0.75, "xz");
    pop(box(hero, 1.5, 0.2, 0.45, -2.35, 0.2, ZF + 0.25, M.concrete), 0.66, 0.7, "xz");
    pop(box(hero, 1.5, 0.2, 0.45, -2.35, 0.0, ZF + 0.6, M.concrete), 0.66, 0.7, "xz");
    pop(box(hero, 4.1, 1.0, 0.05, -1.25, 3.82, ZF + 1.55, railGlass, false), 0.73, 0.78, "y");
    pop(box(hero, 4.1, 0.06, 0.1, -1.25, 4.82, ZF + 1.55, M.dark), 0.74, 0.78, "x");

    // Compound wall, pillars, gate
    const cw = group(0);
    const CWZ = 7.3;
    box(cw, 2.3, 1.35, 0.2, -3.25, 0, CWZ, M.cream);
    box(cw, 2.1, 1.35, 0.2, 3.35, 0, CWZ, M.cream);
    box(cw, 0.2, 1.35, 14.6, -4.4, 0, 0, M.cream);
    box(cw, 0.2, 1.35, 14.6, 4.4, 0, 0, M.cream);
    box(cw, 8.8, 1.35, 0.2, 0, 0, -CWZ, M.cream);
    box(cw, 2.4, 0.08, 0.3, -3.25, 1.35, CWZ, M.dark);
    box(cw, 2.2, 0.08, 0.3, 3.35, 1.35, CWZ, M.dark);
    this.compound = cw;
    const gateG = group(0);
    for (const x of [-2.05, 2.25]) {
      box(gateG, 0.45, 1.75, 0.45, x, 0, CWZ, M.cream);
      box(gateG, 0.5, 0.08, 0.5, x, 1.75, CWZ, M.accent);
      box(gateG, 0.26, 0.26, 0.26, x, 1.83, CWZ, lampMat, false);
    }
    this.gatePanel = box(gateG, 4.1, 1.4, 0.07, 0.1, 0.05, CWZ - 0.1, M.dark);
    for (let i = 0; i < 5; i++) box(this.gatePanel, 4.0, 0.05, 0.02, 0, 0.2 + i * 0.25, 0.05, M.accent, false);
    this.gateGroup = gateG;

    // Landscaping
    const land = group(0.012);
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 14.4).rotateX(-Math.PI / 2), M.lawn);
    lawn.receiveShadow = true;
    land.add(lawn);
    const drive = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.3).rotateX(-Math.PI / 2), M.paver);
    drive.position.set(0.1, 0.01, 5.65);
    drive.receiveShadow = true;
    land.add(drive);
    const walk = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.6).rotateX(-Math.PI / 2), M.paver);
    walk.position.set(-2.35, 0.01, 5.8);
    land.add(walk);
    this.landscape = land;
    const tree = new THREE.Group();
    tree.position.set(3.2, 0, 5.7);
    hero.add(tree);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.4, 6).translate(0, 1.2, 0), this.trunkMat);
    const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), new THREE.MeshStandardMaterial({ color: "#5b8f33", roughness: 0.9, flatShading: true }));
    canopy.position.y = 3.2;
    trunk.castShadow = canopy.castShadow = true;
    tree.add(trunk, canopy);
    this.heroTree = tree;
    const shrubs = new THREE.Group();
    hero.add(shrubs);
    const shrubMat = new THREE.MeshStandardMaterial({ color: "#4d7c2a", roughness: 1, flatShading: true });
    [[-3.9, 1.5, 0.5], [-3.9, -1, 0.45], [-3.9, -3.5, 0.5], [3.9, -3.5, 0.5], [3.9, 0, 0.45], [-3.7, 6.6, 0.4], [-2.9, 6.8, 0.35]].forEach(([x, z, s], i) => {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), shrubMat);
      m.position.set(x, s * 0.7, z);
      m.castShadow = true;
      shrubs.add(m);
      pop(m, 0.84 + i * 0.008, 0.9 + i * 0.008);
    });

    // Family car
    const car = new THREE.Group();
    const cb = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 4.1).translate(0, 0.72, 0), M.car);
    const cc = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 2.2).translate(0, 1.38, -0.25), std("#1e293b", 0.2, 0.4));
    cb.castShadow = cc.castShadow = true;
    car.add(cb, cc);
    for (const [x, z] of [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.25, 12).rotateZ(Math.PI / 2), M.tyre);
      w.position.set(x, 0.34, z);
      car.add(w);
    }
    const hl = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.05), lampMat);
    hl.position.set(0, 0.85, 2.06);
    car.add(hl);
    car.visible = false;
    hero.add(car);
    this.heroCar = car;

    // Scaffolding
    const sb = new Batch();
    const sx0 = X0 - 0.7, sx1 = X1 + 0.7, sz0 = ZR - 0.7, sz1 = ZF + 0.7;
    const poles = [];
    for (let x = sx0; x <= sx1 + 0.01; x += (sx1 - sx0) / 4) poles.push([x, sz0], [x, sz1]);
    for (let z = sz0 + (sz1 - sz0) / 5; z < sz1 - 0.01; z += (sz1 - sz0) / 5) poles.push([sx0, z], [sx1, z]);
    for (const [x, z] of poles) sb.cyl(0.05, 0.05, 8.2, x, 0, z, "#9aa3ad", 5);
    for (let y = 1.6; y < 8.2; y += 2) {
      sb.box(sx1 - sx0, 0.07, 0.07, 0, y, sz0, "#9aa3ad");
      sb.box(sx1 - sx0, 0.07, 0.07, 0, y, sz1, "#9aa3ad");
      sb.box(0.07, 0.07, sz1 - sz0, sx0, y, (sz0 + sz1) / 2, "#9aa3ad");
      sb.box(0.07, 0.07, sz1 - sz0, sx1, y, (sz0 + sz1) / 2, "#9aa3ad");
    }
    for (const y of [3.55, 6.75]) sb.box(sx1 - sx0, 0.06, 0.6, 0, y, sz1 - 0.3, "#d69e2e");
    this.scaffold = sb.build(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0.3 }));
    hero.add(this.scaffold);

    // Materials on site
    this.soilPile = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.3, 9).translate(0, 0.65, 0), M.soil);
    this.soilPile.position.set(-3, 0, 6);
    this.brickStack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.1).translate(0, 0.45, 0), M.brick);
    this.brickStack.position.set(2.6, 0, 6.1);
    this.soilPile.castShadow = this.brickStack.castShadow = true;
    hero.add(this.soilPile, this.brickStack);

    // Tower crane on the plot behind
    const crane = new THREE.Group();
    crane.position.set(-3, 0, -13);
    hero.add(crane);
    const lat = T.latticeTexture(this.renderer);
    const mastTex = lat.clone();
    mastTex.needsUpdate = true;
    mastTex.wrapS = mastTex.wrapT = THREE.RepeatWrapping;
    mastTex.repeat.set(1, 18);
    const jibTex = lat.clone();
    jibTex.needsUpdate = true;
    jibTex.wrapS = jibTex.wrapT = THREE.RepeatWrapping;
    jibTex.repeat.set(22, 1);
    const latMat = (map) => new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.6, color: "#ffffff" });
    box(crane, 3, 0.6, 3, 0, 0, 0, M.concrete);
    box(crane, 1.2, 20, 1.2, 0, 0.6, 0, latMat(mastTex));
    const top = new THREE.Group();
    top.position.y = 20.6;
    crane.add(top);
    box(top, 1.8, 1.6, 1.8, 0.9, 0, 0, M.craneSolid);
    const jib = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 22).translate(0, 0.5, 11), latMat(jibTex));
    jib.position.set(0, 1.6, 0);
    jib.castShadow = true;
    top.add(jib);
    const cjib = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 7).translate(0, 0.4, -3.5), M.craneSolid);
    cjib.position.set(0, 1.7, 0);
    top.add(cjib);
    box(top, 1.8, 1.6, 1.4, 0, 0.6, -6.2, M.concrete);
    const apex = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4, 4).translate(0, 2, 0), M.craneSolid);
    apex.position.y = 2.6;
    top.add(apex);
    const trolley = new THREE.Group();
    trolley.position.set(0, 1.5, 12);
    top.add(trolley);
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 4).translate(0, -0.5, 0), M.dark);
    trolley.add(cable);
    const hook = new THREE.Group();
    trolley.add(hook);
    const hookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), M.craneSolid);
    const load = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.0).translate(0, -0.7, 0), M.brick);
    hook.add(hookBlock, load);
    load.castShadow = true;
    this.crane = crane;
    this.craneTop = top;
    this.craneTrolley = trolley;
    this.craneCable = cable;
    this.craneHook = hook;
  }

  updateHero(b) {
    const M = this.heroMats;
    // marking
    const markIn = range(b, 0, 0.05), markOut = range(b, 0.12, 0.18);
    this.heroMark.visible = markIn > 0 && markOut < 1;
    this.heroMark.scale.set(Math.max(0.001, easeOutCubic(markIn)), 1, Math.max(0.001, easeOutCubic(markIn)));

    // plinth emerges from the ground
    const pl = easeOutCubic(range(b, 0.05, 0.14));
    this.plinth.position.y = -0.62 * (1 - pl);
    this.plinth.visible = pl > 0;

    const setY = (obj, k) => {
      obj.scale.y = Math.max(0.0001, k);
      obj.visible = k > 0.0005;
    };
    setY(this.wallsGF, easeOutCubic(range(b, 0.2, 0.33)));
    setY(this.wallsFF, easeOutCubic(range(b, 0.42, 0.54)));
    setY(this.roofGroup, easeOutCubic(range(b, 0.57, 0.64)));

    for (const p of this.pops) {
      const k = easeOutBack(range(b, p.a, p.b));
      const s = Math.max(0.0001, k);
      if (p.mode === "y") p.obj.scale.set(1, s, 1);
      else if (p.mode === "xz") p.obj.scale.set(s, 1, s);
      else if (p.mode === "x") p.obj.scale.set(s, 1, 1);
      else p.obj.scale.setScalar(s);
      p.obj.visible = k > 0.0005;
    }

    // paint: brick → plaster white, grey concrete → off-white
    const paint = easeInOutCubic(range(b, 0.62, 0.72));
    M.wall.color.set("#b5573c").lerp(_c.set("#f6f2ea"), paint);
    M.concrete.color.set("#a9aeb4").lerp(_c.set("#e9e4db"), paint);

    // scaffolding up with the walls, then dismantled
    const scUp = easeOutCubic(range(b, 0.17, 0.5));
    const scDown = range(b, 0.7, 0.77);
    const sc = scUp * (1 - scDown);
    this.scaffold.scale.y = Math.max(0.0001, sc);
    this.scaffold.visible = sc > 0.001;

    // site materials
    const matsIn = easeOutBack(range(b, 0.04, 0.1));
    const matsOut = range(b, 0.7, 0.76);
    const mk = Math.max(0.0001, matsIn * (1 - matsOut));
    this.soilPile.scale.setScalar(mk);
    this.brickStack.scale.set(mk, mk * (1 - range(b, 0.2, 0.55) * 0.6), mk);
    this.soilPile.visible = this.brickStack.visible = mk > 0.001;

    // crane rises, works, then leaves
    const cIn = easeOutCubic(range(b, 0.02, 0.12));
    const cOut = range(b, 0.76, 0.84);
    const cs = cIn * (1 - easeInOutCubic(cOut));
    this.crane.scale.set(1, Math.max(0.0001, cs), 1);
    this.crane.visible = cs > 0.001;

    // compound wall, gate, landscaping
    setY(this.compound, easeOutCubic(range(b, 0.74, 0.83)));
    const g = easeOutBack(range(b, 0.8, 0.86));
    this.gateGroup.scale.set(1, Math.max(0.0001, g), 1);
    this.gateGroup.visible = g > 0.0005;
    const l = easeOutCubic(range(b, 0.8, 0.9));
    this.landscape.scale.set(Math.max(0.0001, l), 1, Math.max(0.0001, l));
    this.landscape.visible = l > 0.001;
    const tr = easeOutBack(range(b, 0.84, 0.94));
    this.heroTree.scale.setScalar(Math.max(0.0001, tr));
    this.heroTree.visible = tr > 0.001;

    // the family car arrives and the gate slides open
    const carP = range(b, 0.86, 0.99);
    this.gatePanel.position.x = 0.1 - easeInOutCubic(range(carP, 0.2, 0.55)) * 4.0;
    this.heroCar.visible = carP > 0;
    if (carP > 0) {
      const s = easeInOutCubic(carP);
      let x, z, head;
      if (s < 0.58) {
        const k = s / 0.58;
        x = lerp(-28, -4.1, k);
        z = 11.2;
        head = Math.PI / 2;
      } else if (s < 0.8) {
        const k = (s - 0.58) / 0.22;
        const phi = k * (Math.PI / 2);
        x = -4.1 + 4.2 * Math.sin(phi);
        z = 7.0 + 4.2 * Math.cos(phi);
        head = Math.PI / 2 + phi;
      } else {
        const k = (s - 0.8) / 0.2;
        x = 0.1;
        z = lerp(7.0, 5.5, k);
        head = Math.PI;
      }
      this.heroCar.position.set(x, 0, z);
      this.heroCar.rotation.y = head;
    }
  }

  // continuous crane motion while building
  updateHeroLive(b, t) {
    if (!this.crane.visible) return;
    this.craneTop.rotation.y = -0.5 + b * 2.4 + Math.sin(t * 0.4) * 0.05;
    const reach = 7 + Math.sin(b * 18) * 3.5;
    this.craneTrolley.position.z = reach;
    const drop = 9 + Math.sin(b * 23 + 1) * 4;
    this.craneCable.scale.y = drop;
    this.craneHook.position.y = -drop - 0.3;
  }

  // ---- markers --------------------------------------------------------------------------
  buildMarkers() {
    const g = new THREE.Group();
    g.position.set(heroPlot.cx, BLOCK_H + 0.03, heroPlot.cz);
    this.scene.add(g);
    this.marker = g;
    this.markerOutlineMat = new THREE.MeshBasicMaterial({ color: "#f97316", transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    this.markerFillMat = new THREE.MeshBasicMaterial({ color: "#fb923c", transparent: true, opacity: 0, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending });
    const w = P.PW - 0.2, d = P.PD - 0.2;
    for (const [bw, bd, x, z] of [[w, 0.35, 0, -d / 2], [w, 0.35, 0, d / 2], [0.35, d, -w / 2, 0], [0.35, d, w / 2, 0]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.12, bd), this.markerOutlineMat);
      m.position.set(x, 0.06, z);
      g.add(m);
    }
    const fill = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), this.markerFillMat);
    fill.position.y = 0.02;
    g.add(fill);
    this.ringMat = new THREE.MeshBasicMaterial({ color: "#f97316", transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.75, 48).rotateX(-Math.PI / 2), this.ringMat);
    this.ring.position.y = 0.05;
    g.add(this.ring);
    const pin = new THREE.Group();
    const pinMat = new THREE.MeshStandardMaterial({ color: "#f97316", emissive: new THREE.Color("#ea580c"), emissiveIntensity: 0.6, roughness: 0.35 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 16), pinMat);
    head.position.y = 1.9;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.2, 24).rotateX(Math.PI), pinMat);
    tip.position.y = 0.55;
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4 }));
    dot.position.set(0, 1.9, 0.85);
    pin.add(head, tip, dot);
    pin.traverse((o) => (o.castShadow = true));
    g.add(pin);
    this.pin = pin;
    g.visible = false;
  }
}
