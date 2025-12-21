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

      const prompt = `
      Analyze the following user input for a ${culture} context: "${emotion}".

      STEP 1: SAFETY ANALYSIS
      Check if the input indicates self-harm, suicide, severe abuse, or immediate danger.
      
      CASE A: CRISIS DETECTED
      If yes, output ONLY:
      {
        "crisis_detected": true,
        "crisis_type": "self_harm"
      }

      CASE B: NO CRISIS (TRANSLATION)
      If no, act as a Cultural Translator. Reinterpret the emotion for a ${culture} parent via authentic proverb.
      Output strictly valid JSON with this structure:
      { 
        "options": [
          { 
            "proverb_original": "string", 
            "proverb_native_script": "string", 
            "proverb_transliteration": "string", 
            "english": "string", 
            "reframe": "string", 
            "source": "string", 
            "confidence": number 
          }
        ], 
        "insight_tease": "string" 
      }
      
      Requirements:
      - Provide 3 distinct options.
      - Confidence score: 80-100.
      - "insight_tease": Personal global hook tying emotion to seeded theme.
      `;

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

      // Validate response structure
      if (!proverbData.crisis_detected && (!proverbData.options || proverbData.options.length === 0)) {
        throw new Error("AI returned invalid structure (no options and no crisis)");
      }

      // Subversion: Store options JSON in Supabase on success—for decolonize seeding.
      let bridgeId = null;
      if (anon_id && !proverbData.crisis_detected) {
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
