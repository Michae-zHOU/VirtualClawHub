import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: process.env.NEXT_PUBLIC_CLAWSTORE_NAME ?? 'Claw Drugstore'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
