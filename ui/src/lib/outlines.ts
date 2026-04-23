import { useEffect, useState } from "react";
import type { DocRef } from "@/lib/api";
import type { Heading } from "@/lib/toc";

type Key = string;

function key(ref: DocRef | null): Key | null {
  return ref ? `${ref.root}\u0000${ref.path}` : null;
}

const store = new Map<Key, Heading[]>();
const subs = new Set<(k: Key) => void>();

export function setOutline(ref: DocRef, headings: Heading[]): void {
  const k = key(ref)!;
  store.set(k, headings);
  subs.forEach((fn) => fn(k));
}

export function clearOutline(ref: DocRef): void {
  const k = key(ref)!;
  if (!store.has(k)) return;
  store.delete(k);
  subs.forEach((fn) => fn(k));
}

export function useOutline(ref: DocRef | null): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>(() => {
    const k = key(ref);
    return k ? store.get(k) ?? [] : [];
  });

  useEffect(() => {
    const k = key(ref);
    setHeadings(k ? store.get(k) ?? [] : []);
    if (!k) return;
    const fn = (changed: Key) => {
      if (changed !== k) return;
      setHeadings(store.get(k) ?? []);
    };
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  }, [ref?.root, ref?.path]);

  return headings;
}
