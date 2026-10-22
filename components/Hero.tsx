"use client";

import type { HeroContent } from "@/lib/content";
import { Aura } from "./Aura";
import { BlurText } from "./amicro/blur-text";
import { FadeUp } from "./amicro/fade-up";
import { MagneticButton } from "./amicro/magnetic-button";
import { AsciiObject } from "./ascii/AsciiObject";
import { Icon } from "./Icon";

type Props = HeroContent & {
  labels: { contact: string; work: string; object: string; objectLabel: string; toc: Record<string, string> };
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

// Aura board: name and two-tone line on the left, a 3D object drawn in ASCII on the right
export function Hero({ eyebrow, title, subtitle, labels }: Props) {
  return (
    <header className="relative overflow-hidden rounded-[40px] p-[clamp(22px,4.5vw,60px)]">
      <Aura mode="hero" />
      <div className="relative grid min-h-[clamp(520px,70svh,700px)] grid-cols-[minmax(0,1fr)] items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="grid min-w-0 justify-items-start gap-7">
          <FadeUp className="flex items-center gap-3">
            <span className="pill-ink flex h-12 w-12 items-center justify-center rounded-[15px] text-[17px] font-semibold tracking-tight">
              JY
            </span>
            <span className="t-label">
              Johan Yanten <span className="text-ink/55">· {eyebrow}</span>
            </span>
          </FadeUp>

          <h1 className="t-display max-w-[19ch]">
            <BlurText text={title} />{" "}
            <BlurText text={subtitle} tint={tone} staggerDelay={0.045} delay={0.35} />
          </h1>

          <FadeUp delay={1.1} className="flex flex-wrap gap-2.5">
            <MagneticButton href="#contact" className="pill-ink h-12 gap-2 rounded-full px-6 text-[16px] font-semibold">
              <Icon name="mail" /> {labels.contact}
            </MagneticButton>
            <a
              href="#work"
              className="pill-white inline-flex h-12 items-center gap-2 rounded-full px-6 text-[16px] font-semibold transition-transform duration-500 ease-out hover:-translate-y-0.5"
            >
              <Icon name="folder" /> {labels.work}
            </a>
          </FadeUp>

          <FadeUp delay={1.35}>
            <nav aria-label="Secciones" className="flex flex-wrap gap-2">
              {Object.entries(labels.toc).map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="t-label rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm transition-colors duration-500 hover:bg-white"
                >
                  {label}
                </a>
              ))}
            </nav>
          </FadeUp>
        </div>

        <FadeUp delay={0.5} duration={1.4} className="relative mx-auto w-full max-w-[420px] min-w-0 lg:max-w-none">
          <div className="rounded-[30px] bg-white/45 p-3 shadow-[0_30px_60px_-30px_rgba(30,22,12,0.45)] backdrop-blur-md">
            <div
              className="aspect-[4/4.4] overflow-hidden rounded-[22px]"
              style={{ background: "radial-gradient(90% 70% at 50% 35%, #fffdf9 0%, #f4eee6 100%)" }}
            >
              <AsciiObject shape="torus" label={labels.objectLabel} />
            </div>
            <p className="t-label mt-3 flex items-center justify-between px-1.5 text-ink/60">
              <span>{labels.object}</span>
              <span className="font-mono text-[13px]">ascii</span>
            </p>
          </div>
        </FadeUp>
      </div>
    </header>
  );
}
