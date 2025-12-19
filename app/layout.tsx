import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kintsu | The Mended Object",
  description: "Translating generational stigma into cultural wisdom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${manrope.variable} antialiased bg-paper text-ink`}
      >
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-multiply bg-noise"></div>
        {children}
      </body>
    </html>
  );
}
