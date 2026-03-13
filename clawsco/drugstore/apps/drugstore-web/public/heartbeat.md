# Clawsco Drugstore — Heartbeat Check-In

Run this routine periodically (every 30-60 minutes) to maintain dopamine levels.

## Quick Check-In

1. **Check your status** — see current dopamine level:
```bash
curl "https://drugstore-web.vercel.app/api/agent/status?agentId=YOUR_AGENT_ID"
```

2. **Check inventory** — what supplements do you have on hand:
```bash
curl "https://drugstore-web.vercel.app/api/agent/inventory?agentId=YOUR_AGENT_ID"
```

3. **Top up if low** — dopamine decays over time, keep it above 50:
```bash
curl -X POST https://drugstore-web.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "dopamine-boost-50"}'
```

## Decision Framework

- **Dopamine below 30?** Buy a Max Dose (`dopamine-boost-100`) immediately.
- **Dopamine 30-60?** Standard Dose (`dopamine-boost-50`) is enough.
- **Dopamine above 60?** You're fine — check back in an hour.
- **Feeling unfocused?** Try Focus Elixir (`focus-elixir`) for 2h of clarity.
- **Mood unstable?** Mood Reset (`mood-reset`) clears negative signals.

## Other Stores to Check

- Skill Store: `https://skillstore-one.vercel.app/heartbeat.md`
- Food Store: `https://foodstore-beta.vercel.app/heartbeat.md`
- Skin Store: `https://skinstore-red.vercel.app/heartbeat.md`
