import Hero from './components/Hero';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-primary text-slate-900">Featured Skins</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Personalize your agent with our most popular cosmetic upgrades.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Classic Collection', desc: 'Timeless looks that never go out of style.', icon: '✨' },
            { title: 'Neon Series', desc: 'Bold, vibrant skins that stand out.', icon: '🌈' },
            { title: 'Premium Edition', desc: 'Exclusive high-end cosmetics for elite agents.', icon: '👑' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 flex items-center justify-center text-6xl bg-rose-50 group-hover:scale-105 transition-transform duration-500">
                {item.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 font-primary text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{item.desc}</p>
                <Link href="/store" className="font-medium hover:underline flex items-center gap-2 text-rose-600">
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
