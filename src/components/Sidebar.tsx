import { MENU_ITEMS, type ViewKey } from "@/lib/views";
import { cn } from "@/utils/cn";

const GROUPS = ["Overview", "Transport Planner Menu", "Project Material"] as const;

export function Sidebar({
  view,
  onSelect,
  open,
  onClose,
}: {
  view: ViewKey;
  onSelect: (view: ViewKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[278px] flex-col border-r border-white/10 bg-[#070b16]/95 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-lg shadow-lg shadow-cyan-500/20">
            🚌
          </span>
          <div>
            <h1 className="text-sm leading-tight font-bold text-slate-50">Smart Transport</h1>
            <p className="font-mono text-[10px] tracking-wider text-cyan-300/80 uppercase">Planner · DSA Project</p>
          </div>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {GROUPS.map((group) => (
            <div key={group}>
              <p className="mb-2 px-2 text-[10px] font-semibold tracking-[0.15em] text-slate-500 uppercase">
                {group}
              </p>
              <div className="space-y-1">
                {MENU_ITEMS.filter((item) => item.group === group).map((item) => {
                  const active = view === item.view;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        onSelect(item.view);
                        onClose();
                      }}
                      className={cn(
                        "group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition",
                        active
                          ? "bg-gradient-to-r from-cyan-400/20 to-transparent text-cyan-100 ring-1 ring-cyan-400/30"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                      )}
                    >
                      <span className="w-5 shrink-0 text-center text-sm">{item.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-semibold">{item.label}</span>
                        <span className="block truncate font-mono text-[10px] text-slate-500">{item.ds}</span>
                      </span>
                      {item.n !== null && (
                        <span
                          className={cn(
                            "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                            active ? "bg-cyan-400/20 text-cyan-200" : "bg-white/5 text-slate-500",
                          )}
                        >
                          {item.n}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-3">
          <p className="font-mono text-[10px] leading-relaxed text-slate-500">
            Graph · Dijkstra · Queue · Priority Queue · Linked List · Stack · Searching · Sorting
          </p>
        </div>
      </aside>
    </>
  );
}
