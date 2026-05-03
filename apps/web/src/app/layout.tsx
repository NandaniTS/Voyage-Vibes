import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter } from 'next/font/google'
import { QueryProvider } from "./providers/query-provider";
import { AuthProvider } from "./lib/auth-context";

const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const _inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'Travel Junction - Solo Travel Adventures',
  description: 'Connect with trusted travel agents and discover curated trip packages designed for solo travelers. Your next adventure awaits.',
  generator: 'v0.app',
  icons: {
    icon: '/globe.svg',
    shortcut: '/globe.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${_playfair.variable} ${_inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
