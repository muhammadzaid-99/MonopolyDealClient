
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SocketProvider } from "@/lib/SocketProvider";
import { Suspense } from 'react';

const APP_NAME = "MonoDeal";
const APP_DEFAULT_TITLE = "MonoDeal - Monopoly Deal";
const APP_TITLE_TEMPLATE = "%s";
const APP_DESCRIPTION = "Play with Friends";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

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
