# Fit Flour — Custom Next.js Frontend

Custom storefront for [fitflour.shop](https://fitflour.shop) built with Next.js 14 (App Router) + Tailwind CSS, deployed to Vercel. Commerce backend is Wix Headless — connected via a clean interface in `lib/commerce/`.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS (custom design system)
- `next/font` (Anton + Inter)
- `next/image`
- React context cart (`lib/cart-context.tsx`)

## Commerce Interface

All UI routes through `lib/commerce/index.ts`. The mock implementation (`lib/commerce/mock.ts`) powers dev. To go live with Wix:

1. Create `lib/commerce/wix.ts` implementing `Commerce`
2. Change the single line in `lib/commerce/index.ts`:
   ```ts
   export const commerce: Commerce = wixCommerce  // was mockCommerce
   ```
3. No component files need to change.

## Wix Backend (for integration)
- Site ID: `83d37fd7-6b98-4691-9794-e1766c102143`
- Stores API: V1 (`/stores/v1/*`)
- Stores appId: `215238eb-22a5-4c36-9e7b-e7c08025e04e`
- Products:
  - `df19c1f7-07d8-a265-42f8-e8dfa824cc6e` (handle: `power-flour`)
  - `f664d852-095d-28e0-3622-4921f4260cde` (handle: `gluten-free-limited-supply`)

## Dev

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub → connect to Vercel → auto-deploys on push to `main`.
