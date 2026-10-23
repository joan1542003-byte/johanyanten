// Shared pieces for the ASCII art drawn on canvas

/** Characters from empty to dense */
export const RAMP = " .·:;-=+*%#@";
const NOISE = "@#%*+=-:;·.?!/\|<>{}[]01";

/** Monospace cells are taller than wide; this keeps drawings in proportion */
export const CELL_RATIO = 0.55;

export const randomGlyph = () => NOISE[(Math.random() * NOISE.length) | 0];

/** The one color all ASCII art is drawn in: the page ink, as "r,g,b" (light on the dark site) */
export function inkOf(el: Element) {
  const hex = getComputedStyle(el).getPropertyValue("--ink").trim() || "#f2eee8";
  const n = parseInt(hex.slice(1), 16);
  return `${n >> 16},${(n >> 8) & 255},${n & 255}`;
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
