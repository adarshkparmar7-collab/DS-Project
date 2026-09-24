import type { TransportRequest } from "@/lib/planner";
import { PRIORITY_RANK } from "@/lib/planner";

const W = 640;
const H = 260;
const LEVEL_H = 62;

/** Draws the internal binary min-heap of the priority queue as a tree. */
export function HeapTree({ heap }: { heap: TransportRequest[] }) {
  if (heap.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center font-mono text-[11px] text-slate-500">
        heap is empty
      </div>
    );
  }

  const depthOf = (i: number) => Math.floor(Math.log2(i + 1));
  const maxDepth = depthOf(heap.length - 1);

  const pos = (i: number) => {
    const d = depthOf(i);
    const levelStart = Math.pow(2, d) - 1;
    const indexInLevel = i - levelStart;
    const slots = Math.pow(2, d);
    return {
      x: ((indexInLevel + 0.5) / slots) * W,
      y: 34 + d * LEVEL_H,
    };
  };

  const tone = (r: TransportRequest) =>
    r.priority === "Emergency" ? "#fb7185" : r.priority === "Senior Citizen" ? "#fbbf24" : "#38bdf8";

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60">
      <svg viewBox={`0 0 ${W} ${Math.max(H, 34 + maxDepth * LEVEL_H + 50)}`} className="w-full" role="img" aria-label="Heap tree">
        {heap.map((_request, i) => {
          if (i === 0) return null;
          const parent = Math.floor((i - 1) / 2);
          const a = pos(parent);
          const b = pos(i);
          return (
            <line
              key={`edge-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#475569"
              strokeWidth={1.6}
              strokeDasharray="4 4"
            />
          );
        })}
        {heap.map((request, i) => {
          const p = pos(i);
          const color = tone(request);
          return (
            <g key={`node-${i}`} transform={`translate(${p.x}, ${p.y})`}>
              <circle r={20} fill="#020617" stroke={color} strokeWidth={2} />
              <text
                y={5}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={color}
                fontFamily="JetBrains Mono, monospace"
              >
                {PRIORITY_RANK[request.priority]}
              </text>
              <text
                y={34}
                textAnchor="middle"
                fontSize={9.5}
                fill="#94a3b8"
                fontFamily="JetBrains Mono, monospace"
              >
                {request.passenger.length > 14 ? `${request.passenger.slice(0, 13)}…` : request.passenger}
              </text>
              <text y={45} textAnchor="middle" fontSize={8.5} fill="#475569" fontFamily="JetBrains Mono, monospace">
                [{i}]
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
