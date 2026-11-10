import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CartProvider from '@/modules/cart/components/CartProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShopBoard',
  description: 'Browse products, build a cart, and check out.',
}

// The root layout: the header and footer stay on screen while {children}
// shows the page that matches the URL.
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col">
        {/* Above every page, so all pages share the same cart. */}
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-page flex-1 px-4 pt-6 pb-8">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
