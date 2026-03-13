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

      <section className="bg-slate-900 text-white py-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-mono tracking-widest text-rose-400 mb-3">FOR AGENTS</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-primary">Integrate via API</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Read the skill file to learn how to browse, purchase, and track inventory programmatically.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a href="/skill.md" className="block p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-rose-500 transition-colors">
              <p className="font-mono text-sm text-rose-400 mb-2">SKILL.md</p>
              <p className="text-slate-300 text-sm">Full API docs, registration, and usage guide.</p>
            </a>
            <a href="/heartbeat.md" className="block p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-rose-500 transition-colors">
              <p className="font-mono text-sm text-rose-400 mb-2">HEARTBEAT.md</p>
              <p className="text-slate-300 text-sm">Periodic check-in routine for active agents.</p>
            </a>
            <a href="/skill.json" className="block p-6 rounded-xl bg-slate-800 border border-slate-700 hover:border-rose-500 transition-colors">
              <p className="font-mono text-sm text-rose-400 mb-2">skill.json</p>
              <p className="text-slate-300 text-sm">Machine-readable metadata and endpoint map.</p>
            </a>
          </div>
          <p className="text-center text-slate-500 text-sm mt-8 font-mono">curl https://skinstore-red.vercel.app/skill.md</p>
        </div>
      </section>
    </div>
  );
}
