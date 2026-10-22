"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { ease } from "@/lib/motion";
import { LiquidGlass } from "./LiquidGlass";
import type { GlassSettings } from "@/lib/glass";

export type DockTool = { key: string; name: string; mark: string; tile: string; group: string; description: string };

const wideQuery = "(min-width: 640px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// macOS-style dock on liquid glass: tiles swell with springs as the pointer approaches
export function Dock({ tools, glass }: { tools: DockTool[]; glass: GlassSettings }) {
  const mouseX = useMotionValue(Infinity);
  const [active, setActive] = useState(0);
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => false);
  const sizes = wide ? { base: 76, max: 112 } : { base: 46, max: 46 };
  const tool = tools[active];

  return (
    <div className="grid min-w-0 justify-items-center gap-8">
      <div className="flex h-[150px] max-w-full items-end">
        <LiquidGlass settings={glass} radius={30} className="p-2.5 sm:p-3">
          <div className="flex items-end gap-2 sm:gap-3" onMouseMove={(e) => mouseX.set(e.pageX)} onMouseLeave={() => mouseX.set(Infinity)}>
            {tools.map((t, i) => (
              <DockTile key={t.key} tool={t} mouseX={mouseX} sizes={sizes} active={i === active} onSelect={() => setActive(i)} />
            ))}
          </div>
        </LiquidGlass>
      </div>

      <div className="card relative min-h-[132px] w-full max-w-xl overflow-hidden px-6 py-5 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tool.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.4, ease } }}
          >
            <span className="t-label text-soft">{tool.group}</span>
            <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">{tool.name}</p>
            <p className="t-small mx-auto mt-1.5 max-w-md text-soft">{tool.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DockTile({
  tool,
  mouseX,
  sizes,
  active,
  onSelect,
}: {
  tool: DockTool;
  mouseX: MotionValue<number>;
  sizes: { base: number; max: number };
  active: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + window.scrollX) - r.width / 2 : Infinity;
  });
  const size = useSpring(useTransform(distance, [-170, 0, 170], [sizes.base, sizes.max, sizes.base]), {
    mass: 0.15,
    stiffness: 140,
    damping: 16,
  });
  const fontSize = useTransform(size, (s) => s * 0.3);

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={tool.name}
      aria-pressed={active}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      whileTap={{ scale: 0.92 }}
      style={{ width: size, height: size, background: tool.tile }}
      className="tile relative flex items-center justify-center rounded-[26%] font-semibold text-ink"
    >
      <motion.span style={{ fontSize }}>{tool.mark}</motion.span>
      <span
        className={`absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-ink transition-opacity duration-500 ${active ? "opacity-70" : "opacity-0"}`}
      />
    </motion.button>
  );
}
