import { Sparkles } from "lucide-react";

interface ArtifactCardProps {
  emotion?: string;
  proverb?: string;
  nativeScript?: string;
  transliteration?: string;
  culture?: string;
  source?: string;
}

export function ArtifactCard({ 
  emotion = "I told my mom I was tired. She heard 'lazy'.", 
  proverb = "Rest is not a rejection of work. It is the preparation for it.",
  nativeScript,
  transliteration,
  culture = "Japanese",
  source = "Japanese Proverb"
}: ArtifactCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto bg-clay rounded-xl p-8 shadow-[0_20px_40px_-15px_rgba(43,41,38,0.1)] border border-white/20">
      {/* Top: The Stigma (Input) */}
      <div className="mb-8">
        <p className="text-xs font-sans font-bold tracking-widest text-stone uppercase mb-2">
          The Burden
        </p>
        <p className="font-serif text-xl text-ink italic leading-relaxed">
          "{emotion}"
        </p>
      </div>

      {/* The Seam Divider */}
      <div className="relative h-8 w-full flex items-center justify-center my-4">
        <div className="absolute inset-x-0 h-px bg-stone/20"></div>
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

      {/* Bottom: The Wisdom (Output) */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-gold" />
          <p className="text-xs font-sans font-bold tracking-widest text-gold uppercase">
            The Mended Truth
          </p>
        </div>

        {nativeScript && (
          <p className="font-serif text-lg text-stone/60 mb-1">
            {nativeScript}
          </p>
        )}
        
        {transliteration && (
          <p className="font-sans text-xs text-stone/40 italic mb-4 tracking-wide">
            {transliteration}
          </p>
        )}

        <p className="font-serif text-2xl text-ink leading-relaxed">
          "{proverb}"
        </p>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-stone/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gold"></div>
          <span className="text-[10px] font-sans tracking-widest text-stone uppercase">
            Kintsu Archive
          </span>
        </div>
        <span className="text-[10px] font-sans text-stone/60">
          Source: {source}
        </span>
      </div>
    </div>
  );
}
