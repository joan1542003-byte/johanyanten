'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  className?: string;
}

// Rises in once when it enters the viewport. The motion itself is a CSS transition (.reveal in globals.css)
export function ScrollReveal({
  children,
  duration = 1.1,
  yOffset = 30,
  xOffset = 0,
  scale = 0.95,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
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
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={
        {
          '--rd': `${duration}s`,
          '--ry': `${yOffset}px`,
          '--rx': `${xOffset}px`,
          '--rs': scale,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
