import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'

// Shared by Input and Select, so both form controls look the same.
// aria-invalid (set by the form when a field has an error) turns the border red.
export const controlClasses =
  'min-h-10 w-full min-w-0 rounded-control border border-border bg-surface px-3 py-2 text-text placeholder:text-muted aria-invalid:border-danger'

type InputProps = ComponentProps<'input'>

// Accepts every normal <input> prop. React 19 passes `ref` as a normal prop,
// so react-hook-form's register() works without forwardRef.
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(controlClasses, className)} {...props} />
}

type SelectProps = ComponentProps<'select'>

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn(controlClasses, className)} {...props} />
}
