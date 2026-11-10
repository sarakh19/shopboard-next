import { z } from 'zod'

// Every checkout validation rule lives in this one schema. The form type is
// inferred from it, so the rules and the TypeScript type can never disagree.
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name (at least 2 characters).'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address, like name@example.com.')),
  phone: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/, 'Enter a phone number of 7 to 15 digits.'),
  address: z
    .string()
    .trim()
    .min(5, 'Enter your street address (at least 5 characters).'),
  city: z.string().trim().min(2, 'Enter your city.'),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
