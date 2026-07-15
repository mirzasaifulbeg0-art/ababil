import { z } from "zod";

const optionalString = z.string().trim().optional().or(z.literal(""));

/** Accepts a full http(s) URL or a site-relative upload path like /uploads/x.pdf. */
const urlOrPath = z
  .string()
  .trim()
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "Enter a valid URL or upload a file"
  );

// --- Product -----------------------------------------------------------------
export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().min(5, "Description is required"),
  benefits: optionalString,
  ingredients: optionalString,
  price: z.coerce.number().nonnegative("Price must be 0 or more"),
  compareAtPrice: z.coerce.number().nonnegative().optional().or(z.nan()),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: optionalString,
  imageUrl: optionalString,
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});
export type ProductInput = z.infer<typeof productSchema>;

// --- Digital service ---------------------------------------------------------
export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  shortDescription: z.string().trim().min(5, "Short description is required"),
  description: z.string().trim().min(5, "Description is required"),
  requiredDocuments: z.string().trim().min(2, "List required documents"),
  eligibility: z.string().trim().min(2, "Describe eligibility"),
  processingTime: z.string().trim().min(2, "e.g. 3-5 working days"),
  serviceCharge: z.coerce.number().nonnegative(),
  categoryId: optionalString,
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

// --- Islamic book ------------------------------------------------------------
export const bookSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  author: z.string().trim().min(2, "Author is required"),
  language: z
    .enum(["ARABIC", "ENGLISH", "BENGALI", "URDU", "HINDI", "OTHER"])
    .default("OTHER"),
  description: z.string().trim().min(5, "Description is required"),
  coverImage: optionalString,
  pdfUrl: urlOrPath,
  categoryId: optionalString,
  isActive: z.coerce.boolean().default(true),
});
export type BookInput = z.infer<typeof bookSchema>;

// --- Blog post ---------------------------------------------------------------
export const blogSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  excerpt: z.string().trim().min(5, "Excerpt is required"),
  content: z.string().trim().min(20, "Content is too short"),
  coverImage: optionalString,
  categoryId: optionalString,
  metaTitle: optionalString,
  metaDescription: optionalString,
  published: z.coerce.boolean().default(false),
});
export type BlogInput = z.infer<typeof blogSchema>;

// --- Status updates ----------------------------------------------------------
export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export const serviceStatusSchema = z.object({
  requestId: z.string().min(1),
  status: z.enum([
    "SUBMITTED",
    "IN_REVIEW",
    "IN_PROGRESS",
    "COMPLETED",
    "REJECTED",
  ]),
});
