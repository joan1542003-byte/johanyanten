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
  labels: { eyebrow: string; title: string; new: string; filters: Record<"all" | Category, string> };
};

const filterOrder = ["all", "branding", "info", "uxui", "data", "motion"] as const;

// Bento rhythm: one wide card, then two side by side, and again
const isWide = (i: number) => i % 3 === 0;

export function WorkGrid({ lang, projects, labels }: Props) {
  const [filter, setFilter] = useState<(typeof filterOrder)[number]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));
  const available = filterOrder.filter((f) => f === "all" || projects.some((p) => p.categories.includes(f)));

  return (
    <>
      <Head eyebrow={labels.eyebrow} title={labels.title}>
        <div className="flex flex-wrap gap-1.5">
          {available.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`t-label relative inline-flex h-10 items-center gap-2 rounded-full px-4 transition-colors duration-500 ${
                filter === f ? "text-white" : "chip text-ink hover:bg-paper"
              }`}
            >
              {filter === f && <motion.span layoutId="filter-pill" transition={calm} className="pill-ink absolute inset-0 rounded-full" />}
              {f !== "all" && (
                <span aria-hidden className="relative h-3.5 w-3.5 rounded-[5px]" style={{ background: skyBackground(categorySky[f]) }} />
              )}
              <span className="relative">{labels.filters[f]}</span>
            </button>
          ))}
        </div>
      </Head>

      <motion.div layout transition={calm} className="grid gap-x-5 gap-y-10 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.08 * (i % 3) } }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.5, ease } }}
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
      <div
        className={`relative overflow-hidden rounded-[28px] shadow-[0_1px_2px_rgba(30,22,12,0.06)] transition-[transform,box-shadow] duration-700 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)] ${
          wide ? "aspect-[4/3] sm:aspect-[2.2/1]" : "aspect-[4/3]"
        }`}
      >
        <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]">
            <AsciiImage
              src={project.cover.src}
              alt={project.title}
              preload={wide}
              sizes={wide ? "(min-width: 1240px) 1130px, 100vw" : "(min-width: 640px) 560px, 100vw"}
              className="object-cover"
            />
          </div>
        </ViewTransition>
        <div className="absolute inset-x-3.5 bottom-3.5 flex flex-wrap gap-1.5">
          {project.categories.map((c) => (
            <span key={c} className="cap">
              <span aria-hidden className="h-3 w-3 rounded-[4px]" style={{ background: skyBackground(categorySky[c]) }} />
              {labels.filters[c]}
            </span>
          ))}
        </div>
        {project.isNew && (
          <span className="cap absolute top-3.5 left-3.5 !text-white" style={{ background: "linear-gradient(180deg,#34312e,#141312)" }}>
            {labels.new}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 px-1.5 pt-5">
        <div>
          <h3 className={`leading-snug font-semibold tracking-[-0.02em] ${wide ? "text-[clamp(21px,1.9vw,26px)]" : "text-[20px]"}`}>
            {project.title}
          </h3>
          <p className="t-small mt-1 text-soft">{project.tagline}</p>
        </div>
        <span
          aria-hidden
          className="card mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[transform,background,color] duration-700 ease-out group-hover:translate-x-1 group-hover:[background:linear-gradient(180deg,#34312e,#141312)] group-hover:text-white"
        >
          <Icon name="arrow" />
        </span>
      </div>
    </Link>
  );
}
