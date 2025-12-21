"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CULTURES, LOADING_STATES } from "@/lib/constants";
import { ArtifactCard } from "@/components/ui/ArtifactCard";
import { ChevronDown, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getFallbackProverbs } from "@/lib/fallbacks";
import { ProverbOption } from "@/lib/types";
import { BridgeSendButton } from "@/components/ui/BridgeSendButton";
import { supabase } from "@/lib/supabase";
import { InsightBanner } from "@/components/ui/InsightBanner";
import { DatasetExport } from "@/components/ui/DatasetExport";
import { MendingSeam } from "@/components/ui/MendingSeam";

export default function SanctuaryPage() {
  const { anonId } = useAuth();
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [culture, setCulture] = useState("");
  const [emotion, setEmotion] = useState("");
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
  const [options, setOptions] = useState<ProverbOption[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  const [allowNods, setAllowNods] = useState(false);
  const [insightTease, setInsightTease] = useState<string | undefined>(undefined);
  const [showInsight, setShowInsight] = useState(false);

  const handleToggleNods = async () => {
    if (!bridgeId) return;
    const newValue = !allowNods;
    setAllowNods(newValue);
    
    // Update bridge in Supabase
    const { error } = await supabase
      .from("bridges")
      .update({ allow_nods: newValue })
      .eq("id", bridgeId);
      
    if (error) {
      console.error("Failed to update bridge:", error);
      // Revert state if failed
      setAllowNods(!newValue);
    }
  };

  const fetchProverbs = async () => {
    setStep("loading");
    setBridgeId(null);
    
    // Optimistic UI: Cycle loading text
    let stateIndex = 0;
    const interval = setInterval(() => {
      stateIndex = (stateIndex + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[stateIndex]);
    }, 1500);

    try {
      // Race between API call and 5s timeout
      const fetchPromise = fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion, culture, anon_id: anonId }),
      }).then(async (res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 15000)
      );

      const data = await Promise.race([fetchPromise, timeoutPromise]) as { options: ProverbOption[], bridge_id?: string, insight_tease?: string };
      
      if (data.options && data.options.length > 0) {
        setOptions(data.options);
        if (data.bridge_id) setBridgeId(data.bridge_id);
        if (data.insight_tease) setInsightTease(data.insight_tease);
      } else {
        throw new Error("No options returned");
      }

    } catch (error) {
      console.warn("Falling back to static proverbs due to:", error);
      setOptions(getFallbackProverbs(culture));
    } finally {
      clearInterval(interval);
      setStep("result");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!culture || !emotion) return;
    fetchProverbs();
  };

  const handleReroll = () => {
    fetchProverbs();
  };

  const getShareText = () => {
    const opt = options[selectedOptionIndex];
    const link = bridgeId ? `\n\nRead more: ${window.location.origin}/bridge/${bridgeId}?idx=${selectedOptionIndex}` : "";
    return `${opt.reframe}\n\n"${opt.proverb_original}" - ${opt.source}${link}`;
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
                  className="w-full bg-transparent border-b border-stone/30 py-3 font-serif text-xl text-ink placeholder:text-wash focus:border-gold focus:outline-none transition-colors resize-none min-h-30"
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
            className="relative z-10 text-center space-y-6 w-full max-w-md"
          >
            <MendingSeam />
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

        {step === "result" && options.length > 0 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md space-y-8"
          >
            <ArtifactCard
              emotion={emotion}
              proverb={options[selectedOptionIndex].proverb_original}
              nativeScript={options[selectedOptionIndex].proverb_native_script}
              transliteration={options[selectedOptionIndex].proverb_transliteration}
              culture={culture}
              source={options[selectedOptionIndex].source}
            />
            
            <div className="text-center space-y-2">
               <p className="font-sans text-sm text-stone italic">
                 "{options[selectedOptionIndex].reframe}"
               </p>
               <p className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">
                 Confidence: {options[selectedOptionIndex].confidence}%
               </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Primary Action: Bridge Send */}
              <BridgeSendButton 
                text={getShareText()} 
                bridgeId={bridgeId}
                onSend={() => setShowInsight(true)}
              />

              {/* Insight Banner (Post-Send) */}
              {showInsight && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <InsightBanner culture={culture} insightTease={insightTease} />
                  <DatasetExport 
                    userBridge={bridgeId ? {
                      id: bridgeId,
                      culture,
                      emotion,
                      insight: insightTease || options[selectedOptionIndex].reframe
                    } : undefined} 
                  />
                </div>
              )}

              {/* Seek a Nod Toggle */}
              {bridgeId && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="seek-nod"
                    checked={allowNods}
                    onChange={handleToggleNods}
                    className="w-4 h-4 accent-sage rounded border-stone/30 focus:ring-gold cursor-pointer"
                  />
                  <label htmlFor="seek-nod" className="font-sans text-sm text-sage italic cursor-pointer select-none">
                    Echo in community? (Allow nods)
                  </label>
                </div>
              )}

              {/* Secondary Actions */}
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleReroll}
                  className="group flex items-center gap-2 px-6 py-2 font-sans text-sm text-stone border border-stone/20 rounded-full hover:bg-sage hover:text-paper hover:border-transparent transition-all"
                >
                  <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                  Reroll Wisdom
                </button>
                
                <button 
                  onClick={() => setStep("input")}
                  className="px-6 py-2 font-sans text-sm text-stone border border-stone/20 rounded-full hover:bg-stone/5 transition-colors"
                >
                  New Thought
                </button>
              </div>
            </div>
            
            {/* Option Dots */}
            <div className="flex justify-center gap-2">
              {options.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOptionIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === selectedOptionIndex ? "bg-gold" : "bg-stone/20 hover:bg-stone/40"
                  }`}
                  aria-label={`View option ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
