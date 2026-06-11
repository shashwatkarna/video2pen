import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Suspense } from 'react'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stack } from "../stack";
import { CSPostHogProvider } from './providers/PostHogProvider';
import Loading from './loading';
import './globals.css'

import { TooltipProvider } from "@radix-ui/react-tooltip";

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#fdfdf0',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Video2Pen - YouTube to Handwritten Study Notes',
  description: 'The ultimate AI learning assistant to summarize long YouTube videos, extract insights, and generate beautiful handwritten study guides instantly.',
  keywords: ['youtube transcript generator', 'youtube to notes', 'yt to notes', 'ai study guide', 'video to text', 'summarize youtube videos with ai', 'automated video summaries', 'timestamped notes', 'ai learning assistant', 'extract insights from video', 'youtube to pdf'],
  openGraph: {
    title: 'Video2Pen - YouTube to Handwritten Study Notes',
    description: 'The ultimate AI learning assistant to summarize long YouTube videos, extract insights, and generate beautiful handwritten study guides instantly.',
    url: 'https://video2pen.vercel.app',
    siteName: 'Video2Pen',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video2Pen - YouTube to Handwritten Study Notes',
    description: 'Transform any YouTube video into beautiful, handwritten-style study guides in seconds.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Video2Pen',
  },
  alternates: {
    canonical: 'https://video2pen.vercel.app',
  },
  other: {
    'og:logo': 'https://video2pen.vercel.app/icon-512x512.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Handlee&family=Indie+Flower&family=Gochi+Hand&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Video2Pen",
              "operatingSystem": "Any",
              "applicationCategory": "EducationalApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Transform any YouTube video into beautiful, handwritten-style study guides in seconds. Powered by AI."
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-background`} suppressHydrationWarning>
        <StackProvider app={stack}>
          <StackTheme theme={{ 
            radius: "0px", 
            light: { 
              primary: "#1890ff",
              background: "#fdfdf0",
              card: "#ffffff",
              border: "#000000",
            } 
          }}>
            <TooltipProvider>
              <CSPostHogProvider>
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </CSPostHogProvider>
            </TooltipProvider>
          </StackTheme>
        </StackProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  )
}
