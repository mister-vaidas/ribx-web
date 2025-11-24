// app/layout.tsx
import React from "react";
import Link from "next/link";
import "./globals.css";
import { AppProviders } from "./providers";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export const metadata = {
  title: "RIBX – Real Estate • DeFi • GameFi",
  description:
    "RIBX unifies real estate analytics, DeFi staking and GameFi utilities in one compliant Web3 ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="bg-ribx-bg text-ribx-cream font-body">
        <AppProviders>
          {/* NAVBAR */}
          <header className="sticky top-0 z-40 border-b border-white/5 bg-ribx-bg/80 backdrop-blur">
            <div className="mx-auto flex max-w-container items-center justify-between px-4 py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ribx-gold to-ribx-gold-soft">
                  <span className="font-heading text-xl tracking-[0.25em] text-ribx-bg">
                    R
                  </span>
                </div>
                <div>
                  <div className="font-heading text-lg tracking-[0.28em] uppercase">
                    RIBX
                  </div>
                  <div className="text-xs text-ribx-grey-500">
                    Real Estate • DeFi • GameFi
                  </div>
                </div>
              </Link>

              <nav className="hidden items-center gap-7 text-sm md:flex">
                <Link
                  href="/"
                  className="text-ribx-grey-300 hover:text-ribx-cream"
                >
                  Home
                </Link>
                <Link
                  href="/staking"
                  className="text-ribx-grey-300 hover:text-ribx-cream"
                >
                  Staking
                </Link>
                <Link
                  href="/real-estate"
                  className="text-ribx-grey-300 hover:text-ribx-cream"
                >
                  Real Estate
                </Link>
                <Link
                  href="/gamefi"
                  className="text-ribx-grey-300 hover:text-ribx-cream"
                >
                  GameFi
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                {/* Real web3 connect button */}
                <div className="hidden md:inline-flex">
                  <WalletConnectButton />
                </div>
                <button className="rounded-full bg-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-bg hover:bg-ribx-gold-soft">
                  Launch App
                </button>
              </div>

            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="mx-auto max-w-container px-4 pb-16 pt-10 md:pt-14">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="border-t border-white/5 bg-ribx-bg-elevated">
            <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-8 text-sm text-ribx-grey-400 md:flex-row md:items-center md:justify-between">
              <div>© {year} RIBX. All rights reserved.</div>
              <div className="flex flex-wrap gap-4 text-xs">
                <Link href="/" className="hover:text-ribx-cream">
                  Home
                </Link>
                <Link href="/staking" className="hover:text-ribx-cream">
                  Staking
                </Link>
                <Link href="/real-estate" className="hover:text-ribx-cream">
                  Real Estate
                </Link>
                <Link href="/gamefi" className="hover:text-ribx-cream">
                  GameFi
                </Link>
              </div>
            </div>
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
