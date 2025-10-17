import React, { Suspense } from 'react'
import './styles.css'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  description: 'Product catalog store',
  title: 'Store',
}

function NavFallback() {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-zinc-900">Store</div>
        </div>
      </div>
    </nav>
  )
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-zinc-100 min-h-screen flex flex-col">
        <Suspense fallback={<NavFallback />}>
          <Navigation />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
