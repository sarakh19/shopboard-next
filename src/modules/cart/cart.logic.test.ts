import { describe, expect, it } from 'vitest'
import type { Product } from '../products/products.types'
import {
  addItem,
  changeQuantity,
  getCartLines,
  getCartTotal,
} from './cart.logic'
import type { Cart } from './cart.types'

// Test data: two products that look like what the API returns.
const toteBag: Product = {
  id: 1,
  name: 'Leather Tote Bag',
  category: 'Bags',
  price: 89,
  inStock: true,
}
const backpack: Product = {
  id: 2,
  name: 'Canvas Backpack',
  category: 'Bags',
  price: 49,
  inStock: true,
}

describe('cart logic', () => {
  it('adding a product that is already in the cart increases its quantity instead of adding a second row, and does not change the old cart', () => {
    const cart: Cart = [{ productId: 1, quantity: 1 }]

    const updated = addItem(cart, 1)

    expect(updated).toEqual([{ productId: 1, quantity: 2 }])
    // React only re-renders when it gets a NEW array, so the old one must stay as it was.
    expect(cart).toEqual([{ productId: 1, quantity: 1 }])
    expect(updated).not.toBe(cart)
  })

  it('decreasing a quantity to zero removes the product from the cart', () => {
    const cart: Cart = [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 3 },
    ]

    const updated = changeQuantity(cart, 1, -1)

    expect(updated).toEqual([{ productId: 2, quantity: 3 }])
  })

  it('the cart total is price × quantity for every product, and skips products that no longer exist', () => {
    const cart: Cart = [
      { productId: 1, quantity: 2 }, // 2 × $89 = $178
      { productId: 2, quantity: 1 }, // 1 × $49 = $49
      { productId: 999, quantity: 5 }, // removed from the API: ignored
    ]

    const lines = getCartLines(cart, [toteBag, backpack])

    expect(lines).toHaveLength(2)
    expect(getCartTotal(lines)).toBe(227)
  })
})
