import { ViewTransition, type CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getProjects } from "@/lib/content";
import { categorySky, skyBackground } from "@/lib/skies";
import { PageTransition } from "@/components/PageTransition";
import { Tone } from "@/components/Mark";
import { Card } from "@/components/Card";
import { Photo } from "@/components/Photo";
import { ProgressIndicator } from "@/components/amicro/progress-indicator";
import { ArrowBadge, Icon } from "@/components/Icon";

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

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

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
      <main className="wrap pt-28 sm:pt-36">
        <div className="enter" style={delay(0)}>
          <Link href={`/${lang}#work`} transitionTypes={["nav-back"]} className="btn btn-soft group h-10 px-4 text-[15px]">
            <Icon name="back" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
            {dict.project.back}
          </Link>
        </div>

        <header className="mt-8 sm:mt-10">
          <div className="enter flex flex-wrap gap-2" style={delay(0.08)}>
            {project.categories.map((c) => (
              <span key={c} className="chip bg-white shadow-[0_1px_2px_rgba(29,29,31,0.08)]">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: skyBackground(categorySky[c]) }} />
                {dict.work.filters[c]}
              </span>
            ))}
            {project.is_new && <span className="chip bg-ink text-white">{dict.work.new}</span>}
          </div>
          <h1 className="enter mt-5 max-w-[18ch] text-[clamp(36px,5.2vw,76px)] leading-[1.02] font-semibold tracking-[-0.04em]" style={delay(0.16)}>
            {project.title[lang]}
          </h1>
          <p className="enter t-lead mt-3 text-ink-2" style={delay(0.24)}>
            {project.tagline[lang]}
          </p>
        </header>

        <div className="enter card relative mt-10 aspect-[4/3] w-full sm:aspect-[16/9] sm:mt-12" style={delay(0.32)}>
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <div className="absolute inset-0">
              <Photo src={project.cover.src} alt={project.title[lang]} sizes="(min-width: 1280px) 1216px, 100vw" preload />
            </div>
          </ViewTransition>
        </div>

        {paragraphs.length > 0 && (
          <Card className="mt-5">
            <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)] lg:gap-16 lg:p-14">
              <h2 className="t-card">{dict.project.about}</h2>
              <div className="grid gap-5">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-[clamp(19px,1.6vw,23px)] leading-[1.5] tracking-[-0.012em] text-ink-2">
                    <Tone text={p} soft="text-ink" />
                  </p>
                ))}
              </div>
            </div>
          </Card>
        )}

        {project.youtube && (
          <Card className="mt-5">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${project.youtube}?rel=0&modestbranding=1&playsinline=1`}
              title={`${dict.project.video}: ${project.title[lang]}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </Card>
        )}

        {project.gallery.length > 0 && (
          <section className="mt-5 grid gap-5 sm:grid-cols-2" aria-label={dict.project.gallery}>
            {project.gallery.map((img, i) => {
              const wide = img.w / img.h > 1.5;
              return (
                <Card key={img.src} delay={0.06 * (i % 2)} className={wide ? "sm:col-span-2" : ""} style={{ aspectRatio: `${img.w} / ${img.h}` }}>
                  <Photo
                    src={img.src}
                    alt={`${project.title[lang]} — ${i + 1}`}
                    sizes={wide ? "(min-width: 1280px) 1216px, 100vw" : "(min-width: 640px) 600px, 100vw"}
                  />
                </Card>
              );
            })}
          </section>
        )}

        <Card
          href={`/${lang}/work/${next.slug}`}
          label={`${dict.project.next}: ${next.title[lang]}`}
          transitionTypes={["nav-forward"]}
          className="group mt-16 sm:mt-24"
        >
          <div className="grid items-center gap-6 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-10 sm:p-5">
            <div className="order-last px-3 pb-3 sm:order-first sm:px-6 sm:pb-0">
              <p className="t-label text-ink-2">{dict.project.next}</p>
              <p className="mt-2 text-[clamp(26px,3vw,42px)] leading-[1.05] font-semibold tracking-[-0.035em]">{next.title[lang]}</p>
              <p className="t-small mt-2 text-ink-2">{next.tagline[lang]}</p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
              <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
                <div className="zoom absolute inset-0">
                  <Photo src={next.cover.src} alt="" sizes="(min-width: 640px) 600px, 100vw" />
                </div>
              </ViewTransition>
              <ArrowBadge className="absolute top-3 right-3" />
            </div>
          </div>
        </Card>
      </main>
    </PageTransition>
  );
}
