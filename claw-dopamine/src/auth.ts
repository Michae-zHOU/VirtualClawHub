import type { FastifyRequest } from 'fastify';
import { config } from './config.js';

export function requireSharedSecret(req: FastifyRequest) {
  const header = req.headers['authorization'];
  const token = typeof header === 'string' ? header.replace(/^Bearer\s+/i, '') : '';
  if (!token || token !== config.sharedSecret) {
    const err: any = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
}
