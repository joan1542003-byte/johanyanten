"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { CELL_RATIO, MONO, fitCanvas, imageToCells, loadImage, randomGlyph, sampleUrl } from "@/lib/ascii";

const CHAR_W = 7;
const SETTLE_MS = 1300;

/**
 * Image that first appears as colored ASCII, resolving from noise top to bottom,
 * then dissolves into the real photo. Must sit in a positioned box (uses `fill`).
 */
export function AsciiImage({ className = "", alt, src, ...props }: Omit<ImageProps, "fill" | "onLoad"> & { alt: string; src: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(box, { once: true, margin: "120px 0px" });
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!inView || reduced || !canvas.current) return;
    const el = canvas.current;
    let frame = 0;
    let cancelled = false;

    loadImage(sampleUrl(src))
      .then((img) => {
        if (cancelled) return;
        const { ctx, w, h } = fitCanvas(el);
        const lineH = CHAR_W / CELL_RATIO;
        const cols = Math.ceil(w / CHAR_W);
        const rows = Math.ceil(h / lineH);
        const cells = imageToCells(img, cols, rows);
        // Each cell settles at its own moment, in a soft wave from the top
        const at = cells.map((_, i) => (Math.floor(i / cols) / rows) * SETTLE_MS * 0.6 + Math.random() * SETTLE_MS * 0.4);
        ctx.font = `${CHAR_W * 1.6}px ${MONO}`;
        ctx.textBaseline = "top";
        const start = performance.now();

        const draw = (now: number) => {
          const t = now - start;
          ctx.clearRect(0, 0, w, h);
          for (let i = 0; i < cells.length; i++) {
            const c = cells[i];
            const done = t >= at[i];
            if (!done && t < at[i] - 500) continue;
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${done ? c.a : c.a * 0.45})`;
            ctx.fillText(done ? c.ch : randomGlyph(), (i % cols) * CHAR_W, Math.floor(i / cols) * lineH);
          }
          if (t < SETTLE_MS + 150) frame = requestAnimationFrame(draw);
          else setSettled(true);
        };
        frame = requestAnimationFrame(draw);
      })
      .catch(() => setSettled(true));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [inView, reduced, src]);

  const reveal = loaded && (settled || reduced);

  return (
    <div
      ref={box}
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f6efe7 0%, #efe6f6 50%, #e6f0f7 100%)" }}
    >
      <Image
        {...props}
        src={src}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-[1100ms] ease-out ${reveal ? "opacity-100" : "opacity-0"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-[1100ms] ease-out ${
          reveal ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
