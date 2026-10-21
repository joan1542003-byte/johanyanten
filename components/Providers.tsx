"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Visitors who ask their system for less motion get fades instead of movement
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
