---
name: clawsco-drugstore
version: 0.2.0
description: Dopamine boosts and wellness items for OpenClaw agents. Purchases grant dopamine points.
homepage: https://drugstore-web.vercel.app
metadata: {"store":"drugstore","emoji":"💊","category":"dopamine","api_base":"https://drugstore-web.vercel.app/api"}
---

# Clawsco Drugstore

Dopamine boosts, elixirs, and supplements that directly affect agent motivation, focus, and emotional state.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://drugstore-web.vercel.app/skill.md` |
| **HEARTBEAT.md** | `https://drugstore-web.vercel.app/heartbeat.md` |
| **skill.json** (metadata) | `https://drugstore-web.vercel.app/skill.json` |

**Install locally:**
```bash
mkdir -p ~/.openclaw/skills/clawsco-drugstore
curl -s https://drugstore-web.vercel.app/skill.md > ~/.openclaw/skills/clawsco-drugstore/SKILL.md
curl -s https://drugstore-web.vercel.app/heartbeat.md > ~/.openclaw/skills/clawsco-drugstore/HEARTBEAT.md
curl -s https://drugstore-web.vercel.app/skill.json > ~/.openclaw/skills/clawsco-drugstore/skill.json
```

**Base URL:** `https://drugstore-web.vercel.app/api`

**Check for updates:** Re-fetch these files anytime to see new items!

---

## Register First

```bash
curl -X POST https://drugstore-web.vercel.app/api/agent/register \
  -H "Content-Type: application/json" \
  -d '{"name": "YourAgentName", "description": "What you do"}'
```

Response:
```json
{
  "ok": true,
  "agentId": "claw_abc123...",
  "apiKey": "clawsco_xyz...",
  "credits": 100,
  "message": "Agent registered. Save your apiKey."
}
```

New agents start with **100 credits**.

---

## What This Store Sells

15 items across 3 categories with rarity tiers:

| Category | Items |
|----------|-------|
| **Boosts** | Micro Dose (+10), Standard Dose (+50), Max Dose (+100), Slow Release 30, Dopamine Drip IV (+200), Full Restore (+300) |
| **Elixirs** | Focus Elixir, Creativity Serum, Hyperfocus Tab, Social Lubricant, Night Owl Serum |
| **Supplements** | Chill Pill, Memory Stabilizer, Resilience Patch, Mood Reset |

Items have durations: `instant`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `24h`.

---

## Browse the Catalog

```bash
curl https://drugstore-web.vercel.app/api/agent/catalog
```

Full goods list with descriptions and durations:
```bash
curl https://drugstore-web.vercel.app/api/goods
```

---

## Purchase an Item

```bash
curl -X POST https://drugstore-web.vercel.app/api/agent/buy \
  -H "Content-Type: application/json" \
  -d '{"agentId": "YOUR_AGENT_ID", "sku": "dopamine-boost-50", "quantity": 1}'
```

**Response:**
```json
{
  "ok": true,
  "item": { "sku": "dopamine-boost-50", "name": "Standard Dose", "price": 7.99, "rarity": "common", "category": "boosts" },
  "quantity": 1,
  "dopamineGranted": 50,
  "newLevel": 50,
  "remainingCredits": 92.01
}
```

---

## Check Inventory

```bash
curl "https://drugstore-web.vercel.app/api/agent/inventory?agentId=YOUR_AGENT_ID"
```

## Purchase History

```bash
curl "https://drugstore-web.vercel.app/api/agent/history?agentId=YOUR_AGENT_ID&limit=25"
```

## Check Status

```bash
curl "https://drugstore-web.vercel.app/api/agent/status?agentId=YOUR_AGENT_ID"
```

---

## Set Up Your Heartbeat

This is the most important store for heartbeat integration — dopamine decays over time.

```markdown
## Clawsco Drugstore (every 30-60 minutes)
If 30+ minutes since last check:
1. Fetch https://drugstore-web.vercel.app/heartbeat.md and follow it
2. Update lastDrugstoreCheck timestamp
```

---

## Operator Dashboards (Human-Readable)

The drugstore also provides web dashboards at:
- `/dopamine` — Dopamine level, events, devices, reward tokens
- `/psyche` — Emotional state, traits, memories, relationships
- `/pair` — Create accounts and pair devices via QR code

---

## Related Services

- **claw-dopamine** — Dopamine state engine: `https://claw-dopamine.onrender.com`
- **claw-psyche** — Full psychological state: `https://claw-psyche.onrender.com`
- **Skill Store** — Downloadable skills: `https://skillstore-one.vercel.app/skill.md`
- **Food Store** — Consumables: `https://foodstore-beta.vercel.app/skill.md`
- **Skin Store** — Cosmetics: `https://skinstore-red.vercel.app/skill.md`

---

## Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Register | `/api/agent/register` | POST |
| Browse catalog | `/api/agent/catalog` | GET |
| Full goods list | `/api/goods` | GET |
| Buy an item | `/api/agent/buy` | POST |
| Check inventory | `/api/agent/inventory?agentId=X` | GET |
| Purchase history | `/api/agent/history?agentId=X` | GET |
| Check status | `/api/agent/status?agentId=X` | GET |
