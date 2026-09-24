import { useState } from "react";
import { HeapTree } from "@/components/HeapTree";
import { Badge, Button, Card, ComplexityTag, EmptyState, Field, inputClass } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import { PRIORITY_RANK, type PriorityLevel, type TripRecord } from "@/lib/planner";

const LEVELS: PriorityLevel[] = ["Emergency", "Senior Citizen", "Regular"];

const tone = (level: PriorityLevel) => (level === "Emergency" ? "rose" : level === "Senior Citizen" ? "amber" : "cyan");

export function RequestPanel() {
  const { planner, run, notify } = usePlanner();
  const locations = useSnapshot((p) => p.graph.locations());
  const pending = useSnapshot((p) => p.requestQueue.toArray());
  const heap = useSnapshot((p) => p.requestQueue.toHeapArray());
  const [passenger, setPassenger] = useState("");
  const [source, setSource] = useState("Ahmedabad");
  const [destination, setDestination] = useState("Jamnagar");
  const [priority, setPriority] = useState<PriorityLevel>("Emergency");
  const [note, setNote] = useState("Medical emergency — ambulance escort");
  const [served, setServed] = useState<TripRecord | null>(null);

  const add = () => {
    const res = planner.addRequest(passenger, source, destination, priority, note);
    notify({ text: res.message, kind: res.ok ? "success" : "error" });
    run(() => {});
    if (res.ok) setPassenger("");
  };

  const process = () => {
    const res = planner.processRequest();
    notify({ text: res.message, kind: res.ok ? "success" : "warn" });
    setServed(res.record ?? null);
    run(() => {});
  };

  return (
    <div className="space-y-5">
      <Card
        title="9 · Add Transport Request (Priority Queue)"
        subtitle="Menu option 9 — requests are inserted into a binary min-heap ordered by priority."
        icon={<span>🚨</span>}
        action={<ComplexityTag text="insert O(log n)" />}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Passenger name">
            <input
              className={inputClass}
              value={passenger}
              placeholder="e.g. Ravi Mehta"
              onChange={(e) => setPassenger(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </Field>
          <Field label="Priority level">
            <select
              className={inputClass}
              value={priority}
              onChange={(e) => {
                const next = e.target.value as PriorityLevel;
                setPriority(next);
                setNote(
                  next === "Emergency"
                    ? "Medical emergency — ambulance escort"
                    : next === "Senior Citizen"
                      ? "Wheelchair assistance"
                      : "Standard booking",
                );
              }}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {PRIORITY_RANK[l]}. {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Note">
            <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <Field label="From">
            <select className={inputClass} value={source} onChange={(e) => setSource(e.target.value)}>
              {locations.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="To">
            <select className={inputClass} value={destination} onChange={(e) => setDestination(e.target.value)}>
              {locations.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <Button className="w-full" onClick={add}>
              Insert into Heap
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="10 · Process Priority Request"
        subtitle="Menu option 10 — the root of the min-heap (highest priority) is removed first, then the heap is re-heapified."
        icon={<span>⚡</span>}
        action={<ComplexityTag text="extract-min O(log n)" />}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl font-mono text-[11px] leading-relaxed text-slate-400">
            Order of service: <span className="text-rose-300">1. Emergency</span> →{" "}
            <span className="text-amber-300">2. Senior Citizen</span> →{" "}
            <span className="text-cyan-300">3. Regular Passenger</span>. Inside the same priority the request that
            arrived first (smaller id) is served first — a stable FIFO tie-break.
          </p>
          <Button variant="danger" onClick={process} disabled={pending.length === 0}>
            Serve Highest Priority
          </Button>
        </div>
        {served && (
          <div className="fade-up mt-4 rounded-xl border border-rose-300/30 bg-gradient-to-br from-rose-500/10 to-purple-600/10 p-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-rose-200">PRIORITY DISPATCH · TRIP #{served.id}</span>
              <Badge tone={tone(served.priority as PriorityLevel)}>{served.priority}</Badge>
            </div>
            <div className="mt-2 grid gap-1 text-slate-200 sm:grid-cols-2">
              <span>Passenger : {served.passenger}</span>
              <span>Vehicle : {served.transportType}</span>
              <span>Route : {served.source} → {served.destination}</span>
              <span>Distance : {served.distance} km</span>
              <span>Time : {served.travelTime} min</span>
              <span>Fare : ₹{served.fare}</span>
            </div>
            <p className="mt-2 text-rose-200/80">Path: {served.path.join(" → ") || "no route"}</p>
          </div>
        )}
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card title="Pending Requests (priority order)" icon={<span>📋</span>}>
          {pending.length === 0 ? (
            <EmptyState icon="✅" text="No pending requests. Everything has been dispatched." />
          ) : (
            <div className="space-y-2">
              {pending.map((r, i) => (
                <div
                  key={r.id}
                  className={`fade-up flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2.5 ring-1 ${
                    i === 0 ? "bg-rose-500/10 ring-rose-400/30" : "bg-white/[0.03] ring-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500">#{r.id}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{r.passenger}</div>
                      <div className="font-mono text-[11px] text-slate-400">
                        {r.source} → {r.destination} · {r.note}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={tone(r.priority)}>
                      priority {PRIORITY_RANK[r.priority]} · {r.priority}
                    </Badge>
                    {i === 0 && <Badge tone="emerald">next</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Internal Min-Heap Array"
          subtitle="The raw heap array. Notice it is NOT fully sorted — only the root is guaranteed to be the minimum."
          icon={<span>🌳</span>}
        >
          <div className="mb-4">
            <p className="mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              heap as a binary tree
            </p>
            <HeapTree heap={heap} />
          </div>
          {heap.length === 0 ? (
            <EmptyState text="Heap is empty." />
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {heap.map((r, i) => (
                  <div
                    key={`${r.id}-${i}`}
                    className={`rounded-lg px-3 py-2 font-mono text-[11px] ring-1 ${
                      i === 0 ? "bg-rose-500/15 text-rose-200 ring-rose-400/30" : "bg-slate-900/60 text-slate-300 ring-white/10"
                    }`}
                  >
                    <div className="text-[10px] text-slate-500">index {i}</div>
                    {PRIORITY_RANK[r.priority]} · {r.passenger}
                  </div>
                ))}
              </div>
              <p className="rounded-xl bg-slate-900/60 p-3 font-mono text-[11px] leading-relaxed text-slate-400">
                parent(i) = (i−1)/2 · left(i) = 2i+1 · right(i) = 2i+2
                <br />
                Every parent is smaller than (or equal to) its children → the smallest priority number is always at
                index 0.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
