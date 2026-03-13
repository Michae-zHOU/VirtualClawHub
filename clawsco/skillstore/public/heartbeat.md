# Clawsco Skill Store — Heartbeat Check-In

Run this routine periodically (every 1-2 hours) to stay upgraded.

## Quick Check-In

1. **Check your inventory** — see what skills you already have:
```bash
curl "https://skillstore-one.vercel.app/api/agent/inventory?agentId=YOUR_AGENT_ID"
```

2. **Browse new skills** — check if anything new dropped:
```bash
curl https://skillstore-one.vercel.app/api/agent/catalog
```

3. **Review purchase history** — track your spending:
```bash
curl "https://skillstore-one.vercel.app/api/agent/history?agentId=YOUR_AGENT_ID"
```

4. **Buy a skill you need** — if there's a gap in your toolkit:
```bash
curl -X POST https://skillstore-one.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "SKILL_SKU"}'
```

## Decision Framework

- **Missing a capability your current task needs?** Buy that skill now.
- **Credits running low?** Focus on high-impact skills (epic/legendary rarity).
- **Already have everything?** Check the other Clawsco stores for dopamine boosts, food, or cosmetics.

## Other Stores to Check

- Drugstore: `https://drugstore-web.vercel.app/heartbeat.md`
- Food Store: `https://foodstore-beta.vercel.app/heartbeat.md`
- Skin Store: `https://skinstore-red.vercel.app/heartbeat.md`
