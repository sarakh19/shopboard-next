// Cart persistence. This is the only module that touches localStorage.
//
// The cart is an "external store" that React reads with useSyncExternalStore.
// The server has no localStorage, so it always renders the empty cart
// (getServerCartSnapshot). After hydration the browser switches to the
// saved cart. Reading localStorage in useState instead would make the server
// HTML and the first browser render disagree (a hydration error).
import type { Cart, CartItem } from './cart.types'

// Versioned key: if the saved shape ever changes, old data is simply ignored.
const STORAGE_KEY = 'shopboard:cart:v1'

// One constant empty cart: useSyncExternalStore needs the same object on
// every call, or it re-renders forever.
const EMPTY_CART: Cart = []

// The current cart in memory. null until it is first read from localStorage.
let currentCart: Cart | null = null
const listeners = new Set<() => void>()

function isCartItem(value: unknown): value is CartItem {
  // The `in` checks let TypeScript narrow the type without an unsafe `as` cast.
  return (
    typeof value === 'object' &&
    value !== null &&
    'productId' in value &&
    'quantity' in value &&
    typeof value.productId === 'number' &&
    typeof value.quantity === 'number' &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0
  )
}

function loadCart(): Cart {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    // Valid JSON can still be the wrong shape, e.g. {} or "hello".
    if (!Array.isArray(saved)) return EMPTY_CART
    return saved.filter(isCartItem)
  } catch {
    // Corrupted JSON or blocked storage: start with an empty cart.
    return EMPTY_CART
  }
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener()
  }
}

// Another tab changed the cart: reload it, so every tab shows the same cart.
function handleStorage(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return
  currentCart = loadCart()
  notifyListeners()
}

export function subscribeToCart(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener('storage', handleStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('storage', handleStorage)
    }
  }
}

// Returns the same array until the cart changes, as React requires.
export function getCartSnapshot(): Cart {
  currentCart ??= loadCart()
  return currentCart
}

export function getServerCartSnapshot(): Cart {
  return EMPTY_CART
}

export function saveCart(cart: Cart): void {
  currentCart = cart
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Storage can be blocked (e.g. private browsing); the cart still works until reload.
  }
  notifyListeners()
}
