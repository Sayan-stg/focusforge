"use client";

import { useMemo } from "react";
import type { Habit } from "./useHabits";

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // 0–max habits
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ShieldState {
  total: number;
  used: number;
  available: number;
  longestStreak: number;
  currentStreak: number;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useStreaks(habits: Habit[]) {
  const heatmapData = useMemo((): HeatmapDay[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: HeatmapDay[] = [];
    const totalHabits = habits.length || 1;

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);

      let count = 0;
      for (const habit of habits) {
        if (habit.completions.includes(key)) count++;
      }

      const ratio = count / totalHabits;
      const level: HeatmapDay["level"] =
        count === 0
          ? 0
          : ratio <= 0.25
            ? 1
            : ratio <= 0.5
              ? 2
              : ratio <= 0.75
                ? 3
                : 4;

      days.push({ date: key, count, level });
    }
    return days;
  }, [habits]);

  const streakInfo = useMemo((): ShieldState => {
    if (habits.length === 0)
      return { total: 0, used: 0, available: 0, longestStreak: 0, currentStreak: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count consecutive days where at least 1 habit was completed
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);

      const anyDone = habits.some((h) => h.completions.includes(key));

      if (anyDone) {
        tempStreak++;
        if (i < 60 && currentStreak === 0 && (i === 0 || currentStreak === 0)) {
          // Still in current streak
        }
      } else {
        if (i === 0) {
          // Today not yet done, keep going
          continue;
        }
        if (currentStreak === 0) currentStreak = tempStreak;
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    if (currentStreak === 0) currentStreak = tempStreak;
    longestStreak = Math.max(longestStreak, tempStreak);

    // Shields: 1 per 7 consecutive days
    const totalShields = Math.floor(longestStreak / 7);
    const usedShields = 0; // Could load from localStorage if needed

    return {
      total: totalShields,
      used: usedShields,
      available: totalShields - usedShields,
      longestStreak,
      currentStreak,
    };
  }, [habits]);

  const weekData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week: { day: string; completed: number; total: number }[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      let count = 0;
      for (const habit of habits) {
        if (habit.completions.includes(key)) count++;
      }
      week.push({
        day: dayNames[d.getDay()],
        completed: count,
        total: habits.length,
      });
    }
    return week;
  }, [habits]);

  return { heatmapData, streakInfo, weekData };
}
