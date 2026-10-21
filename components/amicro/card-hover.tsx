'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

interface CardHoverProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getHref: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  /** Classes for the soft background that glides between hovered cards */
  highlightClassName?: string;
}

// A soft background glides to whichever card is hovered
export function CardHover<T>({
  items,
  getKey,
  getHref,
  renderItem,
  className = '',
  highlightClassName = 'bg-neutral-200',
}: CardHoverProps<T>) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`grid w-full ${className}`}>
      {items.map((item, idx) => (
        <Link
          key={getKey(item)}
          href={getHref(item)}
          transitionTypes={['nav-forward']}
          className="relative group block h-full w-full p-2 no-underline"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className={`absolute inset-0 -z-10 block h-full w-full rounded-[44px] ${highlightClassName}`}
                layoutId="hoverBackground"
                transition={{ type: 'spring', stiffness: 170, damping: 28 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.35 } }}
                exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-20 h-full">{renderItem(item)}</div>
        </Link>
      ))}
    </div>
  );
}
