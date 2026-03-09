import 'dotenv/config';

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

function warnIfDefault(key: string, devDefault: string): string {
  const val = process.env[key];
  if (!val || val === devDefault) {
    console.warn(`[security] ${key} is not set or uses dev default — do not deploy without a real secret`);
    return val ?? devDefault;
  }
  return val;
}

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  port: parseInt(process.env.PORT ?? process.env.PSYCHE_PORT ?? '8788', 10),
  sharedSecret: isProduction
    ? requireEnv('PSYCHE_SHARED_SECRET')
    : warnIfDefault('PSYCHE_SHARED_SECRET', 'change-me'),
  dopamineUrl: process.env.DOPAMINE_URL ?? '',
  dopamineSecret: isProduction
    ? requireEnv('DOPAMINE_SHARED_SECRET')
    : (process.env.DOPAMINE_SHARED_SECRET ?? ''),

  // Memory consolidation: only consolidate sessions with dopamine delta above this
  consolidationThreshold: 5.0,

  // Ebbinghaus decay: memory strength multiplier per hour without recall
  memoryDecayPerHour: 0.005,

  // Trait change rate per signal event
  traitLearningRate: 0.03,

  // Biological: fatigue accumulation per "heavy" session (cognitiveLoad > 0.7)
  fatiguePerHeavySession: 0.1,
  // Hours of idle time to fully reset fatigue
  fatigueRestHours: 8,

  // Relationship depth increment per interaction
  depthPerInteraction: 2.0,
};
