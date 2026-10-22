import type { ReactNode } from "react";
import { ScrollReveal } from "./amicro/scroll-reveal";

// Two-tone text, as in Relevo: *the part in asterisks* takes the deep pastel gradient
export function Tone({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="tone">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

// Section header: label, two-tone title, optional lead and controls on the side
export function Head({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <ScrollReveal scale={1} yOffset={20} className="mb-9 flex flex-wrap items-end justify-between gap-6 sm:mb-11">
      <div className="grid max-w-[64ch] gap-2.5">
        <span className="t-label text-soft">{eyebrow}</span>
        <h2 className="t-h2">
          <Tone text={title} />
        </h2>
        {lead && <p className="t-lead mt-1 text-soft">{lead}</p>}
      </div>
      {children}
    </ScrollReveal>
  );
}
