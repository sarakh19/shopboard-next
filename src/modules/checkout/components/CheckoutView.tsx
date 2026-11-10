'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import StatusMessage from '../../../shared/components/StatusMessage'
import { useCart, useCartLines } from '../../cart/useCart'
import type { Product } from '../../products/products.types'
import type { CheckoutFormValues } from '../checkout.schema'
import CheckoutForm from './CheckoutForm'
import OrderSummary from './OrderSummary'

interface CheckoutViewProps {
  // Loaded on the server by CheckoutPage, for the order summary.
  products: Product[]
}

const titleClasses = 'text-2xl leading-tight font-bold'

// A Client Component: it reads the browser cart and handles the form submit.
function CheckoutView({ products }: CheckoutViewProps) {
  const router = useRouter()
  const { items, isReady, clearCart } = useCart()
  const lines = useCartLines(products)
  // Only this page needs to know that an order was placed, so the state
  // stays here instead of in the global cart. While it is set, the
  // confirmation modal is open.
  const [customerName, setCustomerName] = useState<string | null>(null)

  function handlePlaceOrder(values: CheckoutFormValues) {
    setCustomerName(values.fullName)
    clearCart()
  }

  function handleContinueShopping() {
    setCustomerName(null)
    router.push('/products')
  }

  const confirmation = (
    <Modal
      open={customerName !== null}
      onClose={() => setCustomerName(null)}
      title={`Thank you, ${customerName ?? ''}!`}
    >
      <p>Your order was placed. A confirmation will be sent to your email.</p>
      <Button onClick={handleContinueShopping}>Continue shopping</Button>
    </Modal>
  )

  if (!isReady || items.length === 0) {
    return (
      <Card as="section" aria-labelledby="checkout-title">
        <h1 id="checkout-title" className={titleClasses}>
          Checkout
        </h1>
        {isReady ? (
          <StatusMessage
            tone="info"
            title="Your cart is empty, so there is nothing to check out."
          >
            <ButtonLink href="/products">Browse products</ButtonLink>
          </StatusMessage>
        ) : (
          <StatusMessage tone="info" title="Loading your cart…" />
        )}
        {/* After the order the cart is empty, so the modal opens here. */}
        {confirmation}
      </Card>
    )
  }

  // 1 column on phones; the form and a sticky summary side by side from 960px.
  return (
    <div className="grid items-start gap-6 min-[960px]:grid-cols-[1fr_340px]">
      <Card as="section" aria-labelledby="checkout-title">
        <h1 id="checkout-title" className={titleClasses}>
          Checkout
        </h1>
        <CheckoutForm onPlaceOrder={handlePlaceOrder} />
      </Card>

      <Card
        as="aside"
        className="min-[960px]:sticky min-[960px]:top-18"
        aria-labelledby="summary-title"
      >
        <h2 id="summary-title" className="text-xl font-bold">
          Order summary
        </h2>
        <OrderSummary lines={lines} />
      </Card>
    </div>
  )
}

export default CheckoutView
