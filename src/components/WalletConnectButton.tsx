"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const injected =
    connectors.find((c) => c.id === "injected") ?? connectors[0];

  const shortAddress =
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  if (!injected) {
    return (
      <button className="rounded-full border border-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-gold/60">
        No wallet found
      </button>
    );
  }

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-full border border-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-gold hover:bg-ribx-gold/10"
      >
        {shortAddress} · Disconnect
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected })}
      className="rounded-full border border-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-gold hover:bg-ribx-gold/10 disabled:opacity-60"
      disabled={isPending}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
