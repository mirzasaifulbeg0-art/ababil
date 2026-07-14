/**
 * Central place for site-wide constants: brand info, navigation, and the
 * canonical category lists. Importing from here keeps everything consistent.
 */

export const SITE = {
  name: "ABABIL",
  tagline: "Nature • Technology • Trust",
  description:
    "ABABIL is an all-in-one platform for digital services, natural products, a free Islamic PDF library, and helpful blogs.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ababil.example",
} as const;

/** Primary navigation shown in the header. */
export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Digital Services", href: "/digital-services" },
  { label: "Natural Products", href: "/products" },
  { label: "Islamic Library", href: "/library" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Digital-service categories (used for filtering + seeding). */
export const SERVICE_CATEGORIES = [
  "Identity & Certificates",
  "Cards & Schemes",
  "Insurance",
  "Travel & Tickets",
  "Recharge & Bills",
  "Business & Tax",
  "Printing & Documents",
] as const;

/** Product categories for the shop. */
export const PRODUCT_CATEGORIES = [
  "Honey",
  "Organic Grains",
  "Spices & Turmeric",
  "Herbal Products",
  "Dry Fruits",
  "Seasonal",
] as const;

/** Islamic Library categories. */
export const BOOK_CATEGORIES = [
  "Quran",
  "Tafsir",
  "Hadith",
  "Aqeedah",
  "Fiqh",
  "Seerah",
  "Dua",
  "Islamic History",
  "Bengali Books",
  "English Books",
  "Arabic Books",
  "Children's Islamic Books",
] as const;

/** Blog categories. */
export const BLOG_CATEGORIES = [
  "Government Schemes",
  "Digital Services",
  "Technology",
  "AI",
  "Agriculture",
  "Honey",
  "Health",
  "Islamic Knowledge",
] as const;

/** Order status labels for display. */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};
