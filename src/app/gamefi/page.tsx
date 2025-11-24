"use client";

import { useWallet, useRibxBalances } from "@/lib/web3/hooks";
import { getTierLabel, getTierDescription } from "@/lib/tiers";
import Link from "next/link";
import { useMemo, useState } from "react";

type TierLevel = 0 | 1 | 2 | 3 | 4;

interface GameAction {
  id: string;
  title: string;
  description: string;
  baseReward: string; // label text, e.g. "+10 XP"
  xp: number;         // numeric XP used by the tracker
  type: "Daily" | "Weekly" | "Seasonal";
  requiredTier: TierLevel;
}

interface PowerUp {
  id: string;
  title: string;
  description: string;
  effect: string;
  requiredTier: TierLevel;
}

// Simple XP model: every 500 XP = +1 level
const XP_PER_LEVEL: number = 500;

function getLevelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

const DAILY_ACTIONS: GameAction[] = [
  {
    id: "action-1",
    title: "Check-In & Sync Wallet",
    description: "Connect your wallet and confirm your active tier for the day.",
    baseReward: "+10 XP",
    xp: 10,
    type: "Daily",
    requiredTier: 0,
  },
  {
    id: "action-2",
    title: "Stake Health Check",
    description:
      "Review your staking position and projected tier progression dashboard.",
    baseReward: "+20 XP",
    xp: 20,
    type: "Daily",
    requiredTier: 1, // Bronze+
  },
  {
    id: "action-3",
    title: "Deal Radar",
    description:
      "Open at least one eligible Real Estate deal page and review key metrics.",
    baseReward: "+30 XP",
    xp: 30,
    type: "Daily",
    requiredTier: 2, // Silver+
  },
];

const SEASONAL_QUESTS: GameAction[] = [
  {
    id: "quest-1",
    title: "Onboarding Season – First Stake",
    description:
      "Complete your first stake and keep it active for a minimum of 7 days.",
    baseReward: "+250 XP · Early Badge",
    xp: 250,
    type: "Seasonal",
    requiredTier: 1,
  },
  {
    id: "quest-2",
    title: "Portfolio Aligner",
    description:
      "Reach the Silver tier and maintain it for the full duration of a season.",
    baseReward: "+500 XP · Silver Sticker Pack",
    xp: 500,
    type: "Seasonal",
    requiredTier: 2,
  },
  {
    id: "quest-3",
    title: "Yield Strategist",
    description:
      "Reach Gold tier and complete a full season without an emergency withdraw.",
    baseReward: "+1,250 XP · Strategy Title",
    xp: 1250,
    type: "Seasonal",
    requiredTier: 3,
  },
  {
    id: "quest-4",
    title: "Platinum Council",
    description:
      "Reach Platinum tier, take part in at least one governance snapshot and remain active all season.",
    baseReward: "+3,000 XP · Council Role (demo)",
    xp: 3000,
    type: "Seasonal",
    requiredTier: 4,
  },
];

const POWER_UPS: PowerUp[] = [
  {
    id: "boost-1",
    title: "Bronze Yield Boost",
    description: "Small XP multiplier on daily staking-related actions.",
    effect: "1.05x XP on staking tasks",
    requiredTier: 1,
  },
  {
    id: "boost-2",
    title: "Silver Scouting Lens",
    description: "Extra XP when exploring new deals early in the cycle.",
    effect: "1.10x XP on deal-view actions",
    requiredTier: 2,
  },
  {
    id: "boost-3",
    title: "Gold Priority Track",
    description:
      "Increased XP on actions linked to priority allocations and governance.",
    effect: "1.20x XP on governance & allocation events",
    requiredTier: 3,
  },
  {
    id: "boost-4",
    title: "Platinum Game Master",
    description:
      "Top multiplier across the GameFi layer and early access to new missions.",
    effect: "1.35x global XP multiplier (demo)",
    requiredTier: 4,
  },
];

export default function GameFiPage() {
  const { isConnected } = useWallet();
  const { stakedBalance, tier, isLoading } = useRibxBalances();

  const tierLabel = getTierLabel(tier);
  const tierDescription = getTierDescription(tier);

  // --- Simple client-side XP state ---
  const [xp, setXp] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const level = getLevelFromXp(xp);
  const currentLevelXp = (level - 1) * XP_PER_LEVEL;
  const nextLevelXp = level * XP_PER_LEVEL;
  const progressFraction =
    XP_PER_LEVEL === 0 ? 0 : (xp - currentLevelXp) / XP_PER_LEVEL;
  const progressPercent = Math.min(Math.max(progressFraction * 100, 0), 100);

  const unlockedDaily = useMemo(
    () => DAILY_ACTIONS.filter((a) => tier >= a.requiredTier),
    [tier]
  );
  const lockedDaily = useMemo(
    () => DAILY_ACTIONS.filter((a) => tier < a.requiredTier),
    [tier]
  );

  const unlockedQuests = useMemo(
    () => SEASONAL_QUESTS.filter((q) => tier >= q.requiredTier),
    [tier]
  );
  const lockedQuests = useMemo(
    () => SEASONAL_QUESTS.filter((q) => tier < q.requiredTier),
    [tier]
  );

  const unlockedPowerUps = useMemo(
    () => POWER_UPS.filter((p) => tier >= p.requiredTier),
    [tier]
  );
  const lockedPowerUps = useMemo(
    () => POWER_UPS.filter((p) => tier < p.requiredTier),
    [tier]
  );

  const handleComplete = (action: GameAction) => {
    if (completedIds.includes(action.id)) return;
    setCompletedIds((prev) => [...prev, action.id]);
    setXp((prev) => prev + action.xp);
  };

  const handleResetDemoProgress = () => {
    setXp(0);
    setCompletedIds([]);
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="space-y-5">
        <p className="text-xs uppercase tracking-[0.25em] text-ribx-grey-500">
          RIBX GameFi Layer
        </p>
        <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.18em]">
          XP, Seasons &amp; Rewards Built Around Your Tier
        </h1>
        <p className="max-w-2xl text-sm text-ribx-grey-300">
          The GameFi hub turns your staking and real estate activity into a
          progression system. Complete daily actions, seasonal quests and unlock
          power-ups as you move through Bronze, Silver, Gold and Platinum.
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-xs">
          <div className="rounded-2xl border border-white/10 bg-ribx-bg-elevated px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ribx-grey-500">
              Current Tier
            </p>
            <p className="mt-1 text-sm font-semibold text-ribx-cream">
              {tierLabel}
            </p>
            <p className="mt-1 text-[11px] text-ribx-grey-400">
              {tierDescription}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ribx-bg-elevated px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ribx-grey-500">
              Staked RIBX
            </p>
            <p className="mt-1 text-sm font-semibold text-ribx-cream">
              {isLoading ? "…" : `${stakedBalance} RIBX`}
            </p>
            <p className="mt-1 text-[11px] text-ribx-grey-400">
              Your staking position defines your GameFi tier and unlocks
              missions.
            </p>
          </div>
          {!isConnected && (
            <div className="rounded-2xl border border-ribx-gold bg-ribx-bg-elevated/70 px-4 py-3 text-[11px] text-ribx-gold">
              Connect your wallet and stake RIBX to start tracking XP and tier
              progression.
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/staking"
            className="rounded-full bg-ribx-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ribx-bg hover:bg-ribx-gold-soft"
          >
            Adjust Staking Position
          </Link>
          <Link
            href="/real-estate"
            className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ribx-grey-200 hover:bg-white/5"
          >
            Explore Deals (XP Sources)
          </Link>
        </div>
      </section>

      {/* XP / Season Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Season Progress (Demo XP)
          </h2>
          <button
            onClick={handleResetDemoProgress}
            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-ribx-grey-300 hover:bg-white/5"
          >
            Reset Demo Progress
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ribx-bg-elevated p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-ribx-grey-500">
                Season Level
              </p>
              <p className="mt-1 text-lg font-semibold text-ribx-cream">
                Level {level}
              </p>
              <p className="mt-1 text-[11px] text-ribx-grey-400">
                Every action you mark as done in this demo contributes XP
                towards your season level. In production, XP would be tracked
                off-chain or on-chain and tied to your wallet.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-ribx-grey-500">
                XP
              </p>
              <p className="mt-1 text-sm font-semibold text-ribx-cream">
                {xp} XP
              </p>
              <p className="mt-1 text-[11px] text-ribx-grey-400">
                Next level at {nextLevelXp} XP
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ribx-grey-900/70">
            <div
              className="h-full rounded-full bg-ribx-gold"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-ribx-grey-500">
            <span>{currentLevelXp} XP</span>
            <span>{nextLevelXp} XP</span>
          </div>
        </div>
      </section>

      {/* Daily actions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Daily Actions
          </h2>
          <p className="text-xs text-ribx-grey-400">
            Lightweight actions you can complete every day to accumulate XP.
          </p>
        </div>

        {unlockedDaily.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-ribx-bg-elevated/60 p-6 text-sm text-ribx-grey-300">
            No daily actions unlocked yet. Reach Bronze tier to start collecting
            daily XP.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {unlockedDaily.map((action) => {
              const completed = completedIds.includes(action.id);
              return (
                <article
                  key={action.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-ribx-bg-elevated p-4 text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-ribx-cream">
                        {action.title}
                      </h3>
                      <span className="rounded-full bg-ribx-grey-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-300">
                        {action.baseReward}
                      </span>
                    </div>
                    <p className="text-ribx-grey-300">{action.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] text-ribx-grey-500">
                      Required tier:{" "}
                      <span className="font-semibold text-ribx-cream">
                        {action.requiredTier === 0
                          ? "Open to all"
                          : getTierLabel(action.requiredTier)}
                      </span>
                    </p>
                    <button
                      onClick={() => handleComplete(action)}
                      disabled={completed}
                      className="rounded-full bg-ribx-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-bg hover:bg-ribx-gold-soft disabled:opacity-60"
                    >
                      {completed ? "Completed" : "Mark as Done (Demo XP)"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {lockedDaily.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-500">
              Upcoming Daily Actions (Locked)
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {lockedDaily.map((action) => (
                <article
                  key={action.id}
                  className="rounded-2xl border border-dashed border-white/10 bg-ribx-bg/80 p-4 text-xs opacity-70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-ribx-cream">
                      {action.title}
                    </h3>
                    <span className="rounded-full bg-ribx-grey-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-300">
                      Locked
                    </span>
                  </div>
                  <p className="mt-2 text-ribx-grey-400">
                    Reach{" "}
                    <span className="font-semibold text-ribx-cream">
                      {getTierLabel(action.requiredTier)}
                    </span>{" "}
                    to unlock this daily action.
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Seasonal quests */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Seasonal Quests
          </h2>
          <p className="text-xs text-ribx-grey-400">
            Longer missions aligned with staking behaviour and governance.
          </p>
        </div>

        {unlockedQuests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-ribx-bg-elevated/60 p-6 text-sm text-ribx-grey-300">
            No seasonal quests available at your current tier. Stake RIBX to
            unlock your first season.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {unlockedQuests.map((quest) => {
              const completed = completedIds.includes(quest.id);
              return (
                <article
                  key={quest.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-ribx-bg-elevated p-5 text-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-ribx-cream">
                          {quest.title}
                        </h3>
                        <p className="text-[11px] text-ribx-grey-400">
                          Seasonal Mission · GameFi Layer
                        </p>
                      </div>
                      <span className="rounded-full bg-ribx-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-gold">
                        {quest.baseReward}
                      </span>
                    </div>
                    <p className="text-ribx-grey-300">{quest.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] text-ribx-grey-500">
                      Required tier:{" "}
                      <span className="font-semibold text-ribx-cream">
                        {getTierLabel(quest.requiredTier)}
                      </span>
                    </p>
                    <button
                      onClick={() => handleComplete(quest)}
                      disabled={completed}
                      className="rounded-full bg-ribx-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-bg hover:bg-ribx-gold-soft disabled:opacity-60"
                    >
                      {completed ? "Completed" : "Mark as Done (Demo XP)"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {lockedQuests.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-500">
              Higher-Tier Seasonal Quests (Locked)
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {lockedQuests.map((quest) => (
                <article
                  key={quest.id}
                  className="rounded-2xl border border-dashed border-white/10 bg-ribx-bg/80 p-5 text-xs opacity-70"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-ribx-cream">
                      {quest.title}
                    </h3>
                    <span className="rounded-full bg-ribx-grey-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ribx-grey-300">
                      Locked
                    </span>
                  </div>
                  <p className="mt-2 text-ribx-grey-400">
                    Reach{" "}
                    <span className="font-semibold text-ribx-cream">
                      {getTierLabel(quest.requiredTier)}
                    </span>{" "}
                    to unlock this seasonal quest and its XP reward.
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Power-Ups & Boosts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            Power-Ups &amp; Boosts
          </h2>
          <p className="text-xs text-ribx-grey-400">
            Planned multipliers and perks that map your tier to the GameFi layer.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {POWER_UPS.map((boost) => {
            const unlocked = tier >= boost.requiredTier;

            return (
              <article
                key={boost.id}
                className={[
                  "flex flex-col gap-3 rounded-2xl border bg-ribx-bg-elevated p-4 text-xs",
                  unlocked
                    ? "border-ribx-gold/50"
                    : "border-dashed border-white/10 opacity-80",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-ribx-cream">
                      {boost.title}
                    </h3>
                    <p className="text-[11px] text-ribx-grey-400">
                      Required: {getTierLabel(boost.requiredTier)}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      unlocked
                        ? "bg-ribx-gold/15 text-ribx-gold"
                        : "bg-ribx-grey-900/80 text-ribx-grey-300",
                    ].join(" ")}
                  >
                    {unlocked ? "Active (Demo)" : "Locked"}
                  </span>
                </div>
                <p className="text-ribx-grey-300">{boost.description}</p>
                <p className="text-[11px] text-ribx-grey-200">
                  Effect:{" "}
                  <span className="font-semibold text-ribx-cream">
                    {boost.effect}
                  </span>
                </p>
              </article>
            );
          })}
        </div>

        <p className="text-[11px] text-ribx-grey-500">
          In the live environment, these boosts would be applied to an on-chain
          or off-chain XP engine, with progression and rewards visible across
          the RIBX ecosystem.
        </p>
      </section>
    </div>
  );
}
