import * as THREE from "three";
import {
  SITE_TEX, SITE_POLY, roads, FP, onRoad, GATE, WALL_N, MAIN_ROAD, WIDENING,
  PARK, PARK2, PLAY, CLUB, TEMPLE, rng,
} from "./layoutPlan";

// The ground is shaded with real photographic PBR textures (see public/flythrough/tex).
// These canvases only say *which* material goes where:
//   mask   R = asphalt, G = paver blocks, B = white road paint
//   mask2  R = manicured lawn, G = concrete curb
//   overlay RGBA = coloured surfaces (track, courts, play floor, flower beds …) with alpha = coverage

const makeCanvas = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

function toTexture(canvas, renderer, { srgb = false } = {}) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 1;
  tex.needsUpdate = true;
  return tex;
}

function painter(canvas, x0, z0, ppm) {
  const g = canvas.getContext("2d");
  const X = (x) => (x - x0) * ppm;
  const Z = (z) => (z - z0) * ppm;
  return {
    g,
    X,
    Z,
    rect(xa, za, xb, zb, color) {
      g.fillStyle = color;
      g.fillRect(X(xa), Z(za), (xb - xa) * ppm, (zb - za) * ppm);
    },
    rrect(xa, za, xb, zb, rad, color) {
      g.fillStyle = color;
      g.beginPath();
      g.roundRect(X(xa), Z(za), (xb - xa) * ppm, (zb - za) * ppm, rad * ppm);
      g.fill();
    },
    circle(x, z, rad, color) {
      g.fillStyle = color;
      g.beginPath();
      g.arc(X(x), Z(z), rad * ppm, 0, Math.PI * 2);
      g.fill();
    },
    poly(pts, color) {
      g.fillStyle = color;
      g.beginPath();
      pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Z(z)) : g.moveTo(X(x), Z(z))));
      g.closePath();
      g.fill();
    },
    // Stroke a polyline with a width in metres (butt ends, mitred corners)
    line(pts, width, color, dash = null) {
      g.strokeStyle = color;
      g.lineWidth = width * ppm;
      g.lineCap = "butt";
      g.lineJoin = "miter";
      g.setLineDash(dash ? dash.map((d) => d * ppm) : []);
      g.beginPath();
      pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Z(z)) : g.moveTo(X(x), Z(z))));
      g.stroke();
      g.setLineDash([]);
    },
    clipTo(pts) {
      g.save();
      g.beginPath();
      pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Z(z)) : g.moveTo(X(x), Z(z))));
      g.closePath();
      g.clip();
    },
    unclip() {
      g.restore();
    },
  };
}

const ASPH = "rgb(255,0,0)";
const PAVE = "rgb(0,255,0)";
const PAINT = "rgb(0,0,255)";
const NONE = "rgb(0,0,0)";

// ---- Master site plan masks ------------------------------------------------
export function sitePlanMasks(renderer, size) {
  const W = SITE_TEX.x1 - SITE_TEX.x0;
  const ppm = size / W;
  const small = size / 2;
  const ppm2 = small / W;

  const maskC = makeCanvas(size, size);
  const m = painter(maskC, SITE_TEX.x0, SITE_TEX.z0, ppm);
  const mask2C = makeCanvas(small, small);
  const m2 = painter(mask2C, SITE_TEX.x0, SITE_TEX.z0, ppm2);
  const overC = makeCanvas(small, small);
  const o = painter(overC, SITE_TEX.x0, SITE_TEX.z0, ppm2);

  m.rect(SITE_TEX.x0, SITE_TEX.z0, SITE_TEX.x1, SITE_TEX.z1, NONE);
  m2.rect(SITE_TEX.x0, SITE_TEX.z0, SITE_TEX.x1, SITE_TEX.z1, NONE);

  // Road-widening strip between the Shiv Pandan Road and the compound wall: paved verge
  m.rect(SITE_TEX.x0, WIDENING.z0, SITE_TEX.x1, WIDENING.z1 - 0.4, PAVE);

  // Manicured lawn inside the compound wall
  m2.poly(SITE_POLY, "rgb(255,0,0)");

  // --- Roads: footpath (paver) → curb → asphalt, clipped to the compound
  m.clipTo(SITE_POLY);
  m2.clipTo(SITE_POLY);
  for (const r of roads) {
    m.line(r.pts, r.w, PAVE);
    m2.line(r.pts, r.w, NONE);
  }
  for (const r of roads) {
    m.line(r.pts, r.w - 2 * FP + 0.5, NONE);
    m2.line(r.pts, r.w - 2 * FP + 0.5, "rgb(0,255,0)");
  }
  for (const r of roads) {
    m.line(r.pts, r.w - 2 * FP, ASPH);
    m2.line(r.pts, r.w - 2 * FP, NONE);
  }
  // Gate mouth through the wall onto the main road
  m.rect(GATE.x0 + 1.5, WALL_N - 1, GATE.x1 - 1.5, WALL_N + 2, ASPH);
  m.unclip();
  m2.unclip();
  m.rect(GATE.x0 + 1.5, WIDENING.z0, GATE.x1 - 1.5, WALL_N + 0.5, ASPH);

  // --- Centre-line dashes (broken at junctions)
  const lw = 0.15;
  m.clipTo(SITE_POLY);
  for (const r of roads) {
    const L = r.pts.slice(1).reduce((acc, p, i) => acc + Math.hypot(p[0] - r.pts[i][0], p[1] - r.pts[i][1]), 0);
    const steps = Math.floor(L / 6);
    for (let k = 0; k < steps; k++) {
      // walk the polyline
      let t = k * 6 + 1.5, i = 0;
      while (i < r.pts.length - 2 && t > Math.hypot(r.pts[i + 1][0] - r.pts[i][0], r.pts[i + 1][1] - r.pts[i][1])) {
        t -= Math.hypot(r.pts[i + 1][0] - r.pts[i][0], r.pts[i + 1][1] - r.pts[i][1]);
        i++;
      }
      const [ax, az] = r.pts[i];
      const [bx, bz] = r.pts[i + 1];
      const sl = Math.hypot(bx - ax, bz - az) || 1;
      const ux = (bx - ax) / sl, uz = (bz - az) / sl;
      const x0 = ax + ux * t, z0 = az + uz * t;
      const x1 = x0 + ux * 3, z1 = z0 + uz * 3;
      if (onRoad(x0, z0, 1, r) || onRoad(x1, z1, 1, r)) continue;
      m.line([[x0, z0], [x1, z1]], lw, PAINT);
    }
  }
  // Zebra crossing at the gate
  for (let x = GATE.x0 + 2; x < GATE.x1 - 2; x += 1) m.rect(x, WALL_N + 3, x + 0.5, WALL_N + 5.6, PAINT);
  m.unclip();

  // --- Open Space-1: garden with a walking track, fountain plaza and flower beds
  const garden = (A, beds, seed) => {
    const pc = { x: (A.x0 + A.x1) / 2, z: (A.z0 + A.z1) / 2 };
    o.g.save();
    o.g.beginPath();
    o.g.roundRect(o.X(A.x0), o.Z(A.z0), (A.x1 - A.x0) * ppm2, (A.z1 - A.z0) * ppm2, 4 * ppm2);
    o.g.clip();
    o.g.translate(o.X(pc.x), o.Z(pc.z));
    o.g.rotate(Math.PI / 4);
    o.g.fillStyle = "rgba(210,235,160,0.16)";
    for (let s = -80; s < 80; s += 8) o.g.fillRect(s * ppm2, -80 * ppm2, 4 * ppm2, 160 * ppm2);
    o.g.restore();
    const track = { x0: A.x0 + 2.5, x1: A.x1 - 2.5, z0: A.z0 + 2.5, z1: A.z1 - 2.5 };
    o.g.lineWidth = 2.2 * ppm2;
    o.g.strokeStyle = "rgb(168,82,58)";
    o.g.beginPath();
    o.g.roundRect(o.X(track.x0), o.Z(track.z0), (track.x1 - track.x0) * ppm2, (track.z1 - track.z0) * ppm2, 7 * ppm2);
    o.g.stroke();
    o.g.lineWidth = 0.12 * ppm2;
    o.g.strokeStyle = "rgb(235,232,225)";
    o.g.stroke();
    // Cross paths + central plaza
    for (const [xa, za, xb, zb] of [[pc.x - 1, track.z0, pc.x + 1, track.z1], [track.x0, pc.z - 1, track.x1, pc.z + 1]]) {
      m.rect(xa, za, xb, zb, PAVE);
      m2.rect(xa, za, xb, zb, NONE);
    }
    m.circle(pc.x, pc.z, 5.5, PAVE);
    m2.circle(pc.x, pc.z, 5.5, NONE);
    const fr = rng(seed);
    const bedColors = ["#e8641b", "#f2c230", "#d6337a", "#c42b2b", "#f08a3c", "#ffffff"];
    for (const [bx, bz] of beds) {
      o.g.fillStyle = "rgb(62,92,36)";
      o.g.beginPath(); o.g.ellipse(o.X(bx), o.Z(bz), 4 * ppm2, 2.2 * ppm2, 0, 0, Math.PI * 2); o.g.fill();
      for (let i = 0; i < 180; i++) {
        const a = fr() * Math.PI * 2, rr = Math.sqrt(fr());
        o.circle(bx + Math.cos(a) * rr * 3.6, bz + Math.sin(a) * rr * 1.9, 0.18, bedColors[Math.floor(fr() * bedColors.length)]);
      }
    }
    return pc;
  };
  const pc1 = { x: (PARK.x0 + PARK.x1) / 2, z: (PARK.z0 + PARK.z1) / 2 };
  garden(PARK, [[pc1.x - 11, pc1.z - 5], [pc1.x + 11, pc1.z - 5], [pc1.x - 11, pc1.z + 5], [pc1.x + 11, pc1.z + 5]], 21);
  const pc2 = { x: (PARK2.x0 + PARK2.x1) / 2, z: (PARK2.z0 + PARK2.z1) / 2 };
  garden(PARK2, [[pc2.x - 10, pc2.z + 5], [pc2.x + 10, pc2.z - 5]], 37);
  // Lawn area around Plot 141 at the west end of Open Space-1 stays plain grass

  // --- Amenity Space-1: kids' play area (rubber floor); the rest stays open lawn
  const plx = (PLAY.x0 + PLAY.x1) / 2, plz = (PLAY.z0 + PLAY.z1) / 2;
  o.circle(plx - 5, plz - 1, 6.5, "rgb(40,98,200)");
  o.circle(plx + 6, plz + 2, 5.5, "rgb(226,104,30)");
  o.circle(plx + 5, plz - 7, 3, "rgb(214,196,150)");
  // --- Amenity Space-2: clubhouse plaza, temple courtyard
  m.rect(CLUB.x0 - 2, CLUB.z0 - 1, CLUB.x1 + 2, CLUB.z1 + 3, PAVE);
  m2.rect(CLUB.x0 - 2, CLUB.z0 - 1, CLUB.x1 + 2, CLUB.z1 + 3, NONE);
  // Temple courtyard: stone paving with a path from the gate road
  m.rect(TEMPLE.x0, TEMPLE.z0, TEMPLE.x1, TEMPLE.z1, PAVE);
  m2.rect(TEMPLE.x0, TEMPLE.z0, TEMPLE.x1, TEMPLE.z1, NONE);
  o.rect(TEMPLE.x0 + 1, TEMPLE.z0 + 1, TEMPLE.x1 - 1, TEMPLE.z1 - 1, "rgb(226,214,190)");
  o.g.strokeStyle = "rgb(196,150,92)";
  o.g.lineWidth = 0.5 * ppm2;
  o.g.strokeRect(o.X(TEMPLE.x0 + 1.5), o.Z(TEMPLE.z0 + 1.5), (TEMPLE.x1 - TEMPLE.x0 - 3) * ppm2, (TEMPLE.z1 - TEMPLE.z0 - 3) * ppm2);

  // Walkway along the inside of the compound wall
  m.clipTo(SITE_POLY);
  m2.clipTo(SITE_POLY);
  const inner = SITE_POLY;
  m.line([...inner, inner[0]], 1.4 * 2 + 0.6, PAVE);
  m2.line([...inner, inner[0]], 1.4 * 2 + 0.6, NONE);
  m.unclip();
  m2.unclip();

  return {
    mask: toTexture(maskC, renderer),
    mask2: toTexture(mask2C, renderer),
    overlay: toTexture(overC, renderer, { srgb: true }),
  };
}

// ---- Plot block mask: R = lime boundary lines, G = plot numbers, B = curb band ---------
export function blockMask(renderer, block, ppm) {
  const w = Math.round((block.x1 - block.x0) * ppm);
  const h = Math.round((block.z1 - block.z0) * ppm);
  const c = makeCanvas(w, h);
  const g = c.getContext("2d");
  g.fillStyle = NONE;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = "rgb(255,0,0)";
  g.lineWidth = Math.max(2, 0.14 * ppm);
  for (const p of block.plots) g.strokeRect((p.x0 - block.x0) * ppm, (p.z0 - block.z0) * ppm, (p.x1 - p.x0) * ppm, (p.z1 - p.z0) * ppm);
  g.strokeStyle = "rgb(0,0,255)";
  g.lineWidth = 0.9 * ppm;
  g.strokeRect(0, 0, w, h);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${Math.round(2.4 * ppm)}px Poppins, "Segoe UI", Arial, sans-serif`;
  g.fillStyle = "rgb(0,255,0)";
  for (const p of block.plots) g.fillText(String(p.n), (p.cx - block.x0) * ppm, (p.cz - block.z0) * ppm);
  return toTexture(c, renderer);
}

// ---- Main road tile mask (15 m Shiv Pandan Road, one 40 m slice repeated along x): R asphalt, G gravel shoulder, B paint
export function mainRoadMask(renderer, lengthRepeat) {
  const ppm = 12;
  const W = 15, L = 40;
  const c = makeCanvas(L * ppm, W * ppm);
  const g = c.getContext("2d");
  const rect = (z0, z1, color, x0 = 0, x1 = L) => { g.fillStyle = color; g.fillRect(x0 * ppm, z0 * ppm, (x1 - x0) * ppm, (z1 - z0) * ppm); };
  rect(0, W, "rgb(0,255,0)");
  rect(1.2, W - 1.2, ASPH);
  for (const z of [1.5, W - 1.68]) rect(z, z + 0.18, PAINT);
  for (let x = 0; x < L; x += 10) rect(W / 2 - 0.08, W / 2 + 0.08, PAINT, x, x + 4);
  const tex = toTexture(c, renderer);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(lengthRepeat, 1);
  return tex;
}

// ---- Gate name board -------------------------------------------------------
export function boardTexture(renderer, title, subtitle) {
  const c = makeCanvas(1600, 200);
  const g = c.getContext("2d");
  const grd = g.createLinearGradient(0, 0, 1600, 0);
  grd.addColorStop(0, "#112443");
  grd.addColorStop(0.5, "#1f3f73");
  grd.addColorStop(1, "#112443");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1600, 200);
  g.fillStyle = "#9eb2d3";
  g.fillRect(0, 186, 1600, 14);
  g.fillRect(0, 0, 1600, 8);
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 92px Poppins, "Segoe UI", Arial, sans-serif`;
  g.fillText(title, 800, subtitle ? 82 : 100);
  if (subtitle) {
    g.font = `600 34px Poppins, "Segoe UI", Arial, sans-serif`;
    g.fillStyle = "#fed7aa";
    g.fillText(subtitle, 800, 150);
  }
  return toTexture(c, renderer, { srgb: true });
}

// ---- Crane lattice (alpha tested) ----------------------------------------
export function latticeTexture(renderer) {
  const c = makeCanvas(64, 64);
  const g = c.getContext("2d");
  g.clearRect(0, 0, 64, 64);
  g.strokeStyle = "#f5b301";
  g.lineWidth = 6;
  g.strokeRect(0, 0, 64, 64);
  g.lineWidth = 4;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(64, 64); g.stroke();
  return toTexture(c, renderer, { srgb: true });
}

// ---- Gentle water ripples (normal map) ------------------------------------
export function waterNormalTexture() {
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext("2d");
  const img = g.createImageData(S, S);
  const r = rng(5);
  const waves = Array.from({ length: 7 }, () => ({ kx: Math.round((r() - 0.5) * 10), ky: Math.round((r() - 0.5) * 10), ph: r() * 6.28, a: 0.3 + r() * 0.7 }));
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let dx = 0, dy = 0;
      for (const w of waves) {
        const t = ((w.kx * x + w.ky * y) / S) * Math.PI * 2 + w.ph;
        dx += Math.cos(t) * w.kx * w.a;
        dy += Math.cos(t) * w.ky * w.a;
      }
      const i = (y * S + x) * 4;
      img.data[i] = 128 + dx * 4;
      img.data[i + 1] = 128 + dy * 4;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ---- Soft round glow for lamps --------------------------------------------
export function glowTexture() {
  const c = makeCanvas(64, 64);
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,236,200,1)");
  grd.addColorStop(0.25, "rgba(255,200,120,0.6)");
  grd.addColorStop(1, "rgba(255,160,60,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
