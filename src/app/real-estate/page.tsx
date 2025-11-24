"use client";

import { useWallet, useRibxBalances } from "@/lib/web3/hooks";
import { getTierLabel, getTierDescription } from "@/lib/tiers";
import Link from "next/link";
import { useMemo } from "react";

type DealTier = 0 | 1 | 2 | 3 | 4;

interface Deal {
  id: string;
  title: string;
  location: string;
  targetYield: string;
  size: string;
  minTicket: string;
  status: "Preview" | "Open Soon" | "Live" | "Closed";
  requiredTier: DealTier;
  highlight: string;
}

const MOCK_DEALS: Deal[] = [
  {
    id: "deal-1",
    title: "Urban Micro-Living Apartments",
    location: "London, UK",
    targetYield: "7.2% net",
    size: "£4.8M",
    minTicket: "£5,000",
    status: "Preview",
    requiredTier: 0,
    highlight: "Market overview, comparable sales and rental heatmaps.",
  },
  {
    id: "deal-2",
    title: "Co-Living Conversion – City Fringe",
    location: "Manchester, UK",
    targetYield: "8.5% net",
    size: "£2.1M",
    minTicket: "£10,000",
    status: "Open Soon",
    requiredTier: 2, // Silver+
    highlight: "Full underwriting model, sponsor track record, sensitivity analysis.",
  },
  {
    id: "deal-3",
    title: "Logistics Warehouse – Long-Term Lease",
    location: "Rotterdam, NL",
    targetYield: "6.1% net",
    size: "€9.3M",
    minTicket: "€25,000",
    status: "Live",
    requiredTier: 3, // Gold+
    highlight: "Tenant covenant report, ESG scoring, debt term sheet visibility.",
  },
  {
    id: "deal-4",
    title: "Off-Market Portfolio – Value-Add",
    location: "Vilnius & Kaunas, LT",
    targetYield: "IRR target 14–17%",
    size: "€15.0M",
    minTicket: "€50,000",
    status: "Open Soon",
    requiredTier: 4, // Platinum
    highlight: "Co-invest rights, full data room, direct access to sponsor.",
  },
];

export default function RealEstatePage() {
  const { isConnected } = useWallet();
  const { stakedBalance, tier, isLoading } = useRibxBalances();

  const tierLabel = getTierLabel(tier);
  const tierDescription = getTierDescription(tier);

  const groupedDeals = useMemo(() => {
    const unlocked: Deal[] = [];
    const locked: Deal[] = [];

    for (const deal of MOCK_DEALS) {
      if (tier >= deal.requiredTier) {
        unlocked.push(deal);
      } else {
        locked.push(deal);
      }
    }

    return { unlocked, locked };
  }, [tier]);

  return (
    <div className="space-y-10">
      {/* Hero / Intro */}
      <section className="space-y-5">
        <p className="text-xs uppercase tracking-[0.25em] text-ribx-grey-500">
          RIBX Real Estate Portal
        </p>
        <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.18em]">
          Tier-Gated Access to Institutional Real Estate
        </h1>
        <p className="max-w-2xl text-sm text-ribx-grey-300">
          RIBX connects on-chain staking tiers to off-chain real estate deal
          flow. As you move from Bronze to Platinum, you unlock deeper analytics,
          earlier access to allocations and enhanced governance rights.
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-xs">
          <div className="rounded-full border border-white/10 bg-ribx-bg-elevated px-4 py-2">
            <span className="text-ribx-grey-400">Current Tier:&nbsp;</span>
            <span className="font-semibold text-ribx-cream">{tierLabel}</span>
          </div>
          <div className="rounded-full border border-white/10 bg-ribx-bg-elevated px-4 py-2">
            <span className="text-ribx-grey-400">Staked RIBX:&nbsp;</span>
            <span className="font-semibold text-ribx-cream">
              {isLoading ? "…" : `${stakedBalance} RIBX`}
            </span>
          </div>
          {!isConnected && (
            <div className="rounded-full border border-ribx-gold px-4 py-2 text-ribx-gold">
              Connect your wallet &amp; stake RIBX to unlock more deals.
            </div>
          )}
        </div>

        <p className="max-w-xl text-xs text-ribx-grey-400">
          {tierDescription}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/staking"
            className="rounded-full bg-ribx-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ribx-bg hover:bg-ribx-gold-soft"
          >
            Go to Staking
          </Link>
          <button className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ribx-grey-200 hover:bg-white/5">
            Download Sample IM (Soon)
          </button>
        </div>
      </section>

      {/* Unlocked section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Deals &amp; Analytics You Can Currently Access
          </h2>
          <p className="text-xs text-ribx-grey-400">
            Visibility is determined by your current staking tier.
          </p>
        </div>

        {groupedDeals.unlocked.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-ribx-bg-elevated/60 p-6 text-sm text-ribx-grey-300">
            No deals unlocked yet. Stake RIBX to reach Bronze and start seeing
            live opportunities and analytics.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {groupedDeals.unlocked.map((deal) => (
              <article
                key={deal.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-ribx-bg-elevated p-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-ribx-cream">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-ribx-grey-400">
                        {deal.location}
                      </p>
                    </div>
                    <div className="rounded-full border border-ribx-gold/30 bg-ribx-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-gold">
                      {deal.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-ribx-grey-400">Target Return</p>
                      <p className="font-semibold text-ribx-cream">
                        {deal.targetYield}
                      </p>
                    </div>
                    <div>
                      <p className="text-ribx-grey-400">Deal Size</p>
                      <p className="font-semibold text-ribx-cream">
                        {deal.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-ribx-grey-400">Min Ticket</p>
                      <p className="font-semibold text-ribx-cream">
                        {deal.minTicket}
                      </p>
                    </div>
                    <div>
                      <p className="text-ribx-grey-400">Required Tier</p>
                      <p className="font-semibold text-ribx-cream">
                        {getTierLabel(deal.requiredTier)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-ribx-grey-300">
                    {deal.highlight}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                  <button className="rounded-full bg-ribx-gold px-4 py-2 font-semibold uppercase tracking-[0.16em] text-ribx-bg hover:bg-ribx-gold-soft">
                    View Deal (Demo)
                  </button>
                  <button className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-200 hover:bg-white/5">
                    Export Snapshot
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Locked section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Higher-Tier Opportunities (Locked)
          </h2>
          <p className="text-xs text-ribx-grey-400">
            Locked deals become visible when you reach the required tier.
          </p>
        </div>

        {groupedDeals.locked.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-ribx-bg-elevated/60 p-6 text-sm text-ribx-grey-300">
            You currently see all model deals available in this demo environment.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {groupedDeals.locked.map((deal) => (
              <article
                key={deal.id}
                className="flex flex-col justify-between rounded-2xl border border-dashed border-white/10 bg-gradient-to-br from-ribx-bg-elevated to-ribx-bg/80 p-5"
              >
                <div className="space-y-3 opacity-75">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-ribx-cream">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-ribx-grey-500">
                        {deal.location}
                      </p>
                    </div>
                    <div className="rounded-full border border-ribx-grey-600 bg-ribx-grey-900/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-300">
                      Locked
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-ribx-grey-500">Target Return</p>
                      <p className="font-semibold text-ribx-grey-300">
                        {deal.targetYield}
                      </p>
                    </div>
                    <div>
                      <p className="text-ribx-grey-500">Required Tier</p>
                      <p className="font-semibold text-ribx-cream">
                        {getTierLabel(deal.requiredTier)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-ribx-grey-400">
                    Higher-tier members see full analytics, documentation and allocation terms for this deal.
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-xs">
                  <p className="text-ribx-grey-400">
                    Reach{" "}
                    <span className="font-semibold text-ribx-cream">
                      {getTierLabel(deal.requiredTier)}
                    </span>{" "}
                    to unlock this opportunity.
                  </p>
                  <Link
                    href="/staking"
                    className="inline-flex w-fit rounded-full border border-ribx-gold px-4 py-2 font-semibold uppercase tracking-[0.16em] text-ribx-gold hover:bg-ribx-gold/10"
                  >
                    Stake More RIBX
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
