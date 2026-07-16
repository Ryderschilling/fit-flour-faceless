export interface Money {
  amount: number
  currency: string
}

export interface ProductVariant {
  id: string
  title: string
  price: Money
  available: boolean
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  images: { url: string; alt: string }[]
  variants: ProductVariant[]
  priceRange: { min: Money; max: Money }
  tags: string[]
}

export interface CartLine {
  id: string
  variantId: string
  productTitle: string
  variantTitle: string
  image: string
  unitPrice: Money
  quantity: number
}

export interface Cart {
  id: string
  lines: CartLine[]
  subtotal: Money
  totalQuantity: number
  checkoutUrl: string
}
