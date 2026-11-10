import { Card } from '@/components/ui/Card'
import CartContents from '@/modules/cart/components/CartContents'
import { fetchProducts } from '@/modules/products/products.api'

// The /cart page. A Server Component: it loads the products (names and
// prices) on the server. The cart itself is read in the browser by CartContents.
export default async function CartPage() {
  const products = await fetchProducts()

  return (
    <Card as="section" className="max-w-3xl" aria-labelledby="cart-title">
      <h1 id="cart-title" className="text-2xl leading-tight font-bold">
        Your cart
      </h1>
      <CartContents products={products} />
    </Card>
  )
}
