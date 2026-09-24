import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, ComplexityTag } from "@/components/ui";
import { usePlanner } from "@/hooks/usePlanner";
import type { PriorityLevel, TransportType } from "@/lib/planner";

type Line = { text: string; tone?: "in" | "ok" | "warn" | "err" | "dim" };
type Mode =
  | "menu"
  | "locName"
  | "routeFrom"
  | "routeTo"
  | "routeKm"
  | "src"
  | "dst"
  | "pName"
  | "pDest"
  | "rName"
  | "rSrc"
  | "rDst"
  | "rPrio"
  | "search"
  | "sortKey"
  | "type"
  | "done";

const MENU = [
  "========= SMART TRANSPORT PLANNER =========",
  "1.  Add Location",
  "2.  Add Route",
  "3.  Display Transport Network",
  "4.  Find Shortest Route",
  "5.  Display Route Distance",
  "6.  Add Passenger",
  "7.  Display Passenger Queue",
  "8.  Process Passenger",
  "9.  Add Transport Request",
  "10. Process Priority Request",
  "11. Search Location",
  "12. Sort Transport Options",
  "13. View Recent Routes",
  "14. View Passenger / Trip History",
  "15. Exit",
  "==========================================",
];

export function ConsolePanel() {
  const { planner, run } = usePlanner();
  const [lines, setLines] = useState<Line[]>([]);
  const [mode, setMode] = useState<Mode>("menu");
  const [buffer, setBuffer] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [lastRoute, setLastRoute] = useState<{ source: string; destination: string; distance: number; path: string[] } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const print = (newLines: Line[]) => setLines((prev) => [...prev, ...newLines]);

  const boot = () =>
    print([
      { text: "Smart Transport Planner  ::  Data Structures Project (Java)", tone: "ok" },
      { text: "Initialising graph with sample Gujarat transport network...", tone: "dim" },
      { text: "7 locations and 8 routes loaded into the adjacency list.", tone: "dim" },
      { text: "" },
      ...MENU.map((text) => ({ text, tone: "dim" as const })),
      { text: "Enter your choice (1-15):", tone: "warn" },
    ]);

  useEffect(() => {
    boot();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = () => {
    const value = input.trim();
    print([{ text: `> ${value}`, tone: "in" }]);
    setInput("");
    if (value.length === 0) return;
    handle(value);
  };

  const ask = (text: string, next: Mode) => {
    print([{ text, tone: "warn" }]);
    setMode(next);
  };

  const handle = (value: string) => {
    switch (mode) {
      case "menu": {
        if (value.toLowerCase() === "menu") return print(MENU.map((text) => ({ text, tone: "dim" })));
        const choice = Number(value);
        if (!Number.isInteger(choice) || choice < 1 || choice > 15) {
          return print([{ text: "Invalid choice! Please enter a number between 1 and 15.", tone: "err" }]);
        }
        switch (choice) {
          case 1:
            return ask("Enter new location name:", "locName");
          case 2:
            return ask("Enter source location:", "routeFrom");
          case 3: {
            const out: Line[] = [
              { text: "--- TRANSPORT NETWORK (Adjacency List) ---", tone: "ok" },
              ...planner.graph
                .locations()
                .flatMap((city) => [
                  { text: `${city}`, tone: "dim" as const },
                  ...planner.graph.neighbors(city).map((e) => ({ text: `   -> ${e.to} (${e.weight} km)` })),
                ]),
              { text: `Total: ${planner.graph.size()} locations, ${planner.graph.uniqueRoutes().length} routes` },
            ];
            print(out);
            return ask("Enter your choice (1-15):", "menu");
          }
          case 4:
            return ask("Enter source location:", "src");
          case 5: {
            if (!lastRoute) {
              print([{ text: "No route searched yet. Use option 4 first.", tone: "err" }]);
            } else {
              print([
                { text: "--- ROUTE DISTANCE ---", tone: "ok" },
                { text: `Source          : ${lastRoute.source}` },
                { text: `Destination     : ${lastRoute.destination}` },
                { text: `Shortest Route  : ${lastRoute.path.join(" -> ")}` },
                { text: `Total Distance  : ${lastRoute.distance} km`, tone: "ok" },
              ]);
            }
            return ask("Enter your choice (1-15):", "menu");
          }
          case 6:
            return ask("Enter passenger name:", "pName");
          case 7: {
            const q = planner.passengerQueue.toArray();
            print([
              { text: "--- PASSENGER QUEUE (FIFO) ---", tone: "ok" },
              ...(q.length === 0
                ? [{ text: "Queue is empty.", tone: "err" as const }]
                : q.map((p) => ({
                    text: `Passenger ID: ${p.id} | Name: ${p.name} | ${p.source} -> ${p.destination}`,
                  }))),
            ]);
            return ask("Enter your choice (1-15):", "menu");
          }
          case 8:
            return ask("Choose transport (Bus/Train/Taxi/Metro):", "type");
          case 9:
            return ask("Enter passenger name for the request:", "rName");
          case 10: {
            const res = planner.processRequest();
            print([
              { text: "--- PRIORITY REQUEST PROCESSING ---", tone: "ok" },
              { text: res.message, tone: res.ok ? "ok" : "err" },
              ...(res.record
                ? [
                    { text: `Served  : ${res.record.passenger} (${res.record.priority})` },
                    { text: `Route   : ${res.record.path.join(" -> ")}` },
                    { text: `Fare    : Rs.${res.record.fare} | Time: ${res.record.travelTime} min`, tone: "ok" as const },
                  ]
                : []),
            ]);
            run(() => {});
            return ask("Enter your choice (1-15):", "menu");
          }
          case 11:
            return ask("Enter location (or part of it) to search:", "search");
          case 12:
            return ask("Sort by -> 1.Distance  2.Time  3.Price:", "sortKey");
          case 13: {
            const stack = planner.recentRoutes.toArray();
            print([
              { text: "--- RECENTLY SEARCHED ROUTES (Stack, top first) ---", tone: "ok" },
              ...(stack.length === 0
                ? [{ text: "Stack is empty.", tone: "err" as const }]
                : stack.map((r, i) => ({
                    text: `${i + 1}. ${r.source} -> ${r.destination}  (${r.distance} km)${i === 0 ? "   <- TOP" : ""}`,
                    tone: i === 0 ? ("ok" as const) : undefined,
                  }))),
            ]);
            return ask("Enter your choice (1-15):", "menu");
          }
          case 14: {
            const trips = planner.history.toArray();
            print([
              { text: "--- PASSENGER / TRIP HISTORY (Linked List) ---", tone: "ok" },
              ...(trips.length === 0
                ? [{ text: "No trips recorded yet.", tone: "err" as const }]
                : trips.map((t) => ({
                    text: `${t.passenger} | ${t.source} | ${t.destination} | ${t.distance} km | ${t.transportType}`,
                  }))),
            ]);
            return ask("Enter your choice (1-15):", "menu");
          }
          case 15:
            print([
              { text: "Thank you for using Smart Transport Planner!", tone: "ok" },
              { text: "Program terminated. Press the Restart button to run it again.", tone: "dim" },
            ]);
            return setMode("done");
          default:
            return print([{ text: "Invalid choice!", tone: "err" }]);
        }
      }

      case "locName": {
        const res = planner.addLocation(value);
        print([{ text: res.message, tone: res.ok ? "ok" : "err" }]);
        run(() => {});
        return ask("Enter your choice (1-15):", "menu");
      }
      case "routeFrom":
        setBuffer((b) => ({ ...b, from: value }));
        return ask("Enter destination location:", "routeTo");
      case "routeTo":
        setBuffer((b) => ({ ...b, to: value }));
        return ask("Enter distance in km:", "routeKm");
      case "routeKm": {
        const res = planner.addRoute(buffer.from ?? "", buffer.to ?? "", Number(value));
        print([{ text: res.message, tone: res.ok ? "ok" : "err" }]);
        run(() => {});
        return ask("Enter your choice (1-15):", "menu");
      }
      case "src":
        setBuffer((b) => ({ ...b, src: value }));
        return ask("Enter destination location:", "dst");
      case "dst": {
        const res = planner.findShortestRoute(buffer.src ?? "", value);
        print([
          { text: "--- DIJKSTRA'S SHORTEST PATH ---", tone: "ok" },
          { text: `Source          : ${buffer.src}` },
          { text: `Destination     : ${value}` },
          { text: `Shortest Route  : ${res.path.join(" -> ")}` },
          { text: `Total Distance  : ${res.distance} km`, tone: "ok" },
          ...(res.path.length > 2
            ? [{ text: `Intermediate stops: ${res.path.length - 2}`, tone: "dim" as const }]
            : []),
        ]);
        if (res.reachable) setLastRoute({ source: buffer.src ?? "", destination: value, distance: res.distance, path: res.path });
        run(() => {});
        return ask("Enter your choice (1-15):", "menu");
      }
      case "pName":
        setBuffer((b) => ({ ...b, name: value }));
        return ask("Enter destination city:", "pDest");
      case "pDest": {
        const res = planner.addPassenger(buffer.name ?? "", value);
        print([{ text: res.message, tone: res.ok ? "ok" : "err" }]);
        run(() => {});
        return ask("Enter your choice (1-15):", "menu");
      }
      case "type": {
        const t = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        const valid: TransportType[] = ["Bus", "Train", "Taxi", "Metro"];
        if (!valid.includes(t as TransportType)) {
          print([{ text: "Invalid transport type. Use Bus, Train, Taxi or Metro.", tone: "err" }]);
        } else {
          const res = planner.processPassenger(t as TransportType);
          print([
            { text: "--- PASSENGER PROCESSING ---", tone: "ok" },
            { text: res.message, tone: res.ok ? "ok" : "err" },
            ...(res.record
              ? [
                  { text: `Boarded : ${res.record.passenger} by ${res.record.transportType}` },
                  { text: `Route   : ${res.record.path.join(" -> ")}` },
                  { text: `Fare    : Rs.${res.record.fare} | Time: ${res.record.travelTime} min`, tone: "ok" as const },
                ]
              : []),
          ]);
          run(() => {});
        }
        return ask("Enter your choice (1-15):", "menu");
      }
      case "rName":
        setBuffer((b) => ({ ...b, rName: value }));
        return ask("Enter source location:", "rSrc");
      case "rSrc":
        setBuffer((b) => ({ ...b, rSrc: value }));
        return ask("Enter destination location:", "rDst");
      case "rDst":
        setBuffer((b) => ({ ...b, rDst: value }));
        return ask("Priority -> 1.Emergency  2.Senior Citizen  3.Regular:", "rPrio");
      case "rPrio": {
        const levels: PriorityLevel[] = ["Emergency", "Senior Citizen", "Regular"];
        const idx = Number(value) - 1;
        if (idx < 0 || idx > 2) {
          print([{ text: "Invalid priority. Enter 1, 2 or 3.", tone: "err" }]);
        } else {
          const res = planner.addRequest(
            buffer.rName ?? "",
            buffer.rSrc ?? "",
            buffer.rDst ?? "",
            levels[idx],
          );
          print([{ text: res.message, tone: res.ok ? "ok" : "err" }]);
          run(() => {});
        }
        return ask("Enter your choice (1-15):", "menu");
      }
      case "search": {
        const found = planner.searchLocations(value);
        print([
          { text: `--- SEARCH RESULTS FOR "${value}" (linear search) ---`, tone: "ok" },
          ...(found.length === 0
            ? [{ text: "No location found.", tone: "err" as const }]
            : found.map((f) => ({ text: `Found: ${f} (degree ${planner.graph.degree(f)})`, tone: "ok" as const }))),
        ]);
        run(() => {});
        return ask("Enter your choice (1-15):", "menu");
      }
      case "sortKey": {
        const key = Number(value);
        if (key < 1 || key > 3) {
          print([{ text: "Invalid sort key. Enter 1, 2 or 3.", tone: "err" }]);
        } else {
          const label = key === 1 ? "distance" : key === 2 ? "time" : "price";
          const rows = planner.sortOptions(key === 1 ? "distance" : key === 2 ? "time" : "price").slice(0, 8);
          print([
            { text: `--- TRANSPORT OPTIONS SORTED BY ${label.toUpperCase()} ---`, tone: "ok" },
            ...rows.map((o) => ({
              text: `${o.name} | ${o.source} -> ${o.destination} | ${o.distance} km | ${o.timeMinutes} min | Rs.${o.price}`,
            })),
            { text: "(showing top 8 of the sorted catalogue)", tone: "dim" },
          ]);
          run(() => {});
        }
        return ask("Enter your choice (1-15):", "menu");
      }
      default:
        return print([{ text: "Program has exited. Press Restart.", tone: "err" }]);
    }
  };

  const toneClass = (tone?: Line["tone"]) =>
    tone === "in"
      ? "text-cyan-300"
      : tone === "ok"
        ? "text-emerald-300"
        : tone === "err"
          ? "text-rose-400"
          : tone === "warn"
            ? "text-amber-300"
            : tone === "dim"
              ? "text-slate-500"
              : "text-slate-200";

  return (
    <div className="space-y-5">
      <Card
        title="Console Menu (exactly like the Java program)"
        subtitle="Type a menu number and press Enter. This terminal runs the same SmartTransportPlanner logic as the Java version — including input validation."
        icon={<span className="text-sm">⌨️</span>}
        action={<ComplexityTag text="Scanner-based input" />}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {["3", "4", "7", "13", "14"].map((n) => (
            <button
              key={n}
              onClick={() => {
                setInput(n);
              }}
              className="rounded-lg bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
            >
              try option {n}
            </button>
          ))}
          {mode === "done" && (
            <Button
              variant="ghost"
              onClick={() => {
                planner.reset();
                setMode("menu");
                setBuffer({});
                setLines([]);
                setLastRoute(null);
                run(() => {}, { text: "Program restarted with sample data", kind: "info" });
                window.setTimeout(boot, 0);
              }}
            >
              Restart program
            </Button>
          )}
        </div>
        <div
          ref={scrollRef}
          className="h-[480px] overflow-y-auto rounded-xl border border-white/10 bg-[#04070d] p-4 font-mono text-[12.5px] leading-6 shadow-inner"
        >
          {lines.map((l, i) => (
            <div key={i} className={toneClass(l.tone)}>
              {l.text || "\u00A0"}
            </div>
          ))}
          {mode !== "done" && (
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">❯</span>
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="flex-1 bg-transparent text-slate-100 outline-none"
                placeholder={mode === "menu" ? "enter menu number 1-15" : "type value and press Enter"}
              />
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="cyan">mode: {mode}</Badge>
          <Badge tone="slate">{lines.length} lines printed</Badge>
          <span className="font-mono text-[11px] text-slate-500">
            Tip: type <b className="text-slate-300">menu</b> to reprint the menu.
          </span>
        </div>
      </Card>
    </div>
  );
}
