'use client' // Error boundaries must be Client Components.

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import StatusMessage from '@/shared/components/StatusMessage'

interface ErrorPageProps {
  error: unknown
  // Loads the page's data again and re-renders it.
  retry: () => void
}

// Catches an error in any page (for example, the API is down). The header and
// footer from the root layout stay on screen.
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  // In production Next.js hides server error messages, so this is only a hint.
  const reason = error instanceof Error ? ` ${error.message}` : ''

  return (
    <Card as="section" aria-labelledby="error-title">
      <h1 id="error-title" className="text-2xl leading-tight font-bold">
        Something went wrong
      </h1>
      <StatusMessage tone="error" title={`Could not load this page.${reason}`}>
        <Button onClick={retry}>Try again</Button>
      </StatusMessage>
    </Card>
  )
}
