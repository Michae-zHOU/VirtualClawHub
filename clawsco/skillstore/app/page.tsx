import Hero from './components/Hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-primary">Featured Collections</h2>
          <p className="opacity-70 max-w-2xl mx-auto">Discover our most popular premium selections curated just for you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 group bg-[#161b22] border-purple-900/30">
              <div className="h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500 bg-[#161b22]">
                ⚡
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 font-primary">Premium Collection {i}</h3>
                <p className="opacity-70 text-sm mb-4">Experience the ultimate quality with our hand-picked selection of finest items.</p>
                <Link href="/store" className="font-medium hover:underline flex items-center gap-2 text-[#7C3AED]">
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
