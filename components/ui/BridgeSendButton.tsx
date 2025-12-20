"use client";

import { useState } from "react";
import { Send, Copy, Check, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { useDevice } from "@/hooks/useDevice";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { Toast } from "@/components/ui/Toast";

interface BridgeSendButtonProps {
  text: string;
  bridgeId?: string | null;
  onSend?: () => void;
}

export function BridgeSendButton({ text, bridgeId, onSend }: BridgeSendButtonProps) {
  const { isDesktop } = useDevice();
  const [isCopied, setIsCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const triggerConfetti = () => {
    const end = Date.now() + 1000;

    const colors = ["#B08D55", "#D4B47D", "#F9F7F1"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setShowToast(true);
      triggerConfetti();
      if (onSend) onSend();
      
      // Reset copy state after 3 seconds
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleWhatsApp = () => {
    const url = generateWhatsAppLink(text);
    window.open(url, '_blank');
    triggerConfetti();
    if (onSend) onSend();
  };

  return (
    <>
      <Toast 
        message="Copied! Paste to WhatsApp, iMessage, or Signal." 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
      
      <div className="flex flex-col gap-3 w-full">
        {isDesktop ? (
          // Desktop Layout: Primary Copy, Secondary WhatsApp
          <>
            <button
              onClick={handleCopy}
              className={`w-full group relative flex items-center justify-center gap-2 px-6 py-4 overflow-hidden font-sans font-medium tracking-wide text-paper bg-sage rounded-lg transition-all hover:bg-sage/90 ${isCopied ? 'ring-2 ring-gold ring-offset-2 ring-offset-paper' : ''}`}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Script Copied" : "Copy Script"}
            </button>
            
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 text-sm font-sans text-gold hover:text-gold-leaf hover:underline transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open WhatsApp Web
            </button>
          </>
        ) : (
          // Mobile Layout: Primary WhatsApp, Secondary Copy
          <div className="flex gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 group relative flex items-center justify-center gap-2 px-6 py-3 overflow-hidden font-sans font-medium tracking-wide text-ink bg-gold rounded-lg transition-all hover:bg-gold-leaf"
            >
              <Send className="w-4 h-4" />
              Bridge via WhatsApp
            </button>
            
            <button
              onClick={handleCopy}
              className="flex items-center justify-center px-4 py-3 bg-clay rounded-lg text-stone hover:bg-stone/10 transition-colors"
              aria-label="Copy script"
            >
              {isCopied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
