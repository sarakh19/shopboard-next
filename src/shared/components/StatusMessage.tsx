import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface StatusMessageProps {
  tone: 'info' | 'error'
  title: string
  // Optional extra content, such as a Retry button (composition via children).
  children?: ReactNode
}

// Loading, empty, no-match, not-found, and error messages all look the same.
function StatusMessage({ tone, title, children }: StatusMessageProps) {
  return (
    <Card variant={tone} role={tone === 'error' ? 'alert' : 'status'}>
      <p>{title}</p>
      {children}
    </Card>
  )
}

export default StatusMessage
