"use client";

import { ViewTransition, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Category, Img } from "@/lib/content";
import { calm } from "@/lib/motion";
import { CardHover } from "./amicro/card-hover";
import { FadeUp } from "./amicro/fade-up";
import { ScrollReveal } from "./amicro/scroll-reveal";
import { Skeleton } from "./amicro/skeleton";
import { Mark, SectionLabel } from "./Mark";

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
      <SectionLabel>{labels.eyebrow}</SectionLabel>
      <ScrollReveal scale={1} yOffset={16}>
        <h2 className="text-[clamp(1.6rem,3.4vw,2.25rem)] leading-snug font-bold tracking-[-0.025em]">
          <Mark text={labels.title} />
        </h2>
      </ScrollReveal>

      <div className="k-well mt-8 inline-flex max-w-full flex-wrap gap-1 rounded-[22px] p-1.5">
        {available.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f ? "text-ink" : "text-ink/55 hover:text-ink"
            }`}
          >
            {filter === f && (
              <motion.span layoutId="filter-pill" transition={calm} className="k-button absolute inset-0 rounded-full" />
            )}
            <span className="relative">{labels.filters[f]}</span>
          </button>
        ))}
      </div>

      <FadeUp key={filter} yOffset={12} duration={0.8} className="mt-8">
        <CardHover
          items={visible}
          getKey={(p) => p.slug}
          getHref={(p) => `/${lang}/work/${p.slug}`}
          highlightClassName="bg-black/[0.035]"
          className="-mx-2 gap-2 sm:grid-cols-2"
          renderItem={(p) => <ProjectCard project={p} newLabel={labels.new} />}
        />
      </FadeUp>
    </>
  );
}

function ProjectCard({ project, newLabel }: { project: CardData; newLabel: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article className="pb-3">
      <div className="k-frame overflow-hidden rounded-[36px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
          {!loaded && <Skeleton shimmerColor="light" className="absolute inset-0 !rounded-none" />}
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <Image
              src={project.cover.src}
              alt={project.title}
              fill
              sizes="(min-width: 640px) 440px, 100vw"
              onLoad={() => setLoaded(true)}
              className={`object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </ViewTransition>
        </div>
      </div>
      <div className="px-2 pt-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg leading-snug font-bold tracking-[-0.015em]">{project.title}</h3>
          {project.isNew && (
            <span className="k-tag shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium text-ink/70">{newLabel}</span>
          )}
        </div>
        <p className="mt-1 text-[15px] text-muted">{project.tagline}</p>
      </div>
    </article>
  );
}
