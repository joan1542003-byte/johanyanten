"use client";

import { useSyncExternalStore } from "react";
import type { HeroContent } from "@/lib/content";
import { Aura } from "./Aura";
import { BlurText } from "./amicro/blur-text";
import { FadeUp } from "./amicro/fade-up";
import { MagneticButton } from "./amicro/magnetic-button";
import { AsciiObject } from "./ascii/AsciiObject";
import { Icon } from "./Icon";

type Props = HeroContent & {
  labels: { contact: string; work: string; object: string; objectLabel: string };
};

// Deep pastel gradient across the second half of the headline (readable at 3:1+ on paper)
const STOPS = [
  [181, 83, 127],
  [138, 91, 201],
  [63, 127, 194],
];
const tone = (t: number) => {
  const seg = t < 0.5 ? 0 : 1;
  const k = (t - seg * 0.5) / 0.5;
  const [a, b] = [STOPS[seg], STOPS[seg + 1]];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
};

const wideQuery = "(min-width: 1024px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(wideQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// Full-bleed hero: the whole background is ASCII art, the words sit on top of it
export function Hero({ eyebrow, title, subtitle, labels }: Props) {
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(wideQuery).matches, () => true);

  return (
    <header className="relative isolate flex min-h-[clamp(640px,100svh,980px)] items-end overflow-hidden pt-28 pb-[clamp(40px,7vw,96px)]">
      <Aura mode="hero" className="opacity-70" />
      <div className="absolute inset-0">
        <AsciiObject
          shape="torus"
          field
          label={labels.objectLabel}
          size={0.3}
          center={wide ? [0.72, 0.5] : [0.5, 0.3]}
        />
      </div>
      {/* Paper wash behind the words so the art never fights the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(247,244,240,0.92) 0%, rgba(247,244,240,0.7) 38%, rgba(247,244,240,0) 62%)"
            : "linear-gradient(0deg, rgba(247,244,240,0.96) 0%, rgba(247,244,240,0.8) 45%, rgba(247,244,240,0) 70%)",
        }}
      />

      <div className="wrap pointer-events-none relative">
        <div className="pointer-events-auto grid max-w-[640px] justify-items-start gap-7">
          <FadeUp>
            <p className="t-label text-ink/70">
              Johan Yanten <span className="text-ink/40">— {eyebrow}</span>
            </p>
          </FadeUp>

          <h1 className="t-display">
            <BlurText text={title} />{" "}
            <BlurText text={subtitle} tint={tone} staggerDelay={0.045} delay={0.35} />
          </h1>

          <FadeUp delay={1.1} className="flex flex-wrap items-center gap-3">
            <MagneticButton href="#contact" className="pill-ink h-12 gap-2 rounded-full px-6 text-[16px] font-semibold">
              <Icon name="mail" /> {labels.contact}
            </MagneticButton>
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 px-3 text-[16px] font-semibold underline decoration-ink/25 decoration-2 underline-offset-[6px] transition-[text-decoration-color] duration-500 hover:decoration-ink"
            >
              {labels.work}
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          </FadeUp>
        </div>
      </div>

      <FadeUp delay={1.6} className="pointer-events-none absolute right-[clamp(18px,4vw,40px)] bottom-6 hidden lg:block">
        <p className="font-mono text-[13px] text-ink/50">↻ {labels.object}</p>
      </FadeUp>
    </header>
  );
}
