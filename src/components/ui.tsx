import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Card({
  children,
  className,
  title,
  subtitle,
  icon,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className={cn("glass rounded-2xl p-5 shadow-2xl shadow-black/40", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {icon && (
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25">
                {icon}
              </span>
            )}
            <div>
              {title && <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">{title}</h2>}
              {subtitle && <p className="mt-1 text-xs leading-relaxed text-slate-400">{subtitle}</p>}
            </div>
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

const variants = {
  primary:
    "bg-gradient-to-br from-cyan-500 to-sky-600 text-slate-950 hover:from-cyan-400 hover:to-sky-500 shadow-lg shadow-cyan-500/20",
  ghost: "bg-white/5 text-slate-200 hover:bg-white/10 ring-1 ring-white/10",
  danger: "bg-rose-500/15 text-rose-200 hover:bg-rose-500/25 ring-1 ring-rose-400/30",
  amber: "bg-amber-400/15 text-amber-200 hover:bg-amber-400/25 ring-1 ring-amber-300/30",
  violet: "bg-violet-500/15 text-violet-200 hover:bg-violet-500/25 ring-1 ring-violet-400/30",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 placeholder:text-slate-600";

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: "slate" | "cyan" | "emerald" | "amber" | "rose" | "violet";
  className?: string;
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-500/15 text-slate-300 ring-slate-400/20",
    cyan: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/25",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-400/25",
    rose: "bg-rose-500/15 text-rose-300 ring-rose-400/25",
    violet: "bg-violet-500/15 text-violet-300 ring-violet-400/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  unit,
  tone = "cyan",
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone?: "cyan" | "amber" | "emerald" | "violet" | "rose";
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    cyan: "text-cyan-300",
    amber: "text-amber-300",
    emerald: "text-emerald-300",
    violet: "text-violet-300",
    rose: "text-rose-300",
  };
  return (
    <div className="glass-soft rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        {icon}
        {label}
      </div>
      <div className={cn("mt-1 font-mono text-xl font-semibold", tones[tone])}>
        {value}
        {unit && <span className="ml-1 text-xs text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

export function EmptyState({ text, icon = "∅" }: { text: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
      <span className="font-mono text-2xl text-slate-600">{icon}</span>
      <p className="max-w-sm text-xs leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

export function CodeLine({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("font-mono text-xs leading-6", className)}>{children}</div>;
}

export function ComplexityTag({ text }: { text: string }) {
  return (
    <span className="rounded-lg bg-slate-900/70 px-2 py-1 font-mono text-[10px] text-cyan-300 ring-1 ring-white/10">
      {text}
    </span>
  );
}
