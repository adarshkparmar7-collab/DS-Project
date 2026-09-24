import { useState } from "react";
import { GraphCanvas } from "@/components/GraphCanvas";
import { Badge, Button, Card, ComplexityTag, EmptyState, Field, inputClass, Stat } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import type { DijkstraResult } from "@/lib/ds/Graph";

type Result = DijkstraResult & { message: string };

export function RoutePanel() {
  const { planner, run, notify } = usePlanner();
  const locations = useSnapshot((p) => p.graph.locations());
  const routes = useSnapshot((p) => p.graph.uniqueRoutes());

  const [source, setSource] = useState("Ahmedabad");
  const [destination, setDestination] = useState("Rajkot");
  const [result, setResult] = useState<Result | null>(null);
  const [bfsPath, setBfsPath] = useState<string[]>([]);
  const [hops, setHops] = useState(0);

  const findRoute = () => {
    const res = planner.findShortestRoute(source, destination);
    setResult(res);
    setBfsPath(planner.graph.bfs(source, destination));
    setHops(Math.max(0, res.path.length - 1));
    notify({ text: res.message, kind: res.reachable ? "success" : "error" });
    run(() => {});
  };

  const routeOptions = result?.reachable
    ? planner.options.filter((o) => o.source === source && o.destination === destination)
    : [];
  const cheapest = routeOptions.length
    ? routeOptions.reduce((a, b) => (a.price <= b.price ? a : b))
    : null;
  const fastest = routeOptions.length
    ? routeOptions.reduce((a, b) => (a.timeMinutes <= b.timeMinutes ? a : b))
    : null;

  return (
    <div className="space-y-5">
      <Card
        title="4 · Find Shortest Route (Dijkstra's Algorithm)"
        subtitle="Menu options 4 & 5 — a greedy algorithm with a min-heap priority queue that always expands the closest unvisited vertex."
        icon={<span className="text-sm">🧭</span>}
        action={<ComplexityTag text="O((V + E) log V)" />}
      >
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr_auto]">
          <Field label="Source">
            <select className={inputClass} value={source} onChange={(e) => setSource(e.target.value)}>
              {locations.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Button
            variant="ghost"
            className="mb-0.5"
            onClick={() => {
              setSource(destination);
              setDestination(source);
            }}
          >
            ⇄
          </Button>
          <Field label="Destination">
            <select
              className={inputClass}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {locations.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Button className="mb-0.5" onClick={findRoute}>
            Find Route
          </Button>
        </div>
      </Card>

      {result === null ? (
        <Card title="Result" subtitle="Choose a source and destination, then press Find Route.">
          <EmptyState
            icon="🧮"
            text="No search performed yet. Try Source: Ahmedabad → Destination: Surat to see an indirect route that is shorter than any direct road."
          />
        </Card>
      ) : !result.reachable ? (
        <Card title="Result">
          <EmptyState icon="🚧" text={result.message} />
        </Card>
      ) : (
        <>
          <Card
            title="5 · Route Summary"
            subtitle="Exactly the output printed by the Java console version."
            icon={<span>🎫</span>}
          >
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                <div className="glass-soft rounded-xl p-4 font-mono text-sm leading-7">
                  <div>
                    Source: <span className="text-cyan-300">{source}</span>
                  </div>
                  <div>
                    Destination: <span className="text-cyan-300">{destination}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    Shortest Route:{" "}
                    {result.path.map((city, i) => (
                      <span key={`${city}-${i}`} className="flex items-center gap-2">
                        <span className={i === 0 || i === result.path.length - 1 ? "text-amber-300" : "text-slate-200"}>
                          {city}
                        </span>
                        {i < result.path.length - 1 && <span className="text-slate-600">→</span>}
                      </span>
                    ))}
                  </div>
                  <div>
                    Total Distance: <span className="text-emerald-300">{result.distance} km</span>
                  </div>
                  <div>
                    Intermediate Stops: <span className="text-violet-300">{hops === 0 ? "direct" : `${hops} edges`}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="emerald">
                    Cheapest: {cheapest ? `${cheapest.name} · ₹${cheapest.price}` : "no service"}
                  </Badge>
                  <Badge tone="cyan">
                    Fastest: {fastest ? `${fastest.name} · ${fastest.timeMinutes} min` : "no service"}
                  </Badge>
                  <Badge tone="violet">Visited {result.visitedOrder.length} vertices</Badge>
                  <Badge tone="amber">{routeOptions.length} services on this route</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Distance" value={result.distance} unit="km" tone="emerald" />
                <Stat label="Edges used" value={hops} tone="violet" />
                <Stat label="Vertices visited" value={result.visitedOrder.length} tone="cyan" />
                <Stat
                  label="BFS stops"
                  value={bfsPath.length ? bfsPath.length - 1 : "—"}
                  tone="amber"
                />
              </div>
            </div>
            {cheapest && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
                <span className="font-mono text-xs text-cyan-200">
                  Cheapest service: <b>{cheapest.name}</b> · {cheapest.type} · ₹{cheapest.price} ·{" "}
                  {cheapest.timeMinutes} min
                </span>
              </div>
            )}
          </Card>

          <Card title="Network with the computed path" subtitle="The amber dashed edges are the shortest path returned by Dijkstra.">
            <GraphCanvas locations={locations} routes={routes} highlightPath={result.path} />
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card
              title="Relaxation Steps"
              subtitle="Every time an edge is checked, the tentative distance of the neighbour is updated if a shorter path was found."
              icon={<span>🔍</span>}
            >
              <div className="max-h-72 overflow-y-auto pr-1">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="sticky top-0 bg-slate-950/90 text-slate-400">
                    <tr>
                      <th className="py-1.5 pr-2">Visited</th>
                      <th className="py-1.5 pr-2">Edge</th>
                      <th className="py-1.5 pr-2">New dist</th>
                      <th className="py-1.5 pr-2">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.steps.map((s, i) => (
                      <tr
                        key={i}
                        className={`border-b border-white/5 ${s.improved ? "text-emerald-300" : "text-slate-500"}`}
                      >
                        <td className="py-1.5 pr-2">{s.visited}</td>
                        <td className="py-1.5 pr-2">
                          {s.visited} → {s.relaxed}
                        </td>
                        <td className="py-1.5 pr-2">{s.newDistance}</td>
                        <td className="py-1.5 pr-2">{s.improved ? "relaxed ✓" : "kept"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card
              title="Final Distance Table (from source)"
              subtitle="dist[] array after the algorithm finished — Infinity means the city is unreachable."
              icon={<span>📐</span>}
            >
              <div className="space-y-1.5">
                {Object.entries(result.distances)
                  .sort((a, b) => a[1] - b[1])
                  .map(([city, dist]) => {
                    const onPath = result.path.includes(city);
                    return (
                      <div
                        key={city}
                        className={`flex items-center justify-between rounded-lg px-3 py-1.5 font-mono text-xs ${
                          onPath ? "bg-amber-400/10 text-amber-200" : "bg-white/[0.03] text-slate-400"
                        }`}
                      >
                        <span>dist[{city}]</span>
                        <span>{dist === Infinity ? "∞" : `${dist} km`}</span>
                      </div>
                    );
                  })}
              </div>
              {bfsPath.length > 0 && (
                <p className="mt-4 rounded-xl bg-violet-500/10 p-3 font-mono text-[11px] leading-relaxed text-violet-200">
                  BFS (ignores weights, fewest stops): {bfsPath.join(" → ")}
                  {planner.graph.pathDistance(bfsPath) >= 0 && (
                    <> · actual distance {planner.graph.pathDistance(bfsPath)} km</>
                  )}
                </p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
