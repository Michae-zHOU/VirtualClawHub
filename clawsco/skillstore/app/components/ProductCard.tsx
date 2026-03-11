"use client";
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
    <div className="group rounded-2xl p-6 border shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-[#161b22] border-purple-900/30">
      <div className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-7xl shadow-inner transition-transform duration-300 group-hover:scale-105 bg-[#161b22]">
        {product.emoji}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-xl font-primary text-white">{product.name}</h3>
        <span className="font-bold text-lg text-[#7C3AED]">${product.price.toFixed(2)}</span>
      </div>
      
      <p className="text-sm opacity-60 mb-4 line-clamp-2 text-white font-secondary">
        {product.description}
      </p>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="text-sm text-[#00D4FF]">
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
        </div>
        <span className="text-xs opacity-50 text-white">({product.reviews})</span>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs font-bold px-2 py-1 rounded-full border bg-[#161b22] border-purple-900/30">
          +{product.points} ⚡pts
        </div>
        <button 
          onClick={handleAdd}
          className="text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg active:scale-95 bg-[#7C3AED] hover:bg-purple-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
