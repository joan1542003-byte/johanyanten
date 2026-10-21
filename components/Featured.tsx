"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/lib/motion";

export type FeaturedItem = { slug: string; title: string; src: string };

// Featured project frame; "another project" crossfades slowly to the next cover
export function Featured({
  lang,
  items,
  labels,
}: {
  lang: string;
  items: FeaturedItem[];
  labels: { view: string; next: string };
}) {
  const [index, setIndex] = useState(0);
  const current = items[index];
  if (!current) return null;

  return (
    <div>
      <div className="k-frame overflow-hidden rounded-[40px]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-[#fafafa]">
          <AnimatePresence initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease }}
              className="absolute inset-0"
            >
              <Image
                src={current.src}
                alt={current.title}
                fill
                preload={index === 0}
                sizes="(min-width: 920px) 840px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/${lang}/work/${current.slug}`}
          transitionTypes={["nav-forward"]}
          className="k-button inline-flex min-w-0 items-center gap-2 rounded-full px-5 py-3 font-medium"
        >
          <span aria-hidden>▶</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease }}
              className="truncate"
            >
              {labels.view}: {current.title}
            </motion.span>
          </AnimatePresence>
        </Link>
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="k-button inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium"
          >
            <span aria-hidden>↻</span> {labels.next}
          </button>
        )}
      </div>
    </div>
  );
}
