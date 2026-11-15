import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CheckoutForm from './CheckoutForm'

describe('CheckoutForm', () => {
  it('submitting an empty form shows an error for every field and does not place the order', async () => {
    const user = userEvent.setup()
    // vi.fn() is a fake function that remembers how it was called.
    const onPlaceOrder = vi.fn()
    render(<CheckoutForm onPlaceOrder={onPlaceOrder} />)

    await user.click(screen.getByRole('button', { name: 'Place order' }))

    // One error message (role="alert") for each of the five fields.
    expect(await screen.findAllByRole('alert')).toHaveLength(5)
    expect(screen.getByLabelText('Full name')).toHaveAccessibleDescription(
      'Enter your full name (at least 2 characters).',
    )
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(onPlaceOrder).not.toHaveBeenCalled()
  })

  it('a correctly filled form places the order once, with the spaces trimmed', async () => {
    const user = userEvent.setup()
    const onPlaceOrder = vi.fn()
    render(<CheckoutForm onPlaceOrder={onPlaceOrder} />)

    await user.type(screen.getByLabelText('Full name'), '  Sara Ahmed  ')
    await user.type(screen.getByLabelText('Email'), 'sara@example.com')
    await user.type(screen.getByLabelText('Phone'), '0501234567')
    await user.type(screen.getByLabelText('Street address'), '12 King Road')
    await user.type(screen.getByLabelText('City'), 'Riyadh')
    await user.click(screen.getByRole('button', { name: 'Place order' }))

    expect(onPlaceOrder).toHaveBeenCalledTimes(1)
    // The first argument is the form values (react-hook-form also passes the event).
    expect(onPlaceOrder.mock.calls[0][0]).toEqual({
      fullName: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '0501234567',
      address: '12 King Road',
      city: 'Riyadh',
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
