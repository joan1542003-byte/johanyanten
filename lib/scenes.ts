// Full-screen ASCII landscapes, drawn cell by cell. A scene writes a glyph, a color and an opacity
// into every cell of the grid; AsciiScene puts them on a canvas. All procedural: no image is sampled.

export type Grid = {
  cols: number;
  rows: number;
  /** Size in px, so circles stay round at any aspect ratio */
  w: number;
  h: number;
  ch: Uint16Array;
  r: Uint8ClampedArray;
  g: Uint8ClampedArray;
  b: Uint8ClampedArray;
  a: Float32Array;
};

/** t in seconds; px, py the eased pointer (0–1); progress how far the scene has scrolled away (0–1) */
export type Frame = { t: number; px: number; py: number; progress: number };
export type Scene = (g: Grid, f: Frame) => void;

/* ---------- Noise ---------- */

const fract = (x: number) => x - Math.floor(x);
const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
const hash2 = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
const ease3 = (f: number) => f * f * (3 - 2 * f);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sstep = (a: number, b: number, x: number) => ease3(clamp01((x - a) / (b - a)));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

function noise1(x: number) {
  const i = Math.floor(x);
  return hash(i) + (hash(i + 1) - hash(i)) * ease3(x - i);
}
function noise2(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = ease3(x - ix);
  const fy = ease3(y - iy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
function fbm(x: number, y: number, octaves = 4) {
  let v = 0;
  let amp = 0.5;
  let sum = 0;
  for (let o = 0; o < octaves; o++) {
    v += amp * noise2(x, y);
    sum += amp;
    x = x * 2.03 + 17.1;
    y = y * 2.03 + 9.2;
    amp *= 0.5;
  }
  return v / sum;
}
/** Sharp crests, for mountain ranges */
const ridge = (x: number) => 1 - Math.abs(noise1(x) * 2 - 1);
const peaks = (x: number) => 0.58 * ridge(x) + 0.28 * ridge(x * 2.13 + 3.1) + 0.14 * ridge(x * 4.37 + 7.7);

/* ---------- Color and glyphs ---------- */

type RGB = [number, number, number];
type Stops = [number, RGB][];
const hex = (s: string): RGB => {
  const n = parseInt(s.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
/** Samples a gradient into `out` */
function grad(stops: Stops, t: number, out: RGB) {
  let i = 1;
  while (i < stops.length - 1 && t > stops[i][0]) i++;
  const [p0, c0] = stops[i - 1];
  const [p1, c1] = stops[i];
  const k = clamp01((t - p0) / (p1 - p0));
  out[0] = mix(c0[0], c1[0], k);
  out[1] = mix(c0[1], c1[1], k);
  out[2] = mix(c0[2], c1[2], k);
  return out;
}

const codes = (s: string) => Array.from(s, (c) => c.charCodeAt(0));
const pick = (set: number[], v: number) => set[Math.min(set.length - 1, Math.max(0, Math.floor(v * set.length)))];
const put = (g: Grid, i: number, ch: number, r: number, gg: number, b: number, a: number) => {
  g.ch[i] = ch;
  g.r[i] = r;
  g.g[i] = gg;
  g.b[i] = b;
  g.a[i] = a;
};
/** Writes a small multi-line drawing with its top-left corner at (x, y), in 0–1 coordinates */
function stamp(g: Grid, x: number, y: number, art: string[], c: RGB, a: number) {
  const c0 = Math.round(x * g.cols);
  const r0 = Math.round(y * g.rows);
  art.forEach((line, dy) => {
    for (let dx = 0; dx < line.length; dx++) {
      const col = c0 + dx;
      const row = r0 + dy;
      if (line[dx] === " " || col < 0 || col >= g.cols || row < 0 || row >= g.rows) continue;
      put(g, row * g.cols + col, line.charCodeAt(dx), c[0], c[1], c[2], a);
    }
  });
}


const SKY = codes(" ..···::");
const FACE = codes(" .·:;=+*#");
const WATER = codes(" .-~=");
const STAR = codes("...+*");
const CLOUD = codes("--~=");
const GLINT = codes("-=~*");
const SNOW = codes(".:*^");
const FOAM = codes(".o*'");
const DUNE = codes(" .-~");
const DUST = codes(" ..·:+*");
const [SLASH, BACK, CARET, UNDER, PIPE, HASH, AT, PCT, TICK, EQ, TILDE, DASH, COLON, DOT, ASTER, PLUS] =
  codes("/\\^_|#@%'=~-:.*+");
const [CPAREN_L, CPAREN_R] = codes("()");
const WHITE: RGB = [255, 246, 232];

/** Crest glyph for a ridge line, from the heights left and right of the cell */
const crest = (left: number, top: number, right: number, slope: number) =>
  left > top && right > top ? CARET : Math.abs(slope) < 0.15 ? UNDER : slope < 0 ? SLASH : BACK;

/* ---------- Los Andes at dusk, mirrored on a lake ---------- */

const andesDusk: Stops = [[0, hex("#2c2a6e")], [0.45, hex("#7b3f92")], [0.8, hex("#f0806a")], [1, hex("#ffd08a")]];
const andesNight: Stops = [[0, hex("#070920")], [0.45, hex("#1a1646")], [0.8, hex("#3e2353")], [1, hex("#6a3352")]];
const SUN_TOP = hex("#fff3c4");
const SUN_LOW = hex("#ff6a5c");
const GLOW = hex("#ffae78");
const CLOUD_LIT = hex("#ffa38c");
const CLOUD_DIM = hex("#463070");
const PINE = hex("#24524c");

// Far to near. Backlit by the sunset: the far range is pale and detailed, the near ones darker silhouettes
const RANGES = [
  { base: 0.53, amp: 0.25, freq: 2.1, seed: 11, par: 0.006, top: hex("#d2bdf2"), foot: hex("#8a74c4"), vis: 1, snow: true },
  { base: 0.585, amp: 0.13, freq: 3.4, seed: 23, par: 0.016, top: hex("#a477c6"), foot: hex("#5a3d8c"), vis: 0.85, snow: false },
  { base: 0.628, amp: 0.08, freq: 5.6, seed: 37, par: 0.03, top: hex("#7a4aa0"), foot: hex("#33245e"), vis: 0.65, snow: false },
  { base: 0.655, amp: 0.04, freq: 9.5, seed: 51, par: 0.05, top: hex("#3a2d70"), foot: hex("#1b1844"), vis: 0.32, snow: false },
];
const lines = RANGES.map(() => new Float32Array(0));
const slopes = RANGES.map(() => new Float32Array(0));
let pine = { c: new Int32Array(0), apex: new Float32Array(0), th: new Float32Array(0), half: new Float32Array(0) };

const CONDOR = [
  [" ,_        _, ", "   '-.^v^.-'   "],
  ["  _        _  ", " '  '-^v^-'  ' "],
];

const andes: Scene = (g, { t, px, progress }) => {
  const { cols, rows, w, h } = g;
  const dark = sstep(0.05, 0.9, progress);
  const H = 0.66;
  const rowH = Math.floor(H * rows);
  const sunX = 0.68;
  const sunY = 0.33 + progress * 0.3;
  const R = Math.min(w, h) * 0.1;
  const sunUp = 1 - sstep(0.25, 0.7, progress);
  // Wide screens show more peaks, tall ones fewer, so they never look squeezed
  const spread = Math.max(0.45, Math.min(1.3, w / h / 1.6));

  for (let L = 0; L < RANGES.length; L++) {
    const rg = RANGES[L];
    if (lines[L].length !== cols) {
      lines[L] = new Float32Array(cols);
      slopes[L] = new Float32Array(cols);
    }
    const line = lines[L];
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) / cols + (0.5 - px) * rg.par;
      line[c] = rg.base - rg.amp * (0.22 + 0.78 * peaks(x * rg.freq * spread + rg.seed) ** 1.2);
    }
    for (let c = 0; c < cols; c++) slopes[L][c] = ((line[Math.min(cols - 1, c + 1)] - line[Math.max(0, c - 1)]) * cols) / 2;
  }

  // Pines on the nearest ridge, worked out once per column
  const near = lines[RANGES.length - 1];
  if (pine.c.length !== cols) {
    pine = { c: new Int32Array(cols), apex: new Float32Array(cols), th: new Float32Array(cols), half: new Float32Array(cols) };
  }
  pine.c.fill(-1);
  const colW = w / cols;
  for (let k = -1; k * 5 < cols + 5; k++) {
    if (hash(k * 1.7) < 0.42) continue;
    const tc = k * 5 + Math.floor(hash(k * 3.3) * 3);
    if (tc < 0 || tc >= cols) continue;
    const th = 0.045 + hash(k * 5.1) * 0.06;
    const apex = near[tc] - th;
    const half = (th * h * 0.3) / colW;
    for (let cc = Math.max(0, Math.floor(tc - half)); cc <= Math.min(cols - 1, Math.ceil(tc + half)); cc++) {
      if (pine.c[cc] >= 0 && pine.apex[cc] <= apex) continue;
      pine.c[cc] = tc;
      pine.apex[cc] = apex;
      pine.th[cc] = th;
      pine.half[cc] = half;
    }
  }

  const dusk: RGB = [0, 0, 0];
  const night: RGB = [0, 0, 0];
  for (let row = 0; row < rowH; row++) {
    const y = (row + 0.5) / rows;
    grad(andesDusk, y / H, dusk);
    grad(andesNight, y / H, night);
    const sr = mix(dusk[0], night[0], dark);
    const sg = mix(dusk[1], night[1], dark);
    const sb = mix(dusk[2], night[2], dark);
    const cloudBand = sstep(0.12, 0.2, y) * (1 - sstep(0.38, 0.48, y));

    for (let c = 0; c < cols; c++) {
      const i = row * cols + c;
      const x = (c + 0.5) / cols;

      const tc = pine.c[c];
      if (tc >= 0 && y >= pine.apex[c] && y <= near[tc] + 0.015) {
        const half = ((y - pine.apex[c]) / pine.th[c]) * pine.half[c];
        const off = c - tc;
        if (Math.abs(off) <= half + 0.5) {
          const ch = y - pine.apex[c] < 1.2 / rows ? CARET : off === 0 ? PIPE : off < 0 ? SLASH : BACK;
          const lit = 0.75 + (off > 0 ? 0.35 : 0) * (1 - dark) * sunUp;
          put(g, i, ch, PINE[0] * lit + 10, PINE[1] * lit, PINE[2] * lit, 0.92);
          continue;
        }
      }

      let hit = -1;
      for (let L = RANGES.length - 1; L >= 0; L--) {
        if (y >= lines[L][c]) {
          hit = L;
          break;
        }
      }
      if (hit >= 0) {
        const rg = RANGES[hit];
        const line = lines[hit];
        const top = line[c];
        const slope = slopes[hit][c];
        const depth = clamp01((y - top) / Math.max(0.03, H - top));
        const lit = clamp01(0.5 + Math.sign(sunX - x) * slope * 0.6);
        const shade = (0.45 + 0.75 * lit) * (1 - dark * 0.5);
        const rim = (1 - sstep(0, 0.05, depth)) * (1 - dark) * (0.4 + 0.6 * lit) * sunUp;
        const r = mix(rg.top[0], rg.foot[0], depth) * shade + GLOW[0] * rim * 0.7;
        const gg = mix(rg.top[1], rg.foot[1], depth) * shade + GLOW[1] * rim * 0.5;
        const b = mix(rg.top[2], rg.foot[2], depth) * shade + GLOW[2] * rim * 0.35;
        if (y - top < 1.15 / rows) {
          put(g, i, crest(line[Math.max(0, c - 1)], top, line[Math.min(cols - 1, c + 1)], slope), r, gg, b, 1);
          continue;
        }
        if (rg.snow && top < rg.base - rg.amp * 0.45 && depth < 0.09 + noise1(x * 40) * 0.13) {
          const s = (0.6 + 0.5 * lit) * (1 - dark * 0.45);
          put(g, i, pick(SNOW, lit * 0.8 + hash2(c, row) * 0.3), 238 * s, 232 * s, 255 * s, 0.95);
          continue;
        }
        // Sunlit faces are dense and bright, faces in shadow thin out
        const v = (lit * lit * 1.1 + (1 - depth) * 0.12) * rg.vis;
        put(g, i, pick(FACE, v), r, gg, b, 0.5 + 0.45 * rg.vis);
        continue;
      }

      // Sky: the striped sun, a few long clouds, stars as the light fades, and glowing air
      const dx = (x - sunX) * w;
      const dy = (y - sunY) * h;
      const d = Math.hypot(dx, dy);
      const glow = Math.exp(-((d / (R * 3.4)) ** 2)) * (1 - dark * 0.6);
      if (d < R) {
        const v = (dy + R) / (2 * R);
        const gap = v > 0.52 && fract((v - 0.52) * 7.5) < (v - 0.52) * 1.4;
        if (!gap) {
          const k = 1 - dark * 0.35;
          put(
            g,
            i,
            d < R * 0.84 ? AT : PCT,
            mix(SUN_TOP[0], SUN_LOW[0], v) * k,
            mix(SUN_TOP[1], SUN_LOW[1], v) * k,
            mix(SUN_TOP[2], SUN_LOW[2], v) * k,
            1,
          );
          continue;
        }
      }

      if (cloudBand > 0) {
        const n = fbm(x * 1.8 * spread + t * 0.006, y * 18 + 4, 3);
        const dens = (n - 0.64) * 6 * cloudBand;
        if (dens > 0.05) {
          const lit = clamp01((1 - dark) * (0.35 + 0.65 * (y / H)) + glow * 0.6);
          put(
            g,
            i,
            pick(CLOUD, dens),
            mix(CLOUD_DIM[0], CLOUD_LIT[0], lit),
            mix(CLOUD_DIM[1], CLOUD_LIT[1], lit),
            mix(CLOUD_DIM[2], CLOUD_LIT[2], lit),
            0.5 + Math.min(0.45, dens * 0.7),
          );
          continue;
        }
      }

      const s = hash2(c, row);
      if (y < H * 0.55 && s > 0.988) {
        const tw = 0.5 + 0.5 * Math.sin(t * (0.8 + s * 2) + s * 90);
        const vis = (0.15 + 0.85 * dark) * tw * (1 - glow);
        if (vis > 0.1) {
          put(g, i, pick(STAR, vis), WHITE[0], WHITE[1], WHITE[2], 0.3 + vis * 0.7);
          continue;
        }
      }

      const r = sr + GLOW[0] * glow;
      const gg = sg + GLOW[1] * glow * 0.8;
      const b = sb + GLOW[2] * glow * 0.6;
      const lum = (r * 0.3 + gg * 0.59 + b * 0.11) / 255;
      const v = 0.2 + lum * 0.75 + glow * 0.4 + (hash2(c * 1.3, row * 2.1) - 0.5) * 0.2;
      put(g, i, pick(SKY, v), r, gg, b, 0.4 + Math.min(0.55, glow * 0.6 + lum * 0.5));
    }
  }

  // A condor gliding across and a few birds far away; drawn before the lake so they are mirrored too
  const cx = fract(t * 0.009 + 0.35) * 1.4 - 0.2;
  stamp(g, cx, 0.16 + Math.sin(t * 0.25) * 0.025, CONDOR[Math.floor(t * 0.6) % 2], WHITE, 0.9);
  for (let k = 0; k < 5; k++) {
    const bx = fract(t * 0.014 + 0.6) * 1.3 - 0.15 + k * 0.016;
    const by = 0.25 + Math.abs(k - 2) * 0.012 + Math.sin(t * 0.5 + k) * 0.004;
    stamp(g, bx, by, [Math.floor(t * 2.4 + k * 0.7) % 2 ? "v" : "-"], WHITE, 0.7);
  }

  // The lake: the scene upside down, broken by drifting ripples, with the sun's glitter path
  for (let row = rowH; row < rows; row++) {
    const z = (row - rowH) / Math.max(1, rows - rowH);
    const src = Math.max(0, 2 * rowH - 1 - row);
    const spreadSun = 0.012 + z * 0.12;
    for (let c = 0; c < cols; c++) {
      const i = row * cols + c;
      const x = (c + 0.5) / cols;
      const ripple = Math.sin(row * 0.9 + t * 1.1 + c * 0.05) * (0.6 + z * 2.4);
      const j = src * cols + Math.min(cols - 1, Math.max(0, c + Math.round(ripple)));
      const glint = Math.exp(-(((x - sunX) / spreadSun) ** 2)) * sunUp;
      if (glint > 0.05 && hash2(c, row + Math.floor(t * 5)) < glint * 0.7) {
        put(g, i, pick(GLINT, hash2(row, c)), 255, 214, 165, 0.95);
        continue;
      }
      const lum = ((g.r[j] + g.g[j] + g.b[j]) / 765) * (g.ch[j] === 32 ? 0.35 : 1);
      const wave = Math.sin(c * 0.23 + row * 1.9 - t * 0.8) + Math.sin(c * 0.071 - row * 0.7 + t * 0.45);
      const v = lum * 0.9 + wave * 0.12 + 0.12;
      put(g, i, pick(WATER, v), g.r[j] * 0.6 + 8, g.g[j] * 0.6 + 14, g.b[j] * 0.66 + 34, 0.4 + clamp01(v) * 0.5);
    }
  }

  // Reeds in the corners of the shore, swaying
  for (let c = 0; c < cols; c++) {
    const edge = 1 - Math.min(c, cols - 1 - c) / (cols * 0.17);
    if (edge <= 0 || hash(c * 9.1) < 0.3) continue;
    const tall = Math.floor((0.35 + hash(c * 2.7) * 0.65) * edge * rows * 0.17);
    for (let k = 0; k < tall; k++) {
      const f = k / tall;
      const sway = Math.sin(t * 0.8 + c * 0.4) * f;
      const ch = k === tall - 1 ? TICK : sway > 0.25 ? SLASH : sway < -0.25 ? BACK : PIPE;
      put(g, (rows - 1 - k) * cols + c, ch, mix(26, 84, f), mix(56, 112, f), mix(46, 70, f), 0.95);
    }
  }
};

/* ---------- A lighthouse over a moonlit sea ---------- */

const seaSky: Stops = [[0, hex("#04060f")], [0.6, hex("#101b40")], [1, hex("#2b3768")]];
const MOON = hex("#f6f2de");
const HALO = hex("#93a8ff");
const BEAM = hex("#ffe2a0");

const sea: Scene = (g, { t, px }) => {
  const { cols, rows, w, h } = g;
  const H = 0.6;
  const rowH = Math.floor(H * rows);
  const tall = h > w;
  const moonX = (tall ? 0.72 : 0.8) + (px - 0.5) * 0.01;
  const moonY = tall ? 0.16 : 0.2;
  const R = Math.min(w, h) * 0.1;
  // The lighthouse stands on a cliff to the left
  const cliffEnd = tall ? 0.46 : 0.27;
  const lx = cliffEnd * 0.42;
  const cliff = (x: number) => H - 0.1 + noise1(x * 34) * 0.018 + sstep(cliffEnd * 0.6, cliffEnd, x) * 0.14;
  const base = cliff(lx);
  const towerH = tall ? 0.17 : 0.22;
  const lampY = base - towerH - 0.022;
  const angle = t * 0.5;
  const dir = Math.cos(angle);
  const toward = Math.max(0, Math.sin(angle));
  const reach = Math.abs(dir) * w * 1.1;
  // Never thinner than a couple of characters, or it vanishes on phones
  const cw = w / cols;
  const lw = (k: number, min: number) => Math.max(k * w, min * cw);
  const sky: RGB = [0, 0, 0];

  for (let row = 0; row < rows; row++) {
    const y = (row + 0.5) / rows;
    grad(seaSky, y / H, sky);
    const cloudBand = sstep(0.1, 0.16, y) * (1 - sstep(0.32, 0.42, y));
    for (let c = 0; c < cols; c++) {
      const i = row * cols + c;
      const x = (c + 0.5) / cols;
      const ex = (x - lx) * w;
      const ey = (y - lampY) * h;

      // The beam turns: long when it points sideways, a flash when it faces us
      let beam = 0;
      if (Math.sign(ex) === Math.sign(dir) && Math.abs(ex) < reach) {
        const width = Math.abs(ex) * 0.085 + 4;
        if (Math.abs(ey) < width) beam = (1 - Math.abs(ex) / reach) * (1 - Math.abs(ey) / width);
      }
      const flash = Math.exp(-((Math.hypot(ex, ey) / (12 + toward * 50)) ** 2)) * (0.4 + toward);

      // Tower with red and white bands, the gallery, the lantern and its roof
      const up = (base - y) / towerH;
      const half = mix(lw(0.012, 1.6), lw(0.0075, 1.1), clamp01(up));
      if (up >= 0 && up <= 1 && Math.abs(ex) <= half) {
        const band = Math.floor(up * 6) % 2;
        const lit = ex > 0 ? 1 : 0.65;
        const col: RGB = band ? [236, 230, 218] : [205, 78, 72];
        put(g, i, Math.abs(ex) > half - cw ? PIPE : HASH, col[0] * lit, col[1] * lit, col[2] * lit, 1);
        continue;
      }
      if (y < base - towerH && y >= base - towerH - 0.008 && Math.abs(ex) <= lw(0.013, 2.2)) {
        put(g, i, EQ, 170, 168, 180, 1);
        continue;
      }
      if (y < base - towerH - 0.008 && y >= lampY - 0.012 && Math.abs(ex) <= lw(0.008, 1.2)) {
        put(g, i, HASH, BEAM[0], BEAM[1], BEAM[2], 1);
        continue;
      }
      const roof = lampY - 0.012 - y;
      if (roof > 0 && roof < 0.03 && Math.abs(ex) <= (1 - roof / 0.03) * lw(0.011, 2)) {
        put(g, i, roof > 0.022 ? CARET : HASH, 150, 58, 56, 1);
        continue;
      }

      // The cliff, its rocks going into the water, and foam where waves hit
      if (x < cliffEnd) {
        const top = cliff(x);
        if (y >= top) {
          const edge = cliffEnd - x;
          if (y > H && edge < 0.025 && hash2(c, row + Math.floor(t * 3)) > 0.5) {
            put(g, i, pick(FOAM, hash2(row, c)), 222, 232, 246, 0.85);
            continue;
          }
          const left = cliff(x - 1 / cols);
          const right = cliff(x + 1 / cols);
          const slope = ((right - left) * cols) / 2;
          const lit = clamp01(0.25 + (1 - edge / cliffEnd) * 0.35 + beam * 0.6);
          if (y - top < 1.15 / rows) {
            put(g, i, crest(left, top, right, slope), 92, 100, 140, 1);
            continue;
          }
          const tex = noise2(c * 0.35, row * 0.55);
          const near = 1 - sstep(0, 0.1, y - top);
          put(g, i, pick(FACE, (tex * 0.35 + lit * 0.25 + near * 0.3) * 0.75), 40 + 70 * lit, 46 + 72 * lit, 72 + 90 * lit, 0.75);
          continue;
        }
      }

      if (row < rowH) {
        const dx = (x - moonX) * w;
        const dy = (y - moonY) * h;
        const d = Math.hypot(dx, dy);
        if (d < R) {
          const limb = Math.sqrt(1 - (d / R) ** 2);
          const crater = fbm(dx / R * 1.8 + 5, dy / R * 1.8 + 1, 3);
          const s = clamp01(0.55 + limb * 0.45 - (crater > 0.56 ? 0.25 : 0));
          const rim = (R - d) / (h / rows);
          put(g, i, rim < 0.7 ? COLON : crater > 0.56 ? PCT : AT, MOON[0] * s, MOON[1] * s, MOON[2] * s, rim < 0.7 ? 0.7 : 1);
          continue;
        }
        const halo = Math.exp(-((d / (R * 3)) ** 2));
        if (cloudBand > 0) {
          const dens = (fbm(x * 2 + t * 0.008, y * 16, 3) - 0.6) * 5 * cloudBand;
          if (dens > 0.06) {
            const lit = 0.3 + halo * 1.1;
            put(g, i, pick(CLOUD, dens), 60 * lit + 46, 70 * lit + 50, 130 * lit + 62, 0.45 + Math.min(0.45, dens * 0.6));
            continue;
          }
        }
        const s = hash2(c, row);
        if (s > 0.984 && halo < 0.3 && beam < 0.1) {
          const tw = 0.5 + 0.5 * Math.sin(t * (0.7 + s * 2.2) + s * 70);
          put(g, i, pick(STAR, tw), WHITE[0], WHITE[1], WHITE[2], 0.3 + tw * 0.7);
          continue;
        }
        const light = Math.min(1, beam + flash);
        const r = sky[0] + HALO[0] * halo * 0.35 + BEAM[0] * light * 0.85;
        const gg = sky[1] + HALO[1] * halo * 0.35 + BEAM[1] * light * 0.75;
        const b = sky[2] + HALO[2] * halo * 0.45 + BEAM[2] * light * 0.4;
        const lum = (r * 0.3 + gg * 0.59 + b * 0.11) / 255;
        const v = 0.14 + lum * 0.8 + halo * 0.35 + (hash2(c * 1.7, row * 3.1) - 0.5) * 0.2;
        put(g, i, beam > 0.3 ? DASH : pick(SKY, v), r, gg, b, 0.35 + Math.min(0.6, halo * 0.45 + light * 0.6 + lum * 0.3));
        continue;
      }

      // The sea in perspective: rows near the horizon are far away and squeezed together
      const z = (y - H) / (1 - H);
      const k = 1 / (z + 0.06);
      const n = noise2(x * k * 1.6 + t * 0.12, k * 1.4 - t * 0.5);
      const path = Math.exp(-(((x - moonX) / (0.012 + z * 0.15)) ** 2));
      if (hash2(c, row + Math.floor(t * 4)) < path * 0.72) {
        put(g, i, pick(GLINT, hash2(row, c)), 232, 236, 255, 0.95);
        continue;
      }
      const lift = n > 0.68 - z * 0.12 ? 1 : 0;
      const r = mix(14, 30, z) + lift * 50 + BEAM[0] * beam * 0.5;
      const gg = mix(30, 66, z) + lift * 70 + BEAM[1] * beam * 0.45;
      const b = mix(60, 110, z) + lift * 90 + BEAM[2] * beam * 0.3;
      put(g, i, lift ? TILDE : n > 0.5 - z * 0.1 ? DASH : pick(WATER, n * 0.7), r, gg, b, 0.4 + n * 0.55);
    }
  }

  // Rocks in the near right corner, and spray when a wave breaks on them
  const crash = Math.max(0, Math.sin(t * 0.9)) ** 6;
  for (let c = 0; c < cols; c++) {
    const x = (c + 0.5) / cols;
    if (x < 0.76) continue;
    const top = 1 - (0.11 * sstep(0.76, 0.9, x) + noise1(x * 25) * 0.04);
    for (let row = Math.max(0, Math.floor((top - 0.16) * rows)); row < rows; row++) {
      const y = (row + 0.5) / rows;
      const i = row * cols + c;
      if (y >= top) {
        const edge = y - top < 1.2 / rows;
        put(g, i, edge ? (hash(c) > 0.5 ? UNDER : CARET) : pick(FACE, noise2(c * 0.5, row) * 0.55), 52, 60, 92, 0.95);
      } else if (crash > 0.05 && y > top - crash * 0.16 && hash2(c, row + Math.floor(t * 8)) > 0.7) {
        put(g, i, pick(FOAM, hash2(row, c)), 230, 238, 250, crash);
      }
    }
  }
};

/* ---------- The Atacama desert under the Milky Way ---------- */

const desertSky: Stops = [[0, hex("#04050d")], [0.62, hex("#0c0f28")], [0.88, hex("#2a1d48")], [1, hex("#5a2e52")]];
const MW: Stops = [[0, hex("#ffe0b8")], [0.3, hex("#f0a8cf")], [0.65, hex("#a892f0")], [1, hex("#5d88e6")]];
const ANTENNA = hex("#e4def0");
const CACTUS = hex("#4f8a5e");
const STAR_TINTS: RGB[] = [WHITE, [255, 214, 170], [176, 196, 255]];

/** Distance from p to the segment a–b, all in px */
function segment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const vx = bx - ax;
  const vy = by - ay;
  const k = clamp01(((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy));
  return Math.hypot(px - ax - vx * k, py - ay - vy * k);
}

let dunes = { far: new Float32Array(0), near: new Float32Array(0), farS: new Float32Array(0), nearS: new Float32Array(0) };

const desert: Scene = (g, { t, px }) => {
  const { cols, rows, w, h } = g;
  const tall = h > w;
  const m = Math.min(w, h);
  const farAt = (x: number) => 0.74 + 0.025 * Math.sin(x * 5 + 1) + 0.015 * Math.sin(x * 11 + 2);
  const nearAt = (x: number) => 0.86 + 0.045 * Math.sin(x * 3.3 + 0.5) + 0.018 * Math.sin(x * 9 + 4);
  if (dunes.far.length !== cols) {
    dunes = { far: new Float32Array(cols), near: new Float32Array(cols), farS: new Float32Array(cols), nearS: new Float32Array(cols) };
  }
  for (let c = 0; c < cols; c++) {
    const x = (c + 0.5) / cols;
    dunes.far[c] = farAt(x);
    dunes.near[c] = nearAt(x);
    dunes.farS[c] = (farAt(x + 0.004) - farAt(x - 0.004)) / 0.008;
    dunes.nearS[c] = (nearAt(x + 0.004) - nearAt(x - 0.004)) / 0.008;
  }

  // The galaxy crosses the sky diagonally and turns, very slowly
  const ang = -0.58 + t * 0.003 + (px - 0.5) * 0.02;
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const ox = (tall ? 0.5 : 0.66) * w;
  const oy = 0.42 * h;
  const bandW = m * 0.27;
  const coreLen = Math.max(w, h) * 0.28;

  // A shooting star every nine seconds
  const cycle = Math.floor(t / 9);
  const phase = fract(t / 9);
  const sx = (0.2 + hash(cycle) * 0.45) * w;
  const sy = (0.06 + hash(cycle + 7) * 0.18) * h;
  const run = Math.min(1, phase / 0.1) * m * 0.45;
  const hx = sx + run * 0.9;
  const hy = sy + run * 0.4;
  const tail = m * 0.14;

  const antennas = (tall ? [0.5, 0.64, 0.78] : [0.58, 0.645, 0.7, 0.745]).map((ax, a) => {
    const s = m * (0.11 - a * 0.012);
    return { x: ax * w, ground: farAt(ax) * h, s };
  });
  const cacti = (tall ? [{ x: 0.18, s: 1 }] : [{ x: 0.88, s: 1 }, { x: 0.965, s: 0.55 }]).map((k) => {
    const s = m * 0.28 * k.s;
    return { x: k.x * w, y: nearAt(k.x) * h, s, r: s * 0.06 };
  });
  const sky: RGB = [0, 0, 0];
  const mw: RGB = [0, 0, 0];

  for (let row = 0; row < rows; row++) {
    const y = (row + 0.5) / rows;
    const ypx = y * h;
    for (let c = 0; c < cols; c++) {
      const i = row * cols + c;
      const x = (c + 0.5) / cols;
      const xpx = x * w;

      // Candelabra cacti on the near dune
      let done = false;
      for (const k of cacti) {
        if (xpx < k.x - k.s * 0.3 || xpx > k.x + k.s * 0.3 || ypx < k.y - k.s - k.r || ypx > k.y) continue;
        const { x: bx, y: by, s } = k;
        const d = Math.min(
          segment(xpx, ypx, bx, by, bx, by - s),
          segment(xpx, ypx, bx, by - s * 0.42, bx - s * 0.22, by - s * 0.42),
          segment(xpx, ypx, bx - s * 0.22, by - s * 0.42, bx - s * 0.22, by - s * 0.78),
          segment(xpx, ypx, bx, by - s * 0.58, bx + s * 0.2, by - s * 0.58),
          segment(xpx, ypx, bx + s * 0.2, by - s * 0.58, bx + s * 0.2, by - s * 0.9),
        );
        if (d < k.r) {
          // Ribbed stems: rounded sides, vertical ribs inside
          const side = d > k.r - w / cols;
          const lit = 0.75 + (1 - d / k.r) * 0.6;
          put(g, i, side ? (xpx < k.x ? CPAREN_L : CPAREN_R) : c % 2 ? PIPE : COLON, CACTUS[0] * lit, CACTUS[1] * lit, CACTUS[2] * lit, 1);
          done = true;
          break;
        }
      }
      if (done) continue;

      // Dunes, moonlit from the left, with wind ripples
      const ny = dunes.near[c];
      const fy = dunes.far[c];
      if (y >= fy) {
        const isNear = y >= ny;
        const top = isNear ? ny : fy;
        const slope = isNear ? dunes.nearS[c] : dunes.farS[c];
        const lit = clamp01(0.5 - slope * 2.2);
        const depth = clamp01((y - top) / 0.14);
        const lo: RGB = isNear ? [96, 46, 56] : [58, 38, 78];
        const hi: RGB = isNear ? [224, 150, 98] : [156, 108, 156];
        const k = 1 - depth * 0.3;
        const r = mix(lo[0], hi[0], lit) * k;
        const gg = mix(lo[1], hi[1], lit) * k;
        const b = mix(lo[2], hi[2], lit) * k;
        if (y - top < 1.1 / rows) {
          put(g, i, Math.abs(slope) < 0.6 ? UNDER : slope < 0 ? SLASH : BACK, r * 1.2, gg * 1.2, b * 1.2, 1);
          continue;
        }
        const ripple = Math.sin(x * 64 + (y - top) * 260 + noise2(x * 10, y * 30) * 3) * 0.5 + 0.5;
        put(g, i, pick(DUNE, ripple * (0.55 + lit * 0.6)), r, gg, b, 0.9);
        continue;
      }

      // Radio telescopes on the far dune
      for (const a of antennas) {
        if (Math.abs(xpx - a.x) > a.s * 0.7 || ypx < a.ground - a.s * 1.4 || ypx > a.ground) continue;
        const mount = Math.abs(xpx - a.x) < a.s * 0.08 && ypx > a.ground - a.s * 0.62;
        const cx = a.x - a.s * 0.06;
        const cy = a.ground - a.s * 0.92;
        const rx = (xpx - cx) * 0.82 + (ypx - cy) * 0.57;
        const ry = -(xpx - cx) * 0.57 + (ypx - cy) * 0.82;
        const e = (rx / (a.s * 0.56)) ** 2 + (ry / (a.s * 0.22)) ** 2;
        if (mount || e < 1) {
          const k = mount ? 0.55 : 0.6 + (1 - e) * 0.4;
          put(g, i, mount ? PIPE : e > 0.55 ? PCT : AT, ANTENNA[0] * k, ANTENNA[1] * k, ANTENNA[2] * k, 0.95);
          done = true;
          break;
        }
      }
      if (done) continue;

      if (phase < 0.16 && xpx > Math.min(sx, hx - tail) - 10 && xpx < hx + 10 && ypx > sy - 10 && ypx < hy + 10) {
        const d = segment(xpx, ypx, hx - tail * 0.9, hy - tail * 0.4, hx, hy);
        const fade = (1 - phase / 0.16) * clamp01(1 - Math.hypot(xpx - hx, ypx - hy) / tail);
        if (d < h / rows && fade > 0.05) {
          put(g, i, BACK, WHITE[0], WHITE[1], WHITE[2], 0.4 + fade * 0.6);
          continue;
        }
      }

      // Sky: glow on the horizon, the Milky Way with its dark dust lanes, and scattered stars
      grad(desertSky, y / fy, sky);
      const s = hash2(c, row);
      const rx = xpx - ox;
      const ry = ypx - oy;
      const along = rx * ux + ry * uy;
      const across = -rx * uy + ry * ux;
      const band = Math.exp(-((across / bandW) ** 2));
      if (band > 0.04) {
        const nx = along / bandW;
        const nb = across / bandW;
        const core = 0.5 + 0.5 * Math.exp(-((along / coreLen) ** 2));
        const dust = sstep(0.5, 0.66, fbm(nx * 1.3 + 9, nb * 2.6, 3)) * Math.exp(-((nb * 1.5) ** 2));
        const dens = band * core * (0.35 + 0.95 * fbm(nx * 3.5, nb * 5, 3)) - dust * 0.85;
        if (dens > 0.04) {
          grad(MW, clamp01(Math.abs(nb) * 0.75 + (s - 0.5) * 0.25), mw);
          const bright = s > 0.993;
          const k = bright ? 1 : 0.55 + dens * 0.8;
          put(g, i, bright ? ASTER : pick(DUST, dens + (s - 0.5) * 0.3), mw[0] * k, mw[1] * k, mw[2] * k, 0.3 + Math.min(0.65, dens * 0.8));
          continue;
        }
      }
      if (s > 0.98) {
        const tw = 0.55 + 0.45 * Math.sin(t * (0.6 + s * 2) + s * 80);
        const tint = STAR_TINTS[Math.floor(hash2(row, c) * 3)];
        put(g, i, s > 0.997 ? PLUS : DOT, tint[0], tint[1], tint[2], 0.35 + tw * 0.6);
        continue;
      }
      const v = sstep(0.55, 1, y / fy) * 0.55 + (hash2(c * 1.3, row * 2.1) - 0.5) * 0.25 + 0.08;
      put(g, i, pick(SKY, v), sky[0], sky[1], sky[2], 0.4 + sstep(0.6, 1, y / fy) * 0.4);
    }
  }
};

export const scenes = { andes, sea, desert } satisfies Record<string, Scene>;
export type SceneName = keyof typeof scenes;
