import { PrismaClient } from '@prisma/client';
import { config } from './config.js';

export const prisma = new PrismaClient();

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function getDecayedLevel(accountId: string) {
  // Ensure account exists
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) {
    const err: any = new Error('Unknown account');
    err.statusCode = 404;
    throw err;
  }

  const row = await prisma.dopamineState.upsert({
    where: { accountId },
    create: { accountId, level: 0 },
    update: {}
  });

  const now = Date.now();
  const updatedAt = row.updatedAt.getTime();
  const hours = Math.max(0, (now - updatedAt) / 36e5);
  const decayed = row.level - hours * config.decayPerHour;
  return clamp(decayed, 0, config.maxLevel);
}

export async function setLevel(accountId: string, level: number) {
  const next = clamp(level, 0, config.maxLevel);
  await prisma.dopamineState.upsert({
    where: { accountId },
    create: { accountId, level: next },
    update: { level: next }
  });
  return next;
}

export async function grant(accountId: string, delta: number, reason?: string, meta?: unknown) {
  return prisma.$transaction(async (tx) => {
    // Ensure account exists
    const account = await tx.account.findUnique({ where: { id: accountId } });
    if (!account) {
      const err: any = new Error('Unknown account');
      err.statusCode = 404;
      throw err;
    }

    // Read or create dopamine state
    const row = await tx.dopamineState.upsert({
      where: { accountId },
      create: { accountId, level: 0 },
      update: {}
    });

    // Compute decayed level
    const now = Date.now();
    const updatedAt = row.updatedAt.getTime();
    const hours = Math.max(0, (now - updatedAt) / 36e5);
    const current = clamp(row.level - hours * config.decayPerHour, 0, config.maxLevel);

    // Write new level
    const next = clamp(current + delta, 0, config.maxLevel);
    await tx.dopamineState.update({
      where: { accountId },
      data: { level: next }
    });

    // Create event
    await tx.dopamineEvent.create({
      data: {
        accountId,
        delta,
        reason,
        metaJson: meta ? JSON.stringify(meta) : null
      }
    });

    return { before: current, after: next };
  });
}
