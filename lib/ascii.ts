// Shared pieces for the ASCII art: sampling images into character grids and drawing them

/** Characters from empty to dense */
export const RAMP = " .·:;-=+*%#@";
const NOISE = "@#%*+=-:;·.?!/\\|<>{}[]01";

export type Cell = { ch: string; r: number; g: number; b: number; a: number };

/** Monospace cells are taller than wide; this keeps images in proportion */
export const CELL_RATIO = 0.55;

export const randomGlyph = () => NOISE[(Math.random() * NOISE.length) | 0];

/** Small same-origin copy of any image (works for Supabase uploads too, so pixels can be read) */
export const sampleUrl = (src: string, width = 128) =>
  src.startsWith("/_next/image") ? src : `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Turns an image into a grid of colored characters, cropped like object-fit: cover.
 * Dark, saturated pixels get dense glyphs; light paper turns into empty space.
 */
export function imageToCells(
  img: CanvasImageSource & { width: number; height: number },
  cols: number,
  rows: number,
  /** "soft" for photos behind a reveal; "ink" for art on paper: contrasty, deep colors */
  style: "soft" | "ink" = "soft",
) {
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const target = cols / (rows / CELL_RATIO);
  const source = img.width / img.height;
  let sw = img.width;
  let sh = img.height;
  if (source > target) sw = img.height * target;
  else sh = img.width / target;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, cols, rows);
  const data = ctx.getImageData(0, 0, cols, rows).data;
  const cells: Cell[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const [r, g, b] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const sat = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    const density =
      style === "ink" ? Math.min(1, Math.pow(1 - lum, 0.75) * 1.15 + sat * 0.15) : Math.min(1, (1 - lum) * 0.85 + sat * 0.55);
    const ch = RAMP[Math.min(RAMP.length - 1, Math.round(density * (RAMP.length - 1)))];
    if (style === "ink") {
      // Push the color away from gray, then deepen it so characters read clearly on paper
      const gray = (r + g + b) / 3;
      const k = 0.62 + (1 - density) * 0.12;
      const vivid = (c: number) => Math.max(0, Math.min(255, (gray + (c - gray) * 2.1) * k));
      cells.push({ ch, r: vivid(r), g: vivid(g), b: vivid(b), a: 0.6 + density * 0.4 });
    } else {
      cells.push({ ch, r, g, b, a: 0.35 + density * 0.65 });
    }
  }
  return cells;
}

/** Aura palette across a horizontal position 0–1, for text with no image behind it */
const STOPS: [number, [number, number, number]][] = [
  [0, [217, 84, 142]],
  [0.35, [138, 91, 201]],
  [0.65, [63, 127, 194]],
  [1, [226, 150, 32]],
];
export function auraColor(t: number): [number, number, number] {
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (t <= p1) {
      const k = (t - p0) / (p1 - p0);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k)) as [number, number, number];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/** Sizes a canvas to its box at device resolution and returns the drawing context */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.max(1, Math.round(w * dpr));
  canvas.height = Math.max(1, Math.round(h * dpr));
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
