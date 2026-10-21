"use client";

import { ViewTransition, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import type { Category, Img } from "@/lib/content";
import { CategoryChip } from "./Chip";
import { PixelImage } from "./PixelImage";
import { Reveal } from "./Reveal";
import { Emphasis } from "./Emphasis";

export type CardData = {
  slug: string;
  title: string;
  tagline: string;
  categories: Category[];
  isNew?: boolean;
  cover: Img;
};

type Props = {
  lang: string;
  projects: CardData[];
  labels: { eyebrow: string; title: string; new: string; view: string; filters: Record<"all" | Category, string> };
};

const filterOrder = ["all", "branding", "info", "uxui", "data", "motion"] as const;

// Bento rhythm on a 6-column grid: wide+narrow, narrow+wide, half+half, full
const bento = [
  "sm:col-span-4 aspect-[16/11]",
  "sm:col-span-2 aspect-[4/5] sm:aspect-auto",
  "sm:col-span-2 aspect-[4/5] sm:aspect-auto",
  "sm:col-span-4 aspect-[16/11]",
  "sm:col-span-3 aspect-[4/3]",
  "sm:col-span-3 aspect-[4/3]",
  "sm:col-span-6 aspect-[16/9] sm:aspect-[21/9]",
];

export function WorkGrid({ lang, projects, labels }: Props) {
  const [filter, setFilter] = useState<(typeof filterOrder)[number]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const count = (f: (typeof filterOrder)[number]) =>
    f === "all" ? projects.length : projects.filter((p) => p.categories.includes(f)).length;

  return (
    <>
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
        <div>
          <p className="text-sm font-medium text-muted">{labels.eyebrow}</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            <Emphasis text={labels.title} />
          </h2>
        </div>
        <div className="well -mx-1 flex max-w-full gap-0.5 overflow-x-auto rounded-full p-1 text-sm [scrollbar-width:none]">
          {filterOrder
            .filter((f) => count(f) > 0)
            .map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative shrink-0 rounded-full px-3.5 py-1.5 transition-colors ${
                  filter === f ? "text-ink" : "text-ink/55 hover:text-ink"
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    className="raised absolute inset-0 rounded-full"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {labels.filters[f]}
                  <span className={`ml-1.5 tabular-nums ${filter === f ? "text-accent" : "text-ink/35"}`}>{count(f)}</span>
                </span>
              </button>
            ))}
        </div>
      </Reveal>

      <motion.div layout className="grid grid-flow-dense gap-4 sm:grid-cols-6 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`col-span-1 ${bento[i % bento.length].split(" ").filter((c) => c.startsWith("sm:col")).join(" ")}`}
            >
              <ProjectCard
                lang={lang}
                project={p}
                frame={bento[i % bento.length]}
                labels={labels}
                preload={i < 2}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ProjectCard({
  lang,
  project,
  frame,
  labels,
  preload,
}: {
  lang: string;
  project: CardData;
  frame: string;
  labels: Props["labels"];
  preload: boolean;
}) {
  // A "view" pill that trails the pointer over the image
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const x = useSpring(cx, { stiffness: 350, damping: 30 });
  const y = useSpring(cy, { stiffness: 350, damping: 30 });
  const [hover, setHover] = useState(false);
  const aspect = frame.split(" ").filter((c) => !c.startsWith("sm:col")).join(" ");

  return (
    <Link href={`/${lang}/work/${project.slug}`} transitionTypes={["nav-forward"]} className="group block h-full">
      <motion.article
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="raised @container flex h-full flex-col rounded-[28px] p-2 transition-shadow duration-300 hover:shadow-[var(--raised-shadow-hover)]"
      >
        <div
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            cx.set(e.clientX - r.left);
            cy.set(e.clientY - r.top);
          }}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
          onPointerLeave={() => setHover(false)}
          className={`relative min-h-[220px] flex-1 overflow-hidden rounded-[22px] ${aspect}`}
        >
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <PixelImage
                src={project.cover.src}
                alt={project.title}
                sizes="(min-width: 640px) 66vw, 100vw"
                preload={preload}
                className="object-cover"
              />
            </div>
          </ViewTransition>
          {project.isNew && (
            <span className="raised absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {labels.new}
            </span>
          )}
          <AnimatePresence>
            {hover && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                style={{ x, y }}
                className="pointer-events-none absolute top-0 left-0 -mt-5 -ml-14 rounded-full bg-ink/90 px-4 py-2 text-sm font-medium whitespace-nowrap text-white backdrop-blur"
              >
                {labels.view} →
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-2.5 px-2.5 pt-3.5 pb-2 @md:flex-row @md:items-start @md:justify-between @md:gap-3">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-0.5 text-sm text-muted">{project.tagline}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5 @md:justify-end">
            {project.categories.slice(0, 2).map((c) => (
              <CategoryChip key={c} category={c} label={labels.filters[c]} size="sm" />
            ))}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
