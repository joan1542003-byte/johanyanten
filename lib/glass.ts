// Shared by the site (server) and the admin panel (browser), so no server imports here

/** Liquid glass of the menu, tuned from /admin */
export type GlassSettings = {
  enabled: boolean;
  /** How far the rim bends what is behind it (px) */
  strength: number;
  /** Width of the bending rim, as a fraction of the shorter side */
  rim: number;
  /** Extra bend per color channel: the rainbow edge */
  aberration: number;
  blur: number;
  saturation: number;
  /** White tint over the glass, 0–1 */
  tint: number;
};

export const defaultGlass: GlassSettings = {
  enabled: true,
  strength: 34,
  rim: 0.3,
  aberration: 3,
  blur: 1.5,
  saturation: 1.5,
  tint: 0.3,
};
