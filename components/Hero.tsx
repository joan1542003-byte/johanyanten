import { ViewTransition, type CSSProperties } from "react";
import type { Category, ContactContent, HeroContent } from "@/lib/content";
import { boxes, coverSizes } from "@/lib/images";
import type { CardData } from "./WorkGrid";
import { RiseText } from "./amicro/rise-text";
import { Card } from "./Card";
import { CategoryIcon } from "./CategoryIcon";
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
  view: string;
  copied: string;
  filters: Record<Category, string>;
};

type Props = {
  lang: string;
  hero: HeroContent;
  contact: ContactContent;
  labels: Labels;
  featured: CardData;
  disciplines: { title: string; counts: Record<Category, number> };
};

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

// The greeting, then a first bento: the latest project, what Johan does, his local time and Instagram
export function Hero({ lang, hero, contact, labels, featured, disciplines }: Props) {
  return (
    <>
      <header className="wrap pt-32 pb-10 sm:pt-44 sm:pb-14">
        <p className="enter t-label flex items-center gap-2 text-ink-2" style={delay(0.05)}>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[10px] font-semibold text-white">JY</span>
          Johan Yanten · {hero.eyebrow}
        </p>
        <h1 className="t-hero mt-6 max-w-[12ch]">
          <RiseText text={hero.title} delay={0.12} />
        </h1>
        <div className="mt-8 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <p className="enter max-w-[34ch] text-[clamp(19px,1.75vw,25px)] leading-[1.38] tracking-[-0.015em] text-ink-2" style={delay(0.5)}>
            {hero.subtitle}
          </p>
          <div className="enter flex flex-wrap gap-3" style={delay(0.65)}>
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
            tint={featured.tint ?? undefined}
            className="group col-span-2 h-[460px] sm:h-auto lg:row-span-2"
          >
            <ViewTransition name={`cover-${featured.slug}`} share="morph" default="none">
              <div className="zoom absolute -inset-3">
                <Photo src={featured.image.src} alt="" sizes={coverSizes(featured.image, boxes.featured)} preload fade={false} />
              </div>
            </ViewTransition>
            <div className="shade absolute inset-0" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              <span className="chip chip-glass h-8 text-[13px]">
                <Icon name="sparkle" className="h-3.5 w-3.5" /> {labels.featured}
              </span>
              {featured.categories.map((c) => (
                <span key={c} className="chip chip-glass h-8 gap-1.5 text-[13px]">
                  <CategoryIcon category={c} className="h-3.5 w-3.5" /> {labels.filters[c]}
                </span>
              ))}
            </div>
            <ArrowBadge className="absolute top-4 right-4" />
            <span className="follow chip h-10 gap-2 bg-white px-4 text-[14px] text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]">
              {labels.view} <Icon name="arrow" className="h-4 w-4" />
            </span>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="t-small text-white/80">{featured.tagline}</p>
              <h2 className="t-card mt-1.5 max-w-[14ch] text-[clamp(30px,3vw,46px)]">{featured.title}</h2>
            </div>
          </Card>

          <Card delay={0.3} className="col-span-2">
            <DisciplinesCard label={labels.disciplines} names={labels.filters} {...disciplines} />
          </Card>

          <Card delay={0.4} className="col-span-1 min-h-[236px] sm:min-h-0">
            <ClockCard city={labels.city} label={labels.time} />
          </Card>

          <Card delay={0.5} className="col-span-1 min-h-[236px] sm:min-h-0">
            <InstagramCard href={contact.instagram} handle={contact.handle} open={labels.open} label={labels.instagram} copied={labels.copied} />
          </Card>
        </div>
      </section>
    </>
  );
}
