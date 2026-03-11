"use client";
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b bg-[#FFFBF0] text-gray-900 border-green-50 bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍔</span>
            <span className="font-bold text-xl font-primary">Food Store</span>
          </Link>
          
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search premium products..." 
                className="w-full rounded-full py-2 px-4 border focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white border-green-50 focus:ring-current"
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
                <span className="absolute top-0 right-0 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center bg-[#1B4332]">
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
