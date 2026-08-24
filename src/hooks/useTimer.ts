"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface TimerSession {
  id: string;
  type: "work" | "short-break" | "long-break";
  duration: number; // seconds
  completedAt: string; // ISO
  focusPoints: number;
}

export interface TimerState {
  phase: "work" | "short-break" | "long-break";
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  sessionsCompleted: number;
  todayPoints: number;
  sessions: TimerSession[];
}

const DURATIONS = {
  work: 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

const STORAGE_KEY = "focusforge-timer";

function loadState(): Pick<TimerState, "sessionsCompleted" | "todayPoints" | "sessions"> {
  if (typeof window === "undefined") return { sessionsCompleted: 0, todayPoints: 0, sessions: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessionsCompleted: 0, todayPoints: 0, sessions: [] };
    const data = JSON.parse(raw);
    // Reset daily counters if not today
    const today = new Date().toDateString();
    if (data.lastDate !== today) {
      return { sessionsCompleted: 0, todayPoints: 0, sessions: data.sessions || [] };
    }
    return {
      sessionsCompleted: data.sessionsCompleted || 0,
      todayPoints: data.todayPoints || 0,
      sessions: data.sessions || [],
    };
  } catch {
    return { sessionsCompleted: 0, todayPoints: 0, sessions: [] };
  }
}

function saveState(state: Pick<TimerState, "sessionsCompleted" | "todayPoints" | "sessions">) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      lastDate: new Date().toDateString(),
    })
  );
}

export function useTimer() {
  const [state, setState] = useState<TimerState>(() => {
    const saved = loadState();
    return {
      phase: "work",
      secondsLeft: DURATIONS.work,
      totalSeconds: DURATIONS.work,
      isRunning: false,
      ...saved,
    };
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist on change
  useEffect(() => {
    saveState({
      sessionsCompleted: state.sessionsCompleted,
      todayPoints: state.todayPoints,
      sessions: state.sessions,
    });
  }, [state.sessionsCompleted, state.todayPoints, state.sessions]);

  // Countdown logic
  useEffect(() => {
    if (!state.isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.secondsLeft <= 1) {
          // Phase completed
          const pointsEarned = prev.phase === "work" ? 10 : 0;
          const newSession: TimerSession | null =
            prev.phase === "work"
              ? {
                  id: crypto.randomUUID(),
                  type: "work",
                  duration: prev.totalSeconds,
                  completedAt: new Date().toISOString(),
                  focusPoints: pointsEarned,
                }
              : null;

          const newSessionsCompleted = prev.sessionsCompleted + (prev.phase === "work" ? 1 : 0);
          const nextPhase: TimerState["phase"] =
            prev.phase === "work"
              ? newSessionsCompleted % 4 === 0
                ? "long-break"
                : "short-break"
              : "work";

          return {
            ...prev,
            phase: nextPhase,
            secondsLeft: DURATIONS[nextPhase],
            totalSeconds: DURATIONS[nextPhase],
            isRunning: false,
            sessionsCompleted: newSessionsCompleted,
            todayPoints: prev.todayPoints + pointsEarned,
            sessions: newSession ? [newSession, ...prev.sessions].slice(0, 100) : prev.sessions,
          };
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning]);

  const start = useCallback(() => setState((p) => ({ ...p, isRunning: true })), []);
  const pause = useCallback(() => setState((p) => ({ ...p, isRunning: false })), []);
  const reset = useCallback(
    () =>
      setState((p) => ({
        ...p,
        secondsLeft: DURATIONS[p.phase],
        totalSeconds: DURATIONS[p.phase],
        isRunning: false,
      })),
    []
  );
  const skip = useCallback(() => {
    setState((p) => {
      const nextPhase: TimerState["phase"] =
        p.phase === "work"
          ? p.sessionsCompleted % 4 === 0
            ? "long-break"
            : "short-break"
          : "work";
      return {
        ...p,
        phase: nextPhase,
        secondsLeft: DURATIONS[nextPhase],
        totalSeconds: DURATIONS[nextPhase],
        isRunning: false,
      };
    });
  }, []);

  const setPhase = useCallback((phase: TimerState["phase"]) => {
    setState((p) => ({
      ...p,
      phase,
      secondsLeft: DURATIONS[phase],
      totalSeconds: DURATIONS[phase],
      isRunning: false,
    }));
  }, []);

  const totalFocusPoints = state.sessions.reduce((sum, s) => sum + s.focusPoints, 0) + state.todayPoints - state.sessions.filter(s => {
    const sessionDate = new Date(s.completedAt).toDateString();
    return sessionDate === new Date().toDateString();
  }).reduce((sum, s) => sum + s.focusPoints, 0);

  return {
    ...state,
    totalFocusPoints: state.sessions.reduce((sum, s) => sum + s.focusPoints, 0),
    start,
    pause,
    reset,
    skip,
    setPhase,
    progress: 1 - state.secondsLeft / state.totalSeconds,
  };
}
