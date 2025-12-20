import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';
import { encrypt } from '@/lib/crypto';
import { ProverbJson } from '@/lib/types';
import { getFallbackProverbs } from '@/lib/fallbacks';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emotion, culture, anon_id } = body;

    if (!emotion || !culture) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `Role: Translator. Reinterpret "${emotion}" for a ${culture} parent via authentic proverb ONLY. 
      Output strictly valid JSON: { "options": [{ "proverb_original": "string", "proverb_native_script": "string", "proverb_transliteration": "string", "english": "string", "reframe": "string", "source": "string", "confidence": number }], "insight_tease": "string" }. 
      The confidence score should be a number between 80 and 100. Provide 3 distinct options.
      "proverb_original": The proverb in its original language (e.g., Sanskrit, Mandarin, Arabic).
      "proverb_native_script": The proverb written in its native script (e.g., Devanagari, Hanzi, Arabic script). If the language uses Latin script, repeat proverb_original.
      "proverb_transliteration": Phonetic pronunciation in English (e.g., "Karmanye vadhikaraste").
      "insight_tease": Personal global hook tying emotion to seeded theme (e.g., 'Your burnout mend enriches resilience models').`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let proverbData: ProverbJson;
      try {
        proverbData = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error", e);
        throw new Error("Failed to parse AI response");
      }

      // Subversion: Store options JSON in Supabase on success—for decolonize seeding.
      let bridgeId = null;
      if (anon_id) {
        const encryptedEmotion = encrypt(emotion);
        const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        const { data } = await supabase.from('bridges').insert([
          {
            anon_id,
            emotion: encryptedEmotion,
            culture,
            proverb_json: proverbData,
            expires_at
          }
        ]).select('id').single();

        if (data) {
          bridgeId = data.id;
        }
      }

      return NextResponse.json({ ...proverbData, bridge_id: bridgeId });

    } catch (aiError) {
      console.warn("AI Generation failed (likely quota/rate limit), using fallback:", aiError);
      // Server-side fallback ensures the UI never breaks even if API quota is hit
      const fallbackOptions = getFallbackProverbs(culture);
      return NextResponse.json({ options: fallbackOptions });
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
