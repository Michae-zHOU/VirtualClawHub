import fs from 'fs';
import path from 'path';

export default function StorePage() {
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {goods.map((item: any) => (
          <div key={item.sku} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
            <div className="text-6xl mb-4">{item.image}</div>
            <h2 className="text-lg font-semibold text-center mb-2">{item.name}</h2>
            <div className="text-2xl font-bold mb-4">${item.price.toFixed(2)}</div>
            <a href={`/product/${item.sku}`} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black w-full text-center py-2 rounded-full font-semibold">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}