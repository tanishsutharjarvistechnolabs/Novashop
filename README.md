This is a production-ready [Next.js](https://nextjs.org) (App Router) port of the NOVASHOP storefront.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Notes

- Routes are implemented in `src/app/*` (e.g. `src/app/cart/page.tsx`).
- Shared layout is in `src/app/layout.tsx` and includes `Header`, `Footer`, and third-party scripts.
- Route content now lives in TSX page components and shared data objects in `src/lib/storefront-data.ts`.
- Shared storefront sections such as the inner banner, support section, and quantity selector live in `src/components/*`.
- Static assets (CSS/JS/images/fonts) are served from `public/assets` (copied from the original site).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
