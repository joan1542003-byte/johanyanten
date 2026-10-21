"use client";

import type { HeroContent } from "@/lib/content";
import { BlurText } from "./amicro/blur-text";
import { FadeUp } from "./amicro/fade-up";
import { MagneticButton } from "./amicro/magnetic-button";
import { Featured, type FeaturedItem } from "./Featured";

type Props = HeroContent & {
  lang: string;
  featured: FeaturedItem[];
  labels: { contact: string; view: string; next: string };
};

export function Hero({ eyebrow, title, subtitle, cta, lang, featured, labels }: Props) {
  return (
    <section className="px-6 pt-12 pb-16 sm:px-12 sm:pt-16">
      <FadeUp>
        <p className="text-xs font-medium tracking-[0.08em] text-muted uppercase">{eyebrow}</p>
      </FadeUp>

      <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.03em] text-balance">
        <BlurText text={title} markClassName="k-mark" />{" "}
        <BlurText text={subtitle} className="text-muted" staggerDelay={0.025} delay={0.35} />
      </h1>

      <FadeUp delay={1} className="mt-9 flex flex-wrap gap-3">
        <MagneticButton href="#contact" className="k-button rounded-full px-5 py-3 font-medium">
          <span aria-hidden>✉️</span> {labels.contact}
        </MagneticButton>
        <a href="#work" className="k-button inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium">
          <span aria-hidden>📁</span> {cta}
        </a>
      </FadeUp>

      <FadeUp delay={0.7} duration={1.2} className="mt-12">
        <Featured lang={lang} items={featured} labels={labels} />
      </FadeUp>
    </section>
  );
}
