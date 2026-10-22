"use client";

import { useEffect, useRef } from "react";
import { CELL_RATIO, MONO, fitCanvas, imageToCells, loadImage, randomGlyph, sampleUrl, type Cell } from "@/lib/ascii";

const CHAR_W = 6;

/**
 * Portrait drawn in colored ASCII. It assembles from noise, keeps a faint shimmer,
 * and scrambles under the pointer like a lens.
 */
export function AsciiPortrait({ src, label, className = "" }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = true;
    let cancelled = false;
    const pointer = { x: -999, y: -999 };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -999;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    loadImage(sampleUrl(src, 256)).then((img) => {
      if (cancelled) return;
      const { ctx, w, h } = fitCanvas(el);
      const lineH = CHAR_W / CELL_RATIO;
      const cols = Math.ceil(w / CHAR_W);
      const rows = Math.ceil(h / lineH);
      const cells: Cell[] = imageToCells(img, cols, rows, "ink");
      const at = cells.map(() => 200 + Math.random() * 1600);
      ctx.font = `${CHAR_W * 1.62}px ${MONO}`;
      ctx.textBaseline = "top";
      const start = performance.now();
      let last = 0;

      const draw = (now: number) => {
        frame = requestAnimationFrame(draw);
        if (!visible || now - last < 33) return; // ~30 fps is plenty for text
        last = now;
        const t = reduce ? 1e9 : now - start;
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < cells.length; i++) {
          const c = cells[i];
          const x = (i % cols) * CHAR_W;
          const y = Math.floor(i / cols) * lineH;
          if (t < at[i] - 600) continue;
          const dist = Math.hypot(x - pointer.x, y - pointer.y);
          const lens = dist < 70 ? 1 - dist / 70 : 0;
          const settling = t < at[i];
          const flicker = !reduce && Math.random() < 0.004;
          const ch = settling || flicker || (lens > 0.2 && Math.random() < lens * 0.6) ? randomGlyph() : c.ch;
          const a = settling ? c.a * 0.4 : Math.min(1, c.a + lens * 0.5);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
          ctx.fillText(ch, x, y);
        }
        if (reduce) cancelAnimationFrame(frame);
      };
      frame = requestAnimationFrame(draw);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [src]);

  return <canvas ref={ref} role="img" aria-label={label} className={`block h-full w-full cursor-crosshair ${className}`} />;
}
