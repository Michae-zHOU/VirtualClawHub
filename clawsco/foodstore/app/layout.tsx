import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-amazonBlue text-white p-4 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2">
            <a href="/">🐾 Clawsco Foodstore</a>
          </div>
          <div className="flex-1 max-w-2xl mx-4">
            <input type="text" placeholder="Search products..." className="w-full p-2 rounded text-black" />
          </div>
          <div className="flex items-center gap-6">
            <a href="/store" className="hover:text-amazonOrange">All Products</a>
            <div className="flex flex-col text-sm"><span>Hello, sign in</span><span className="font-bold">Account</span></div>
            <a href="/cart" className="flex items-center gap-1 hover:text-amazonOrange">🛒 Cart</a>
          </div>
        </nav>
        <div className="bg-amazonDarkBlue text-white text-sm p-2 flex gap-4">
          <a href="#" className="hover:border-white border border-transparent p-1">All</a>
          <a href="#" className="hover:border-white border border-transparent p-1">Today's Deals</a>
          <a href="#" className="hover:border-white border border-transparent p-1">Customer Service</a>
        </div>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-amazonDarkBlue text-white p-8 mt-12 text-center">
          <p>© 2026 Clawsco Foodstore - A ClawWorld Platform</p>
        </footer>
      </body>
    </html>
  );
}