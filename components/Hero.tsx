"use client";

import type { HeroContent } from "@/lib/content";
import { Aura } from "./Aura";
import { BlurText } from "./amicro/blur-text";
import { FadeUp } from "./amicro/fade-up";
import { MagneticButton } from "./amicro/magnetic-button";

type Props = HeroContent & {
  labels: { contact: string; work: string; toc: Record<string, string> };
};

// Aura board: the name, a two-tone line and the table of contents, sitting at the bottom
export function Hero({ eyebrow, title, subtitle, labels }: Props) {
  return (
    <header className="relative grid min-h-[clamp(540px,78svh,760px)] content-end overflow-hidden rounded-[40px] p-[clamp(22px,5vw,64px)]">
      <Aura mode="hero" />
      <div className="relative grid justify-items-start gap-6">
        <FadeUp className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-ink text-[17px] font-semibold tracking-tight text-white">
            JY
          </span>
          <span className="text-[15px] font-semibold">
            Johan Yanten <span className="text-ink/55">· {eyebrow}</span>
          </span>
        </FadeUp>

        <h1 className="max-w-[20ch] text-[clamp(36px,5vw,68px)] leading-[1] font-semibold tracking-[-0.04em]">
          <BlurText text={title} />{" "}
          <BlurText text={subtitle} className="text-ink/45" staggerDelay={0.035} delay={0.3} />
        </h1>

        <FadeUp delay={1} className="flex flex-wrap gap-2.5">
          <MagneticButton href="#contact" className="pill-ink h-12 rounded-full px-6 text-[15px] font-semibold">
            {labels.contact}
          </MagneticButton>
          <a
            href="#work"
            className="pill-white inline-flex h-12 items-center rounded-full px-6 text-[15px] font-semibold transition-transform duration-300 hover:-translate-y-0.5"
          >
            {labels.work}
          </a>
        </FadeUp>

        <FadeUp delay={1.25}>
          <nav aria-label="Secciones" className="flex flex-wrap gap-2">
            {Object.entries(labels.toc).map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full bg-white/60 px-3.5 py-2 text-sm font-semibold backdrop-blur-sm transition-colors duration-300 hover:bg-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </FadeUp>
      </div>
    </header>
  );
}
