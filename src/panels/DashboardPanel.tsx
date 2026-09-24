import { GraphCanvas } from "@/components/GraphCanvas";
import { Badge, Button, Card, Stat } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";
import type { ViewKey } from "@/lib/views";

const DS_CARDS: { title: string; view: ViewKey; icon: string; role: string; complexity: string }[] = [
  { title: "Graph", view: "network", icon: "🕸️", role: "Adjacency list of locations and weighted roads", complexity: "O(V + E)" },
  { title: "Dijkstra", view: "route", icon: "🧭", role: "Shortest route between source and destination", complexity: "O((V+E) log V)" },
  { title: "Queue", view: "queue", icon: "👥", role: "Passengers waiting for a bus or train (FIFO)", complexity: "O(1)" },
  { title: "Priority Queue", view: "priority", icon: "🚨", role: "Emergency, senior citizen and regular requests", complexity: "O(log n)" },
  { title: "Linked List", view: "history", icon: "🔗", role: "Dynamic trip history, one node per completed trip", complexity: "O(1) insert" },
  { title: "Stack", view: "recent", icon: "🥞", role: "Recently searched routes (LIFO)", complexity: "O(1)" },
];

export function DashboardPanel({ onNavigate }: { onNavigate: (view: ViewKey) => void }) {
  const { planner, logs, run } = usePlanner();
  const stats = useSnapshot((p) => p.stats());
  const locations = useSnapshot((p) => p.graph.locations());
  const routes = useSnapshot((p) => p.graph.uniqueRoutes());
  const topRoute = useSnapshot((p) => p.recentRoutes.peek());
  const pending = useSnapshot((p) => p.requestQueue.toArray());
  const trips = useSnapshot((p) => p.history.toArray());

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <Badge tone="cyan">Data Structures & Algorithms mini-project</Badge>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
              Smart Transport Planner
              <span className="block bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                using Graphs, Dijkstra, Queues & Stacks
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Plan routes across a weighted transport network. Every feature of the classic console project is here —
              plus the complete Java source code, project documentation and viva answers.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => onNavigate("route")}>🧭 Find shortest route</Button>
              <Button variant="ghost" onClick={() => onNavigate("console")}>
                ⌨️ Open console menu
              </Button>
              <Button variant="violet" onClick={() => onNavigate("code")}>
                ☕ View Java code
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <Stat label="Locations" value={stats.locations} tone="cyan" />
            <Stat label="Routes" value={stats.routes} tone="violet" />
            <Stat label="Network" value={stats.totalKm} unit="km" tone="emerald" />
            <Stat label="Services" value={stats.options} tone="amber" />
            <Stat label="Waiting" value={stats.waiting} tone="rose" />
            <Stat label="Requests" value={stats.requests} tone="rose" />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card
          title="Live Transport Network"
          subtitle={topRoute ? `Last search: ${topRoute.source} → ${topRoute.destination} (${topRoute.distance} km)` : "Sample Gujarat network loaded with 7 locations and 8 routes."}
          icon={<span>🗺️</span>}
          action={
            <Button variant="ghost" onClick={() => onNavigate("network")}>
              edit network →
            </Button>
          }
        >
          <GraphCanvas locations={locations} routes={routes} highlightPath={topRoute?.path ?? []} />
        </Card>

        <div className="space-y-5">
          <Card title="Data structures at work" icon={<span>🧱</span>}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {DS_CARDS.map((card) => (
                <button
                  key={card.title}
                  onClick={() => onNavigate(card.view)}
                  className="glass-soft group rounded-xl p-3 text-left transition hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100">
                      {card.icon} {card.title}
                    </span>
                    <span className="font-mono text-[10px] text-cyan-300">{card.complexity}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{card.role}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card
            title="One-click demo"
            subtitle="Run the classic demonstration sequence used in the practical exam."
            icon={<span>🎬</span>}
          >
            <div className="grid gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  planner.findShortestRoute("Ahmedabad", "Rajkot");
                  planner.findShortestRoute("Ahmedabad", "Surat");
                  planner.findShortestRoute("Rajkot", "Surat");
                  run(() => {}, { text: "Demo: three Dijkstra searches pushed on the stack", kind: "success" });
                }}
              >
                🧭 Demo 1 — three shortest route searches
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  planner.addPassenger("Neha", "Bhavnagar");
                  planner.processPassenger("Bus");
                  planner.processPassenger("Train");
                  run(() => {}, { text: "Demo: queue processed and trips stored in the linked list", kind: "success" });
                }}
              >
                🚍 Demo 2 — enqueue + process passengers
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  planner.addRequest("Ravi Mehta", "Ahmedabad", "Surat", "Emergency", "Heart patient transfer");
                  planner.processRequest();
                  planner.processRequest();
                  run(() => {}, { text: "Demo: emergency request served before regular ones", kind: "success" });
                }}
              >
                🚨 Demo 3 — emergency priority dispatch
              </Button>
            </div>
          </Card>

          <Card title="Next in line" subtitle="Priority queue root and FIFO front." icon={<span>⏭️</span>}>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="rounded-xl bg-rose-500/10 p-3 text-rose-200 ring-1 ring-rose-400/20">
                {pending[0]
                  ? `PRIORITY: #${pending[0].id} ${pending[0].passenger} [${pending[0].priority}] ${pending[0].source} → ${pending[0].destination}`
                  : "PRIORITY: no pending request"}
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-200 ring-1 ring-emerald-400/20">
                {planner.passengerQueue.peekFront()
                  ? `QUEUE FRONT: #${planner.passengerQueue.peekFront()!.id} ${planner.passengerQueue.peekFront()!.name}`
                  : "QUEUE FRONT: queue empty"}
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3 text-slate-300 ring-1 ring-white/10">
                HISTORY: {trips.length} trip(s) · last:{" "}
                {trips.length ? `${trips[trips.length - 1].passenger} → ${trips[trips.length - 1].destination}` : "—"}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card
        title="Operation Log"
        subtitle="Every menu operation writes one line — exactly like the console output of the Java program."
        icon={<span>🧾</span>}
        action={<Badge tone="slate">{logs.length} entries</Badge>}
      >
        {logs.length === 0 ? (
          <p className="font-mono text-xs text-slate-500">No operations yet.</p>
        ) : (
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {logs.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-start gap-3 rounded-lg px-3 py-1.5 font-mono text-[11.5px] ${
                  entry.kind === "success"
                    ? "bg-emerald-400/5 text-emerald-200"
                    : entry.kind === "error"
                      ? "bg-rose-400/5 text-rose-200"
                      : entry.kind === "warn"
                        ? "bg-amber-400/5 text-amber-200"
                        : "bg-white/[0.03] text-slate-400"
                }`}
              >
                <span className="shrink-0 text-slate-600">{entry.time}</span>
                <span>{entry.text}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
