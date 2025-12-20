"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface InsightBannerProps {
  culture: string;
  insightTease?: string;
}

export function InsightBanner({ culture, insightTease }: InsightBannerProps) {
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);

  useEffect(() => {
    // Fetch aggregate count
    fetch("/api/insights")
      .then((res) => res.json())
      .then((data) => {
        setTargetCount(data.total || 450);
      })
      .catch(() => setTargetCount(450));
  }, []);

  useEffect(() => {
    if (targetCount > 0) {
      let start = 0;
      const end = targetCount;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [targetCount]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md space-y-6 pt-8 border-t border-gold/20 overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="font-sans text-xs tracking-widest text-gold uppercase">
            Archive Momentum
          </span>
          <span className="font-serif text-lg text-ink italic">
            {count} weaves
          </span>
        </div>
        <div className="h-1 w-full bg-stone/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "65%" }} // Arbitrary visual fill for "momentum"
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gold"
          />
        </div>
        <p className="text-[10px] font-sans text-stone/60 text-right">
          {culture} silence reframed today
        </p>
      </div>

      {/* Personal Insight */}
      <div className="relative p-6 bg-paper border border-gold/30 rounded-lg shadow-[0_4px_20px_-5px_rgba(176,141,85,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Sparkles className="w-4 h-4" />
            <span className="font-sans text-xs font-bold tracking-widest uppercase">
              Your Contribution
            </span>
          </div>
          <h3 className="font-serif text-xl text-ink italic leading-relaxed">
            "{insightTease || "Your thread strengthens the gold."}"
          </h3>
          <p className="font-sans text-xs text-stone">
            Added to the decolonized dataset.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
