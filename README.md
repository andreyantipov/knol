# meta.txt

**llms.txt, but for your repo.**

A living markdown knowledge base that travels with your code — reasoning,
decisions, architecture. Browse it with `npx meta.txt`, or just read the
files.

## Usage

```sh
npx meta.txt                 # current directory
npx meta.txt ./docs          # specific folder
npx meta.txt -p 4000         # custom port
```

Bun users:

```sh
bunx meta.txt
```

Zero install — the artifact is the markdown in your repo. The tool is an
optional web viewer.

See [CLAUDE.md](./CLAUDE.md) for the development layout, build flow, and
embedding notes.
