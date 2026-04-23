let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      const isDark = document.documentElement.classList.contains("dark");
      m.default.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: isDark ? "dark" : "default",
        fontFamily: "inherit",
        suppressErrorRendering: true,
      });
      return m.default;
    });
  }
  return mermaidPromise;
}

let counter = 0;

export async function renderMermaid(container: HTMLElement, signal?: AbortSignal): Promise<void> {
  const blocks = Array.from(
    container.querySelectorAll<HTMLElement>("pre > code.language-mermaid"),
  );
  if (blocks.length === 0) return;

  const mermaid = await loadMermaid();
  if (signal?.aborted) return;

  for (const code of blocks) {
    const pre = code.parentElement;
    if (!pre) continue;
    const source = code.textContent ?? "";
    const id = `mmd-${Date.now().toString(36)}-${counter++}`;
    try {
      const { svg } = await mermaid.render(id, source);
      if (signal?.aborted) return;
      const wrapper = document.createElement("div");
      wrapper.className = "mermaid-block";
      wrapper.innerHTML = svg;
      pre.replaceWith(wrapper);
    } catch (err) {
      if (signal?.aborted) return;
      document.getElementById(id)?.remove();
      document.getElementById(`d${id}`)?.remove();
      const msg = err instanceof Error ? err.message : String(err);
      const fallback = document.createElement("div");
      fallback.className = "mermaid-error";
      fallback.textContent = `mermaid: ${msg}`;
      pre.replaceWith(fallback);
    }
  }
}
