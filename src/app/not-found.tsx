import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { Providers } from '@/providers'
import './(frontend)/globals.css'

export default function NotFound() {
  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="zoom-content flex-1">
              <main>
                <div className="container mx-auto max-w-3xl py-4 px-4 sm:px-6 lg:px-8">
                  <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                    {/* Large 404 with magnifying glass */}
                    <div className="relative mb-6">
                      <h1 className="text-[150px] sm:text-[180px] font-bold text-gray-200 leading-none select-none">
                        404
                      </h1>
                      <div className="absolute bottom-4 right-8 sm:bottom-6 sm:right-12">
                        <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 -rotate-12" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Error message */}
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 text-center">
                      Whoops! Something went wrong.
                    </h2>
                    <p className="text-gray-500 text-center max-w-md mb-8 text-[15px]">
                      The page you&apos;re looking for could not be found. It may have been moved or deleted.
                    </p>

                    {/* Back to Home button */}
                    <Link
                      href="/"
                      className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Back To Home
                    </Link>
                  </div>
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
