'use client'

import { useSyncExternalStore, type ReactNode } from 'react'
import type { Product } from '../../products/products.types'
import { CartContext } from '../cart.context'
import {
  addItem,
  changeQuantity,
  getCartCount,
  removeItem,
} from '../cart.logic'
import {
  getCartSnapshot,
  getServerCartSnapshot,
  saveCart,
  subscribeToCart,
} from '../cart.state'
import type { Cart } from '../cart.types'

interface CartProviderProps {
  children: ReactNode
}

// Nothing to subscribe to: isReady below only changes once, at hydration.
function subscribeToNothing() {
  return () => {}
}

// The one owner of the cart. The root layout wraps every page with it, so the
// header, the product pages, the cart page, and checkout all read the same
// cart without passing it through props.
function CartProvider({ children }: CartProviderProps) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  )
  // false on the server and during hydration, true once the saved cart has
  // been read. Pages use it to avoid flashing "Your cart is empty".
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  )

  // Every cart change goes through here. saveCart() stores the cart and tells
  // React to re-render. Saving in the action (an event) avoids a useEffect.
  function updateCart(nextItems: Cart) {
    saveCart(nextItems)
  }

  function addToCart(product: Product) {
    // An unavailable product can never enter the cart.
    if (!product.inStock) return
    updateCart(addItem(items, product.id))
  }

  function getQuantity(productId: number) {
    return items.find((item) => item.productId === productId)?.quantity ?? 0
  }

  const value = {
    items,
    isReady,
    // Derived from items during render, so it is not stored as state.
    count: getCartCount(items),
    getQuantity,
    addToCart,
    increase: (productId: number) =>
      updateCart(changeQuantity(items, productId, 1)),
    decrease: (productId: number) =>
      updateCart(changeQuantity(items, productId, -1)),
    remove: (productId: number) => updateCart(removeItem(items, productId)),
    clearCart: () => updateCart([]),
  }

  return <CartContext value={value}>{children}</CartContext>
}

export default CartProvider
