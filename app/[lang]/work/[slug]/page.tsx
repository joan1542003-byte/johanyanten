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
      <ProgressIndicator height={2} color="bg-ink" />
      <main>
        <header className="wrap pt-32 sm:pt-40">
          <FadeUp className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-semibold">
            <Link
              href={`/${lang}#work`}
              transitionTypes={["nav-back"]}
              className="group inline-flex items-center gap-1.5 text-ink"
            >
              <Icon name="back" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" />
              {dict.project.back}
            </Link>
            {project.categories.map((c) => (
              <span key={c} className="inline-flex items-center gap-2 text-ink/55">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: skyBackground(categorySky[c]) }} />
                {dict.work.filters[c]}
              </span>
            ))}
          </FadeUp>
          <FadeUp delay={0.15}>
            <h1 className="t-h1 mt-8 max-w-[20ch]">
              {project.title[lang]} <span className="text-mute">{project.tagline[lang]}</span>
            </h1>
          </FadeUp>
        </header>

        <FadeUp delay={0.3} duration={1.2} className="wrap mt-12 sm:mt-16">
          <div className="overflow-hidden rounded-[24px]">
            <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
              <Image
                src={project.cover.src}
                alt={project.title[lang]}
                width={project.cover.w}
                height={project.cover.h}
                sizes="(min-width: 1240px) 1160px, 100vw"
                preload
                className="max-h-[72svh] w-full object-cover"
              />
            </ViewTransition>
          </div>
        </FadeUp>

        {paragraphs.length > 0 && (
          <section className="section wrap">
            <div className="grid gap-6 md:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] md:gap-16">
              <ScrollReveal scale={1} yOffset={16}>
                <h2 className="text-[19px] font-semibold tracking-[-0.015em]">{dict.project.about}</h2>
              </ScrollReveal>
              <div className="grid gap-6">
                {paragraphs.map((p, i) => (
                  <ScrollReveal key={i} scale={1} yOffset={16}>
                    <p className="text-[clamp(20px,1.9vw,26px)] leading-[1.5] font-medium tracking-[-0.012em] text-pretty">
                      <Tone text={p} />
                    </p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {project.youtube && (
          <ScrollReveal scale={1} yOffset={20} className="wrap">
            <div className="overflow-hidden rounded-[24px] bg-stone">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${project.youtube}?rel=0&modestbranding=1&playsinline=1`}
                title={`${dict.project.video}: ${project.title[lang]}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        )}

        {project.gallery.length > 0 && (
          <section className="section wrap" aria-label={dict.project.gallery}>
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              {project.gallery.map((img, i) => {
                const wide = img.w / img.h > 1.5;
                return (
                  <ScrollReveal key={img.src} scale={1} yOffset={20} className={wide ? "sm:col-span-2" : ""}>
                    <div className="relative overflow-hidden rounded-[22px]" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
                      <AsciiImage
                        src={img.src}
                        alt={`${project.title[lang]} — ${i + 1}`}
                        sizes={wide ? "(min-width: 1240px) 1160px, 100vw" : "(min-width: 640px) 580px, 100vw"}
                        className="object-cover"
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        )}

        <section className="wrap pb-10">
          <ScrollReveal scale={1} yOffset={20}>
            <Link
              href={`/${lang}/work/${next.slug}`}
              transitionTypes={["nav-forward"]}
              className="group grid items-center gap-8 border-t border-line pt-14 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]"
            >
              <div>
                <span className="t-label text-ink/45">{dict.project.next}</span>
                <p className="t-h2 mt-3">
                  {next.title[lang]} <span className="text-mute">{next.tagline[lang]}</span>
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[16px] font-semibold underline decoration-ink/25 decoration-2 underline-offset-[6px] transition-[text-decoration-color] duration-500 group-hover:decoration-ink">
                  {dict.project.next}
                  <Icon name="arrow" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[22px]">
                <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
                  <Image
                    src={next.cover.src}
                    alt={next.title[lang]}
                    fill
                    sizes="(min-width: 640px) 500px, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </ViewTransition>
              </div>
            </Link>
          </ScrollReveal>
        </section>
      </main>
    </PageTransition>
  );
}
