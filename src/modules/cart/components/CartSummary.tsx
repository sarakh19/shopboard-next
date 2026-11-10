import { formatPrice } from '../../../shared/formatPrice'
import { getCartCount, getCartTotal } from '../cart.logic'
import type { CartLine } from '../cart.types'

interface CartSummaryProps {
  lines: CartLine[]
}

// Item count and total, shown on the cart page and at checkout.
function CartSummary({ lines }: CartSummaryProps) {
  const count = getCartCount(lines)
  const total = getCartTotal(lines)

  return (
    <dl className="grid gap-2">
      <div className="flex justify-between">
        <dt className="text-muted">Items</dt>
        <dd>{count}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Total</dt>
        <dd className="text-xl font-bold">{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}

export default CartSummary
