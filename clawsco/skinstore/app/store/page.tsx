import ProductCard from '../components/ProductCard';

const products = [
  { id: '1', name: 'Premium Item 1', description: 'The finest quality you can find anywhere.', price: 99.99, emoji: '🎨', rating: 4.8, reviews: 124, points: 50 },
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-primary">All Products</h1>
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
