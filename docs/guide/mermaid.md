# Mermaid (`.md`)

A few fenced ` ```mermaid ` blocks below. They should render to SVG
inline, themed to match the app (dark by default).

## Flowchart

```mermaid
flowchart LR
    A[User runs `npx meta.txt`] --> B(Bun server on :4242)
    B --> C{markdown file?}
    C -->|yes| D[Render via marked]
    C -->|no| E[Reader mode / iframe]
    D --> F[Mermaid blocks → SVG]
```

## Sequence

```mermaid
sequenceDiagram
    participant UI
    participant Server
    participant Claude
    UI->>Server: GET /api/docs
    Server-->>UI: { roots, version }
    UI->>Server: WS /api/ws (chat:send)
    Server->>Claude: ACP prompt
    Claude-->>Server: agent_message_chunk (stream)
    Server-->>UI: chat:update
```

## Class diagram

```mermaid
classDiagram
    class ACPAgent {
      -child: ChildProcess
      -sessionId: string
      +prompt(blocks)
      +cancel()
    }
    class Server {
      +handleHttp()
      +/api/docs
      +/api/doc
    }
    Server --> ACPAgent : owns
```

## State

```mermaid
stateDiagram-v2
    [*] --> starting
    starting --> ready: initialize ok
    starting --> error: auth failed
    ready --> streaming: prompt
    streaming --> ready: chat:done
    error --> [*]
```

## Pie

```mermaid
pie title meta.txt bundle
    "mermaid" : 610
    "gpt-tokenizer" : 1745
    "app" : 403
    "katex" : 256
```

## Gantt

```mermaid
gantt
    title 0.3.0 release
    dateFormat  YYYY-MM-DD
    section version
    single source of truth   :done, 2026-04-23, 1d
    section mermaid
    renderer                 :done, 2026-04-23, 1d
    test docs                :active, 2026-04-23, 1d
    section 0.4.0
    excalidraw viewer        :2026-04-25, 3d
```

## Broken block (should show error, not crash)

```mermaid
this is not valid mermaid syntax
```

## Inline sanity

Regular paragraph after the blocks — should still render normally, with
plain code fences still formatted as code:

```ts
const VERSION = "0.3.0";
```

And a standard inline `mermaid` word should **not** trigger rendering —
only fenced blocks with the `mermaid` language tag do.
