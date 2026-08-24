# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript, localStorage persistence

## Users

Ambitious self-improvers, knowledge workers, and students who follow Deep Work and Atomic Habits philosophies. They use the product daily in focused work sessions—typically at a desk, in quiet environments, during morning or late-night focus blocks. Single-user mode; no multi-user auth.

## Product Purpose

FocusForge is a productivity platform that combines intense focus mechanics (Pomodoro-style deep work timer) with gamified habit tracking. It makes disciplined daily practice visible and rewarding through streaks, heatmaps, shield mechanics, and competitive league leaderboards. Success means the user maintains unbroken chains of daily habits and accumulates focus points through completed deep work sessions.

## Positioning

The fusion of a deep-work timer with a habit-streak game engine. Unlike standalone Pomodoro apps or habit trackers, FocusForge treats focus time and daily habits as a unified scoring system that feeds into competitive league tiers. The "Streak Shield" mechanic (earned every 7 consecutive days, protects one missed day) is the product's unique retention hook.

## Operating Context

Used daily at a workstation. The timer runs during active work sessions (25-minute default Pomodoro). Habits are checked off throughout the day. The heatmap and leaderboard are reviewed at end-of-day or week. All data persists in localStorage — no server, no login. The leaderboard is seeded with 50 realistic AI competitors across Bronze–Diamond tiers.

## Capabilities and Constraints

- Flow Timer: 25 min work / 5 min short break / 15 min long break, with session logging and focus point awards
- Habit Checklist: unlimited daily habits with micro-progress bars and compound growth visualization
- Heatmap: 365-day GitHub-style contribution grid colored from the committed palette
- Streak Shields: 1 shield per 7 consecutive days, consumable to protect a missed day
- League Leaderboard: 5 tiers (Bronze → Silver → Gold → Platinum → Diamond), 50-user pools, top 10 promote / bottom 10 demote
- All client-side, localStorage only. No backend dependency.
- Deploys to Vercel with zero configuration.

## Brand Commitments

- Zero AI slop: no Inter, Roboto, Arial, or system defaults. Distinct, high-quality font pair with fluid type scaling.
- OKLCH color space with tinted neutrals. No pure black (#000) or pure white (#fff). No cyan-on-dark, no purple-to-blue gradients.
- Dark mode with cohesive perceptual warmth. Light/dark derived from use scene (desk, quiet, focused work, often evening).
- No nested cards. No identical card grids (icon + heading + text repeated).
- Left-aligned text with asymmetric, editorial-style layouts. No center-everything.
- Smooth deceleration easing only. No bouncy or elastic motion.
- No monospace as costume. No emoji as icons. No gradient text.
- Operate mode: the interface serves the task, not decoration.

## Evidence on Hand

No real user data. Leaderboard seeded with 50 generated competitors. All habit/timer data generated from user interaction and stored locally.

## Product Principles

1. **Visibility of progress**: Every completed session and checked habit must be immediately visible in the heatmap, streak counter, and point total.
2. **Earned protection**: Shields are earned through consistency (7 days), not purchased. They protect streaks, making the cost of a missed day tangible.
3. **Competitive context**: The leaderboard provides social proof and motivation even in single-user mode through realistic AI competitors.
4. **Purposeful interface**: Every UI element serves the task. No decorative chrome. The timer runs, habits get checked, progress compounds.
5. **Immediate value**: No signup, no onboarding gate. Open the app and start working.
