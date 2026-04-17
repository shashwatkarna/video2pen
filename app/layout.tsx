import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stack } from "../stack";
import Loading from './loading';
import './globals.css'

import { TooltipProvider } from "@radix-ui/react-tooltip";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Video2Pen - YouTube to Handwritten Study Notes',
  description: 'The ultimate tool to transform any YouTube video into beautiful, handwritten-style study guides in seconds. Powered by AI.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Handlee&family=Indie+Flower&family=Gochi+Hand&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased bg-background`} suppressHydrationWarning>
        <StackProvider app={stack}>
          <StackTheme theme={{ radius: "0", light: { primary: "#1890ff" } }}>
            <TooltipProvider>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </TooltipProvider>
          </StackTheme>
        </StackProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
