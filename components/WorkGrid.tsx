"use client";

import { ViewTransition, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Img } from "@/lib/content";
import { boxes, coverSizes } from "@/lib/images";
import { calm, ease } from "@/lib/motion";
import { Card } from "./Card";
import { CategoryIcon } from "./CategoryIcon";
import { ArrowBadge, Icon } from "./Icon";
import { Tone } from "./Mark";
import { Photo } from "./Photo";

export type CardData = {
  slug: string;
  title: string;
  tagline: string;
  categories: Category[];
  isNew?: boolean;
  /** The image that represents the project (see displayImage) */
  image: Img;
  /** The project's own color as "r g b" */
  tint: string | null;
};

type Labels = { title: string; new: string; view: string; filters: Record<"all" | Category, string> };
type Props = { lang: string; projects: CardData[]; featured: string; labels: Labels };

type Filter = "all" | Category;
const filterOrder: Filter[] = ["all", "branding", "info", "uxui", "data", "motion"];

// Bento rhythm: big, two small, three wide. Six pieces fill three rows of four columns exactly
type Size = "big" | "small" | "wide";
const rhythm: Size[] = ["big", "small", "small", "wide", "wide", "wide"];
const spans: Record<Size, string> = {
  big: "h-[380px] sm:h-auto sm:row-span-2",
  small: "h-[300px] sm:h-auto sm:col-span-1",
  wide: "h-[300px] sm:h-auto",
};

export function WorkGrid({ lang, projects, featured, labels }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  // The featured project already leads the page; the full list skips it, a filtered one includes it
  const visible = filter === "all" ? projects.filter((p) => p.slug !== featured) : projects.filter((p) => p.categories.includes(filter));
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
        <h2 className="t-title max-w-[22ch]">
          <Tone text={labels.title} />
        </h2>
        <nav
          aria-label={labels.filters.all}
          className="-mx-1 flex max-w-[calc(100%+8px)] gap-1 overflow-x-auto rounded-full bg-[rgba(29,29,31,0.05)] p-1 [scrollbar-width:none]"
        >
          {available.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-medium transition-colors duration-500 ${
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
              {f !== "all" && <CategoryIcon category={f} className="relative h-4 w-4" />}
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
                <ProjectCard lang={lang} project={p} size={size} labels={labels} delay={0.08 * (i % 4)} morph={p.slug !== featured} />
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
  size,
  labels,
  delay,
  morph,
}: {
  lang: string;
  project: CardData;
  size: Size;
  labels: Labels;
  delay: number;
  /** Off for the featured project when a filter shows it: its card at the top already carries the morph */
  morph: boolean;
}) {
  const big = size === "big";
  const image = (
    <div className="zoom absolute -inset-3">
      <Photo src={project.image.src} alt="" sizes={coverSizes(project.image, boxes[size])} fade={false} />
    </div>
  );
  return (
    <Card
      href={`/${lang}/work/${project.slug}`}
      label={project.title}
      transitionTypes={["nav-forward"]}
      delay={delay}
      tint={project.tint ?? undefined}
      className="group h-full"
    >
      {morph ? (
        <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
          {image}
        </ViewTransition>
      ) : (
        image
      )}
      <div className="shade absolute inset-0" />

      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 pr-16">
        {project.categories.map((c) => (
          <span key={c} className="chip chip-glass h-7 gap-1.5 px-2.5 text-[12px]">
            <CategoryIcon category={c} className="h-3.5 w-3.5" />
            {labels.filters[c]}
          </span>
        ))}
        {project.isNew && <span className="chip h-7 bg-ink px-2.5 text-[12px] text-white">{labels.new}</span>}
      </div>
      <ArrowBadge className="absolute top-4 right-4" />

      <span className="follow chip h-10 gap-2 bg-white px-4 text-[14px] text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]">
        {labels.view} <Icon name="arrow" className="h-4 w-4" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <h3 className={`t-card ${big ? "max-w-[16ch] text-[clamp(28px,2.7vw,40px)]" : "text-[clamp(21px,1.7vw,24px)]"}`}>{project.title}</h3>
        <p className="t-small mt-1.5 text-white/80">{project.tagline}</p>
      </div>
    </Card>
  );
}
