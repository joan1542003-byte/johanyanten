import Image from "next/image";
import type { AboutContent, ContactContent } from "@/lib/content";
import { Reveal, SectionHeading } from "./Reveal";
import { Emphasis } from "./Emphasis";
import { Dock, type Tool } from "./Dock";
import { ContactActions } from "./ContactActions";

const tools: Omit<Tool, "description">[] = [
  { key: "figma", name: "Figma", mark: "Fg", bg: "linear-gradient(145deg,#2c2c2e,#0f0f10)", fg: "#a259ff" },
  { key: "illustrator", name: "Illustrator", mark: "Ai", bg: "linear-gradient(145deg,#4a1d00,#2b0f00)", fg: "#ff9a00" },
  { key: "photoshop", name: "Photoshop", mark: "Ps", bg: "linear-gradient(145deg,#0a2f52,#001e36)", fg: "#31a8ff" },
  { key: "indesign", name: "InDesign", mark: "Id", bg: "linear-gradient(145deg,#5c0a2c,#49021f)", fg: "#ff3366" },
  { key: "aftereffects", name: "After Effects", mark: "Ae", bg: "linear-gradient(145deg,#14148a,#00005b)", fg: "#9999ff" },
  { key: "davinci", name: "DaVinci Resolve", mark: "Dr", bg: "linear-gradient(145deg,#2b2b2b,#141414)", fg: "#f5c518" },
];

export function Tools({
  eyebrow,
  title,
  hint,
  items,
}: {
  eyebrow: string;
  title: string;
  hint: string;
  items: Record<string, string>;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:py-32">
      <SectionHeading eyebrow={eyebrow} title={title}>
        <p className="max-w-56 text-sm text-muted">{hint}</p>
      </SectionHeading>
      <Reveal>
        <Dock tools={tools.map((t) => ({ ...t, description: items[t.key] }))} />
      </Reveal>
    </section>
  );
}

export function About({ eyebrow, title, body }: AboutContent) {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:py-32">
      <div className="raised grid items-center gap-8 rounded-[36px] p-3 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:p-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px]">
            <Image
              src="/about/portrait.png"
              alt="Johan Yanten"
              width={1232}
              height={940}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="h-full w-full object-cover"
            />
            <span className="raised absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Johan Yanten
            </span>
          </div>
        </Reveal>
        <div className="px-3 pb-6 md:px-0 md:pr-10 md:pb-0">
          <Reveal>
            <p className="text-sm font-medium text-muted">{eyebrow}</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
              <Emphasis text={title} />
            </h2>
          </Reveal>
          {body
            .filter((p) => p.trim())
            .map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <p className="mt-5 text-lg leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({
  eyebrow,
  title,
  subtitle,
  cta,
  instagram,
  handle,
  copied,
}: ContactContent & { copied: string }) {
  return (
    <section id="contact" className="mx-auto w-full max-w-5xl scroll-mt-24 px-4 py-24 sm:py-32">
      <Reveal>
        <div className="raised relative overflow-hidden rounded-[36px] px-6 py-20 text-center sm:px-16 sm:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side at 35% 50%, rgba(255,140,200,.45), transparent), radial-gradient(closest-side at 65% 50%, rgba(130,120,255,.4), transparent)",
            }}
          />
          <p className="relative text-sm font-medium text-muted">{eyebrow}</p>
          <h2 className="relative mx-auto mt-3 max-w-2xl text-5xl font-semibold tracking-[-0.045em] text-balance sm:text-7xl">
            <Emphasis text={title} />
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-lg text-muted">{subtitle}</p>
          <ContactActions href={instagram} cta={cta} handle={handle} copied={copied} />
        </div>
      </Reveal>
    </section>
  );
}

export function Footer({ text, top }: { text: string; top: string }) {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 pb-10 text-sm text-muted">
      <span>{text}</span>
      <a href="#" className="raised rounded-full px-4 py-2 text-ink transition-transform hover:-translate-y-0.5 active:scale-95">
        ↑ {top}
      </a>
    </footer>
  );
}
