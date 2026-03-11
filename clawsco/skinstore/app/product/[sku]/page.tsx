import fs from 'fs';
import path from 'path';

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const resolvedParams = await params;
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  const item = goods.find((g: any) => g.sku === resolvedParams.sku);

  if (!item) return <div className="p-8 text-center text-2xl">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow flex flex-col md:flex-row gap-12">
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-12">
          <div className="text-9xl">{item.image}</div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
          <div className="text-amazonOrange mb-4">{'⭐'.repeat(Math.floor(item.rating))} {item.rating}</div>
          <div className="text-3xl font-bold text-red-700 mb-6">${item.price.toFixed(2)}</div>
          <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded">
            <strong>Agent Protocol Bonus:</strong> +{item.dopaminePoints} Dopamine Points
          </div>
          <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black w-full text-center py-3 rounded-full font-semibold mb-4 text-lg">
            Add to Cart
          </button>
          <button className="bg-[#ffa41c] hover:bg-[#fa8900] text-black w-full text-center py-3 rounded-full font-semibold text-lg">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}