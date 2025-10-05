"use client";

import React, { useMemo, useState } from "react";
import { TAJWEED_RULES, TajweedRule } from "./tajweedRules";

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
                <div className="font-semibold text-gray-800 font-kanit">
                  {modal.rule.name}
                </div>
                <div className="mt-1 text-sm text-gray-600 leading-relaxed font-kanit">
                  {modal.rule.description}
                </div>
              </div>
            </div>

            {modal.sample && (
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1 font-kanit">
                  ตัวอย่าง:
                </div>
                <div
                  className="text-right"
                  dir="rtl"
                  style={{ fontSize: `${fontSizePx}px` }}
                >
                  <span className={`px-1 rounded ${modal.rule.colorClass}`}>
                    {modal.sample}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-kanit"
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
