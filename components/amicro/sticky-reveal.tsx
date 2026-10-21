'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';

interface StickyRevealProps {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  className?: string;
  visualClassName?: string;
}

// Text steps scroll on one side while the matching visual stays pinned on the other.
// On phones each visual simply follows its text.
export function StickyReveal({ content, className = '', visualClassName = '' }: StickyRevealProps) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestIndex = cardsBreakpoints.reduce((acc, val, index) => {
      if (latest >= val) {
        return index;
      }
      return acc;
    }, 0);
    setActiveCard(closestIndex);
  });

  return (
    <div ref={ref} className={`relative flex justify-between gap-10 ${className}`}>
      <div className="flex w-full flex-col gap-12 md:w-5/12 md:gap-32 md:py-10">
        {content.map((item, index) => (
          <div key={index} className="flex flex-col justify-center md:min-h-[60vh]">
            <motion.h2
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-3 text-sm font-semibold tracking-wide uppercase"
            >
              {item.title}
            </motion.h2>
            {item.description && (
              <motion.p animate={{ opacity: activeCard === index ? 1 : 0.3 }} className="leading-relaxed">
                {item.description}
              </motion.p>
            )}
            <div className="mt-6 md:hidden">{item.content}</div>
          </div>
        ))}
      </div>

      <div
        className={`sticky top-24 hidden h-[70vh] w-7/12 items-center justify-center overflow-hidden md:flex ${visualClassName}`}
      >
        {content.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: activeCard === index ? 1 : 0,
              scale: activeCard === index ? 1 : 0.96,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center p-3"
          >
            {item.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
