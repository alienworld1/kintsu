export interface ProverbOption {
  proverb_original: string;
  proverb_native_script?: string;
  proverb_transliteration?: string;
  english: string;
  reframe: string;
  source: string;
  confidence: number;
}

export interface ProverbJson {
  options: ProverbOption[];
  insight_tease?: string;
  crisis_detected?: boolean;
  crisis_type?: string;
}

export interface Bridge {
  id: string;
  anon_id: string;
  emotion: string; // Encrypted
  culture: string;
  proverb_json: ProverbJson;
  expires_at: string;
  created_at?: string;
}
