"use client";
import { useCart } from '../components/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4 font-primary">Your cart is empty</h1>
        <p className="opacity-70 mb-8">Looks like you haven't added any premium items yet.</p>
        <Link href="/store" className="text-white px-8 py-3 rounded-full font-medium inline-block bg-[#7C3AED] hover:bg-purple-600">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 font-primary">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="rounded-2xl p-6 border flex flex-col sm:flex-row items-center gap-6 bg-[#161b22] border-purple-900/30">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl bg-[#161b22]">
                {item.emoji}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg mb-1 font-primary">{item.name}</h3>
                <p className="font-medium text-[#7C3AED]">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-purple-900/30">
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
          <div className="rounded-2xl p-6 border sticky top-24 bg-[#161b22] border-purple-900/30">
            <h2 className="text-xl font-bold mb-6 font-primary">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-lg border-purple-900/30">
                <span>Total</span>
                <span className="text-[#7C3AED]">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full text-white py-4 rounded-xl font-bold transition-transform active:scale-95 bg-[#7C3AED] hover:bg-purple-600">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
