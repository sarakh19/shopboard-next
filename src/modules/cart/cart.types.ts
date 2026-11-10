import type { Product } from '../products/products.types'

// The cart stores only IDs and quantities. Names and prices stay in the
// product data, so a saved cart can never hold an outdated price.
export interface CartItem {
  productId: number
  quantity: number
}

export type Cart = CartItem[]

// A display-ready cart row: the item joined with its full product.
export interface CartLine {
  product: Product
  quantity: number
  subtotal: number
}

// What the cart Context gives to components: the saved items, values derived
// from them, and the actions. Components change the cart only through these actions.
export interface CartContextValue {
  items: Cart
  // false until the saved cart has been read in the browser (see cart.state.ts).
  isReady: boolean
  count: number
  getQuantity: (productId: number) => number
  addToCart: (product: Product) => void
  increase: (productId: number) => void
  decrease: (productId: number) => void
  remove: (productId: number) => void
  clearCart: () => void
}
