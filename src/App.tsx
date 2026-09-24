import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Badge, Button } from "@/components/ui";
import { PlannerProvider, usePlanner, useSnapshot } from "@/hooks/usePlanner";
import { CodePanel } from "@/panels/CodePanel";
import { ConsolePanel } from "@/panels/ConsolePanel";
import { DashboardPanel } from "@/panels/DashboardPanel";
import { DocsPanel } from "@/panels/DocsPanel";
import { HistoryPanel } from "@/panels/HistoryPanel";
import { NetworkPanel } from "@/panels/NetworkPanel";
import { OptionsPanel } from "@/panels/OptionsPanel";
import { PassengerPanel } from "@/panels/PassengerPanel";
import { RecentPanel } from "@/panels/RecentPanel";
import { RequestPanel } from "@/panels/RequestPanel";
import { RoutePanel } from "@/panels/RoutePanel";
import { SearchPanel } from "@/panels/SearchPanel";
import { VivaPanel } from "@/panels/VivaPanel";
import { VIEW_TITLES, type ViewKey } from "@/lib/views";

function Shell() {
  const { planner, run, toast } = usePlanner();
  const [view, setView] = useState<ViewKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stats = useSnapshot((p) => p.stats());
  const meta = VIEW_TITLES[view];

  const render = () => {
    switch (view) {
      case "dashboard":
        return <DashboardPanel onNavigate={setView} />;
      case "network":
        return <NetworkPanel />;
      case "route":
        return <RoutePanel />;
      case "queue":
        return <PassengerPanel />;
      case "priority":
        return <RequestPanel />;
      case "history":
        return <HistoryPanel />;
      case "recent":
        return <RecentPanel />;
      case "options":
        return <OptionsPanel />;
      case "search":
        return <SearchPanel />;
      case "console":
        return <ConsolePanel />;
      case "code":
        return <CodePanel />;
      case "docs":
        return <DocsPanel />;
      case "viva":
        return <VivaPanel />;
      case "exit":
        return (
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
            <span className="floaty text-6xl">🚪</span>
            <div className="glass max-w-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-50">Program terminated</h2>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-[#04070d] p-4 text-left font-mono text-[11.5px] leading-6 text-emerald-200">{`Thank you for using Smart Transport Planner!

Locations : ${stats.locations}
Routes    : ${stats.routes}
Trips     : ${stats.trips}
Stack     : ${stats.recent} recent search(es)

Process finished with exit code 0`}</pre>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button
                  onClick={() => {
                    run(
                      (p) => {
                        p.reset();
                      },
                      { text: "Program restarted with sample data", kind: "info" },
                    );
                    setView("dashboard");
                  }}
                >
                  ⟳ Restart program
                </Button>
                <Button variant="ghost" onClick={() => setView("dashboard")}>
                  Back to dashboard
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-bg min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar view={view} onSelect={setView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#05070f]/85 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl bg-white/5 px-3 py-2 text-slate-300 ring-1 ring-white/10 lg:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-bold text-slate-50 sm:text-lg">{meta.title}</h2>
                <p className="truncate text-[11px] text-slate-400 sm:text-xs">{meta.subtitle}</p>
              </div>
              <div className="hidden items-center gap-2 xl:flex">
                <Badge tone="cyan">{stats.locations} locations</Badge>
                <Badge tone="violet">{stats.routes} routes</Badge>
                <Badge tone="amber">{stats.waiting} waiting</Badge>
                <Badge tone="rose">{stats.requests} requests</Badge>
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  run(
                    (p) => {
                      p.reset();
                    },
                    { text: "Sample data reloaded", kind: "info" },
                  )
                }
              >
                ⟳ Reset data
              </Button>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div key={view} className="fade-up">
              {render()}
            </div>
          </div>

          <footer className="border-t border-white/10 px-4 py-5 text-center sm:px-6">
            <p className="font-mono text-[11px] text-slate-500">
              Smart Transport Planner Using Data Structures · Java + web demonstration ·{" "}
              {planner.graph.size()} vertices · {planner.graph.uniqueRoutes().length} edges
            </p>
          </footer>
        </main>
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4">
          <div
            className={`fade-up rounded-xl px-4 py-2.5 font-mono text-xs shadow-2xl ring-1 backdrop-blur-xl ${
              toast.kind === "success"
                ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30"
                : toast.kind === "error"
                  ? "bg-rose-500/15 text-rose-200 ring-rose-400/30"
                  : toast.kind === "warn"
                    ? "bg-amber-500/15 text-amber-200 ring-amber-400/30"
                    : "bg-cyan-500/15 text-cyan-200 ring-cyan-400/30"
            }`}
          >
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <Shell />
    </PlannerProvider>
  );
}
