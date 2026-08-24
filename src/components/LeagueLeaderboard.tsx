"use client";

import type { useLeaderboard } from "@/hooks/useLeaderboard";
import type { Tier } from "@/hooks/useLeaderboard";

type LeaderboardReturn = ReturnType<typeof useLeaderboard>;

interface LeagueLeaderboardProps {
  leaderboard: LeaderboardReturn;
}

const TIER_NAMES: Record<Tier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  diamond: "Diamond",
};

const TIER_COLORS: Record<Tier, string> = {
  bronze: "var(--color-tier-bronze)",
  silver: "var(--color-tier-silver)",
  gold: "var(--color-tier-gold)",
  platinum: "var(--color-tier-platinum)",
  diamond: "var(--color-tier-diamond)",
};

export default function LeagueLeaderboard({
  leaderboard,
}: LeagueLeaderboardProps) {
  const {
    userTier,
    userRank,
    rankedUsers,
    nextTier,
    tierProgress,
  } = leaderboard;

  // Show top 15 + user's position region
  const displayUsers = (() => {
    const top15 = rankedUsers.slice(0, 15);
    const userInTop = top15.some((u) => u.isUser);
    if (userInTop) return top15;

    // Find user and show surrounding context
    const userIdx = rankedUsers.findIndex((u) => u.isUser);
    const contextStart = Math.max(0, userIdx - 2);
    const contextEnd = Math.min(rankedUsers.length, userIdx + 3);
    return [
      ...top15,
      ...(contextStart > 15 ? [null] : []), // separator
      ...rankedUsers.slice(
        Math.max(15, contextStart),
        contextEnd
      ),
    ];
  })();

  return (
    <section id="league-leaderboard" className="fade-in">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-[length:var(--font-size-lg)] font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          League
        </h2>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: TIER_COLORS[userTier] }}
          />
          <span
            className="text-[length:var(--font-size-sm)] font-medium"
            style={{ color: TIER_COLORS[userTier] }}
          >
            {TIER_NAMES[userTier]}
          </span>
          <span
            className="text-[length:var(--font-size-xs)] tabular-nums"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            #{userRank}
          </span>
        </div>
      </div>

      {/* Tier progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[length:var(--font-size-xs)] uppercase tracking-widest"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Tier progress
          </span>
          {nextTier && (
            <span
              className="text-[length:var(--font-size-xs)] tabular-nums"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {nextTier.pointsNeeded > 0
                ? `${nextTier.pointsNeeded} pts to ${TIER_NAMES[nextTier.tier]}`
                : `Promoted to ${TIER_NAMES[nextTier.tier]}!`}
            </span>
          )}
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--color-surface-overlay)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${tierProgress * 100}%`,
              background: TIER_COLORS[userTier],
              transitionTimingFunction: "var(--ease-out)",
            }}
          />
        </div>
        {/* Tier chips */}
        <div className="flex gap-1 mt-3">
          {leaderboard.tiers.map((tier) => (
            <div
              key={tier}
              className="flex-1 h-1 rounded-full transition-opacity duration-300"
              style={{
                background: TIER_COLORS[tier],
                opacity: tier === userTier ? 1 : 0.2,
                transitionTimingFunction: "var(--ease-out)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="space-y-0.5">
        {/* Header row */}
        <div
          className="grid py-2 px-3 text-[length:var(--font-size-xs)] uppercase tracking-widest"
          style={{
            gridTemplateColumns: "40px 1fr 90px 70px",
            color: "var(--color-text-tertiary)",
          }}
        >
          <span>#</span>
          <span>Player</span>
          <span className="text-right">Points</span>
          <span className="text-right">Streak</span>
        </div>

        {/* User rows */}
        {displayUsers.map((user, idx) => {
          if (user === null) {
            return (
              <div
                key={`sep-${idx}`}
                className="flex items-center justify-center py-1"
              >
                <span
                  className="text-[length:var(--font-size-xs)]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  · · ·
                </span>
              </div>
            );
          }

          const isPromoZone = (user.rank ?? 0) <= 10;
          const isDemoteZone = (user.rank ?? 0) > 40;

          return (
            <div
              key={user.id}
              className="grid py-2.5 px-3 rounded-[var(--radius-sm)] transition-colors duration-200"
              style={{
                gridTemplateColumns: "40px 1fr 90px 70px",
                background: user.isUser
                  ? "var(--color-accent-soft)"
                  : isPromoZone
                    ? "var(--color-success-soft)"
                    : isDemoteZone
                      ? "var(--color-danger-soft)"
                      : "transparent",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              <span
                className="text-[length:var(--font-size-sm)] tabular-nums font-medium"
                style={{
                  color: user.isUser
                    ? "var(--color-accent)"
                    : "var(--color-text-tertiary)",
                }}
              >
                {user.rank}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: TIER_COLORS[user.tier] }}
                />
                <span
                  className="text-[length:var(--font-size-sm)] font-medium truncate"
                  style={{
                    color: user.isUser
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                  }}
                >
                  {user.name}
                  {user.isUser && (
                    <span
                      className="ml-1.5 text-[length:var(--font-size-xs)]"
                      style={{ color: "var(--color-accent-muted)" }}
                    >
                      you
                    </span>
                  )}
                </span>
              </div>
              <span
                className="text-[length:var(--font-size-sm)] tabular-nums text-right font-medium"
                style={{
                  color: user.isUser
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                }}
              >
                {user.focusPoints.toLocaleString()}
              </span>
              <span
                className="text-[length:var(--font-size-sm)] tabular-nums text-right"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {user.streak}d
              </span>
            </div>
          );
        })}
      </div>

      {/* Zone legend */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-[2px]"
            style={{ background: "var(--color-success-soft)" }}
          />
          <span
            className="text-[length:var(--font-size-xs)]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Promotion zone
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-[2px]"
            style={{ background: "var(--color-danger-soft)" }}
          />
          <span
            className="text-[length:var(--font-size-xs)]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Demotion zone
          </span>
        </div>
      </div>
    </section>
  );
}
