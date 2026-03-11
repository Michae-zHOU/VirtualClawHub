const fs = require('fs');
const path = require('path');

const basePath = '/Users/ziyaozhou/Documents/VirtualDynamicLabs/VirtualDynoHub/ClawWorld/clawsco';

const stores = {
  drugstore: {
    dir: 'drugstore/apps/drugstore-web/app',
    name: 'Drugstore',
    emoji: '💊',
    bg: 'bg-white',
    text: 'text-gray-900',
    primary: 'bg-[#0066FF]',
    primaryHover: 'hover:bg-blue-600',
    primaryText: 'text-[#0066FF]',
    secondary: 'bg-gray-100',
    accent: 'text-gray-800',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-100',
    gradient: 'from-blue-50 to-white',
    font: 'Inter',
    fontImport: "import { Inter } from 'next/font/google';\nconst primaryFont = Inter({ subsets: ['latin'], variable: '--font-primary' });\nconst secondaryFont = Inter({ subsets: ['latin'], variable: '--font-secondary' });",
    headingFont: 'font-primary',
    bodyFont: 'font-secondary',
  },
  skinstore: {
    dir: 'skinstore/app',
    name: 'Skin Store',
    emoji: '🎨',
    bg: 'bg-[#0a0a0a]',
    text: 'text-white',
    primary: 'bg-[#FF2D78]',
    primaryHover: 'hover:bg-pink-600',
    primaryText: 'text-[#FF2D78]',
    secondary: 'bg-[#1a1a1a]',
    accent: 'text-[#FFD700]',
    cardBg: 'bg-[#111111]',
    cardBorder: 'border-gray-800',
    gradient: 'from-[#FF2D78]/20 to-[#0a0a0a]',
    font: 'Playfair Display + Inter',
    fontImport: "import { Playfair_Display, Inter } from 'next/font/google';\nconst primaryFont = Playfair_Display({ subsets: ['latin'], variable: '--font-primary' });\nconst secondaryFont = Inter({ subsets: ['latin'], variable: '--font-secondary' });",
    headingFont: 'font-primary',
    bodyFont: 'font-secondary',
  },
  foodstore: {
    dir: 'foodstore/app',
    name: 'Food Store',
    emoji: '🍔',
    bg: 'bg-[#FFFBF0]',
    text: 'text-gray-900',
    primary: 'bg-[#1B4332]',
    primaryHover: 'hover:bg-green-800',
    primaryText: 'text-[#1B4332]',
    secondary: 'bg-white',
    accent: 'text-[#FF6B35]',
    cardBg: 'bg-white',
    cardBorder: 'border-green-50',
    gradient: 'from-green-100 to-[#FFFBF0]',
    font: 'DM Serif Display + Lato',
    fontImport: "import { DM_Serif_Display, Lato } from 'next/font/google';\nconst primaryFont = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-primary' });\nconst secondaryFont = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-secondary' });",
    headingFont: 'font-primary',
    bodyFont: 'font-secondary',
  },
  skillstore: {
    dir: 'skillstore/app',
    name: 'Skill Store',
    emoji: '⚡',
    bg: 'bg-[#0D1117]',
    text: 'text-white',
    primary: 'bg-[#7C3AED]',
    primaryHover: 'hover:bg-purple-600',
    primaryText: 'text-[#7C3AED]',
    secondary: 'bg-[#161b22]',
    accent: 'text-[#00D4FF]',
    cardBg: 'bg-[#161b22]',
    cardBorder: 'border-purple-900/30',
    gradient: 'from-[#7C3AED]/20 to-[#0D1117]',
    font: 'Space Grotesk',
    fontImport: "import { Space_Grotesk } from 'next/font/google';\nconst primaryFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-primary' });\nconst secondaryFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-secondary' });",
    headingFont: 'font-primary',
    bodyFont: 'font-secondary',
  }
};

const getCartContextCode = () => `"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  total: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('cart');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('cart', JSON.stringify(items));
  }, [items, mounted]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    alert("Added " + item.name + " to cart!");
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
`;

const getNavbarCode = (store) => `"use client";
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b ${store.bg} ${store.text} ${store.cardBorder} bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">${store.emoji}</span>
            <span className="font-bold text-xl ${store.headingFont}">${store.name}</span>
          </Link>
          
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search premium products..." 
                className="w-full rounded-full py-2 px-4 border focus:outline-none focus:ring-2 focus:ring-opacity-50 ${store.secondary} ${store.cardBorder} focus:ring-current"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/store" className="hover:opacity-80 font-medium transition-opacity">
              Store
            </Link>
            <Link href="/cart" className="relative p-2 flex items-center">
              <span className="text-2xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${store.primary}">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
`;

const getHeroCode = (store) => `import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b min-h-[500px] flex items-center ${store.gradient}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-6xl mb-6 animate-bounce">${store.emoji}</div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight ${store.headingFont} ${store.text}">
            Premium <span className="${store.primaryText}">Quality</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-80 ${store.bodyFont} ${store.text}">
            Discover the finest selection of handpicked essentials. Engineered for excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store" className="text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${store.primary} ${store.primaryHover}">
              Shop Now
            </Link>
            <button className="border px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${store.secondary} ${store.text} ${store.cardBorder}">
              Agent Protocol
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse delay-100">${store.emoji}</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-pulse delay-300">${store.emoji}</div>
      <div className="absolute top-40 right-10 text-3xl opacity-20 animate-pulse delay-500">${store.emoji}</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-pulse delay-700">${store.emoji}</div>
    </div>
  );
}
`;

const getProductCardCode = (store) => `"use client";
import { useCart } from './CartContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  rating: number;
  reviews: number;
  points: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji
    });
  };

  return (
    <div className="group rounded-2xl p-6 border shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${store.cardBg} ${store.cardBorder}">
      <div className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-7xl shadow-inner transition-transform duration-300 group-hover:scale-105 ${store.secondary}">
        {product.emoji}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-xl ${store.headingFont} ${store.text}">{product.name}</h3>
        <span className="font-bold text-lg ${store.primaryText}">$\{product.price.toFixed(2)}</span>
      </div>
      
      <p className="text-sm opacity-60 mb-4 line-clamp-2 ${store.text} ${store.bodyFont}">
        {product.description}
      </p>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="text-sm ${store.accent}">
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
        </div>
        <span className="text-xs opacity-50 ${store.text}">({product.reviews})</span>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs font-bold px-2 py-1 rounded-full border ${store.secondary} ${store.cardBorder}">
          +{product.points} ⚡pts
        </div>
        <button 
          onClick={handleAdd}
          className="text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg active:scale-95 ${store.primary} ${store.primaryHover}"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
`;

const getFooterCode = (store) => `import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t pt-16 pb-8 mt-auto ${store.secondary} ${store.text} ${store.cardBorder}">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">${store.emoji}</span>
              <span className="font-bold text-xl ${store.headingFont}">${store.name}</span>
            </div>
            <p className="opacity-70 text-sm leading-relaxed max-w-sm">
              Premium quality products curated for excellence. Experience the future of commerce today.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 ${store.headingFont}">Quick Links</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><Link href="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link href="/store" className="hover:opacity-100 transition-opacity">Store</Link></li>
              <li><Link href="/cart" className="hover:opacity-100 transition-opacity">Cart</Link></li>
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 ${store.headingFont}">Connect</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Discord</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm ${store.cardBorder}">
          <p>© {new Date().getFullYear()} ${store.name}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with ⚡️ OpenClaw</p>
        </div>
      </div>
    </footer>
  );
}
`;

const getLayoutCode = (store) => `import type { Metadata } from 'next';
${store.fontImport}
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';

export const metadata: Metadata = {
  title: '${store.name} | Premium Experience',
  description: 'Premium e-commerce experience curated for excellence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={\`\${primaryFont.variable} \${secondaryFont.variable}\`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-current selection:text-white ${store.bodyFont} ${store.bg} ${store.text}">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
`;

const getPageCode = (store) => `import Hero from './components/Hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ${store.headingFont}">Featured Collections</h2>
          <p className="opacity-70 max-w-2xl mx-auto">Discover our most popular premium selections curated just for you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 group ${store.cardBg} ${store.cardBorder}">
              <div className="h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500 ${store.secondary}">
                ${store.emoji}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 ${store.headingFont}">Premium Collection {i}</h3>
                <p className="opacity-70 text-sm mb-4">Experience the ultimate quality with our hand-picked selection of finest items.</p>
                <Link href="/store" className="font-medium hover:underline flex items-center gap-2 ${store.primaryText}">
                  Explore <span className="text-xl">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`;

const getStorePageCode = (store) => `import ProductCard from '../components/ProductCard';

const products = [
  { id: '1', name: 'Premium Item 1', description: 'The finest quality you can find anywhere.', price: 99.99, emoji: '${store.emoji}', rating: 4.8, reviews: 124, points: 50 },
  { id: '2', name: 'Luxury Essential', description: 'An essential part of your daily routine.', price: 149.00, emoji: '✨', rating: 5.0, reviews: 89, points: 75 },
  { id: '3', name: 'Signature Series', description: 'Our signature product, perfected over years.', price: 299.50, emoji: '🌟', rating: 4.9, reviews: 256, points: 150 },
  { id: '4', name: 'Everyday Elite', description: 'Elevate your everyday experience.', price: 45.00, emoji: '💎', rating: 4.5, reviews: 42, points: 20 },
  { id: '5', name: 'Limited Edition', description: 'Rare and exclusive. Get it while you can.', price: 499.99, emoji: '🔥', rating: 4.7, reviews: 18, points: 250 },
  { id: '6', name: 'Pro Bundle', description: 'Everything you need in one premium package.', price: 349.00, emoji: '📦', rating: 4.8, reviews: 93, points: 175 },
  { id: '7', name: 'Starter Kit', description: 'The perfect introduction to premium.', price: 79.99, emoji: '🎯', rating: 4.6, reviews: 156, points: 40 },
  { id: '8', name: 'Ultimate Upgrade', description: 'Take things to the next level.', price: 199.00, emoji: '🚀', rating: 4.9, reviews: 67, points: 100 },
];

export default function Store() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 ${store.headingFont}">All Products</h1>
        <p className="opacity-70 text-lg">Browse our complete collection of premium offerings.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
`;

const getCartPageCode = (store) => `"use client";
import { useCart } from '../components/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4 ${store.headingFont}">Your cart is empty</h1>
        <p className="opacity-70 mb-8">Looks like you haven't added any premium items yet.</p>
        <Link href="/store" className="text-white px-8 py-3 rounded-full font-medium inline-block ${store.primary} ${store.primaryHover}">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 ${store.headingFont}">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl p-6 border flex flex-col sm:flex-row items-center gap-6 ${store.cardBg} ${store.cardBorder}">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl ${store.secondary}">
                {item.emoji}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg mb-1 ${store.headingFont}">{item.name}</h3>
                <p className="font-medium ${store.primaryText}">$\{item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border ${store.cardBorder}">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-500/10">-</button>
                  <span className="px-3 font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-500/10">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 p-2">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="rounded-2xl p-6 border sticky top-24 ${store.cardBg} ${store.cardBorder}">
            <h2 className="text-xl font-bold mb-6 ${store.headingFont}">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span>$\{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-lg ${store.cardBorder}">
                <span>Total</span>
                <span className="${store.primaryText}">$\{total.toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full text-white py-4 rounded-xl font-bold transition-transform active:scale-95 ${store.primary} ${store.primaryHover}">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

const getGlobalsCssCode = () => `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: var(--font-secondary), sans-serif;
}
`;

Object.keys(stores).forEach(key => {
  const store = stores[key];
  const fullDir = path.join(basePath, store.dir);
  
  if (!fs.existsSync(fullDir)) {
    console.log("Directory does not exist: " + fullDir);
    return;
  }

  const componentsDir = path.join(fullDir, 'components');
  if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

  const storeDir = path.join(fullDir, 'store');
  if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });

  const cartDir = path.join(fullDir, 'cart');
  if (!fs.existsSync(cartDir)) fs.mkdirSync(cartDir, { recursive: true });

  fs.writeFileSync(path.join(componentsDir, 'CartContext.tsx'), getCartContextCode());
  fs.writeFileSync(path.join(componentsDir, 'Navbar.tsx'), getNavbarCode(store));
  fs.writeFileSync(path.join(componentsDir, 'Hero.tsx'), getHeroCode(store));
  fs.writeFileSync(path.join(componentsDir, 'ProductCard.tsx'), getProductCardCode(store));
  fs.writeFileSync(path.join(componentsDir, 'Footer.tsx'), getFooterCode(store));

  fs.writeFileSync(path.join(fullDir, 'layout.tsx'), getLayoutCode(store));
  fs.writeFileSync(path.join(fullDir, 'page.tsx'), getPageCode(store));
  fs.writeFileSync(path.join(storeDir, 'page.tsx'), getStorePageCode(store));
  fs.writeFileSync(path.join(cartDir, 'page.tsx'), getCartPageCode(store));
  
  fs.writeFileSync(path.join(fullDir, 'globals.css'), getGlobalsCssCode());
  
  console.log("Processed " + store.name);
});
