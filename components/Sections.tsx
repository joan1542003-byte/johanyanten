import Image from "next/image";
import type { AboutContent, Category, ContactContent } from "@/lib/content";
import { categorySky } from "@/lib/skies";
import { ScrollReveal } from "./amicro/scroll-reveal";
import { Head, Tone } from "./Mark";
import { Sky } from "./Sky";
import { ContactActions } from "./ContactCard";
import { Art, type ArtName } from "./ascii/Art";
import { AsciiScene } from "./ascii/AsciiScene";
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

type SceneText = { caption: string; label: string };

// Full-screen scene behind a section, a wash so the words stay readable, and the caption of the place
function Backdrop({ scene, text, wash }: { scene: "desert" | "sea"; text: SceneText; wash: string }) {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <AsciiScene scene={scene} label={text.label} />
      </div>
      <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${wash}`} />
      <p className="pointer-events-none absolute right-[clamp(18px,4vw,40px)] bottom-6 font-mono text-[13px] text-ink/45">
        {text.caption}
      </p>
    </>
  );
}

export function About({ title, body, scene }: AboutContent & { scene: SceneText }) {
  return (
    <section id="about" className="relative isolate scroll-mt-20 overflow-hidden">
      <Backdrop
        scene="desert"
        text={scene}
        wash="bg-[linear-gradient(180deg,rgba(var(--paper-rgb),0.96)_0%,rgba(var(--paper-rgb),0.8)_42%,rgba(var(--paper-rgb),0)_68%)] lg:bg-[linear-gradient(90deg,rgba(var(--paper-rgb),0.95)_0%,rgba(var(--paper-rgb),0.75)_34%,rgba(var(--paper-rgb),0)_58%)]"
      />
      <div className="wrap flex min-h-[100svh] items-start py-[clamp(96px,12vw,160px)] lg:items-center">
        <div className="max-w-[540px]">
          <Head title={title} />
          {body
            .filter((p) => p.trim())
            .map((p, i) => (
              <ScrollReveal key={i} scale={1} yOffset={18}>
                <p className="t-lead mt-5 text-soft first:mt-0">
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
  scene,
}: ContactContent & { copied: string; scene: SceneText }) {
  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden text-center">
      <Backdrop
        scene="sea"
        text={scene}
        wash="bg-[radial-gradient(60%_42%_at_50%_36%,rgba(var(--paper-rgb),0.9)_0%,rgba(var(--paper-rgb),0.55)_55%,rgba(var(--paper-rgb),0)_100%)]"
      />
      <div className="wrap flex min-h-[100svh] flex-col items-center pt-[clamp(120px,20svh,220px)] pb-24">
        <ScrollReveal scale={1} yOffset={24} className="grid justify-items-center gap-5">
          <h2 className="t-h2 max-w-[20ch]">
            <Tone text={title} />
          </h2>
          <p className="t-lead max-w-md text-soft">{subtitle}</p>
          <ContactActions href={instagram} cta={cta} handle={handle} copied={copied} />
        </ScrollReveal>
      </div>
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
