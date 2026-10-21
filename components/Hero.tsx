"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useTilt } from "./useTilt";

type Props = { eyebrow: string; title: string; subtitle: string; cta: string; scroll: string };

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Hero({ eyebrow, title, subtitle, cta, scroll }: Props) {
  const tilt = useTilt();
  // The card recedes as the page scrolls away from it
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, 0.9]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative flex min-h-svh items-center justify-center px-4 pt-20">
      <motion.div style={{ scale, opacity }} className="w-full max-w-3xl">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
          {...tilt.handlers}
          style={tilt.style}
          className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-16 sm:py-24"
        >
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: tilt.shine }} />
          <motion.p variants={fadeUp} className="relative text-sm font-medium uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </motion.p>
          <motion.h1 variants={fadeUp} className="relative mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
            {title}
          </motion.h1>
          <motion.p variants={fadeUp} className="relative mx-auto mt-6 max-w-xl text-lg text-muted">
            {subtitle}
          </motion.p>
          <motion.a
            variants={fadeUp}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="#work"
            className="relative mt-10 inline-block rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background"
          >
            {cta}
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#work"
        aria-label={scroll}
        style={{ opacity }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted"
      >
        {scroll}
        <span className="glass flex h-9 w-6 justify-center rounded-full pt-2">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-foreground/60"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
