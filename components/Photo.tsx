"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "fill" | "width" | "height"> & {
  boxClassName?: string;
  /**
   * Fade in once loaded. Off for images that morph between pages: a view transition captures the
   * page at once, and a half-faded image would morph into an empty box.
   */
  fade?: boolean;
};

// Fills its parent, at high quality. Fades and settles in over a soft shimmer; never stays hidden
export function Photo({ alt, className = "", boxClassName = "", fade = true, quality = 90, ...props }: Props) {
  const [loaded, setLoaded] = useState(!fade);

  useEffect(() => {
    if (!fade) return;
    const t = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(t);
  }, [fade]);

  return (
    <div className={`photo-box absolute inset-0 overflow-hidden ${boxClassName}`} data-loaded={loaded ? "" : undefined}>
      <Image
        {...props}
        alt={alt}
        fill
        quality={quality}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`photo object-cover ${className}`}
      />
    </div>
  );
}
