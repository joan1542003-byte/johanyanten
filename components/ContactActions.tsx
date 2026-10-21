"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkle } from "./Hero";

export function ContactActions({ href, cta, handle, copied }: { href: string; cta: string; handle: string; copied: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(handle);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      // Clipboard can be blocked; the handle stays visible anyway
    }
  }

  return (
    <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mesh inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
      >
        <Sparkle /> {cta} <span aria-hidden>↗</span>
      </motion.a>
      {handle && (
        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.95 }}
          className="raised relative inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-medium"
        >
          {handle}
          <span className="well flex h-6 w-6 items-center justify-center rounded-full text-xs text-ink/60" aria-hidden>
            {done ? "✓" : "⧉"}
          </span>
          <AnimatePresence>
            {done && (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white"
              >
                {copied}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  );
}
