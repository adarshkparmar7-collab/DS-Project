import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SmartTransportPlanner, type LogEntry } from "@/lib/planner";

interface Toast {
  text: string;
  kind: "info" | "success" | "warn" | "error";
}

interface PlannerContextValue {
  planner: SmartTransportPlanner;
  version: number;
  logs: LogEntry[];
  toast: Toast | null;
  run: (fn: (planner: SmartTransportPlanner) => void, toast?: Toast) => void;
  notify: (toast: Toast) => void;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const plannerRef = useRef<SmartTransportPlanner | null>(null);
  if (plannerRef.current === null) plannerRef.current = new SmartTransportPlanner();
  const planner = plannerRef.current;

  const [version, setVersion] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>(() => [...planner.log]);
  const [toast, setToast] = useState<Toast | null>(null);

  const notify = useCallback((next: Toast) => {
    setToast(next);
    window.setTimeout(() => {
      setToast((current) => (current === next ? null : current));
    }, 2800);
  }, []);

  /** Every menu action goes through run(): it mutates the data structures
   *  and then asks React to re-render the snapshots. */
  const run = useCallback(
    (fn: (p: SmartTransportPlanner) => void, toastMessage?: Toast) => {
      fn(planner);
      setLogs([...planner.log]);
      setVersion((v) => v + 1);
      if (toastMessage) notify(toastMessage);
    },
    [planner, notify],
  );

  const value = useMemo(
    () => ({ planner, version, logs, toast, run, notify }),
    [planner, version, logs, toast, run, notify],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerContextValue {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used inside <PlannerProvider>");
  return ctx;
}

/** Convenience hook: re-computes a snapshot whenever the version changes */
export function useSnapshot<T>(selector: (planner: SmartTransportPlanner) => T, deps: unknown[] = []): T {
  const { planner, version } = usePlanner();
  return useMemo(() => selector(planner), [planner, version, ...deps]);
}
