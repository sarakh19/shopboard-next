'use client'

import { ButtonLink } from '@/components/ui/Button'
import StatusMessage from '../../../shared/components/StatusMessage'
import type { Product } from '../../products/products.types'
import { useCart, useCartLines } from '../useCart'
import CartRow from './CartRow'
import CartSummary from './CartSummary'

interface CartContentsProps {
  // Loaded on the server by CartPage, for the names and prices.
  products: Product[]
}

// A Client Component: the cart lives in the browser (localStorage).
function CartContents({ products }: CartContentsProps) {
  const { items, isReady } = useCart()
  const lines = useCartLines(products)

  // On the server and during hydration the saved cart is not known yet.
  if (!isReady) {
    return <StatusMessage tone="info" title="Loading your cart…" />
  }

  if (items.length === 0) {
    return (
      <StatusMessage
        tone="info"
        title="Your cart is empty. Add a product to get started."
      >
        <ButtonLink href="/products">Browse products</ButtonLink>
      </StatusMessage>
    )
  }

  if (lines.length === 0) {
    // Saved items whose products no longer exist are skipped.
    return (
      <StatusMessage
        tone="info"
        title="The products in your cart are no longer available."
      />
    )
  }

  return (
    <>
      <ul className="grid">
        {lines.map((line) => (
          <CartRow key={line.product.id} line={line} />
        ))}
      </ul>
      <CartSummary lines={lines} />
      <ButtonLink href="/checkout">Go to checkout</ButtonLink>
    </>
  )
}

export default CartContents
