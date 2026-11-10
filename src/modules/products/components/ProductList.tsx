import type { Product } from '../products.types'
import ProductCard from './ProductCard'

interface ProductListProps {
  products: Product[]
}

// 1 column on phones, 2 from 600px, 3 from 960px.
function ProductList({ products }: ProductListProps) {
  return (
    <ul className="grid gap-4 min-[600px]:grid-cols-2 min-[960px]:grid-cols-3">
      {products.map((product) => (
        // The stable product ID is the key, never the array index.
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductList
