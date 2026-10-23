import type { AboutContent, ContactContent } from "@/lib/content";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { Tone } from "./Mark";
import { CopyButton, ToolsCard } from "./Widgets";

// Who Johan is, next to the programs he works with
export function About({
  eyebrow,
  title,
  body,
  tools,
}: AboutContent & { tools: { label: string; title: string; items: Record<string, string> } }) {
  return (
    <section id="about" className="wrap scroll-mt-24 pt-24 sm:pt-32">
      <div className="bento">
        <Card className="col-span-2 lg:row-span-2">
          <div className="flex h-full flex-col gap-6 p-6 sm:p-8">
            <span
              aria-hidden
              className="grid h-14 w-14 place-items-center rounded-[18px] text-[19px] font-semibold tracking-tight text-white shadow-[0_8px_20px_-8px_rgba(131,58,180,0.6)]"
              style={{ background: "linear-gradient(135deg, #ff9a62 0%, #e1306c 45%, #6b5bff 100%)" }}
            >
              JY
            </span>
            <div>
              <p className="t-label text-ink-2">{eyebrow}</p>
              <h2 className="mt-1.5 max-w-[20ch] text-[clamp(26px,2.6vw,38px)] leading-[1.08] font-semibold tracking-[-0.03em]">
                <Tone text={title} />
              </h2>
            </div>
            <div className="mt-auto grid gap-4">
              {body
                .filter((p) => p.trim())
                .map((p, i) => (
                  <p key={i} className="t-lead text-ink-2">
                    <Tone text={p} soft="text-ink" />
                  </p>
                ))}
            </div>
          </div>
        </Card>
        <Card delay={0.12} className="col-span-2 lg:row-span-2">
          <ToolsCard {...tools} />
        </Card>
      </div>
    </section>
  );
}

// The call to action: a dark card with soft color glows
export function Contact({ title, subtitle, cta, instagram, handle, copied }: ContactContent & { copied: string }) {
  return (
    <section id="contact" className="wrap scroll-mt-24 pt-24 sm:pt-32">
      <Card dark>
        <div className="grid gap-10 p-7 sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-16">
          <div>
            <h2 className="t-title max-w-[16ch]">
              <Tone text={title} soft="text-white/50" />
            </h2>
            <p className="t-lead mt-4 max-w-md text-white/70">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              <Icon name="sparkle" className="h-4 w-4" /> {cta} <Icon name="external" className="h-4 w-4" />
            </a>
            {handle && <CopyButton text={handle} copied={copied} className="btn-ghost-light min-w-48" />}
          </div>
        </div>
      </Card>
    </section>
  );
}

export function Footer({ text, top }: { text: string; top: string }) {
  return (
    <footer className="wrap pt-16 pb-10">
      <div className="t-small flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-ink-2">
        <span>© Johan Yanten · {text}</span>
        <a href="#" className="group inline-flex items-center gap-1.5 font-medium text-ink">
          <Icon name="up" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" /> {top}
        </a>
      </div>
    </footer>
  );
}
