"use client";

import { ViewTransition, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Img } from "@/lib/content";
import { calm, ease } from "@/lib/motion";
import { categorySky, skyBackground } from "@/lib/skies";
import { Card } from "./Card";
import { ArrowBadge } from "./Icon";
import { Tone } from "./Mark";
import { Photo } from "./Photo";

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
  labels: { title: string; new: string; filters: Record<"all" | Category, string> };
};

type Filter = "all" | Category;
const filterOrder: Filter[] = ["all", "branding", "info", "uxui", "data", "motion"];

// Bento rhythm for the full list: big, two small, wide, wide, big, wide. Seven pieces fill four rows exactly
type Size = "big" | "small" | "wide";
const rhythm: Size[] = ["big", "small", "small", "wide", "wide", "big", "wide"];
const spans: Record<Size, string> = {
  big: "h-[360px] sm:h-auto sm:row-span-2",
  small: "h-[300px] sm:h-auto sm:col-span-1",
  wide: "h-[300px] sm:h-auto",
};

export function WorkGrid({ lang, projects, labels }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const available = filterOrder.filter((f) => f === "all" || projects.some((p) => p.categories.includes(f)));

  // The discipline chips at the top of the page pick a filter from afar
  useEffect(() => {
    const onPick = (e: Event) => setFilter((e as CustomEvent<Category>).detail);
    window.addEventListener("work:filter", onPick);
    return () => window.removeEventListener("work:filter", onPick);
  }, []);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
        <h2 className="t-title max-w-[18ch]">
          <Tone text={labels.title} />
        </h2>
        <nav aria-label={labels.filters.all} className="-mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full bg-[rgba(29,29,31,0.05)] p-1 [scrollbar-width:none]">
          {available.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-medium transition-colors duration-500 ${
                filter === f ? "text-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="work-filter"
                  transition={calm}
                  className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(29,29,31,0.12),0_4px_12px_-4px_rgba(29,29,31,0.12)]"
                />
              )}
              {f !== "all" && (
                <span aria-hidden className="relative h-2.5 w-2.5 rounded-full" style={{ background: skyBackground(categorySky[f]) }} />
              )}
              <span className="relative">{labels.filters[f]}</span>
            </button>
          ))}
        </nav>
      </div>

      <motion.div layout transition={calm} className="bento">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => {
            const size: Size = filter === "all" ? rhythm[i % rhythm.length] : "wide";
            return (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease, delay: 0.06 * (i % 4) } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4, ease } }}
                transition={calm}
                className={`col-span-2 ${spans[size]}`}
              >
                <ProjectCard lang={lang} project={p} big={size === "big"} labels={labels} delay={0.08 * (i % 4)} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ProjectCard({
  lang,
  project,
  big,
  labels,
  delay,
}: {
  lang: string;
  project: CardData;
  big: boolean;
  labels: Props["labels"];
  delay: number;
}) {
  return (
    <Card
      href={`/${lang}/work/${project.slug}`}
      label={project.title}
      transitionTypes={["nav-forward"]}
      delay={delay}
      className="group h-full"
    >
      <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
        <div className="zoom absolute inset-0">
          <Photo src={project.cover.src} alt="" sizes={big ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"} />
        </div>
      </ViewTransition>
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 pr-16">
        {project.categories.map((c) => (
          <span key={c} className="chip chip-glass h-7 px-2.5 text-[12px]">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: skyBackground(categorySky[c]) }} />
            {labels.filters[c]}
          </span>
        ))}
        {project.isNew && <span className="chip h-7 bg-ink px-2.5 text-[12px] text-white">{labels.new}</span>}
      </div>
      <ArrowBadge className="absolute top-4 right-4" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <h3
          className={`font-semibold tracking-[-0.025em] ${
            big ? "max-w-[18ch] text-[clamp(24px,2.3vw,34px)] leading-[1.05]" : "text-[clamp(19px,1.6vw,22px)] leading-[1.15]"
          }`}
        >
          {project.title}
        </h3>
        <p className="t-small mt-1 text-white/75">{project.tagline}</p>
      </div>
    </Card>
  );
}
