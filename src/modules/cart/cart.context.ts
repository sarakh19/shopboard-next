'use client'

import { createContext } from 'react'
import type { CartContextValue } from './cart.types'

// null means "no CartProvider above this component". useCart() turns that
// mistake into a clear error instead of a silent empty cart.
export const CartContext = createContext<CartContextValue | null>(null)
