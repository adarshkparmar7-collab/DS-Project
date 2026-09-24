import { useMemo } from "react";

export interface GraphNodePos {
  x: number;
  y: number;
}

const PRESET: Record<string, [number, number]> = {
  Ahmedabad: [42, 34],
  Gandhinagar: [58, 20],
  Vadodara: [70, 50],
  Rajkot: [22, 58],
  Jamnagar: [6, 44],
  Surat: [82, 86],
  Bhavnagar: [44, 84],
};

const W = 820;
const H = 540;
const PAD_X = 70;
const PAD_Y = 60;

function layout(locations: string[]): Map<string, GraphNodePos> {
  const map = new Map<string, GraphNodePos>();
  const known = locations.filter((l) => PRESET[l]);
  const extra = locations.filter((l) => !PRESET[l]);
  known.forEach((name) => {
    const [px, py] = PRESET[name];
    map.set(name, { x: PAD_X + (px / 100) * (W - PAD_X * 2), y: PAD_Y + (py / 100) * (H - PAD_Y * 2) });
  });
  // new locations are placed on an ellipse around the existing network
  extra.forEach((name, i) => {
    const angle = (i / Math.max(extra.length, 1)) * Math.PI * 2 - Math.PI / 2.4;
    const rx = (W - PAD_X * 2) * 0.46;
    const ry = (H - PAD_Y * 2) * 0.44;
    map.set(name, {
      x: W / 2 + Math.cos(angle) * rx,
      y: H / 2 + Math.sin(angle) * ry,
    });
  });
  return map;
}

export function GraphCanvas({
  locations,
  routes,
  highlightPath = [],
  onNodeClick,
  compact = false,
}: {
  locations: string[];
  routes: { from: string; to: string; weight: number }[];
  highlightPath?: string[];
  onNodeClick?: (name: string) => void;
  compact?: boolean;
}) {
  const positions = useMemo(() => layout(locations), [locations]);

  const pathKeys = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < highlightPath.length - 1; i++) {
      set.add([highlightPath[i], highlightPath[i + 1]].sort().join("~"));
    }
    return set;
  }, [highlightPath]);

  const inPath = (name: string) => highlightPath.includes(name);
  const anyHighlight = highlightPath.length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <svg viewBox={`0 0 ${W} ${H}`} className="relative w-full" role="img" aria-label="Transport network graph">
        <defs>
          <linearGradient id="nodeFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="nodeFillHot" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* edges */}
        {routes.map((r) => {
          const a = positions.get(r.from);
          const b = positions.get(r.to);
          if (!a || !b) return null;
          const key = [r.from, r.to].sort().join("~");
          const hot = pathKeys.has(key);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={`${r.from}-${r.to}`} opacity={anyHighlight && !hot ? 0.28 : 1}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={hot ? "#fbbf24" : "#64748b"}
                strokeWidth={hot ? 5 : 2}
                strokeLinecap="round"
                className={hot ? "route-dash" : undefined}
                filter={hot ? "url(#glow)" : undefined}
              />
              <g>
                <rect
                  x={mx - 22}
                  y={my - 10}
                  width={44}
                  height={20}
                  rx={10}
                  fill="#020617"
                  stroke={hot ? "#fbbf24" : "#334155"}
                  strokeWidth={1}
                  opacity={0.95}
                />
                <text
                  x={mx}
                  y={my + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill={hot ? "#fde68a" : "#94a3b8"}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {r.weight}
                </text>
              </g>
            </g>
          );
        })}

        {/* vertices */}
        {locations.map((name) => {
          const p = positions.get(name);
          if (!p) return null;
          const hot = inPath(name);
          const width = Math.min(190, 34 + name.length * 8.4);
          return (
            <g
              key={name}
              transform={`translate(${p.x - width / 2}, ${p.y - 16})`}
              onClick={() => onNodeClick?.(name)}
              className={onNodeClick ? "cursor-pointer" : undefined}
              opacity={anyHighlight && !hot ? 0.4 : 1}
            >
              <rect
                width={width}
                height={32}
                rx={16}
                fill={hot ? "url(#nodeFillHot)" : "url(#nodeFill)"}
                stroke={hot ? "#fff7ed" : "#0f172a"}
                strokeWidth={hot ? 2.5 : 1.5}
                filter={hot ? "url(#glow)" : undefined}
              />
              <text
                x={width / 2}
                y={21}
                textAnchor="middle"
                fontSize={13}
                fontWeight={600}
                fill={hot ? "#1f1300" : "#f8fafc"}
                fontFamily="Inter, sans-serif"
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
      {!compact && (
        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap items-center gap-3 rounded-xl bg-slate-950/80 px-3 py-2 font-mono text-[10px] text-slate-400 ring-1 ring-white/10">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" /> vertex (location)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-5 bg-slate-500" /> edge (route)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-5 bg-amber-400" /> shortest path
          </span>
        </div>
      )}
    </div>
  );
}
