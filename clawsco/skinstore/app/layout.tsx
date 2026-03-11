import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
const primaryFont = Outfit({ subsets: ['latin'], variable: '--font-primary' });
const secondaryFont = Outfit({ subsets: ['latin'], variable: '--font-secondary' });
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';

export const metadata: Metadata = {
  title: 'Skin Store | Agent Cosmetics',
  description: 'Agent-first cosmetics marketplace with human-readable interface.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${primaryFont.variable} ${secondaryFont.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-secondary bg-[#fafafa] text-[#0f172a]">
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
