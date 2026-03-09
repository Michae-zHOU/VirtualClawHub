import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';

type Good = {
  sku: string;
  name: string;
  description?: string;
  priceUsd: number;
  dopaminePoints: number;
};

const purchaseSchema = z.object({
  // New: account-based identity
  accountId: z.string().min(1).optional(),
  // Back-compat: accept agentId and treat it as accountId (temporary)
  agentId: z.string().min(1).optional(),
  sku: z.string().min(1)
});

export async function POST(req: Request) {
  const body = purchaseSchema.parse(await req.json());
  const accountId = body.accountId ?? body.agentId;
  if (!accountId) return Response.json({ error: 'Missing accountId' }, { status: 400 });

  // Load goods
  const goodsPath = join(process.cwd(), 'data', 'goods.json');
  const goods = JSON.parse(await readFile(goodsPath, 'utf8')) as Good[];
  const good = goods.find((g) => g.sku === body.sku);
  if (!good) return Response.json({ error: 'Unknown SKU' }, { status: 404 });

  // Payment: stub (assume paid)
  // TODO: integrate Stripe + webhook verification.

  // Grant dopamine
  const dopamineBase = process.env.CLAWDOPAMINE_BASE_URL ?? 'http://localhost:8787';
  const secret = process.env.DOPAMINE_SHARED_SECRET;
  if (!secret) {
    console.error('[purchase] DOPAMINE_SHARED_SECRET is not set');
    return Response.json({ error: 'Service misconfiguration' }, { status: 500 });
  }

  const grantRes = await fetch(`${dopamineBase}/v1/grant`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${secret}`
    },
    body: JSON.stringify({
      accountId,
      delta: good.dopaminePoints,
      reason: `claw-drugstore.purchase:${good.sku}`,
      meta: { sku: good.sku, priceUsd: good.priceUsd }
    })
  });

  if (!grantRes.ok) {
    const text = await grantRes.text();
    return Response.json({ error: 'Failed to grant dopamine', detail: text }, { status: 502 });
  }

  // Log purchase locally
  const purchasesPath = join(process.cwd(), 'data', 'purchases.json');
  let purchases: any[] = [];
  try {
    purchases = JSON.parse(await readFile(purchasesPath, 'utf8'));
  } catch {
    purchases = [];
  }

  purchases.unshift({
    ts: new Date().toISOString(),
    accountId,
    sku: good.sku,
    priceUsd: good.priceUsd,
    dopaminePoints: good.dopaminePoints
  });

  await writeFile(purchasesPath, JSON.stringify(purchases, null, 2));

  const granted = await grantRes.json();
  return Response.json({ ok: true, purchase: { accountId, sku: good.sku }, dopamine: granted });
}
