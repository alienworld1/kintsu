"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function GoldSeam({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <div ref={ref} className={`relative w-full h-full flex justify-center ${className}`}>
      <motion.svg
        width="20"
        height="100%"
        viewBox="0 0 20 800"
        fill="none"
        preserveAspectRatio="none"
        className="h-full w-6 overflow-visible"
      >
        <motion.path
          d="M10 0 C 12 50, 8 100, 10 150 C 13 200, 7 250, 10 300 C 12 350, 8 400, 10 450 C 13 500, 7 550, 10 600 C 12 650, 8 700, 10 750 L 10 800"
          stroke="var(--color-gold)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </motion.svg>
    </div>
  );
}
