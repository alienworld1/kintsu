"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare } from "lucide-react";

export function CrisisView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md space-y-8 text-center"
    >
      {/* The Knot (Symbolizing a lifeline) */}
      <div className="relative h-24 w-full flex items-center justify-center">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          className="text-gold"
        >
          <path
            d="M20 50 C 20 30, 40 30, 50 50 C 60 70, 80 70, 80 50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="opacity-50"
          />
          <path
            d="M50 20 C 30 20, 30 40, 50 50 C 70 60, 70 80, 50 80"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-3xl text-ink italic">
          Some cracks are too deep to mend alone.
        </h2>
        <p className="font-sans text-stone text-lg leading-relaxed">
          Your life is the gold. Please let a human hold this weight with you.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <a
          href="tel:988"
          className="w-full flex items-center justify-center gap-2 px-8 py-4 font-sans font-medium tracking-wide text-paper bg-gold rounded-lg transition-all hover:bg-gold-leaf shadow-lg shadow-gold/20"
        >
          <Phone className="w-5 h-5" />
          Call 988 (Lifeline)
        </a>
        
        <a
          href="sms:741741?body=HOME"
          className="w-full flex items-center justify-center gap-2 px-8 py-4 font-sans font-medium tracking-wide text-paper bg-sage rounded-lg transition-all hover:bg-[#5A5E4D]"
        >
          <MessageSquare className="w-5 h-5" />
          Text 'HOME' to 741741
        </a>
      </div>

      <div className="pt-8">
        <p className="font-sans text-xs text-stone/60">
          Kintsu is an AI tool, not a crisis service. Immediate help is available 24/7, free and confidential.
        </p>
      </div>
    </motion.div>
  );
}
