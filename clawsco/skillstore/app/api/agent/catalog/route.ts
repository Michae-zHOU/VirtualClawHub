import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  const catalog = goods.map((g: any) => ({
    sku: g.sku,
    name: g.name,
    price: g.price,
    dopaminePoints: g.dopaminePoints
  }));
  return NextResponse.json({ catalog });
}