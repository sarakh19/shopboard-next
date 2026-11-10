import { Card } from '@/components/ui/Card'
import StatusMessage from './StatusMessage'

interface PageLoadingProps {
  title: string
  message: string
}

// The page title stays on screen while the data loads, so the layout does
// not jump. Used by every loading.tsx file.
function PageLoading({ title, message }: PageLoadingProps) {
  return (
    <Card as="section" aria-busy="true">
      <h1 className="text-2xl leading-tight font-bold">{title}</h1>
      <StatusMessage tone="info" title={message} />
    </Card>
  )
}

export default PageLoading
