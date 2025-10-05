import React from "react";

export type SurahTheme = {
  name: string;
  from: string; // header gradient start
  to: string; // header gradient end
  accent: string; // primary accent
  accentSoft: string; // soft background rgba
  textOn: string; // text color on dark
};

const THEMES: SurahTheme[] = [
  { name: "emerald", from: "#059669", to: "#047857", accent: "#10B981", accentSoft: "rgba(16,185,129,0.12)", textOn: "#FFFFFF" },
  { name: "teal", from: "#0F766E", to: "#115E59", accent: "#14B8A6", accentSoft: "rgba(20,184,166,0.12)", textOn: "#FFFFFF" },
  { name: "indigo", from: "#4F46E5", to: "#4338CA", accent: "#6366F1", accentSoft: "rgba(99,102,241,0.12)", textOn: "#FFFFFF" },
  { name: "amber", from: "#D97706", to: "#B45309", accent: "#F59E0B", accentSoft: "rgba(245,158,11,0.12)", textOn: "#111827" },
  { name: "rose", from: "#E11D48", to: "#BE123C", accent: "#F43F5E", accentSoft: "rgba(244,63,94,0.12)", textOn: "#FFFFFF" },
  { name: "violet", from: "#7C3AED", to: "#6D28D9", accent: "#8B5CF6", accentSoft: "rgba(139,92,246,0.12)", textOn: "#FFFFFF" },
  { name: "cyan", from: "#0891B2", to: "#0E7490", accent: "#06B6D4", accentSoft: "rgba(6,182,212,0.12)", textOn: "#FFFFFF" },
  { name: "lime", from: "#65A30D", to: "#4D7C0F", accent: "#84CC16", accentSoft: "rgba(132,204,22,0.12)", textOn: "#111827" },
  { name: "sky", from: "#0284C7", to: "#0369A1", accent: "#0EA5E9", accentSoft: "rgba(14,165,233,0.12)", textOn: "#FFFFFF" },
  { name: "fuchsia", from: "#C026D3", to: "#A21CAF", accent: "#D946EF", accentSoft: "rgba(217,70,239,0.12)", textOn: "#FFFFFF" },
];

export function getSurahTheme(surahNumber: number): SurahTheme {
  // Cycle themes by surah number for now (114 surahs)
  const index = (surahNumber - 1) % THEMES.length;
  return THEMES[index];
}

export function SurahOrnament({ color = "#FFFFFF", opacity = 0.15 }: { color?: string; opacity?: number }) {
  // Simple geometric ornament suitable for backgrounds
  return (
    <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <g stroke={color} strokeWidth={1}>
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="16" />
        <path d="M50 5 L60 20 L95 50 L60 80 L50 95 L40 80 L5 50 L40 20 Z" fill="none" />
        <path d="M50 15 L57 25 L85 50 L57 75 L50 85 L43 75 L15 50 L43 25 Z" fill="none" />
      </g>
    </svg>
  );
}
