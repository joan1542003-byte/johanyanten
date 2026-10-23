"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "./Icon";

// YouTube only loads when the visitor asks for it: until then, its poster and a play button.
// Keeps the page fast and free of third-party scripts on arrival
export function Video({ id, title, play, sizes }: { id: string; title: string; play: string; sizes: string }) {
  const [on, setOn] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  if (on) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 h-full w-full" aria-label={`${play}: ${title}`}>
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        quality={90}
        // Not every video has a full-size poster; fall back to the one that always exists
        onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
        className="object-cover transition-[scale] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-linear-to-t from-black/45 to-black/5" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="flex items-center gap-3 rounded-full bg-white/90 py-3 pr-6 pl-4 text-[16px] font-medium text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-active:scale-95">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
            <Icon name="play" className="h-4 w-4 translate-x-px" />
          </span>
          {play}
        </span>
      </span>
    </button>
  );
}
