import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getProjects } from "@/lib/content";
import { categorySky, skyBackground } from "@/lib/skies";
import { PageTransition } from "@/components/PageTransition";
import { Tone } from "@/components/Mark";
import { FadeUp } from "@/components/amicro/fade-up";
import { ScrollReveal } from "@/components/amicro/scroll-reveal";
import { ProgressIndicator } from "@/components/amicro/progress-indicator";
import { AsciiImage } from "@/components/ascii/AsciiImage";
import { Icon } from "@/components/Icon";

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

  return (
    <PageTransition>
      <ProgressIndicator height={3} color="bg-ink" />
      <main className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:gap-7">
        <header className="board board-white">
          <FadeUp className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${lang}#work`}
              transitionTypes={["nav-back"]}
              className="chip t-label inline-flex h-10 items-center gap-1.5 rounded-full px-4 transition-colors duration-500 hover:bg-paper"
            >
              <Icon name="back" className="h-4 w-4" /> {dict.project.back}
            </Link>
            {project.categories.map((c) => (
              <span key={c} className="chip t-label inline-flex h-10 items-center gap-2 rounded-full px-4">
                <span aria-hidden className="h-3.5 w-3.5 rounded-[5px]" style={{ background: skyBackground(categorySky[c]) }} />
                {dict.work.filters[c]}
              </span>
            ))}
          </FadeUp>
          <FadeUp delay={0.15}>
            <h1 className="t-h1 mt-6 max-w-[22ch]">
              {project.title[lang]} <span className="tone">{project.tagline[lang]}</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.3} duration={1.2} className="mt-8 sm:mt-10">
            <div className="overflow-hidden rounded-[28px] bg-stone">
              <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
                <Image
                  src={project.cover.src}
                  alt={project.title[lang]}
                  width={project.cover.w}
                  height={project.cover.h}
                  sizes="(min-width: 1240px) 1130px, 100vw"
                  preload
                  className="max-h-[70svh] w-full object-cover"
                />
              </ViewTransition>
            </div>
          </FadeUp>
        </header>

        {paragraphs.length > 0 && (
          <section className="board">
            <div className="grid gap-6 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] md:gap-12">
              <ScrollReveal scale={1} yOffset={16}>
                <span className="t-label text-soft">{dict.project.about}</span>
              </ScrollReveal>
              <div className="grid gap-5">
                {paragraphs.map((p, i) => (
                  <ScrollReveal key={i} scale={1} yOffset={16}>
                    <p className="text-[clamp(20px,1.9vw,25px)] leading-[1.5] font-medium tracking-[-0.012em] text-pretty">
                      <Tone text={p} />
                    </p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.youtube && (
          <ScrollReveal scale={1} yOffset={18}>
            <section className="board board-white">
              <span className="t-label text-soft">{dict.project.video}</span>
              <div className="mt-5 overflow-hidden rounded-[24px] bg-stone">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${project.youtube}?rel=0&modestbranding=1&playsinline=1`}
                  title={`${dict.project.video}: ${project.title[lang]}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </section>
          </ScrollReveal>
        )}

        {project.gallery.length > 0 && (
          <section className="board board-white">
            <span className="t-label text-soft">{dict.project.gallery}</span>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {project.gallery.map((img, i) => {
                const wide = img.w / img.h > 1.5;
                return (
                  <ScrollReveal key={img.src} scale={1} yOffset={18} className={wide ? "sm:col-span-2" : ""}>
                    <div className="relative overflow-hidden rounded-[22px]" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
                      <AsciiImage
                        src={img.src}
                        alt={`${project.title[lang]} — ${i + 1}`}
                        sizes={wide ? "(min-width: 1240px) 1130px, 100vw" : "(min-width: 640px) 560px, 100vw"}
                        className="object-cover"
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        <ScrollReveal scale={1} yOffset={18}>
          <Link
            href={`/${lang}/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="board group grid items-center gap-6 transition-colors duration-500 hover:bg-[#e9e3dc] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-paper">
              <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
                <Image
                  src={next.cover.src}
                  alt={next.title[lang]}
                  fill
                  sizes="(min-width: 640px) 520px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </ViewTransition>
            </div>
            <div>
              <span className="t-label text-soft">{dict.project.next}</span>
              <p className="t-h2 mt-2">
                {next.title[lang]} <span className="tone">{next.tagline[lang]}</span>
              </p>
              <span className="pill-ink t-label mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 transition-transform duration-700 ease-out group-hover:translate-x-1">
                {dict.project.next} <Icon name="arrow" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </main>
    </PageTransition>
  );
}
