"use client";

import { useState } from "react";

type Point = { date: string; count: number };

const WIDTH = 600;
const HEIGHT = 180;
const PAD_X = 6;
const PAD_Y = 18;

function formatShortDate(dateStr: string) {
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function VisitTrendChart({ data }: { data: Point[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? (WIDTH - PAD_X * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    ...d,
    x: PAD_X + i * stepX,
    y: HEIGHT - PAD_Y - (d.count / max) * (HEIGHT - PAD_Y * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x},${HEIGHT - PAD_Y} L${points[0].x},${HEIGHT - PAD_Y} Z`
      : "";

  const active = hoverIdx !== null ? points[hoverIdx] : null;
  const tickIdxs =
    points.length > 1 ? [0, Math.floor((points.length - 1) / 2), points.length - 1] : [0];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="block w-full overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="visitTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-400)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={HEIGHT - PAD_Y}
          y2={HEIGHT - PAD_Y}
          stroke="currentColor"
          strokeOpacity={0.12}
        />

        {areaPath && (
          <path d={areaPath} fill="url(#visitTrendFill)" className="chart-area-fade" />
        )}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chart-line-draw"
          pathLength={1}
        />

        {active && (
          <line
            x1={active.x}
            x2={active.x}
            y1={PAD_Y / 2}
            y2={HEIGHT - PAD_Y}
            stroke="currentColor"
            strokeOpacity={0.15}
          />
        )}

        {points.map((p, i) => (
          <g key={p.date}>
            <rect
              x={p.x - stepX / 2}
              y={0}
              width={stepX || WIDTH}
              height={HEIGHT}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
            />
            {(i === points.length - 1 || hoverIdx === i) && (
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIdx === i ? 4.5 : 3.5}
                fill="var(--color-brand-700)"
                stroke="white"
                strokeWidth={1.5}
              />
            )}
          </g>
        ))}
      </svg>

      <div className="mt-1 flex justify-between text-[11px] text-black/40 dark:text-white/40">
        {tickIdxs.map((idx) => (
          <span key={idx}>{points[idx] ? formatShortDate(points[idx].date) : ""}</span>
        ))}
      </div>

      {active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md dark:border-white/10 dark:bg-neutral-900"
          style={{
            left: `${(active.x / WIDTH) * 100}%`,
            top: `${(active.y / HEIGHT) * 100}%`,
          }}
        >
          <p className="font-semibold">{active.count.toLocaleString("ko-KR")}명</p>
          <p className="text-black/50 dark:text-white/50">{formatShortDate(active.date)}</p>
        </div>
      )}
    </div>
  );
}
