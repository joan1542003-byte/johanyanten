import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getProjects } from "@/lib/content";
import { PageTransition } from "@/components/PageTransition";
import { SectionLabel } from "@/components/Mark";
import { FadeUp } from "@/components/amicro/fade-up";
import { ScrollReveal } from "@/components/amicro/scroll-reveal";
import { StickyReveal } from "@/components/amicro/sticky-reveal";
import { ProgressIndicator } from "@/components/amicro/progress-indicator";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

async function getProject(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return { project: projects[index], next: projects[(index + 1) % projects.length] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = (await getProject(slug))?.project;
  if (!project || !hasLocale(lang)) return {};
  return {
    title: project.title[lang],
    description: project.description[0]?.[lang],
    alternates: {
      canonical: `/${lang}/work/${slug}`,
      languages: { es: `/es/work/${slug}`, en: `/en/work/${slug}` },
    },
    openGraph: { type: "article", images: [project.cover.src] },
    twitter: { card: "summary_large_image", images: [project.cover.src] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  const found = await getProject(slug);
  if (!hasLocale(lang) || !found) notFound();
  const { project, next } = found;
  const dict = await getDictionary(lang);

  const paragraphs = project.description.map((p) => p[lang]).filter((p) => p.trim());
  const gallery = project.gallery;
  // Paragraphs pair with gallery images in the sticky section; any extra ones go above it
  const intro = gallery.length ? paragraphs.slice(gallery.length) : paragraphs;
  const steps = gallery.map((img, i) => ({
    title: `${String(i + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`,
    description: paragraphs[i] ?? "",
    content: (
      <div className="k-frame overflow-hidden rounded-[32px]">
        <Image
          src={img.src}
          alt={`${project.title[lang]} — ${i + 1}`}
          width={img.w}
          height={img.h}
          sizes="(min-width: 768px) 520px, 100vw"
          className="max-h-[62vh] w-auto rounded-[24px] object-contain"
        />
      </div>
    ),
  }));

  return (
    <PageTransition>
      <ProgressIndicator height={3} color="k-gradient" />
      <main className="px-6 pt-10 pb-6 sm:px-12 sm:pt-12">
        <Link
          href={`/${lang}#work`}
          transitionTypes={["nav-back"]}
          className="k-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          ← {dict.project.back}
        </Link>

        <FadeUp className="mt-8">
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((c) => (
              <span key={c} className="k-tag rounded-lg px-2.5 py-1 text-xs font-medium text-ink/70">
                {dict.work.filters[c]}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.03em] text-balance">
            {project.title[lang]} <span className="text-muted">{project.tagline[lang]}</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-10">
          <div className="k-frame overflow-hidden rounded-[40px]">
            <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
              <Image
                src={project.cover.src}
                alt={project.title[lang]}
                width={project.cover.w}
                height={project.cover.h}
                sizes="(min-width: 920px) 840px, 100vw"
                preload
                className="max-h-[75svh] w-full rounded-[32px] object-cover"
              />
            </ViewTransition>
          </div>
        </FadeUp>

        {intro.length > 0 && (
          <section className="mt-16">
            <SectionLabel>{dict.project.about}</SectionLabel>
            {intro.map((p, i) => (
              <ScrollReveal key={i} scale={1} yOffset={16}>
                <p className="mt-5 text-[clamp(1.1rem,2vw,1.4rem)] leading-[1.6] font-medium tracking-[-0.015em]">{p}</p>
              </ScrollReveal>
            ))}
          </section>
        )}

        {project.youtube && (
          <ScrollReveal scale={1} yOffset={16} className="mt-16">
            <div className="k-frame overflow-hidden rounded-[40px]">
              <iframe
                className="aspect-video w-full rounded-[32px]"
                src={`https://www.youtube-nocookie.com/embed/${project.youtube}?rel=0&modestbranding=1&playsinline=1`}
                title={`${dict.project.video}: ${project.title[lang]}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        )}

        {steps.length > 0 && (
          <section className="mt-16">
            <SectionLabel>{dict.project.gallery}</SectionLabel>
            <StickyReveal
              content={steps}
              className="text-[clamp(1.05rem,1.8vw,1.25rem)] font-medium tracking-[-0.01em]"
            />
          </section>
        )}

        <ScrollReveal scale={1} yOffset={16} className="mt-16">
          <SectionLabel>{dict.project.next}</SectionLabel>
          <Link
            href={`/${lang}/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="k-button group flex items-center gap-5 rounded-[32px] p-2 pr-6"
          >
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-[26px] sm:h-28 sm:w-44">
              <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
                <Image
                  src={next.cover.src}
                  alt={next.title[lang]}
                  fill
                  sizes="176px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </ViewTransition>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold tracking-[-0.02em]">{next.title[lang]}</p>
              <p className="truncate text-muted">{next.tagline[lang]}</p>
            </div>
            <span aria-hidden className="text-xl transition-transform duration-200 ease-out group-hover:translate-x-1">
              →
            </span>
          </Link>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
}
