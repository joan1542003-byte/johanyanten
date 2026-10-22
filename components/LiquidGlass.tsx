"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { defaultGlass, type GlassSettings } from "@/lib/glass";

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
function displacementMap(w: number, h: number, radius: number, rimFraction: number) {
  const rim = Math.max(4, Math.min(w, h) * rimFraction);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
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
  /** Look of the glass; the site passes what was saved in /admin */
  settings?: Partial<GlassSettings>;
  /** Overrides the saved tint, e.g. to make an open menu more opaque */
  tint?: number;
};

/**
 * Glass that bends what passes behind its edges. Important: no ancestor may have
 * view-transition-name, filter, opacity < 1 or another backdrop-filter, or the
 * browser hides the backdrop from it.
 */
export function LiquidGlass({ children, className = "", style, radius = 999, settings, tint }: Props) {
  const g = { ...defaultGlass, ...settings };
  const ref = useRef<HTMLDivElement>(null);
  const id = `lg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const chromium = useSyncExternalStore(subscribe, isChromium, () => false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !chromium) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      setSize({ w: Math.round(box.inlineSize), h: Math.round(box.blockSize) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [chromium]);

  const refract = g.enabled && chromium && size && size.w > 0 && size.h > 0;
  const r = size ? Math.min(radius, size.h / 2) : 0;
  const frosted = `blur(${Math.max(10, g.blur * 8)}px) saturate(${g.saturation})`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        borderRadius: radius,
        background: `rgba(255,255,255,${tint ?? g.tint})`,
        transition: "background-color 400ms ease",
        backdropFilter: refract
          ? `url(#${id}) blur(${g.blur}px) saturate(${g.saturation}) brightness(1.04)`
          : frosted,
        WebkitBackdropFilter: frosted,
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.65), inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -8px 16px -10px rgba(255,255,255,0.7), 0 1px 2px rgba(30,22,12,0.06), 0 18px 40px -22px rgba(30,22,12,0.35)",
      }}
    >
      {refract && (
        <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
          {/* Region and map in real pixels: percentage sizes misplace the map under backdrop-filter */}
          <filter
            id={id}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={displacementMap(size.w, size.h, r, g.rim)}
              x="0"
              y="0"
              width={size.w}
              height={size.h}
              preserveAspectRatio="none"
              result="map"
            />
            {/* Each color channel bends slightly differently: a faint chromatic edge */}
            {(
              [
                ["r", g.strength, "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"],
                ["g", g.strength - g.aberration, "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"],
                ["b", g.strength - g.aberration * 2, "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"],
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
