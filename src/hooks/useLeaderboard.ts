"use client";

import { useMemo } from "react";

export type Tier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface LeaderboardUser {
  id: string;
  name: string;
  focusPoints: number;
  tier: Tier;
  streak: number;
  isUser: boolean;
  rank?: number;
}

const TIER_THRESHOLDS: Record<Tier, { min: number; max: number }> = {
  bronze: { min: 0, max: 199 },
  silver: { min: 200, max: 499 },
  gold: { min: 500, max: 999 },
  platinum: { min: 1000, max: 1999 },
  diamond: { min: 2000, max: 9999 },
};

const TIER_ORDER: Tier[] = ["bronze", "silver", "gold", "platinum", "diamond"];

const FIRST_NAMES = [
  "Aanya", "Blake", "Cora", "Dmitri", "Elena", "Felix", "Gia", "Hiro",
  "Ivy", "Jasper", "Kira", "Leo", "Maya", "Nico", "Ora", "Pavel",
  "Quinn", "Ren", "Suki", "Tao", "Uma", "Victor", "Wren", "Xia",
  "Yusuf", "Zara", "Amir", "Brynn", "Celeste", "Dane", "Emery", "Faye",
  "Griffin", "Haven", "Isla", "Jun", "Kai", "Luna", "Miles", "Noa",
  "Olive", "Phoenix", "Reed", "Sage", "Thea", "Uri", "Vale", "Willow",
  "Xander", "Yara",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateCompetitors(): LeaderboardUser[] {
  const rng = seededRandom(42);
  const competitors: LeaderboardUser[] = [];

  // Distribution: 15 bronze, 15 silver, 10 gold, 7 platinum, 3 diamond
  const distribution: { tier: Tier; count: number }[] = [
    { tier: "bronze", count: 15 },
    { tier: "silver", count: 15 },
    { tier: "gold", count: 10 },
    { tier: "platinum", count: 7 },
    { tier: "diamond", count: 3 },
  ];

  let nameIdx = 0;
  for (const { tier, count } of distribution) {
    const { min, max } = TIER_THRESHOLDS[tier];
    for (let i = 0; i < count; i++) {
      const points = Math.floor(min + rng() * (max - min));
      const streak = Math.floor(rng() * 60) + 1;
      competitors.push({
        id: `bot-${nameIdx}`,
        name: FIRST_NAMES[nameIdx % FIRST_NAMES.length],
        focusPoints: points,
        tier,
        streak,
        isUser: false,
      });
      nameIdx++;
    }
  }

  return competitors;
}

const MOCK_COMPETITORS = generateCompetitors();

export function useLeaderboard(userFocusPoints: number, userStreak: number = 0) {
  const userTier = useMemo((): Tier => {
    for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
      if (userFocusPoints >= TIER_THRESHOLDS[TIER_ORDER[i]].min) {
        return TIER_ORDER[i];
      }
    }
    return "bronze";
  }, [userFocusPoints]);

  const rankedUsers = useMemo((): LeaderboardUser[] => {
    const user: LeaderboardUser = {
      id: "user",
      name: "You",
      focusPoints: userFocusPoints,
      tier: userTier,
      streak: userStreak,
      isUser: true,
    };

    const all = [...MOCK_COMPETITORS, user].sort(
      (a, b) => b.focusPoints - a.focusPoints
    );

    return all.map((u, i) => ({ ...u, rank: i + 1 }));
  }, [userFocusPoints, userTier, userStreak]);

  const userRank = rankedUsers.find((u) => u.isUser)?.rank ?? 51;

  const tierUsers = useMemo(() => {
    return rankedUsers.filter((u) => u.tier === userTier);
  }, [rankedUsers, userTier]);

  const nextTier = useMemo((): { tier: Tier; pointsNeeded: number } | null => {
    const idx = TIER_ORDER.indexOf(userTier);
    if (idx >= TIER_ORDER.length - 1) return null;
    const next = TIER_ORDER[idx + 1];
    return {
      tier: next,
      pointsNeeded: TIER_THRESHOLDS[next].min - userFocusPoints,
    };
  }, [userTier, userFocusPoints]);

  const tierProgress = useMemo((): number => {
    const { min, max } = TIER_THRESHOLDS[userTier];
    const range = max - min;
    if (range === 0) return 1;
    return Math.min(1, (userFocusPoints - min) / range);
  }, [userTier, userFocusPoints]);

  return {
    userTier,
    userRank,
    rankedUsers,
    tierUsers,
    nextTier,
    tierProgress,
    tiers: TIER_ORDER,
    thresholds: TIER_THRESHOLDS,
  };
}
