import CheckoutView from '@/modules/checkout/components/CheckoutView'
import { fetchProducts } from '@/modules/products/products.api'

// The /checkout page. A Server Component: it loads the products for the
// order summary on the server. The form and the cart run in CheckoutView.
export default async function CheckoutPage() {
  const products = await fetchProducts()
  return <CheckoutView products={products} />
}
