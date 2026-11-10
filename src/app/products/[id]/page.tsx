import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import ProductDetails from '@/modules/products/components/ProductDetails'
import { fetchProduct } from '@/modules/products/products.api'
import type { Product } from '@/modules/products/products.types'
import { ApiError } from '@/shared/api/client'

interface ProductDetailsPageProps {
  // In Next.js 16 the URL params arrive as a Promise.
  params: Promise<{ id: string }>
}

// GET /api/products/:id answers 404 for an unknown id. notFound() then shows
// not-found.tsx in this folder. Any other error goes to app/error.tsx.
async function loadProduct(id: number): Promise<Product> {
  try {
    return await fetchProduct(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }
}

// The /products/[id] page, e.g. /products/3.
export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { id } = await params
  const productId = Number(id)

  // No request for an id like "abc": it can never exist.
  if (!Number.isInteger(productId) || productId <= 0) notFound()

  const product = await loadProduct(productId)

  return (
    <Card as="section" aria-labelledby="product-title">
      <p>
        <Link href="/products" className="text-primary underline">
          ← Back to products
        </Link>
      </p>
      <h1 id="product-title" className="sr-only">
        Product details
      </h1>
      <ProductDetails product={product} />
    </Card>
  )
}
