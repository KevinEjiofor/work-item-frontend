// First, update your root layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/lib/providers/QueryProvider';
import ToasterProvider from '@/lib/providers/ToasterProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Work Items Dashboard',
    description: 'Manage your work items efficiently',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <QueryProvider>
            {children}
            <ToasterProvider />
        </QueryProvider>
        </body>
        </html>
    );
}