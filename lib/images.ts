import type { Img, Project } from "./content";

/**
 * The image that represents a project in cards and at the top of its page: the cover, unless the cover
 * is too small to look sharp there and the gallery has a much larger one.
 */
export function displayImage(p: Pick<Project, "cover" | "gallery">): Img {
  if (p.cover.w >= 1000) return p.cover;
  const best = [...p.gallery].sort((a, b) => b.w - a.w)[0];
  return best && best.w >= p.cover.w * 2 ? best : p.cover;
}

type Box = [w: number, h: number];

/**
 * `sizes` for an image that covers a box (object-fit: cover). A wide image in a tall box is cropped
 * at the sides, so it has to be wider than the box itself or it comes out soft.
 */
export function coverSizes(img: Img, boxes: { desktop: Box; tablet: Box; mobile: Box }) {
  const ratio = img.w / img.h;
  const need = ([w, h]: Box) => Math.ceil(Math.max(w, h * ratio));
  return `(min-width: 1024px) ${need(boxes.desktop)}px, (min-width: 640px) ${need(boxes.tablet)}px, ${need(boxes.mobile)}px`;
}

// Card boxes in CSS px at the widest layout of each breakpoint (see .bento in globals.css)
export const boxes = {
  big: { desktop: [598, 520], tablet: [912, 476], mobile: [398, 380] },
  wide: { desktop: [598, 250], tablet: [912, 230], mobile: [398, 300] },
  small: { desktop: [289, 250], tablet: [448, 230], mobile: [398, 300] },
  featured: { desktop: [598, 520], tablet: [912, 230], mobile: [398, 460] },
} satisfies Record<string, { desktop: Box; tablet: Box; mobile: Box }>;
