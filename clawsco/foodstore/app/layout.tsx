import type { Metadata } from 'next';
import { DM_Serif_Display, Lato } from 'next/font/google';
const primaryFont = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-primary' });
const secondaryFont = Lato({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-secondary' });
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';

export const metadata: Metadata = {
  title: 'Food Store | Premium Experience',
  description: 'Premium e-commerce experience curated for excellence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${primaryFont.variable} ${secondaryFont.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-current selection:text-white font-secondary bg-[#FFFBF0] text-gray-900">
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
