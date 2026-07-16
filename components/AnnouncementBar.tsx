import Link from 'next/link'

export function AnnouncementBar() {
  return (
    <div className="bg-teal text-paper text-xs tracking-wide py-2 px-4 text-center">
      <Link href="/shop" className="hover:underline">
        🌾 Gluten-Free available now! Grab your bag today! →
      </Link>
    </div>
  )
}
