"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isSanctuary = pathname === "/sanctuary";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between pointer-events-none">
      {/* Logo */}
      <Link 
        href="/" 
        className="pointer-events-auto font-serif text-2xl text-ink italic hover:text-gold transition-colors"
      >
        Kintsu
      </Link>

      {/* Nav */}
      <nav className="pointer-events-auto flex items-center gap-4 md:gap-8">
        <Link 
          href="/clinicians" 
          className={`font-sans text-sm font-medium tracking-wide transition-colors ${
            pathname === "/clinicians" ? "text-gold" : "text-stone hover:text-ink"
          }`}
        >
          For Clinicians
        </Link>

        {!isSanctuary && (
          <Link 
            href="/sanctuary" 
            className="px-5 py-2 bg-ink text-paper rounded-full font-sans text-sm font-medium hover:bg-gold transition-colors shadow-lg shadow-ink/10"
          >
            Enter Sanctuary
          </Link>
        )}
      </nav>
    </header>
  );
}
