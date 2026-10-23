"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "fill" | "width" | "height"> & { boxClassName?: string };

// Fills its parent. Fades and settles in once loaded, over a soft shimmer; never stays hidden
export function Photo({ alt, className = "", boxClassName = "", ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`photo-box absolute inset-0 overflow-hidden ${boxClassName}`} data-loaded={loaded ? "" : undefined}>
      <Image
        {...props}
        alt={alt}
        fill
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`photo object-cover ${className}`}
      />
    </div>
  );
}
