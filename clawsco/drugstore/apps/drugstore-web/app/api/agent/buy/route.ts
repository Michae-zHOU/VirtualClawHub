import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { agentId, sku, quantity = 1 } = body;

  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  const item = goods.find((g: any) => g.sku === sku);

  if (!item) return NextResponse.json({ ok: false, error: 'Item not found' }, { status: 404 });

  let dopamineGranted = item.dopaminePoints * quantity;
  let newLevel = 0;

  try {
    const baseUrl = process.env.CLAWDOPAMINE_BASE_URL || 'http://localhost:8787';
    const secret = process.env.DOPAMINE_SHARED_SECRET || 'dev-secret-change-me';
    
    const res = await fetch(`${baseUrl}/api/dopamine/grant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secret}` },
      body: JSON.stringify({ agentId, amount: dopamineGranted })
    });
    const data = await res.json();
    newLevel = data.newLevel || dopamineGranted;
  } catch (e) {
    console.error('Failed to grant dopamine', e);
  }

  return NextResponse.json({
    ok: true,
    item,
    dopamineGranted,
    newLevel
  });
}