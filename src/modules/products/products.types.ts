// Exactly what the API sends for one product. Only products.api.ts uses it.
export interface ApiProduct {
  id: number
  title: string
  category_name: string
  price_cents: number
  in_stock: boolean
}

// The app's own product type, produced by toProduct() in products.api.ts.
export interface Product {
  id: number
  name: string
  category: string
  price: number
  inStock: boolean
}

export type PriceRange = 'all' | 'under-50' | '50-100' | 'over-100'

export type SortOrder = 'featured' | 'price-asc' | 'price-desc'

export interface ProductFilters {
  query: string
  category: string
  price: PriceRange
  sort: SortOrder
}
