// Shared pieces for the ASCII art drawn on canvas

/** Characters from empty to dense */
export const RAMP = " .·:;-=+*%#@";
const NOISE = "@#%*+=-:;·.?!/\|<>{}[]01";

/** Monospace cells are taller than wide; this keeps drawings in proportion */
export const CELL_RATIO = 0.55;

export const randomGlyph = () => NOISE[(Math.random() * NOISE.length) | 0];

/** Aura palette across a position 0–1: pink, violet, blue, amber */
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
