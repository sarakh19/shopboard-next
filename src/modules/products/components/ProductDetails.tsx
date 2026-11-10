import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '../../../shared/formatPrice'
import AddToCartButton from '../../cart/components/AddToCartButton'
import type { Product } from '../products.types'

interface ProductDetailsProps {
  product: Product
}

// A Server Component: no state or events, so it renders on the server.
// Only AddToCartButton inside it runs in the browser.
function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <article className="grid max-w-lg justify-items-start gap-3">
      <Badge variant="neutral">{product.category}</Badge>
      <h2 className="text-[1.75rem] leading-tight font-bold">{product.name}</h2>
      <p className="text-lg font-bold">{formatPrice(product.price)}</p>
      <p className="text-muted">
        {product.inStock ? 'In stock' : 'Currently unavailable'}
      </p>
      <AddToCartButton product={product} />
    </article>
  )
}

export default ProductDetails
