import type { Category } from "./content";

// Grainy "skies" from Relevo: a base color with soft color blobs. Pair with the .grain class.
type Blob = [color: string, x: number, y: number, r: number];
const SKIES = {
  menta: { base: "#BFE7D3", blobs: [["#3FB487", 20, 80, 60], ["#E6F7FF", 70, 25, 55], ["#9ED6F4", 85, 75, 50], ["#5FC79A", 40, 45, 40]] },
  cielo: { base: "#8DB9EA", blobs: [["#2559C9", 20, 85, 60], ["#E9F3FF", 60, 35, 45], ["#7EA9E8", 85, 70, 45], ["#F7FBFF", 35, 20, 35], ["#3B6BD2", 90, 10, 35]] },
  atardecer: { base: "#F3B38E", blobs: [["#F06A3B", 25, 30, 50], ["#F7C6DD", 80, 30, 50], ["#B9A4F2", 75, 85, 50], ["#FFE6A6", 30, 80, 40]] },
  ambar: { base: "#E9B85C", blobs: [["#F2A20C", 20, 30, 60], ["#B78BEF", 85, 20, 55], ["#F7D27A", 50, 70, 45], ["#9C7BE8", 90, 85, 40]] },
  brasa: { base: "#F28A4A", blobs: [["#E8501E", 20, 75, 60], ["#F9B36B", 75, 30, 55], ["#FFE0B8", 55, 10, 40], ["#C9370F", 90, 90, 35]] },
  rosa: { base: "#F4C9D2", blobs: [["#C8325A", 25, 35, 55], ["#F7A9BE", 75, 25, 50], ["#FFFFFF", 55, 60, 35], ["#E0617F", 30, 85, 45]] },
  lila: { base: "#C9B8F2", blobs: [["#8E6FE6", 25, 70, 55], ["#F3D3F0", 75, 25, 50], ["#A7CFF5", 80, 85, 45], ["#FFFFFF", 40, 30, 30]] },
  aura: { base: "#FBF5EC", blobs: [["#FFD54A", 25, 75, 55], ["#F6A3CB", 70, 30, 50], ["#9DD6F4", 15, 20, 45], ["#C5B2F6", 90, 80, 45]] },
} satisfies Record<string, { base: string; blobs: Blob[] }>;

export type SkyName = keyof typeof SKIES;

export const categorySky: Record<Category, SkyName> = {
  branding: "atardecer",
  info: "cielo",
  uxui: "lila",
  data: "menta",
  motion: "brasa",
};

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

export function skyBackground(name: SkyName) {
  const { base, blobs } = SKIES[name];
  const layers = blobs.map(
    ([c, x, y, r]) =>
      `radial-gradient(ellipse ${r * 1.6}% ${r * 1.6}% at ${x}% ${y}%, ${rgba(c, 1)} 0%, ${rgba(c, 0.45)} 45%, ${rgba(c, 0)} 100%)`,
  );
  return [...layers.reverse(), base].join(", ");
}
