"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Send, Heart } from "lucide-react";

interface Nod {
  id: string;
  affirmation: string;
}

interface CommunityEchoProps {
  bridgeId: string;
  culture?: string;
  initialNods?: Nod[];
}

export function CommunityEcho({ bridgeId, culture, initialNods = [] }: CommunityEchoProps) {
  const [nods, setNods] = useState<Nod[]>(initialNods);
  const [newNod, setNewNod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasNodded, setHasNodded] = useState(false);

  useEffect(() => {
    // Check local storage to see if user has already nodded
    const localNod = localStorage.getItem(`kintsu_nod_${bridgeId}`);
    if (localNod) {
      setHasNodded(true);
    }

    // Fetch initial nods if not provided (or to refresh)
    const fetchNods = async () => {
      const { data } = await supabase
        .from("nods")
        .select("id, affirmation")
        .eq("bridge_id", bridgeId)
        .order("created_at", { ascending: true });
      
      if (data) {
        setNods(data);
      }
    };

    fetchNods();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`nods:${bridgeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "nods",
          filter: `bridge_id=eq.${bridgeId}`,
        },
        (payload) => {
          const newNod = payload.new as Nod;
          setNods((prev) => [...prev, newNod]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bridgeId]);

  const handleAddNod = async () => {
    if (!newNod.trim()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("nods").insert({
        bridge_id: bridgeId,
        affirmation: newNod.trim(),
      });

      if (error) throw error;

      setNewNod("");
      setHasNodded(true);
      localStorage.setItem(`kintsu_nod_${bridgeId}`, "true");
    } catch (error) {
      console.error("Error adding nod:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 pt-8 border-t border-gold/20">
      <div className="space-y-2 text-center">
        <h3 className="font-serif text-lg text-ink italic flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-gold" />
          Community Echo
        </h3>
        <p className="font-sans text-xs text-stone">
          {nods.length === 0
            ? "Be the first to nod to this bridge."
            : `${nods.length} ${culture ? culture + " " : ""}weaver${nods.length === 1 ? "" : "s"} found strength here.`}
        </p>
      </div>

      <div className="space-y-3">
        {nods.map((nod) => (
          <div
            key={nod.id}
            className="p-3 bg-white/50 rounded-lg border border-stone/10 text-center animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <p className="font-sans text-sm text-sage italic">"{nod.affirmation}"</p>
          </div>
        ))}
      </div>

      {!hasNodded ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newNod}
            onChange={(e) => setNewNod(e.target.value)}
            placeholder="Add a gentle nod..."
            className="flex-1 bg-transparent border-b border-stone/30 py-2 px-1 font-sans text-sm text-ink placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleAddNod()}
          />
          <button
            onClick={handleAddNod}
            disabled={isSubmitting || !newNod.trim()}
            className="p-2 text-gold hover:text-gold-leaf disabled:opacity-50 transition-colors"
            aria-label="Send nod"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <p className="text-center font-sans text-xs text-sage italic">
          You have nodded to this bridge.
        </p>
      )}
    </div>
  );
}
