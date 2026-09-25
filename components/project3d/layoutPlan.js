// Geometry of the Shree Ram Nagri-1 layout used by the 3D fly-through.
// 1 world unit = 1 metre. -z is "north" (top of the master plan), +x is the highway side.

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

// ---- Plot grid ------------------------------------------------------------
export const PW = 9; // plot frontage (≈30 ft)
export const PD = 15; // plot depth (≈50 ft)
export const ROAD = 10;
export const AVENUE = 16;
export const ROWS = 5;
export const WEST_COLS = 8;
export const EAST_COLS = 6;
export const BLOCK_H = 0.3; // plots sit a curb-height above the road

const BLOCK_D = PD * 2;
const SPAN = ROWS * BLOCK_D + (ROWS - 1) * ROAD; // 190
export const Z0 = -SPAN / 2;
export const Z1 = SPAN / 2;
export const WX1 = -AVENUE / 2;
export const WX0 = WX1 - WEST_COLS * PW;
export const EX0 = AVENUE / 2;
export const EX1 = EX0 + EAST_COLS * PW;

export const blocks = [];
export const plots = [];

(() => {
  let n = 1;
  for (let r = 0; r < ROWS; r++) {
    const z0 = Z0 + r * (BLOCK_D + ROAD);
    for (const side of ["west", "east"]) {
      const x0 = side === "west" ? WX0 : EX0;
      const cols = side === "west" ? WEST_COLS : EAST_COLS;
      const block = { id: blocks.length, row: r, side, x0, x1: x0 + cols * PW, z0, z1: z0 + BLOCK_D, cols, plots: [] };
      // North half faces the road above (-z), numbered left → right.
      for (let c = 0; c < cols; c++) {
        const plot = { n: n++, cx: x0 + c * PW + PW / 2, cz: z0 + PD / 2, face: -1, col: c, half: 0, block: block.id };
        block.plots.push(plot);
        plots.push(plot);
      }
      // South half faces the road below (+z), numbered right → left (snake order like the master plan).
      for (let c = cols - 1; c >= 0; c--) {
        const plot = { n: n++, cx: x0 + c * PW + PW / 2, cz: z0 + PD + PD / 2, face: 1, col: c, half: 1, block: block.id };
        block.plots.push(plot);
        plots.push(plot);
      }
      blocks.push(block);
    }
  }
})();

// The plot the camera lands on and where the home is built.
export const heroPlot = plots.find((p) => {
  const b = blocks[p.block];
  return b.row === 2 && b.side === "east" && p.half === 1 && p.col === 2;
});

// ---- Roads ----------------------------------------------------------------
export const OUT_W = WX0 - ROAD; // -90
export const OUT_E = EX1 + ROAD; // 72
export const OUT_N = Z0 - ROAD; // -105
export const OUT_S = Z1 + ROAD; // 105

export const ewRoads = [Z0 - ROAD / 2];
for (let r = 0; r < ROWS - 1; r++) ewRoads.push(Z0 + r * (BLOCK_D + ROAD) + BLOCK_D + ROAD / 2);
ewRoads.push(Z1 + ROAD / 2);
// -> [-100, -60, -20, 20, 60, 100]

export const nsRoads = [
  { x: WX0 - ROAD / 2, w: ROAD },
  { x: 0, w: AVENUE, median: true },
  { x: EX1 + ROAD / 2, w: ROAD },
];

// Entrance boulevard from the highway into the layout.
export const ENTRANCE = { z: -20, w: 16, x0: OUT_E, x1: 140, median: [80, 126] };

// ---- Site, amenities, highway --------------------------------------------
export const SITE = { x0: -94, x1: 132, z0: -109, z1: 109 };
export const SITE_TEX = { x0: -100, x1: 140, z0: -120, z1: 120 };
export const GATE = { x: 132, z0: -28, z1: -12 };

export const PARK = { x0: 76, x1: 128, z0: 22, z1: 105 };
export const PLAY = { x0: 76, x1: 128, z0: -8, z1: 18 };
export const CLUB = { x0: 80, x1: 98, z0: -60, z1: -36 };
export const POOL = { x0: 103, x1: 124, z0: -56, z1: -40 };
export const DECK = { x0: 100, x1: 127, z0: -60, z1: -34 };
export const COURT = { x0: 80, x1: 126, z0: -104, z1: -68 };

export const HIGHWAY = { x0: 138, x1: 170, lanesA: [142, 145.5, 149], lanesB: [157, 160.5, 164], median: [151, 155] };
