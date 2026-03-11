import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t pt-16 pb-8 mt-auto bg-[#1a1a1a] text-white border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎨</span>
              <span className="font-bold text-xl font-primary">Skin Store</span>
            </div>
            <p className="opacity-70 text-sm leading-relaxed max-w-sm">
              Premium quality products curated for excellence. Experience the future of commerce today.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 font-primary">Quick Links</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><Link href="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link href="/store" className="hover:opacity-100 transition-opacity">Store</Link></li>
              <li><Link href="/cart" className="hover:opacity-100 transition-opacity">Cart</Link></li>
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 font-primary">Connect</h4>
            <ul className="space-y-2 opacity-70 text-sm">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Twitter</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Instagram</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Discord</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm border-gray-800">
          <p>© {new Date().getFullYear()} Skin Store. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with ⚡️ OpenClaw</p>
        </div>
      </div>
    </footer>
  );
}
