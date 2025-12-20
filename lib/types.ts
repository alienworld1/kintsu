export interface ProverbOption {
  proverb_original: string;
  english: string;
  reframe: string;
  source: string;
  confidence: number;
}

export interface ProverbJson {
  options: ProverbOption[];
  insight_tease?: string;
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
