"use client";

import Link from "next/link";
import type { CSSProperties, PointerEvent, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Makes the whole card a link that lifts and tilts toward the pointer */
  href?: string;
  /** Opens href in a new tab */
  external?: boolean;
  /** Accessible name when the card is a link */
  label?: string;
  transitionTypes?: string[];
  /** Entrance delay in seconds, for staggered grids */
  delay?: number;
  dark?: boolean;
  /** The project's own color as "r g b": tints the glow, the shade over the image and the labels */
  tint?: string;
  id?: string;
  style?: CSSProperties;
};

// Pointer position as CSS variables: px for the edge light and the follow label, -1…1 for the tilt
function track(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
  el.style.setProperty("--tx", ((x / r.width) * 2 - 1).toFixed(3));
  el.style.setProperty("--ty", ((y / r.height) * 2 - 1).toFixed(3));
}
function settle(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--tx", "0");
  e.currentTarget.style.setProperty("--ty", "0");
}

// A bento card. It rises in when it reaches the screen (see RevealScript); no React state involved
export function Card({ children, className = "", href, external, label, transitionTypes, delay = 0, dark, tint, id, style }: Props) {
  const props = {
    className: `card reveal ${dark ? "card-dark" : ""} ${href ? "card-link block" : ""} ${className}`,
    style: { ...style, "--delay": `${delay}s`, ...(tint ? { "--tint": tint } : {}) } as CSSProperties,
    onPointerMove: track,
    onPointerLeave: settle,
  };

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} {...props}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} transitionTypes={transitionTypes} aria-label={label} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <div id={id} {...props}>
      {children}
    </div>
  );
}
