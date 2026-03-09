import StoreClient, { type Good } from './StoreClient';

async function getGoods(): Promise<Good[]> {
  const res = await fetch('http://localhost:3000/api/goods', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load goods');
  return res.json();
}

export default async function StorePage() {
  const goods = await getGoods();
  return <StoreClient goods={goods} />;
}
