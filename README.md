# ShopBoard Next

ShopBoard rebuilt with **Next.js (App Router)**, **Tailwind CSS only**, and a small typed UI
system. It keeps the same feature modules and the same API client as the React version.

Users can browse products from the [ShopBoard API](https://shopboard-api.vercel.app), search,
filter, and sort them, open a product page, add products to a cart that survives a refresh, and
check out with a validated form.

## Technology stack

| Area      | Tools                                                                |
| --------- | -------------------------------------------------------------------- |
| Framework | Next.js 16 App Router (Server Components, `cacheComponents`)         |
| UI        | React 19, `components/ui` built with `class-variance-authority`      |
| Styling   | Tailwind CSS 4 — tokens in `@theme`, light and dark mode             |
| State     | React Context + `useSyncExternalStore` for the cart (`localStorage`) |
| Forms     | react-hook-form, Zod                                                 |
| Language  | TypeScript (strict)                                                  |
| Quality   | ESLint (`next/core-web-vitals`, `next/typescript`), Prettier         |
| Hosting   | Vercel                                                               |

## Getting started

```bash
npm install
npm run dev           # http://localhost:3000
npm run typecheck     # generate route types + tsc
npm run lint          # ESLint, zero warnings
npm run format:check  # Prettier
npm run build         # production build
```

## Routes

Each page is written directly in its route's `page.tsx` inside `src/app/`. The pages use the
components, API, and logic from the feature modules.

| URL              | Page file                    | Loading / not found / error              |
| ---------------- | ---------------------------- | ---------------------------------------- |
| `/`              | `app/page.tsx`               | —                                        |
| `/products`      | `app/products/page.tsx`      | `products/loading.tsx`                   |
| `/products/[id]` | `app/products/[id]/page.tsx` | `[id]/loading.tsx`, `[id]/not-found.tsx` |
| `/cart`          | `app/cart/page.tsx`          | `cart/loading.tsx`                       |
| `/checkout`      | `app/checkout/page.tsx`      | `checkout/loading.tsx`                   |
| any other URL    | `app/not-found.tsx`          |                                          |

`app/error.tsx` catches a failed request on any page and shows **Try again**.

## Folder structure

```
src/
  app/                  routes and pages (page.tsx), layout, loading, not-found, error, globals.css
  components/
    ui/                 Button, Input, Field, Card, Badge, Modal
    Header, Footer, Hero
  modules/
    products/           products.api / logic / types, components
    cart/               cart.state / logic / context / types, useCart, components
    checkout/           checkout.schema, components
  shared/
    api/client.ts       the only fetch (getJson, ApiError)
    components/         StatusMessage, PageLoading
    lib/utils.ts        cn()
```

## UI system (`src/components/ui`)

Every component has typed props, accepts `className`, and is used everywhere instead of
copying classes.

| Component         | Variants / props                                                            | Used in                                       |
| ----------------- | --------------------------------------------------------------------------- | --------------------------------------------- |
| `Button`          | `variant`: primary, secondary, outline, danger · `size`: sm, md, icon       | toolbar, cart rows, checkout, error, modal    |
| `ButtonLink`      | same variants, a Next.js `<Link>`                                           | hero, empty cart, not-found, checkout         |
| `Input`, `Select` | all native props; red border when `aria-invalid`                            | toolbar, checkout form                        |
| `Field`           | `htmlFor`, `label`, `error`                                                 | toolbar, checkout form                        |
| `Card`            | `variant`: panel, outline, info, error · `as`: div, section, article, aside | every page, product card, `StatusMessage`     |
| `Badge`           | `variant`: primary, success, danger, neutral                                | cart count, "in cart", out of stock, category |
| `Modal`           | `open`, `onClose`, `title` (native `<dialog>`)                              | order confirmation at checkout                |

Design tokens (colors, radius, font, shadow, page width) live in `@theme` in
`src/app/globals.css`. Dark mode redefines the token values, so components need no `dark:`
classes. The UI rules are in `CLAUDE.md`.

## Server and Client Components

| Server (render on the server)                                                                           | Client (`'use client'`)                                                                                             |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| all pages (they `await` the API), `ProductDetails`, `ProductCard`\*, `Hero`, `Footer`, `Card`, `Button` | `CartProvider`, `Header`, `ProductCatalog`, `AddToCartButton`, `CartContents`, `CheckoutView`, `Modal`, `error.tsx` |

\* `ProductCard` has no directive; it runs in the browser because `ProductCatalog` (a Client
Component) renders it.

## State ownership

| State                  | Owner                                                        | Why                                          |
| ---------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| Cart items             | `CartProvider` (`useSyncExternalStore` over `cart.state.ts`) | every page needs it; saved in `localStorage` |
| Filters                | `ProductCatalog`                                             | only the toolbar and the list use them       |
| Placed order (name)    | `CheckoutView`                                               | only checkout shows the confirmation modal   |
| Form values and errors | react-hook-form in `CheckoutForm`                            | validated by `checkoutSchema`                |
| Products               | not state — loaded by each page on the server                | passed down as props                         |

## Deploy

Deployed on Vercel: _add the link here after deploying._
