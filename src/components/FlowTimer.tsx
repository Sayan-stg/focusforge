"use client";

import { useTimer } from "@/hooks/useTimer";

const PHASE_LABELS = {
  work: "Deep Work",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

const PHASE_COLORS = {
  work: "var(--color-accent)",
  "short-break": "var(--color-success)",
  "long-break": "var(--color-tier-platinum)",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface FlowTimerProps {
  timer: ReturnType<typeof useTimer>;
}

export default function FlowTimer({ timer }: FlowTimerProps) {
  const {
    phase,
    secondsLeft,
    isRunning,
    progress,
    sessionsCompleted,
    todayPoints,
    start,
    pause,
    reset,
    skip,
    setPhase,
  } = timer;

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);
  const accentColor = PHASE_COLORS[phase];

  return (
    <section id="flow-timer" className="fade-in">
      {/* Section label */}
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-[length:var(--font-size-lg)] font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Flow Timer
        </h2>
        <span className="text-[length:var(--font-size-xs)] uppercase tracking-widest"
          style={{ color: "var(--color-text-tertiary)" }}>
          Session {sessionsCompleted + 1}
        </span>
      </div>

      {/* Asymmetric layout: timer left, stats right */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Timer ring */}
        <div className="relative flex-shrink-0">
          <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            className="block"
          >
            {/* Track */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="var(--color-surface-overlay)"
              strokeWidth="6"
            />
            {/* Progress arc */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke={accentColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 160 160)"
              style={{
                transition: "stroke-dashoffset 1s var(--ease-out), stroke 0.3s var(--ease-out)",
              }}
            />
            {/* Glow dot at progress head */}
            {progress > 0 && (
              <circle
                cx={160 + 140 * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
                cy={160 + 140 * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
                r="4"
                fill={accentColor}
                style={{
                  filter: `drop-shadow(0 0 8px ${accentColor})`,
                  transition: "cx 1s var(--ease-out), cy 1s var(--ease-out)",
                }}
              />
            )}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="tabular-nums font-bold leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--font-size-display)",
                color: "var(--color-text-primary)",
                letterSpacing: "-0.04em",
              }}
            >
              {formatTime(secondsLeft)}
            </span>
            <span
              className="mt-2 uppercase tracking-widest"
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-tertiary)",
              }}
            >
              {PHASE_LABELS[phase]}
            </span>
          </div>
        </div>

        {/* Right column: controls + stats */}
        <div className="flex flex-col gap-6 flex-1 min-w-0 pt-4">
          {/* Phase selector */}
          <div className="flex gap-1">
            {(["work", "short-break", "long-break"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[length:var(--font-size-sm)] font-medium transition-colors duration-200"
                style={{
                  background:
                    phase === p
                      ? "var(--color-surface-overlay)"
                      : "transparent",
                  color:
                    phase === p
                      ? "var(--color-text-primary)"
                      : "var(--color-text-tertiary)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                {p === "work" ? "25m" : p === "short-break" ? "5m" : "15m"}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={isRunning ? pause : start}
              className="px-6 py-2.5 rounded-[var(--radius-md)] font-semibold text-[length:var(--font-size-base)] transition-all duration-200"
              style={{
                background: isRunning
                  ? "var(--color-surface-overlay)"
                  : "var(--color-accent)",
                color: isRunning
                  ? "var(--color-text-primary)"
                  : "var(--color-text-inverse)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              id="timer-start-pause"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] transition-colors duration-200"
              style={{
                background: "var(--color-surface-raised)",
                color: "var(--color-text-secondary)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              id="timer-reset"
            >
              Reset
            </button>
            <button
              onClick={skip}
              className="px-4 py-2.5 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] transition-colors duration-200"
              style={{
                background: "var(--color-surface-raised)",
                color: "var(--color-text-secondary)",
                transitionTimingFunction: "var(--ease-out)",
              }}
              id="timer-skip"
            >
              Skip
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div
                className="text-[length:var(--font-size-2xl)] font-bold tabular-nums"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-primary)",
                }}
              >
                {sessionsCompleted}
              </div>
              <div
                className="text-[length:var(--font-size-xs)] uppercase tracking-widest"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Sessions today
              </div>
            </div>
            <div>
              <div
                className="text-[length:var(--font-size-2xl)] font-bold tabular-nums"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent)",
                }}
              >
                {todayPoints}
              </div>
              <div
                className="text-[length:var(--font-size-xs)] uppercase tracking-widest"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Points earned
              </div>
            </div>
          </div>

          {/* Recent sessions */}
          {timer.sessions.length > 0 && (
            <div className="mt-2">
              <h3
                className="text-[length:var(--font-size-sm)] font-medium mb-3"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Recent
              </h3>
              <div className="space-y-1.5">
                {timer.sessions.slice(0, 4).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-1.5 px-3 rounded-[var(--radius-sm)]"
                    style={{ background: "var(--color-surface-raised)" }}
                  >
                    <span
                      className="text-[length:var(--font-size-sm)]"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {new Date(session.completedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span
                      className="text-[length:var(--font-size-sm)] font-medium tabular-nums"
                      style={{ color: "var(--color-accent)" }}
                    >
                      +{session.focusPoints} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
