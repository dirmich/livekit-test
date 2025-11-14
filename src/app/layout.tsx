import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LiveKit Test App',
  description: 'Testing LiveKit features including chat and video',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
