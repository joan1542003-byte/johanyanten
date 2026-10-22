"use client";

import { Safe } from "@/components/Safe";
import { useEffect, useRef } from "react";

// The aura of Relevo: five soft color blobs drifting slowly over paper, with live grain.
// One full-screen quad in WebGL; it pauses when off screen and holds still for reduced motion.
const VS = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
const FS = `precision highp float; uniform vec2 r; uniform float t; uniform float k; uniform float s; uniform vec3 bg; uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform vec3 c4;
float h(vec2 q){ vec3 p3 = fract(vec3(q.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec3 blob(vec3 col, vec2 p, vec2 c, float rad, vec3 tint){ vec2 d = p - c; float w = exp(-dot(d, d) / (rad * rad)) * k; return mix(col, tint, clamp(w, 0.0, 1.0)); }
void main(){ vec2 uv = gl_FragCoord.xy / r; vec2 p = uv - 0.5; p.x *= r.x / r.y; p /= s; vec3 col = bg;
  col = blob(col, p, vec2(-0.20 + 0.07 * sin(t * 0.31), 0.05 + 0.08 * cos(t * 0.27)), 0.26, c3);
  col = blob(col, p, vec2(0.22 + 0.08 * cos(t * 0.23 + 1.3), -0.04 + 0.07 * sin(t * 0.35)), 0.25, c2);
  col = blob(col, p, vec2(0.08 + 0.06 * sin(t * 0.29 + 2.1), 0.17 + 0.05 * cos(t * 0.33)), 0.24, c1);
  col = blob(col, p, vec2(-0.06 + 0.07 * cos(t * 0.25 + 0.7), -0.15 + 0.06 * sin(t * 0.37)), 0.27, c0);
  col = blob(col, p, vec2(0.02 + 0.05 * sin(t * 0.41 + 3.0), -0.02 + 0.04 * cos(t * 0.39)), 0.13, c4);
  col += (h(gl_FragCoord.xy + fract(t * 7.0) * 61.0) - 0.5) * 0.045; gl_FragColor = vec4(col, 1.0); }`;

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const PALETTE = {
  bg: rgb("#F7F4F0"),
  c0: rgb("#FFD54A"),
  c1: rgb("#F6A3CB"),
  c2: rgb("#C5B2F6"),
  c3: rgb("#9DD6F4"),
  c4: rgb("#FFF3D6"),
};
// [intensity, scale, speed]
const MODES = { hero: [1, 1.1, 1], soft: [0.85, 0.75, 0.6] } as const;

const FALLBACK =
  "radial-gradient(30% 34% at 40% 62%, #FFD54A, transparent 70%), radial-gradient(28% 30% at 58% 38%, #F6A3CB, transparent 72%), radial-gradient(30% 30% at 32% 40%, #9DD6F4, transparent 72%), radial-gradient(26% 28% at 66% 60%, #C5B2F6, transparent 72%), #F7F4F0";

function AuraCanvas({ mode = "hero", className = "" }: { mode?: keyof typeof MODES; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    const fallback = () => {
      canvas.style.background = FALLBACK;
    };
    if (!gl) return fallback();

    const shader = (type: number, src: string) => {
      const o = gl.createShader(type)!;
      gl.shaderSource(o, src);
      gl.compileShader(o);
      return o;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fallback();
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = Object.fromEntries(
      ["r", "t", "k", "s", "bg", "c0", "c1", "c2", "c3", "c4"].map((n) => [n, gl.getUniformLocation(program, n)]),
    );
    (Object.keys(PALETTE) as (keyof typeof PALETTE)[]).forEach((n) => gl.uniform3fv(U[n], PALETTE[n]));
    const [k, s, speed] = MODES[mode];

    let time = 3 + Math.random() * 20;
    let visible = true;
    let frame = 0;
    let last = performance.now();

    const draw = (dt: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      time += dt * speed;
      gl.uniform2f(U.r, w, h);
      gl.uniform1f(U.t, time);
      gl.uniform1f(U.k, k);
      gl.uniform1f(U.s, s);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) draw(dt);
      frame = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "120px" });
    io.observe(canvas);

    if (reduce) draw(0);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [mode]);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}

// Wrapped so a failure here can never break the page
export function Aura(props: Parameters<typeof AuraCanvas>[0]) {
  return (
    <Safe>
      <AuraCanvas {...props} />
    </Safe>
  );
}
