"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { GoldSeam } from "@/components/ui/GoldSeam";
import { ArtifactCard } from "@/components/ui/ArtifactCard";
import { ArrowDown } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <main ref={containerRef} className="relative min-h-[300vh] w-full overflow-hidden bg-paper selection:bg-gold/20 selection:text-ink">
      
      {/* Section 1: The Silence (Hero) */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-xl text-center space-y-12"
        >
          <div className="space-y-6">
            <p className="font-serif text-3xl md:text-4xl text-ink leading-tight italic">
              "I told my mom I was tired.<br/>She heard 'lazy'."
            </p>
            <p className="font-sans text-sm tracking-widest text-stone uppercase">
              The Silence
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Link href="/sanctuary" className="group flex flex-col items-center gap-4">
              <span className="text-xs font-sans text-stone/60 group-hover:text-gold transition-colors">Mend the thought</span>
              <ArrowDown className="w-4 h-4 text-gold animate-bounce group-hover:text-gold-leaf" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* The Gold Seam (Connecting Thread) */}
      <div className="absolute top-[50vh] left-1/2 -translate-x-1/2 w-px h-[150vh] z-0">
        <GoldSeam className="h-full" />
      </div>

      {/* Section 2: The Mechanic (Transition) */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full items-center">
          <div className="text-right space-y-4 opacity-40">
            <h3 className="font-serif text-2xl text-stone italic">The Stigma</h3>
            <p className="font-sans text-stone leading-relaxed">
              Words that hurt.<br/>
              Meanings lost in translation.<br/>
              The weight of expectation.
            </p>
          </div>
          <div className="text-left space-y-4">
            <h3 className="font-serif text-2xl text-gold italic">The Wisdom</h3>
            <p className="font-sans text-ink leading-relaxed">
              Words that heal.<br/>
              Meanings found in heritage.<br/>
              The lightness of understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: The Demo (Artifact) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-mist/30">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
           <span className="text-[20vw] font-serif italic text-ink whitespace-nowrap">Kintsu</span>
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <ArtifactCard />
        </div>

        <div className="mt-16 text-center max-w-md mx-auto">
          <p className="font-serif text-xl text-ink italic">
            "We do not hide the cracks.<br/>We honor them with gold."
          </p>
        </div>
      </section>

      {/* Section 4: The Impact (Philanthropy) */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-stone/20"></div>
            <span className="font-sans text-xs tracking-widest text-gold uppercase">Living Archive</span>
            <div className="h-px flex-1 bg-stone/20"></div>
          </div>
          
          <div className="relative h-2 w-full bg-clay rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "60%" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gold"
            />
          </div>

          <div className="flex justify-between items-end">
            <p className="font-serif text-2xl text-ink">
              Your silence, translated.
            </p>
            <div className="text-right">
              <span className="block font-serif text-4xl text-gold">500+</span>
              <span className="text-xs font-sans text-stone uppercase tracking-widest">Threads Mended</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Footer (The Seal) */}
      <footer className="relative py-24 px-6 flex flex-col items-center justify-center border-t border-stone/10">
        <div className="text-center space-y-8">
          <div className="w-16 h-16 mx-auto border-2 border-gold rounded-full flex items-center justify-center">
            <span className="font-serif text-2xl text-gold italic">K</span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-5xl text-ink">
            Begin the dialogue.
          </h2>
          
          <Link href="/sanctuary" className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-sans font-medium tracking-tighter text-white bg-ink rounded-lg group">
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-gold rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="relative">Enter the Sanctuary</span>
          </Link>
          
          <p className="text-xs font-sans text-stone/50 mt-12">
            © 2025 Kintsu. Designed for dignity.
          </p>
        </div>
      </footer>
    </main>
  );
}
