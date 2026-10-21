'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ease } from '@/lib/motion';

interface BlurTextProps {
  text: string;
  duration?: number;
  staggerDelay?: number;
  /** Blur at the start of each word; kept very low on purpose */
  initialBlur?: string;
  delay?: number;
  className?: string;
  /** Class applied to *marked* segments of the text */
  markClassName?: string;
}

// Adapted from amicro's blur-text: reveals word by word, rising softly, with only a hint of blur
export function BlurText({
  text,
  duration = 1,
  staggerDelay = 0.06,
  initialBlur = '2px',
  delay = 0,
  className = '',
  markClassName = '',
}: BlurTextProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: '0.25em', filter: `blur(${initialBlur})` },
    visible: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration, ease } },
  };

  // Words keep together so lines never break mid-word; *segments* get markClassName
  const segments = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let key = 0;

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={className}
    >
      {segments.map((segment) => {
        const marked = segment.startsWith('*') && segment.endsWith('*');
        const words = (marked ? segment.slice(1, -1) : segment).split(/(\s+)/);
        // The highlight rides on each word, so it appears together with it
        return words.map((word) =>
          /^\s+$/.test(word) ? (
            <span key={key++}> </span>
          ) : word ? (
            <motion.span
              key={key++}
              variants={wordVariants}
              className={`inline-block whitespace-nowrap ${marked ? markClassName : ''}`}
            >
              {word}
            </motion.span>
          ) : null,
        );
      })}
    </motion.span>
  );
}
