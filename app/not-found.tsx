import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-paper min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-8xl text-ink/10 mb-6">404</p>
      <h1 className="font-display text-4xl uppercase text-ink tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-muted text-base mb-10 max-w-sm">
        The page you're looking for doesn't exist. Head back to the shop.
      </p>
      <Link
        href="/shop"
        className="bg-teal text-paper text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-teal2 transition-colors"
      >
        Shop the Blends
      </Link>
    </div>
  )
}
