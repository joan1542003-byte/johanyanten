import type { ReactNode } from "react";
import { skyBackground, type SkyName } from "@/lib/skies";

// A grainy sky tile; children sit on top (usually a white .cap label)
export function Sky({ name, className = "", children }: { name: SkyName; className?: string; children?: ReactNode }) {
  return (
    <div className={`grain overflow-hidden ${className}`} style={{ background: skyBackground(name) }}>
      {children}
    </div>
  );
}
