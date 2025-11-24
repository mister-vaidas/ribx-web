// src/lib/tiers.ts

export const TIER_LABELS: Record<number, string> = {
  0: "No Tier",
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Platinum",
};

export function getTierLabel(tier: number): string {
  return TIER_LABELS[tier] ?? "No Tier";
}

export function getTierDescription(tier: number): string {
  switch (tier) {
    case 1:
      return "Bronze: Early signals & basic analytics.";
    case 2:
      return "Silver: Curated deal flow & enhanced analytics.";
    case 3:
      return "Gold: Priority allocations & deeper data rooms.";
    case 4:
      return "Platinum: Institutional-level access, co-invest rights.";
    default:
      return "Stake RIBX to unlock access tiers and see more deals.";
  }
}
