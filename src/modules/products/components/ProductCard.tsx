import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '../../../shared/formatPrice'
import AddToCartButton from '../../cart/components/AddToCartButton'
import type { Product } from '../products.types'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card as="article" variant="outline" className="flex h-full flex-col gap-2">
      <Badge variant="neutral">{product.category}</Badge>
      <h3 className="text-[1.0625rem] font-bold">
        <Link
          href={`/products/${product.id}`}
          className="hover:text-primary hover:underline"
        >
          {product.name}
        </Link>
      </h3>
      <p className="text-lg font-bold">{formatPrice(product.price)}</p>
      <AddToCartButton product={product} />
    </Card>
  )
}

export default ProductCard
