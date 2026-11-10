import PageLoading from '@/shared/components/PageLoading'

// Shown instantly while app/products/[id]/page.tsx loads one product.
export default function Loading() {
  return <PageLoading title="Product details" message="Loading product…" />
}
