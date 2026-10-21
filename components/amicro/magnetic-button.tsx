'use client';

import React, { useRef } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  range?: number;
  strength?: number;
  className?: string;
  onClick?: () => void;
  /** Renders a link instead of a button */
  href?: string;
  target?: string;
  rel?: string;
}

export function MagneticButton({
  children,
  range = 45,
  strength = 0.35,
  className = '',
  onClick,
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  // Critically damped: follows the pointer without wobbling back
  const springConfig = { stiffness: 150, damping: 20, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Center point of the button
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate distance
    const dist = Math.hypot(clientX - centerX, clientY - centerY);

    if (dist < range) {
      // Magnetic pull
      x.set((clientX - centerX) * strength);
      y.set((clientY - centerY) * strength);
    } else {
      // Return to center
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    style: { x, y },
    whileTap: { scale: 0.97 },
    className: `relative inline-flex items-center justify-center cursor-pointer select-none ${className}`,
  };
  const content = <span className="relative z-10 flex items-center gap-2 pointer-events-none">{children}</span>;

  return href ? (
    <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} target={target} rel={rel} {...shared}>
      {content}
    </motion.a>
  ) : (
    <motion.button ref={ref as React.RefObject<HTMLButtonElement>} {...shared}>
      {content}
    </motion.button>
  );
}
