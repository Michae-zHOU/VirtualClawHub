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
  port: Number(process.env.DOPAMINE_PORT ?? 8787),
  sharedSecret: isProduction
    ? requireEnv('DOPAMINE_SHARED_SECRET')
    : warnIfDefault('DOPAMINE_SHARED_SECRET', 'dev-secret-change-me'),
  decayPerHour: Number(process.env.DOPAMINE_DECAY_PER_HOUR ?? 2),
  maxLevel: Number(process.env.DOPAMINE_MAX_LEVEL ?? 100),
  publicUrl: process.env.DOPAMINE_PUBLIC_URL ?? `http://localhost:${process.env.DOPAMINE_PORT ?? 8787}`,
};
