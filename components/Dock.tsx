"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { LiquidGlass } from "./LiquidGlass";

export type Tool = { key: string; name: string; mark: string; bg: string; fg: string; description: string };

const RANGE = 160;

// Phones get smaller icons and no magnification, so six icons fit on one row
const wideQuery = "(min-width: 640px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// macOS-style dock: icons swell with springs as the pointer gets closer
export function Dock({ tools }: { tools: Tool[] }) {
  const mouseX = useMotionValue(Infinity);
  const [active, setActive] = useState(0);
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => true);
  const sizes = wide ? { base: 56, max: 88 } : { base: 44, max: 44 };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[120px] items-end justify-center">
        <LiquidGlass
          radius={28}
          className="flex items-end p-2.5 sm:p-3"
          strength={30}
        >
          <div
            className="flex items-end gap-2 sm:gap-2.5"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
          >
            {tools.map((t, i) => (
              <DockIcon
                key={t.key}
                tool={t}
                mouseX={mouseX}
                sizes={sizes}
                active={i === active}
                onSelect={() => setActive(i)}
              />
            ))}
          </div>
        </LiquidGlass>
      </div>

      <div className="mt-8 h-24 w-full max-w-md text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-semibold tracking-tight">{tools[active].name}</p>
            <p className="mt-1 text-muted">{tools[active].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DockIcon({
  tool,
  mouseX,
  sizes,
  active,
  onSelect,
}: {
  tool: Tool;
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
  const size = useSpring(useTransform(distance, [-RANGE, 0, RANGE], [sizes.base, sizes.max, sizes.base]), {
    mass: 0.1,
    stiffness: 170,
    damping: 13,
  });
  const fontSize = useTransform(size, (s) => s * 0.34);
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={tool.name}
      aria-pressed={active}
      onMouseEnter={() => {
        setHover(true);
        onSelect();
      }}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{ width: size, height: size, background: tool.bg, color: tool.fg }}
      whileTap={{ scale: 0.9 }}
      className="relative flex shrink-0 items-center justify-center rounded-[22%] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_-4px_rgba(0,0,0,0.35)]"
    >
      <motion.span className="tracking-tight" style={{ fontSize }}>
        {tool.mark}
      </motion.span>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            className="raised pointer-events-none absolute -top-10 rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap text-ink"
          >
            {tool.name}
          </motion.span>
        )}
      </AnimatePresence>
      <span
        className={`absolute -bottom-2.5 h-1 w-1 rounded-full bg-ink/60 transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
      />
    </motion.button>
  );
}
