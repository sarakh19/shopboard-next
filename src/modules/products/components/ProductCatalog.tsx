'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import StatusMessage from '../../../shared/components/StatusMessage'
import {
  DEFAULT_FILTERS,
  getCategories,
  getVisibleProducts,
} from '../products.logic'
import type { Product, ProductFilters } from '../products.types'
import ProductList from './ProductList'
import ProductToolbar from './ProductToolbar'

interface ProductCatalogProps {
  // Loaded on the server by ProductsPage, so they are ready here.
  products: Product[]
}

// A Client Component: the filters change with every key press, so this part
// runs in the browser. The products themselves come from the server.
function ProductCatalog({ products }: ProductCatalogProps) {
  // Only the toolbar and the list below it use the filters,
  // so this component (their nearest common parent) owns them.
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS)

  if (products.length === 0) {
    return <StatusMessage tone="info" title="No products are available yet." />
  }

  // Derived during render: no extra state, no effect.
  const visibleProducts = getVisibleProducts(products, filters)

  return (
    <>
      <ProductToolbar
        categories={getCategories(products)}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
      <p className="text-sm text-muted" aria-live="polite">
        Showing {visibleProducts.length} of {products.length} products
      </p>
      {visibleProducts.length > 0 ? (
        <ProductList products={visibleProducts} />
      ) : (
        <StatusMessage tone="info" title="No products match these filters.">
          <Button
            variant="secondary"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Reset filters
          </Button>
        </StatusMessage>
      )}
    </>
  )
}

export default ProductCatalog
