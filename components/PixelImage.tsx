"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const STEPS = [48, 28, 16, 9, 5, 2];
const STEP_MS = 70;
const GRID = 8 * 6;

/**
 * Image that loads behind a pulsing tile grid, then resolves from coarse pixels to sharp
 * when it scrolls into view. Must sit in a positioned container (uses `fill`).
 */
export function PixelImage({ className = "", alt, ...props }: Omit<ImageProps, "fill" | "onLoad"> & { alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [done, setDone] = useState(false);
  const inView = useInView(box, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!img || !inView || done) return;
    const el = canvas.current;
    const wrap = box.current;
    if (reduced || !el || !wrap) {
      const t = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(t);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    const ctx = el.getContext("2d")!;

    // object-fit: cover crop of the source image
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) / 2;
    const small = document.createElement("canvas");
    const sctx = small.getContext("2d")!;

    let step = 0;
    const draw = () => {
      const block = STEPS[step] * dpr;
      small.width = Math.max(1, Math.ceil(el.width / block));
      small.height = Math.max(1, Math.ceil(el.height / block));
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.drawImage(small, 0, 0, el.width, el.height);
      step++;
      if (step < STEPS.length) timer = setTimeout(draw, STEP_MS);
      else timer = setTimeout(() => setDone(true), STEP_MS);
    };
    let timer = setTimeout(draw, 0);
    return () => clearTimeout(timer);
  }, [img, inView, done, reduced]);

  const revealing = !!img && inView && !done;

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-black/[0.04]">
      <Image
        {...props}
        alt={alt}
        fill
        onLoad={(e) => setImg(e.currentTarget)}
        className={`${className} transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ${
          revealing ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Loading state: soft tiles breathing in sequence */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-6 gap-[3px] p-[3px] transition-opacity duration-300 ${
          img && inView ? "opacity-0" : "opacity-100"
        }`}
      >
        {Array.from({ length: GRID }, (_, i) => (
          <span
            key={i}
            className="rounded-[3px] bg-black/[0.05] motion-safe:animate-pulse"
            style={{ animationDelay: `${((i % 8) + Math.floor(i / 8)) * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
