import './globals.css';

export const metadata = {
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