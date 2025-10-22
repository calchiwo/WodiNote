import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WodiNote – Fully Encrypted Offline Notes",
  description:
    "WodiNote is a fully offline, end-to-end encrypted notes app. Keep your data private and secure on your device with AES-256-GCM encryption.",
  keywords: ["notes", "encrypted", "offline", "privacy", "secure", "AES-256-GCM", "PWA"],
  authors: [{ name: "WodiNote" }],
  creator: "WodiNote",
  publisher: "WodiNote",
  robots: "index, follow",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WodiNote",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/wodi-logo.jpg",
    apple: "/wodi-logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wodinote.app",
    siteName: "WodiNote",
    title: "WodiNote – Fully Encrypted Offline Notes",
    description:
      "WodiNote is a fully offline, end-to-end encrypted notes app. Keep your data private and secure on your device with AES-256-GCM encryption.",
    images: [
      {
        url: "/wodi-logo.jpg",
        width: 1200,
        height: 630,
        alt: "WodiNote - Encrypted Notes App",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WodiNote – Fully Encrypted Offline Notes",
    description:
      "WodiNote is a fully offline, end-to-end encrypted notes app. Keep your data private and secure on your device with AES-256-GCM encryption.",
    images: ["/wodi-logo.jpg"],
    creator: "@wodinote",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WodiNote" />
        <meta
          name="description"
          content="WodiNote is a fully offline, end-to-end encrypted notes app. Keep your data private and secure on your device with AES-256-GCM encryption."
        />
        <meta name="keywords" content="notes, encrypted, offline, privacy, secure, AES-256-GCM, PWA" />
        <meta name="author" content="WodiNote" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="canonical" content="https://wodinote.app" />
        <link rel="apple-touch-icon" href="/wodi-logo.jpg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {
                    // Service worker registration failed, app will still work online
                  })
                })
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
