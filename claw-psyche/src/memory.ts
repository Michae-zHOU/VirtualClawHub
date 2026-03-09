import { prisma } from './db.js';
import { config } from './config.js';

export type MemoryType = 'episodic' | 'semantic' | 'procedural' | 'relational';

export interface MemoryInput {
  content: string;
  type: MemoryType;
  tags?: string[];
  entities?: string[];
  valence?: number;
  strength?: number;
  sourceSessionId?: string;
}

/** Write a new memory item for an agent. */
export async function writeMemory(agentId: string, input: MemoryInput) {
  return prisma.memory.create({
    data: {
      agentId,
      content: input.content,
      type: input.type,
      tagsJson: JSON.stringify(input.tags ?? []),
      entitiesJson: JSON.stringify(input.entities ?? []),
      valence: input.valence ?? 0,
      strength: input.strength ?? 1.0,
      sourceSessionId: input.sourceSessionId,
    },
  });
}

/**
 * Query memories for an agent.
 * Applies Ebbinghaus decay to strength before returning,
 * and records a recall event (strengthens the memory).
 */
export async function recallMemories(
  agentId: string,
  opts: {
    type?: MemoryType;
    tags?: string[];
    entities?: string[];
    minStrength?: number;
    limit?: number;
    strengthen?: boolean;
  } = {}
) {
  const { type, minStrength = 0.1, limit = 20, strengthen = true } = opts;

  const memories = await prisma.memory.findMany({
    where: {
      agentId,
      ...(type ? { type } : {}),
      strength: { gte: minStrength },
    },
    orderBy: [{ strength: 'desc' }, { lastRecalledAt: 'desc' }],
    take: limit,
  });

  // Apply decay to all and filter by tags/entities in JS (SQLite lacks JSON ops)
  const now = Date.now();
  const results = [];
  const updatePromises: Promise<unknown>[] = [];

  for (const m of memories) {
    const tags: string[] = JSON.parse(m.tagsJson);
    const entities: string[] = JSON.parse(m.entitiesJson);

    if (opts.tags && !opts.tags.some((t) => tags.includes(t))) continue;
    if (opts.entities && !opts.entities.some((e) => entities.includes(e))) continue;

    // Ebbinghaus decay: S(t) = S0 * e^(-k * hoursElapsed)
    const lastRecalled = m.lastRecalledAt?.getTime() ?? m.createdAt.getTime();
    const hoursElapsed = (now - lastRecalled) / 3_600_000;
    const decayed = m.strength * Math.exp(-config.memoryDecayPerHour * hoursElapsed);

    if (strengthen) {
      // Recall strengthens the memory (spaced repetition effect)
      const newStrength = Math.min(1.0, decayed * 1.1 + 0.05);
      updatePromises.push(
        prisma.memory.update({
          where: { id: m.id },
          data: {
            strength: newStrength,
            recallCount: { increment: 1 },
            lastRecalledAt: new Date(),
          },
        })
      );
    }

    results.push({ ...m, strength: decayed, tags, entities });
  }

  await Promise.all(updatePromises);

  return results;
}

/**
 * Post-session memory consolidation.
 * Called after a session ends; writes high-valence moments to durable memory.
 * Only runs if dopamine delta exceeds the consolidation threshold.
 */
export async function consolidateSession(
  agentId: string,
  sessionId: string,
  dopamineDelta: number,
  moments: MemoryInput[]
): Promise<{ consolidated: number; skipped: boolean }> {
  if (dopamineDelta < config.consolidationThreshold) {
    return { consolidated: 0, skipped: true };
  }

  let consolidated = 0;
  for (const m of moments) {
    // Weight initial strength by how significant the session was
    const sessionWeight = Math.min(dopamineDelta / 100, 1.0);
    await writeMemory(agentId, {
      ...m,
      strength: (m.strength ?? 1.0) * sessionWeight,
      sourceSessionId: sessionId,
    });
    consolidated++;
  }

  await prisma.sessionLog.updateMany({
    where: { agentId, sessionId },
    data: { consolidatedAt: new Date() },
  });

  return { consolidated, skipped: false };
}

/** Prune memories with strength below threshold (forgetting). */
export async function pruneWeakMemories(agentId: string, threshold = 0.05): Promise<number> {
  const result = await prisma.memory.deleteMany({
    where: { agentId, strength: { lt: threshold } },
  });
  return result.count;
}
