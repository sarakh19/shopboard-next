import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge must know our own token names from globals.css (@theme),
// or it cannot tell that rounded-control and rounded-full set the same thing.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ['control', 'card'],
      shadow: ['card'],
      container: ['page'],
    },
  },
})

// Joins class names and lets later Tailwind classes win over earlier ones
// (for example, a variant over the base style, or a className prop over both).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
