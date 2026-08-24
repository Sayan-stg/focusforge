"use client";

import { useState } from "react";
import type { useHabits } from "@/hooks/useHabits";

type HabitsReturn = ReturnType<typeof useHabits>;

interface HabitChecklistProps {
  habits: HabitsReturn;
}

export default function HabitChecklist({ habits }: HabitChecklistProps) {
  const {
    habits: habitList,
    addHabit,
    removeHabit,
    toggleToday,
    isCompletedToday,
    getStreak,
    getCompletionRate,
    todayProgress,
  } = habits;

  const [newHabit, setNewHabit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newHabit.trim()) {
      addHabit(newHabit.trim());
      setNewHabit("");
      setIsAdding(false);
    }
  };

  return (
    <section id="habit-checklist" className="fade-in">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-[length:var(--font-size-lg)] font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The 1% Rule
        </h2>
        <div className="flex items-center gap-3">
          <span
            className="text-[length:var(--font-size-xs)] uppercase tracking-widest"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {Math.round(todayProgress * 100)}% today
          </span>
        </div>
      </div>

      {/* Progress bar for today */}
      <div
        className="h-1 rounded-full mb-6 overflow-hidden"
        style={{ background: "var(--color-surface-overlay)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${todayProgress * 100}%`,
            background: "var(--color-accent)",
            transitionTimingFunction: "var(--ease-out)",
          }}
        />
      </div>

      {/* Habit list */}
      <div className="space-y-1">
        {habitList.map((habit) => {
          const done = isCompletedToday(habit.id);
          const streak = getStreak(habit.id);
          const rate = getCompletionRate(habit.id);

          return (
            <div
              key={habit.id}
              className="group flex items-center gap-4 py-3 px-4 rounded-[var(--radius-md)] transition-colors duration-200"
              style={{
                background: done
                  ? "var(--color-accent-soft)"
                  : "transparent",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleToday(habit.id)}
                className="w-5 h-5 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  borderColor: done
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                  background: done ? "var(--color-accent)" : "transparent",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                id={`habit-toggle-${habit.id}`}
              >
                {done && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="var(--color-text-inverse)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* Name + micro-progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <span
                    className="text-[length:var(--font-size-base)] font-medium truncate"
                    style={{
                      color: done
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                      textDecoration: done ? "line-through" : "none",
                      textDecorationColor: "var(--color-accent-muted)",
                    }}
                  >
                    {habit.name}
                  </span>
                  {streak > 0 && (
                    <span
                      className="text-[length:var(--font-size-xs)] font-medium tabular-nums flex-shrink-0"
                      style={{ color: "var(--color-accent-muted)" }}
                    >
                      {streak}d streak
                    </span>
                  )}
                </div>
                {/* Micro-progress bar (30-day rate) */}
                <div
                  className="h-0.5 rounded-full mt-1.5 overflow-hidden"
                  style={{ background: "var(--color-surface-overlay)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${rate * 100}%`,
                      background: done
                        ? "var(--color-accent)"
                        : "var(--color-accent-muted)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  />
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-[var(--radius-sm)] transition-opacity duration-200"
                style={{
                  color: "var(--color-text-tertiary)",
                  transitionTimingFunction: "var(--ease-out)",
                }}
                id={`habit-delete-${habit.id}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add habit */}
      {isAdding ? (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="New daily habit..."
            autoFocus
            className="flex-1 px-3 py-2 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] outline-none placeholder:text-[var(--color-text-tertiary)]"
            style={{
              background: "var(--color-surface-raised)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
            }}
            id="habit-input"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] font-medium transition-colors duration-200"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-text-inverse)",
              transitionTimingFunction: "var(--ease-out)",
            }}
            id="habit-submit"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewHabit("");
            }}
            className="px-3 py-2 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] transition-colors duration-200"
            style={{
              background: "var(--color-surface-raised)",
              color: "var(--color-text-tertiary)",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 px-4 py-2 rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] font-medium transition-colors duration-200 w-full text-left"
          style={{
            background: "transparent",
            color: "var(--color-text-tertiary)",
            border: "1px dashed var(--color-border)",
            transitionTimingFunction: "var(--ease-out)",
          }}
          id="habit-add-button"
        >
          + Add a habit
        </button>
      )}

      {/* Empty state */}
      {habitList.length === 0 && !isAdding && (
        <p
          className="text-[length:var(--font-size-sm)] mt-4"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Track daily habits to build your unbroken chain. Each day you complete
          all habits, the chain grows.
        </p>
      )}
    </section>
  );
}
