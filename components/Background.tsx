"use client";

import { motion } from "motion/react";

// Slow-moving soft color blobs behind the glass layers
const blobs = [
  { color: "#9ecbff", size: 520, x: ["-10%", "15%", "-10%"], y: ["-10%", "10%", "-10%"], left: "5%", top: "0%" },
  { color: "#ffc9a8", size: 460, x: ["10%", "-15%", "10%"], y: ["5%", "-10%", "5%"], left: "55%", top: "10%" },
  { color: "#d7c4ff", size: 420, x: ["0%", "10%", "0%"], y: ["10%", "-5%", "10%"], left: "30%", top: "50%" },
];

export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-50 blur-3xl"
          style={{ background: b.color, width: b.size, height: b.size, left: b.left, top: b.top }}
          animate={{ x: b.x, y: b.y }}
          transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
