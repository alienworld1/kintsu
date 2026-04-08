"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

type Role = "child" | "parent";

interface Message {
  id: string;
  sender: "kintsu" | "user";
  text: string;
}

const MOCK_RESPONSES = [
  "In many South Asian families, expressing emotional need directly is seen as weakness. But your child is showing immense trust by saying this to you at all.",
  "The proverb you received speaks to cycles — rest as part of duty, not the absence of it. This is a framework your parent's generation understands deeply.",
  "What feels like resistance from your family is often protection. They fear that naming the pain makes it more real.",
];

const SEED_MESSAGES: Record<Role, string> = {
  child:
    "I've read your burden. What would you like to understand better about this moment — your feelings, or your family's perspective?",
  parent:
    "I've seen what your child shared. Would you like help understanding what they meant, or how you might respond?",
};

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

export function ChatPanel({ isOpen, onClose, role }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const responseIndex = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSeeded = useRef(false);

  // Seed the initial Kintsu message when panel opens
  useEffect(() => {
    if (isOpen && !hasSeeded.current) {
      hasSeeded.current = true;
      setMessages([
        {
          id: "seed",
          sender: "kintsu",
          text: SEED_MESSAGES[role],
        },
      ]);
    }
    if (!isOpen) {
      hasSeeded.current = false;
      setMessages([]);
      setInput("");
    }
  }, [isOpen, role]);

  // Auto-focus input and scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = MOCK_RESPONSES[responseIndex.current % MOCK_RESPONSES.length];
      responseIndex.current += 1;
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `kintsu-${Date.now()}`, sender: "kintsu", text: response },
      ]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="chat-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-paper border-t border-stone/20 rounded-t-2xl shadow-[0_-20px_60px_-15px_rgba(43,41,38,0.15)]"
            style={{ height: "62vh", maxHeight: "600px" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0">
              <div>
                <h2 className="font-serif text-xl text-ink">Kintsu</h2>
                <p className="font-sans text-xs text-stone tracking-wide mt-0.5">
                  Your cultural guide
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-stone hover:text-ink transition-colors rounded-full hover:bg-stone/10"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gold Seam Divider */}
            <div className="relative h-4 w-full shrink-0 flex items-center px-6">
              <div className="absolute inset-x-6 h-px bg-stone/15" />
              <svg
                className="absolute inset-x-6 h-4 text-gold"
                viewBox="0 0 400 16"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 L80 7 L140 10 L200 7.5 L260 9 L320 7 L400 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "kintsu" && (
                    <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0 mb-0.5">
                      <span className="font-serif text-[10px] font-bold text-paper leading-none">
                        K
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 font-sans text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-ink text-paper rounded-2xl rounded-tr-sm"
                        : "bg-clay text-ink rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-2 justify-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0">
                      <span className="font-serif text-[10px] font-bold text-paper leading-none">
                        K
                      </span>
                    </div>
                    <div className="bg-clay text-ink rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-stone/50 block"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 pb-6 pt-3 border-t border-stone/10">
              <div className="flex items-center gap-2 bg-clay/50 rounded-full px-4 py-2.5 border border-stone/15 focus-within:border-gold transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Kintsu..."
                  className="flex-1 bg-transparent font-sans text-sm text-ink placeholder:text-stone/50 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  className="w-7 h-7 rounded-full bg-gold flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-sage transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-3 h-3 text-paper" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
