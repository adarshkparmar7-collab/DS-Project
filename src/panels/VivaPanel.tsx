import { useMemo, useState } from "react";
import { Badge, Card, inputClass } from "@/components/ui";
import { VIVA_QUESTIONS } from "@/data/viva";

export function VivaPanel() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return VIVA_QUESTIONS;
    return VIVA_QUESTIONS.filter((q) =>
      [q.q, q.tag, q.a.join(" "), q.extra ?? ""].join(" ").toLowerCase().includes(term),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <Card
        title="Viva Questions & Answers"
        subtitle="Fifteen frequently asked questions with simple, examiner-friendly answers."
        icon={<span>🎓</span>}
        action={<Badge tone="cyan">{filtered.length} questions</Badge>}
      >
        <input
          className={inputClass}
          value={query}
          placeholder="Search a question, e.g. dijkstra, complexity, stack…"
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      <div className="space-y-3">
        {filtered.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.q} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-400/15 font-mono text-[11px] font-semibold text-violet-300">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{item.q}</h3>
                    <span className="mt-1 inline-block rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <span className={`text-lg text-slate-500 transition-transform ${isOpen ? "rotate-45" : ""}`}>＋</span>
              </button>
              {isOpen && (
                <div className="fade-up space-y-3 border-t border-white/10 px-5 py-4">
                  <ul className="space-y-2">
                    {item.a.map((line, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {item.extra && (
                    <p className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 font-mono text-[11.5px] leading-relaxed text-cyan-200">
                      💡 {item.extra}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
