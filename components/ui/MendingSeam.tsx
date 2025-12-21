"use client";

export function MendingSeam() {
  return (
    <div className="relative h-12 w-full max-w-md mx-auto flex items-center justify-center">
      {/* Background Line (The Crack) */}
      <div className="absolute inset-x-0 h-px bg-stone/20"></div>
      
      {/* The Gold Seam */}
      <svg
        className="absolute w-full h-8 text-gold overflow-visible"
        viewBox="0 0 400 24"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 12 L 100 10 L 150 14 L 200 11 L 250 13 L 300 10 L 400 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="animate-mend"
          strokeDasharray="450"
          strokeDashoffset="450"
        />
      </svg>
    </div>
  );
}
