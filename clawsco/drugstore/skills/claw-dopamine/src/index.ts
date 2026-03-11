import 'dotenv/config';

const baseUrl = process.env.CLAWDOPAMINE_BASE_URL ?? 'http://localhost:8787';
const agentId = process.env.OPENCLAW_AGENT_ID ?? 'agent-dev';
const pollSeconds = Number(process.env.DOPAMINE_POLL_SECONDS ?? 60);

async function tick() {
  const res = await fetch(`${baseUrl}/v1/level/${encodeURIComponent(agentId)}`);
  if (!res.ok) throw new Error(`Failed to fetch dopamine level: ${res.status}`);
  const data = await res.json();
  const level = Number(data.level);

  // In real OpenClaw integration, this would update runtime state / memory / prompt.
  console.log(`[claw-dopamine] agent=${agentId} level=${level.toFixed(2)} max=${data.maxLevel} decayPerHour=${data.decayPerHour}`);
}

async function main() {
  await tick();
  setInterval(() => {
    tick().catch((e) => console.error(e));
  }, pollSeconds * 1000);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
