// app/providers.tsx
"use client";

import React, { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "../lib/web3/config"; // matches /lib/web3/config.ts

export function Web3Providers({ children }: { children: React.ReactNode }) {
  // Ensure a single QueryClient instance in React StrictMode
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
