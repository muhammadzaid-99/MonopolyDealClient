
import type { Metadata } from 'next'
import './globals.css'
import { SocketProvider } from "@/lib/SocketProvider";
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CashDeal - Monopoly Deal',
  description: 'Play with Friends',
  creator: 'muhammadzaid.vercel.app',
}

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
