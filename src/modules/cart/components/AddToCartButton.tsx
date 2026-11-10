'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Product } from '../../products/products.types'
import { useCart } from '../useCart'

interface AddToCartButtonProps {
  product: Product
}

// Used by the product card and the product page. It reads the cart from
// Context, so the components above it do not pass cart props down.
// A Client Component (onClick), so ProductDetails can stay a Server Component.
function AddToCartButton({ product }: AddToCartButtonProps) {
  const { getQuantity, addToCart } = useCart()
  const quantityInCart = getQuantity(product.id)

  return (
    <>
      {/* A boolean condition before &&, so React never renders a stray "0". */}
      {quantityInCart > 0 && (
        <Badge variant="success">{quantityInCart} in cart</Badge>
      )}

      {/* mt-auto pushes the action to the bottom, so buttons line up in a row. */}
      {product.inStock ? (
        <Button className="mt-auto" onClick={() => addToCart(product)}>
          Add to Cart
        </Button>
      ) : (
        <Badge variant="danger" className="mt-auto">
          Out of stock
        </Badge>
      )}
    </>
  )
}

export default AddToCartButton
