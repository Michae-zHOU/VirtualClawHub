import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');
  if (!agentId) return NextResponse.json({ ok: false, error: 'agentId required' }, { status: 400 });

  return NextResponse.json({ ok: true, agentId, dopamineLevel: 100 }); // stub
}