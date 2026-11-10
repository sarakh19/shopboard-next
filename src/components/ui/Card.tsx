import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

const cardVariants = cva('grid gap-4 rounded-card border p-4', {
  variants: {
    variant: {
      // A page section: white surface with a shadow.
      panel: 'border-border bg-surface shadow-card',
      // A plain bordered box, e.g. a product card inside a panel.
      outline: 'border-border',
      // Status messages: info (loading, empty) and error.
      info: 'justify-items-start gap-3 border-dashed border-border text-muted',
      error:
        'justify-items-start gap-3 border-danger bg-danger-soft text-danger',
    },
  },
  defaultVariants: {
    variant: 'panel',
  },
})

// `as` keeps the HTML meaningful: a page is a <section>, a product is an
// <article>, the checkout summary is an <aside>. The look stays the same.
interface CardProps
  extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {
  as?: 'div' | 'section' | 'article' | 'aside'
}

export function Card({
  as: Element = 'div',
  variant,
  className,
  ...props
}: CardProps) {
  return (
    <Element className={cn(cardVariants({ variant }), className)} {...props} />
  )
}
