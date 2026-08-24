"use client";

import { useState, useMemo } from "react";
import type { HeatmapDay, ShieldState } from "@/hooks/useStreaks";

interface ContributionHeatmapProps {
  data: HeatmapDay[];
  streakInfo: ShieldState;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function ContributionHeatmap({
  data,
  streakInfo,
}: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Group data into weeks (columns)
  const weeks = useMemo(() => {
    const result: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];

    // Find what day of week the first entry falls on
    const firstDate = new Date(data[0]?.date || Date.now());
    const startDayOfWeek = firstDate.getDay();

    // Pad initial week
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: "", count: -1, level: 0 });
    }

    for (const day of data) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    return result;
  }, [data]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      for (const day of week) {
        if (day.date && day.count >= 0) {
          const month = new Date(day.date).getMonth();
          if (month !== lastMonth) {
            labels.push({ month: MONTHS[month], weekIndex });
            lastMonth = month;
          }
          break;
        }
      }
    });
    return labels;
  }, [weeks]);

  const cellSize = 13;
  const cellGap = 3;
  const labelWidth = 32;
  const headerHeight = 20;
  const svgWidth = labelWidth + weeks.length * (cellSize + cellGap);
  const svgHeight = headerHeight + 7 * (cellSize + cellGap);

  const handleMouseEnter = (
    day: HeatmapDay,
    e: React.MouseEvent<SVGRectElement>
  ) => {
    if (day.count < 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
  };

  return (
    <section id="contribution-heatmap" className="fade-in">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-[length:var(--font-size-lg)] font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Unbroken Chain
        </h2>
        <div className="flex items-center gap-4">
          {/* Streak shields */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(streakInfo.available, 5) }).map(
                (_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                  >
                    <path
                      d="M8 1L2 4V9C2 12.3 4.7 15.4 8 17C11.3 15.4 14 12.3 14 9V4L8 1Z"
                      fill="var(--color-accent)"
                      fillOpacity="0.8"
                      stroke="var(--color-accent)"
                      strokeWidth="1"
                    />
                  </svg>
                )
              )}
              {streakInfo.available === 0 && (
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                  <path
                    d="M8 1L2 4V9C2 12.3 4.7 15.4 8 17C11.3 15.4 14 12.3 14 9V4L8 1Z"
                    fill="none"
                    stroke="var(--color-border)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-[length:var(--font-size-xs)] tabular-nums"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {streakInfo.available} shield{streakInfo.available !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Streak stats row */}
      <div className="flex gap-8 mb-5">
        <div>
          <span
            className="text-[length:var(--font-size-xl)] font-bold tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-accent)",
            }}
          >
            {streakInfo.currentStreak}
          </span>
          <span
            className="text-[length:var(--font-size-xs)] uppercase tracking-widest ml-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Current streak
          </span>
        </div>
        <div>
          <span
            className="text-[length:var(--font-size-xl)] font-bold tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-secondary)",
            }}
          >
            {streakInfo.longestStreak}
          </span>
          <span
            className="text-[length:var(--font-size-xs)] uppercase tracking-widest ml-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Longest
          </span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="relative" style={{ minWidth: svgWidth }}>
          <svg
            width={svgWidth}
            height={svgHeight}
            className="block"
          >
            {/* Month labels */}
            {monthLabels.map((label, i) => (
              <text
                key={i}
                x={labelWidth + label.weekIndex * (cellSize + cellGap)}
                y={12}
                fontSize="10"
                fill="var(--color-text-tertiary)"
                fontFamily="var(--font-sans)"
              >
                {label.month}
              </text>
            ))}

            {/* Day labels */}
            {DAY_LABELS.map(
              (label, i) =>
                label && (
                  <text
                    key={i}
                    x={0}
                    y={headerHeight + i * (cellSize + cellGap) + cellSize - 2}
                    fontSize="10"
                    fill="var(--color-text-tertiary)"
                    fontFamily="var(--font-sans)"
                  >
                    {label}
                  </text>
                )
            )}

            {/* Cells */}
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                if (day.count < 0) return null;
                const x = labelWidth + weekIndex * (cellSize + cellGap);
                const y = headerHeight + dayIndex * (cellSize + cellGap);

                return (
                  <rect
                    key={`${weekIndex}-${dayIndex}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={2}
                    fill={`var(--color-heat-${day.level})`}
                    className="transition-all duration-200"
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                );
              })
            )}
          </svg>

          {/* Tooltip */}
          {hoveredDay && (
            <div
              className="fixed z-50 px-2.5 py-1.5 rounded-[var(--radius-sm)] pointer-events-none"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y - 36,
                transform: "translateX(-50%)",
                background: "var(--color-surface-overlay)",
                border: "1px solid var(--color-border)",
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-secondary)",
              }}
            >
              <strong style={{ color: "var(--color-text-primary)" }}>
                {hoveredDay.count}
              </strong>{" "}
              habit{hoveredDay.count !== 1 ? "s" : ""} on{" "}
              {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4">
        <span
          className="text-[length:var(--font-size-xs)]"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Less
        </span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="rounded-[2px]"
            style={{
              width: cellSize,
              height: cellSize,
              background: `var(--color-heat-${level})`,
            }}
          />
        ))}
        <span
          className="text-[length:var(--font-size-xs)]"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          More
        </span>
      </div>
    </section>
  );
}
