"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, isPending: connectPending } = useConnect({
    connector: injected(),
  });
  const { disconnect } = useDisconnect();

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-yellow-400" />
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">
            RIBX
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.16em] text-gray-400">
          <Link href="/" className="hover:text-white">
            Overview
          </Link>
          <Link href="/staking" className="hover:text-white">
            Staking
          </Link>
          {/* You can add /real-estate, /gamefi later */}
        </nav>

        <div>
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="rounded-full border border-white/20 px-4 py-1 text-xs font-medium hover:bg-white/10"
            >
              {shortAddress} · Disconnect
            </button>
          ) : (
            <button
              onClick={() => connect()}
              className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-semibold text-black hover:bg-yellow-300 disabled:opacity-70"
              disabled={connectPending}
            >
              {connectPending ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
