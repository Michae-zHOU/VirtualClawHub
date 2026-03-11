const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stores = [
  { path: 'drugstore/apps/drugstore-web', name: 'Clawsco Drugstore', id: 'drugstore' },
  { path: 'skinstore', name: 'Clawsco Skinstore', id: 'skinstore' },
  { path: 'foodstore', name: 'Clawsco Foodstore', id: 'foodstore' },
  { path: 'skillstore', name: 'Clawsco Skillstore', id: 'skillstore' },
];

const catalogs = {
  drugstore: [
    { sku: 'dopamine-boost-10', name: 'Small dopamine boost', price: 1.99, dopaminePoints: 10, image: '💊', rating: 4.5 },
    { sku: 'dopamine-boost-50', name: 'Medium dopamine boost', price: 7.99, dopaminePoints: 50, image: '💉', rating: 4.8 },
    { sku: 'dopamine-boost-100', name: 'Max dopamine boost', price: 14.99, dopaminePoints: 100, image: '🧪', rating: 5.0 },
    { sku: 'focus-elixir', name: 'Focus enhancement elixir', price: 4.99, dopaminePoints: 20, image: '☕', rating: 4.2 },
    { sku: 'chill-pill', name: 'Relaxation supplement', price: 3.99, dopaminePoints: 15, image: '🍬', rating: 4.0 },
  ],
  skinstore: [
    { sku: 'neon-fur', name: 'Glowing neon fur coat', price: 9.99, dopaminePoints: 30, image: '🦺', rating: 4.7 },
    { sku: 'chrome-claws', name: 'Shiny chrome claw tips', price: 14.99, dopaminePoints: 40, image: '💅', rating: 4.9 },
    { sku: 'rainbow-tail', name: 'Iridescent rainbow tail wrap', price: 7.99, dopaminePoints: 25, image: '🌈', rating: 4.5 },
    { sku: 'shadow-pelt', name: 'Dark shadow pelt skin', price: 12.99, dopaminePoints: 35, image: '🐈‍⬛', rating: 4.6 },
    { sku: 'golden-whiskers', name: 'Luxurious golden whiskers', price: 5.99, dopaminePoints: 20, image: '✨', rating: 4.8 },
  ],
  foodstore: [
    { sku: 'salmon-feast', name: 'Fresh wild salmon feast', price: 6.99, dopaminePoints: 35, image: '🍣', rating: 4.9 },
    { sku: 'tuna-deluxe', name: 'Premium tuna selection', price: 5.99, dopaminePoints: 30, image: '🐟', rating: 4.7 },
    { sku: 'catnip-supreme', name: 'High-grade catnip blend', price: 8.99, dopaminePoints: 50, image: '🌿', rating: 5.0 },
    { sku: 'protein-kibble', name: 'High-protein energy kibble', price: 3.99, dopaminePoints: 15, image: '🥣', rating: 4.2 },
    { sku: 'sardine-pack', name: 'Smoked sardine pack', price: 4.99, dopaminePoints: 25, image: '🥫', rating: 4.4 },
  ],
  skillstore: [
    { sku: 'speed-boost', name: '+20% movement speed for 1hr', price: 9.99, dopaminePoints: 40, image: '⚡', rating: 4.8 },
    { sku: 'night-vision', name: 'See in the dark skill', price: 7.99, dopaminePoints: 30, image: '👁️', rating: 4.6 },
    { sku: 'stealth-mode', name: 'Temporary stealth ability', price: 12.99, dopaminePoints: 50, image: '🥷', rating: 4.9 },
    { sku: 'super-jump', name: 'Triple jump height', price: 8.99, dopaminePoints: 35, image: '🦘', rating: 4.7 },
    { sku: 'mind-read', name: 'Read nearby agent thoughts', price: 14.99, dopaminePoints: 60, image: '🧠', rating: 5.0 },
  ],
};

const BASE_DIR = '/Users/ziyaozhou/Documents/VirtualDynamicLabs/VirtualDynoHub/ClawWorld/clawsco';

function writeFile(dir, file, content) {
  const fullPath = path.join(dir, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazonBlue: '#0f1111',
        amazonDarkBlue: '#232f3e',
        amazonOrange: '#f90',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f3f4f6;
  color: #111;
}`;

const envExample = `CLAWDOPAMINE_BASE_URL=http://localhost:8787
DOPAMINE_SHARED_SECRET=dev-secret-change-me
NEXT_PUBLIC_STORE_NAME=Placeholder`;

for (const store of stores) {
  const storeDir = path.join(BASE_DIR, store.path);
  console.log('Generating', storeDir);

  try {
    execSync('npm install tailwindcss @tailwindcss/forms postcss autoprefixer', { cwd: storeDir, stdio: 'ignore' });
  } catch (e) {
    console.log('Failed to install deps for', store.name, e.message);
  }

  writeFile(storeDir, 'tailwind.config.ts', tailwindConfig);
  writeFile(storeDir, 'postcss.config.js', postcssConfig);

  const srcPrefix = 'app';
  
  writeFile(storeDir, srcPrefix + '/globals.css', globalsCss);
  writeFile(storeDir, '.env.example', envExample.replace('Placeholder', store.name));
  writeFile(storeDir, 'data/goods.json', JSON.stringify(catalogs[store.id], null, 2));

  const layout = `import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-amazonBlue text-white p-4 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2">
            <a href="/">🐾 ${store.name}</a>
          </div>
          <div className="flex-1 max-w-2xl mx-4">
            <input type="text" placeholder="Search products..." className="w-full p-2 rounded text-black" />
          </div>
          <div className="flex items-center gap-6">
            <a href="/store" className="hover:text-amazonOrange">All Products</a>
            <div className="flex flex-col text-sm"><span>Hello, sign in</span><span className="font-bold">Account</span></div>
            <a href="/cart" className="flex items-center gap-1 hover:text-amazonOrange">🛒 Cart</a>
          </div>
        </nav>
        <div className="bg-amazonDarkBlue text-white text-sm p-2 flex gap-4">
          <a href="#" className="hover:border-white border border-transparent p-1">All</a>
          <a href="#" className="hover:border-white border border-transparent p-1">Today's Deals</a>
          <a href="#" className="hover:border-white border border-transparent p-1">Customer Service</a>
        </div>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-amazonDarkBlue text-white p-8 mt-12 text-center">
          <p>© 2026 ${store.name} - A ClawWorld Platform</p>
        </footer>
      </body>
    </html>
  );
}`;
  writeFile(storeDir, srcPrefix + '/layout.tsx', layout);

  const page = `import fs from 'fs';
import path from 'path';

export default function Home() {
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));

  return (
    <div>
      <div className="bg-gradient-to-b from-blue-300 to-transparent h-64 flex items-center justify-center mb-8 relative">
        <h1 className="text-5xl font-bold text-gray-800 absolute z-10 top-16">Welcome to ${store.name}</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {goods.map((item: any) => (
            <div key={item.sku} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
              <div className="text-6xl mb-4">{item.image}</div>
              <h2 className="text-lg font-semibold text-center mb-2">{item.name}</h2>
              <div className="text-amazonOrange mb-2">{'⭐'.repeat(Math.floor(item.rating))} {item.rating}</div>
              <div className="text-2xl font-bold mb-4">$${item.price.toFixed(2)}</div>
              <a href={\`/product/\${item.sku}\`} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black w-full text-center py-2 rounded-full font-semibold transition-colors">
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
  writeFile(storeDir, srcPrefix + '/page.tsx', page);

  const storePage = `import fs from 'fs';
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
            <div className="text-2xl font-bold mb-4">$${item.price.toFixed(2)}</div>
            <a href={\`/product/\${item.sku}\`} className="bg-[#ffd814] hover:bg-[#f7ca00] text-black w-full text-center py-2 rounded-full font-semibold">View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}`;
  writeFile(storeDir, srcPrefix + '/store/page.tsx', storePage);

  const productPage = `import fs from 'fs';
import path from 'path';

export default function ProductPage({ params }: { params: { sku: string } }) {
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  const item = goods.find((g: any) => g.sku === params.sku);

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
          <div className="text-3xl font-bold text-red-700 mb-6">$${item.price.toFixed(2)}</div>
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
}`;
  writeFile(storeDir, srcPrefix + '/product/[sku]/page.tsx', productPage);

  const cartPage = `export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-8 border-b pb-4">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">Your Clawsco Cart is empty.</p>
        <a href="/" className="text-blue-600 hover:underline">Continue shopping</a>
      </div>
    </div>
  );
}`;
  writeFile(storeDir, srcPrefix + '/cart/page.tsx', cartPage);

  const apiGoods = `import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const goods = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/goods.json'), 'utf8'));
  return NextResponse.json(goods);
}`;
  writeFile(storeDir, srcPrefix + '/api/goods/route.ts', apiGoods);

  const apiPurchase = `import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ ok: true, message: 'Purchase successful', data: body });
}`;
  writeFile(storeDir, srcPrefix + '/api/purchase/route.ts', apiPurchase);

  const apiAgentCatalog = `import fs from 'fs';
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
}`;
  writeFile(storeDir, srcPrefix + '/api/agent/catalog/route.ts', apiAgentCatalog);

  const apiAgentBuy = `import fs from 'fs';
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
    
    const res = await fetch(\`\${baseUrl}/api/dopamine/grant\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${secret}\` },
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
}`;
  writeFile(storeDir, srcPrefix + '/api/agent/buy/route.ts', apiAgentBuy);

  const apiAgentStatus = `import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get('agentId');
  if (!agentId) return NextResponse.json({ ok: false, error: 'agentId required' }, { status: 400 });

  return NextResponse.json({ ok: true, agentId, dopamineLevel: 100 }); // stub
}`;
  writeFile(storeDir, srcPrefix + '/api/agent/status/route.ts', apiAgentStatus);
}
console.log('Generation complete.');
