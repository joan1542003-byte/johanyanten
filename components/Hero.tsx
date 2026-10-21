"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { Category, HeroContent } from "@/lib/content";
import { CategoryChip } from "./Chip";

type Props = HeroContent & {
  labels: { contact: string; drag: string; bold: string; categories: Record<Category, string> };
};

const word = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(10px)" },
  show: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
} as const;

export function Hero({ eyebrow, title, subtitle, cta, scroll, labels }: Props) {
  const section = useRef<HTMLElement>(null);
  const [dragged, setDragged] = useState(false);

  // Pointer parallax shared by the floating pieces
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });

  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  const lift = useTransform(scrollY, [0, 600], [0, -80]);

  const tokens = title.split(/(\*[^*]+\*|\s+)/).filter(Boolean);
  const piece = { section, sx, sy, onDrag: () => setDragged(true) };

  return (
    <section
      ref={section}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 pt-24 pb-16"
    >
      {/* Soft pastel light behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[820px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side at 30% 40%, rgba(255,140,200,.35), transparent), radial-gradient(closest-side at 70% 45%, rgba(255,190,120,.3), transparent), radial-gradient(closest-side at 50% 70%, rgba(130,120,255,.28), transparent)",
        }}
      />

      {/* Draggable pieces, desktop only */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <Piece {...piece} depth={30} className="top-[18%] left-[7%] -rotate-[5deg]" float={6}>
          <Toolbar bold={labels.bold} />
          <AnimatePresence>
            {!dragged && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.6 } }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -bottom-9 left-6 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white"
              >
                {labels.drag} ↗
              </motion.span>
            )}
          </AnimatePresence>
        </Piece>
        <Piece {...piece} depth={-24} className="top-[16%] right-[8%] rotate-[4deg]" float={7}>
          <Palette />
        </Piece>
        <Piece {...piece} depth={40} className="bottom-[16%] left-[10%] rotate-[3deg]" float={8}>
          <div className="flex flex-col items-start gap-2">
            <CategoryChip category="branding" label={labels.categories.branding} />
            <div className="ml-8">
              <CategoryChip category="uxui" label={labels.categories.uxui} />
            </div>
            <CategoryChip category="data" label={labels.categories.data} />
          </div>
        </Piece>
        <Piece {...piece} depth={-36} className="right-[9%] bottom-[20%] -rotate-[3deg]" float={6.5}>
          <Player label={labels.categories.motion} />
        </Piece>
        <Cursor />
      </div>

      <motion.div style={{ opacity: fade, y: lift }} className="relative z-10 max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="raised inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-ink/80"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {eyebrow}
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.08, delayChildren: 0.3 }}
          className="mt-7 text-[clamp(3.2rem,11vw,8.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance"
        >
          {tokens.map((t, i) =>
            /^\s+$/.test(t) ? (
              " "
            ) : (
              <motion.span key={i} variants={word} className={`inline-block ${t.startsWith("*") ? "font-display" : ""}`}>
                {t.startsWith("*") ? t.slice(1, -1) : t}
              </motion.span>
            ),
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="mesh inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold"
          >
            <Sparkle /> {labels.contact}
          </motion.a>
          <motion.a
            href="#work"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="raised inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium"
          >
            {cta} <span aria-hidden>↓</span>
          </motion.a>
        </motion.div>

        {/* On phones the pieces become a simple row of chips */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 md:hidden">
          {(["branding", "uxui", "data", "motion"] as const).map((c) => (
            <CategoryChip key={c} category={c} label={labels.categories[c]} size="sm" />
          ))}
        </div>
      </motion.div>

      <motion.a
        href="#work"
        aria-label={scroll}
        style={{ opacity: fade }}
        className="absolute bottom-6 hidden flex-col items-center gap-2 text-xs font-medium text-muted sm:flex"
      >
        {scroll}
        <span className="well flex h-9 w-6 justify-center rounded-full pt-2">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-ink/50"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}

// Three layers: pointer parallax → draggable → idle float, so the motions never fight
function Piece({
  children,
  className,
  depth,
  float,
  section,
  sx,
  sy,
  onDrag,
}: {
  children: ReactNode;
  className: string;
  depth: number;
  float: number;
  section: RefObject<HTMLElement | null>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  onDrag: () => void;
}) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        drag
        dragConstraints={section}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
        onDragStart={onDrag}
        initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.9 + Math.abs(depth) / 100 }}
        whileHover={{ scale: 1.04 }}
        whileDrag={{ scale: 1.08, rotate: 0, zIndex: 20 }}
        className="pointer-events-auto relative cursor-grab touch-none active:cursor-grabbing"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: float, repeat: Infinity, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Toolbar({ bold }: { bold: string }) {
  return (
    <div className="relative">
      <span className="raised absolute -top-9 left-[132px] rounded-lg px-2 py-1 text-[11px] font-medium text-ink/70 whitespace-nowrap">
        {bold}: ⌘ + B
      </span>
      <div className="raised flex items-center gap-1.5 rounded-2xl p-1.5 text-sm select-none">
        <span className="mesh flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold">
          <Sparkle /> AI
        </span>
        <span className="px-1.5 text-ink/70">Inter · Medium</span>
        <span className="well flex rounded-xl p-0.5">
          <span className="raised rounded-lg px-2 py-1 font-bold">B</span>
          <span className="px-2 py-1 text-ink/60 italic">I</span>
          <span className="px-2 py-1 text-ink/60 underline">U</span>
        </span>
      </div>
    </div>
  );
}

function Palette() {
  const colors = ["#ff7ac6", "#ffb36b", "#7b6bff", "#3b6cf6", "#1f9d63"];
  return (
    <div className="raised flex items-center gap-3 rounded-2xl p-2 pr-4 select-none">
      <div className="flex -space-x-2">
        {colors.map((c, i) => (
          <motion.span
            key={c}
            whileHover={{ y: -6 }}
            className="h-9 w-9 rounded-full border-2 border-white shadow-sm"
            style={{ background: c, zIndex: colors.length - i }}
          />
        ))}
      </div>
      <span className="font-mono text-xs text-ink/60">#FF7AC6</span>
    </div>
  );
}

function Player({ label }: { label: string }) {
  return (
    <div className="raised w-60 rounded-2xl p-3 select-none">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
          <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5">
            <path d="M4 2.5l9 5.5-9 5.5z" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted">0:24 / 1:08</p>
        </div>
      </div>
      <div className="well mt-3 h-1.5 overflow-hidden rounded-full">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ff7ac6] to-[#7b6bff]"
          animate={{ width: ["10%", "85%"] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// A multiplayer-style cursor wandering around the hero
function Cursor() {
  return (
    <motion.div
      aria-hidden
      className="absolute top-[40%] right-[6%] z-20 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: [0, -50, -10, 30, 0], y: [0, -40, -90, -30, 0] }}
      transition={{
        opacity: { delay: 1.8 },
        x: { duration: 14, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 14, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5 drop-shadow">
        <path d="M3 2l13 6.5-5.6 1.6L8.2 16z" fill="#7b6bff" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <span className="ml-4 inline-block rounded-full bg-[#7b6bff] px-2.5 py-1 text-xs font-medium text-white shadow">
        Johan
      </span>
    </motion.div>
  );
}

export function Sparkle() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <path d="M8 1.5l1.5 4 4 1.5-4 1.5L8 12.5 6.5 8.5l-4-1.5 4-1.5z" fill="currentColor" />
      <path d="M13 10.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor" opacity=".8" />
    </svg>
  );
}
