import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

// One list of button styles. Button and ButtonLink both use it, so a link
// that looks like a button never copies the classes.
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-control border font-semibold no-underline transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover',
        secondary:
          'border-primary bg-transparent text-primary hover:bg-primary-soft',
        outline:
          'border-border bg-surface text-text hover:border-primary hover:text-primary',
        danger:
          'border-transparent bg-transparent text-danger underline hover:bg-danger-soft',
      },
      size: {
        sm: 'min-h-8 px-2 py-1 text-sm',
        md: 'min-h-10 px-4 py-2',
        icon: 'size-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

interface ButtonProps extends ComponentProps<'button'>, ButtonVariantProps {}

// type="button" by default, so a button inside a form never submits it by
// accident. A submit button says type="submit" on purpose.
export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

interface ButtonLinkProps
  extends ComponentProps<typeof Link>, ButtonVariantProps {}

// A Next.js <Link> (real navigation, prefetching) that looks like a button.
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
