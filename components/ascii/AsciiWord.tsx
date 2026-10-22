"use client";

import { Safe } from "@/components/Safe";
import { useEffect, useRef } from "react";
import { CELL_RATIO, MONO, RAMP, auraColor, fitCanvas } from "@/lib/ascii";

/**
 * A word written in ASCII that rises out of slow waves of characters,
 * colored with the aura gradient. The pointer stirs the waves.
 */
function AsciiWordCanvas({
  text,
  cell: baseCell = 9,
  waves = 0.32,
  className = "",
}: {
  text: string;
  /** Width of one character cell in px */
  cell?: number;
  /** How much the background waves show (0 = only the word) */
  waves?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let mask: Float32Array = new Float32Array(0);
    let cols = 0;
    let rows = 0;
    let ctx: CanvasRenderingContext2D;
    let w = 0;
    let h = 0;
    let cell = baseCell;
    let lineH = cell / CELL_RATIO;
    const pointer = { x: -1, y: -1, energy: 0 };

    // Writes the word into a tiny canvas, one pixel per character cell, and keeps its coverage
    const build = () => {
      ({ ctx, w, h } = fitCanvas(el));
      // Not laid out yet (hidden tab, first frame): wait for the next resize
      if (w < 2 || h < 2) {
        mask = new Float32Array(0);
        cols = rows = 0;
        return;
      }
      // Finer cells on phones, or the word has too few characters to read
      cell = w < 520 ? baseCell * 0.7 : baseCell;
      lineH = cell / CELL_RATIO;
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / lineH);
      const m = document.createElement("canvas");
      m.width = cols;
      m.height = rows;
      const mc = m.getContext("2d", { willReadFrequently: true })!;
      // A cell is taller than wide, so squash the word vertically to keep its real proportions
      let size = (rows * 0.8) / CELL_RATIO;
      mc.font = `700 ${size}px Helvetica, Arial, sans-serif`;
      const fit = (cols * 0.92) / mc.measureText(text).width;
      if (fit < 1) size *= fit;
      mc.font = `700 ${size}px Helvetica, Arial, sans-serif`;
      mc.textAlign = "center";
      mc.textBaseline = "middle";
      mc.fillStyle = "#fff";
      mc.setTransform(1, 0, 0, CELL_RATIO, 0, 0);
      mc.fillText(text, cols / 2, rows / 2 / CELL_RATIO + size * 0.05);
      const d = mc.getImageData(0, 0, cols, rows).data;
      mask = new Float32Array(cols * rows);
      for (let i = 0; i < mask.length; i++) mask[i] = d[i * 4 + 3] / 255;
      ctx.font = `${cell * 1.6}px ${MONO}`;
      ctx.textBaseline = "top";
    };

    let last = 0;
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || !mask.length || time - last < 33) return; // 30 fps is plenty for text
      last = time;
      const t = reduce ? 0 : time / 1000;
      pointer.energy *= 0.96;
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const wave =
            (Math.sin(x * 0.16 + t * 0.55) * Math.cos(y * 0.22 - t * 0.4) + Math.sin((x + y) * 0.07 + t * 0.3)) * 0.25 + 0.5;
          const d = pointer.x < 0 ? 99 : Math.hypot(x - pointer.x, (y - pointer.y) * 1.8);
          const ripple = pointer.energy * Math.max(0, 1 - d / 14) * (0.5 + 0.5 * Math.sin(d - t * 8));
          const inWord = mask[i] > 0.35;
          const v = inWord ? 0.7 + mask[i] * 0.3 : Math.min(0.55, wave * waves + ripple * 0.5);
          if (v < 0.1) continue;
          const [r, g, b] = auraColor(x / cols);
          ctx.fillStyle = `rgba(${r},${g},${b},${inWord ? 0.95 : 0.18 + v * 0.5})`;
          ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)))], x * cell, y * lineH);
        }
      }
      if (reduce) cancelAnimationFrame(frame);
    };

    build();
    frame = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => build());
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / cell;
      pointer.y = (e.clientY - r.top) / lineH;
      pointer.energy = 1;
    };
    el.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
    };
  }, [text, baseCell, waves]);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}

// Wrapped so a failure here can never break the page
export function AsciiWord(props: Parameters<typeof AsciiWordCanvas>[0]) {
  return (
    <Safe>
      <AsciiWordCanvas {...props} />
    </Safe>
  );
}
