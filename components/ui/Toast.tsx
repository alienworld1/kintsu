"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

export function Toast({ message, isVisible, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className={`fixed top-6 left-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
            type === "error" ? "bg-terra text-paper" : "bg-sage text-paper"
          }`}
        >
          {type === "error" ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span className="text-sm font-sans font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
