"use client";

import { ViewTransition, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Img } from "@/lib/content";
import { calm, ease } from "@/lib/motion";
import { categorySky, skyBackground } from "@/lib/skies";
import { Head } from "./Mark";

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
              className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
                filter === f ? "text-white" : "chip text-ink hover:bg-paper"
              }`}
            >
              {filter === f && (
                <motion.span layoutId="filter-pill" transition={calm} className="absolute inset-0 rounded-full bg-ink" />
              )}
              {f !== "all" && (
                <span
                  aria-hidden
                  className="relative h-3 w-3 rounded-[4px]"
                  style={{ background: skyBackground(categorySky[f]) }}
                />
              )}
              <span className="relative">{labels.filters[f]}</span>
            </button>
          ))}
        </div>
      </Head>

      <motion.div layout className="grid gap-x-5 gap-y-9 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.8, ease }}
              className={i === 0 ? "sm:col-span-2" : ""}
            >
              <ProjectCard lang={lang} project={p} wide={i === 0} labels={labels} />
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
        className={`relative overflow-hidden rounded-[28px] bg-stone shadow-[0_1px_2px_rgba(30,22,12,0.05)] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)] ${
          wide ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
          <Image
            src={project.cover.src}
            alt={project.title}
            fill
            preload={wide}
            sizes={wide ? "(min-width: 1240px) 1130px, 100vw" : "(min-width: 640px) 560px, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </ViewTransition>
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {project.categories.map((c) => (
            <span key={c} className="cap">
              <span aria-hidden className="h-2.5 w-2.5 rounded-[3px]" style={{ background: skyBackground(categorySky[c]) }} />
              {labels.filters[c]}
            </span>
          ))}
        </div>
        {project.isNew && <span className="cap absolute top-3 left-3 !bg-ink !text-white">{labels.new}</span>}
      </div>
      <div className="flex items-start justify-between gap-4 px-1.5 pt-4">
        <div>
          <h3 className="text-lg leading-snug font-semibold">{project.title}</h3>
          <p className="mt-0.5 text-[15px] text-soft">{project.tagline}</p>
        </div>
        <span
          aria-hidden
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_2px_rgba(30,22,12,0.1)] transition-[transform,background-color,color] duration-500 group-hover:bg-ink group-hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
