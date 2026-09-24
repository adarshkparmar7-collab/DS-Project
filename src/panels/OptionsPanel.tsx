import { useMemo, useState } from "react";
import { Badge, Button, Card, ComplexityTag, EmptyState, inputClass } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import { bubbleSort, quickSort } from "@/lib/ds/SearchSort";
import type { SortKey, TransportOption, TransportType } from "@/lib/planner";

const KEYS: { key: SortKey; label: string; unit: string }[] = [
  { key: "distance", label: "Distance", unit: "km" },
  { key: "time", label: "Travel time", unit: "min" },
  { key: "price", label: "Ticket price", unit: "₹" },
];

const TYPE_TONE: Record<TransportType, "cyan" | "violet" | "amber" | "emerald"> = {
  Bus: "cyan",
  Train: "violet",
  Taxi: "amber",
  Metro: "emerald",
};

export function OptionsPanel() {
  const { planner, version } = usePlanner();
  const all = useSnapshot((p) => p.options);
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const [algorithm, setAlgorithm] = useState<"quick" | "bubble">("quick");
  const [asc, setAsc] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"All" | TransportType>("All");
  const [term, setTerm] = useState("");

  const { rows, comparisons } = useMemo(() => {
    let count = 0;
    const compare = (a: TransportOption, b: TransportOption) => {
      count++;
      const value = (o: TransportOption) =>
        sortKey === "distance" ? o.distance : sortKey === "time" ? o.timeMinutes : o.price;
      return value(a) - value(b);
    };
    const filtered = planner
      .searchOptions(term)
      .filter((o) => typeFilter === "All" || o.type === typeFilter);
    const sorted = algorithm === "quick" ? quickSort(filtered, compare) : bubbleSort(filtered, compare);
    return { rows: asc ? sorted : [...sorted].reverse(), comparisons: count };
  }, [planner, version, sortKey, algorithm, asc, typeFilter, term, all]);

  const cheapest = rows.length ? rows.reduce((a, b) => (a.price <= b.price ? a : b)) : null;
  const fastest = rows.length ? rows.reduce((a, b) => (a.timeMinutes <= b.timeMinutes ? a : b)) : null;

  return (
    <div className="space-y-5">
      <Card
        title="12 · Sort Transport Options"
        subtitle="Transport services generated from the graph (every location pair × Bus / Train / Taxi / Metro) and sorted from scratch."
        icon={<span>🚉</span>}
        action={
          <ComplexityTag
            text={algorithm === "quick" ? "quick sort O(n log n)" : "bubble sort O(n²)"}
          />
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {KEYS.map((k) => (
                <button
                  key={k.key}
                  onClick={() => setSortKey(k.key)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition ${
                    sortKey === k.key
                      ? "bg-cyan-400/20 text-cyan-200 ring-cyan-400/40"
                      : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  Sort by {k.label}
                </button>
              ))}
              <Button variant="ghost" onClick={() => setAsc((a) => !a)}>
                {asc ? "ascending ↑" : "descending ↓"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Bus", "Train", "Taxi", "Metro"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ring-1 transition ${
                    typeFilter === t
                      ? "bg-violet-400/20 text-violet-200 ring-violet-400/40"
                      : "bg-white/5 text-slate-400 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <input
              className={inputClass}
              value={term}
              placeholder="Filter by operator, city or transport type…"
              onChange={(e) => setTerm(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-2">
              {(["quick", "bubble"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAlgorithm(a)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold ring-1 transition ${
                    algorithm === a
                      ? "bg-amber-400/20 text-amber-200 ring-amber-400/40"
                      : "bg-white/5 text-slate-400 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {a === "quick" ? "quickSort()" : "bubbleSort()"}
                </button>
              ))}
              <Badge tone="slate">{rows.length} rows</Badge>
              <Badge tone="amber">{comparisons} comparisons</Badge>
            </div>
          </div>
        </div>

        {cheapest && fastest && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-3 font-mono text-[11px] text-emerald-200">
              Cheapest: {cheapest.name} · {cheapest.source} → {cheapest.destination} · ₹{cheapest.price}
            </div>
            <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 p-3 font-mono text-[11px] text-cyan-200">
              Fastest: {fastest.name} · {fastest.source} → {fastest.destination} · {fastest.timeMinutes} min
            </div>
          </div>
        )}
      </Card>

      <Card title="Sorted Transport Catalogue" icon={<span>🗒️</span>}>
        {rows.length === 0 ? (
          <EmptyState icon="🔍" text="No transport option matches this filter." />
        ) : (
          <div className="max-h-[520px] overflow-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-950/95 text-[10px] tracking-wider text-slate-400 uppercase backdrop-blur">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Route</th>
                  <th className="px-3 py-2">Distance</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Price</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {rows.map((o, i) => (
                  <tr key={o.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                    <td className="px-3 py-2 text-slate-100">{o.name}</td>
                    <td className="px-3 py-2">
                      <Badge tone={TYPE_TONE[o.type]}>{o.type}</Badge>
                    </td>
                    <td className="px-3 py-2 text-cyan-300">
                      {o.source} → {o.destination}
                    </td>
                    <td className="px-3 py-2 text-emerald-300">{o.distance} km</td>
                    <td className="px-3 py-2 text-slate-300">{o.timeMinutes} min</td>
                    <td className="px-3 py-2 text-amber-300">₹{o.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
