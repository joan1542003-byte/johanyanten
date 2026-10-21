'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ease } from '@/lib/motion';

interface FadeUpProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  className?: string;
}

export function FadeUp({
  children,
  duration = 1,
  delay = 0,
  yOffset = 20,
  className = '',
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
