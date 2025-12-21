import Link from "next/link";
import { ArrowLeft, Languages, Shield, Database, ChevronRight, Lock } from "lucide-react";

export default function CliniciansPage() {
  return (
    <main className="min-h-screen w-full bg-paper text-ink relative overflow-hidden selection:bg-gold/20">
      {/* Background Noise (Global) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-noise"></div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-6 md:px-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-stone hover:text-gold transition-colors font-sans text-sm font-medium tracking-wide group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Kintsu
        </Link>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-24">
        
        {/* 1. Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 pt-12 md:pt-20">
          <div className="space-y-4 max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl text-ink italic leading-[1.1]">
              Decolonize Your Practice.
            </h1>
            <p className="font-sans text-stone text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Kintsu translates cultural nuance for diverse client bases. Access anonymized heritage datasets and verified proverb scripts to bridge the generational gap.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button className="px-8 py-4 bg-gold text-paper rounded-full font-sans font-medium hover:bg-gold-leaf transition-colors shadow-lg shadow-gold/20">
              Request Early Access
            </button>
            <button className="px-8 py-4 bg-transparent border border-ink/20 text-ink rounded-full font-sans font-medium hover:bg-ink/5 transition-colors">
              View Research
            </button>
          </div>
        </section>

        {/* 2. Problem/Solution Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="group p-8 bg-white/50 backdrop-blur-sm border border-stone/10 rounded-xl hover:border-gold/30 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-paper transition-colors">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-ink">The Language Gap</h3>
            <p className="font-sans text-stone leading-relaxed">
              Move beyond "burnout." Use heritage-verified proverbs to explain clinical concepts to immigrant families in words they respect.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 bg-white/50 backdrop-blur-sm border border-stone/10 rounded-xl hover:border-gold/30 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-paper transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-ink">Ego-Safe Tools</h3>
            <p className="font-sans text-stone leading-relaxed">
              Give clients "Legacy Cards" that frame mental health boundaries as family duty, reducing resistance and preserving dignity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 bg-white/50 backdrop-blur-sm border border-stone/10 rounded-xl hover:border-gold/30 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-ink">Heritage Data</h3>
            <p className="font-sans text-stone leading-relaxed">
              Access the world's first anonymized "Sentiment Atlas" for South Asian, Latinx, and African Diaspora communities.
            </p>
          </div>
        </section>

        {/* 3. The "Dashboard Tease" */}
        <section className="relative w-full max-w-5xl mx-auto perspective-[1000px]">
          <div className="relative bg-ink rounded-xl p-2 shadow-2xl transform md:transform-[rotateX(12deg)_scale(0.95)] transition-transform duration-700 hover:transform-[rotateX(0deg)_scale(1)] border border-stone/20 overflow-hidden">
            {/* Top Bar */}
            <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="text-white/40 font-sans text-xs tracking-widest uppercase">
                Clinician Portal (Beta)
              </div>
            </div>

            {/* Dashboard Content (Abstract) */}
            <div className="p-6 md:p-12 grid grid-cols-12 gap-6 opacity-80">
              {/* Sidebar */}
              <div className="col-span-3 space-y-3 hidden md:block">
                <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                <div className="h-4 w-1/2 bg-white/5 rounded"></div>
              </div>

              {/* Main Chart Area */}
              <div className="col-span-12 md:col-span-9 space-y-6">
                <div className="flex justify-between items-end h-48 gap-2 md:gap-4">
                  {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-full bg-gold/20 rounded-t-sm relative group overflow-hidden"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-full bg-linear-to-t from-gold/40 to-transparent"></div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="h-24 w-1/2 bg-white/5 rounded border border-white/5 p-4">
                    <div className="w-8 h-8 rounded-full bg-sage/20 mb-2"></div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                  </div>
                  <div className="h-24 w-1/2 bg-white/5 rounded border border-white/5 p-4">
                    <div className="w-8 h-8 rounded-full bg-gold/20 mb-2"></div>
                    <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-paper/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full">
                <span className="font-serif text-white italic text-lg flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold" />
                  Anonymized Sentiment Atlas
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Footer/Waitlist */}
        <section className="max-w-xl mx-auto text-center space-y-8 pt-12">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-ink">Join the Circle</h2>
            <p className="font-sans text-stone">
              Joining 450+ Cultural Weavers in the beta program.
            </p>
          </div>

          <form className="relative flex items-center">
            <input 
              type="email" 
              placeholder="colleague@clinic.org"
              className="w-full bg-transparent border-b border-stone/30 py-4 pr-32 font-serif text-xl text-ink placeholder:text-stone/30 focus:border-gold focus:outline-none transition-colors"
            />
            <button 
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-sans font-bold tracking-widest text-gold hover:text-gold-leaf uppercase flex items-center gap-1 group"
            >
              Join Waitlist
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
