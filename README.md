# My Webstore

A generic, production-ready Next.js e-commerce storefront.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Auth & DB**: Supabase
- **Payments**: Stripe
- **Animations**: GSAP

## Getting Started

```bash
npm install
npm run dev
```

## Configuration

Copy `.env.example` to `.env.local` and fill in your credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Customization

### Store Name & Branding
- Update `app/layout.tsx` for site title and description
- Replace `/public/images/logos/store-logo.png` with your logo
- Update store name in `components/layout/Navbar.tsx` and `components/layout/Footer.tsx`

### Products & Brands
- Edit `lib/data.ts` to add your real brands and products
- Replace placeholder images in `/public/images/brands/` with real product photos
- Replace `/public/images/logos/*.png` with real brand logos
- Replace `/public/images/homepage/*.jpg` with your hero/banner images

### Pages
All storefront pages are in `app/(storefront)/`. Admin pages are in `app/admin/`.

## Features

- Product catalog with brand, flavor, and strength filtering
- Product variant selector (strengths, flavors, pack sizes)
- Bundle products
- Shopping cart with drawer
- Checkout with Stripe
- Customer accounts (Supabase Auth)
- Order history
- Admin dashboard (products, brands, orders, discounts, reviews)
- Age gate
- Search overlay
- Announcement bar
- Mobile-responsive with GSAP animations
