"use client";

import { Amiri } from "next/font/google";
import React, { useMemo, useState } from "react";
import { TAJWEED_RULES, TajweedRule } from "./tajweedRules";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });

interface TajweedTextProps {
  text: string;
  fontSizePx?: number;
}

interface Range {
  start: number;
  end: number; // exclusive
  rule: TajweedRule;
}

function buildRanges(text: string): Range[] {
  const ranges: Range[] = [];

  // Build non-overlapping ranges by priority (as ordered in TAJWEED_RULES)
  TAJWEED_RULES.forEach((rule) => {
    let match: RegExpExecArray | null;
    // Reset lastIndex if global
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    while ((match = pattern.exec(text)) !== null) {
      let start = match.index;
      const end = match.index + match[0].length;

      // If match starts with Arabic combining marks (harakat/shadda/sukun/tanween),
      // include the preceding base character to keep grapheme cluster intact.
      // Arabic combining range: \u064B-\u0652 (tanween/harakat/sukun) + \u0651 (shadda)
      const startsWithCombining = /[\u064B-\u0652\u0651]/.test(
        text[start] ?? ""
      );
      if (startsWithCombining && start > 0) {
        start = start - 1;
      }

      // Skip if overlaps with existing assigned range
      const overlaps = ranges.some((r) => !(end <= r.start || start >= r.end));
      if (!overlaps) {
        ranges.push({ start, end, rule });
      }

      // Prevent infinite loops for zero-length matches (shouldn't happen)
      if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }
  });

  // Sort by start index
  ranges.sort((a, b) => a.start - b.start);
  return ranges;
}

export const TajweedText: React.FC<TajweedTextProps> = ({
  text,
  fontSizePx = 18,
}) => {
  const [modal, setModal] = useState<{
    open: boolean;
    rule?: TajweedRule;
    sample?: string;
  }>({ open: false });

  const parts = useMemo(() => {
    const ranges = buildRanges(text);
    const segments: Array<
      | { type: "plain"; value: string }
      | { type: "rule"; value: string; rule: TajweedRule }
    > = [];

    let cursor = 0;
    for (const r of ranges) {
      if (cursor < r.start) {
        segments.push({ type: "plain", value: text.slice(cursor, r.start) });
      }
      segments.push({
        type: "rule",
        value: text.slice(r.start, r.end),
        rule: r.rule,
      });
      cursor = r.end;
    }
    if (cursor < text.length) {
      segments.push({ type: "plain", value: text.slice(cursor) });
    }

    return segments;
  }, [text]);

  return (
    <>
      <span className="text-gray-800 select-text">
        {parts.map((p, idx) =>
          p.type === "plain" ? (
            <React.Fragment key={idx}>{p.value}</React.Fragment>
          ) : (
            <span
              key={idx}
              onClick={() =>
                setModal({ open: true, rule: p.rule, sample: p.rule.sample })
              }
              className={`cursor-pointer ${p.rule.colorClass} hover:opacity-80`}
              title={p.rule.name}
            >
              {p.value}
            </span>
          )
        )}
      </span>

      {modal.open && modal.rule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModal({ open: false })}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className={`text-lg font-bold ${modal.rule.colorClass}`}>
                ●
              </div>
              <div>
                <div className="font-semibold text-2xl text-gray-800">
                  {modal.rule.name}
                </div>
                <div className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {modal.rule.description}
                </div>
              </div>
            </div>

            {modal.sample && (
              <div className="mt-4 bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 font-medium">ตัวอย่างคำ:</div>
                    <div
                      className={`${amiri.className} text-right`}
                      dir="rtl"
                      style={{ fontSize: `${Math.max(fontSizePx, 24)}px` }}
                    >
                      <span className={`px-1 ${modal.rule.colorClass}`}>
                        {modal.sample}
                      </span>
                    </div>
                  </div>
                  {modal.rule.pronunciation && (
                    <div className="pt-3 border-t border-gray-200/60">
                      <div className="text-xs text-emerald-600 mb-1 font-semibold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        วิธีอ่าน
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed font-medium">
                        {modal.rule.pronunciation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                onClick={() => setModal({ open: false })}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TajweedText;
