import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Navbar from "./components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "두돌 - 이석재 신부와 함께하는 영성 여행",
  description: "이석재 토마스 데 아퀴나스 신부와 함께하는 깊이 있는 성경 묵상과 교회사 여행",
};

import VisitorTracker from "@/app/components/common/VisitorTracker";
import VisitorCounterDisplay from "@/app/components/common/VisitorCounterDisplay";

import Providers from "@/app/components/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* Changed bg-slate-50 to bg-[#fcfcfc] for a cleaner, warmer white. Text is slate-900 for high contrast. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#fcfcfc] text-slate-900`}>
        <Providers>
          <VisitorTracker />
          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
              <p className="text-base">© 2026 Dudol. All rights reserved.</p>
              <p className="text-xs mt-2">이석재 신부 (토마스 데 아퀴나스)</p>
              <VisitorCounterDisplay />
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
