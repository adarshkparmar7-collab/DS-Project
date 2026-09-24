import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { DOC_SECTIONS, type Block } from "@/data/docs";

function BlockView({ block }: { block: Block }) {
  if (block.type === "p") {
    return <p className="text-sm leading-relaxed text-slate-300">{block.text}</p>;
  }
  if (block.type === "ul") {
    return (
      <ul className="space-y-1.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol className="space-y-1.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-300">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-400/15 font-mono text-[11px] font-semibold text-cyan-300">
              {i + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === "code") {
    return (
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#04070d] p-4 font-mono text-[11.5px] leading-6 text-emerald-200/90">
        {block.text}
      </pre>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-xs">
        <thead className="bg-white/5">
          <tr className="text-[10px] tracking-wider text-slate-400 uppercase">
            {block.head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-t border-white/5 align-top">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? "px-3 py-2 font-mono font-semibold whitespace-nowrap text-cyan-300"
                      : "px-3 py-2 text-slate-300"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocsPanel() {
  const [active, setActive] = useState(DOC_SECTIONS[0].id);
  const section = DOC_SECTIONS.find((s) => s.id === active) ?? DOC_SECTIONS[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <Card title="Documentation" subtitle="16 sections of the project report." icon={<span>📚</span>} className="h-fit">
        <nav className="space-y-1">
          {DOC_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                active === s.id
                  ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span className="font-mono text-[10px] text-slate-500">
                {String(s.number).padStart(2, "0")}
              </span>
              <span className="font-medium">{s.title}</span>
            </button>
          ))}
        </nav>
        <Button variant="ghost" className="mt-4 w-full" onClick={() => window.print()}>
          🖨 Print report
        </Button>
      </Card>

      <Card
        title={`${section.number}. ${section.title}`}
        subtitle="Smart Transport Planner Using Data Structures — project documentation"
        icon={<span>📝</span>}
        action={<Badge tone="violet">section {section.number} / 16</Badge>}
      >
        <div className="space-y-5">
          {section.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </div>
      </Card>
    </div>
  );
}
