import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2 text-sm font-semibold',
  {
    variants: {
      variant: {
        // The cart count in the header.
        primary: 'min-w-6 bg-primary text-on-primary',
        // "2 in cart" on a product.
        success: 'px-0 text-success',
        // "Out of stock".
        danger: 'w-full rounded-control bg-danger-soft py-2 text-danger',
        // The category above a product name.
        neutral:
          'justify-start px-0 text-xs tracking-wide text-muted uppercase',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

interface BadgeProps
  extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
