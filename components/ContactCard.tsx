"use client";

import { useState } from "react";
import { BorderBeam } from "border-beam";
import type { ContactContent } from "@/lib/content";
import { useWebHaptics } from "@/hooks/use-web-haptics";
import { MagneticButton } from "./amicro/magnetic-button";
import { Mark } from "./Mark";

export function ContactCard({ title, subtitle, cta, instagram, handle, copied }: ContactContent & { copied: string }) {
  const [done, setDone] = useState(false);
  const { trigger } = useWebHaptics();

  async function copy() {
    try {
      await navigator.clipboard.writeText(handle);
      trigger("success");
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      // Clipboard can be blocked; the handle is still visible on the button
    }
  }

  return (
    <BorderBeam size="md" colorVariant="colorful" theme="light" strength={0.7}>
      <div className="rounded-[32px] bg-white px-6 py-14 text-center shadow-[var(--shadow-soft)] sm:px-12 sm:py-16">
        <h2 className="mx-auto max-w-xl text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.03em] text-balance">
          <Mark text={title} />
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">{subtitle}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trigger("light")}
            className="k-gradient rounded-full px-6 py-3.5 font-bold"
          >
            ✨ {cta} <span aria-hidden>↗</span>
          </MagneticButton>
          {handle && (
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-w-40 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              {done ? `✓ ${copied}` : handle}
            </button>
          )}
        </div>
      </div>
    </BorderBeam>
  );
}
