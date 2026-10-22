"use client";

import { ViewTransition, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Img } from "@/lib/content";
import { calm, ease } from "@/lib/motion";
import { categorySky, skyBackground } from "@/lib/skies";
import { Head } from "./Mark";
import { Icon } from "./Icon";
import { AsciiImage } from "./ascii/AsciiImage";

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

const filterOrder = ["all", "branding", "info", "uxui", "data", "motion"] as const;

// Bento rhythm: one wide piece, then two side by side, and again
const isWide = (i: number) => i % 3 === 0;

export function WorkGrid({ lang, projects, labels }: Props) {
  const [filter, setFilter] = useState<(typeof filterOrder)[number]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const available = filterOrder.filter((f) => f === "all" || projects.some((p) => p.categories.includes(f)));

  return (
    <>
      <Head title={labels.title}>
        <nav aria-label={labels.filters.all} className="flex flex-wrap gap-x-6 gap-y-2">
          {available.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`relative inline-flex items-center gap-2 pb-1.5 text-[16px] font-semibold transition-colors duration-500 ${
                filter === f ? "text-ink" : "text-ink/45 hover:text-ink/80"
              }`}
            >
              {f !== "all" && (
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: skyBackground(categorySky[f]) }} />
              )}
              {labels.filters[f]}
              {filter === f && (
                <motion.span layoutId="filter-line" transition={calm} className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-ink" />
              )}
            </button>
          ))}
        </nav>
      </Head>

      <motion.div layout transition={calm} className="grid gap-x-6 gap-y-14 sm:grid-cols-2 sm:gap-y-20">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.08 * (i % 3) } }}
              exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
              transition={calm}
              className={isWide(i) ? "sm:col-span-2" : ""}
            >
              <ProjectCard lang={lang} project={p} wide={isWide(i)} labels={labels} />
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
  wide,
  labels,
}: {
  lang: string;
  project: CardData;
  wide: boolean;
  labels: Props["labels"];
}) {
  return (
    <Link href={`/${lang}/work/${project.slug}`} transitionTypes={["nav-forward"]} className="group block">
      <div className={`relative overflow-hidden rounded-[22px] ${wide ? "aspect-[4/3] sm:aspect-[2.2/1]" : "aspect-[4/3]"}`}>
        <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
            <AsciiImage
              src={project.cover.src}
              alt={project.title}
              preload={wide}
              sizes={wide ? "(min-width: 1240px) 1160px, 100vw" : "(min-width: 640px) 580px, 100vw"}
              className="object-cover"
            />
          </div>
        </ViewTransition>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <div>
          <h3 className={`flex items-center gap-2 font-semibold tracking-[-0.02em] ${wide ? "text-[clamp(22px,2vw,28px)]" : "text-[21px]"}`}>
            {project.title}
            <Icon
              name="arrow"
              className="h-5 w-5 -translate-x-2 opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            />
          </h3>
          <p className="t-small mt-1 text-soft">{project.tagline}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-[14px] font-semibold text-ink/55">
          {project.isNew && <span className="text-ink">{labels.new}</span>}
          {project.categories.map((c) => (
            <span key={c} className="hidden items-center gap-1.5 sm:inline-flex">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: skyBackground(categorySky[c]) }} />
              {labels.filters[c]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
