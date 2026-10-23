"use client";

import { useEffect, useRef } from "react";
import { CELL_RATIO, MONO, fitCanvas } from "@/lib/ascii";
import { scenes, type Grid, type SceneName } from "@/lib/scenes";
import { Safe } from "../Safe";

type Props = { scene: SceneName; label: string; className?: string; cell?: number };

// A full-screen ASCII landscape. It only animates while on screen, follows the pointer a little,
// and holds a single still frame for reduced motion
function SceneCanvas({ scene, label, className = "", cell: baseCell = 9 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = scenes[scene];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glyphs: string[] = [];
    const styles = new Map<number, string>();
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const start = performance.now();
    let ctx: CanvasRenderingContext2D;
    let grid: Grid | null = null;
    let cell = baseCell;
    let lineH = cell / CELL_RATIO;
    let visible = false;
    let frame = 0;
    let last = 0;

    const paint = (now: number) => {
      if (!grid) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      grid.ch.fill(32);
      render(grid, { t: reduce ? 14 : (now - start) / 1000, px: pointer.x, py: pointer.y, progress });

      ctx.clearRect(0, 0, grid.w, grid.h);
      const { cols, ch, r, g, b, a } = grid;
      let lastKey = -1;
      for (let i = 0; i < ch.length; i++) {
        const c = ch[i];
        if (c === 32 || a[i] < 0.03) continue;
        // Colors are rounded to 5 bits and opacity to 8 steps, so fillStyle rarely changes
        const al = Math.min(7, (a[i] * 8) | 0);
        const key = ((r[i] >> 3) << 13) | ((g[i] >> 3) << 8) | ((b[i] >> 3) << 3) | al;
        if (key !== lastKey) {
          let style = styles.get(key);
          if (!style) {
            style = `rgba(${(r[i] >> 3) * 8 + 4},${(g[i] >> 3) * 8 + 4},${(b[i] >> 3) * 8 + 4},${(al + 1) / 8})`;
            styles.set(key, style);
          }
          ctx.fillStyle = style;
          lastKey = key;
        }
        ctx.fillText((glyphs[c] ??= String.fromCharCode(c)), (i % cols) * cell, ((i / cols) | 0) * lineH);
      }
    };

    const build = () => {
      const fit = fitCanvas(el);
      ctx = fit.ctx;
      // Not laid out yet (hidden tab, first frame): wait for the next resize
      if (fit.w < 2 || fit.h < 2) {
        grid = null;
        return;
      }
      cell = fit.w < 640 ? baseCell * 0.8 : baseCell;
      lineH = cell / CELL_RATIO;
      const cols = Math.ceil(fit.w / cell);
      const rows = Math.ceil(fit.h / lineH);
      const n = cols * rows;
      grid = {
        cols,
        rows,
        w: fit.w,
        h: fit.h,
        ch: new Uint16Array(n),
        r: new Uint8ClampedArray(n),
        g: new Uint8ClampedArray(n),
        b: new Uint8ClampedArray(n),
        a: new Float32Array(n),
      };
      ctx.font = `${cell * 1.62}px ${MONO}`;
      ctx.textBaseline = "top";
      paint(performance.now());
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < 40) return; // 25 fps is plenty for drifting scenery
      last = now;
      paint(now);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && reduce) paint(performance.now());
    });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (!reduce) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [scene, baseCell]);

  return <canvas ref={ref} role="img" aria-label={label} className={`block h-full w-full ${className}`} />;
}

export function AsciiScene(props: Props) {
  return (
    <Safe>
      <SceneCanvas {...props} />
    </Safe>
  );
}
