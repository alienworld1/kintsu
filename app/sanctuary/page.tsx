"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CULTURES, LOADING_STATES } from "@/lib/constants";
import { FlippableCard } from "@/components/ui/FlippableCard";
import { ChevronDown, Sparkles, RefreshCw, MessageCircle } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getFallbackProverbs } from "@/lib/fallbacks";
import { ProverbOption } from "@/lib/types";
import { BridgeSendButton } from "@/components/ui/BridgeSendButton";
import { supabase } from "@/lib/supabase";
import { InsightBanner } from "@/components/ui/InsightBanner";
import { DatasetExport } from "@/components/ui/DatasetExport";
import { MendingSeam } from "@/components/ui/MendingSeam";
import { CrisisView } from "@/components/ui/CrisisView";
import { ChatPanel } from "@/components/ui/ChatPanel";
import { Toast } from "@/components/ui/Toast";

type Role = "child" | "parent";

const ROLE_CONFIG = {
  child: {
    burdenLabel: "The Burden",
    placeholder: "I feel like I'm failing my parents...",
    submitLabel: "Mend this thought",
    cardHeader: "The Mended Truth",
    burdenCardLabel: "The Burden",
  },
  parent: {
    burdenLabel: "What they said to you",
    placeholder: "My child told me they were exhausted and needed space...",
    submitLabel: "Understand their words",
    cardHeader: "What your child needed you to hear",
    burdenCardLabel: "What they said",
  },
};

const MOCK_PARENT_OPTIONS: ProverbOption[] = [
  {
    proverb_original: "The tree that bends in the storm does not break.",
    proverb_native_script: "嵐に揺れる木は折れない。",
    proverb_transliteration: "Arashi ni yureru ki wa orenai.",
    english: "The tree that bends does not break.",
    reframe:
      "Your child's need for space is not withdrawal — it is the bend that keeps the branch whole.",
    source: "Japanese Proverb",
    confidence: 87,
  },
  {
    proverb_original: "After rain, the earth hardens.",
    proverb_native_script: "비 온 뒤에 땅이 굳어진다.",
    proverb_transliteration: "Bi on dwie e ttang i gut eo jin da.",
    english: "After rain, the earth hardens.",
    reframe:
      "The exhaustion your child carries is not weakness — it is the ground preparing to hold more.",
    source: "Korean Proverb",
    confidence: 82,
  },
];

const PARENT_REFRAME =
  "In your culture, rest is earned. But your child is telling you their vessel is full — not that they have given up. This is the same duty, spoken in a different tongue.";

export default function SanctuaryPage() {
  const { anonId } = useAuth();
  const [role, setRole] = useState<Role>("child");
  const [step, setStep] = useState<"input" | "loading" | "result" | "crisis">("input");
  const [culture, setCulture] = useState("");
  const [emotion, setEmotion] = useState("");
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
  const [options, setOptions] = useState<ProverbOption[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [bridgeId, setBridgeId] = useState<string | null>(null);
  const [allowNods, setAllowNods] = useState(false);
  const [insightTease, setInsightTease] = useState<string | undefined>(undefined);
  const [showInsight, setShowInsight] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showChat, setShowChat] = useState(false);

  const config = ROLE_CONFIG[role];

  const handleToggleNods = async () => {
    if (!bridgeId) return;
    const newValue = !allowNods;
    setAllowNods(newValue);

    const { error } = await supabase
      .from("bridges")
      .update({ allow_nods: newValue })
      .eq("id", bridgeId);

    if (error) {
      console.error("Failed to update bridge:", error);
      setAllowNods(!newValue);
    }
  };

  const fetchProverbs = async () => {
    setStep("loading");
    setBridgeId(null);

    let stateIndex = 0;
    const interval = setInterval(() => {
      stateIndex = (stateIndex + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[stateIndex]);
    }, 1500);

    // Parent role: mock with timeout, no API call
    if (role === "parent") {
      await new Promise((resolve) => setTimeout(resolve, 2800));
      clearInterval(interval);
      setOptions(MOCK_PARENT_OPTIONS);
      setStep("result");
      return;
    }

    try {
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

      const data = (await Promise.race([fetchPromise, timeoutPromise])) as {
        options: ProverbOption[];
        bridge_id?: string;
        insight_tease?: string;
        crisis_detected?: boolean;
      };

      if (data.crisis_detected) {
        setStep("crisis");
        clearInterval(interval);
        return;
      }

      if (data.options && data.options.length > 0) {
        setOptions(data.options);
        if (data.bridge_id) setBridgeId(data.bridge_id);
        if (data.insight_tease) setInsightTease(data.insight_tease);
        setStep("result");
      } else {
        throw new Error("No options returned");
      }
    } catch (error) {
      console.warn("Falling back to static proverbs due to:", error);
      setOptions(getFallbackProverbs(culture));
      setStep("result");
    } finally {
      clearInterval(interval);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!culture || !emotion) return;

    const crisisRegex = /(suicid|kill myself|die|end it all|hurt myself)/i;
    if (crisisRegex.test(emotion)) {
      setStep("crisis");
      return;
    }

    const profanityRegex =
      /(fuck|shit|bitch|asshole|cunt|dick|pussy|whore|slut|bastard|damn|crap)/i;
    if (profanityRegex.test(emotion)) {
      setToastMessage("Let's keep the kiln clean. Please refine your thought.");
      setToastType("error");
      return;
    }

    fetchProverbs();
  };

  const handleReroll = () => {
    fetchProverbs();
  };

  const getShareText = () => {
    const opt = options[selectedOptionIndex];
    const link = bridgeId
      ? `\n\nRead more: ${window.location.origin}/bridge/${bridgeId}?idx=${selectedOptionIndex}`
      : "";
    return `${opt.reframe}\n\n"${opt.proverb_original}" - ${opt.source}${link}`;
  };

  // Reset result when role changes
  const handleRoleChange = (newRole: Role) => {
    if (newRole === role) return;
    setRole(newRole);
    if (step === "result") {
      setStep("input");
      setOptions([]);
      setSelectedOptionIndex(0);
      setShowInsight(false);
      setShowChat(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 bg-paper relative overflow-hidden">
      {/* Background Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-noise"></div>

      <Toast
        message={toastMessage || ""}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
        type={toastType}
      />

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

            {/* Role Toggle */}
            <div className="flex justify-center">
              <div className="relative flex items-center bg-clay/40 rounded-full p-1 border border-stone/15">
                {/* Sliding active pill */}
                <motion.div
                  className="absolute top-1 bottom-1 rounded-full bg-ink"
                  animate={{
                    left: role === "child" ? "4px" : "50%",
                    right: role === "child" ? "50%" : "4px",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
                <button
                  type="button"
                  onClick={() => handleRoleChange("child")}
                  className={`relative z-10 px-5 py-2 rounded-full font-sans text-sm font-medium tracking-wide transition-colors duration-200 ${
                    role === "child" ? "text-paper" : "text-stone hover:text-ink"
                  }`}
                >
                  I am a child
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("parent")}
                  className={`relative z-10 px-5 py-2 rounded-full font-sans text-sm font-medium tracking-wide transition-colors duration-200 ${
                    role === "parent" ? "text-paper" : "text-stone hover:text-ink"
                  }`}
                >
                  I am a parent
                </button>
              </div>
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
                <motion.label
                  key={config.burdenLabel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block text-xs font-sans font-bold tracking-widest text-stone uppercase"
                >
                  {config.burdenLabel}
                </motion.label>
                <textarea
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder={config.placeholder}
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
                  {config.submitLabel}
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

        {step === "crisis" && <CrisisView />}

        {step === "result" && options.length > 0 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md space-y-8"
          >
            <FlippableCard
              emotion={emotion}
              proverb={options[selectedOptionIndex].proverb_original}
              nativeScript={options[selectedOptionIndex].proverb_native_script}
              transliteration={options[selectedOptionIndex].proverb_transliteration}
              culture={culture}
              source={options[selectedOptionIndex].source}
              burdenLabel={config.burdenCardLabel}
              wisdomHeader={config.cardHeader}
              role={role}
            />

            <div className="text-center space-y-2">
              <p className="font-sans text-sm text-stone italic">
                {role === "parent"
                  ? `"${PARENT_REFRAME}"`
                  : `"${options[selectedOptionIndex].reframe}"`}
              </p>
              <p className="text-[10px] font-sans font-bold tracking-widest text-gold uppercase">
                Confidence: {options[selectedOptionIndex].confidence}%
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Primary Action: Bridge Send (child only) */}
              {role === "child" && (
                <BridgeSendButton
                  text={getShareText()}
                  bridgeId={bridgeId}
                  onSend={() => setShowInsight(true)}
                />
              )}

              {/* Insight Banner (Post-Send) */}
              {showInsight && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <InsightBanner culture={culture} insightTease={insightTease} />
                  <DatasetExport
                    userBridge={
                      bridgeId
                        ? {
                            id: bridgeId,
                            culture,
                            emotion,
                            insight: insightTease || options[selectedOptionIndex].reframe,
                          }
                        : undefined
                    }
                  />
                </div>
              )}

              {/* Seek a Nod Toggle (child only) */}
              {role === "child" && bridgeId && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="seek-nod"
                    checked={allowNods}
                    onChange={handleToggleNods}
                    className="w-4 h-4 accent-sage rounded border-stone/30 focus:ring-gold cursor-pointer"
                  />
                  <label
                    htmlFor="seek-nod"
                    className="font-sans text-sm text-sage italic cursor-pointer select-none"
                  >
                    Echo in community? (Allow nods)
                  </label>
                </div>
              )}

              {/* Talk to Kintsu */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => setShowChat(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 font-sans text-sm font-medium text-gold border border-gold/40 rounded-lg hover:bg-gold/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Talk to Kintsu
              </motion.button>

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
                  onClick={() => {
                    setStep("input");
                    setShowChat(false);
                  }}
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

      {/* Legal Shield */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-0 pointer-events-none px-4">
        <p className="font-sans text-[10px] text-stone/50 pointer-events-auto">
          Kintsu is an AI-powered cultural tool, not a clinical device. Results are for
          reflection, not diagnosis.{" "}
          <button
            onClick={() => setStep("crisis")}
            className="font-bold underline decoration-stone/30 hover:text-terra hover:decoration-terra transition-colors"
          >
            In crisis? Tap here.
          </button>
        </p>
      </div>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        role={role}
      />
    </main>
  );
}
