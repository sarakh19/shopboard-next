'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

interface ModalProps {
  open: boolean
  // Called when the modal closes itself (Escape key or the × button).
  // The parent owns `open`, so it decides what closing means.
  onClose: () => void
  title: string
  className?: string
  children: ReactNode
}

// Built on the native <dialog> element: showModal() gives focus trapping,
// the Escape key, a backdrop, and "inert" page content for free.
export function Modal({
  open,
  onClose,
  title,
  className,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // The dialog is a browser API outside React, so an Effect keeps it in sync
  // with the `open` prop. The cleanup closes it when `open` becomes false or
  // the page is hidden.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || dialog === null) return
    dialog.showModal()
    return () => dialog.close()
  }, [open])

  // The browser fires "close" a moment after Escape or dialog.close().
  // In development, React runs the Effect twice (open, close, open again) to
  // find bugs. That short close also fires "close", but by then the dialog is
  // open again, so it must not tell the parent to close.
  function handleClose() {
    if (dialogRef.current?.open === true) return
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      className={cn(
        'm-auto w-[calc(100%-2rem)] max-w-md rounded-card border border-border bg-surface p-6 text-text shadow-card backdrop:bg-overlay',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id={titleId} className="text-xl font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-control px-2 text-xl leading-none text-muted hover:text-text"
        >
          ×
        </button>
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </dialog>
  )
}
