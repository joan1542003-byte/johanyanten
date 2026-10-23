"use client";

import type { HeroContent } from "@/lib/content";
import { BlurText } from "./amicro/blur-text";
import { FadeUp } from "./amicro/fade-up";
import { MagneticButton } from "./amicro/magnetic-button";
import { AsciiScene } from "./ascii/AsciiScene";
import { Icon } from "./Icon";

type Props = HeroContent & {
  labels: { contact: string; work: string; scene: string; sceneLabel: string };
};

// Light pastel gradient across the second half of the headline (readable on the dark page)
const STOPS = [
  [243, 154, 196],
  [185, 156, 243],
  [130, 189, 242],
];
const tone = (t: number) => {
  const seg = t < 0.5 ? 0 : 1;
  const k = (t - seg * 0.5) / 0.5;
  const [a, b] = [STOPS[seg], STOPS[seg + 1]];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
};

// The whole screen is an ASCII landscape: the Andes at dusk over a lake. The sun sets as you scroll
export function Hero({ eyebrow, title, subtitle, labels }: Props) {
  return (
    <header className="relative isolate flex min-h-[100svh] items-end overflow-hidden pt-28 pb-[clamp(40px,7vw,96px)]">
      <div className="absolute inset-0 -z-10">
        <AsciiScene scene="andes" label={labels.sceneLabel} />
      </div>
      {/* Darker water under the words, so the art never fights the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(var(--paper-rgb),0.95)_0%,rgba(var(--paper-rgb),0.7)_32%,rgba(var(--paper-rgb),0)_58%)] lg:bg-[radial-gradient(70%_75%_at_12%_92%,rgba(var(--paper-rgb),0.92)_0%,rgba(var(--paper-rgb),0.6)_45%,rgba(var(--paper-rgb),0)_75%)]"
      />

      <div className="wrap">
        <div className="grid max-w-[960px] justify-items-start gap-6">
          <FadeUp>
            <p className="t-label text-ink/75">
              Johan Yanten <span className="text-ink/45">— {eyebrow}</span>
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
        <p className="font-mono text-[13px] text-ink/45">{labels.scene}</p>
      </FadeUp>
    </header>
  );
}
