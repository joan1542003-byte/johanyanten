"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Category } from "@/lib/content";
import { ease } from "@/lib/motion";
import { useCopy } from "@/hooks/use-copy";
import { CategoryIcon } from "./CategoryIcon";
import { Icon } from "./Icon";
import { Tone } from "./Mark";

/** Asks the project grid to show one discipline, and takes the visitor there */
export function showDiscipline(c: Category) {
  window.dispatchEvent(new CustomEvent<Category>("work:filter", { detail: c }));
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
}

export const disciplineOrder: Category[] = ["branding", "info", "uxui", "data", "motion"];

/* ---------- Disciplines: one chip per discipline with its project count ---------- */

export function DisciplinesCard({
  label,
  title,
  names,
  counts,
}: {
  label: string;
  title: string;
  names: Record<Category, string>;
  counts: Record<Category, number>;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 p-6 sm:p-7">
      <div>
        <p className="t-label text-ink-2">{label}</p>
        <h2 className="t-card mt-1.5 max-w-[22ch]">
          <Tone text={title} />
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {disciplineOrder.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => showDiscipline(c)}
            disabled={!counts[c]}
            className="group chip h-9 gap-2 pr-1.5 pl-3 text-[14px] hover:bg-[rgba(29,29,31,0.09)] disabled:opacity-40"
          >
            <CategoryIcon
              category={c}
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-110"
            />
            {names[c]}
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-[12px] font-semibold tabular-nums shadow-[0_1px_2px_rgba(29,29,31,0.1)]">
              {counts[c]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Copy button that confirms itself ---------- */

export function CopyButton({ text, copied, className }: { text: string; copied: string; className: string }) {
  const { copy, done } = useCopy(text);
  return (
    <button type="button" onClick={copy} className={`btn relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? "done" : "text"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2"
        >
          <Icon name={done ? "check" : "copy"} className="h-4 w-4" />
          {done ? copied : text}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ---------- Instagram ---------- */

function InstagramGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramCard({
  href,
  handle,
  open,
  label,
  copied,
}: {
  href: string;
  handle: string;
  open: string;
  label: string;
  copied: string;
}) {
  const { copy, done } = useCopy(handle);
  return (
    <div className="flex h-full flex-col justify-between gap-4 p-5 sm:p-6">
      {/* Glyph on the left, copy button in the corner: nothing has to share a row on a narrow card */}
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[conic-gradient(from_210deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)] p-[2px]">
          <span className="grid h-full w-full place-items-center rounded-full bg-white text-ink">
            <InstagramGlyph className="h-[22px] w-[22px]" />
          </span>
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={done ? copied : handle}
          title={handle}
          className="btn btn-soft relative h-10 w-10 shrink-0 overflow-hidden px-0"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done ? "done" : "copy"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.35, ease }}
            >
              <Icon name={done ? "check" : "copy"} className="h-4 w-4" />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="min-w-0">
        <p className="t-label text-ink-2">{done ? copied : label}</p>
        <p className="t-card mt-0.5 truncate text-[clamp(17px,1.5vw,22px)]">{handle}</p>
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3 h-10 w-full px-4 text-[14px]">
          {open} <Icon name="external" className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

/* ---------- Tools: official logos; hovering one tells what it is used for ---------- */

type Tool = { key: string; name: string; logo: string };
const tools: Tool[] = [
  { key: "figma", name: "Figma", logo: "/tools/figma.svg" },
  { key: "illustrator", name: "Illustrator", logo: "/tools/illustrator.svg" },
  { key: "photoshop", name: "Photoshop", logo: "/tools/photoshop.svg" },
  { key: "indesign", name: "InDesign", logo: "/tools/indesign.svg" },
  { key: "aftereffects", name: "After Effects", logo: "/tools/aftereffects.svg" },
  { key: "davinci", name: "DaVinci Resolve", logo: "/tools/davinci.svg" },
];

export function ToolsCard({ label, title, items }: { label: string; title: string; items: Record<string, string> }) {
  const [active, setActive] = useState(tools[0]);
  return (
    <div className="flex h-full flex-col gap-6 p-6 sm:p-7">
      <div>
        <p className="t-label text-ink-2">{label}</p>
        <h2 className="t-card mt-1.5">
          <Tone text={title} />
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tools.map((t) => (
          <button
            key={t.key}
            type="button"
            onMouseEnter={() => setActive(t)}
            onFocus={() => setActive(t)}
            onClick={() => setActive(t)}
            aria-pressed={active.key === t.key}
            className={`group grid justify-items-center gap-2 rounded-[20px] px-2 py-4 transition-colors duration-500 ${
              active.key === t.key ? "bg-[rgba(29,29,31,0.05)]" : "hover:bg-[rgba(29,29,31,0.03)]"
            }`}
          >
            <Image
              src={t.logo}
              alt=""
              width={52}
              height={52}
              unoptimized
              className="h-[clamp(40px,4vw,52px)] w-[clamp(40px,4vw,52px)] object-contain drop-shadow-[0_6px_12px_rgba(29,29,31,0.16)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:-rotate-6"
            />
            <span className="t-small text-center font-medium leading-tight">{t.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-auto min-h-[3.2em]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease }}
            className="t-small text-ink-2"
          >
            <span className="font-semibold text-ink">{active.name}.</span> {items[active.key]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
