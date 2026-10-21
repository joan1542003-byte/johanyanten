import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getProjects } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { PageTransition } from "@/components/PageTransition";
import { PixelImage } from "@/components/PixelImage";
import { CategoryChip } from "@/components/Chip";
import { Emphasis } from "@/components/Emphasis";

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
    title: `${project.title[lang]} — Johan Yanten`,
    description: project.description[0]?.[lang],
    openGraph: { images: [project.cover.src] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  const found = await getProject(slug);
  if (!hasLocale(lang) || !found) notFound();
  const { project, next } = found;
  const dict = await getDictionary(lang);


  return (
    <PageTransition>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-28 pb-16">
        <Link
          href={`/${lang}#work`}
          transitionTypes={["nav-back"]}
          className="raised inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-transform hover:-translate-x-0.5 active:scale-95"
        >
          ← {dict.project.back}
        </Link>

        <Reveal className="mt-10">
          <div className="flex flex-wrap gap-2">
            {project.categories.map((c) => (
              <CategoryChip key={c} category={c} label={dict.work.filters[c]} size="sm" />
            ))}
          </div>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.045em] text-balance sm:text-7xl">
            <Emphasis text={project.title[lang]} />
          </h1>
          <p className="mt-3 text-lg text-muted">{project.tagline[lang]}</p>
        </Reveal>

        <div className="raised mt-10 overflow-hidden rounded-[32px] p-2">
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <Image
              src={project.cover.src}
              alt={project.title[lang]}
              width={project.cover.w}
              height={project.cover.h}
              sizes="(min-width: 1024px) 1024px, 100vw"
              preload
              className="max-h-[80svh] w-full rounded-[26px] object-cover"
            />
          </ViewTransition>
        </div>

        <section className="mt-16 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <Reveal>
            <h2 className="text-sm font-medium text-muted">{dict.project.about}</h2>
          </Reveal>
          <div className="space-y-5">
            {project.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-xl leading-relaxed text-pretty">{p[lang]}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {project.youtube && (
          <Reveal className="mt-16">
            <div className="raised overflow-hidden rounded-[32px] p-2">
              <iframe
                className="aspect-video w-full rounded-[26px]"
                src={`https://www.youtube-nocookie.com/embed/${project.youtube}?rel=0&modestbranding=1&playsinline=1`}
                title={`${dict.project.video}: ${project.title[lang]}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Reveal>
        )}

        {project.gallery.length > 0 && (
          <section className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-5" aria-label={dict.project.gallery}>
            {project.gallery.map((img, i) => {
              const wide = img.w / img.h > 1.5;
              return (
                <Reveal key={img.src} delay={(i % 2) * 0.08} className={wide ? "sm:col-span-2" : ""}>
                  <div className="raised rounded-[28px] p-2">
                    <div className="relative overflow-hidden rounded-[22px]" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
                      <PixelImage
                        src={img.src}
                        alt={`${project.title[lang]} — ${i + 1}`}
                        sizes={wide ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </section>
        )}

        <Reveal className="mt-24">
          <Link
            href={`/${lang}/work/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="raised group flex items-center gap-5 rounded-[28px] p-2 pr-6 transition-shadow hover:shadow-[var(--raised-shadow-hover)]"
          >
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-[22px] sm:h-28 sm:w-44">
              <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
                <Image
                  src={next.cover.src}
                  alt={next.title[lang]}
                  fill
                  sizes="176px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </ViewTransition>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted">{dict.project.next}</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">{next.title[lang]}</p>
            </div>
            <span className="mesh flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </main>
    </PageTransition>
  );
}
