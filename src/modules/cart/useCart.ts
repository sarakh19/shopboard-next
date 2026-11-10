import { use } from 'react'
import type { Product } from '../products/products.types'
import { CartContext } from './cart.context'
import { getCartLines } from './cart.logic'
import type { CartContextValue, CartLine } from './cart.types'

// Reads the cart from the nearest CartProvider.
export function useCart(): CartContextValue {
  const cart = use(CartContext)
  if (cart === null) {
    throw new Error('useCart() must be used inside <CartProvider>')
  }
  return cart
}

// Cart rows joined with their products (names and prices). The page loads
// the products on the server and passes them in.
export function useCartLines(products: Product[]): CartLine[] {
  const { items } = useCart()
  return getCartLines(items, products)
}
