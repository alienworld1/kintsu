import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import { ArtifactCard } from "@/components/ui/ArtifactCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, Clock } from "lucide-react";
import { ProverbJson } from "@/lib/types";

import { CommunityEcho } from "@/components/ui/CommunityEcho";

interface BridgePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ idx?: string }>;
}

export default async function BridgePage({ params, searchParams }: BridgePageProps) {
  const { id } = await params;
  const { idx } = await searchParams;
  const selectedIndex = idx ? parseInt(idx) : 0;

  const { data: bridge, error } = await supabase
    .from("bridges")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !bridge) {
    notFound();
  }

  // Check expiry
  const isExpired = new Date(bridge.expires_at) < new Date();

  if (isExpired) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 bg-paper text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-stone/10 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-stone/40" />
        </div>
        <h1 className="font-serif text-3xl text-ink italic">This bridge has faded.</h1>
        <p className="font-sans text-stone max-w-md">
          Like all things in Kintsu, this message was ephemeral. It has returned to the silence.
        </p>
        <Link 
          href="/sanctuary"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-ink rounded-lg font-sans font-medium hover:bg-gold-leaf transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Mend a new thought
        </Link>
      </main>
    );
  }

  // Decrypt emotion
  let decryptedEmotion = "Protected Content";
  try {
    decryptedEmotion = decrypt(bridge.emotion);
  } catch (e) {
    console.error("Decryption failed", e);
  }

  const proverbData = bridge.proverb_json as ProverbJson;
  const option = proverbData.options[selectedIndex] || proverbData.options[0];

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 bg-paper relative overflow-hidden">
      {/* Background Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-noise"></div>

      <div className="relative z-10 w-full max-w-md space-y-12">
        <div className="text-center space-y-2">
          <p className="font-sans text-xs font-bold tracking-widest text-stone uppercase">
            A Bridge Shared With You
          </p>
        </div>

        <ArtifactCard
          emotion={decryptedEmotion}
          proverb={option.proverb_original}
          nativeScript={option.proverb_native_script}
          transliteration={option.proverb_transliteration}
          culture={bridge.culture}
          source={option.source}
        />

        <div className="text-center space-y-2">
            <p className="font-sans text-sm text-stone italic">
                "{option.reframe}"
            </p>
        </div>

        <div className="flex justify-center">
          <Link 
            href="/sanctuary"
            className="group relative flex items-center justify-center gap-2 px-8 py-4 overflow-hidden font-sans font-medium tracking-wide text-ink bg-gold rounded-lg transition-all hover:bg-gold-leaf"
          >
            <Sparkles className="w-4 h-4" />
            Mend your own thought
          </Link>
        </div>

        <div className="text-center">
            <p className="text-[10px] font-sans text-stone/40 uppercase tracking-widest">
                Expires in {Math.ceil((new Date(bridge.expires_at).getTime() - Date.now()) / (1000 * 60 * 60))} hours
            </p>
        </div>

        {bridge.allow_nods && (
          <CommunityEcho bridgeId={bridge.id} culture={bridge.culture} />
        )}
      </div>
    </main>
  );
}
