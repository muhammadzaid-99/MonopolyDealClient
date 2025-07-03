
import type { Metadata } from 'next'
import './globals.css'
import { SocketProvider } from "@/lib/SocketProvider";

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
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  )
}
