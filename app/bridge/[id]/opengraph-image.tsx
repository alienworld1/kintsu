import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';
import { decrypt } from '@/lib/crypto';
import { ProverbJson } from '@/lib/types';

export const alt = 'Kintsu Bridge';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch font - Fraunces Italic
  const fontData = await fetch(
    new URL('https://fonts.gstatic.com/s/fraunces/v24/6NUu8FyLNQOQZAnv9bYEvDIJ6Vq49n_9.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

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
            fontSize: 48,
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
          padding: '60px',
          fontFamily: '"Fraunces"',
          position: 'relative',
        }}
      >
        {/* Noise Texture Overlay (Simulated with CSS radial gradient or similar if possible, but simple is better for OG) */}
        
        {/* Top: Emotion/Culture */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#6B705C', // Sage
            marginBottom: 30,
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
            fontSize: 64,
            fontStyle: 'italic',
            textAlign: 'center',
            color: '#2B2926', // Sumi Ink
            lineHeight: 1.1,
            maxWidth: '90%',
            marginBottom: 40,
          }}
        >
          "{proverb.reframe}"
        </div>

        {/* Divider: Gold Seam */}
        <div
          style={{
            display: 'flex',
            width: '50%',
            height: '40px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
           <svg
            width="400"
            height="24"
            viewBox="0 0 400 24"
            fill="none"
          >
            <path
              d="M0 12 L 100 10 L 150 14 L 200 11 L 250 13 L 300 10 L 400 12"
              stroke="#B08D55" // Gold
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottom: Original Proverb */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
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
             bottom: 50,
             fontSize: 24,
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
      fonts: [
        {
          name: 'Fraunces',
          data: fontData,
          style: 'italic',
        },
      ],
    }
  );
}
