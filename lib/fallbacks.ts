import { ProverbOption } from "./types";

export const FALLBACK_PROVERBS: Record<string, ProverbOption[]> = {
  "default": [
    {
      proverb_original: "This too shall pass.",
      english: "This too shall pass.",
      reframe: "The pain you feel now is not permanent; it is a season that will change.",
      source: "Persian Adage",
      confidence: 85
    },
    {
      proverb_original: "Fall seven times, stand up eight.",
      english: "Fall seven times, stand up eight.",
      reframe: "Resilience is not about never failing, but about always rising.",
      source: "Japanese Proverb",
      confidence: 90
    },
    {
      proverb_original: "A smooth sea never made a skilled sailor.",
      english: "A smooth sea never made a skilled sailor.",
      reframe: "Your struggles are shaping you into someone capable of weathering any storm.",
      source: "English Proverb",
      confidence: 88
    }
  ],
  "South Asian": [
    {
      proverb_original: "Sabar ka phal meetha hota hai.",
      english: "The fruit of patience is sweet.",
      reframe: "Your waiting is not wasted; it is ripening a reward you cannot yet see.",
      source: "Hindi/Urdu Proverb",
      confidence: 92
    },
    {
      proverb_original: "Himmat-e-marda, madad-e-Khuda.",
      english: "God helps those who have courage.",
      reframe: "Your bravery in facing this struggle invites divine support.",
      source: "Urdu Proverb",
      confidence: 89
    },
    {
      proverb_original: "Boond boond se sagar banta hai.",
      english: "Drop by drop, the ocean is filled.",
      reframe: "Small steps of healing, no matter how tiny, eventually create a vast ocean of peace.",
      source: "Hindi Proverb",
      confidence: 90
    }
  ],
  "Japanese": [
    {
      proverb_original: "Nana korobi ya oki.",
      english: "Fall seven times, stand up eight.",
      reframe: "It does not matter how many times you stumble, only that you rise one more time.",
      source: "Japanese Proverb",
      confidence: 95
    },
    {
      proverb_original: "Ame furite ji katamaru.",
      english: "After the rain, the earth hardens.",
      reframe: "Adversity builds the solid foundation upon which your future happiness will stand.",
      source: "Japanese Proverb",
      confidence: 91
    },
    {
      proverb_original: "Ishibashi wo tataite wataru.",
      english: "Tap a stone bridge before crossing.",
      reframe: "Your caution is not fear; it is the wisdom to ensure your path is safe.",
      source: "Japanese Proverb",
      confidence: 88
    }
  ]
};

export function getFallbackProverbs(culture: string): ProverbOption[] {
  // Simple mapping or default
  if (culture.includes("Indian") || culture.includes("Pakistani") || culture.includes("South Asian")) {
    return FALLBACK_PROVERBS["South Asian"];
  }
  if (culture.includes("Japanese")) {
    return FALLBACK_PROVERBS["Japanese"];
  }
  return FALLBACK_PROVERBS["default"];
}
