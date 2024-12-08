import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Space Math Adventure',
  description: 'A fun space-themed math learning game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}