import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { encrypt } from '@/lib/crypto';

// Hardcoded seed data to simulate momentum
const CULTURES = ["South Asian", "East Asian", "Latinx", "Middle Eastern", "African", "Southeast Asian"];
const EMOTIONS = ["Burnout", "Guilt", "Silence", "Duty", "Grief", "Expectation"];
const THEMES = ["Resilience", "Flow", "Honor", "Community", "Patience", "Strength"];

export async function GET() {
  try {
    // Check if already seeded to avoid duplicates (simple check)
    const { count } = await supabase.from('bridges').select('*', { count: 'exact', head: true });
    
    if (count && count > 400) {
      return NextResponse.json({ message: "Already seeded", count });
    }

    const seeds = [];
    for (let i = 0; i < 450; i++) {
      const culture = CULTURES[Math.floor(Math.random() * CULTURES.length)];
      const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
      
      // Random date within last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      seeds.push({
        anon_id: `seed_${Math.random().toString(36).substring(7)}`,
        emotion: encrypt(emotion), // Encrypt for consistency
        culture: culture,
        proverb_json: {
          options: [{
            proverb_original: "Seeded Proverb",
            proverb_native_script: "Seeded Script",
            proverb_transliteration: "Seeded Transliteration",
            english: `Seeded translation for ${emotion}`,
            reframe: `${emotion} as ${theme}`,
            source: "Archive",
            confidence: 95
          }],
          insight_tease: `${emotion} as '${theme}' now wiser for ${Math.floor(Math.random() * 100) + 100}+`
        },
        created_at: date.toISOString(),
        expires_at: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString() // Most will be expired, which is fine for archive
      });
    }

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < seeds.length; i += batchSize) {
      const batch = seeds.slice(i, i + batchSize);
      const { error } = await supabase.from('bridges').insert(batch);
      if (error) console.error("Seed batch error:", error);
    }

    return NextResponse.json({ message: "Seeded 450 entries", count: 450 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
