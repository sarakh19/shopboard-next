@AGENTS.md

# ShopBoard Next — Project Guidelines

## 1. Project Goal

ShopBoard moved from React + Vite (Day 4–5) to **Next.js App Router** with **Tailwind CSS only** and a small UI system in `src/components/ui` (Day 6).

My main goal is to learn and to be able to explain every component: what it does and why it was built that way. I prefer simple, readable code that follows the lectures. The lecture slides and assignment requirements are the main reference.

## 2. How Claude Should Work

- Follow my instructions and the lecture requirements. Do not add features, libraries, or design changes I did not ask for.
- Implement the task, then explain what changed, where, and why — short, in simple Arabic.
- If something outside the task needs changing, ask me first.
- This is Next.js 16: read the guide in `node_modules/next/dist/docs/` before using an API you are not sure about.

## 3. Project Structure

- `src/app/` — Routes and pages. Each page is written directly in its route's `page.tsx` (e.g. `app/products/[id]/page.tsx`), not in the modules. Also `layout.tsx` (header, footer, `CartProvider`), `loading.tsx`, `not-found.tsx`, `error.tsx`, and `globals.css`.
- `src/components/ui/` — The UI system: `Button` (+ `ButtonLink`), `Input` (+ `Select`), `Field`, `Card`, `Badge`, `Modal`.
- `src/components/` — Shared layout components: `Header`, `Footer`, `Hero`.
- `src/modules/products|cart|checkout/` — The same feature modules as the React project: types, API, logic, and components. No `pages/` folder: pages live in `src/app/` (instructor's requirement).
- `src/shared/api/client.ts` — The only file that calls `fetch`. Modules call `getJson(path, parse)`.
- `src/shared/components/` — `StatusMessage`, `PageLoading`. `src/shared/lib/utils.ts` holds `cn()`.

## 4. UI Rules

These rules keep the interface consistent. Follow them in every component.

**Styling**

- Tailwind utilities only. `src/app/globals.css` is the only CSS file. No CSS modules, no `style={{}}`, no new `.css` files.
- Use only the tokens from `@theme` in `globals.css`. Tailwind's default palette is removed (`--color-*: initial`), so `bg-blue-500` does not exist.
  - Colors: `bg`, `surface`, `text`, `muted`, `border`, `primary`, `primary-hover`, `primary-soft`, `on-primary`, `danger`, `danger-soft`, `success`, `overlay`.
  - Radius: `rounded-control` (buttons, inputs), `rounded-card` (cards, modal), `rounded-full` (count badge).
  - Font: `font-sans`. Shadow: `shadow-card`. Page width: `max-w-page`.
- A new color, radius, or font is added as a token in `@theme` first — never as a raw value like `bg-[#2f5bea]`.
- Dark mode comes from the tokens: `globals.css` redefines them under `prefers-color-scheme: dark`. Components do not use `dark:` classes.

**Components**

- Buttons, inputs, selects, labels, cards, badges, and dialogs always come from `@/components/ui`. Never copy their classes into a feature component.
- A link that looks like a button is `ButtonLink`, not a styled `<Link>`.
- New looks are new **variants** in the component's `cva()` list, with typed props (`VariantProps`). Do not add boolean props like `isRed`.
- Every UI component accepts `className` and merges it with `cn()`, so a page can adjust spacing. `cn()` knows our custom token names (see `utils.ts`); add new ones there.
- `Button` defaults to `type="button"`. A submit button says `type="submit"`.
- `Modal` is the native `<dialog>`; the parent owns `open` and handles `onClose`.

**Layout and responsiveness**

- Mobile first: base classes are for phones; add `min-[600px]:` and `min-[960px]:` for larger screens (the same breakpoints as the React project).
- No horizontal scroll at 375px wide.
- Each page is a `Card` (`as="section"`) with an `h1` (`text-2xl font-bold`).

**Accessibility**

- Semantic HTML (`section`, `article`, `aside`, `nav`, `dl`). Every control has a label (`Field`), and icon buttons have an `aria-label`.
- Invalid fields set `aria-invalid` and `aria-describedby` pointing to the `Field` error.
- Visible focus comes from the global `:focus-visible` style. Do not remove outlines.

## 5. Next.js, React, and TypeScript Rules

- Server Components by default. Add `'use client'` only where a component needs state, events, Context, or browser APIs — and as low in the tree as possible (`AddToCartButton`, not `ProductDetails`).
- Pages load data on the server with `await` through the module API (`fetchProducts()`), then pass plain data to Client Components as props.
- Every route that loads data has a `loading.tsx`. Errors go to `app/error.tsx` (with **Try again** → `retry()`). An unknown product calls `notFound()`.
- `cacheComponents` is on: runtime data (like `usePathname()` on a dynamic route) must be inside `<Suspense>`.
- The cart is read with `useSyncExternalStore` (`cart.state.ts`), never `useState(loadCart)` — the server has no `localStorage`. Use `isReady` before showing "Your cart is empty".
- Shared state (the cart) lives in `CartProvider`; other state stays in the nearest component (`filters` in `ProductCatalog`, the placed order in `CheckoutView`). Derived values are calculated during render.
- No `useEffect` for data loading, derived values, or saving. An Effect is only for syncing with a browser API (the `<dialog>` in `Modal`).
- Forms use react-hook-form + Zod; all rules live in `checkout.schema.ts`.
- Stable IDs as keys. No `any`, no `as` casts, no non-null assertions. Never mutate props or state.

## 6. Testing and Quality

After each task run `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run build`. Then test the affected pages in the browser at mobile and desktop sizes, in light and dark mode, and check the Console. Report only results that were actually run.

Before committing or pushing, show me the changes and the test results and wait for my approval.

## 7. Lessons Learned

Lessons 1–12 from the React project still apply (see the `shopboard-react` CLAUDE.md): keys from data, boolean conditions before `&&`, no mutation, check generated code, wait for the new page's content after navigation.

**Lesson 13 — `usePathname()` broke the build.** With `cacheComponents`, the header's `usePathname()` stopped the prerender of `/products/[id]`, because that URL is only known at request time.
**Rule:** Put runtime data on dynamic routes inside `<Suspense>` with a fallback that looks the same.

**Lesson 14 — `localStorage` and server rendering.** The server cannot read the saved cart, so `useState(loadCart)` would render a different cart on the server and in the browser (a hydration error).
**Rule:** Read browser-only data with `useSyncExternalStore` and a server snapshot.

**Lesson 15 — `cn()` did not know our tokens.** `rounded-full` and `rounded-control` both stayed on the "Out of stock" badge, so it looked wrong. tailwind-merge only knows Tailwind's default names.
**Rule:** When a token is added to `@theme`, add its name to `extendTailwindMerge` in `utils.ts` if it is a radius, shadow, or container.

**Lesson 16 — `LayoutProps` was unknown to `tsc`.** Next.js generates the route types; plain `tsc` ran before they existed.
**Rule:** `npm run typecheck` runs `next typegen` first.

**Lesson 17 — The modal closed itself in development.** React's StrictMode runs an Effect twice (open, close, open). The short close fired the dialog's `close` event, which called `onClose` and reset the parent's state. Production was fine, so only a dev-mode test found it.
**Rule:** An Effect must survive running twice. In an event that comes from cleanup, check the real state (`dialog.open`) before telling the parent. Test in `npm run dev` too, not only the production build.
