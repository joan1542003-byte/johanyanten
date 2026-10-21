"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

type Props = { eyebrow: string; title: string; subtitle: string; cta: string };

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Hero({ eyebrow, title, subtitle, cta }: Props) {
  // Subtle 3D tilt + light reflection that follows the pointer
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 20 });
  const shine = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(500px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.7), transparent 45%)`,
  );

  return (
    <motion.section
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="glass relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-16 sm:py-24"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: shine }} />
      <motion.p variants={fadeUp} className="relative text-sm font-medium uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="relative mt-4 text-5xl font-semibold tracking-tight sm:text-7xl"
      >
        {title}
      </motion.h1>
      <motion.p variants={fadeUp} className="relative mx-auto mt-6 max-w-xl text-lg text-muted">
        {subtitle}
      </motion.p>
      <motion.a
        variants={fadeUp}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href="#contact"
        className="relative mt-10 inline-block rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background"
      >
        {cta}
      </motion.a>
    </motion.section>
  );
}
