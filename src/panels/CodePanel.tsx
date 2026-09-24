import { useMemo, useState } from "react";
import { Badge, Button, Card, ComplexityTag } from "@/components/ui";
import { ALL_FILES, EXTRA_FILES, JAVA_FILES, JAVA_RUN_COMMANDS, countLines } from "@/data/javaCode";

const KEYWORDS =
  "public|private|protected|class|interface|static|final|void|int|long|double|float|boolean|char|byte|short|new|return|if|else|for|while|do|switch|case|default|break|continue|import|package|extends|implements|this|null|true|false|try|catch|throw|throws|super|abstract|enum|instanceof";

const TOKEN_RE = new RegExp(
  `(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*|#[^\\n]*)|("(?:\\\\.|[^"\\\\])*")|(@\\w+)|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b(?:${KEYWORDS})\\b)`,
  "g",
);

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Tiny syntax highlighter: comments, strings, annotations, numbers, keywords. */
function highlight(code: string): string {
  return escapeHtml(code).replace(TOKEN_RE, (match, comment, str, annotation, num, keyword) => {
    if (comment) return `<span class="text-slate-500 italic">${match}</span>`;
    if (str) return `<span class="text-emerald-300">${match}</span>`;
    if (annotation) return `<span class="text-violet-300">${match}</span>`;
    if (num) return `<span class="text-amber-300">${match}</span>`;
    if (keyword) return `<span class="text-cyan-400">${match}</span>`;
    return match;
  });
}

/** Triggers a real file download in the browser (no external library needed). */
function downloadFile(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function CodePanel() {
  const [active, setActive] = useState(JAVA_FILES[0].name);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const file = ALL_FILES.find((f) => f.name === active) ?? ALL_FILES[0];
  const lines = useMemo(() => file.code.replace(/\s+$/, "").split("\n"), [file]);
  const html = useMemo(() => lines.map((line) => highlight(line)), [lines]);

  const totalLines = useMemo(
    () => JAVA_FILES.reduce((sum, f) => sum + countLines(f.code), 0),
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(file.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  /** Downloads every .java file of the project, one after another. */
  const downloadAllJavaFiles = async () => {
    setDownloading(true);
    for (let i = 0; i < JAVA_FILES.length; i++) {
      downloadFile(JAVA_FILES[i].name, JAVA_FILES[i].code);
      await new Promise((resolve) => window.setTimeout(resolve, 220));
    }
    setDownloading(false);
  };

  const downloadBuildScript = () => {
    const script =
      "@echo off\r\n" +
      "echo Compiling Smart Transport Planner ...\r\n" +
      "javac *.java\r\n" +
      "if errorlevel 1 ( echo Compilation failed. & pause & exit /b 1 )\r\n" +
      "echo Compilation successful. Starting the program ...\r\n" +
      "java SmartTransportPlanner\r\n" +
      "pause\r\n";
    downloadFile("compile-and-run.bat", script);
  };

  const downloadShellScript = () => {
    const script = [
      "#!/bin/bash",
      "echo \"Compiling Smart Transport Planner ...\"",
      "javac *.java",
      "if [ $? -ne 0 ]; then echo \"Compilation failed.\"; exit 1; fi",
      "echo \"Compilation successful. Starting the program ...\"",
      "java SmartTransportPlanner",
      "",
    ].join("\n");
    downloadFile("compile-and-run.sh", script);
  };

  return (
    <div className="space-y-5">
      <Card
        title="Java Project Files (.java)"
        subtitle="14 real Java classes, no external library. Put them in one folder, run javac *.java and java SmartTransportPlanner — that is all."
        icon={<span className="text-sm">☕</span>}
        action={
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">{JAVA_FILES.length} .java files</Badge>
            <Badge tone="violet">{totalLines} lines</Badge>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <code className="rounded-xl bg-slate-950/70 px-4 py-3 font-mono text-xs leading-6 text-emerald-300 ring-1 ring-white/10">
            {JAVA_RUN_COMMANDS.map((command) => (
              <div key={command}>
                <span className="text-slate-500">$</span> {command}
              </div>
            ))}
          </code>
          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadAllJavaFiles} disabled={downloading}>
              {downloading ? "downloading…" : "⬇ Download all .java files"}
            </Button>
            <Button variant="ghost" onClick={downloadBuildScript}>
              ⬇ compile-and-run.bat
            </Button>
            <Button variant="ghost" onClick={downloadShellScript}>
              ⬇ compile-and-run.sh
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {JAVA_FILES.map((f) => (
            <button
              key={f.name}
              onClick={() => setActive(f.name)}
              className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-xl px-3 py-2 text-left font-mono text-[11.5px] ring-1 transition ${
                active === f.name
                  ? "bg-cyan-400/15 text-cyan-200 ring-cyan-400/40"
                  : "bg-white/[0.03] text-slate-300 ring-white/10 hover:bg-white/[0.07]"
              }`}
            >
              <span className="font-semibold">{f.name}</span>
              <span className="flex items-center gap-2 text-[10.5px] text-slate-500">
                <span className="hidden sm:inline">{f.purpose}</span>
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-slate-400">{countLines(f.code)} ln</span>
                <span className="rounded-md bg-violet-400/10 px-1.5 py-0.5 text-violet-300">{f.ds}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <span className="self-center text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            extra files
          </span>
          {EXTRA_FILES.map((f) => (
            <button
              key={f.name}
              onClick={() => setActive(f.name)}
              className={`rounded-xl px-3 py-1.5 font-mono text-[11px] ring-1 transition ${
                active === f.name
                  ? "bg-amber-400/15 text-amber-200 ring-amber-400/40"
                  : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </Card>

      <Card
        title={file.name}
        subtitle={file.purpose}
        icon={<span>📄</span>}
        action={
          <div className="flex flex-wrap gap-2">
            <ComplexityTag text={`${countLines(file.code)} lines`} />
            <Button variant="ghost" onClick={copy}>
              {copied ? "copied ✓" : "copy"}
            </Button>
            <Button variant="ghost" onClick={() => downloadFile(file.name, file.code)}>
              ⬇ download
            </Button>
          </div>
        }
      >
        <div className="max-h-[620px] overflow-auto rounded-xl border border-white/10 bg-[#04070d]">
          <table className="w-full border-collapse">
            <tbody>
              {html.map((line, i) => (
                <tr key={i} className="hover:bg-white/[0.03]">
                  <td className="w-12 border-r border-white/5 px-2 py-0 text-right align-top font-mono text-[11px] leading-6 text-slate-600 select-none">
                    {i + 1}
                  </td>
                  <td
                    className="px-3 py-0 font-mono text-[12.5px] leading-6 whitespace-pre text-slate-200"
                    dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
