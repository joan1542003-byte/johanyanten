import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import sharp from "sharp";
import { CONTENT_TAG } from "./content";
import { SITE_URL } from "./site";

async function load(src: string) {
  if (src.startsWith("/")) {
    // Images shipped with the site: read from disk at build time, over HTTP if the file isn't bundled
    try {
      return await readFile(path.join(process.cwd(), "public", src));
    } catch {
      src = SITE_URL + src;
    }
  }
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${res.status} ${src}`);
  return Buffer.from(await res.arrayBuffer());
}

function hsl(r: number, g: number, b: number) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) {
    const [rr, gg, bb] = [r / 255, g / 255, b / 255];
    h = max === rr ? ((gg - bb) / d) % 6 : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
  }
  return [((h * 60) + 360) % 360, s, l];
}

/**
 * The most characteristic color of an image as "r g b": the hue that is both vivid and frequent,
 * kept in a mid lightness so it works as a glow on the light page and as a shade under white text.
 * Worked out once per image and cached until the content changes.
 */
export async function tintOf(src: string): Promise<string | null> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  try {
    const { data } = await sharp(await load(src)).resize(32, 32, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const bins = Array.from({ length: 18 }, () => ({ weight: 0, r: 0, g: 0, b: 0, n: 0 }));
    let avg = [0, 0, 0];
    for (let i = 0; i < data.length; i += 3) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      avg = [avg[0] + r, avg[1] + g, avg[2] + b];
      const [h, s, l] = hsl(r, g, b);
      const score = s * Math.max(0, 1 - Math.abs(l - 0.5) * 1.8);
      const bin = bins[Math.floor(h / 20) % 18];
      bin.weight += score;
      bin.r += r * score;
      bin.g += g * score;
      bin.b += b * score;
      bin.n++;
    }
    const top = bins.reduce((a, b) => (b.weight > a.weight ? b : a));
    const px = data.length / 3;
    let [r, g, b] = top.weight > px * 0.04 ? [top.r / top.weight, top.g / top.weight, top.b / top.weight] : avg.map((v) => v / px);
    // Pull the color toward a usable middle: not washed out, not muddy
    const [, , l] = hsl(r, g, b);
    const k = l > 0.62 ? 0.62 / l : l < 0.35 ? 0.35 / Math.max(l, 0.05) : 1;
    [r, g, b] = [r, g, b].map((v) => Math.min(255, v * k));
    return [r, g, b].map((v) => Math.round(v)).join(" ");
  } catch {
    return null;
  }
}

/** A small JPEG of an image as a data URL, for generated share cards */
export async function thumbnail(src: string, width: number): Promise<string | null> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");
  try {
    const jpg = await sharp(await load(src)).resize(width, width, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${jpg.toString("base64")}`;
  } catch {
    return null;
  }
}
