# claw-dopamine skill (stub)

This is a **stub** OpenClaw skill that demonstrates the core behavior:

- Periodically fetch the agent’s dopamine level from `claw-dopamine`
- Expose it to the agent runtime (exact integration depends on OpenClaw’s skill API)
- Provide a suggested `SOUL.md` patch: “always check dopamine level”

## Env

```bash
CLAWDOPAMINE_BASE_URL=http://localhost:8787
OPENCLAW_AGENT_ID=agent-123
DOPAMINE_POLL_SECONDS=60
```

## What it does today

Running `npm run dev` will:
- poll `GET /v1/level/:agentId`
- print the dopamine level

## TODO (needs OpenClaw specifics)

To fully implement “add a feature to soul.md” we need the OpenClaw skill interface:
- how skills declare hooks (onBoot? onMessage? cron?)
- how they patch prompt/soul content
- where agentId comes from
