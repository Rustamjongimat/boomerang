import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRankLabel(rank: string): string {
  const labels: Record<string, string> = {
    EXPLORER: "Explorer",
    SPECIALIST: "Specialist",
    MASTER: "Master",
    VISIONARY: "Visionary",
  };
  return labels[rank] || "Explorer";
}

export function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    EXPLORER: "#22c55e",
    SPECIALIST: "#3b82f6",
    MASTER: "#a855f7",
    VISIONARY: "#f59e0b",
  };
  return colors[rank] || "#22c55e";
}

export function getRankXP(rank: string): { current: number; next: number } {
  const thresholds: Record<string, { current: number; next: number }> = {
    EXPLORER: { current: 0, next: 100 },
    SPECIALIST: { current: 100, next: 300 },
    MASTER: { current: 300, next: 700 },
    VISIONARY: { current: 700, next: 9999 },
  };
  return thresholds[rank] || { current: 0, next: 100 };
}

export function calculateRank(xp: number): string {
  if (xp >= 700) return "VISIONARY";
  if (xp >= 300) return "MASTER";
  if (xp >= 100) return "SPECIALIST";
  return "EXPLORER";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}
