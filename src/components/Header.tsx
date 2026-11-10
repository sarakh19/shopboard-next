'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/modules/cart/useCart'
import { cn } from '@/shared/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
] as const

// "/" is active only on the home page; "/products" also on "/products/3".
function isActive(pathname: string | null, href: string): boolean {
  if (pathname === null) return false
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

interface MainNavProps {
  // null while the URL is not known yet (see Header below).
  pathname: string | null
}

function MainNav({ pathname }: MainNavProps) {
  // Read from the cart Context: no cartCount prop passed down from the layout.
  const { count } = useCart()

  return (
    <nav aria-label="Main">
      <ul className="flex gap-4">
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href)
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 hover:text-primary',
                  active && 'font-semibold text-primary',
                )}
              >
                {link.label}
                {link.href === '/cart' && (
                  <>
                    <Badge>{count}</Badge>
                    <span className="sr-only"> items</span>
                  </>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function CurrentMainNav() {
  return <MainNav pathname={usePathname()} />
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex min-h-14 w-full max-w-page items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          ShopBoard
        </Link>
        {/* On /products/[id] the URL is only known at request time, and
            Next.js needs usePathname() inside <Suspense> there. Until it is
            known, the same menu shows without the active link. */}
        <Suspense fallback={<MainNav pathname={null} />}>
          <CurrentMainNav />
        </Suspense>
      </div>
    </header>
  )
}

export default Header
