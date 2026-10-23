import { ViewTransition, type CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getProjects, type Img } from "@/lib/content";
import { tintOf } from "@/lib/colors";
import { displayImage } from "@/lib/images";
import { videoRatio } from "@/lib/video";
import { PageTransition } from "@/components/PageTransition";
import { Tone } from "@/components/Mark";
import { Card } from "@/components/Card";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Photo } from "@/components/Photo";
import { Video } from "@/components/Video";
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
    openGraph: { type: "article", images: [displayImage(project).src] },
    twitter: { card: "summary_large_image", images: [displayImage(project).src] },
  };
}

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

/**
 * A frame for an image at its own proportions: no wider than the page, no taller than most of the
 * screen, and never wider than the image's own pixels, so small sources aren't blown up.
 */
function frame(img: Img, maxHeight = "82svh"): CSSProperties {
  const ratio = Math.min(Math.max(img.w / img.h, 0.7), 2.4);
  return { aspectRatio: `${ratio}`, width: `min(100%, calc(${maxHeight} * ${ratio}), ${img.w}px)` };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  const found = await getProject(slug);
  if (!hasLocale(lang) || !found) notFound();
  const { project, next } = found;
  const dict = await getDictionary(lang);
  const paragraphs = project.description.map((p) => p[lang]).filter((p) => p.trim());
  const cover = displayImage(project);
  const nextImage = displayImage(next);
  const [tint, nextTint, ratio] = await Promise.all([
    tintOf(cover.src),
    tintOf(nextImage.src),
    project.youtube ? videoRatio(project.youtube) : 16 / 9,
  ]);
  const coverRatio = Math.min(Math.max(cover.w / cover.h, 0.7), 2.4);

  return (
    <PageTransition>
      <ProgressIndicator height={2} color="bg-ink" />
      {/* The project's own color washes the top of the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[90svh]"
        style={{ background: `radial-gradient(90% 70% at 50% 0%, rgb(${tint ?? "236 235 232"} / 0.28), transparent 70%)` }}
      />
      <main className="wrap pt-28 sm:pt-36" style={tint ? ({ "--tint": tint } as CSSProperties) : undefined}>
        <div className="enter" style={delay(0)}>
          <Link href={`/${lang}#work`} transitionTypes={["nav-back"]} className="btn btn-soft group h-10 bg-white/70 px-4 text-[15px] backdrop-blur">
            <Icon name="back" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
            {dict.project.back}
          </Link>
        </div>

        <header className="mt-8 sm:mt-10">
          <div className="enter flex flex-wrap gap-2" style={delay(0.08)}>
            {project.categories.map((c) => (
              <span key={c} className="chip gap-1.5 bg-white shadow-[0_1px_2px_rgba(29,29,31,0.08)]">
                <CategoryIcon category={c} className="h-4 w-4" />
                {dict.work.filters[c]}
              </span>
            ))}
            {project.is_new && <span className="chip bg-ink text-white">{dict.work.new}</span>}
          </div>
          <h1 className="enter t-hero mt-6 max-w-[16ch] text-[clamp(42px,6vw,92px)]" style={delay(0.16)}>
            {project.title[lang]}
          </h1>
          <p className="enter t-lead mt-4 text-ink-2" style={delay(0.24)}>
            {project.tagline[lang]}
          </p>
        </header>

        <div
          className="enter card relative mx-auto mt-10 sm:mt-14"
          style={{ ...delay(0.32), ...frame(cover), boxShadow: tint ? `var(--shadow), 0 40px 90px -40px rgb(${tint} / 0.7)` : undefined }}
        >
          <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
            <div className="absolute inset-0">
              <Photo
                src={cover.src}
                alt={project.title[lang]}
                sizes={`(min-width: 1280px) ${Math.round(Math.min(1216, 740 * coverRatio, cover.w))}px, 100vw`}
                preload
                fade={false}
              />
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
          // Sized to the video itself, so a vertical one is not squeezed between black bars
          <Card className="mx-auto mt-5" style={{ aspectRatio: `${ratio}`, width: `min(100%, calc(82svh * ${ratio}))` }}>
            <Video
              id={project.youtube}
              title={`${dict.project.video}: ${project.title[lang]}`}
              play={dict.project.play}
              sizes={`(min-width: 1280px) ${Math.round(Math.min(1216, 740 * ratio))}px, 100vw`}
            />
          </Card>
        )}

        {project.gallery.length > 0 && (
          <section className="mt-5 grid items-start gap-5 sm:grid-cols-2" aria-label={dict.project.gallery}>
            {project.gallery.map((img, i) => {
              // Only images with enough pixels get the full width
              const wide = img.w / img.h > 1.5 && img.w >= 1800;
              return (
                <Card
                  key={img.src}
                  delay={0.06 * (i % 2)}
                  className={`mx-auto w-full ${wide ? "sm:col-span-2" : ""}`}
                  style={{ aspectRatio: `${img.w} / ${img.h}`, maxWidth: `${img.w}px` }}
                >
                  <Photo
                    src={img.src}
                    alt={`${project.title[lang]} — ${i + 1}`}
                    sizes={wide ? `(min-width: 1280px) ${Math.min(1216, img.w)}px, 100vw` : `(min-width: 1280px) ${Math.min(598, img.w)}px, (min-width: 640px) 50vw, 100vw`}
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
          tint={nextTint ?? undefined}
          className="group mt-16 sm:mt-24"
        >
          <div className="grid items-center gap-6 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-10 sm:p-5">
            <div className="order-last px-3 pb-3 sm:order-first sm:px-6 sm:pb-0">
              <p className="t-label text-ink-2">{dict.project.next}</p>
              <p className="t-title mt-2 text-[clamp(30px,3.4vw,50px)]">{next.title[lang]}</p>
              <p className="t-small mt-2 text-ink-2">{next.tagline[lang]}</p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
              <ViewTransition name={`cover-${next.slug}`} share="morph" default="none">
                <div className="zoom absolute -inset-3">
                  <Photo src={nextImage.src} alt="" sizes="(min-width: 640px) 620px, 100vw" fade={false} />
                </div>
              </ViewTransition>
              <ArrowBadge className="absolute top-3 right-3" />
            </div>
          </div>
          <span className="follow chip h-10 gap-2 bg-ink px-4 text-[14px] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]">
            {dict.project.next} <Icon name="arrow" className="h-4 w-4" />
          </span>
        </Card>
      </main>
    </PageTransition>
  );
}
