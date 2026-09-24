import { Badge, Button, Card, ComplexityTag, EmptyState } from "@/components/ui";
import { usePlanner, useSnapshot } from "@/hooks/usePlanner";

export function RecentPanel() {
  const { planner, run, notify } = usePlanner();
  const stack = useSnapshot((p) => p.recentRoutes.toArray()); // index 0 = top
  const top = useSnapshot((p) => p.recentRoutes.peek());

  return (
    <div className="space-y-5">
      <Card
        title="13 · Recently Searched Routes (Stack — LIFO)"
        subtitle="Every successful Dijkstra search is pushed onto the stack, so the latest search is always on top."
        icon={<span>🥞</span>}
        action={<ComplexityTag text="push / pop O(1)" />}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div>
            {stack.length === 0 ? (
              <EmptyState icon="🧠" text="Stack underflow — no recent searches. Find a route to push an entry." />
            ) : (
              <div className="space-y-2">
                {stack.map((r, i) => (
                  <div
                    key={`${r.source}-${r.destination}-${i}`}
                    className={`fade-up flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ring-1 ${
                      i === 0 ? "bg-amber-400/10 ring-amber-300/30" : "bg-white/[0.03] ring-white/10"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-500">{stack.length - i}</span>
                        <span className="text-sm font-semibold text-slate-100">
                          {r.source} → {r.destination}
                        </span>
                        {i === 0 && <Badge tone="amber">TOP</Badge>}
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                        {r.path.join(" → ")} · {r.distance} km
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() =>
                          run(
                            (p) => {
                              p.findShortestRoute(r.source, r.destination);
                            },
                            { text: `Re-ran ${r.source} → ${r.destination}`, kind: "info" },
                          )
                        }
                        className="rounded-lg bg-cyan-400/10 px-2 py-1 text-[11px] font-semibold text-cyan-200 ring-1 ring-cyan-400/20 hover:bg-cyan-400/20"
                      >
                        re-run
                      </button>
                      {i === 0 && (
                        <button
                          onClick={() => {
                            const removed = planner.popRecentRoute();
                            notify({
                              text: removed ? `pop() removed ${removed.source} → ${removed.destination}` : "Stack empty",
                              kind: removed ? "warn" : "error",
                            });
                            run(() => {});
                          }}
                          className="rounded-lg bg-rose-400/10 px-2 py-1 text-[11px] font-semibold text-rose-200 ring-1 ring-rose-400/20 hover:bg-rose-400/20"
                        >
                          pop()
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="glass-soft rounded-xl p-4">
              <h3 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Stack internals</h3>
              <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>peek()</span>
                  <span className="text-amber-300">{top ? `${top.source} → ${top.destination}` : "null"}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>size()</span>
                  <span className="text-cyan-300">{stack.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>isEmpty()</span>
                  <span className={stack.length === 0 ? "text-rose-300" : "text-emerald-300"}>
                    {stack.length === 0 ? "true" : "false"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <h3 className="text-[11px] font-semibold tracking-wider text-cyan-200 uppercase">Why a stack here?</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Route searches behave like browser history: the user usually wants the <b>most recent</b> search first.
                A stack (LIFO) gives that in O(1) with <code className="font-mono text-cyan-300">push()</code>,{" "}
                <code className="font-mono text-cyan-300">pop()</code> and{" "}
                <code className="font-mono text-cyan-300">peek()</code> — no sorting or shifting needed.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="amber"
                onClick={() => {
                  const removed = planner.popRecentRoute();
                  notify({
                    text: removed ? `Popped ${removed.source} → ${removed.destination}` : "Stack is empty",
                    kind: removed ? "warn" : "error",
                  });
                  run(() => {});
                }}
                disabled={stack.length === 0}
              >
                pop() last search
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  run(
                    (p) => {
                      p.recentRoutes.clear();
                      p.addLog("Stack cleared.", "warn");
                    },
                    { text: "Stack cleared", kind: "warn" },
                  )
                }
                disabled={stack.length === 0}
              >
                clear stack
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
