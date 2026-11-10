import CartSummary from '../../cart/components/CartSummary'
import type { CartLine } from '../../cart/cart.types'

interface OrderSummaryProps {
  lines: CartLine[]
}

// Read-only list of what is being ordered.
function OrderSummary({ lines }: OrderSummaryProps) {
  return (
    <>
      <ul className="grid gap-2 border-b border-border pb-3">
        {lines.map((line) => (
          <li key={line.product.id}>
            {line.product.name} × {line.quantity}
          </li>
        ))}
      </ul>
      <CartSummary lines={lines} />
    </>
  )
}

export default OrderSummary
