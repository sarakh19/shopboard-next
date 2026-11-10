import PageLoading from '@/shared/components/PageLoading'

// Shown instantly while app/products/page.tsx loads the products.
export default function Loading() {
  return <PageLoading title="Products" message="Loading products…" />
}
