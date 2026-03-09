import crypto from 'node:crypto';
import { prisma } from './dopamine.js';

// Signature-based auth (Ed25519)
//
// Client sends headers:
// - x-device-id: <device id>
// - x-ts: <unix ms>
// - x-nonce: <random>
// - x-body-sha256: hex sha256 of raw request body (required for non-GET)
// - x-sig: base64 signature over canonical string
//
// canonical = `${method}\n${path}\n${ts}\n${nonce}\n${bodySha256}`

function getHeader(req: any, name: string) {
  const v = req.headers[name];
  return typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined;
}

function base64ToBuf(s: string) {
  return Buffer.from(s, 'base64');
}

export async function requireDeviceSignature(req: any) {
  const deviceId = getHeader(req, 'x-device-id');
  const tsStr = getHeader(req, 'x-ts');
  const nonce = getHeader(req, 'x-nonce');
  const bodySha256 = getHeader(req, 'x-body-sha256') ?? '';
  const sigB64 = getHeader(req, 'x-sig');

  if (!deviceId || !tsStr || !nonce || !sigB64) {
    const err: any = new Error('Missing signature headers');
    err.statusCode = 401;
    throw err;
  }

  if (req.method !== 'GET' && !bodySha256) {
    const err: any = new Error('Missing x-body-sha256');
    err.statusCode = 401;
    throw err;
  }

  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) {
    const err: any = new Error('Invalid timestamp');
    err.statusCode = 401;
    throw err;
  }

  // 60s clock skew window
  const now = Date.now();
  if (Math.abs(now - ts) > 60_000) {
    const err: any = new Error('Timestamp outside allowed window');
    err.statusCode = 401;
    throw err;
  }

  const device = await prisma.device.findUnique({ where: { id: deviceId } });
  if (!device) {
    const err: any = new Error('Unknown device');
    err.statusCode = 401;
    throw err;
  }

  const canonical = `${req.method}\n${req.url}\n${tsStr}\n${nonce}\n${bodySha256}`;

  const publicKeyPem = device.publicKey;
  const ok = crypto.verify(null, Buffer.from(canonical), publicKeyPem, base64ToBuf(sigB64));

  if (!ok) {
    const err: any = new Error('Bad signature');
    err.statusCode = 401;
    throw err;
  }

  return { deviceId: device.id, accountId: device.accountId };
}
