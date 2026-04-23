import { useMemo } from "react";
import type { DocRef } from "@/lib/api";
import { useOutline } from "@/lib/outlines";
import { cn } from "@/lib/utils";

type Props = {
  active: DocRef | null;
};

export function Outline({ active }: Props) {
  const headings = useOutline(active);

  const minDepth = useMemo(
    () => headings.reduce((m, h) => Math.min(m, h.depth), 6),
    [headings],
  );

  if (!active || headings.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex max-h-[50%] shrink-0 flex-col border-t border-border">
      <div className="flex h-8 shrink-0 items-center justify-between px-3 text-[11px] uppercase tracking-wider text-muted-foreground/70">
        <span>Outline</span>
        <span className="tabular-nums">{headings.length}</span>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
        {headings.map((h, i) => {
          const indent = Math.max(0, h.depth - minDepth);
          return (
            <li key={`${h.id}-${i}`}>
              <button
                type="button"
                onClick={() => handleClick(h.id)}
                title={h.text}
                className={cn(
                  "flex w-full min-w-0 items-center rounded px-1.5 py-0.5 text-left text-[12px] leading-snug text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  h.depth <= 1 && "font-medium text-foreground/80",
                )}
                style={{ paddingLeft: `${0.5 + indent * 0.75}rem` }}
              >
                <span className="truncate">{h.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
