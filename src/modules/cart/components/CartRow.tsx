import { Button } from '@/components/ui/Button'
import { formatPrice } from '../../../shared/formatPrice'
import type { CartLine } from '../cart.types'
import { useCart } from '../useCart'

interface CartRowProps {
  line: CartLine
}

function CartRow({ line }: CartRowProps) {
  const { product, quantity, subtotal } = line
  // The row changes the cart only through the actions the provider gives.
  const { increase, decrease, remove } = useCart()

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 border-b border-border py-3">
      <div>
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-muted">{formatPrice(product.price)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => decrease(product.id)}
          aria-label={`Decrease quantity of ${product.name}`}
        >
          −
        </Button>
        <output
          className="min-w-6 text-center"
          aria-label={`Quantity of ${product.name}`}
        >
          {quantity}
        </output>
        <Button
          variant="outline"
          size="icon"
          onClick={() => increase(product.id)}
          aria-label={`Increase quantity of ${product.name}`}
        >
          +
        </Button>
      </div>

      <p className="font-semibold">{formatPrice(subtotal)}</p>

      <Button
        variant="danger"
        size="sm"
        onClick={() => remove(product.id)}
        aria-label={`Remove ${product.name} from cart`}
      >
        Remove
      </Button>
    </li>
  )
}

export default CartRow
