import Image from "next/image";
import type { AboutContent, Category, ContactContent } from "@/lib/content";
import { categorySky } from "@/lib/skies";
import { ScrollReveal } from "./amicro/scroll-reveal";
import { Head, Tone } from "./Mark";
import { Sky } from "./Sky";
import { Aura } from "./Aura";
import { ContactActions } from "./ContactCard";

const disciplines: Category[] = ["branding", "info", "uxui", "data", "motion"];

export function Disciplines({
  eyebrow,
  title,
  items,
  names,
}: {
  eyebrow: string;
  title: string;
  items: Record<Category, string>;
  names: Record<Category, string>;
}) {
  return (
    <section id="disciplines" className="board scroll-mt-24">
      <Head eyebrow={eyebrow} title={title} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {disciplines.map((c, i) => (
          <ScrollReveal key={c} scale={1} yOffset={18} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
            <div className="card h-full p-2.5 pb-4">
              <Sky
                name={categorySky[c]}
                className={`flex items-end rounded-[16px] p-2 ${i === 4 ? "aspect-[2.1/1] sm:aspect-square" : "aspect-square"}`}
              >
                <span className="cap">{names[c]}</span>
              </Sky>
              <p className="mt-3 px-1.5 text-sm leading-snug text-soft">{items[c]}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

const toolGroups = [
  {
    key: "design",
    tools: [
      { key: "figma", name: "Figma", mark: "Fg", tile: "var(--t-lilac)" },
      { key: "illustrator", name: "Illustrator", mark: "Ai", tile: "var(--t-peach)" },
      { key: "photoshop", name: "Photoshop", mark: "Ps", tile: "var(--t-sky)" },
      { key: "indesign", name: "InDesign", mark: "Id", tile: "var(--t-blush)" },
    ],
  },
  {
    key: "motion",
    tools: [
      { key: "aftereffects", name: "After Effects", mark: "Ae", tile: "var(--t-lilac)" },
      { key: "davinci", name: "DaVinci Resolve", mark: "Dr", tile: "var(--t-butter)" },
    ],
  },
] as const;

export function Tools({
  eyebrow,
  title,
  groups,
  items,
}: {
  eyebrow: string;
  title: string;
  groups: Record<string, string>;
  items: Record<string, string>;
}) {
  return (
    <section id="tools" className="board board-white scroll-mt-24">
      <Head eyebrow={eyebrow} title={title} />
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
        {toolGroups.map((g) => (
          <ScrollReveal key={g.key} scale={1} yOffset={18}>
            <div className="h-full rounded-[22px] bg-paper p-5">
              <h3 className="mb-4 text-[17px] font-semibold">{groups[g.key]}</h3>
              <div className="grid gap-3.5">
                {g.tools.map((t) => (
                  <div key={t.key} className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-[12px] text-[15px] font-semibold"
                      style={{ background: t.tile }}
                    >
                      {t.mark}
                    </span>
                    <span>
                      <b className="block text-[15px] font-semibold">{t.name}</b>
                      <small className="block text-[13px] leading-snug text-soft">{items[t.key]}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function About({ eyebrow, title, body }: AboutContent) {
  return (
    <section id="about" className="board scroll-mt-24">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-center md:gap-14">
        <div>
          <Head eyebrow={eyebrow} title={title} />
          {body
            .filter((p) => p.trim())
            .map((p, i) => (
              <ScrollReveal key={i} scale={1} yOffset={16}>
                <p className="mt-4 max-w-[60ch] text-[clamp(17px,1.6vw,20px)] leading-relaxed text-soft first:mt-0">
                  <Tone text={p} />
                </p>
              </ScrollReveal>
            ))}
        </div>
        <ScrollReveal scale={1} yOffset={18} className="order-first md:order-none">
          <div className="card overflow-hidden p-2.5">
            <Image
              src="/about/portrait.png"
              alt="Johan Yanten"
              width={1232}
              height={940}
              sizes="(min-width: 768px) 480px, 100vw"
              className="w-full rounded-[16px]"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Contact({ eyebrow, title, subtitle, cta, instagram, handle, copied }: ContactContent & { copied: string }) {
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden rounded-[40px] px-6 py-24 text-center sm:py-32">
      <Aura mode="soft" />
      <ScrollReveal scale={1} yOffset={18} className="relative mx-auto grid max-w-2xl justify-items-center gap-4">
        <span className="text-[13px] font-semibold text-ink/60">{eyebrow}</span>
        <h2 className="text-[clamp(34px,5vw,64px)] leading-[1] font-semibold tracking-[-0.035em]">
          <Tone text={title} />
        </h2>
        <p className="max-w-md text-lg text-ink/65">{subtitle}</p>
        <ContactActions href={instagram} cta={cta} handle={handle} copied={copied} />
      </ScrollReveal>
    </section>
  );
}

export function Footer({ text, top }: { text: string; top: string }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 px-2 py-8 text-sm text-soft">
      <span>{text}</span>
      <a href="#" className="chip rounded-full px-4 py-2 font-semibold text-ink transition-colors hover:bg-white">
        ↑ {top}
      </a>
    </footer>
  );
}
