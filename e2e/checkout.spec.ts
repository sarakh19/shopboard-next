import { expect, test } from '@playwright/test'

// Uses the real ShopBoard API, so it needs an internet connection.
test('a shopper can add a product, check out, and see the order confirmation with an empty cart', async ({
  page,
}) => {
  const mainNav = page.getByRole('navigation', { name: 'Main' })
  const cartLink = mainNav.getByRole('link', { name: /Cart/ })

  // 1. Products page: add the Leather Tote Bag to the cart.
  await page.goto('/products')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Products' }),
  ).toBeVisible()
  const toteBag = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'Leather Tote Bag' }) })
  await toteBag.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(toteBag.getByText('1 in cart')).toBeVisible()
  await expect(cartLink).toContainText('1')

  // 2. Cart page: the product is there; go to checkout.
  await cartLink.click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Your cart' }),
  ).toBeVisible()
  // Search inside the cart section only: Next.js keeps the previous page
  // (/products) hidden in the DOM, and it also contains this name.
  await expect(
    page
      .getByRole('region', { name: 'Your cart' })
      .getByText('Leather Tote Bag'),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Go to checkout' }).click()

  // 3. Checkout: fill in the form and place the order.
  await expect(
    page.getByRole('heading', { level: 1, name: 'Checkout' }),
  ).toBeVisible()
  await page.getByLabel('Full name').fill('Sara Ahmed')
  await page.getByLabel('Email').fill('sara@example.com')
  await page.getByLabel('Phone').fill('0501234567')
  await page.getByLabel('Street address').fill('12 King Road')
  await page.getByLabel('City').fill('Riyadh')
  await page.getByRole('button', { name: 'Place order' }).click()

  // 4. The confirmation modal opens and the cart is empty.
  const dialog = page.getByRole('dialog', { name: 'Thank you, Sara Ahmed!' })
  await expect(dialog).toBeVisible()
  await expect(cartLink).toContainText('0')

  // 5. "Continue shopping" closes the modal and opens the products page.
  await dialog.getByRole('button', { name: 'Continue shopping' }).click()
  await expect(page).toHaveURL('/products')
  await expect(dialog).toBeHidden()
})
