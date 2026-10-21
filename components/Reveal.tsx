"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Emphasis } from "./Emphasis";

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

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
      <div>
        <p className="text-sm font-medium text-muted">{eyebrow}</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
          <Emphasis text={title} />
        </h2>
      </div>
      {children}
    </Reveal>
  );
}
