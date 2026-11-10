import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type FieldError } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { checkoutSchema, type CheckoutFormValues } from '../checkout.schema'

interface CheckoutFormProps {
  onPlaceOrder: (values: CheckoutFormValues) => void
}

const EMPTY_VALUES: CheckoutFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
}

// The accessibility props every input needs: marked invalid and pointing to
// its error message only when there is an error.
function errorProps(id: string, error: FieldError | undefined) {
  return {
    'aria-invalid': error !== undefined,
    'aria-describedby': error === undefined ? undefined : `${id}-error`,
  }
}

// react-hook-form owns the field values and errors, so this form needs no
// useState. zodResolver runs checkoutSchema on blur, on change after a field
// was touched, and on submit.
function CheckoutForm({ onPlaceOrder }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: EMPTY_VALUES,
    mode: 'onTouched',
  })

  return (
    // noValidate: the schema shows our own messages instead of the browser's.
    // On an invalid submit, react-hook-form focuses the first invalid field.
    <form
      noValidate
      onSubmit={handleSubmit(onPlaceOrder)}
      className="grid gap-5"
    >
      <Field
        htmlFor="checkout-name"
        label="Full name"
        error={errors.fullName?.message}
      >
        <Input
          id="checkout-name"
          autoComplete="name"
          {...errorProps('checkout-name', errors.fullName)}
          {...register('fullName')}
        />
      </Field>

      <Field
        htmlFor="checkout-email"
        label="Email"
        error={errors.email?.message}
      >
        <Input
          id="checkout-email"
          type="email"
          autoComplete="email"
          {...errorProps('checkout-email', errors.email)}
          {...register('email')}
        />
      </Field>

      <Field
        htmlFor="checkout-phone"
        label="Phone"
        error={errors.phone?.message}
      >
        <Input
          id="checkout-phone"
          type="tel"
          autoComplete="tel"
          placeholder="0501234567"
          {...errorProps('checkout-phone', errors.phone)}
          {...register('phone')}
        />
      </Field>

      <Field
        htmlFor="checkout-address"
        label="Street address"
        error={errors.address?.message}
      >
        <Input
          id="checkout-address"
          autoComplete="street-address"
          {...errorProps('checkout-address', errors.address)}
          {...register('address')}
        />
      </Field>

      <Field htmlFor="checkout-city" label="City" error={errors.city?.message}>
        <Input
          id="checkout-city"
          autoComplete="address-level2"
          {...errorProps('checkout-city', errors.city)}
          {...register('city')}
        />
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Placing order…' : 'Place order'}
      </Button>
    </form>
  )
}

export default CheckoutForm
