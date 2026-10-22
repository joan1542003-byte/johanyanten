import type { ReactNode } from "react";
import { ScrollReveal } from "./amicro/scroll-reveal";

// Two-tone text, as in Relevo: *the part in asterisks* takes the soft gray second tone
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

// Section header: small label, two-tone title, optional lead and controls on the side
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
    <ScrollReveal scale={1} yOffset={18} className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
      <div className="grid max-w-[66ch] gap-2">
        <span className="text-[13px] font-semibold text-soft">{eyebrow}</span>
        <h2 className="text-[clamp(28px,3.6vw,44px)] leading-[1.04] font-semibold">
          <Tone text={title} />
        </h2>
        {lead && <p className="mt-1 text-[17px] text-soft">{lead}</p>}
      </div>
      {children}
    </ScrollReveal>
  );
}
