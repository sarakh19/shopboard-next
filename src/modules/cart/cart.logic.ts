// Pure cart functions. Every update returns a NEW cart array, which is what
// React needs to detect a state change. No React, no localStorage here.
import type { Product } from '../products/products.types'
import type { Cart, CartLine } from './cart.types'

export function addItem(cart: Cart, productId: number): Cart {
  const isInCart = cart.some((item) => item.productId === productId)
  if (isInCart) {
    return changeQuantity(cart, productId, 1)
  }
  return [...cart, { productId, quantity: 1 }]
}

// amount is +1 or -1. An item whose quantity reaches 0 is removed.
export function changeQuantity(
  cart: Cart,
  productId: number,
  amount: number,
): Cart {
  return cart
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + amount }
        : item,
    )
    .filter((item) => item.quantity > 0)
}

export function removeItem(cart: Cart, productId: number): Cart {
  return cart.filter((item) => item.productId !== productId)
}

// Join cart items with their products. Items whose product no longer
// exists are skipped instead of crashing the page.
export function getCartLines(cart: Cart, products: Product[]): CartLine[] {
  const productsById = new Map(products.map((product) => [product.id, product]))

  return cart.flatMap((item) => {
    const product = productsById.get(item.productId)
    if (product === undefined) return []
    return [
      {
        product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      },
    ]
  })
}

// Works for saved items (the header badge, no products needed) and for cart lines.
export function getCartCount(items: { quantity: number }[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export function getCartTotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.subtotal, 0)
}
