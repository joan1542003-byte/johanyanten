import Image from "next/image";
import type { ContactContent } from "@/lib/content";
import { Reveal, SectionHeading } from "./Reveal";

const tools = [
  { key: "figma", name: "Figma", mark: "Fi", color: "#1e1e1e", fg: "#a259ff" },
  { key: "indesign", name: "InDesign", mark: "Id", color: "#49021f", fg: "#ff3366" },
  { key: "illustrator", name: "Illustrator", mark: "Ai", color: "#330000", fg: "#ff9a00" },
  { key: "aftereffects", name: "After Effects", mark: "Ae", color: "#00005b", fg: "#9999ff" },
  { key: "photoshop", name: "Photoshop", mark: "Ps", color: "#001e36", fg: "#31a8ff" },
  { key: "davinci", name: "DaVinci Resolve", mark: "Dr", color: "#1b1b1b", fg: "#f5c518" },
] as const;

export function Tools({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Record<(typeof tools)[number]["key"], string>;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:py-32">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => (
          <Reveal key={t.key} delay={i * 0.06}>
            <div className="glass group h-full rounded-[1.75rem] p-6 transition-transform duration-300 hover:-translate-y-1">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                style={{ background: t.color, color: t.fg }}
              >
                {t.mark}
              </span>
              <h3 className="mt-5 font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{items[t.key]}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function About({ eyebrow, title, body }: { eyebrow: string; title: string; body: string[] }) {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:py-32">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="glass overflow-hidden rounded-[2.5rem] p-2.5">
            <Image
              src="/about/portrait.png"
              alt="Johan Yanten"
              width={1232}
              height={940}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-[2rem]"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
          </Reveal>
          {body.filter((p) => p.trim()).map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({ eyebrow, title, subtitle, cta, instagram, handle }: ContactContent) {
  return (
    <section id="contact" className="mx-auto w-full max-w-4xl scroll-mt-24 px-4 py-24 sm:py-32">
      <Reveal>
        <div className="glass rounded-[2.5rem] px-6 py-16 text-center sm:px-16 sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted">{subtitle}</p>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {cta} <span aria-hidden>↗</span>
          </a>
          {handle && <p className="mt-4 text-sm text-muted">{handle}</p>}
        </div>
      </Reveal>
    </section>
  );
}

export function Footer({ text }: { text: string }) {
  return (
    <footer className="px-4 pb-10 text-center text-sm text-muted">
      {text}
    </footer>
  );
}
