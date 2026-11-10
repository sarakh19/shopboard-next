import { ButtonLink } from '@/components/ui/Button'

function Hero() {
  return (
    <section
      className="grid justify-items-start gap-3 pt-8 pb-6"
      aria-labelledby="hero-title"
    >
      <h1
        id="hero-title"
        className="text-3xl leading-tight font-bold min-[600px]:text-[2.5rem]"
      >
        Welcome to ShopBoard
      </h1>
      <p className="max-w-2xl text-muted">
        Browse bags, shoes, and accessories, then build your cart. Your cart is
        saved in this browser.
      </p>
      <ButtonLink href="/products">Browse products</ButtonLink>
    </section>
  )
}

export default Hero
