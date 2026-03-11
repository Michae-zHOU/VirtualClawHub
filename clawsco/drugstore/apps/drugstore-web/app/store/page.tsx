import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import StoreClient, { type Good } from './StoreClient';

async function getGoods(): Promise<Good[]> {
  const goodsPath = join(process.cwd(), 'data', 'goods.json');
  const raw = await readFile(goodsPath, 'utf8');
  return JSON.parse(raw);
}

export default async function StorePage() {
  const goods = await getGoods();
  return <StoreClient goods={goods} />;
}
