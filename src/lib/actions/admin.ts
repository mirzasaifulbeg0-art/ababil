"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import {
  productSchema,
  serviceSchema,
  bookSchema,
  blogSchema,
  orderStatusSchema,
  serviceStatusSchema,
} from "@/lib/validations/admin";

export type ActionResult = { ok: boolean; error?: string };

/** Ensures the caller is an admin; throws (→ error) otherwise. */
async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return session;
}

/** Make a slug unique by appending -2, -3, … if needed. */
async function uniqueSlug(
  base: string,
  model: "product" | "digitalService" | "islamicBook" | "blog",
  ignoreId?: string
): Promise<string> {
  const root = slugify(base) || "item";
  let slug = root;
  let n = 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[model];
  while (true) {
    const found = await delegate.findUnique({ where: { slug } });
    if (!found || found.id === ignoreId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

// ============================================================================
// PRODUCTS
// ============================================================================
export async function saveProduct(
  id: string | null,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    benefits: formData.get("benefits"),
    ingredients: formData.get("ingredients"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  const compareAtPrice =
    d.compareAtPrice && !Number.isNaN(d.compareAtPrice) ? d.compareAtPrice : null;

  const data = {
    name: d.name,
    description: d.description,
    benefits: d.benefits || null,
    ingredients: d.ingredients || null,
    price: d.price,
    compareAtPrice,
    stock: d.stock,
    categoryId: d.categoryId || null,
    isActive: d.isActive,
    isFeatured: d.isFeatured,
  };

  let productId = id;
  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    const slug = await uniqueSlug(d.name, "product");
    const created = await prisma.product.create({ data: { ...data, slug } });
    productId = created.id;
  }

  // Simple single-image handling.
  if (d.imageUrl && productId) {
    const existing = await prisma.productImage.findFirst({
      where: { productId },
      orderBy: { position: "asc" },
    });
    if (existing) {
      await prisma.productImage.update({
        where: { id: existing.id },
        data: { url: d.imageUrl },
      });
    } else {
      await prisma.productImage.create({
        data: { productId, url: d.imageUrl, position: 0 },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { ok: true };
}

// ============================================================================
// DIGITAL SERVICES
// ============================================================================
export async function saveService(
  id: string | null,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }

  const parsed = serviceSchema.safeParse({
    name: formData.get("name"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    requiredDocuments: formData.get("requiredDocuments"),
    eligibility: formData.get("eligibility"),
    processingTime: formData.get("processingTime"),
    serviceCharge: formData.get("serviceCharge"),
    categoryId: formData.get("categoryId"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  const data = {
    name: d.name,
    shortDescription: d.shortDescription,
    description: d.description,
    requiredDocuments: d.requiredDocuments,
    eligibility: d.eligibility,
    processingTime: d.processingTime,
    serviceCharge: d.serviceCharge,
    categoryId: d.categoryId || null,
    isActive: d.isActive,
    isFeatured: d.isFeatured,
  };

  if (id) {
    await prisma.digitalService.update({ where: { id }, data });
  } else {
    const slug = await uniqueSlug(d.name, "digitalService");
    await prisma.digitalService.create({ data: { ...data, slug } });
  }

  revalidatePath("/admin/services");
  revalidatePath("/digital-services");
  redirect("/admin/services");
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  await prisma.digitalService.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/digital-services");
  return { ok: true };
}

// ============================================================================
// ISLAMIC BOOKS
// ============================================================================
export async function saveBook(
  id: string | null,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }

  const parsed = bookSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    language: formData.get("language"),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    pdfUrl: formData.get("pdfUrl"),
    categoryId: formData.get("categoryId"),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  const data = {
    title: d.title,
    author: d.author,
    language: d.language,
    description: d.description,
    coverImage: d.coverImage || null,
    pdfUrl: d.pdfUrl,
    categoryId: d.categoryId || null,
    isActive: d.isActive,
  };

  if (id) {
    await prisma.islamicBook.update({ where: { id }, data });
  } else {
    const slug = await uniqueSlug(d.title, "islamicBook");
    await prisma.islamicBook.create({ data: { ...data, slug } });
  }

  revalidatePath("/admin/books");
  revalidatePath("/library");
  redirect("/admin/books");
}

export async function deleteBook(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  await prisma.islamicBook.delete({ where: { id } });
  revalidatePath("/admin/books");
  revalidatePath("/library");
  return { ok: true };
}

// ============================================================================
// BLOG POSTS
// ============================================================================
export async function saveBlog(
  id: string | null,
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }

  const parsed = blogSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    categoryId: formData.get("categoryId"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  const data = {
    title: d.title,
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.coverImage || null,
    categoryId: d.categoryId || null,
    metaTitle: d.metaTitle || null,
    metaDescription: d.metaDescription || null,
    published: d.published,
    publishedAt: d.published ? new Date() : null,
  };

  if (id) {
    await prisma.blog.update({ where: { id }, data });
  } else {
    const slug = await uniqueSlug(d.title, "blog");
    await prisma.blog.create({
      data: { ...data, slug, authorId: session.user.id },
    });
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  redirect("/admin/blogs");
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  await prisma.blog.delete({ where: { id } });
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { ok: true };
}

// ============================================================================
// STATUS UPDATES + MESSAGES
// ============================================================================
export async function updateOrderStatus(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  const parsed = orderStatusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid status" };

  const paymentStatus =
    parsed.data.status === "PAID" || parsed.data.status === "DELIVERED"
      ? "PAID"
      : undefined;

  await prisma.order.update({
    where: { id: parsed.data.orderId },
    data: { status: parsed.data.status, ...(paymentStatus ? { paymentStatus } : {}) },
  });
  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function updateServiceRequestStatus(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  const parsed = serviceStatusSchema.safeParse({
    requestId: formData.get("requestId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid status" };

  await prisma.serviceRequest.update({
    where: { id: parsed.data.requestId },
    data: { status: parsed.data.status },
  });
  revalidatePath("/admin/services/requests");
  return { ok: true };
}

export async function toggleMessageRead(
  id: string,
  read: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Not authorized" };
  }
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  return { ok: true };
}
