import { useState } from "react";
import { GraphCanvas } from "@/components/GraphCanvas";
import { Badge, Button, Card, ComplexityTag, EmptyState, Field, inputClass } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";

export function NetworkPanel() {
  const { planner, run, notify } = usePlanner();
  const locations = useSnapshot((p) => p.graph.locations());
  const routes = useSnapshot((p) => p.graph.uniqueRoutes());
  const adjacency = useSnapshot((p) =>
    p.graph
      .locations()
      .map((city) => ({ city, edges: p.graph.neighbors(city) }))
      .sort((a, b) => b.edges.length - a.edges.length),
  );

  const [city, setCity] = useState("");
  const [from, setFrom] = useState("Ahmedabad");
  const [to, setTo] = useState("Rajkot");
  const [km, setKm] = useState("120");

  const addLocation = () => {
    const res = planner.addLocation(city);
    notify({ text: res.message, kind: res.ok ? "success" : "error" });
    run(() => {});
    if (res.ok) setCity("");
  };

  const addRoute = () => {
    const res = planner.addRoute(from, to, Number(km));
    notify({ text: res.message, kind: res.ok ? "success" : "error" });
    run(() => {});
  };

  return (
    <div className="space-y-5">
      <Card
        title="Transport Network (Graph — Adjacency List)"
        subtitle="Locations are vertices and routes are weighted, bidirectional edges. Adding a location or route updates the adjacency list instantly."
        icon={<span className="text-sm">🕸️</span>}
        action={
          <div className="flex gap-2">
            <Badge tone="cyan">{locations.length} vertices</Badge>
            <Badge tone="violet">{routes.length} edges</Badge>
          </div>
        }
      >
        <GraphCanvas locations={locations} routes={routes} />
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="1 · Add Location" subtitle="Menu option 1 — inserts a new vertex into the graph." icon={<span>📍</span>}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Location name" className="flex-1">
              <input
                className={inputClass}
                value={city}
                placeholder="e.g. Junagadh"
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLocation()}
              />
            </Field>
            <Button onClick={addLocation}>Add Vertex</Button>
          </div>
          <p className="mt-3 font-mono text-[11px] text-slate-500">
            graph.addLocation(name) → adjacency.put(name, []) &nbsp;|&nbsp; duplicate names are rejected
          </p>
        </Card>

        <Card title="2 · Add Route" subtitle="Menu option 2 — inserts a weighted edge between two existing vertices." icon={<span>🛣️</span>}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="From">
              <select className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)}>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="To">
              <select className={inputClass} value={to} onChange={(e) => setTo(e.target.value)}>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Distance (km)">
              <input
                className={inputClass}
                type="number"
                min={1}
                value={km}
                onChange={(e) => setKm(e.target.value)}
              />
            </Field>
          </div>
          <Button className="mt-3 w-full" onClick={addRoute}>
            Add Edge
          </Button>
        </Card>
      </div>

      <Card
        title="3 · Adjacency List View"
        subtitle="Internal storage of the graph: every vertex keeps a list of (neighbour, weight) pairs."
        icon={<span>📋</span>}
        action={<ComplexityTag text="space O(V + E)" />}
      >
        {locations.length === 0 ? (
          <EmptyState text="No locations yet. Add a location to build the graph." />
        ) : (
          <div className="grid gap-2.5 md:grid-cols-2">
            {adjacency.map(({ city, edges }) => (
              <div key={city} className="glass-soft rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-cyan-300">{city}</span>
                  <Badge tone="slate">degree {edges.length}</Badge>
                </div>
                {edges.length === 0 ? (
                  <p className="mt-2 font-mono text-[11px] text-slate-600">→ null (no outgoing edges)</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {edges.map((e, i) => (
                      <span
                        key={`${e.to}-${i}`}
                        className="rounded-lg bg-slate-900/70 px-2 py-1 font-mono text-[11px] text-slate-300 ring-1 ring-white/10"
                      >
                        → {e.to} <span className="text-amber-300">({e.weight} km)</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Route Table" subtitle="Every edge currently stored in the adjacency list (deduplicated)." icon={<span>📊</span>}>
        {routes.length === 0 ? (
          <EmptyState text="No routes added yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] tracking-wider text-slate-400 uppercase">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">From</th>
                  <th className="py-2 pr-4">To</th>
                  <th className="py-2 pr-4">Distance</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {routes.map((r, i) => (
                  <tr key={`${r.from}-${r.to}`} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-4 text-slate-500">{i + 1}</td>
                    <td className="py-2 pr-4 text-slate-200">{r.from}</td>
                    <td className="py-2 pr-4 text-slate-200">{r.to}</td>
                    <td className="py-2 pr-4 text-amber-300">{r.weight} km</td>
                    <td className="py-2 pr-4">
                      <button
                        className="rounded-lg bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-500/20"
                        onClick={() =>
                          run(
                            (p) => {
                              p.removeRoute(r.from, r.to);
                            },
                            { text: `Route ${r.from} ↔ ${r.to} removed`, kind: "warn" },
                          )
                        }
                      >
                        remove
                      </button>
                    </td>
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
