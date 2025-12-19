"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CULTURES, LOADING_STATES } from "@/lib/constants";
import { ArtifactCard } from "@/components/ui/ArtifactCard";
import { ChevronDown, Sparkles } from "lucide-react";

export default function SanctuaryPage() {
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [culture, setCulture] = useState("");
  const [emotion, setEmotion] = useState("");
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
  const [result, setResult] = useState<{ proverb: string; source: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!culture || !emotion) return;

    setStep("loading");

    // Simulate loading sequence
    let stateIndex = 0;
    const interval = setInterval(() => {
      stateIndex = (stateIndex + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[stateIndex]);
    }, 1500);

    // Mock API call delay
    setTimeout(() => {
      clearInterval(interval);
      setResult({
        proverb: "Even a monkey falls from the tree.",
        source: "Japanese Proverb"
      });
      setStep("result");
    }, 4500);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 bg-paper relative overflow-hidden">
      {/* Background Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-noise"></div>

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-lg space-y-12"
          >
            <div className="text-center space-y-4">
              <h1 className="font-serif text-4xl text-ink italic">The Sanctuary</h1>
              <p className="font-sans text-stone text-sm tracking-wide">
                Where heavy words become gold.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-xs font-sans font-bold tracking-widest text-stone uppercase">
                  Your Heritage
                </label>
                <div className="relative">
                  <select
                    value={culture}
                    onChange={(e) => setCulture(e.target.value)}
                    className="w-full appearance-none bg-transparent border-b border-stone/30 py-3 pr-8 font-serif text-xl text-ink focus:border-gold focus:outline-none transition-colors cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select a culture...</option>
                    {CULTURES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-stone pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-sans font-bold tracking-widest text-stone uppercase">
                  The Burden
                </label>
                <textarea
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="I feel like I'm failing my parents..."
                  className="w-full bg-transparent border-b border-stone/30 py-3 font-serif text-xl text-ink placeholder:text-wash focus:border-gold focus:outline-none transition-colors resize-none min-h-[120px]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!culture || !emotion}
                className="w-full group relative flex items-center justify-center px-8 py-4 overflow-hidden font-sans font-medium tracking-wide text-ink bg-gold rounded-lg transition-all hover:bg-sage hover:text-paper disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Mend this thought
                </span>
              </button>
            </form>
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-serif text-xl text-gold italic"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}

        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md"
          >
            <ArtifactCard
              emotion={emotion}
              proverb={result.proverb}
              culture={culture}
              source={result.source}
            />
            
            <div className="mt-8 flex justify-center gap-4">
              <button 
                onClick={() => setStep("input")}
                className="px-6 py-2 font-sans text-sm text-stone border border-stone/20 rounded-full hover:bg-stone/5 transition-colors"
              >
                Mend another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
