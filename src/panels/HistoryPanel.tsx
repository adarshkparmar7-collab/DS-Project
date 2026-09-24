import { useState } from "react";
import { Badge, Button, Card, ComplexityTag, EmptyState, inputClass } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import type { TripRecord } from "@/lib/planner";

export function HistoryPanel() {
  const { planner, run, notify } = usePlanner();
  const trips = useSnapshot((p) => p.history.toArray());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TripRecord[] | null>(null);

  const search = () => {
    const found = planner.searchHistory(query);
    setResults(found);
    notify({
      text: `Linear search in linked list: ${found.length} record(s) for "${query}"`,
      kind: found.length ? "success" : "warn",
    });
    run(() => {});
  };

  return (
    <div className="space-y-5">
      <Card
        title="14 · Passenger / Trip History (Custom Linked List)"
        subtitle="Every completed trip is appended to a singly linked list. Each node stores the trip data and a reference to the next node."
        icon={<span>🔗</span>}
        action={<ComplexityTag text="insert at tail O(1)" />}
      >
        {trips.length === 0 ? (
          <EmptyState
            icon="🗒️"
            text="History is empty. Process a passenger (menu option 8) or a priority request (menu option 10) to create a trip record."
          />
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-1">
              <span className="shrink-0 rounded-lg bg-slate-800/80 px-2 py-1 font-mono text-[10px] text-cyan-300">head</span>
              <span className="text-slate-600">→</span>
              {trips.map((t, i) => (
                <div key={t.id} className="flex shrink-0 items-center gap-1">
                  <div
                    className="fade-up w-[164px] rounded-xl bg-white/[0.05] p-2.5 ring-1 ring-white/10"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">node #{t.id}</span>
                      <Badge tone={t.priority === "Emergency" ? "rose" : t.priority === "Queue" ? "cyan" : "amber"}>
                        {t.priority === "Queue" ? "FIFO" : t.priority}
                      </Badge>
                    </div>
                    <div className="mt-1 truncate text-xs font-semibold text-slate-100">{t.passenger}</div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {t.source} → {t.destination}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-emerald-300">
                      {t.distance} km · {t.transportType}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-600">→</span>
                </div>
              ))}
              <span className="shrink-0 rounded-lg bg-slate-800/80 px-2 py-1 font-mono text-[10px] text-rose-300">
                null
              </span>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              run(
                (p) => {
                  p.history.reverse();
                  p.addLog("Linked list reversed.", "info");
                },
                { text: "Linked list reversed — head ↔ tail swapped", kind: "info" },
              )
            }
            disabled={trips.length < 2}
          >
            Reverse list
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              run(
                (p) => {
                  const removed = p.history.removeFirst();
                  p.addLog(
                    removed ? `Removed first node: trip #${removed.id}` : "History already empty.",
                    "warn",
                  );
                },
                { text: "First node removed from the linked list", kind: "warn" },
              )
            }
            disabled={trips.length === 0}
          >
            Delete first node
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              run(
                (p) => {
                  p.history.removeAt(p.history.size() - 1);
                  p.addLog("Removed last node of the linked list.", "warn");
                },
                { text: "Last node removed", kind: "warn" },
              )
            }
            disabled={trips.length === 0}
          >
            Delete last node
          </Button>
        </div>
      </Card>

      <Card
        title="Search Trip History"
        subtitle="Linear search traverses the linked list node by node from head to null."
        icon={<span>🔎</span>}
        action={<ComplexityTag text="linear search O(n)" />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className={inputClass}
            value={query}
            placeholder="Passenger name, e.g. Rahul"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <Button onClick={search} disabled={query.trim().length === 0}>
            Search Records
          </Button>
          {results && (
            <Button variant="ghost" onClick={() => setResults(null)}>
              Clear
            </Button>
          )}
        </div>
        {results && (
          <p className="mt-3 font-mono text-xs text-slate-400">
            {results.length} matching record(s) found for "{query}".
          </p>
        )}
      </Card>

      <Card title="Trip Table" subtitle="Node data printed from head to tail." icon={<span>📖</span>}>
        {trips.length === 0 ? (
          <EmptyState text="No trips recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] tracking-wider text-slate-400 uppercase">
                  <th className="py-2 pr-3">Trip</th>
                  <th className="py-2 pr-3">Passenger</th>
                  <th className="py-2 pr-3">Source</th>
                  <th className="py-2 pr-3">Destination</th>
                  <th className="py-2 pr-3">Distance</th>
                  <th className="py-2 pr-3">Transport</th>
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Fare</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {(results ?? trips).map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-3 text-slate-500">#{t.id}</td>
                    <td className="py-2 pr-3 text-slate-100">{t.passenger}</td>
                    <td className="py-2 pr-3 text-cyan-300">{t.source}</td>
                    <td className="py-2 pr-3 text-cyan-300">{t.destination}</td>
                    <td className="py-2 pr-3 text-emerald-300">{t.distance} km</td>
                    <td className="py-2 pr-3 text-violet-300">{t.transportType}</td>
                    <td className="py-2 pr-3 text-slate-300">{t.travelTime} min</td>
                    <td className="py-2 pr-3 text-amber-300">₹{t.fare}</td>
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
