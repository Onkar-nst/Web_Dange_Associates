import * as THREE from "three";
import {
  SITE_TEX, SITE, ewRoads, nsRoads, ENTRANCE, OUT_W, OUT_E, OUT_N, OUT_S,
  PARK, PLAY, CLUB, DECK, POOL, COURT, PW, PD, rng,
} from "./layoutPlan";

export const COLORS = {
  grass: "#86b94b",
  lawn: "#8fc454",
  asphalt: "#5b6069",
  paver: "#d9d2c3",
  curb: "#f1ede4",
  mark: "#f5f5f0",
  soil: "#cfb08d",
};

const makeCanvas = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

function finish(canvas, renderer, { repeat, srgb = true } = {}) {
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 1;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  tex.needsUpdate = true;
  return tex;
}

// Small speckle tile used as a pattern to break up flat colours.
function noiseTile(size, colors, count, seed = 7) {
  const c = makeCanvas(size, size);
  const g = c.getContext("2d");
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    g.fillStyle = colors[Math.floor(r() * colors.length)];
    g.globalAlpha = 0.08 + r() * 0.18;
    const s = 1 + r() * 3;
    g.fillRect(r() * size, r() * size, s, s);
  }
  g.globalAlpha = 1;
  return c;
}

export function grassTexture(renderer) {
  const c = makeCanvas(512, 512);
  const g = c.getContext("2d");
  g.fillStyle = COLORS.grass;
  g.fillRect(0, 0, 512, 512);
  const r = rng(11);
  // soft blotches
  for (let i = 0; i < 90; i++) {
    const x = r() * 512, y = r() * 512, rad = 20 + r() * 70;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    const col = r() > 0.5 ? "rgba(120,170,60,0.35)" : "rgba(160,190,80,0.3)";
    grd.addColorStop(0, col);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  g.drawImage(noiseTile(512, ["#5f8f2f", "#a6cf6a", "#78a940"], 9000), 0, 0);
  return finish(c, renderer, { repeat: [220, 220] });
}

// ---- Master site plan ------------------------------------------------------
export function sitePlanTexture(renderer, size) {
  const W = SITE_TEX.x1 - SITE_TEX.x0;
  const ppm = size / W;
  const c = makeCanvas(size, size);
  const g = c.getContext("2d");
  const X = (x) => (x - SITE_TEX.x0) * ppm;
  const Z = (z) => (z - SITE_TEX.z0) * ppm;
  const rect = (x0, z0, x1, z1, color) => {
    g.fillStyle = color;
    g.fillRect(X(x0), Z(z0), (x1 - x0) * ppm, (z1 - z0) * ppm);
  };
  const rrect = (x0, z0, x1, z1, rad, color) => {
    g.fillStyle = color;
    g.beginPath();
    g.roundRect(X(x0), Z(z0), (x1 - x0) * ppm, (z1 - z0) * ppm, rad * ppm);
    g.fill();
  };
  const circle = (x, z, rad, color) => {
    g.fillStyle = color;
    g.beginPath();
    g.arc(X(x), Z(z), rad * ppm, 0, Math.PI * 2);
    g.fill();
  };

  // Grass base + speckle (matches the tiled ground outside)
  rect(SITE_TEX.x0, SITE_TEX.z0, SITE_TEX.x1, SITE_TEX.z1, COLORS.grass);
  const speck = g.createPattern(noiseTile(256, ["#5f8f2f", "#a6cf6a", "#78a940"], 2600, 3), "repeat");
  g.fillStyle = speck;
  g.fillRect(0, 0, size, size);

  // Manicured lawn inside the compound wall
  rect(SITE.x0, SITE.z0, SITE.x1, SITE.z1, COLORS.lawn);
  g.fillStyle = speck;
  g.globalAlpha = 0.6;
  g.fillRect(X(SITE.x0), Z(SITE.z0), (SITE.x1 - SITE.x0) * ppm, (SITE.z1 - SITE.z0) * ppm);
  g.globalAlpha = 1;

  // --- Roads: footpath → curb → asphalt, drawn in passes so junctions merge cleanly
  const roads = [];
  for (const z of ewRoads) roads.push({ x0: OUT_W, x1: OUT_E, z0: z - 5, z1: z + 5, dir: "x", c: z });
  for (const r of nsRoads) roads.push({ x0: r.x - r.w / 2, x1: r.x + r.w / 2, z0: OUT_N, z1: OUT_S, dir: "z", c: r.x, median: r.median });
  const ent = { x0: ENTRANCE.x0 - 1, x1: ENTRANCE.x1, z0: ENTRANCE.z - ENTRANCE.w / 2, z1: ENTRANCE.z + ENTRANCE.w / 2, dir: "x", c: ENTRANCE.z };
  const all = [...roads, ent];
  const FP = 1.6; // footpath width
  for (const r of all) rect(r.x0, r.z0, r.x1, r.z1, COLORS.paver);
  // paver joints
  g.strokeStyle = "rgba(150,140,120,0.35)";
  g.lineWidth = Math.max(1, ppm * 0.05);
  for (const r of all) {
    const step = 1.2;
    if (r.dir === "x") {
      for (let x = r.x0; x < r.x1; x += step) {
        g.beginPath(); g.moveTo(X(x), Z(r.z0)); g.lineTo(X(x), Z(r.z0 + FP)); g.stroke();
        g.beginPath(); g.moveTo(X(x), Z(r.z1 - FP)); g.lineTo(X(x), Z(r.z1)); g.stroke();
      }
    } else {
      for (let z = r.z0; z < r.z1; z += step) {
        g.beginPath(); g.moveTo(X(r.x0), Z(z)); g.lineTo(X(r.x0 + FP), Z(z)); g.stroke();
        g.beginPath(); g.moveTo(X(r.x1 - FP), Z(z)); g.lineTo(X(r.x1), Z(z)); g.stroke();
      }
    }
  }
  for (const r of all) rect(r.x0 + (r.dir === "z" ? FP - 0.2 : -0.001), r.z0 + (r.dir === "x" ? FP - 0.2 : 0), r.x1 - (r.dir === "z" ? FP - 0.2 : 0), r.z1 - (r.dir === "x" ? FP - 0.2 : 0), COLORS.curb);
  for (const r of all) {
    if (r.dir === "x") rect(r.x0, r.z0 + FP, r.x1, r.z1 - FP, COLORS.asphalt);
    else rect(r.x0 + FP, r.z0, r.x1 - FP, r.z1, COLORS.asphalt);
  }
  rect(OUT_E - 5, ENTRANCE.z - ENTRANCE.w / 2 + FP, OUT_E + 1, ENTRANCE.z + ENTRANCE.w / 2 - FP, COLORS.asphalt);

  // asphalt grain
  const grain = g.createPattern(noiseTile(128, ["#3d4148", "#7b818a"], 900, 5), "repeat");
  g.save();
  g.globalAlpha = 0.5;
  g.fillStyle = grain;
  for (const r of all) g.fillRect(X(r.x0), Z(r.z0), (r.x1 - r.x0) * ppm, (r.z1 - r.z0) * ppm);
  g.restore();

  // --- Markings
  const inJunctionX = (x, pad) => nsRoads.some((n) => Math.abs(x - n.x) < n.w / 2 + pad);
  const inJunctionZ = (z, pad) => ewRoads.some((e) => Math.abs(z - e) < 5 + pad);
  const dash = 3, gap = 3, lw = 0.16;
  for (const z of ewRoads) {
    for (let x = OUT_W; x < OUT_E; x += dash + gap) {
      if (inJunctionX(x, 5) || inJunctionX(x + dash, 5) || x < OUT_W + 6 || x + dash > OUT_E - 6) continue;
      rect(x, z - lw / 2, x + dash, z + lw / 2, COLORS.mark);
    }
  }
  for (const n of nsRoads) {
    if (n.median) continue;
    for (let z = OUT_N; z < OUT_S; z += dash + gap) {
      if (inJunctionZ(z, 5) || inJunctionZ(z + dash, 5) || z < OUT_N + 6 || z + dash > OUT_S - 6) continue;
      rect(n.x - lw / 2, z, n.x + lw / 2, z + dash, COLORS.mark);
    }
  }
  // Avenue median between junctions
  const av = nsRoads.find((n) => n.median);
  for (let i = 0; i < ewRoads.length - 1; i++) {
    const za = ewRoads[i] + 5 + 4, zb = ewRoads[i + 1] - 5 - 4;
    rrect(av.x - 1.2, za, av.x + 1.2, zb, 1.2, COLORS.curb);
    rrect(av.x - 1, za + 0.2, av.x + 1, zb - 0.2, 1, "#6fa83d");
  }
  // Entrance boulevard median
  rrect(ENTRANCE.median[0], ENTRANCE.z - 1.2, ENTRANCE.median[1], ENTRANCE.z + 1.2, 1.2, COLORS.curb);
  rrect(ENTRANCE.median[0] + 0.2, ENTRANCE.z - 1, ENTRANCE.median[1] - 0.2, ENTRANCE.z + 1, 1, "#6fa83d");
  for (let x = ENTRANCE.x0 + 2; x < ENTRANCE.x1 - 2; x += dash + gap) {
    if (x > ENTRANCE.median[0] - 2 && x < ENTRANCE.median[1]) continue;
    rect(x, ENTRANCE.z - lw / 2, x + dash, ENTRANCE.z + lw / 2, COLORS.mark);
  }
  // Edge lines on the boulevard
  rect(ENTRANCE.x0 + 4, ENTRANCE.z - ENTRANCE.w / 2 + FP + 0.4, ENTRANCE.x1, ENTRANCE.z - ENTRANCE.w / 2 + FP + 0.55, COLORS.mark);
  rect(ENTRANCE.x0 + 4, ENTRANCE.z + ENTRANCE.w / 2 - FP - 0.55, ENTRANCE.x1, ENTRANCE.z + ENTRANCE.w / 2 - FP - 0.4, COLORS.mark);

  // Zebra crossings on every junction approach
  const zebraAcrossZ = (xa, xb, zc, halfW) => {
    for (let z = zc - halfW + 0.4; z < zc + halfW - 0.5; z += 1) rect(xa, z, xb, z + 0.5, COLORS.mark);
  };
  const zebraAcrossX = (za, zb, xc, halfW) => {
    for (let x = xc - halfW + 0.4; x < xc + halfW - 0.5; x += 1) rect(x, za, x + 0.5, zb, COLORS.mark);
  };
  for (const z of ewRoads) {
    for (const n of nsRoads) {
      const aw = 5 - FP; // half asphalt width of EW road
      for (const s of [-1, 1]) {
        const xa = n.x + s * (n.w / 2 + 1), xb = xa + s * 2.6;
        if (Math.min(xa, xb) > OUT_W && Math.max(xa, xb) < OUT_E) zebraAcrossZ(Math.min(xa, xb), Math.max(xa, xb), z, aw);
      }
      const nw = n.w / 2 - FP;
      for (const s of [-1, 1]) {
        const za = z + s * (5 + 1), zb = za + s * 2.6;
        if (Math.min(za, zb) > OUT_N && Math.max(za, zb) < OUT_S) {
          zebraAcrossX(Math.min(za, zb), Math.max(za, zb), n.x, nw);
        }
      }
    }
  }
  zebraAcrossZ(OUT_E + 1.5, OUT_E + 4.1, ENTRANCE.z, ENTRANCE.w / 2 - FP);
  zebraAcrossZ(126.5, 129, ENTRANCE.z, ENTRANCE.w / 2 - FP);

  // --- Central park: striped lawn, walking track, plaza, flower beds
  g.save();
  g.beginPath();
  g.roundRect(X(PARK.x0), Z(PARK.z0), (PARK.x1 - PARK.x0) * ppm, (PARK.z1 - PARK.z0) * ppm, 4 * ppm);
  g.clip();
  rect(PARK.x0, PARK.z0, PARK.x1, PARK.z1, "#7fbe45");
  g.translate(X((PARK.x0 + PARK.x1) / 2), Z((PARK.z0 + PARK.z1) / 2));
  g.rotate(Math.PI / 4);
  g.fillStyle = "rgba(255,255,255,0.09)";
  for (let s = -80; s < 80; s += 8) g.fillRect(s * ppm, -80 * ppm, 4 * ppm, 160 * ppm);
  g.restore();
  const track = { x0: PARK.x0 + 3.5, x1: PARK.x1 - 3.5, z0: PARK.z0 + 3.5, z1: PARK.z1 - 3.5 };
  g.lineWidth = 2.6 * ppm;
  g.strokeStyle = "#c06a4c";
  g.beginPath();
  g.roundRect(X(track.x0), Z(track.z0), (track.x1 - track.x0) * ppm, (track.z1 - track.z0) * ppm, 12 * ppm);
  g.stroke();
  g.lineWidth = 0.12 * ppm;
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.beginPath();
  g.roundRect(X(track.x0), Z(track.z0), (track.x1 - track.x0) * ppm, (track.z1 - track.z0) * ppm, 12 * ppm);
  g.stroke();
  const pc = { x: (PARK.x0 + PARK.x1) / 2, z: (PARK.z0 + PARK.z1) / 2 + 2 };
  // cross paths
  rect(pc.x - 1.2, track.z0, pc.x + 1.2, track.z1, COLORS.paver);
  rect(track.x0, pc.z - 1.2, track.x1, pc.z + 1.2, COLORS.paver);
  circle(pc.x, pc.z, 9, COLORS.paver);
  g.lineWidth = 0.25 * ppm;
  g.strokeStyle = "#b9ad97";
  for (const rr of [4, 6.5, 8.5]) { g.beginPath(); g.arc(X(pc.x), Z(pc.z), rr * ppm, 0, Math.PI * 2); g.stroke(); }
  const fr = rng(21);
  const bedColors = ["#f97316", "#facc15", "#ec4899", "#ef4444", "#fb923c"];
  for (const [bx, bz] of [[pc.x - 14, pc.z - 16], [pc.x + 14, pc.z - 16], [pc.x - 14, pc.z + 18], [pc.x + 14, pc.z + 18]]) {
    g.fillStyle = "#5c8f33";
    g.beginPath(); g.ellipse(X(bx), Z(bz), 5 * ppm, 3 * ppm, 0, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 160; i++) {
      const a = fr() * Math.PI * 2, rr = Math.sqrt(fr());
      g.fillStyle = bedColors[Math.floor(fr() * bedColors.length)];
      g.beginPath(); g.arc(X(bx + Math.cos(a) * rr * 4.5), Z(bz + Math.sin(a) * rr * 2.6), 0.28 * ppm, 0, Math.PI * 2); g.fill();
    }
  }
  // path from park to entrance road
  rect(PARK.x0 + 10, PLAY.z1, PARK.x0 + 12, PARK.z0 + 4, COLORS.paver);

  // --- Kids play area: soft rubber flooring in brand colours
  rrect(PLAY.x0, PLAY.z0, PLAY.x1, PLAY.z1, 3, "#88c250");
  circle(89, 5, 8, "#3b82f6");
  circle(89, 5, 6.8, "#60a5fa");
  circle(108, 4, 7, "#f97316");
  circle(108, 4, 5.8, "#fb923c");
  circle(121, 10, 4, "#ead9ab");
  rect(PLAY.x0 + 1, PLAY.z1 - 2.4, PLAY.x1 - 1, PLAY.z1 - 0.6, COLORS.paver);

  // --- Clubhouse plaza, pool deck & courts
  rect(CLUB.x0 - 2, CLUB.z0 - 2, CLUB.x1 + 2, ENTRANCE.z - ENTRANCE.w / 2, COLORS.paver);
  rect(DECK.x0, DECK.z0, DECK.x1, DECK.z1, "#ebe4d6");
  g.strokeStyle = "rgba(160,150,130,0.35)";
  g.lineWidth = Math.max(1, 0.06 * ppm);
  for (let x = DECK.x0; x < DECK.x1; x += 1.5) { g.beginPath(); g.moveTo(X(x), Z(DECK.z0)); g.lineTo(X(x), Z(DECK.z1)); g.stroke(); }
  rect(POOL.x0 - 0.6, POOL.z0 - 0.6, POOL.x1 + 0.6, POOL.z1 + 0.6, "#ffffff");
  rect(POOL.x0, POOL.z0, POOL.x1, POOL.z1, "#1d8fc4");
  rect(COURT.x0, COURT.z0, COURT.x1, COURT.z1, "#3d8a5c");
  for (const cz of [COURT.z0 + 9, COURT.z1 - 9]) {
    const cx = (COURT.x0 + COURT.x1) / 2;
    rect(cx - 15, cz - 7.5, cx + 15, cz + 7.5, "#2451b3");
    g.strokeStyle = "#ffffff";
    g.lineWidth = 0.12 * ppm;
    g.strokeRect(X(cx - 11.9), Z(cz - 5.5), 23.8 * ppm, 11 * ppm);
    g.strokeRect(X(cx - 11.9), Z(cz - 4.1), 23.8 * ppm, 8.2 * ppm);
    g.beginPath(); g.moveTo(X(cx - 6.4), Z(cz - 4.1)); g.lineTo(X(cx - 6.4), Z(cz + 4.1)); g.stroke();
    g.beginPath(); g.moveTo(X(cx + 6.4), Z(cz - 4.1)); g.lineTo(X(cx + 6.4), Z(cz + 4.1)); g.stroke();
    g.beginPath(); g.moveTo(X(cx - 6.4), Z(cz)); g.lineTo(X(cx + 6.4), Z(cz)); g.stroke();
  }
  // Path along the inside of the compound wall
  g.strokeStyle = "rgba(217,210,195,0.9)";
  g.lineWidth = 1.4 * ppm;
  g.strokeRect(X(SITE.x0 + 1.6), Z(SITE.z0 + 1.6), (SITE.x1 - SITE.x0 - 3.2) * ppm, (SITE.z1 - SITE.z0 - 3.2) * ppm);

  return finish(c, renderer);
}

// ---- Plot blocks with boundary lines and numbers ----------------------------
export function blockTexture(renderer, block, ppm, highlightN) {
  const w = Math.round((block.x1 - block.x0) * ppm);
  const h = Math.round((block.z1 - block.z0) * ppm);
  const c = makeCanvas(w, h);
  const g = c.getContext("2d");
  const r = rng(block.id * 97 + 3);
  g.fillStyle = COLORS.soil;
  g.fillRect(0, 0, w, h);
  const soils = ["#cdae8b", "#d3b693", "#c8a884", "#d0b18d", "#c9ab88"];
  for (const p of block.plots) {
    const x = (p.cx - PW / 2 - block.x0) * ppm;
    const z = (p.cz - PD / 2 - block.z0) * ppm;
    g.fillStyle = soils[Math.floor(r() * soils.length)];
    g.fillRect(x, z, PW * ppm, PD * ppm);
  }
  g.fillStyle = g.createPattern(noiseTile(128, ["#9c7b58", "#e6d3b8", "#b89470"], 1400, block.id + 1), "repeat");
  g.fillRect(0, 0, w, h);
  // boundaries
  g.strokeStyle = "rgba(250,246,238,0.95)";
  g.lineWidth = Math.max(2, 0.2 * ppm);
  for (let cx = 0; cx <= block.cols; cx++) {
    g.beginPath(); g.moveTo(cx * PW * ppm, 0); g.lineTo(cx * PW * ppm, h); g.stroke();
  }
  g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  // curb band
  g.strokeStyle = "#efe9de";
  g.lineWidth = 0.7 * ppm;
  g.strokeRect(0, 0, w, h);
  // numbers
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `600 ${Math.round(3 * ppm)}px Poppins, "Segoe UI", Arial, sans-serif`;
  for (const p of block.plots) {
    const x = (p.cx - block.x0) * ppm;
    const z = (p.cz - block.z0) * ppm;
    g.fillStyle = p.n === highlightN ? "rgba(234,88,12,0.95)" : "rgba(92,70,48,0.72)";
    g.fillText(String(p.n), x, z);
  }
  return finish(c, renderer);
}

// ---- Highway tile (one 40 m slice, repeated) -------------------------------
export function highwayTexture(renderer, lengthRepeat) {
  const ppm = 12;
  const W = 32, L = 40;
  const c = makeCanvas(W * ppm, L * ppm);
  const g = c.getContext("2d");
  const X = (x) => x * ppm;
  const rect = (x0, x1, color, z0 = 0, z1 = L) => { g.fillStyle = color; g.fillRect(X(x0), z0 * ppm, (x1 - x0) * ppm, (z1 - z0) * ppm); };
  rect(0, 32, "#b8b09c"); // gravel shoulder
  rect(2, 13, COLORS.asphalt);
  rect(17, 28, COLORS.asphalt);
  rect(13, 17, "#6c9e3c"); // median
  rect(13, 13.3, "#e5e1d6");
  rect(16.7, 17, "#e5e1d6");
  g.fillStyle = g.createPattern(noiseTile(128, ["#3d4148", "#7b818a"], 900, 9), "repeat");
  g.globalAlpha = 0.5;
  g.fillRect(X(2), 0, 11 * ppm, L * ppm);
  g.fillRect(X(17), 0, 11 * ppm, L * ppm);
  g.globalAlpha = 1;
  // edge lines
  for (const x of [2.4, 12.5, 17.3, 27.4]) rect(x, x + 0.18, "#f7f3e8");
  // lane dashes (yellow-white)
  for (const x of [5.9, 9.3, 20.8, 24.2]) {
    for (let z = 0; z < L; z += 10) rect(x - 0.08, x + 0.08, "#f7f3e8", z, z + 4);
  }
  return finish(c, renderer, { repeat: [1, lengthRepeat] });
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
  return finish(c, renderer);
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
  return finish(c, renderer);
}

// ---- Crop rows for farmland patches ---------------------------------------
export function fieldTexture(renderer) {
  const c = makeCanvas(128, 128);
  const g = c.getContext("2d");
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 8) {
    g.fillStyle = "rgba(0,0,0,0.13)";
    g.fillRect(0, y, 128, 3);
  }
  g.drawImage(noiseTile(128, ["#000000", "#ffffff"], 900, 13), 0, 0);
  return finish(c, renderer, { repeat: [1, 1] });
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
