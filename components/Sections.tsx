import type { AboutContent, Category, ContactContent } from "@/lib/content";
import type { GlassSettings } from "@/lib/glass";
import { categorySky } from "@/lib/skies";
import { ScrollReveal } from "./amicro/scroll-reveal";
import { Head, Tone } from "./Mark";
import { Sky } from "./Sky";
import { ContactActions } from "./ContactCard";
import { Dock } from "./Dock";
import { AsciiImage } from "./ascii/AsciiImage";
import { AsciiWord } from "./ascii/AsciiWord";
import { Icon } from "./Icon";

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
          <ScrollReveal key={c} scale={1} yOffset={20} className={i === 4 ? "col-span-2 sm:col-span-1" : ""}>
            <div className="card group h-full p-2.5 pb-5 transition-transform duration-700 ease-out hover:-translate-y-1">
              <Sky
                name={categorySky[c]}
                className={`flex items-end rounded-[16px] p-2.5 transition-[filter] duration-700 group-hover:saturate-[1.25] ${
                  i === 4 ? "aspect-[2.1/1] sm:aspect-square" : "aspect-square"
                }`}
              >
                <span className="cap">{names[c]}</span>
              </Sky>
              <p className="t-small mt-3.5 px-1.5 text-soft">{items[c]}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// Pastel gradient tiles, one per tool
const tools = [
  { key: "figma", name: "Figma", mark: "Fg", group: "design", tile: "linear-gradient(145deg,#efe6ff,#d6c4fb)" },
  { key: "illustrator", name: "Illustrator", mark: "Ai", group: "design", tile: "linear-gradient(145deg,#fff0e2,#fbc9a6)" },
  { key: "photoshop", name: "Photoshop", mark: "Ps", group: "design", tile: "linear-gradient(145deg,#e8f6ff,#aedcf7)" },
  { key: "indesign", name: "InDesign", mark: "Id", group: "design", tile: "linear-gradient(145deg,#ffe9f1,#f7b8cf)" },
  { key: "aftereffects", name: "After Effects", mark: "Ae", group: "motion", tile: "linear-gradient(145deg,#ecebff,#c4c0f6)" },
  { key: "davinci", name: "DaVinci Resolve", mark: "Dr", group: "motion", tile: "linear-gradient(145deg,#fff8d9,#f3df8a)" },
];

export function Tools({
  eyebrow,
  title,
  groups,
  items,
  glass,
}: {
  eyebrow: string;
  title: string;
  groups: Record<string, string>;
  items: Record<string, string>;
  glass: GlassSettings;
}) {
  return (
    <section id="tools" className="board board-white scroll-mt-24">
      <Head eyebrow={eyebrow} title={title} />
      <ScrollReveal scale={1} yOffset={20}>
        <Dock glass={glass} tools={tools.map((t) => ({ ...t, group: groups[t.group], description: items[t.key] }))} />
      </ScrollReveal>
    </section>
  );
}

export function About({ eyebrow, title, body }: AboutContent) {
  return (
    <section id="about" className="board scroll-mt-24">
      <div className="grid gap-9 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-center md:gap-14">
        <div>
          <Head eyebrow={eyebrow} title={title} />
          {body
            .filter((p) => p.trim())
            .map((p, i) => (
              <ScrollReveal key={i} scale={1} yOffset={18}>
                <p className="t-lead mt-4 max-w-[58ch] text-soft first:mt-0">
                  <Tone text={p} />
                </p>
              </ScrollReveal>
            ))}
        </div>
        <ScrollReveal scale={1} yOffset={20} className="order-first md:order-none">
          <div className="card p-2.5">
            <div className="relative aspect-[1232/940] overflow-hidden rounded-[16px]">
              <AsciiImage src="/about/portrait.png" alt="Johan Yanten" sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
            </div>
          </div>
        </ScrollReveal>
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
  ascii,
}: ContactContent & { copied: string; ascii: string }) {
  return (
    <section id="contact" className="board board-white scroll-mt-24 text-center">
      <ScrollReveal scale={1} yOffset={20}>
        <div className="mx-auto h-[clamp(120px,19vw,250px)] max-w-5xl">
          <AsciiWord text={ascii} cell={8} />
        </div>
      </ScrollReveal>
      <ScrollReveal scale={1} yOffset={20} className="mx-auto mt-6 grid max-w-2xl justify-items-center gap-4">
        <span className="t-label text-soft">{eyebrow}</span>
        <h2 className="t-h2">
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
    <footer className="pt-6 pb-4">
      <div className="h-[clamp(70px,9vw,120px)] opacity-80">
        <AsciiWord text="JOHAN YANTEN" cell={6} waves={0.18} />
      </div>
      <div className="t-small flex flex-wrap items-center justify-between gap-4 px-2 pt-4 text-soft">
        <span>{text}</span>
        <a href="#" className="chip t-label inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-ink transition-colors duration-500 hover:bg-white">
          <Icon name="up" className="h-4 w-4" /> {top}
        </a>
      </div>
    </footer>
  );
}
