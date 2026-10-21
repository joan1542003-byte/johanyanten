"use client";

import { ViewTransition, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Img } from "@/lib/projects";
import { useTilt } from "./useTilt";

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
  labels: { new: string; filters: Record<"all" | Category, string> };
};

const filterOrder = ["all", "branding", "info", "uxui", "data", "motion"] as const;

export function WorkGrid({ lang, projects, labels }: Props) {
  const [filter, setFilter] = useState<(typeof filterOrder)[number]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <>
      <div className="mb-10 flex justify-center">
        <div className="glass flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5 text-sm [scrollbar-width:none]">
          {filterOrder.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative shrink-0 rounded-full px-4 py-2 transition-colors ${
                filter === f ? "text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{labels.filters[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard lang={lang} project={p} newLabel={labels.new} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function ProjectCard({ lang, project, newLabel }: { lang: string; project: CardData; newLabel: string }) {
  const tilt = useTilt(4);

  return (
    <Link href={`/${lang}/work/${project.slug}`} transitionTypes={["nav-forward"]} className="group block">
      <motion.article
        {...tilt.handlers}
        style={tilt.style}
        whileTap={{ scale: 0.98 }}
        className="glass relative overflow-hidden rounded-[2rem] p-2.5"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-white/40">
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <Image
              src={project.cover.src}
              alt={project.title}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </ViewTransition>
          {project.isNew && (
            <span className="glass absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium">
              {newLabel}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-4 px-3 pt-4 pb-2">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-0.5 text-sm text-muted">{project.tagline}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
            →
          </span>
        </div>
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: tilt.shine }} />
      </motion.article>
    </Link>
  );
}
