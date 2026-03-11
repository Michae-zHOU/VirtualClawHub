import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
const primaryFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-primary' });
const secondaryFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-secondary' });
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';

export const metadata: Metadata = {
  title: 'Skill Store | Premium Experience',
  description: 'Premium e-commerce experience curated for excellence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${primaryFont.variable} ${secondaryFont.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-current selection:text-white font-secondary bg-[#0D1117] text-white">
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
