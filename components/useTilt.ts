"use client";

import type { PointerEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "motion/react";

// Subtle 3D tilt + light reflection that follows the pointer
export function useTilt(max = 6) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), spring);
  const shine = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(500px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.55), transparent 45%)`,
  );

  return {
    style: { rotateX, rotateY, transformPerspective: 1200 },
    shine,
    handlers: {
      onPointerMove: (e: PointerEvent<HTMLElement>) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      },
      onPointerLeave: () => {
        mx.set(0.5);
        my.set(0.5);
      },
    },
  };
}
