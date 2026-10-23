"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode, type Ref } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Makes the whole card a link that lifts on hover */
  href?: string;
  /** Opens href in a new tab */
  external?: boolean;
  /** Accessible name when the card is a link */
  label?: string;
  transitionTypes?: string[];
  /** Entrance delay in seconds, for staggered grids */
  delay?: number;
  dark?: boolean;
  id?: string;
  style?: CSSProperties;
};

// A bento card: it rises in once it reaches the screen, and its edge lights up under the pointer
export function Card({ children, className = "", href, external, label, transitionTypes, delay = 0, dark, id, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const props = {
    className: `card reveal ${shown ? "is-in" : ""} ${dark ? "card-dark" : ""} ${href ? "card-link block" : ""} ${className}`,
    style: { ...style, "--delay": `${delay}s` } as CSSProperties,
    onPointerMove,
  };

  if (href && external) {
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} {...props}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link ref={ref as Ref<HTMLAnchorElement>} href={href} transitionTypes={transitionTypes} aria-label={label} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <div ref={ref as Ref<HTMLDivElement>} id={id} {...props}>
      {children}
    </div>
  );
}
