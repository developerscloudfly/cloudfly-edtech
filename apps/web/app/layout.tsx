import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CloudFly EdTech — Learn Without Limits',
    template: '%s | CloudFly EdTech',
  },
  description:
    'CloudFly EdTech is a modern online learning platform offering short and long courses with live sessions, projects, and certifications.',
  keywords: ['online learning', 'courses', 'edtech', 'certification', 'live sessions'],
  authors: [{ name: 'CloudFly EdTech' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://cloudfly.edu',
    siteName: 'CloudFly EdTech',
    title: 'CloudFly EdTech — Learn Without Limits',
    description: 'Modern online learning with live sessions, projects, and certifications.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-bg-base font-body antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
