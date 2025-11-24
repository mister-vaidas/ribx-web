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

  const handleApprove = async () => {
    try {
      await approve("max");
    } catch (e) {
      console.error(e);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    try {
      await stake(stakeAmount);
      setStakeAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    try {
      await withdraw(withdrawAmount);
      setWithdrawAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleClaim = async () => {
    try {
      await claim();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <p className="text-xs uppercase tracking-[0.25em] text-ribx-grey-500">
          RIBX Staking
        </p>
        <h1 className="mt-2 font-heading text-2xl md:text-3xl uppercase tracking-[0.18em]">
          Earn Yield & Unlock Access Tiers
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ribx-grey-300">
          Stake RIBX on Base Sepolia to earn rewards and move up through Bronze,
          Silver, Gold and Platinum access tiers. Higher tiers unlock priority
          into real estate opportunities and ecosystem utilities.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-ribx-bg-elevated p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ribx-grey-400">
            Wallet Balance
          </p>
          <p className="mt-3 text-xl font-semibold">
            {isLoading ? "…" : `${walletBalance} RIBX`}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-ribx-bg-elevated p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ribx-grey-400">
            Staked
          </p>
          <p className="mt-3 text-xl font-semibold">
            {isLoading ? "…" : `${stakedBalance} RIBX`}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-ribx-bg-elevated p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-ribx-grey-400">
            Pending Rewards
          </p>
          <p className="mt-3 text-xl font-semibold">
            {isLoading ? "…" : `${pendingRewards} RIBX`}
          </p>
          <p className="mt-1 text-xs text-ribx-grey-400">
            Tier: {tierLabels[tier] ?? "None"}
          </p>
        </div>
      </section>

      {!isConnected ? (
        <p className="text-sm text-ribx-grey-400">
          Connect your wallet using the header to start staking.
        </p>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-ribx-bg-elevated p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Stake RIBX
            </h2>
            <p className="mt-2 text-xs text-ribx-grey-400">
              First approve the staking contract, then stake your desired
              amount.
            </p>
            <div className="mt-4 space-y-3">
              <button
                onClick={handleApprove}
                className="w-full rounded-full border border-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-gold hover:bg-ribx-gold/10 disabled:opacity-60"
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
                  className="flex-1 rounded-full border border-white/10 bg-ribx-bg px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleStake}
                  className="rounded-full bg-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-bg hover:bg-ribx-gold-soft disabled:opacity-60"
                  disabled={isPending}
                >
                  Stake
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ribx-bg-elevated p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
              Unstake & Claim
            </h2>
            <p className="mt-2 text-xs text-ribx-grey-400">
              Withdraw staked tokens or claim your accrued rewards.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount to withdraw"
                  className="flex-1 rounded-full border border-white/10 bg-ribx-bg px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={handleWithdraw}
                  className="rounded-full border border-ribx-grey-500 px-4 py-2 text-xs font-semibold text-ribx-grey-100 hover:bg-ribx-grey-900/40 disabled:opacity-60"
                  disabled={isPending}
                >
                  Unstake
                </button>
              </div>
              <button
                onClick={handleClaim}
                className="w-full rounded-full bg-ribx-gold px-4 py-2 text-xs font-semibold text-ribx-bg hover:bg-ribx-gold-soft disabled:opacity-60"
                disabled={isPending}
              >
                Claim Rewards
              </button>
            </div>
          </div>
        </section>
      )}

      {txHash && (
        <p className="text-xs text-ribx-grey-400">
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
        <p className="text-xs text-red-400">
          {writeError.message ?? "Transaction error"}
        </p>
      )}
    </div>
  );
}
