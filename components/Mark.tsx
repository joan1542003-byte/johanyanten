import type { ReactNode } from "react";
import { ScrollReveal } from "./amicro/scroll-reveal";

// Two-tone text, as in Relevo: *the part in asterisks* takes the soft second tone
export function Tone({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="text-mute">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

// Section heading: a two-tone title, with optional controls on the side
export function Head({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <ScrollReveal scale={1} yOffset={20} className="mb-12 flex flex-wrap items-end justify-between gap-8 sm:mb-16">
      <h2 className="t-h2 max-w-[22ch]">
        <Tone text={title} />
      </h2>
      {children}
    </ScrollReveal>
  );
}
