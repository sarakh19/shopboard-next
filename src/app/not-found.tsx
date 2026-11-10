import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Shown for any URL that matches no route.
export default function NotFound() {
  return (
    <Card as="section" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="text-2xl leading-tight font-bold">
        Page not found
      </h1>
      <p>The page you are looking for does not exist.</p>
      <p>
        <ButtonLink href="/">Go to the home page</ButtonLink>
      </p>
    </Card>
  )
}
