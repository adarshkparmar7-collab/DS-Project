import { useMemo, useState } from "react";
import { Badge, Button, Card, ComplexityTag, EmptyState, inputClass } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import { quickSort } from "@/lib/ds/SearchSort";

export function SearchPanel() {
  const { planner, run, notify } = usePlanner();
  const locations = useSnapshot((p) => p.graph.locations());
  const trips = useSnapshot((p) => p.history.toArray());
  const optionNames = useSnapshot((p) => p.options.map((o) => o.name));

  const [city, setCity] = useState("sur");
  const [person, setPerson] = useState("Rahul");
  const [operator, setOperator] = useState("");

  const cityMatches = useMemo(() => planner.searchLocations(city), [planner, city, locations]);

  const personMatches = useMemo(
    () => (person.trim() ? planner.searchHistory(person) : []),
    [planner, person, trips],
  );

  const sortedNames = useMemo(
    () => [...new Set(optionNames)].sort((a, b) => a.localeCompare(b)),
    [optionNames],
  );

  const operatorMatch = useMemo(
    () => (operator.trim() ? planner.searchOptionsByName(operator) : []),
    [planner, operator, optionNames],
  );

  const binarySteps = operator.trim()
    ? Math.max(1, Math.ceil(Math.log2(Math.max(sortedNames.length, 2))))
    : 0;

  return (
    <div className="space-y-5">
      <Card
        title="11 · Search Location (Linear Search)"
        subtitle="Locations are stored in an unsorted list, so a linear (sequential) search is the correct choice."
        icon={<span>📍</span>}
        action={<ComplexityTag text="O(n)" />}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className={inputClass}
            value={city}
            placeholder="Type part of a city name, e.g. abad"
            onChange={(e) => setCity(e.target.value)}
          />
          <Badge tone="cyan">
            {cityMatches.length} / {locations.length} matched
          </Badge>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((name) => {
            const hit = cityMatches.includes(name);
            return (
              <div
                key={name}
                className={`rounded-xl px-3 py-2.5 ring-1 transition ${
                  hit ? "bg-cyan-400/10 ring-cyan-400/40" : "bg-white/[0.03] ring-white/10 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${hit ? "text-cyan-200" : "text-slate-300"}`}>{name}</span>
                  {hit && <Badge tone="cyan">found</Badge>}
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-400">
                  degree {planner.graph.degree(name)} ·{" "}
                  {planner.graph
                    .neighbors(name)
                    .map((n) => n.to)
                    .join(", ") || "no edges"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Search Passenger Records"
          subtitle="Linear search over the linked list of trips (head → null)."
          icon={<span>🧍</span>}
          action={<ComplexityTag text="O(n)" />}
        >
          <input
            className={inputClass}
            value={person}
            placeholder="Passenger name"
            onChange={(e) => setPerson(e.target.value)}
          />
          <div className="mt-3 space-y-2">
            {person.trim() === "" ? (
              <EmptyState text="Type a name to search the trip history." />
            ) : personMatches.length === 0 ? (
              <EmptyState icon="∅" text={`No trip found for "${person}".`} />
            ) : (
              personMatches.map((t) => (
                <div key={t.id} className="rounded-xl bg-white/[0.04] p-3 font-mono text-[11px] ring-1 ring-white/10">
                  <div className="text-slate-100">
                    {t.passenger} · {t.source} → {t.destination}
                  </div>
                  <div className="mt-0.5 text-slate-400">
                    {t.distance} km · {t.transportType} · ₹{t.fare} · {t.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card
          title="Binary Search on Operator Name"
          subtitle="The catalogue is first sorted alphabetically, then binary search halves the range on every step."
          icon={<span>🎯</span>}
          action={<ComplexityTag text="O(log n)" />}
        >
          <input
            className={inputClass}
            value={operator}
            list="operator-names"
            placeholder="Exact service name, e.g. Intercity Express (Train)"
            onChange={(e) => setOperator(e.target.value)}
          />
          <datalist id="operator-names">
            {sortedNames.slice(0, 60).map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="violet">sorted catalogue: {sortedNames.length} names</Badge>
            <Badge tone="amber">≈ {binarySteps} steps needed</Badge>
          </div>
          <div className="mt-3 space-y-2">
            {operator.trim() === "" ? (
              <EmptyState text="Binary search needs an exact (sorted) key — pick a service name from the suggestions." />
            ) : operatorMatch.length === 0 ? (
              <EmptyState icon="∅" text={`No service called "${operator}".`} />
            ) : (
              operatorMatch.map((o) => (
                <div key={o.id} className="rounded-xl bg-emerald-400/10 p-3 font-mono text-[11px] ring-1 ring-emerald-400/25">
                  <div className="text-emerald-200">{o.name}</div>
                  <div className="mt-0.5 text-slate-300">
                    {o.source} → {o.destination} · {o.distance} km · {o.timeMinutes} min · ₹{o.price}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card title="Where searching is used in this project" icon={<span>🧩</span>}>
        <ul className="grid gap-2 font-mono text-[11px] text-slate-300 sm:grid-cols-2">
          <li className="glass-soft rounded-xl p-3">• Location lookup before adding a route or passenger (validate input)</li>
          <li className="glass-soft rounded-xl p-3">• Dijkstra scans the adjacency list of every visited vertex</li>
          <li className="glass-soft rounded-xl p-3">• Linear search of the linked list for a passenger's trips</li>
          <li className="glass-soft rounded-xl p-3">• Binary search of the sorted transport catalogue by operator name</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={() =>
              run(
                (p) => {
                  const sorted = quickSort(p.options, (a, b) => a.price - b.price);
                  p.addLog(`Catalogue sorted by price — cheapest: ₹${sorted[0]?.price ?? 0}`, "info");
                },
                { text: "Catalogue sorted by price (quick sort)", kind: "info" },
              )
            }
          >
            Sort catalogue by price
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setCity("");
              setPerson("");
              setOperator("");
              notify({ text: "Search fields cleared", kind: "info" });
            }}
          >
            Clear searches
          </Button>
        </div>
      </Card>
    </div>
  );
}
