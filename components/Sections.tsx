import Image from "next/image";
import type { AboutContent, Category, ContactContent } from "@/lib/content";
import { categorySky } from "@/lib/skies";
import { ScrollReveal } from "./amicro/scroll-reveal";
import { Head, Tone } from "./Mark";
import { Sky } from "./Sky";
import { ContactActions } from "./ContactCard";
import { Art, type ArtName } from "./ascii/Art";
import { AsciiWord } from "./ascii/AsciiWord";
import { Icon } from "./Icon";

const disciplines: Category[] = ["branding", "info", "uxui", "data", "motion"];
const disciplineArt: Record<Category, ArtName> = {
  branding: "nib",
  info: "signpost",
  uxui: "browser",
  data: "chart",
  motion: "film",
};

export function Disciplines({
  title,
  items,
  names,
}: {
  title: string;
  items: Record<Category, string>;
  names: Record<Category, string>;
}) {
  return (
    <section id="disciplines" className="section wrap scroll-mt-20">
      <Head title={title} />
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {disciplines.map((c, i) => (
          <ScrollReveal key={c} scale={1} yOffset={24} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
            <div className="group">
              <Sky
                name={categorySky[c]}
                className={`relative grid place-items-center rounded-[20px] transition-[filter] duration-700 group-hover:saturate-[1.25] ${
                  i === 4 ? "aspect-[2.1/1] sm:aspect-square" : "aspect-square"
                }`}
              >
                <Art
                  name={disciplineArt[c]}
                  className="pointer-events-none relative text-[11px] text-white [text-shadow:0_1px_6px_rgba(20,19,18,0.35)] sm:text-[12px]"
                />
              </Sky>
              <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.015em]">{names[c]}</h3>
              <p className="t-small mt-1.5 text-soft">{items[c]}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// Official program logos (from Wikimedia Commons), each with what it is used for
const tools = [
  { key: "figma", name: "Figma", logo: "/tools/figma.svg", group: "design" },
  { key: "illustrator", name: "Adobe Illustrator", logo: "/tools/illustrator.svg", group: "design" },
  { key: "photoshop", name: "Adobe Photoshop", logo: "/tools/photoshop.svg", group: "design" },
  { key: "indesign", name: "Adobe InDesign", logo: "/tools/indesign.svg", group: "design" },
  { key: "aftereffects", name: "Adobe After Effects", logo: "/tools/aftereffects.svg", group: "motion" },
  { key: "davinci", name: "DaVinci Resolve", logo: "/tools/davinci.svg", group: "motion" },
];

export function Tools({ title, groups, items }: { title: string; groups: Record<string, string>; items: Record<string, string> }) {
  return (
    <section id="tools" className="section wrap scroll-mt-20">
      <Head title={title} />
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ScrollReveal key={t.key} scale={1} yOffset={24}>
            <div className="group grid grid-cols-[60px_minmax(0,1fr)] items-start gap-5">
              <Image
                src={t.logo}
                alt={t.name}
                width={60}
                height={60}
                unoptimized
                className="h-[60px] w-[60px] object-contain drop-shadow-[0_8px_16px_rgba(30,22,12,0.18)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:rotate-[-4deg]"
              />
              <div>
                <span className="t-label text-ink/45">{groups[t.group]}</span>
                <h3 className="mt-0.5 text-[19px] font-semibold tracking-[-0.015em]">{t.name}</h3>
                <p className="t-small mt-1.5 text-soft">{items[t.key]}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function About({ title, body }: AboutContent) {
  return (
    <section id="about" className="section wrap scroll-mt-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
        <ScrollReveal scale={1} yOffset={24} className="relative order-last lg:order-first">
          <div
            aria-hidden
            className="absolute inset-[-10%] -z-10 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(closest-side, rgba(246,163,203,0.35), rgba(157,214,244,0.25), transparent)" }}
          />
          <Art name="desk" interval={140} className="tone mx-auto w-fit text-[clamp(8px,2.4vw,13px)] font-semibold" />
        </ScrollReveal>
        <div>
          <Head title={title} />
          {body
            .filter((p) => p.trim())
            .map((p, i) => (
              <ScrollReveal key={i} scale={1} yOffset={18}>
                <p className="t-lead mt-5 max-w-[56ch] text-soft first:mt-0">
                  <Tone text={p} />
                </p>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
}

export function Contact({
  title,
  subtitle,
  cta,
  instagram,
  handle,
  copied,
  ascii,
}: ContactContent & { copied: string; ascii: string }) {
  return (
    <section id="contact" className="section scroll-mt-20 text-center">
      <ScrollReveal scale={1} yOffset={24}>
        <div className="mx-auto h-[clamp(84px,21vw,300px)] w-full max-w-[1400px] px-2">
          <AsciiWord text={ascii} cell={8} />
        </div>
      </ScrollReveal>
      <ScrollReveal scale={1} yOffset={24} className="wrap mt-8 grid justify-items-center gap-5">
        <h2 className="t-h2 max-w-[20ch]">
          <Tone text={title} />
        </h2>
        <p className="t-lead max-w-md text-soft">{subtitle}</p>
        <ContactActions href={instagram} cta={cta} handle={handle} copied={copied} />
      </ScrollReveal>
    </section>
  );
}

export function Footer({ text, top }: { text: string; top: string }) {
  return (
    <footer className="wrap pt-10 pb-8">
      <div className="h-[clamp(70px,9vw,120px)] opacity-80">
        <AsciiWord text="JOHAN YANTEN" cell={6} waves={0.18} />
      </div>
      <div className="t-small mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-soft">
        <span>{text}</span>
        <a href="#" className="group inline-flex items-center gap-1.5 font-semibold text-ink">
          <Icon name="up" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" /> {top}
        </a>
      </div>
    </footer>
  );
}
