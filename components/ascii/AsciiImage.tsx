"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { CELL_RATIO, MONO, RAMP, auraColor, fitCanvas, randomGlyph } from "@/lib/ascii";

const CHAR_W = 8;
const WIPE_MS = 1150;

/**
 * Image that waits behind a field of shimmering characters, then is uncovered by a
 * diagonal wipe whose leading edge is dense ASCII. The characters are generated,
 * not taken from the image. Must sit in a positioned box (uses `fill`).
 */
export function AsciiImage({ className = "", alt, ...props }: Omit<ImageProps, "fill" | "onLoad"> & { alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(box, { once: true, margin: "100px 0px" });
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  // The photo stays hidden until the character field has covered it, so it never flashes
  const [covered, setCovered] = useState(false);

  // Safety net: if animation frames are paused (background tab), show the photo anyway
  useEffect(() => {
    if (!loaded || done) return;
    const t = setTimeout(() => setDone(true), WIPE_MS + 2500);
    return () => clearTimeout(t);
  }, [loaded, done]);

  useEffect(() => {
    if (!inView || reduced || done || !canvas.current) return;
    const el = canvas.current;
    const { ctx, w, h } = fitCanvas(el);
    const lineH = CHAR_W / CELL_RATIO;
    const cols = Math.ceil(w / CHAR_W);
    const rows = Math.ceil(h / lineH);
    // Each cell's place along the diagonal, with a little jitter so the edge feels hand-made
    const order = Float32Array.from({ length: cols * rows }, (_, i) => {
      const x = i % cols;
      const y = Math.floor(i / cols);
      return (x / cols) * 0.65 + (y / rows) * 0.35 + Math.random() * 0.08;
    });
    ctx.font = `${CHAR_W * 1.55}px ${MONO}`;
    ctx.textBaseline = "top";
    let frame = 0;
    let start = 0;
    let last = 0;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - last < 40) return;
      last = now;
      if (loaded && !start) start = now;
      const p = start ? (now - start) / WIPE_MS : 0;
      const edge = p * 1.15 - 0.08;
      ctx.clearRect(0, 0, w, h);
      if (!covered) setCovered(true);
      for (let i = 0; i < order.length; i++) {
        const d = order[i] - edge;
        if (d < 0) continue; // uncovered
        const x = (i % cols) * CHAR_W;
        const y = Math.floor(i / cols) * lineH;
        ctx.fillStyle = "rgba(247,244,240,0.96)";
        ctx.fillRect(x, y, CHAR_W, lineH);
        const near = d < 0.1;
        const shimmer = !near && Math.random() < 0.08;
        if (!near && !shimmer && (i + Math.floor(now / 220)) % 7 !== 0) continue;
        const [r, g, b] = auraColor((i % cols) / cols);
        ctx.fillStyle = `rgba(${r},${g},${b},${near ? 0.95 : 0.35})`;
        ctx.fillText(near ? RAMP[RAMP.length - 1 - Math.floor((d / 0.1) * 6)] : randomGlyph(), x, y);
      }
      if (start && p >= 1.05) {
        cancelAnimationFrame(frame);
        setDone(true);
      }
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, loaded, done, covered]);

  return (
    <div
      ref={box}
      className="absolute inset-0 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f6efe7 0%, #efe6f6 50%, #e6f0f7 100%)" }}
    >
      <Image
        {...props}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} ${covered || done || reduced ? "" : "opacity-0"}`}
      />
      {!done && !reduced && (
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
