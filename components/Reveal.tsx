"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Fades and lifts content in as it scrolls into view
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-10 text-center sm:mb-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h2>
    </Reveal>
  );
}
