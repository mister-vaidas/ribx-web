"use client";

import React, { useState } from "react";
import { useWallet, useRibxBalances, useStakingActions } from "@/lib/web3/hooks";

const tierLabels = ["None", "Bronze", "Silver", "Gold", "Platinum"];

export default function StakingPage() {
  const { isConnected } = useWallet();
  const { walletBalance, stakedBalance, pendingRewards, tier, isLoading } =
    useRibxBalances();
  const {
    approve,
    stake,
    withdraw,
    claim,
    isPending,
    txHash,
    txStatus,
    writeError,
  } = useStakingActions();

  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-[0.2em] uppercase">
        RIBX Staking
      </h1>
      <p className="mt-2 text-sm text-gray-400">
        Stake RIBX on Base Sepolia to test the live contract integration.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
            Wallet Balance
          </p>
          <p className="mt-2 text-xl font-semibold">
            {isLoading ? "…" : `${walletBalance} RIBX`}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
            Staked
          </p>
          <p className="mt-2 text-xl font-semibold">
            {isLoading ? "…" : `${stakedBalance} RIBX`}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
            Pending Rewards
          </p>
          <p className="mt-2 text-xl font-semibold">
            {isLoading ? "…" : `${pendingRewards} RIBX`}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Tier: {tierLabels[tier] ?? "None"}
          </p>
        </div>
      </section>

      {!isConnected ? (
        <p className="mt-8 text-sm text-gray-400">
          Connect your wallet (we’ll add a connect button in the header next) to
          start staking.
        </p>
      ) : (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Stake RIBX
            </h2>
            <button
              onClick={() => approve("max")}
              className="w-full rounded-full border border-yellow-400 px-4 py-2 text-xs font-semibold text-yellow-300 hover:bg-yellow-400/10"
              disabled={isPending}
            >
              {isPending ? "Pending…" : "Approve Staking Contract"}
            </button>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.0001"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Amount to stake"
                className="flex-1 rounded-full border border-white/10 bg-black px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={() => stake(stakeAmount)}
                className="rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-300"
                disabled={isPending}
              >
                Stake
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 p-4 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Unstake & Claim
            </h2>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.0001"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount to withdraw"
                className="flex-1 rounded-full border border-white/10 bg-black px-3 py-2 text-sm outline-none"
              />
              <button
                onClick={() => withdraw(withdrawAmount)}
                className="rounded-full border border-gray-500 px-4 py-2 text-xs font-semibold text-gray-100 hover:bg-gray-800/60"
                disabled={isPending}
              >
                Unstake
              </button>
            </div>
            <button
              onClick={claim}
              className="w-full rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-300"
              disabled={isPending}
            >
              Claim Rewards
            </button>
          </div>
        </section>
      )}

      {txHash && (
        <p className="mt-4 text-xs text-gray-400">
          Latest tx:{" "}
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {txHash}
          </a>{" "}
          ({txStatus})
        </p>
      )}

      {writeError && (
        <p className="mt-2 text-xs text-red-400">
          {writeError.message ?? "Transaction error"}
        </p>
      )}
    </main>
  );
}
