import React from 'react';

interface FadeUpProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  className?: string;
}

// Rises in on load. Pure CSS (.enter in globals.css), so it starts with the first paint
export function FadeUp({
  children,
  duration = 1.1,
  delay = 0,
  yOffset = 20,
  className = '',
}: FadeUpProps) {
  return (
    <div
      className={`enter ${className}`}
      style={{ '--rd': `${duration}s`, '--delay': `${delay}s`, '--ry': `${yOffset}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
