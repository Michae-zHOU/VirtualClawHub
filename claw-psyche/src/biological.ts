import { prisma } from './db.js';
import { config } from './config.js';
import { circadianEnergy, clamp } from './mood.js';

/**
 * Returns the current biological state with live circadian energy applied.
 * Call this at session start to inject energy/fatigue context.
 */
export async function getBiologicalState(agentId: string) {
  const state = await prisma.biologicalState.upsert({
    where: { agentId },
    create: { agentId },
    update: {},
  });

  const hourNow = new Date().getHours(); // local server hour
  const circadian = circadianEnergy(hourNow);

  // Fatigue reduces the circadian ceiling
  const effectiveEnergy = circadian * (1 - state.fatigueAccumulated * 0.6);

  return {
    ...state,
    effectiveEnergy: clamp(effectiveEnergy, 0, 1),
    circadian,
    hourNow,
  };
}

/** Record cognitive load increase during a session. */
export async function increaseLoad(agentId: string, delta: number) {
  const state = await prisma.biologicalState.upsert({
    where: { agentId },
    create: { agentId },
    update: {},
  });
  const newLoad = clamp(state.cognitiveLoad + delta, 0, 1);
  const newFatigue = newLoad > 0.7
    ? clamp(state.fatigueAccumulated + config.fatiguePerHeavySession * delta, 0, 1)
    : state.fatigueAccumulated;

  await prisma.biologicalState.update({
    where: { agentId },
    data: { cognitiveLoad: newLoad, fatigueAccumulated: newFatigue },
  });
}

/** Record a rest period — resets cognitive load, partially reduces fatigue. */
export async function recordRest(agentId: string) {
  const state = await prisma.biologicalState.upsert({
    where: { agentId },
    create: { agentId },
    update: {},
  });
  const now = new Date();
  const hoursRested = (now.getTime() - state.lastRestAt.getTime()) / 3_600_000;
  const fatigueReduction = Math.min(hoursRested / config.fatigueRestHours, 1.0);

  await prisma.biologicalState.update({
    where: { agentId },
    data: {
      cognitiveLoad: 0,
      fatigueAccumulated: clamp(state.fatigueAccumulated - fatigueReduction, 0, 1),
      lastRestAt: now,
    },
  });
}
