"use client";

import { useState, useEffect, useCallback } from "react";

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completions: string[]; // ISO date strings (YYYY-MM-DD)
}

const STORAGE_KEY = "focusforge-habits";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((name: string) => {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        completions: [],
      },
    ]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id: string) => {
    const today = todayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(today);
        return {
          ...h,
          completions: has
            ? h.completions.filter((d) => d !== today)
            : [...h.completions, today],
        };
      })
    );
  }, []);

  const isCompletedToday = useCallback(
    (id: string) => {
      const h = habits.find((h) => h.id === id);
      return h ? h.completions.includes(todayKey()) : false;
    },
    [habits]
  );

  const getStreak = useCallback(
    (id: string): number => {
      const h = habits.find((h) => h.id === id);
      if (!h) return 0;
      const sorted = [...h.completions].sort().reverse();
      if (sorted.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
        if (sorted.includes(key)) {
          streak++;
        } else if (i === 0) {
          // Today not completed yet is ok, keep checking from yesterday
          continue;
        } else {
          break;
        }
      }
      return streak;
    },
    [habits]
  );

  const getCompletionRate = useCallback(
    (id: string, days: number = 30): number => {
      const h = habits.find((h) => h.id === id);
      if (!h) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let completed = 0;
      for (let i = 0; i < days; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
        if (h.completions.includes(key)) completed++;
      }
      return completed / days;
    },
    [habits]
  );

  const todayProgress = habits.length > 0
    ? habits.filter((h) => h.completions.includes(todayKey())).length / habits.length
    : 0;

  return {
    habits,
    addHabit,
    removeHabit,
    toggleToday,
    isCompletedToday,
    getStreak,
    getCompletionRate,
    todayProgress,
    todayKey: todayKey(),
  };
}
