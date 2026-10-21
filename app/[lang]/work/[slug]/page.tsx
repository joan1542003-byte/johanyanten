import { ViewTransition } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getProjects } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { PageTransition } from "@/components/PageTransition";

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
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-transform hover:-translate-x-0.5"
        >
          ← {dict.project.back}
        </Link>

        <Reveal className="mt-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{project.tagline[lang]}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {project.title[lang]}
          </h1>
        </Reveal>

        <div className="glass mt-10 overflow-hidden rounded-[2.5rem] p-2.5">
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <Image
              src={project.cover.src}
              alt={project.title[lang]}
              width={project.cover.w}
              height={project.cover.h}
              sizes="(min-width: 1024px) 1024px, 100vw"
              preload
              className="max-h-[80svh] w-full rounded-[2rem] object-cover"
            />
          </ViewTransition>
        </div>

        <section className="mt-16 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
          <Reveal>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted">{dict.project.about}</h2>
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
            <div className="glass overflow-hidden rounded-[2.5rem] p-2.5">
              <iframe
                className="aspect-video w-full rounded-[2rem]"
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
          <section className="mt-16 grid gap-5 sm:grid-cols-2" aria-label={dict.project.gallery}>
            {project.gallery.map((img, i) => {
              const wide = img.w / img.h > 1.5;
              return (
                <Reveal key={img.src} delay={(i % 2) * 0.08} className={wide ? "sm:col-span-2" : ""}>
                  <div className="glass overflow-hidden rounded-[2rem] p-2">
                    <Image
                      src={img.src}
                      alt={`${project.title[lang]} — ${i + 1}`}
                      width={img.w}
                      height={img.h}
                      sizes={wide ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                      className="w-full rounded-[1.6rem]"
                    />
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
            className="glass group flex items-center gap-5 rounded-[2rem] p-2.5 pr-6"
          >
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-[1.5rem] sm:h-28 sm:w-44">
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
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{dict.project.next}</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">{next.title[lang]}</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </main>
    </PageTransition>
  );
}
