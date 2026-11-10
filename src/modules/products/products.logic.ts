// Pure functions: same input, same output. No React, no fetch, no localStorage,
// and they never change the arrays they receive.
import type { PriceRange, Product, ProductFilters } from './products.types'

export const DEFAULT_FILTERS: ProductFilters = {
  query: '',
  category: 'all',
  price: 'all',
  sort: 'featured',
}

// One entry per category, in the order they first appear in the data.
export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.category))]
}

export function matchesPrice(price: number, range: PriceRange): boolean {
  switch (range) {
    case 'under-50':
      return price < 50
    case '50-100':
      return price >= 50 && price <= 100
    case 'over-100':
      return price > 100
    case 'all':
      return true
  }
}

// Case-insensitive name search. An empty query matches every product.
export function matchesQuery(name: string, query: string): boolean {
  return name.toLowerCase().includes(query.trim().toLowerCase())
}

// Filter first, then sort, so search, filters, and sorting always work together.
export function getVisibleProducts(
  products: Product[],
  { query, category, price, sort }: ProductFilters,
): Product[] {
  const filtered = products.filter(
    (product) =>
      matchesQuery(product.name, query) &&
      (category === 'all' || product.category === category) &&
      matchesPrice(product.price, price),
  )

  // toSorted() returns a new array instead of reordering the original.
  if (sort === 'price-asc') {
    return filtered.toSorted((a, b) => a.price - b.price)
  }
  if (sort === 'price-desc') {
    return filtered.toSorted((a, b) => b.price - a.price)
  }
  return filtered
}
