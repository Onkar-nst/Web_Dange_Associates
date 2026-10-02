// Geometry of the Shree Ram Nagri-1 layout used by the 3D fly-through, traced from the sanctioned
// layout plan (Kh. No. 47, Mouza Bramni, Tah. Kalmeshwar). 1 world unit = 1 metre.
// -z is north (the 15 m Shiv Pandan Road), +x is east (the nallah side). The drawing's slight tilt
// (~3°) is removed so the road grid is axis-aligned.
//
// North → south:
//   15 m Shiv Pandan Road · 8 m road-widening strip · compound wall + main gate
//   open/amenity strip: Plot 141 · Open Space-1 · Amenity Space-1 · (gate road) · Amenity Space-2 · Open Space-2
//   12 m east-west road
//   six plot blocks (two plots deep) separated by 9 m north-south roads, 12 m road on the west (Khasra No. 46),
//   a diagonal 9 m road + buffer on the east (nallah), and a slanted southern boundary.

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const range = (v, a, b) => clamp01((v - a) / (b - a));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (t) => t * t * (3 - 2 * t);
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BLOCK_H = 0.3; // plots sit a curb-height above the road
export const PW = 7.5; // nominal plot frontage (≈25 ft)
export const PD = 15; // nominal plot depth (≈50 ft)
const FP = 1.6; // footpath width on each side of a road

// ---- Boundaries -------------------------------------------------------------------
export const WALL_N = -127; // compound wall along the Shiv Pandan Road side
export const WALL_W = -120; // compound wall along Khasra No. 46
export const BLOCK_TOP = -88; // north edge of every plot block (south edge of the 12 m road)

// Slanted southern boundary (drops ~0.28 m south for every metre east)
export const southZ = (x) => -19 + 0.277 * (x + 115.5);

// West edge of the diagonal east road, north → south
export const EAST_EDGE = [
  [126, -100],
  [123, -88],
  [116, -60],
  [111.6, -46.7],
  [89.8, -10.3],
  [73.3, 21.3],
  [58, 50],
];
const polyX = (pts, z) => {
  if (z <= pts[0][1]) return pts[0][0];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    if (z >= z0 && z <= z1) return x0 + ((x1 - x0) * (z - z0)) / (z1 - z0);
  }
  return pts[pts.length - 1][0];
};
export const eastEdgeX = (z) => polyX(EAST_EDGE, z);

// Offset a polyline sideways by d metres (for a line running south, positive d = west, negative = east).
export function offsetPolyline(pts, d) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const L = Math.hypot(dx, dz) || 1;
    return [p[0] - (dz / L) * d, p[1] + (dx / L) * d];
  });
}

const EAST_ROAD_W = 9;
const EAST_CENTER = offsetPolyline(EAST_EDGE, -EAST_ROAD_W / 2); // right-hand normal points west for a southward line
export const EAST_OUTER = offsetPolyline(EAST_EDGE, -EAST_ROAD_W); // outer (east) edge of the east road = compound wall
export const eastOuterX = (z) => polyX(EAST_OUTER, z);

// Compound wall / site polygon (clockwise from the north-west corner)
export const SITE_POLY = (() => {
  const pts = [
    [WALL_W, WALL_N],
    [eastOuterX(WALL_N), WALL_N],
  ];
  // Walk the outer east edge south until it meets the southern boundary
  let prev = null;
  for (let z = WALL_N; z <= 80; z += 1) {
    const x = eastOuterX(z);
    if (z >= -100 && z >= southZ(x)) {
      pts.push([x, southZ(x)]);
      break;
    }
    if (z % 6 === 0 || !prev) pts.push([x, z]);
    prev = [x, z];
  }
  pts.push([WALL_W, southZ(WALL_W)]);
  return pts;
})();
export const SITE = { x0: WALL_W, x1: Math.max(...SITE_POLY.map((p) => p[0])), z0: WALL_N, z1: Math.max(...SITE_POLY.map((p) => p[1])) };
// Square texture window covering the site (the ground masks are painted onto it)
export const SITE_TEX = { x0: -135, x1: 165, z0: -165, z1: 135 };

// ---- Main road (15 m Shiv Pandan Road) + road-widening strip -----------------------------
// Traffic keeps left: eastbound on the north half, westbound on the south half
export const MAIN_ROAD = { z0: -150, z1: -135, lanesA: [-146.3, -143.8], lanesB: [-141.2, -138.7] };
export const WIDENING = { z0: MAIN_ROAD.z1, z1: WALL_N };

// ---- Roads (centre-lines + width). Painted onto the ground and used for lamps, trees and cars ----
export const ROAD_X = { R1: -62.5, R2: -23.5, R3: 15.5, R4: 54.5, R5: 93.5 }; // 9 m north-south roads
export const EW_ROAD_Z = -94; // 12 m east-west road
export const WEST_ROAD_X = -114; // 12 m road along the west boundary

export const roads = [
  { id: "ew", w: 12, pts: [[WALL_W - 6, EW_ROAD_Z], [130, EW_ROAD_Z]] },
  { id: "west", w: 12, pts: [[WEST_ROAD_X, WALL_N], [WEST_ROAD_X, southZ(WEST_ROAD_X) + 6]] },
  { id: "gate", w: 9, pts: [[ROAD_X.R3, WALL_N - 1], [ROAD_X.R3, EW_ROAD_Z]] },
  ...["R1", "R2", "R3", "R4", "R5"].map((k) => ({ id: k, w: 9, pts: [[ROAD_X[k], EW_ROAD_Z], [ROAD_X[k], southZ(ROAD_X[k]) + 6]] })),
  { id: "east", w: EAST_ROAD_W, pts: EAST_CENTER },
];
export { FP };

// Distance from a point to a road's centre-line
export function distToRoad(road, x, z) {
  let best = Infinity;
  for (let i = 0; i < road.pts.length - 1; i++) {
    const [ax, az] = road.pts[i];
    const [bx, bz] = road.pts[i + 1];
    const dx = bx - ax, dz = bz - az;
    const t = clamp01(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1));
    best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
  }
  return best;
}
// Is (x, z) on (or within `pad` of) any road other than `except`?
export const onRoad = (x, z, pad = 0, except = null) => roads.some((r) => r !== except && distToRoad(r, x, z) < r.w / 2 + pad);

export function insidePoly(poly, x, z) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
export const inSite = (x, z) => insidePoly(SITE_POLY, x, z);

// ---- Plot blocks --------------------------------------------------------------------
// Each block is two columns of plots. The west column faces the road to its west, the east column the road to its east.
const COLUMNS = [
  { block: 1, side: "W", x0: -108, x1: -82, f: 10.2 },
  { block: 1, side: "E", x0: -82, x1: -67, f: 6.9 },
  { block: 2, side: "W", x0: -58, x1: -43, f: 7.1 },
  { block: 2, side: "E", x0: -43, x1: -28, f: 7.1 },
  { block: 3, side: "W", x0: -19, x1: -4, f: 7.1 },
  { block: 3, side: "E", x0: -4, x1: 11, f: 7.1 },
  { block: 4, side: "W", x0: 20, x1: 35, f: 7.1 },
  { block: 4, side: "E", x0: 35, x1: 50, f: 7.1 },
  { block: 5, side: "W", x0: 59, x1: 74, f: 7.1 },
  { block: 5, side: "E", x0: 74, x1: 89, f: 7.1 },
  { block: 6, side: "W", x0: 98, x1: 110, f: 8.5 },
  { block: 6, side: "E", x0: 110, x1: 122, f: 8.5 },
];

export const plots = [];
export const blocks = []; // rectangular slabs (runs of plots with the same width), each rendered as one mesh

(() => {
  const cols = COLUMNS.map((c) => {
    const list = [];
    let z = BLOCK_TOP;
    for (;;) {
      const z1 = z + c.f;
      if (z1 > southZ(c.x0) - 0.5) break;
      const x1 = Math.min(c.x1, eastEdgeX(z1) - 0.6);
      if (x1 - c.x0 < 5) break;
      list.push({ x0: c.x0, x1, z0: z, z1 });
      z = z1;
    }
    return { ...c, list };
  });
  // Numbering follows the drawing: blocks east → west; in each block the east column bottom → top,
  // then the west column top → bottom.
  let n = 1;
  for (let b = 6; b >= 1; b--) {
    const east = cols.find((c) => c.block === b && c.side === "E");
    const west = cols.find((c) => c.block === b && c.side === "W");
    for (const [col, order] of [[east, [...east.list].reverse()], [west, west.list]]) {
      for (const r of order) {
        plots.push({
          n: n++,
          x0: r.x0, x1: r.x1, z0: r.z0, z1: r.z1,
          cx: (r.x0 + r.x1) / 2,
          cz: (r.z0 + r.z1) / 2,
          w: r.z1 - r.z0, // frontage (along the road)
          d: r.x1 - r.x0, // depth
          face: col.side === "E" ? 1 : -1, // +1 faces east (+x), -1 faces west
          block: b,
        });
      }
    }
  }
  // Plot 141: the corner plot beside the west road, in the open-space strip
  plots.push({ n: n, x0: -106, x1: -91, z0: -124.5, z1: -114.5, cx: -98.5, cz: -119.5, w: 10, d: 15, face: -1, block: 0 });

  // Group each column's plots into slabs of equal width
  for (const c of cols) {
    let cur = null;
    for (const r of c.list) {
      if (cur && Math.abs(cur.x1 - r.x1) < 0.01 && Math.abs(cur.z1 - r.z0) < 0.01) {
        cur.z1 = r.z1;
      } else {
        cur = { x0: r.x0, x1: r.x1, z0: r.z0, z1: r.z1 };
        blocks.push(cur);
      }
    }
  }
  blocks.push({ x0: -106, x1: -91, z0: -124.5, z1: -114.5 });
  for (const blk of blocks) blk.plots = plots.filter((p) => p.cx > blk.x0 && p.cx < blk.x1 && p.cz > blk.z0 && p.cz < blk.z1);
})();

// House orientation: local +z (the front) turned to face the plot's road
export const plotAngle = (p) => (p.face > 0 ? Math.PI / 2 : -Math.PI / 2);

// The plot the camera lands on and where the home is built: block 3's east column, on the main gate road.
export const heroPlot = (() => {
  const col = plots.filter((p) => p.block === 3 && p.face > 0).sort((a, b) => a.cz - b.cz);
  return col[Math.min(5, col.length - 1)];
})();

// ---- Open & amenity strip (between the compound wall and the 12 m road) ------------------------
const STRIP = { z0: WALL_N + 2, z1: EW_ROAD_Z - 6 - 2 }; // -125 … -102
export const OPEN1 = { x0: -108, x1: -43, z0: STRIP.z0, z1: STRIP.z1 }; // Open Space-1 (garden)
export const AMENITY1 = { x0: -43, x1: ROAD_X.R3 - 4.5, z0: STRIP.z0, z1: STRIP.z1 }; // Amenity Space-1
export const AMENITY2 = { x0: ROAD_X.R3 + 4.5, x1: 82, z0: STRIP.z0, z1: STRIP.z1 }; // Amenity Space-2
export const OPEN2 = { x0: 82, x1: 128, z0: STRIP.z0, z1: STRIP.z1 }; // Open Space-2 (garden)

// What sits where (illustrative placement inside the sanctioned open / amenity spaces)
export const PARK = { x0: -86, x1: -45, z0: STRIP.z0, z1: STRIP.z1 }; // garden with walking track + fountain (Open Space-1)
export const PLAY = { x0: -41, x1: -17, z0: STRIP.z0, z1: STRIP.z1 }; // kids' play area (Amenity Space-1)
export const LAWN = { x0: -15, x1: 3, z0: -121, z1: -106 }; // open lawn with seating (Amenity Space-1)
export const CLUB = { x0: 24, x1: 42, z0: -124, z1: -104 }; // clubhouse (Amenity Space-2)
export const TEMPLE = { x0: 47, x1: 78, z0: -124, z1: -104 }; // temple courtyard (Amenity Space-2)
export const PARK2 = { x0: 85, x1: 124, z0: STRIP.z0, z1: STRIP.z1 }; // garden with gazebo (Open Space-2)

// Main gate on the compound wall, where the 9 m gate road meets the Shiv Pandan Road
export const GATE = { x0: ROAD_X.R3 - 6, x1: ROAD_X.R3 + 6, z: WALL_N };

// Nallah beyond the east buffer
export const NALLAH = offsetPolyline(EAST_EDGE, -(EAST_ROAD_W + 16));
