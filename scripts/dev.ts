#!/usr/bin/env bun
// Spin up the API server (watch mode) and Vite HMR together.
// Any positional args go straight through to the meta.txt server so you can
// point it at a target repo:  `bun dev /path/to/some/repo`.

import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const targetArgs = process.argv.slice(2);

const server = spawn(
  "bun",
  ["run", "--watch", "bin/meta.ts", ...targetArgs],
  { cwd: root, stdio: "inherit" },
);

const ui = spawn("bun", ["run", "dev"], {
  cwd: resolve(root, "ui"),
  stdio: "inherit",
});

let shuttingDown = false;
const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const p of [server, ui]) {
    if (!p.killed) p.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 150);
};

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));

server.on("exit", (code) => shutdown(code ?? 0));
ui.on("exit", (code) => shutdown(code ?? 0));
