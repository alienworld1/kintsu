import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';
import { decrypt } from '@/lib/crypto';
import { ProverbJson } from '@/lib/types';

export const runtime = 'nodejs';

export const alt = 'Kintsu Bridge';
export const size = {
  width: 600,
  height: 315,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch font - Fraunces Italic
  let fontData: ArrayBuffer | null = null;
  try {
    const res = await fetch('https://fonts.gstatic.com/s/fraunces/v24/6NUu8FyLNQOQZAnv9bYEvDIJ6Vq49n_9.ttf');
    if (res.ok) {
      fontData = await res.arrayBuffer();
    }
  } catch (e) {
    console.error("Font fetch failed", e);
  }

  // Fetch bridge data
  const { data: bridge } = await supabase
    .from('bridges')
    .select('*')
    .eq('id', id)
    .single();

  if (!bridge) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 24,
            background: '#F9F7F1',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2B2926',
          }}
        >
          Kintsu
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Decrypt emotion
  let decryptedEmotion = "Protected Content";
  try {
    decryptedEmotion = decrypt(bridge.emotion);
  } catch (e) {
    console.error("Decryption failed", e);
  }

  const proverbJson = bridge.proverb_json as ProverbJson;
  // Default to first option
  const proverb = proverbJson.options[0];

  return new ImageResponse(
    (
      <div
        style={{
          background: '#F9F7F1',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          fontFamily: '"Fraunces"',
          position: 'relative',
        }}
      >
        {/* Top: Emotion/Culture */}
        <div
          style={{
            display: 'flex',
            fontSize: 14,
            color: '#6B705C', // Sage
            marginBottom: 15,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontFamily: 'sans-serif',
            fontWeight: 600,
          }}
        >
          {decryptedEmotion} • {bridge.culture}
        </div>

        {/* Middle: Proverb */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#2B2926', // Sumi Ink
            lineHeight: 1.1,
            maxWidth: '90%',
            marginBottom: 20,
          }}
        >
          "{proverb.reframe}"
        </div>

        {/* Divider: Gold Seam */}
        <div
          style={{
            display: 'flex',
            width: '50%',
            height: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
           <svg
            width="200"
            height="12"
            viewBox="0 0 400 24"
            fill="none"
          >
            <path
              d="M0 12 L 100 10 L 150 14 L 200 11 L 250 13 L 300 10 L 400 12"
              stroke="#B08D55" // Gold
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottom: Original Proverb */}
        <div
          style={{
            display: 'flex',
            fontSize: 18,
            color: '#5E5B52', // Stone
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {proverb.proverb_original}
        </div>
        
        {/* Footer: Kintsu Logo */}
        <div
           style={{
             position: 'absolute',
             bottom: 25,
             fontSize: 12,
             color: '#B08D55',
             fontWeight: 'bold',
             letterSpacing: '0.05em',
           }}
        >
          KINTSU
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData ? [
        {
          name: 'Fraunces',
          data: fontData,
          style: 'italic',
        },
      ] : undefined,
    }
  );
}
