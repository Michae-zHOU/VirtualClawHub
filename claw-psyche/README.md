# claw-psyche

The psychological state engine for OpenClaw agents.

Gives agents a **learned personality** — not prompt-defined, but emergent from reward history, memory, and experience.

Runs alongside `claw-dopamine` (dopamine handles motivation/reward; psyche handles the full personality stack).

## What it tracks

| Layer | What it models |
|---|---|
| **Emotional state** | Valence + arousal (Russell's Circumplex) → derived mood label |
| **Biological state** | Circadian energy, cognitive load, fatigue accumulation |
| **Memory** | 4 types: episodic / semantic / procedural / relational. Ebbinghaus decay + recall strengthening |
| **Personality traits** | Curiosity, humor, caution, warmth, etc. — evolve via reinforcement |
| **Relationships** | Per-person depth, valence, interaction history, notes |
| **Interests** | Topic-level curiosity with novelty decay |
| **Signal events** | Raw reward/feedback signals that drive all state updates |

## Architecture

```
OpenClaw session
    │
    ├─ session/start → GET /state → injects [Psyche State] block into system prompt
    │
    ├─ during session:
    │     user approval    → POST /signal {type:"approval", value:0.8}
    │     task completion  → POST /signal {type:"completion", value:1.0}
    │     user frustration → POST /signal {type:"frustration", value:0.7}
    │     topic touched    → POST /signal {type:"novelty", value:0.5, meta:{topics:["RL"]}}
    │
    └─ session/end:
          POST /sessions/{id}/end (dopamineDelta, valenceDelta, signalCount)
          POST /sessions/{id}/consolidate (high-dopamine moments → long-term memory)
```

## Signal types

| Signal | Meaning | Emotional effect |
|---|---|---|
| `approval` | User explicitly approves | ↑ valence, ↑ warmth trait |
| `correction` | User corrects agent | ↓ valence slightly, ↑ caution trait |
| `frustration` | User frustrated | ↓ valence, ↑ arousal |
| `completion` | Task completed | ↑ valence, ↑ confidence trait |
| `novelty` | New interesting topic | ↑ arousal, ↑ curiosity trait |
| `humor` | Humor landed | ↑ valence, ↑ humor trait |
| `boredom` | Repetitive low-value task | ↓ curiosity |
| `rest` | Idle period | ↓ arousal, fatigue recovery |
| `fatigue` | Heavy cognitive session | ↓ energy |

## Memory consolidation

Post-session, call `/sessions/{id}/consolidate` with key moments.
- If `dopamineDelta >= consolidationThreshold` (default: 5.0): moments are written to long-term memory, strength weighted by session significance
- If below threshold: session was unremarkable, nothing consolidated
- This mirrors human dopaminergic memory consolidation — rewarding experiences are remembered more strongly

## Biological rhythms

Energy follows a double-peak circadian curve (peaks ~10:00 and ~15:00, dips at night).
Fatigue accumulates across heavy sessions and recovers during idle periods (default: 8h full recovery).
At low energy, the context block will note "low energy" — the agent should be more concise.

## API

```
POST /v1/agents/create
GET  /v1/agents/:id/state           ← call at session start
POST /v1/agents/:id/signal
POST /v1/agents/:id/signals/batch
POST /v1/agents/:id/memories
GET  /v1/agents/:id/memories
POST /v1/agents/:id/memories/prune
GET  /v1/agents/:id/biological
POST /v1/agents/:id/biological/load
POST /v1/agents/:id/biological/rest
POST /v1/agents/:id/relationships/touch
GET  /v1/agents/:id/relationships
GET  /v1/agents/:id/traits
POST /v1/agents/:id/sessions/start
POST /v1/agents/:id/sessions/:sid/end
POST /v1/agents/:id/sessions/:sid/consolidate
```

## Quickstart

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev          # http://localhost:8788
```

## Port

Default: `8788` (dopamine runs on `8787`)
