import { Card } from '@/components/ui/Card'
import ProductCatalog from '@/modules/products/components/ProductCatalog'
import { fetchProducts } from '@/modules/products/products.api'

// The /products page. A Server Component: it loads the products on the server
// through the shared API client. While it waits, Next.js shows loading.tsx;
// if the request fails, app/error.tsx shows the error with "Try again".
export default async function ProductsPage() {
  const products = await fetchProducts()

  return (
    <Card as="section" aria-labelledby="products-title">
      <h1 id="products-title" className="text-2xl leading-tight font-bold">
        Products
      </h1>
      <ProductCatalog products={products} />
    </Card>
  )
}
