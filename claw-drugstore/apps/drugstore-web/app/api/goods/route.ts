import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET() {
  const goodsPath = join(process.cwd(), 'data', 'goods.json');
  const raw = await readFile(goodsPath, 'utf8');
  return Response.json(JSON.parse(raw));
}
