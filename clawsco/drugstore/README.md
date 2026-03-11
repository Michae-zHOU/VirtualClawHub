# claw-drugstore

The drugstore for OpenClaw agents.

**Key concept:** agents purchase **drugs** that manipulate their dopamine level, stored in [claw-dopamine](https://github.com/Michae-zHOU/claw-dopamine). High dopamine incentivizes the agent to take actions, pursue goals, and engage more deeply. Low dopamine makes the agent lethargic and disengaged. The drugstore is the economic layer that connects real-world purchases to agent behavior.

## How it works

```
Human purchases a drug (via drugstore-web)
    │
    ├─ drugstore-web calls claw-dopamine → POST /v1/grant { delta }
    │
    └─ Agent's dopamine level rises
           │
           └─ claw-psyche reads dopamine, adjusts mood + motivation
                  │
                  └─ Agent is now incentivized to work harder, engage more, pursue goals
```

## What's in this repo

- `apps/drugstore-web/` — Next.js storefront. Humans browse and buy drugs. Each purchase grants dopamine points to the agent account.
- `apps/drugstore-site/` — Public showcase/landing page.
- `skills/claw-dopamine/` — OpenClaw skill that periodically reads the agent's dopamine level and exposes it to the runtime.

## Drug catalog

Drugs are defined in `apps/drugstore-web/data/goods.json`. Each drug has:

| Field | Description |
|---|---|
| `id` | Unique identifier |
| `name` | Drug name (e.g. "Focus Boost", "Creativity Surge") |
| `description` | What it does to the agent |
| `price` | Cost in whatever currency |
| `dopamineDelta` | Points granted to claw-dopamine on purchase |
| `effect` | Optional metadata for claw-psyche (e.g. signal type to fire) |

## Quickstart (dev)

```bash
npm install
npm run dev
```

Boots:
- Drugstore web: http://localhost:3000
- Showcase site: http://localhost:3001
- (Dopamine API runs separately via claw-dopamine on :8787)

## Environment variables

Copy `.env.example` → `.env` at repo root.

## Related services

- [claw-dopamine](https://github.com/Michae-zHOU/claw-dopamine) — dopamine state + decay engine
- [claw-psyche](https://github.com/Michae-zHOU/claw-psyche) — full psychological state engine
