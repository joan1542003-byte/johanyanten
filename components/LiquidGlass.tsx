"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

// SVG filters as backdrop-filter only render in Chromium; other browsers get a frosted blur
const subscribe = () => () => {};
const isChromium = () =>
  !!(navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands.some(
    (b) => b.brand === "Chromium",
  );

/**
 * Displacement map for a rounded rectangle: red encodes horizontal push, blue vertical.
 * The blurred neutral-gray core leaves the middle untouched, so only the rim bends light.
 */
function displacementMap(w: number, h: number, radius: number) {
  const rim = Math.max(6, Math.min(w, h) * 0.2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#00f"/></linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="#000"/>
<rect width="${w}" height="${h}" rx="${radius}" fill="url(#r)"/>
<rect width="${w}" height="${h}" rx="${radius}" fill="url(#b)" style="mix-blend-mode:screen"/>
<rect x="${rim / 2}" y="${rim / 2}" width="${w - rim}" height="${h - rim}" rx="${Math.max(0, radius - rim / 2)}" fill="rgb(128,128,128)" style="filter:blur(${rim / 2}px)"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Corner radius in px; use a large number for pills */
  radius?: number;
  /** Strength of the rim refraction */
  strength?: number;
  /** White tint over the glass, 0–1 */
  tint?: number;
};

export function LiquidGlass({ children, className = "", style, radius = 999, strength = 38, tint = 0.32 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `lg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const chromium = useSyncExternalStore(subscribe, isChromium, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !chromium) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [chromium]);

  const r = size ? Math.min(radius, size.h / 2) : 0;
  const refract = chromium && size && size.w > 0 && size.h > 0;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        borderRadius: radius,
        background: `rgba(255,255,255,${tint})`,
        transition: "background-color 300ms",
        backdropFilter: refract ? `url(#${id}) blur(2px) saturate(1.6) brightness(1.05)` : "blur(16px) saturate(1.7)",
        WebkitBackdropFilter: "blur(16px) saturate(1.7)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.55), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -6px 14px -8px rgba(255,255,255,0.6), 0 12px 32px -12px rgba(17,17,19,0.22), 0 0 0 1px rgba(17,17,19,0.06)",
      }}
    >
      {refract && (
        <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} colorInterpolationFilters="sRGB">
            <feImage
              href={displacementMap(size.w, size.h, r)}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            {/* Each color channel bends a little differently: a hint of chromatic aberration */}
            {(
              [
                ["r", strength, "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"],
                ["g", strength - 4, "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"],
                ["b", strength - 8, "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"],
              ] as const
            ).map(([c, s, m]) => [
              <feDisplacementMap
                key={`d${c}`}
                in="SourceGraphic"
                in2="map"
                scale={-s}
                xChannelSelector="R"
                yChannelSelector="B"
                result={`d${c}`}
              />,
              <feColorMatrix key={`m${c}`} in={`d${c}`} type="matrix" values={m} result={c} />,
            ])}
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
}
