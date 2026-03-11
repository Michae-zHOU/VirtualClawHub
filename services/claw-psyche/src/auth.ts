import type { FastifyRequest } from 'fastify';
import { config } from './config.js';

export function requireSharedSecret(req: FastifyRequest): void {
  const auth = req.headers['x-shared-secret'] as string | undefined;
  if (!config.sharedSecret || auth !== config.sharedSecret) {
    const err: any = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
}
