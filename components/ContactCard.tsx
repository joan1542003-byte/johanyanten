"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useWebHaptics } from "@/hooks/use-web-haptics";
import { ease } from "@/lib/motion";
import { MagneticButton } from "./amicro/magnetic-button";

// Primary ink button to the chat, plus the handle as a pill that copies itself
export function ContactActions({ href, cta, handle, copied }: { href: string; cta: string; handle: string; copied: string }) {
  const [done, setDone] = useState(false);
  const { trigger } = useWebHaptics();

  async function copy() {
    try {
      await navigator.clipboard.writeText(handle);
      trigger("success");
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      // Clipboard can be blocked; the handle stays visible on the button
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
      <MagneticButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trigger("light")}
        className="pill-ink h-12 rounded-full px-6 text-[15px] font-semibold"
      >
        {cta} <span aria-hidden>↗</span>
      </MagneticButton>
      {handle && (
        <button
          type="button"
          onClick={copy}
          className="pill-white relative inline-flex h-12 min-w-44 items-center justify-center overflow-hidden rounded-full px-6 text-[15px] font-semibold"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done ? "done" : "handle"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              {done ? `✓ ${copied}` : handle}
            </motion.span>
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}
