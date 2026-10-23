"use client";

import { Safe } from "@/components/Safe";
import { useEffect, useRef } from "react";
import { CELL_RATIO, MONO, fitCanvas, inkOf } from "@/lib/ascii";

// Shading ramp for the 3D object, dark to bright
const SHADE = ".,-~:;=!*#$@";

type Shape = "torus" | "cube";

/**
 * A 3D object drawn with characters, in the spirit of the classic spinning donut.
 * It turns on its own; drag to spin it, and it keeps the momentum.
 */
function AsciiObjectCanvas({
  shape = "torus",
  label,
  className = "",
  size = 0.36,
  center = [0.5, 0.5],
  field = false,
}: {
  shape?: Shape;
  label: string;
  className?: string;
  /** Size of the object relative to the canvas */
  size?: number;
  /** Where the object sits, as fractions of width and height */
  center?: [number, number];
  /** Fill the rest of the canvas with a faint, drifting field of characters */
  field?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [posX, posY] = center;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = false;
    let ctx: CanvasRenderingContext2D;
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let cell = 7;
    let lineH = cell / CELL_RATIO;
    let z: Float32Array = new Float32Array(0);
    let lum: Int8Array = new Int8Array(0);

    // Rotation angles and their velocities (radians per second)
    let A = 0.9;
    let B = 0.3;
    let vA = 0;
    let vB = 0;
    const drift = { a: 0.55, b: 0.32 };
    let dragging: { x: number; y: number } | null = null;

    const resize = () => {
      ({ ctx, w, h } = fitCanvas(el));
      cell = w < 420 ? 8 : 7;
      lineH = cell / CELL_RATIO;
      cols = Math.floor(w / cell);
      rows = Math.floor(h / lineH);
      z = new Float32Array(cols * rows);
      lum = new Int8Array(cols * rows);
      ctx.font = `${cell * 1.6}px ${MONO}`;
      ctx.textBaseline = "top";
    };

    // Projects one surface point; keeps the nearest one per cell
    const plot = (x: number, y: number, zz: number, L: number, scale: number) => {
      const ooz = 1 / zz;
      const xp = Math.floor(cols * posX + scale * ooz * x);
      const yp = Math.floor(rows * posY - scale * ooz * y * CELL_RATIO);
      if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) return;
      const i = xp + yp * cols;
      if (ooz > z[i]) {
        z[i] = ooz;
        lum[i] = Math.max(0, Math.min(SHADE.length - 1, Math.round(L * (SHADE.length - 1))));
      }
    };

    const renderTorus = () => {
      const [cA, sA, cB, sB] = [Math.cos(A), Math.sin(A), Math.cos(B), Math.sin(B)];
      const R1 = 1;
      const R2 = 2;
      const K2 = 5;
      const scale = (Math.min(cols, rows / CELL_RATIO) * K2 * size) / (R1 + R2);
      // Fewer surface samples on small canvases: same look, less work on phones
      const [stepT, stepP] = cols > 70 ? [0.07, 0.025] : [0.1, 0.038];
      for (let t = 0; t < 6.283; t += stepT) {
        const [ct, st] = [Math.cos(t), Math.sin(t)];
        for (let p = 0; p < 6.283; p += stepP) {
          const [cp, sp] = [Math.cos(p), Math.sin(p)];
          const cx = R2 + R1 * ct;
          const cy = R1 * st;
          const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB;
          const y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB;
          const zz = K2 + cA * cx * sp + cy * sA;
          const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
          // Whole surface: the lit side dense and bright, the shadow side faint dots
          plot(x, y, zz, Math.pow((L + 1.42) / 2.84, 1.5), scale);
        }
      }
    };

    const renderCube = () => {
      const [cA, sA, cB, sB] = [Math.cos(A), Math.sin(A), Math.cos(B), Math.sin(B)];
      const K2 = 5;
      const scale = Math.min(cols, rows / CELL_RATIO) * K2 * size * 0.55;
      const light = [0, 0.7, -0.7];
      const faces: [number[], number[], number[]][] = [
        [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
        [[0, 0, -1], [1, 0, 0], [0, 1, 0]],
        [[1, 0, 0], [0, 0, 1], [0, 1, 0]],
        [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
        [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
        [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
      ];
      const rot = ([x, y, zz]: number[]) => {
        const y1 = y * cA - zz * sA;
        const z1 = y * sA + zz * cA;
        return [x * cB - z1 * sB, y1, x * sB + z1 * cB];
      };
      for (const [n, u, v] of faces) {
        const nr = rot(n);
        const L = nr[0] * light[0] + nr[1] * light[1] + nr[2] * light[2];
        if (L <= 0) continue;
        for (let a = -1; a <= 1; a += 0.045) {
          for (let b = -1; b <= 1; b += 0.045) {
            const p = rot([n[0] + u[0] * a + v[0] * b, n[1] + u[1] * a + v[1] * b, n[2] + u[2] * a + v[2] * b]);
            plot(p[0], p[1], p[2] + K2, 0.15 + L * 0.85, scale);
          }
        }
      }
    };

    // Group characters by shade, so the fill color changes rarely
    const ink = inkOf(el);
    const DUST = " .·:+";
    const paintField = (t: number) => {
      ctx.fillStyle = `rgba(${ink},0.14)`;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (z[x + y * cols]) continue;
          const v = Math.sin(x * 0.11 + t * 0.35) * Math.cos(y * 0.17 - t * 0.25) + Math.sin((x - y) * 0.05 + t * 0.2);
          const k = Math.floor(((v + 2) / 4) * DUST.length * 1.15) - 1;
          if (k <= 0) continue;
          ctx.fillText(DUST[Math.min(DUST.length - 1, k)], x * cell, y * lineH);
        }
      }
    };

    const paint = (t = 0) => {
      ctx.clearRect(0, 0, w, h);
      if (field) paintField(t);
      const buckets: number[][] = Array.from({ length: SHADE.length }, () => []);
      for (let i = 0; i < z.length; i++) if (z[i] !== 0) buckets[lum[i]].push(i);
      buckets.forEach((cells, level) => {
        if (!cells.length) return;
        ctx.fillStyle = `rgba(${ink},${0.3 + (level / (SHADE.length - 1)) * 0.7})`;
        const ch = SHADE[level];
        for (const i of cells) ctx.fillText(ch, (i % cols) * cell, Math.floor(i / cols) * lineH);
      });
    };

    let last = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return; // 30 fps is plenty for text
      last = now;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!dragging) {
        vA += (drift.a - vA) * dt * 1.2;
        vB += (drift.b - vB) * dt * 1.2;
      }
      A += vA * dt;
      B += vB * dt;
      if (!cols || !rows) return;
      z.fill(0);
      if (shape === "torus") renderTorus();
      else renderCube();
      paint(now / 1000);
    };

    const onDown = (e: PointerEvent) => {
      dragging = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      vB = (e.clientX - dragging.x) * 0.25;
      vA = (e.clientY - dragging.y) * 0.25;
      dragging = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      dragging = null;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    // Start once the page is idle, so the first paint and input stay snappy
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const idleId = idle(() => {
      if (reduce) {
        z.fill(0);
        if (shape === "torus") renderTorus();
        else renderCube();
        paint();
      } else frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelIdle(idleId);
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [shape, size, posX, posY, field]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className={`block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
    />
  );
}

// Wrapped so a failure here can never break the page
export function AsciiObject(props: Parameters<typeof AsciiObjectCanvas>[0]) {
  return (
    <Safe>
      <AsciiObjectCanvas {...props} />
    </Safe>
  );
}
