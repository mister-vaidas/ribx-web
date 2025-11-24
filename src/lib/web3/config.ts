// src/lib/web3/config.ts
"use client";

import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],

  // ✅ Register wallet connector(s) here
  connectors: [injected()],

  transports: {
    [baseSepolia.id]: http(), // can plug custom RPC later
    [base.id]: http(),
  },

  ssr: true,
});
