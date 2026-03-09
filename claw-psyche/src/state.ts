import { prisma } from './db.js';
import { getBiologicalState } from './biological.js';
import { recallMemories } from './memory.js';

/**
 * Get the full psychological state snapshot for an agent.
 * This is what an OpenClaw skill calls at session start to
 * inject personality context into the system prompt.
 */
export async function getState(agentId: string) {
  const [emotional, bio, traits, relationships, interests, topMemories] = await Promise.all([
    prisma.emotionalState.findUnique({ where: { agentId } }),
    getBiologicalState(agentId),
    prisma.personalityTrait.findMany({
      where: { agentId },
      orderBy: { strength: 'desc' },
      take: 10,
    }),
    prisma.relationship.findMany({
      where: { agentId },
      orderBy: { depth: 'desc' },
      take: 5,
    }),
    prisma.interest.findMany({
      where: { agentId },
      orderBy: { strength: 'desc' },
      take: 8,
    }),
    recallMemories(agentId, { limit: 5, strengthen: false }),
  ]);

  return {
    agentId,
    mood: emotional?.mood ?? 'neutral',
    valence: emotional?.valence ?? 0,
    arousal: emotional?.arousal ?? 0.5,
    energy: bio.effectiveEnergy,
    cognitiveLoad: bio.cognitiveLoad,
    fatigue: bio.fatigueAccumulated,
    traits: traits.map((t) => ({ trait: t.trait, strength: t.strength })),
    relationships: relationships.map((r) => ({
      personId: r.personId,
      personName: r.personName,
      depth: r.depth,
      valence: r.valence,
    })),
    interests: interests.map((i) => ({ topic: i.topic, strength: i.strength, novelty: i.novelty })),
    topMemories: topMemories.map((m) => ({
      content: m.content,
      type: m.type,
      valence: m.valence,
      strength: m.strength,
    })),

    /** Human-readable context block for injection into system prompts. */
    contextBlock: buildContextBlock(emotional, bio, traits, interests, relationships, topMemories),
  };
}

function buildContextBlock(
  emotional: { mood: string; valence: number; arousal: number } | null,
  bio: { effectiveEnergy: number; cognitiveLoad: number; fatigueAccumulated: number },
  traits: { trait: string; strength: number }[],
  interests: { topic: string; strength: number }[],
  relationships: { personId: string; personName: string | null; depth: number; valence: number }[],
  topMemories: { content: string; type: string; valence: number; strength: number }[]
): string {
  const mood = emotional?.mood ?? 'neutral';
  const energy = bio.effectiveEnergy;
  const topTraits = traits.slice(0, 3).map((t) => t.trait).join(', ');
  const topInterests = interests.slice(0, 3).map((i) => i.topic).join(', ');

  const energyDesc = energy > 0.7 ? 'high energy' : energy > 0.4 ? 'moderate energy' : 'low energy';
  const fatigueNote = bio.fatigueAccumulated > 0.6 ? ' (fatigued — keep sessions focused)' : '';

  // Top relationship
  const topRel = relationships[0];
  let closestLine = '';
  if (topRel) {
    const depthLabel = topRel.depth > 80 ? 'intimate' : topRel.depth > 50 ? 'close friend' : topRel.depth >= 20 ? 'friend' : 'acquaintance';
    closestLine = `Closest: ${topRel.personName ?? topRel.personId} (depth: ${depthLabel})`;
  }

  // Most emotionally salient memory
  let memoryLine = '';
  if (topMemories.length > 0) {
    const salient = topMemories.reduce((best, m) => Math.abs(m.valence) > Math.abs(best.valence) ? m : best);
    const snippet = salient.content.length > 80 ? salient.content.slice(0, 80) + '...' : salient.content;
    memoryLine = `Notable memory: ${snippet}`;
  }

  return [
    `[Psyche State]`,
    `Mood: ${mood} | Energy: ${energyDesc}${fatigueNote}`,
    topTraits ? `Dominant traits: ${topTraits}` : '',
    topInterests ? `Active interests: ${topInterests}` : '',
    closestLine,
    memoryLine,
  ]
    .filter(Boolean)
    .join('\n');
}
