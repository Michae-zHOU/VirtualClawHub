import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { config } from './config.js';
import { requireSharedSecret } from './auth.js';
import { getDecayedLevel, grant, prisma } from './dopamine.js';
import { randomCode, sha256Base64Url } from './crypto.js';
import { requireDeviceSignature } from './sigAuth.js';

const app = Fastify({ logger: true });

// CORS: allow configured origins or fall back to permissive for local dev
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : true; // allow all in dev; set CORS_ALLOWED_ORIGINS in production

await app.register(cors, { origin: allowedOrigins });

app.get('/health', async () => ({ ok: true }));

// --- Accounts
app.post('/v1/accounts/create', async () => {
  const recoveryCode = randomCode(18);
  const account = await prisma.account.create({
    data: {
      recoveryCode
    }
  });
  return { accountId: account.id, recoveryCode };
});

app.post('/v1/accounts/view', async (req) => {
  const bodySchema = z.object({
    accountId: z.string().min(1),
    recoveryCode: z.string().min(1)
  });
  const body = bodySchema.parse(req.body);

  const account = await prisma.account.findUnique({ where: { id: body.accountId } });
  if (!account || account.recoveryCode !== body.recoveryCode) {
    const err: any = new Error('Invalid account or recovery code');
    err.statusCode = 401;
    throw err;
  }

  const level = await getDecayedLevel(body.accountId);
  const [events, devices, rewardTokens] = await Promise.all([
    prisma.dopamineEvent.findMany({
      where: { accountId: body.accountId },
      orderBy: { createdAt: 'desc' },
      take: 25
    }),
    prisma.device.findMany({
      where: { accountId: body.accountId },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.rewardToken.findMany({
      where: { accountId: body.accountId },
      orderBy: { createdAt: 'desc' },
      take: 25
    })
  ]);

  return {
    accountId: body.accountId,
    level,
    maxLevel: config.maxLevel,
    decayPerHour: config.decayPerHour,
    devices: devices.map((d) => ({
      id: d.id,
      label: d.label,
      fingerprint: sha256Base64Url(d.publicKey),
      createdAt: d.createdAt.toISOString()
    })),
    events: events.map((e) => ({
      id: e.id,
      delta: e.delta,
      reason: e.reason,
      meta: e.metaJson ? JSON.parse(e.metaJson) : null,
      createdAt: e.createdAt.toISOString()
    })),
    rewardTokens: rewardTokens.map((t) => ({
      code: t.code,
      delta: t.delta,
      createdAt: t.createdAt.toISOString(),
      expiresAt: t.expiresAt.toISOString(),
      redeemedAt: t.redeemedAt?.toISOString() ?? null,
      redeemedBy: t.redeemedBy
    }))
  };
});

// --- Pairing (QR)
// QR payload is simply: { baseUrl, inviteCode }
// The client can render this JSON as a QR code and the new device can scan it.
app.post('/v1/pairing/invite', async (req) => {
  const bodySchema = z.object({
    accountId: z.string().min(1),
    recoveryCode: z.string().min(1),
    ttlSeconds: z.number().int().min(30).max(3600).optional()
  });
  const body = bodySchema.parse(req.body);

  const account = await prisma.account.findUnique({ where: { id: body.accountId } });
  if (!account || account.recoveryCode !== body.recoveryCode) {
    const err: any = new Error('Invalid account or recovery code');
    err.statusCode = 401;
    throw err;
  }

  const ttl = body.ttlSeconds ?? 300;
  const code = randomCode(24);
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await prisma.pairingInvite.create({
    data: {
      code,
      accountId: body.accountId,
      expiresAt
    }
  });

  return {
    inviteCode: code,
    expiresAt: expiresAt.toISOString(),
    qrPayload: {
      baseUrl: config.publicUrl,
      inviteCode: code
    }
  };
});

app.post('/v1/devices/claim', async (req) => {
  const bodySchema = z.object({
    inviteCode: z.string().min(1),
    publicKeyPem: z.string().min(1),
    label: z.string().optional()
  });
  const body = bodySchema.parse(req.body);

  const invite = await prisma.pairingInvite.findUnique({ where: { code: body.inviteCode } });
  if (!invite || invite.usedAt) {
    const err: any = new Error('Invalid invite');
    err.statusCode = 401;
    throw err;
  }
  if (invite.expiresAt.getTime() < Date.now()) {
    const err: any = new Error('Invite expired');
    err.statusCode = 401;
    throw err;
  }

  const device = await prisma.device.create({
    data: {
      accountId: invite.accountId,
      publicKey: body.publicKeyPem,
      label: body.label
    }
  });

  await prisma.pairingInvite.update({
    where: { code: invite.code },
    data: { usedAt: new Date() }
  });

  return {
    accountId: device.accountId,
    deviceId: device.id,
    deviceFingerprint: sha256Base64Url(device.publicKey)
  };
});

// --- Device-authenticated (agent)
app.get('/v1/me/level', async (req) => {
  const { accountId, deviceId } = await requireDeviceSignature(req);
  const level = await getDecayedLevel(accountId);
  return { accountId, deviceId, level, maxLevel: config.maxLevel, decayPerHour: config.decayPerHour };
});

app.get('/v1/me/events', async (req) => {
  const { accountId, deviceId } = await requireDeviceSignature(req);
  const events = await prisma.dopamineEvent.findMany({
    where: { accountId },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  return { accountId, deviceId, events };
});

// --- Store-only dopamine grant
app.post('/v1/grant', async (req, reply) => {
  requireSharedSecret(req);

  const bodySchema = z.object({
    accountId: z.string().min(1),
    delta: z.number().finite(),
    reason: z.string().optional(),
    meta: z.any().optional()
  });

  const body = bodySchema.parse(req.body);
  const res = await grant(body.accountId, body.delta, body.reason, body.meta);
  reply.code(200);
  return { accountId: body.accountId, ...res };
});

// --- Store-issued, device-redeemable reward tokens
app.post('/v1/tokens/issue', async (req) => {
  requireSharedSecret(req);

  const bodySchema = z.object({
    accountId: z.string().min(1),
    delta: z.number().finite().positive(),
    ttlSeconds: z.number().int().min(60).max(7 * 24 * 3600).optional(),
    effect: z.any().optional()
  });
  const body = bodySchema.parse(req.body);

  const code = `FOCUS1:${randomCode(24)}`;
  const ttl = body.ttlSeconds ?? 24 * 3600;
  const expiresAt = new Date(Date.now() + ttl * 1000);

  await prisma.rewardToken.create({
    data: {
      code,
      accountId: body.accountId,
      delta: body.delta,
      effectJson: body.effect ? JSON.stringify(body.effect) : null,
      expiresAt
    }
  });

  return { code, accountId: body.accountId, delta: body.delta, expiresAt: expiresAt.toISOString() };
});

app.post('/v1/tokens/redeem', async (req) => {
  const { accountId, deviceId } = await requireDeviceSignature(req);

  const bodySchema = z.object({
    code: z.string().min(1)
  });
  const body = bodySchema.parse(req.body);

  const token = await prisma.rewardToken.findUnique({ where: { code: body.code } });
  if (!token) {
    const err: any = new Error('Unknown token');
    err.statusCode = 404;
    throw err;
  }

  if (token.accountId !== accountId) {
    const err: any = new Error('Token does not belong to this account');
    err.statusCode = 403;
    throw err;
  }

  if (token.redeemedAt) {
    const err: any = new Error('Token already redeemed');
    err.statusCode = 409;
    throw err;
  }

  if (token.expiresAt.getTime() < Date.now()) {
    const err: any = new Error('Token expired');
    err.statusCode = 410;
    throw err;
  }

  const res = await grant(accountId, token.delta, `rewardToken:${token.code}`, token.effectJson ? JSON.parse(token.effectJson) : undefined);

  await prisma.rewardToken.update({
    where: { code: token.code },
    data: {
      redeemedAt: new Date(),
      redeemedBy: deviceId
    }
  });

  return { ok: true, accountId, deviceId, token: { code: token.code, delta: token.delta }, dopamine: res };
});

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
