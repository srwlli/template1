import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './components/AuthProvider'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Template - Modern Web Application',
  description: 'A modern web application template built with Next.js, TypeScript, Tailwind CSS, and Supabase. Features secure authentication, user management, and responsive design.',
  keywords: ['Template', 'Next.js', 'TypeScript', 'Supabase', 'Authentication', 'Dashboard'],
  authors: [{ name: 'Template Team' }],
  creator: 'Template',
  publisher: 'Template',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Template - Modern Web Application',
    description: 'A modern web application template built with Next.js, TypeScript, Tailwind CSS, and Supabase.',
    siteName: 'Template',
    images: [
      {
        url: 'https://your-domain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Template - Modern Web Application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Template - Modern Web Application',
    description: 'A modern web application template built with Next.js, TypeScript, Tailwind CSS, and Supabase.',
    images: ['https://your-domain.com/og-image.png'],
    creator: '@your-twitter',
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        {/* Global Authentication Provider */}
        <AuthProvider>
          {/* Site Header */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          {/* Site Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}