import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import StatusMessage from '@/shared/components/StatusMessage'

// Shown when the page calls notFound(): an invalid id or an API 404.
export default function ProductNotFound() {
  return (
    <Card as="section" aria-labelledby="product-not-found-title">
      <h1
        id="product-not-found-title"
        className="text-2xl leading-tight font-bold"
      >
        Product not found
      </h1>
      <StatusMessage tone="info" title="We could not find this product.">
        <ButtonLink href="/products" variant="secondary">
          Back to products
        </ButtonLink>
      </StatusMessage>
    </Card>
  )
}
