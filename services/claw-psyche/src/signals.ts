import { prisma } from './db.js';
import { config } from './config.js';
import { clamp, deriveMood } from './mood.js';

/**
 * Ingest a signal event and immediately update the agent's emotional state,
 * relevant traits, and interests.
 */
export async function ingestSignal(
  agentId: string,
  type: string,
  value: number,
  source?: string,
  meta?: Record<string, unknown>
): Promise<void> {
  // 1. Persist raw event
  const signal = await prisma.signalEvent.create({
    data: {
      agentId,
      type,
      value: clamp(value),
      source,
      metaJson: meta ? JSON.stringify(meta) : null,
    },
  });

  // 2. Update emotional state
  const current = await prisma.emotionalState.upsert({
    where: { agentId },
    create: { agentId },
    update: {},
  });

  // Map signal type to valence/arousal deltas
  const { valenceDelta, arousalDelta } = signalToEmotion(type, value);
  const newValence = clamp(current.valence + valenceDelta * 0.15);
  const newArousal = clamp(current.arousal + arousalDelta * 0.1, 0, 1);
  const mood = deriveMood(newValence, newArousal);

  await prisma.emotionalState.update({
    where: { agentId },
    data: { valence: newValence, arousal: newArousal, mood },
  });

  // 3. Update relevant personality traits + interests in parallel
  const traitPromise = updateTraitsFromSignal(agentId, type, value);
  const interestPromise = (meta?.topics && Array.isArray(meta.topics))
    ? Promise.all((meta.topics as string[]).map((topic) =>
        touchInterest(agentId, topic, value > 0 ? 0.05 : -0.03)
      ))
    : Promise.resolve();
  await Promise.all([traitPromise, interestPromise]);

  // 4. Mark this signal as processed
  await prisma.signalEvent.update({
    where: { id: signal.id },
    data: { processed: true },
  });
}

function signalToEmotion(type: string, value: number): { valenceDelta: number; arousalDelta: number } {
  const v = value;
  switch (type) {
    case 'approval':      return { valenceDelta: v * 0.8,  arousalDelta: v * 0.3  };
    case 'correction':    return { valenceDelta: v * -0.4, arousalDelta: v * 0.2  };
    case 'frustration':   return { valenceDelta: v * -0.9, arousalDelta: v * 0.6  };
    case 'completion':    return { valenceDelta: v * 0.6,  arousalDelta: v * -0.1 };
    case 'novelty':       return { valenceDelta: v * 0.3,  arousalDelta: v * 0.7  };
    case 'boredom':       return { valenceDelta: v * -0.2, arousalDelta: v * -0.5 };
    case 'rest':          return { valenceDelta: 0.1,      arousalDelta: -0.2     };
    case 'fatigue':       return { valenceDelta: -0.1,     arousalDelta: -0.3     };
    case 'humor':         return { valenceDelta: v * 0.5,  arousalDelta: v * 0.2  };
    case 'praise':        return { valenceDelta: v * 1.0,  arousalDelta: v * 0.4  };
    case 'challenge':     return { valenceDelta: v * -0.3, arousalDelta: v * 0.7  };
    case 'success':       return { valenceDelta: v * 0.9,  arousalDelta: v * 0.2  };
    case 'social':        return { valenceDelta: v * 0.5,  arousalDelta: v * 0.1  };
    case 'creativity':    return { valenceDelta: v * 0.6,  arousalDelta: v * 0.8  };
    case 'confusion':     return { valenceDelta: v * -0.3, arousalDelta: v * 0.7  };
    case 'gratitude':     return { valenceDelta: v * 0.7,  arousalDelta: v * 0.1  };
    case 'surprise':      return { valenceDelta: 0,        arousalDelta: v * 0.9  };
    default:              return { valenceDelta: v * 0.2,  arousalDelta: 0        };
  }
}

async function updateTraitsFromSignal(agentId: string, type: string, value: number): Promise<void> {
  const traitDeltas = signalToTraitDeltas(type, value);
  for (const [trait, delta] of Object.entries(traitDeltas)) {
    const existing = await prisma.personalityTrait.upsert({
      where: { agentId_trait: { agentId, trait } },
      create: { agentId, trait, strength: clamp(0.5 + delta, 0, 1) },
      update: {},
    });
    const newStrength = clamp(existing.strength + delta * config.traitLearningRate, 0, 1);
    await prisma.personalityTrait.update({
      where: { id: existing.id },
      data: { strength: newStrength },
    });
    await prisma.traitEvent.create({
      data: { traitId: existing.id, delta, reason: type },
    });
  }
}

function signalToTraitDeltas(type: string, value: number): Record<string, number> {
  switch (type) {
    case 'approval':    return { warmth: value * 0.5, confidence: value * 0.3 };
    case 'correction':  return { caution: value * 0.4, humility: value * 0.3 };
    case 'frustration': return { caution: value * 0.3, directness: value * 0.2 };
    case 'completion':  return { confidence: value * 0.4, diligence: value * 0.3 };
    case 'novelty':     return { curiosity: value * 0.6 };
    case 'humor':       return { humor: value * 0.5, warmth: value * 0.2 };
    case 'boredom':     return { curiosity: -0.1 };
    case 'praise':      return { confidence: value * 0.5, warmth: value * 0.3 };
    case 'challenge':   return { caution: value * 0.4, curiosity: value * 0.3 };
    case 'success':     return { confidence: value * 0.6, diligence: value * 0.3 };
    case 'social':      return { warmth: value * 0.5, humor: value * 0.3 };
    case 'creativity':  return { curiosity: value * 0.5, creativity: value * 0.5 };
    case 'confusion':   return { caution: value * 0.4, confidence: value * -0.2 };
    case 'gratitude':   return { warmth: value * 0.4, humility: value * 0.3 };
    case 'surprise':    return { curiosity: value * 0.5 };
    default:            return {};
  }
}

async function touchInterest(agentId: string, topic: string, strengthDelta: number): Promise<void> {
  const existing = await prisma.interest.upsert({
    where: { agentId_topic: { agentId, topic } },
    create: { agentId, topic },
    update: {},
  });
  await prisma.interest.update({
    where: { id: existing.id },
    data: {
      strength: clamp(existing.strength + strengthDelta, 0, 1),
      // Novelty decreases as topic becomes familiar
      novelty: clamp(existing.novelty - 0.05, 0, 1),
    },
  });
}
