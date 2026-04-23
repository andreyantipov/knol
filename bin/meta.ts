#!/usr/bin/env bun
import { startServer } from "../src/server.ts";

function parseArgs(argv: string[]) {
  const opts: { port: number; dir: string; open: boolean; help: boolean } = {
    port: Number(process.env.META_PORT ?? 4343),
    dir: process.cwd(),
    open: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-p" || a === "--port") opts.port = Number(argv[++i]);
    else if (a === "-d" || a === "--dir") opts.dir = argv[++i] ?? process.cwd();
    else if (a === "--open") opts.open = true;
    else if (a === "-h" || a === "--help") opts.help = true;
    else if (a && !a.startsWith("-")) opts.dir = a;
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

if (opts.help) {
  console.log(`meta.txt — markdown docs viewer

Usage:
  npx meta.txt [dir]            serve .md files from <dir> (default: cwd)
  npx meta.txt -p 4000          use port 4000
  npx meta.txt --open           open browser on start

Bun users: replace npx with bunx.
`);
  process.exit(0);
}

const server = startServer({ port: opts.port, root: opts.dir });
const url = `http://${server.hostname}:${server.port}`;
console.log(`meta.txt  ${url}  (docs: ${opts.dir})`);

if (opts.open) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  Bun.spawn([cmd, url]).exited.catch(() => {});
}
