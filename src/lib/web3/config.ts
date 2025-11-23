// src/lib/web3/config.ts
"use client";

import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(), // default RPC; can swap for custom later
    [base.id]: http(),
  },
  ssr: true,
});
