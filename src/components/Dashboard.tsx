"use client";

import { useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import { useHabits } from "@/hooks/useHabits";
import { useStreaks } from "@/hooks/useStreaks";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import FlowTimer from "@/components/FlowTimer";
import HabitChecklist from "@/components/HabitChecklist";
import ContributionHeatmap from "@/components/ContributionHeatmap";
import LeagueLeaderboard from "@/components/LeagueLeaderboard";

type View = "timer" | "habits" | "heatmap" | "league";

export default function Dashboard() {
  const timer = useTimer();
  const habits = useHabits();
  const { heatmapData, streakInfo, weekData } = useStreaks(habits.habits);
  const leaderboard = useLeaderboard(timer.totalFocusPoints, streakInfo.currentStreak);

  const [activeView, setActiveView] = useState<View>("timer");

  const navItems: { id: View; label: string; shortLabel: string }[] = [
    { id: "timer", label: "Flow Timer", shortLabel: "Timer" },
    { id: "habits", label: "Habits", shortLabel: "Habits" },
    { id: "heatmap", label: "Heatmap", shortLabel: "Map" },
    { id: "league", label: "League", shortLabel: "League" },
  ];

  return (
    <div
      className="min-h-dvh"
      style={{ background: "var(--color-surface-root)" }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: "oklch(0.13 0.008 265 / 0.85)",
          borderBottom: "1px solid var(--color-border-subtle)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Logo */}
        <div className="flex items-baseline gap-1.5">
          <h1
            className="text-[length:var(--font-size-md)] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FocusForge
          </h1>
          <span
            className="text-[length:var(--font-size-xs)]"
            style={{ color: "var(--color-accent-muted)" }}
          >
            ·
          </span>
          <span
            className="text-[length:var(--font-size-xs)]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            deep work engine
          </span>
        </div>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: timer.isRunning
                  ? "var(--color-success)"
                  : "var(--color-text-tertiary)",
              }}
            />
            <span
              className="text-[length:var(--font-size-xs)] tabular-nums"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {timer.totalFocusPoints} pts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[length:var(--font-size-xs)] tabular-nums"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {streakInfo.currentStreak}d streak
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[length:var(--font-size-xs)]"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {Math.round(habits.todayProgress * 100)}% today
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation tabs */}
        <nav className="flex gap-1 mb-8" id="main-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="px-4 py-2 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] font-medium transition-all duration-200"
              style={{
                background:
                  activeView === item.id
                    ? "var(--color-surface-overlay)"
                    : "transparent",
                color:
                  activeView === item.id
                    ? "var(--color-text-primary)"
                    : "var(--color-text-tertiary)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              id={`nav-${item.id}`}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>
            </button>
          ))}
        </nav>

        {/* Active section */}
        <div key={activeView}>
          {activeView === "timer" && <FlowTimer timer={timer} />}
          {activeView === "habits" && <HabitChecklist habits={habits} />}
          {activeView === "heatmap" && (
            <ContributionHeatmap
              data={heatmapData}
              streakInfo={streakInfo}
            />
          )}
          {activeView === "league" && (
            <LeagueLeaderboard leaderboard={leaderboard} />
          )}
        </div>

        {/* Weekly activity bar (always visible below main content) */}
        <div
          className="mt-12 pt-8"
          style={{ borderTop: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <span
              className="text-[length:var(--font-size-sm)] font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              This week
            </span>
            <span
              className="text-[length:var(--font-size-xs)] tabular-nums"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {weekData.reduce((s, d) => s + d.completed, 0)} / {weekData.reduce((s, d) => s + d.total, 0)} habits
            </span>
          </div>
          <div className="flex gap-2 items-end h-16">
            {weekData.map((day, i) => {
              const height =
                day.total > 0 ? (day.completed / day.total) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-[var(--radius-sm)] transition-all duration-300"
                    style={{
                      height: `${Math.max(4, height * 0.56)}px`,
                      background:
                        height > 0
                          ? "var(--color-accent)"
                          : "var(--color-surface-overlay)",
                      opacity: height > 0 ? 0.4 + (height / 100) * 0.6 : 0.3,
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  />
                  <span
                    className="text-[length:var(--font-size-xs)]"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-6 px-6 text-center"
        style={{
          borderTop: "1px solid var(--color-border-subtle)",
        }}
      >
        <p
          className="text-[length:var(--font-size-xs)]"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          FocusForge — all data stored locally in your browser
        </p>
      </footer>
    </div>
  );
}
