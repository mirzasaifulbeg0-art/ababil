# ABABIL — Build conventions (read before writing any page)

Stack: **Next.js 15 App Router, React 19, TypeScript, Tailwind, Prisma (PostgreSQL), NextAuth v5**.
All pages are Server Components by default. Add `"use client"` only for interactivity.

## Next.js 15 gotchas (IMPORTANT)

- In page/layout props, `params` and `searchParams` are **Promises**. Type them and `await`:
  ```ts
  export default async function Page({
    params, searchParams,
  }: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
  }) {
    const { slug } = await params;
    const { page } = await searchParams;
  }
  ```
- `cookies()`, `headers()`, and `auth()` are **async** — always `await` them.
- `Decimal` fields from Prisma must be wrapped with `Number(...)` before math/formatting.
- Use `import { notFound } from "next/navigation"` for missing records.

## Auth

```ts
import { auth } from "@/lib/auth";
const session = await auth();          // null if logged out
session?.user?.id                       // string
session?.user?.role                     // "USER" | "ADMIN"
```
Sign in/out (client): `import { signIn, signOut } from "next-auth/react"`.
`/dashboard/*` and `/admin/*` are already protected by middleware.

## Prisma

`import { prisma } from "@/lib/prisma"`. Models & fields are in `prisma/schema.prisma` — READ IT.
Key models: User, DigitalService, ServiceCategory, ServiceRequest, Product, ProductCategory,
ProductImage, Review, Wishlist, Order, OrderItem, IslamicBook, BookCategory, DownloadHistory,
Blog, BlogCategory, Comment, ContactMessage, Testimonial, Notification.

## Utilities — `@/lib/utils`

- `cn(...classes)` — merge Tailwind classes.
- `formatPrice(number|string)` → "₹499.00"
- `formatDate(date)` → "14 Jul 2026"
- `slugify(text)`, `truncate(text, max)`

## Design system components (already built — import, do NOT recreate)

- `@/components/ui/button` → `<Button variant="primary|navy|outline|ghost|danger|subtle" size="sm|md|lg|icon" href?>`
- `@/components/ui/input` → `<Input />`
- `@/components/ui/textarea` → `<Textarea />`
- `@/components/ui/label` → `<Label />`
- `@/components/ui/select` → `<Select><option/></Select>`
- `@/components/ui/card` → `<Card>`, `<CardBody>`, `<CardTitle>`
- `@/components/ui/badge` → `<Badge variant="green|navy|gray|amber|red|blue">`
- `@/components/shared/section-heading` → `<SectionHeading eyebrow? title subtitle? align="center|left" />`
- `@/components/shared/empty-state` → `<EmptyState icon? title description? actionLabel? actionHref? />`
- `@/components/shared/rating` → `<Rating value={4.5} count? size? />`
- `@/components/shared/pagination` → `<Pagination page totalPages baseParams? />`
- `@/components/shared/status-badge` → `<StatusBadge status="PENDING" />`

Icons: `lucide-react`. Images: `next/image` (Cloudinary host is allowlisted; for arbitrary
external images use a plain `<img>` to avoid config errors).

## Server actions (already built — import, do NOT recreate)

- `@/lib/actions/cart` → `addToCart(productId, qty?)`, `updateCartItem(productId, qty)`, `removeFromCart(productId)`, `clearCart()`
- `@/lib/cart` → `getCart()` → `{lines, itemCount, subtotal}`, `getCartCount()`
- `@/lib/actions/orders` → `placeOrder(prev, formData)` → `{ok, orderNumber} | {ok:false, error}` (useActionState)
- `@/lib/actions/auth` → `registerUser(prev, formData)` → `{ok, error?}`
- `@/lib/actions/contact` → `submitContact(prev, formData)`
- `@/lib/actions/services` → `submitServiceRequest(prev, formData)`
- `@/lib/actions/reviews` → `submitReview(prev, formData)`
- `@/lib/actions/wishlist` → `toggleWishlist(productId)`
- `@/lib/actions/downloads` → `registerDownload(bookId)` → `{ok, url} | {ok:false,error}`
- `@/lib/actions/profile` → `updateProfile(prev, formData)`, `markAllNotificationsRead()`
- `@/lib/actions/admin` → `saveProduct(id, prev, fd)`, `deleteProduct(id)`, `saveService`, `deleteService`, `saveBook`, `deleteBook`, `saveBlog`, `deleteBlog`, `updateOrderStatus(fd)`, `updateServiceRequestStatus(fd)`, `toggleMessageRead(id, read)`

For forms using these `(prev, formData)` actions, use React 19 `useActionState`:
```tsx
"use client";
import { useActionState } from "react";
const [state, formAction, pending] = useActionState(action, undefined);
<form action={formAction}> ... </form>
```

## Visual style

Brand: green (`brand-green-500` primary), navy (`brand-navy-800`), white. Rounded-2xl cards,
`shadow-card`/`shadow-card-hover`, generous spacing. Use `.section` (py-16/24) and `.container`.
Headings use `font-heading`. Keep it clean, modern, premium. Every list must handle the empty
state. Add `export const metadata` (title + description) to each top-level page for SEO.
