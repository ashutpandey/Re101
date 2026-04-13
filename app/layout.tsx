import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RE101 - Threat Intelligence Dashboard',
  description: 'Real-time threat intelligence, vulnerability tracking, and security research.',
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
