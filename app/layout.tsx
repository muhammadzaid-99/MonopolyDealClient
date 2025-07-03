
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SocketProvider } from "@/lib/SocketProvider";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'MonoDeal - Monopoly Deal',
  description: 'Play with Friends',
  creator: 'muhammadzaid.vercel.app',
  // themeColor: '#1a1a1a', // This sets the meta theme-color automatically
  manifest: '/manifest.json', // This adds the <link rel="manifest">
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </SocketProvider>
      </body>
    </html>
  )
}
