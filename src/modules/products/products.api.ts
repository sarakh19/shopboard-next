import { getJson } from '../../shared/api/client'
import type { ApiProduct, Product } from './products.types'

const PRODUCTS_PATH = '/api/products'
const CENTS_PER_DOLLAR = 100

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// The network can return anything, so check the shape instead of trusting it.
function isApiProduct(value: unknown): value is ApiProduct {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.category_name === 'string' &&
    typeof value.price_cents === 'number' &&
    typeof value.in_stock === 'boolean'
  )
}

function parseProduct(data: unknown): ApiProduct {
  if (!isApiProduct(data)) {
    throw new Error('The server returned a product in an unexpected format')
  }
  return data
}

// The API answers { items: ApiProduct[], total: number }.
function parseProducts(data: unknown): ApiProduct[] {
  if (!isRecord(data) || !Array.isArray(data.items)) {
    throw new Error('The server returned products in an unexpected format')
  }
  const items: unknown[] = data.items
  if (!items.every(isApiProduct)) {
    throw new Error('The server returned products in an unexpected format')
  }
  return items
}

// Converts the API's field names and formats into the app's Product type.
// This is the only place that knows the API's names.
function toProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category: apiProduct.category_name,
    price: apiProduct.price_cents / CENTS_PER_DOLLAR,
    inStock: apiProduct.in_stock,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const apiProducts = await getJson(PRODUCTS_PATH, parseProducts)
  return apiProducts.map(toProduct)
}

// GET /api/products/:id. The API answers 404 for an unknown id.
export async function fetchProduct(id: number): Promise<Product> {
  const apiProduct = await getJson(`${PRODUCTS_PATH}/${id}`, parseProduct)
  return toProduct(apiProduct)
}
