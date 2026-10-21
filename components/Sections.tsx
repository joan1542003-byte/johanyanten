import Image from "next/image";
import type { AboutContent, ContactContent } from "@/lib/content";
import { ScrollReveal } from "./amicro/scroll-reveal";
import { Mark, SectionLabel } from "./Mark";
import { ContactCard } from "./ContactCard";

const tools = [
  { key: "figma", name: "Figma", mark: "Fg", bg: "#1e1e1e", fg: "#a259ff" },
  { key: "illustrator", name: "Illustrator", mark: "Ai", bg: "#330000", fg: "#ff9a00" },
  { key: "photoshop", name: "Photoshop", mark: "Ps", bg: "#001e36", fg: "#31a8ff" },
  { key: "indesign", name: "InDesign", mark: "Id", bg: "#49021f", fg: "#ff3366" },
  { key: "aftereffects", name: "After Effects", mark: "Ae", bg: "#00005b", fg: "#9999ff" },
  { key: "davinci", name: "DaVinci Resolve", mark: "Dr", bg: "#1b1b1b", fg: "#f5c518" },
];

const section = "px-6 py-14 sm:px-12 sm:py-16";

export function Tools({ eyebrow, title, items }: { eyebrow: string; title: string; items: Record<string, string> }) {
  return (
    <section className={section}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <ScrollReveal scale={1} yOffset={16}>
        <h2 className="text-[clamp(1.6rem,3.4vw,2.25rem)] leading-snug font-bold tracking-[-0.025em]">
          <Mark text={title} />
        </h2>
      </ScrollReveal>
      <ScrollReveal scale={1} yOffset={16} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
        {tools.map((t) => (
          <div key={t.key} className="group">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-[12px] text-[15px] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_10px_-4px_rgba(0,0,0,0.4)] transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
              style={{ background: t.bg, color: t.fg }}
            >
              {t.mark}
            </span>
            <p className="mt-3 font-bold">{t.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{items[t.key]}</p>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}

export function About({ eyebrow, title, body }: AboutContent) {
  return (
    <section id="about" className={`${section} scroll-mt-24`}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <div className="grid gap-10 md:grid-cols-[1fr_220px] md:items-start">
        <div>
          <ScrollReveal scale={1} yOffset={16}>
            <h2 className="text-[clamp(1.6rem,3.4vw,2.25rem)] leading-snug font-bold tracking-[-0.025em]">
              <Mark text={title} />
            </h2>
          </ScrollReveal>
          {body
            .filter((p) => p.trim())
            .map((p, i) => (
              <ScrollReveal key={i} scale={1} yOffset={16}>
                <p className="mt-6 text-[clamp(1.1rem,2vw,1.4rem)] leading-[1.6] font-medium tracking-[-0.015em]">
                  <Mark text={p} />
                </p>
              </ScrollReveal>
            ))}
        </div>
        <ScrollReveal scale={0.97} yOffset={16} className="order-first md:order-none">
          <div className="k-frame w-44 -rotate-2 overflow-hidden rounded-[28px] md:w-full">
            <Image
              src="/about/portrait.png"
              alt="Johan Yanten"
              width={1232}
              height={940}
              sizes="220px"
              className="aspect-square w-full rounded-[20px] object-cover"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Contact(props: ContactContent & { copied: string }) {
  return (
    <section id="contact" className={`${section} scroll-mt-24`}>
      <SectionLabel>{props.eyebrow}</SectionLabel>
      <ScrollReveal scale={1} yOffset={16}>
        <ContactCard {...props} />
      </ScrollReveal>
    </section>
  );
}

export function Footer({ text, top }: { text: string; top: string }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] px-6 py-8 text-sm text-muted sm:px-12">
      <span>{text}</span>
      <a href="#" className="k-button rounded-full px-4 py-2 font-medium text-ink">
        ↑ {top}
      </a>
    </footer>
  );
}
