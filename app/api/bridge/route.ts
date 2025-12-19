import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { encrypt, decrypt } from '@/lib/crypto';
import { Bridge } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { anon_id, emotion, culture, proverb_json } = body;

    if (!anon_id || !emotion || !culture || !proverb_json) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Encrypt the emotion field
    const encryptedEmotion = encrypt(emotion);

    // Calculate expiry (24 hours from now)
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('bridges')
      .insert([
        {
          anon_id,
          emotion: encryptedEmotion,
          culture,
          proverb_json,
          expires_at,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bridge: data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('bridges')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Bridge not found' }, { status: 404 });
  }

  // Check expiry
  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Bridge has expired' }, { status: 410 });
  }

  // Decrypt emotion
  try {
    const decryptedEmotion = decrypt(data.emotion);
    return NextResponse.json({ ...data, emotion: decryptedEmotion });
  } catch (e) {
    console.error('Decryption error:', e);
    return NextResponse.json({ error: 'Failed to decrypt content' }, { status: 500 });
  }
}
