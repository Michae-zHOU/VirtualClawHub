import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { config } from './config.js';
import { requireSharedSecret } from './auth.js';
import { getState } from './state.js';
import { ingestSignal } from './signals.js';
import { writeMemory, recallMemories, consolidateSession, pruneWeakMemories } from './memory.js';
import { getBiologicalState, increaseLoad, recordRest } from './biological.js';
import { prisma } from './db.js';

const app = Fastify({ logger: true });

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : true;

await app.register(cors, { origin: allowedOrigins });

// ─── Health ────────────────────────────────────────────────────────────────────

app.get('/health', async () => ({ ok: true, service: 'claw-psyche' }));

// ─── Agents ────────────────────────────────────────────────────────────────────

app.post('/v1/agents/create', async (req) => {
  requireSharedSecret(req);
  const body = z.object({ name: z.string().optional() }).parse(req.body);
  const agent = await prisma.agent.create({ data: { name: body.name } });
  return { agentId: agent.id, name: agent.name, createdAt: agent.createdAt };
});

// ─── State (full snapshot) ─────────────────────────────────────────────────────

app.get('/v1/agents/:agentId/state', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  return getState(agentId);
});

// ─── Signals ───────────────────────────────────────────────────────────────────

const SignalSchema = z.object({
  type: z.string().min(1),
  value: z.number().min(-1).max(1),
  source: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

app.post('/v1/agents/:agentId/signal', async (req, reply) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const body = SignalSchema.parse(req.body);
  await ingestSignal(agentId, body.type, body.value, body.source, body.meta as Record<string, unknown>);
  reply.code(200);
  return { ok: true };
});

// Batch signals
app.post('/v1/agents/:agentId/signals/batch', async (req, reply) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const ItemSchema = z.object({
    type: z.string().min(1),
    value: z.number().min(-1).max(1),
    source: z.string().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
  });
  const body = z.object({ signals: z.array(ItemSchema) }).parse(req.body);
  for (const s of body.signals) {
    await ingestSignal(agentId, s.type, s.value, s.source, s.meta as Record<string, unknown>);
  }
  reply.code(200);
  return { ok: true, count: body.signals.length };
});

// ─── Memory ────────────────────────────────────────────────────────────────────

app.post('/v1/agents/:agentId/memories', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const body = z.object({
    content: z.string().min(1),
    type: z.enum(['episodic', 'semantic', 'procedural', 'relational']),
    tags: z.array(z.string()).optional(),
    entities: z.array(z.string()).optional(),
    valence: z.number().min(-1).max(1).optional(),
    sourceSessionId: z.string().optional(),
  }).parse(req.body);
  const memory = await writeMemory(agentId, body);
  return { id: memory.id, agentId, type: memory.type, createdAt: memory.createdAt };
});

app.get('/v1/agents/:agentId/memories', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const query = z.object({
    type: z.enum(['episodic', 'semantic', 'procedural', 'relational']).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    minStrength: z.coerce.number().min(0).max(1).optional(),
  }).parse(req.query);
  const memories = await recallMemories(agentId, query);
  return { agentId, memories };
});

// Post-session consolidation
app.post('/v1/agents/:agentId/sessions/:sessionId/consolidate', async (req) => {
  requireSharedSecret(req);
  const { agentId, sessionId } = req.params as { agentId: string; sessionId: string };
  const body = z.object({
    dopamineDelta: z.number(),
    moments: z.array(z.object({
      content: z.string(),
      type: z.enum(['episodic', 'semantic', 'procedural', 'relational']),
      tags: z.array(z.string()).optional(),
      entities: z.array(z.string()).optional(),
      valence: z.number().optional(),
    })),
  }).parse(req.body);
  const result = await consolidateSession(agentId, sessionId, body.dopamineDelta, body.moments);
  return { agentId, sessionId, ...result };
});

// Prune forgotten memories
app.post('/v1/agents/:agentId/memories/prune', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const body = z.object({ threshold: z.number().min(0).max(1).optional() }).parse(req.body);
  const pruned = await pruneWeakMemories(agentId, body.threshold);
  return { agentId, pruned };
});

// ─── Biological State ──────────────────────────────────────────────────────────

app.get('/v1/agents/:agentId/biological', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  return getBiologicalState(agentId);
});

app.post('/v1/agents/:agentId/biological/load', async (req, reply) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const body = z.object({ delta: z.number().min(0).max(1) }).parse(req.body);
  await increaseLoad(agentId, body.delta);
  reply.code(200);
  return { ok: true };
});

app.post('/v1/agents/:agentId/biological/rest', async (req, reply) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  await recordRest(agentId);
  reply.code(200);
  return { ok: true };
});

// ─── Interests ────────────────────────────────────────────────────────────────

app.get('/v1/agents/:agentId/interests', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const interests = await prisma.interest.findMany({
    where: { agentId },
    orderBy: { strength: 'desc' },
  });
  return { agentId, interests };
});

// ─── State prompt ─────────────────────────────────────────────────────────────

app.get('/v1/agents/:agentId/state/prompt', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const state = await getState(agentId);
  return { agentId, prompt: state.contextBlock };
});

// ─── Signal events ────────────────────────────────────────────────────────────

app.get('/v1/agents/:agentId/signals', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const query = z.object({
    processed: z.enum(['true', 'false']).optional(),
  }).parse(req.query);
  const where: Record<string, unknown> = { agentId };
  if (query.processed !== undefined) {
    where.processed = query.processed === 'true';
  }
  const signals = await prisma.signalEvent.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return { agentId, signals };
});

// ─── Relationships ─────────────────────────────────────────────────────────────

app.post('/v1/agents/:agentId/relationships/touch', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const body = z.object({
    personId: z.string(),
    personName: z.string().optional(),
    valenceDelta: z.number().min(-1).max(1).optional(),
    note: z.string().optional(),
  }).parse(req.body);

  const rel = await prisma.relationship.upsert({
    where: { agentId_personId: { agentId, personId: body.personId } },
    create: {
      agentId,
      personId: body.personId,
      personName: body.personName,
      notesJson: body.note ? JSON.stringify([body.note]) : '[]',
    },
    update: {},
  });

  const notes: string[] = JSON.parse(rel.notesJson);
  if (body.note) notes.push(body.note);

  await prisma.relationship.update({
    where: { id: rel.id },
    data: {
      depth: Math.min(100, rel.depth + config.depthPerInteraction),
      valence: Math.max(-1, Math.min(1, rel.valence + (body.valenceDelta ?? 0) * 0.1)),
      interactionCount: { increment: 1 },
      lastInteractionAt: new Date(),
      notesJson: JSON.stringify(notes.slice(-20)), // keep last 20 notes
    },
  });

  return { ok: true };
});

app.get('/v1/agents/:agentId/relationships', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const rels = await prisma.relationship.findMany({ where: { agentId }, orderBy: { depth: 'desc' } });
  return {
    agentId,
    relationships: rels.map((r) => ({
      ...r,
      notes: JSON.parse(r.notesJson),
    })),
  };
});

// ─── Traits ────────────────────────────────────────────────────────────────────

app.get('/v1/agents/:agentId/traits', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const traits = await prisma.personalityTrait.findMany({
    where: { agentId },
    orderBy: { strength: 'desc' },
    include: { history: { orderBy: { createdAt: 'desc' }, take: 5 } },
  });
  return { agentId, traits };
});

// ─── Session Lifecycle ─────────────────────────────────────────────────────────

app.post('/v1/agents/:agentId/sessions/start', async (req) => {
  requireSharedSecret(req);
  const { agentId } = req.params as { agentId: string };
  const body = z.object({ sessionId: z.string() }).parse(req.body);
  await prisma.sessionLog.upsert({
    where: { sessionId: body.sessionId },
    create: { agentId, sessionId: body.sessionId },
    update: {},
  });
  const state = await getState(agentId);
  return { ok: true, sessionId: body.sessionId, state };
});

app.post('/v1/agents/:agentId/sessions/:sessionId/end', async (req) => {
  requireSharedSecret(req);
  const { agentId, sessionId } = req.params as { agentId: string; sessionId: string };
  const body = z.object({
    dopamineDelta: z.number().optional(),
    valenceDelta: z.number().optional(),
    signalCount: z.number().int().optional(),
    summary: z.record(z.string(), z.unknown()).optional(),
  }).parse(req.body);

  await prisma.sessionLog.updateMany({
    where: { agentId, sessionId },
    data: {
      endedAt: new Date(),
      dopamineDelta: body.dopamineDelta ?? 0,
      valenceDelta: body.valenceDelta ?? 0,
      signalCount: body.signalCount ?? 0,
      summaryJson: body.summary ? JSON.stringify(body.summary) : null,
    },
  });

  // Record rest if session ended (cognitive load reduction)
  await recordRest(agentId);

  return { ok: true };
});

// ─── Boot ──────────────────────────────────────────────────────────────────────

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
