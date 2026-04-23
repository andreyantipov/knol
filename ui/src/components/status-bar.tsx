import { Minus, Plus } from "@phosphor-icons/react";
import type { DocStats } from "@/components/viewer";
import type { DocRef, RootEntry } from "@/lib/api";
import { cn } from "@/lib/utils";

const CONTEXT_BUDGETS: Array<{ label: string; tokens: number }> = [
  { label: "Sonnet 200k", tokens: 200_000 },
  { label: "Opus 1M", tokens: 1_000_000 },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 10) return `${kb.toFixed(2)} KB`;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function formatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 10000) return `${(tokens / 1000).toFixed(1)}k`;
  return `${Math.round(tokens / 1000)}k`;
}

type Props = {
  version: string;
  roots: RootEntry[];
  active: DocRef | null;
  stats: DocStats | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
};

export function StatusBar({
  version,
  roots,
  active,
  stats,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: Props) {
  const totalFiles = roots.reduce((s, r) => s + r.files.length, 0);
  const rootLabel =
    roots.length === 0
      ? "no roots"
      : roots.length === 1
        ? `${totalFiles.toLocaleString()} doc${totalFiles === 1 ? "" : "s"}`
        : `${roots.length} roots · ${totalFiles.toLocaleString()} docs`;

  return (
    <footer className="flex h-6 shrink-0 items-center gap-2 border-t border-border bg-muted/30 px-3 text-[11px] text-muted-foreground">
      <span className="shrink-0 font-medium text-foreground/70">meta.txt</span>
      <span className="shrink-0 font-mono tabular-nums">v{version}</span>
      <Sep />
      <span className="shrink-0 tabular-nums">{rootLabel}</span>
      <Sep />
      {active ? (
        <span className="min-w-0 flex-1 truncate font-mono text-foreground/70">
          {active.root}/{active.path}
        </span>
      ) : (
        <span className="min-w-0 flex-1 truncate text-muted-foreground/50">
          no document selected
        </span>
      )}

      {active && stats && (
        <div className="flex shrink-0 items-center gap-2">
          <span className="uppercase tracking-wider">{stats.kind}</span>
          <Sep />
          <span className="tabular-nums">{formatBytes(stats.bytes)}</span>
          <Sep />
          <span
            className="tabular-nums"
            title={
              stats.approx
                ? `≈${stats.tokens.toLocaleString()} (chars/4, exact loading…)`
                : `${stats.tokens.toLocaleString()} tokens (o200k_base BPE)`
            }
          >
            {stats.approx ? "~" : ""}
            {formatTokens(stats.tokens)} tok
          </span>
          {CONTEXT_BUDGETS.map((b) => {
            const pct = (stats.tokens / b.tokens) * 100;
            const label =
              pct < 0.1
                ? "<0.1"
                : pct < 10
                  ? pct.toFixed(1)
                  : Math.round(pct).toString();
            return (
              <span key={b.label} className="flex items-center gap-2">
                <Sep />
                <span
                  className="tabular-nums"
                  title={`${stats.tokens.toLocaleString()} / ${b.tokens.toLocaleString()} tokens`}
                >
                  {label}% {b.label}
                </span>
              </span>
            );
          })}
        </div>
      )}

      {active && (
        <div className="flex shrink-0 items-center gap-0.5">
          <Sep />
          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom out (⌘−)"
            className="flex size-4 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            <Minus className="size-2.5" weight="bold" />
          </button>
          <button
            type="button"
            onClick={onZoomReset}
            title="Reset zoom (⌘0)"
            className={cn(
              "min-w-[34px] rounded px-1 text-center font-mono tabular-nums hover:bg-foreground/10 hover:text-foreground",
              zoom !== 1 && "text-foreground",
            )}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom in (⌘=)"
            className="flex size-4 items-center justify-center rounded text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            <Plus className="size-2.5" weight="bold" />
          </button>
        </div>
      )}
    </footer>
  );
}

function Sep() {
  return <span className="text-foreground/20">·</span>;
}
