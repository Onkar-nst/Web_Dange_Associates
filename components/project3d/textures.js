import * as THREE from "three";
import {
  SITE_TEX, SITE, ewRoads, nsRoads, ENTRANCE, OUT_W, OUT_E, OUT_N, OUT_S,
  PARK, PLAY, CLUB, DECK, POOL, COURT, PW, PD, rng,
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
  // Manicured lawn inside the compound wall
  m2.rect(SITE.x0, SITE.z0, SITE.x1, SITE.z1, "rgb(255,0,0)");

  // --- Roads: footpath (paver) → curb → asphalt
  const roads = [];
  for (const z of ewRoads) roads.push({ x0: OUT_W, x1: OUT_E, z0: z - 5, z1: z + 5, dir: "x" });
  for (const r of nsRoads) roads.push({ x0: r.x - r.w / 2, x1: r.x + r.w / 2, z0: OUT_N, z1: OUT_S, dir: "z", median: r.median });
  const ent = { x0: ENTRANCE.x0 - 1, x1: ENTRANCE.x1, z0: ENTRANCE.z - ENTRANCE.w / 2, z1: ENTRANCE.z + ENTRANCE.w / 2, dir: "x" };
  const all = [...roads, ent];
  const FP = 1.6;
  for (const r of all) {
    m.rect(r.x0, r.z0, r.x1, r.z1, PAVE);
    m2.rect(r.x0, r.z0, r.x1, r.z1, NONE);
  }
  for (const r of all) {
    const cx0 = r.x0 + (r.dir === "z" ? FP - 0.25 : 0), cx1 = r.x1 - (r.dir === "z" ? FP - 0.25 : 0);
    const cz0 = r.z0 + (r.dir === "x" ? FP - 0.25 : 0), cz1 = r.z1 - (r.dir === "x" ? FP - 0.25 : 0);
    m.rect(cx0, cz0, cx1, cz1, NONE);
    m2.rect(cx0, cz0, cx1, cz1, "rgb(0,255,0)");
  }
  for (const r of all) {
    const ax0 = r.dir === "z" ? r.x0 + FP : r.x0, ax1 = r.dir === "z" ? r.x1 - FP : r.x1;
    const az0 = r.dir === "x" ? r.z0 + FP : r.z0, az1 = r.dir === "x" ? r.z1 - FP : r.z1;
    m.rect(ax0, az0, ax1, az1, ASPH);
    m2.rect(ax0, az0, ax1, az1, NONE);
  }
  m.rect(OUT_E - 5, ENTRANCE.z - ENTRANCE.w / 2 + FP, OUT_E + 1, ENTRANCE.z + ENTRANCE.w / 2 - FP, ASPH);
  m2.rect(OUT_E - 5, ENTRANCE.z - ENTRANCE.w / 2 + FP, OUT_E + 1, ENTRANCE.z + ENTRANCE.w / 2 - FP, NONE);

  // --- Markings
  const inJunctionX = (x, pad) => nsRoads.some((n) => Math.abs(x - n.x) < n.w / 2 + pad);
  const inJunctionZ = (z, pad) => ewRoads.some((e) => Math.abs(z - e) < 5 + pad);
  const dash = 3, gap = 3, lw = 0.15;
  for (const z of ewRoads) {
    for (let x = OUT_W; x < OUT_E; x += dash + gap) {
      if (inJunctionX(x, 5) || inJunctionX(x + dash, 5) || x < OUT_W + 6 || x + dash > OUT_E - 6) continue;
      m.rect(x, z - lw / 2, x + dash, z + lw / 2, PAINT);
    }
  }
  for (const n of nsRoads) {
    if (n.median) continue;
    for (let z = OUT_N; z < OUT_S; z += dash + gap) {
      if (inJunctionZ(z, 5) || inJunctionZ(z + dash, 5) || z < OUT_N + 6 || z + dash > OUT_S - 6) continue;
      m.rect(n.x - lw / 2, z, n.x + lw / 2, z + dash, PAINT);
    }
  }
  // Avenue + boulevard medians (lawn with a concrete curb)
  const av = nsRoads.find((n) => n.median);
  const median = (xa, za, xb, zb, rad) => {
    m.rrect(xa, za, xb, zb, rad, NONE);
    m2.rrect(xa, za, xb, zb, rad, "rgb(0,255,0)");
    m2.rrect(xa + 0.2, za + 0.2, xb - 0.2, zb - 0.2, rad, "rgb(255,0,0)");
  };
  for (let i = 0; i < ewRoads.length - 1; i++) median(av.x - 1.2, ewRoads[i] + 9, av.x + 1.2, ewRoads[i + 1] - 9, 1.2);
  median(ENTRANCE.median[0], ENTRANCE.z - 1.2, ENTRANCE.median[1], ENTRANCE.z + 1.2, 1.2);
  for (let x = ENTRANCE.x0 + 2; x < ENTRANCE.x1 - 2; x += dash + gap) {
    if (x > ENTRANCE.median[0] - 2 && x < ENTRANCE.median[1]) continue;
    m.rect(x, ENTRANCE.z - lw / 2, x + dash, ENTRANCE.z + lw / 2, PAINT);
  }
  m.rect(ENTRANCE.x0 + 4, ENTRANCE.z - ENTRANCE.w / 2 + FP + 0.4, ENTRANCE.x1, ENTRANCE.z - ENTRANCE.w / 2 + FP + 0.55, PAINT);
  m.rect(ENTRANCE.x0 + 4, ENTRANCE.z + ENTRANCE.w / 2 - FP - 0.55, ENTRANCE.x1, ENTRANCE.z + ENTRANCE.w / 2 - FP - 0.4, PAINT);

  // Zebra crossings
  const zebraAcrossZ = (xa, xb, zc, halfW) => {
    for (let z = zc - halfW + 0.4; z < zc + halfW - 0.5; z += 1) m.rect(xa, z, xb, z + 0.5, PAINT);
  };
  const zebraAcrossX = (za, zb, xc, halfW) => {
    for (let x = xc - halfW + 0.4; x < xc + halfW - 0.5; x += 1) m.rect(x, za, x + 0.5, zb, PAINT);
  };
  for (const z of ewRoads) {
    for (const n of nsRoads) {
      const aw = 5 - FP;
      for (const s of [-1, 1]) {
        const xa = n.x + s * (n.w / 2 + 1), xb = xa + s * 2.6;
        if (Math.min(xa, xb) > OUT_W && Math.max(xa, xb) < OUT_E) zebraAcrossZ(Math.min(xa, xb), Math.max(xa, xb), z, aw);
      }
      const nw = n.w / 2 - FP;
      for (const s of [-1, 1]) {
        const za = z + s * (5 + 1), zb = za + s * 2.6;
        if (Math.min(za, zb) > OUT_N && Math.max(za, zb) < OUT_S) zebraAcrossX(Math.min(za, zb), Math.max(za, zb), n.x, nw);
      }
    }
  }
  zebraAcrossZ(OUT_E + 1.5, OUT_E + 4.1, ENTRANCE.z, ENTRANCE.w / 2 - FP);
  zebraAcrossZ(126.5, 129, ENTRANCE.z, ENTRANCE.w / 2 - FP);

  // --- Central park
  const pc = { x: (PARK.x0 + PARK.x1) / 2, z: (PARK.z0 + PARK.z1) / 2 + 2 };
  o.g.save();
  o.g.beginPath();
  o.g.roundRect(o.X(PARK.x0), o.Z(PARK.z0), (PARK.x1 - PARK.x0) * ppm2, (PARK.z1 - PARK.z0) * ppm2, 4 * ppm2);
  o.g.clip();
  o.g.translate(o.X(pc.x), o.Z(pc.z));
  o.g.rotate(Math.PI / 4);
  o.g.fillStyle = "rgba(210,235,160,0.16)";
  for (let s = -80; s < 80; s += 8) o.g.fillRect(s * ppm2, -80 * ppm2, 4 * ppm2, 160 * ppm2);
  o.g.restore();
  const track = { x0: PARK.x0 + 3.5, x1: PARK.x1 - 3.5, z0: PARK.z0 + 3.5, z1: PARK.z1 - 3.5 };
  o.g.lineWidth = 2.6 * ppm2;
  o.g.strokeStyle = "rgb(168,82,58)";
  o.g.beginPath();
  o.g.roundRect(o.X(track.x0), o.Z(track.z0), (track.x1 - track.x0) * ppm2, (track.z1 - track.z0) * ppm2, 12 * ppm2);
  o.g.stroke();
  o.g.lineWidth = 0.14 * ppm2;
  o.g.strokeStyle = "rgb(235,232,225)";
  o.g.stroke();
  for (const [xa, za, xb, zb] of [[pc.x - 1.2, track.z0, pc.x + 1.2, track.z1], [track.x0, pc.z - 1.2, track.x1, pc.z + 1.2], [PARK.x0 + 10, PLAY.z1, PARK.x0 + 12, PARK.z0 + 4]]) {
    m.rect(xa, za, xb, zb, PAVE);
    m2.rect(xa, za, xb, zb, NONE);
  }
  m.circle(pc.x, pc.z, 9, PAVE);
  m2.circle(pc.x, pc.z, 9, NONE);
  const fr = rng(21);
  const bedColors = ["#e8641b", "#f2c230", "#d6337a", "#c42b2b", "#f08a3c", "#ffffff"];
  for (const [bx, bz] of [[pc.x - 14, pc.z - 16], [pc.x + 14, pc.z - 16], [pc.x - 14, pc.z + 18], [pc.x + 14, pc.z + 18]]) {
    o.g.fillStyle = "rgb(62,92,36)";
    o.g.beginPath(); o.g.ellipse(o.X(bx), o.Z(bz), 5 * ppm2, 3 * ppm2, 0, 0, Math.PI * 2); o.g.fill();
    for (let i = 0; i < 260; i++) {
      const a = fr() * Math.PI * 2, rr = Math.sqrt(fr());
      o.circle(bx + Math.cos(a) * rr * 4.6, bz + Math.sin(a) * rr * 2.7, 0.18, bedColors[Math.floor(fr() * bedColors.length)]);
    }
  }

  // --- Play area: rubber flooring in brand colours
  o.circle(89, 5, 8, "rgb(40,98,200)");
  o.circle(108, 4, 7, "rgb(226,104,30)");
  o.circle(121, 10, 4, "rgb(214,196,150)");

  // --- Clubhouse plaza, pool deck, courts
  m.rect(CLUB.x0 - 2, CLUB.z0 - 2, CLUB.x1 + 2, ENTRANCE.z - ENTRANCE.w / 2, PAVE);
  m2.rect(CLUB.x0 - 2, CLUB.z0 - 2, CLUB.x1 + 2, ENTRANCE.z - ENTRANCE.w / 2, NONE);
  o.rect(DECK.x0, DECK.z0, DECK.x1, DECK.z1, "rgb(222,212,192)");
  o.rect(POOL.x0 - 0.6, POOL.z0 - 0.6, POOL.x1 + 0.6, POOL.z1 + 0.6, "rgb(245,245,240)");
  o.rect(COURT.x0, COURT.z0, COURT.x1, COURT.z1, "rgb(52,112,78)");
  for (const cz of [COURT.z0 + 9, COURT.z1 - 9]) {
    const cx = (COURT.x0 + COURT.x1) / 2;
    o.rect(cx - 15, cz - 7.5, cx + 15, cz + 7.5, "rgb(34,76,160)");
    o.g.strokeStyle = "#ffffff";
    o.g.lineWidth = Math.max(1, 0.1 * ppm2);
    o.g.strokeRect(o.X(cx - 11.9), o.Z(cz - 5.5), 23.8 * ppm2, 11 * ppm2);
    o.g.strokeRect(o.X(cx - 11.9), o.Z(cz - 4.1), 23.8 * ppm2, 8.2 * ppm2);
    o.g.beginPath(); o.g.moveTo(o.X(cx - 6.4), o.Z(cz - 4.1)); o.g.lineTo(o.X(cx - 6.4), o.Z(cz + 4.1)); o.g.stroke();
    o.g.beginPath(); o.g.moveTo(o.X(cx + 6.4), o.Z(cz - 4.1)); o.g.lineTo(o.X(cx + 6.4), o.Z(cz + 4.1)); o.g.stroke();
    o.g.beginPath(); o.g.moveTo(o.X(cx - 6.4), o.Z(cz)); o.g.lineTo(o.X(cx + 6.4), o.Z(cz)); o.g.stroke();
  }
  // Walkway along the inside of the compound wall
  m.g.strokeStyle = PAVE;
  m.g.lineWidth = 1.4 * ppm;
  m.g.strokeRect(m.X(SITE.x0 + 1.6), m.Z(SITE.z0 + 1.6), (SITE.x1 - SITE.x0 - 3.2) * ppm, (SITE.z1 - SITE.z0 - 3.2) * ppm);
  m2.g.strokeStyle = NONE;
  m2.g.lineWidth = 1.4 * ppm2;
  m2.g.strokeRect(m2.X(SITE.x0 + 1.6), m2.Z(SITE.z0 + 1.6), (SITE.x1 - SITE.x0 - 3.2) * ppm2, (SITE.z1 - SITE.z0 - 3.2) * ppm2);

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
  for (let cx = 0; cx <= block.cols; cx++) {
    g.beginPath(); g.moveTo(cx * PW * ppm, 0); g.lineTo(cx * PW * ppm, h); g.stroke();
  }
  g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  g.strokeStyle = "rgb(0,0,255)";
  g.lineWidth = 0.9 * ppm;
  g.strokeRect(0, 0, w, h);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${Math.round(2.6 * ppm)}px Poppins, "Segoe UI", Arial, sans-serif`;
  g.fillStyle = "rgb(0,255,0)";
  for (const p of block.plots) g.fillText(String(p.n), (p.cx - block.x0) * ppm, (p.cz - block.z0) * ppm);
  return toTexture(c, renderer);
}

// ---- Highway tile mask (one 40 m slice, repeated): R asphalt, G gravel shoulder, B paint -----
export function highwayMask(renderer, lengthRepeat) {
  const ppm = 12;
  const W = 32, L = 40;
  const c = makeCanvas(W * ppm, L * ppm);
  const g = c.getContext("2d");
  const rect = (x0, x1, color, z0 = 0, z1 = L) => { g.fillStyle = color; g.fillRect(x0 * ppm, z0 * ppm, (x1 - x0) * ppm, (z1 - z0) * ppm); };
  rect(0, 32, "rgb(0,255,0)");
  rect(2, 13, ASPH);
  rect(17, 28, ASPH);
  rect(13, 17, NONE);
  for (const x of [2.4, 12.5, 17.3, 27.4]) rect(x, x + 0.18, PAINT);
  for (const x of [5.9, 9.3, 20.8, 24.2]) for (let z = 0; z < L; z += 10) rect(x - 0.08, x + 0.08, PAINT, z, z + 4);
  const tex = toTexture(c, renderer);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, lengthRepeat);
  return tex;
}

// ---- Gate name board -------------------------------------------------------
export function boardTexture(renderer, title, subtitle) {
  const c = makeCanvas(1600, 200);
  const g = c.getContext("2d");
  const grd = g.createLinearGradient(0, 0, 1600, 0);
  grd.addColorStop(0, "#1e3a8a");
  grd.addColorStop(0.5, "#1e40af");
  grd.addColorStop(1, "#1e3a8a");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1600, 200);
  g.fillStyle = "#f97316";
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
