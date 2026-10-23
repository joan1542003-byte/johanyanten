import type { CSSProperties } from "react";
import type { Category, ContactContent, HeroContent } from "@/lib/content";
import type { CardData } from "./WorkGrid";
import { RiseText } from "./amicro/rise-text";
import { Card } from "./Card";
import { ClockCard } from "./Clock";
import { ArrowBadge, Icon } from "./Icon";
import { Photo } from "./Photo";
import { DisciplinesCard, InstagramCard } from "./Widgets";

type Labels = {
  contact: string;
  work: string;
  featured: string;
  disciplines: string;
  city: string;
  time: string;
  instagram: string;
  open: string;
};

type Props = {
  lang: string;
  hero: HeroContent;
  contact: ContactContent;
  labels: Labels;
  featured: CardData;
  disciplines: { title: string; names: Record<Category, string>; counts: Record<Category, number> };
};

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

// The greeting, then a first bento: the latest project, what Johan does, his local time and Instagram
export function Hero({ lang, hero, contact, labels, featured, disciplines }: Props) {
  return (
    <>
      <header className="wrap pt-32 pb-8 sm:pt-40 sm:pb-12">
        <p className="enter t-label text-ink-2" style={delay(0.05)}>
          Johan Yanten · {hero.eyebrow}
        </p>
        <h1 className="t-hero mt-4">
          <RiseText text={hero.title} delay={0.12} />
        </h1>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="enter max-w-[36ch] text-[clamp(19px,1.7vw,24px)] leading-[1.4] tracking-[-0.015em] text-ink-2" style={delay(0.45)}>
            {hero.subtitle}
          </p>
          <div className="enter flex flex-wrap gap-3" style={delay(0.6)}>
            <a href="#work" className="btn btn-primary">
              {labels.work} <Icon name="arrow" className="h-4 w-4 rotate-90" />
            </a>
            <a href="#contact" className="btn btn-soft">
              <Icon name="mail" className="h-4 w-4" /> {labels.contact}
            </a>
          </div>
        </div>
      </header>

      <section className="wrap" aria-label={labels.featured}>
        <div className="bento">
          <Card
            href={`/${lang}/work/${featured.slug}`}
            label={featured.title}
            transitionTypes={["nav-forward"]}
            delay={0.2}
            className="group col-span-2 h-[440px] sm:h-auto lg:row-span-2"
          >
            <div className="zoom absolute inset-0">
              <Photo src={featured.cover.src} alt="" sizes="(min-width: 1024px) 640px, 100vw" preload />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
            <span className="chip chip-glass absolute top-4 left-4 h-8 text-[13px]">
              <Icon name="sparkle" className="h-3.5 w-3.5" /> {labels.featured}
            </span>
            <ArrowBadge className="absolute top-4 right-4" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <p className="t-small text-white/75">{featured.tagline}</p>
              <h2 className="mt-1 max-w-[18ch] text-[clamp(26px,2.5vw,38px)] leading-[1.05] font-semibold tracking-[-0.03em]">
                {featured.title}
              </h2>
            </div>
          </Card>

          <Card delay={0.3} className="col-span-2">
            <DisciplinesCard label={labels.disciplines} {...disciplines} />
          </Card>

          <Card delay={0.4} className="col-span-1 min-h-[230px] sm:min-h-0">
            <ClockCard city={labels.city} label={labels.time} />
          </Card>

          <Card delay={0.5} className="col-span-1 min-h-[230px] sm:min-h-0">
            <InstagramCard href={contact.instagram} handle={contact.handle} open={labels.open} label={labels.instagram} />
          </Card>
        </div>
      </section>
    </>
  );
}
