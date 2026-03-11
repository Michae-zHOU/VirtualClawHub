import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b min-h-[500px] flex items-center from-[#FF2D78]/20 to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-6xl mb-6 animate-bounce">🎨</div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-primary text-white">
            Premium <span className="text-[#FF2D78]">Quality</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-80 font-secondary text-white">
            Discover the finest selection of handpicked essentials. Engineered for excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store" className="text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-[#FF2D78] hover:bg-pink-600">
              Shop Now
            </Link>
            <button className="border px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg bg-[#1a1a1a] text-white border-gray-800">
              Agent Protocol
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse delay-100">🎨</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-pulse delay-300">🎨</div>
      <div className="absolute top-40 right-10 text-3xl opacity-20 animate-pulse delay-500">🎨</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-pulse delay-700">🎨</div>
    </div>
  );
}
