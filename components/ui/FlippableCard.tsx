"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, RefreshCcw, Sparkles } from "lucide-react";
import { ArtifactCard } from "@/components/ui/ArtifactCard";

type Role = "child" | "parent";
type CultureGroup = "south-asian" | "east-asian" | "universal";

interface FlippableCardProps {
  emotion?: string;
  proverb?: string;
  nativeScript?: string;
  transliteration?: string;
  culture?: string;
  source?: string;
  burdenLabel?: string;
  wisdomHeader?: string;
  role: Role;
}

// ─── Perspective copy ────────────────────────────────────────────────────────

const SOUTH_ASIAN_CULTURES = ["Indian", "Pakistani", "Sri Lankan", "Bangladeshi"];
const EAST_ASIAN_CULTURES = ["Chinese", "Japanese", "Korean", "Taiwanese", "Vietnamese"];

function getCultureGroup(culture: string): CultureGroup {
  if (SOUTH_ASIAN_CULTURES.some((c) => culture.includes(c))) return "south-asian";
  if (EAST_ASIAN_CULTURES.some((c) => culture.includes(c))) return "east-asian";
  return "universal";
}

const PERSPECTIVES: Record<Role, Record<CultureGroup, [string, string, string]>> = {
  child: {
    "south-asian": [
      "Your child is not rejecting your sacrifices. They are carrying them — and the weight has become too much to hide.",
      "In our tradition, we were taught that showing struggle is weakness. Your child is breaking that silence for both of you.",
      "They came to you because you are still their first safe place.",
    ],
    "east-asian": [
      "Your child understands duty deeply — they learned it from you. What they are asking for is not an escape from it, but a moment to breathe inside it.",
      "Silence in our families often means love. But your child needs to hear the love spoken aloud, just once.",
      "They are not losing the culture. They are trying to survive inside it.",
    ],
    universal: [
      "Your child is not asking you to understand everything. They are asking you to stay close while they figure it out.",
      "What sounds like distance is often a child trying not to disappoint the person they love most.",
      "They brought this to you because somewhere, they still believe you can cross this together.",
    ],
  },
  parent: {
    "south-asian": [
      "Your parent's silence is not disapproval. It is a generation that was never given the words for tenderness.",
      "They built walls to protect you from what broke them. They don't yet know the walls kept you out too.",
      "When they push back hardest, it is usually because they are most afraid of losing you.",
    ],
    "east-asian": [
      "Your parent expresses love through action — showing up, providing, sacrificing. The words feel unnecessary to them because to them, the actions already said everything.",
      "They do not lack emotion. They lack the language their generation was never taught.",
      "Their expectations are their way of saying: I believe you are capable of more than I ever was.",
    ],
    universal: [
      "Your parent is not your obstacle. They are a person who was never taught how to do this differently.",
      "The love is there. It just learned to speak in worry, in criticism, in silence — because that's all it was ever shown.",
      "They are also trying to cross this bridge. They just don't know it exists yet.",
    ],
  },
};

// ─── Flip trigger button ──────────────────────────────────────────────────────

function FlipButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      title="See the other side"
      aria-label="Flip card to see the other perspective"
      className="w-8 h-8 rounded-full bg-gold/10 hover:bg-gold/30 text-gold flex items-center justify-center transition-colors"
    >
      <RefreshCcw className="w-3.5 h-3.5" />
    </button>
  );
}

// ─── Back face ───────────────────────────────────────────────────────────────

interface BackFaceProps {
  role: Role;
  culture: string;
  proverb: string;
  nativeScript?: string;
  transliteration?: string;
  source: string;
  onFlip: (e: React.MouseEvent) => void;
}

function BackFace({
  role,
  culture,
  proverb,
  nativeScript,
  transliteration,
  source,
  onFlip,
}: BackFaceProps) {
  const group = getCultureGroup(culture);
  const lines = PERSPECTIVES[role][group];
  const perspectiveLabel = role === "child" ? "Through a Parent's Eyes" : "Through Their Eyes";

  return (
    <div className="w-full h-full rounded-xl bg-paper border border-sage/30 p-8 shadow-[0_20px_40px_-15px_rgba(43,41,38,0.1)] overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-sage" />
          <p className="text-xs font-sans font-bold tracking-widest text-sage uppercase">
            {perspectiveLabel}
          </p>
        </div>
      </div>

      {/* Gold Seam */}
      <div className="relative h-8 w-full flex items-center justify-center my-4">
        <div className="absolute inset-x-0 h-px bg-stone/20" />
        <svg
          className="absolute w-full h-6 text-gold"
          viewBox="0 0 400 24"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 L 100 10 L 150 14 L 200 11 L 250 13 L 300 10 L 400 12"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Proverb */}
      <div className="mt-8 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-gold" />
          <p className="text-xs font-sans font-bold tracking-widest text-gold uppercase">
            The Same Wisdom
          </p>
        </div>
        {nativeScript && (
          <p className="font-serif text-lg text-stone/60 mb-1">{nativeScript}</p>
        )}
        {transliteration && (
          <p className="font-sans text-xs text-stone/40 italic mb-4 tracking-wide">
            {transliteration}
          </p>
        )}
        <p className="font-serif text-xl text-ink leading-relaxed">"{proverb}"</p>
      </div>

      {/* Perspective lines */}
      <div className="space-y-0">
        {lines.map((line, i) => (
          <div key={i}>
            <p className="font-serif text-lg text-ink italic leading-relaxed">{line}</p>
            {i < lines.length - 1 && (
              <div className="flex items-center justify-center py-4">
                <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-stone/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sage" />
          <span className="text-[10px] font-sans tracking-widest text-stone uppercase">
            The Other Side
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-sans text-stone/60">Source: {source}</span>
          <FlipButton onClick={onFlip} />
        </div>
      </div>
    </div>
  );
}

// ─── FlippableCard ────────────────────────────────────────────────────────────

export function FlippableCard({
  emotion,
  proverb = "",
  nativeScript,
  transliteration,
  culture = "",
  source = "",
  burdenLabel,
  wisdomHeader,
  role,
}: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: "1200px" }}
    >
      {/* 3D rotating inner wrapper */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full"
      >
        {/* ── Front face ── */}
        <div style={{ backfaceVisibility: "hidden" }} className="relative w-full">
          {/* Wrapper lets us overlay the flip button without touching ArtifactCard */}
          <div className="relative">
            <ArtifactCard
              emotion={emotion}
              proverb={proverb}
              nativeScript={nativeScript}
              transliteration={transliteration}
              culture={culture}
              source={source}
              burdenLabel={burdenLabel}
              wisdomHeader={wisdomHeader}
            />
            {/* Flip trigger — absolute inside the card's bottom-right */}
            <div className="absolute bottom-[1.65rem] right-8">
              <FlipButton onClick={handleFlip} />
            </div>
          </div>
        </div>

        {/* ── Back face ── */}
        <div
          className="absolute inset-0"
          style={{ rotateY: 180, backfaceVisibility: "hidden" } as React.CSSProperties}
        >
          <BackFace
            role={role}
            culture={culture}
            proverb={proverb}
            nativeScript={nativeScript}
            transliteration={transliteration}
            source={source}
            onFlip={handleFlip}
          />
        </div>
      </motion.div>

      {/* Gold shimmer — peaks at the halfway point of the flip */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gold/20 pointer-events-none"
        animate={{
          opacity: isFlipped
            ? [0, 0.35, 0]
            : [0, 0.35, 0],
        }}
        transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.5, 1] }}
        key={String(isFlipped)}
      />
    </div>
  );
}
