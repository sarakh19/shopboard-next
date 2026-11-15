# ShopBoard Next vs. the reference

A comparison of this project with the instructor's reference,
[yaman3bd/shopboard-reference](https://github.com/yaman3bd/shopboard-reference).

## How I studied the reference

I followed the order from its README ("How to learn from this repo"):

1. **Ran it first.** `npm install`, `cp .env.example .env.local`, `npm run dev`. I went through
   every page with Playwright at 375px (dark) and 1280px (light): home, `/products` with a
   category and a sort in the URL, `/products/1`, `/products/999` (not found), `/cart`,
   `/checkout`, and a full purchase with the demo card `4242 4242 4242 4242` ending on
   `/checkout/success`. I submitted the empty checkout form (9 field errors) and posted a review
   containing `spam` (it showed at once, then rolled back with "Your review looks like spam.
   Nothing was saved." and the text came back into the form). No page scrolled sideways at 375px.
2. **Tried every API state** by restarting `npm run dev` with a different `NEXT_PUBLIC_API_URL`:
   - `/api/delay/3000`: skeletons first (15 on the home page, 32 on `/products`, 27 on a product
     page), then the real content.
   - `/api/fail/500`: every route shows its own error message ("We couldn't load the products",
     "We couldn't load your cart", …) with **Try again**. The only Console errors were the expected
     `ApiError` logs.
   - `/api/empty`: `/products` shows "0 products" and a no-match message; the cart and checkout
     show their empty states.
3. **Read the docs:** README, CLAUDE.md, DESIGN.md, AGENTS.md.
4. **Read `package.json`**, then the structure (`app/`, `components/`, `modules/`, `lib/`).
5. **Followed one feature end to end:** the cart, from `AddToCartButton` → `useCartStore`
   (`modules/cart/store.ts`) → `CartView` → `toRows()` / `subtotal()` → `PriceSummary`. I also
   followed reviews: `ReviewForm` → `ReviewSection` (`useOptimistic`) → `optimistic.ts` →
   `api.ts` → `app/api/[...path]/route.ts`.
6. **Read the history:** `git log` has 10 small commits in build order (setup → UI tokens → API →
   lib → layout → products → cart → checkout → reviews → docs). Mine has one big commit.

---

## 1. Structure

**What I did.** `src/app` for routes, `src/components/ui` for the UI kit, `src/components` for
Header/Footer/Hero, `src/modules/<feature>` with files named after the module
(`products.api.ts`, `cart.logic.ts`, `checkout.schema.ts`), and `src/shared` for the API client,
shared components and `cn()`. Components are PascalCase files (`ProductCard.tsx`).

**What the reference does.** No `src/`. Files in a module are named for their job, not the module:
`modules/products/types.ts`, `api.ts`, `filters.ts`, `images.ts`. Files are kebab-case
(`product-card.tsx`). Layout parts live in `components/layout/`, helpers in `lib/`. It writes down
the import direction: `components/ui` never imports from `modules/`, a module never imports from
`app/`, and products knows nothing about the cart.

**What I will take, and why.**

- **The written import rules.** My code already follows them, but nothing says so. Writing them in
  CLAUDE.md stops a future change (mine or the AI's) from making a circle between modules.
- **Job-named files (`types.ts`, `api.ts`).** `products/products.types.ts` says "products" twice;
  the folder already tells you the module. I'll rename when I next touch a module, in its own
  commit, so the history stays readable.
- I will **keep** `src/` and PascalCase file names. They are a style choice, not a mistake, and
  the lectures use them.

## 2. API client

**What I did.** `src/shared/api/client.ts` is the only `fetch`. `getJson(path, parse)` checks
`response.ok`, throws `ApiError(status)`, and hands the `unknown` JSON to a `parse` function that
each module writes (`isApiProduct`, `parseProducts`). The base URL is a constant pointing to the
external `shopboard-api.vercel.app`.

**What the reference does.** `lib/api-client.ts` exports `api<T>(path, { method, body })`. It
supports GET, POST and DELETE, turns a network failure into `ApiError(0, "Can't reach the
server.")`, reads the server's `{ error }` message, and handles an empty `204` body. It does
**not** check the shape: "it is our own API, so we trust its shape." The base URL comes from
`NEXT_PUBLIC_API_URL`, so the delay/fail/empty states are tried by changing `.env.local`, not the
code. It also owns its API in `app/api/[...path]/route.ts`.

**What I will take, and why.**

- **`NEXT_PUBLIC_API_URL` from `.env.local` (+ `.env.example`).** To test my loading and error
  states I have to edit `BASE_URL` in the code and remember to undo it. An environment variable
  makes it a config change, and it's how a real app points to staging vs. production.
- **The server's error message and the network-error case.** My `ApiError` always says
  "Request failed with status 500"; the reference shows what the server actually said.
- **`method` and `body` support**, the next time I need a POST (placing a real order).
- **`getProduct()` returns `null` for a 404** and the page calls `notFound()`. That's cleaner than
  my `loadProduct()` helper inside the page that catches the error and calls `notFound()` itself.

## 3. Types and schemas

**What I did.** `ApiProduct` (what the API sends) and `Product` (what the app uses), with
`toProduct()` renaming fields (`title` → `name`) and converting `price_cents` to dollars
(`price: 18`). Runtime type guards check every product. Zod only for the checkout form.

**What the reference does.** Same split, but `Product extends ApiProduct` and only adds `image`;
field names stay as the API sends them. **Prices stay integers in cents** everywhere and are only
turned into text by `formatPrice()`. `CATEGORIES` is a typed `as const` list, so `Category` is a
union, not `string`. Zod only for forms (checkout, reviews).

**What I will take, and why.**

- **Keep prices in cents.** My `price * quantity` and the total use floating-point dollars. With
  a price of 18.10, three of them come to `54.300000000000004` in JavaScript; formatting hides it today,
  but a sum is where it breaks. Integers can't have that problem.
- **Category as a union type**, so a typo like `'Notebok'` is a compile error.

## 4. State

**What I did.** The cart is a hand-written external store (`cart.state.ts`) read with
`useSyncExternalStore` inside `CartProvider` (Context). It validates what it loads from
`localStorage`, uses a versioned key, and syncs between tabs with the `storage` event. Pure logic
is in `cart.logic.ts` (with unit tests). Filters are `useState` in `ProductCatalog`.

**What the reference does.** The cart is a **Zustand** store with `persist`, `partialize` and
`version`. Components select one value (`useCartStore((s) => s.add)`) so they only re-render when
that value changes. `useHydrated()` waits for the saved cart, with a `Skeleton` until then.
**Filters, search and sort live in the URL** (`?category=&q=&sort=`), read on the server.
Reviews use `useState` (confirmed) + `useOptimistic` (in flight).

**What I will take, and why.**

- **Filters in the URL.** This is the biggest gap I found. With my `useState`, a filtered list
  can't be shared or bookmarked, Back doesn't undo a filter, and a refresh loses it. In the
  reference the server already sends the filtered list.
- **A named `useHydrated()` hook.** I already do the same thing inline in `CartProvider`
  (`isReady`), but a small hook in `lib/` can be reused and is easier to explain.
- **Selecting only what a component needs.** With one Context, every `useCart()` consumer
  re-renders on any cart change. It doesn't matter at this size, but it's the right habit.
- I will **not** switch to Zustand now. My store does the same job in ~90 lines that I can explain
  line by line, which is the goal of this course. If the app grows more shared state, Zustand is
  the next step.

## 5. Forms

**What I did.** react-hook-form + Zod, all rules in `checkout.schema.ts` (name, email, phone,
address, city) with messages that say what to do. Every input uses `Field` with
`aria-invalid` / `aria-describedby`. A component test (`CheckoutForm.test.tsx`) checks it.

**What the reference does.** The same pattern, plus a delivery option (radio group) and a demo
payment section: a **Luhn check** on the card number, an `MM/YY` regex, an expiry check, and a
CVC rule. Only `cardLast4` is sent. A reusable `TextField` wraps label + input + error. The review
form gives the text back on failure with `form.reset(values)`.

**What I will take, and why.**

- **`form.reset(values)` after a failed submit**, as soon as my form sends anything to an API.
  Losing what the user typed is the worst kind of error.
- **One `TextField` helper** for the "label + input + error" block that I repeat five times in
  `CheckoutForm`.
- The payment fields are a nice extra but are not in my assignment, so I won't add them.

## 6. Loading, error, and not-found

**What I did.** A `loading.tsx` for every route that loads data, `not-found.tsx` for unknown
products, a global `not-found.tsx`, and **one** `app/error.tsx` with **Try again** → `retry()`.
The header's `usePathname()` is inside `<Suspense>` (Lesson 13).

**What the reference does.** Every route has its **own** `error.tsx` with a specific title, all
rendering one shared `ErrorMessage` that logs the error in an Effect. Loading uses `Skeleton`s that
look like the real layout. The product page uses **parallel routes** (`@reviews`, `@related`),
each with its own `loading.tsx`, `error.tsx` and `default.tsx`, so a slow or broken slot never
takes the product down. The home page streams featured products with `<Suspense>`.

**What I will take, and why.**

- **One `error.tsx` per route**, using a shared component. "We couldn't load your cart" helps
  more than "Something went wrong", and the error stays inside the route instead of replacing the
  whole page area.
- **Skeletons that match the layout** instead of my generic `PageLoading` message: the page doesn't
  jump when the content arrives.
- I noticed one small issue in the reference: with `/api/fail/500`, a failed **product** page shows
  "We couldn't load the products", because `app/products/[id]/` has no `error.tsx` and the parent's
  message is used. A route-level `error.tsx` for `[id]` would fix it.

## 7. UI kit and tokens

**What I did.** My own UI kit in `src/components/ui`: `Button` + `ButtonLink`, `Input` + `Select`,
`Field`, `Card` (polymorphic `as`), `Badge`, `Modal` (native `<dialog>`). All use `cva()` variants
and `cn()`. My own tokens in `@theme` with **the default palette removed** (`--color-*: initial`),
so `bg-blue-500` can't be used by mistake. Dark mode by redefining the tokens under
`prefers-color-scheme`, no `dark:` classes.

**What the reference does.** shadcn/ui (Base UI) components, copied into `components/ui` and
generated by the CLI: `AlertDialog`, `Sheet` (mobile menu), `Select`, `RadioGroup`, `Empty`,
`Skeleton`, `Sonner` toasts. Tokens follow shadcn's names (`bg-primary`,
`text-muted-foreground`) mapped from the Clay design system in `DESIGN.md`. Dark mode is a class
toggled by `next-themes`, with a toggle in the navbar. A link that looks like a button is
`<Button render={<Link />} nativeButton={false}>`.

**What I will take, and why.**

- **`Skeleton` and `Empty` as UI components.** Today my `StatusMessage` covers both; separate
  components give each state its own clear look.
- **A design doc (`DESIGN.md`)** that explains the tokens and when to use each one. My rules are
  in CLAUDE.md, but there is no place that shows the design as a whole.
- **A confirm step before destructive actions** (the reference asks before "Clear cart").
- I will **keep** my own kit instead of shadcn: building it was the Day 6 assignment, and I can
  explain every class in it.

## 8. Tooling

**What I did.** ESLint (`--max-warnings 0`, no `any`, no `!`, `consistent-type-imports`),
Prettier, `typecheck` = `next typegen && tsc`. **Vitest** unit + component tests and a
**Playwright** E2E test of the full purchase.

**What the reference does.** The same lint/typecheck/format scripts, plus
`consistent-type-assertions: never` (blocks `as` casts), the Tailwind Prettier plugin (sorts
classes), and **husky + lint-staged**: a pre-commit hook runs ESLint and Prettier on the files
you commit. No tests at all — its README lists tests under "Ideas to build next".

**What I will take, and why.**

- **`consistent-type-assertions: never`.** My CLAUDE.md says "no `as` casts", but only a person
  checks it. A lint rule checks it every time.
- **husky + lint-staged.** A bad commit is stopped before it exists, not after CI.
- **`prettier-plugin-tailwindcss`**, so the class order is the same in every file and diffs are
  smaller.

## 9. CLAUDE.md

**What I did.** ~110 lines: project goal (learning), how Claude should work, structure, UI rules,
Next.js/React/TypeScript rules, testing, and **Lessons 13–18**, each with what happened and the
rule that came from it.

**What the reference does.** Short, rule-only sections: Read first, Stack, Commands, Structure,
Data, Routes and states, Server and client, State, Optimistic UI, Forms and payment, UI, Naming,
**"Adding a module"** (a 7-step recipe), and **"Rules from mistakes we fixed"** (one line each).
It points the AI to `DESIGN.md` and to the skills in `.claude/skills/`.

**What I will take, and why.**

- **An "Adding a module" checklist.** It turns my rules into steps, so a new feature (by me or by
  the AI) starts in the right place and ends with the checks.
- **A "Data" section** that says who decides what: the API decides prices and totals, the browser
  only shows a preview; a missing item is `null` → `notFound()`.
- **Pointing to the skills** I already have in `.claude/skills/`; today nothing tells the AI to use
  them.

---

## What I did better

The reference is the stronger app overall, but it isn't right everywhere:

1. **I have tests; the reference has none.** Unit tests for the cart logic, a component test for
   the checkout form, and an E2E test of the whole purchase. My CLAUDE.md also requires running
   them after every task. The reference relies on lint and typecheck only.
2. **I check the API's data at runtime.** The reference trusts `api<T>()` and its JSON with no
   check (`const data: T = JSON.parse(text)` is a type assertion in disguise). That's fine for its
   own API, but my app calls an **external** API, and the reference's own CLAUDE.md says an outside
   API needs a check. If the shape changes, my app shows a clear error instead of rendering
   `undefined`.
3. **My saved cart is validated and synced between tabs.** `loadCart()` drops anything that isn't
   a valid `{ productId, quantity }` and survives corrupt JSON or blocked storage. A `storage`
   listener keeps every open tab in sync. Zustand's `persist` does neither out of the box.
4. **The default Tailwind palette is removed.** In my project `bg-blue-500` doesn't exist, so the
   token rule is enforced by the build. In the reference, nothing stops a default color.
5. **Lessons with the story, not just the rule.** My lessons say what broke and why (e.g. Lesson
   17: StrictMode running the `<dialog>` Effect twice). That's what lets me explain a rule, not just
   follow it.
6. **`Button` defaults to `type="button"`** and the rule is written down, so a button inside a form
   can't submit it by accident.
7. **A small detail in the reference:** the failed product page uses the products list's error
   title (see section 6). Mine is generic, but it is never wrong.

## My grade

**78 / 100 (C+ / B−)**

Why not higher: compared with the reference, my app is missing things that matter in a real
store. Filters aren't in the URL, there is only one error boundary, loading is a message instead
of skeletons, prices are stored as floating-point dollars, the API URL is hard-coded (trying a
state means editing code), there's no pre-commit hook, and the whole project is **one commit**,
so its history tells nothing. The reference also does more (its own API, optimistic reviews,
parallel routes, a success page backed by the API), though some of that was beyond my assignment.

Why not lower: everything my assignment asked for works and is checked. The structure is
modular, there is exactly one `fetch`, the cart is SSR-safe with no hydration errors, forms are
fully validated and accessible, the UI kit and tokens are consistent in light and dark mode, and
I have real tests (unit, component, E2E) that the reference doesn't. Most of all, I can explain
every file, which was the goal I set in CLAUDE.md.

**Next steps, in order:** filters in the URL → `NEXT_PUBLIC_API_URL` + `.env.example` → prices in
cents → an `error.tsx` per route + skeletons → husky + lint-staged + the `as` lint rule → small,
focused commits from now on.
