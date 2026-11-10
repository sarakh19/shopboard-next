import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface FieldProps {
  // Must match the id of the control inside, so the label is connected to it.
  htmlFor: string
  label: string
  // The validation message. The control should point to it with
  // aria-describedby={`${htmlFor}-error`}.
  error?: string
  className?: string
  children: ReactNode
}

// A label, a form control, and its error message, always laid out the same way.
export function Field({
  htmlFor,
  label,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('grid gap-1', className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {/* role="alert" makes screen readers announce the message when it appears. */}
      {error !== undefined && (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
