import { useState } from "react";
import { Badge, Button, Card, ComplexityTag, EmptyState, Field, inputClass } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import type { TransportType, TripRecord } from "@/lib/planner";

const TYPES: TransportType[] = ["Bus", "Train", "Taxi", "Metro"];

export function PassengerPanel() {
  const { planner, run, notify } = usePlanner();
  const locations = useSnapshot((p) => p.graph.locations());
  const queue = useSnapshot((p) => p.passengerQueue.toArray());
  const front = useSnapshot((p) => p.passengerQueue.peekFront());

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("Rajkot");
  const [source, setSource] = useState("Ahmedabad");
  const [type, setType] = useState<TransportType>("Bus");
  const [ticket, setTicket] = useState<TripRecord | null>(null);

  const addPassenger = () => {
    const res = planner.addPassenger(name, destination, source);
    notify({ text: res.message, kind: res.ok ? "success" : "error" });
    run(() => {});
    if (res.ok) setName("");
  };

  const process = () => {
    const res = planner.processPassenger(type);
    notify({ text: res.message, kind: res.ok ? "success" : "warn" });
    setTicket(res.record ?? null);
    run(() => {});
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="6 · Add Passenger (Enqueue)" subtitle="Menu option 6 — a new passenger joins the rear of the FIFO queue." icon={<span>🧍</span>}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Passenger name">
              <input
                className={inputClass}
                value={name}
                placeholder="e.g. Neha"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPassenger()}
              />
            </Field>
            <Field label="Boarding at">
              <select className={inputClass} value={source} onChange={(e) => setSource(e.target.value)}>
                {locations.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Destination">
              <select className={inputClass} value={destination} onChange={(e) => setDestination(e.target.value)}>
                {locations.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Transport type">
              <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as TransportType)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={addPassenger}>Enqueue Passenger</Button>
            <Button variant="ghost" onClick={() => setName("Neha")}>
              Autofill sample
            </Button>
          </div>
        </Card>

        <Card
          title="8 · Process Passenger (Dequeue)"
          subtitle="Menu option 8 — removes the front passenger, runs Dijkstra and stores the trip in the linked list."
          icon={<span>🚍</span>}
          action={<ComplexityTag text="dequeue O(1)" />}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-mono text-xs text-slate-400">
              Queue size: <span className="text-cyan-300">{queue.length}</span> · Front:{" "}
              <span className="text-emerald-300">{front ? `#${front.id} ${front.name}` : "empty"}</span>
            </div>
            <Button variant="amber" onClick={process} disabled={queue.length === 0}>
              Dequeue &amp; Issue Ticket
            </Button>
          </div>
          {ticket && (
            <div className="fade-up mt-4 rounded-xl border border-amber-300/30 bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-amber-200">BOARDING PASS · TRIP #{ticket.id}</span>
                <Badge tone="amber">{ticket.transportType}</Badge>
              </div>
              <div className="mt-2 grid gap-1 text-slate-200 sm:grid-cols-2">
                <span>Passenger : {ticket.passenger}</span>
                <span>Route : {ticket.source} → {ticket.destination}</span>
                <span>Distance : {ticket.distance} km</span>
                <span>Time : {ticket.travelTime} min</span>
                <span>Fare : ₹{ticket.fare}</span>
                <span>Time stamp : {ticket.timestamp}</span>
              </div>
              <p className="mt-2 text-amber-300/80">Path: {ticket.path.join(" → ") || "no route"}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                history.addLast(record) → the trip is now stored in the linked list.
              </p>
            </div>
          )}
        </Card>
      </div>

      <Card
        title="7 · Display Passenger Queue"
        subtitle="The waiting list is stored in a Queue (FIFO): the first passenger who arrived is served first."
        icon={<span>👥</span>}
        action={<ComplexityTag text="enqueue / dequeue O(1)" />}
      >
        {queue.length === 0 ? (
          <EmptyState icon="🚉" text="No passengers are waiting. Add a passenger using menu option 6." />
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] tracking-wide text-emerald-300 uppercase">
              front (dequeue) <span className="text-slate-600">──────────────▶</span>{" "}
              <span className="text-cyan-300">rear (enqueue)</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {queue.map((p, i) => (
                <div
                  key={p.id}
                  className={`fade-up min-w-[190px] rounded-xl p-3 ring-1 ${
                    i === 0
                      ? "bg-emerald-400/10 ring-emerald-400/30"
                      : "bg-white/[0.04] ring-white/10"
                  }`}
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">#{p.id}</span>
                    <Badge tone={i === 0 ? "emerald" : "slate"}>{i === 0 ? "FRONT" : `pos ${i + 1}`}</Badge>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-100">{p.name}</div>
                  <div className="mt-1 font-mono text-[11px] text-slate-400">
                    {p.source} → {p.destination}
                  </div>
                  {i === 0 && (
                    <button
                      onClick={process}
                      className="mt-2 w-full rounded-lg bg-emerald-400/15 px-2 py-1 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/25 hover:bg-emerald-400/25"
                    >
                      serve next
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
