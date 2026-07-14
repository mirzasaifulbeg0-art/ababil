/**
 * Database seed script.
 * Run with:  npm run db:seed   (after the database is created).
 *
 * Creates an admin user, all categories, and a few sample rows for every
 * section so the site isn't empty while we build. `upsert` = safe to re-run.
 */
import { PrismaClient, BookLanguage } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SERVICE_CATEGORIES = [
  "Identity & Certificates",
  "Cards & Schemes",
  "Insurance",
  "Travel & Tickets",
  "Recharge & Bills",
  "Business & Tax",
  "Printing & Documents",
];

const PRODUCT_CATEGORIES = [
  "Honey",
  "Organic Grains",
  "Spices & Turmeric",
  "Herbal Products",
  "Dry Fruits",
  "Seasonal",
];

const BOOK_CATEGORIES = ["Quran", "Hadith", "Seerah", "Dua", "English Books"];

const BLOG_CATEGORIES = [
  "Government Schemes",
  "Technology",
  "Honey",
  "Islamic Knowledge",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");
}

async function main() {
  console.log("🌱 Seeding database…");

  // --- Admin user ----------------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@ababil.example";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345";
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "ABABIL Admin",
      password: hashed,
      role: "ADMIN",
    },
  });
  console.log(`👤 Admin ready: ${adminEmail} (password: ${adminPassword})`);

  // --- Categories ----------------------------------------------------------
  for (const name of SERVICE_CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }
  for (const name of PRODUCT_CATEGORIES) {
    await prisma.productCategory.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }
  for (const name of BOOK_CATEGORIES) {
    await prisma.bookCategory.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }
  for (const name of BLOG_CATEGORIES) {
    await prisma.blogCategory.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }
  console.log("🗂️  Categories seeded.");

  // --- Sample digital services --------------------------------------------
  const idCategory = await prisma.serviceCategory.findUnique({
    where: { slug: slugify("Identity & Certificates") },
  });
  const services = [
    {
      name: "PAN Card",
      slug: "pan-card",
      shortDescription: "Apply for a new PAN card or correct existing details.",
      description:
        "We assist you with new PAN card applications and corrections. Provide your documents and we handle the submission and follow-up.",
      requiredDocuments: "Aadhaar card\nPassport-size photo\nProof of address",
      eligibility: "Any Indian citizen or entity requiring a PAN.",
      processingTime: "7-15 working days",
      serviceCharge: 149.0,
      isFeatured: true,
    },
    {
      name: "Aadhaar Services",
      slug: "aadhaar-services",
      shortDescription: "Update address, mobile number or details in Aadhaar.",
      description:
        "Assistance with Aadhaar enrolment support and updates such as address, mobile number and name corrections.",
      requiredDocuments: "Existing Aadhaar\nProof of the detail being updated",
      eligibility: "Existing Aadhaar holders.",
      processingTime: "5-10 working days",
      serviceCharge: 99.0,
      isFeatured: true,
    },
  ];
  for (const s of services) {
    await prisma.digitalService.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, categoryId: idCategory?.id },
    });
  }

  // --- Sample product ------------------------------------------------------
  const honeyCategory = await prisma.productCategory.findUnique({
    where: { slug: slugify("Honey") },
  });
  const honey = await prisma.product.upsert({
    where: { slug: "pure-forest-honey-500g" },
    update: {},
    create: {
      name: "Pure Forest Honey (500g)",
      slug: "pure-forest-honey-500g",
      description:
        "100% raw, unprocessed forest honey collected from natural beehives. No added sugar, no preservatives.",
      benefits: "Natural energy\nSupports immunity\nRich in antioxidants",
      ingredients: "100% raw forest honey",
      price: 499.0,
      compareAtPrice: 649.0,
      stock: 50,
      isFeatured: true,
      categoryId: honeyCategory?.id,
    },
  });
  await prisma.productImage.upsert({
    where: { id: `${honey.id}-cover` },
    update: {},
    create: {
      id: `${honey.id}-cover`,
      productId: honey.id,
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      alt: "Pure Forest Honey jar",
      position: 0,
    },
  });

  // --- Sample Islamic book -------------------------------------------------
  const enBooks = await prisma.bookCategory.findUnique({
    where: { slug: slugify("English Books") },
  });
  await prisma.islamicBook.upsert({
    where: { slug: "the-noble-quran-english" },
    update: {},
    create: {
      title: "The Noble Quran (English Translation)",
      slug: "the-noble-quran-english",
      author: "Public Domain Translation",
      language: BookLanguage.ENGLISH,
      description:
        "A freely distributable English translation of the Holy Quran.",
      pdfUrl: "https://res.cloudinary.com/demo/raw/upload/sample.pdf",
      categoryId: enBooks?.id,
    },
  });

  // --- Sample blog post ----------------------------------------------------
  const techCategory = await prisma.blogCategory.findUnique({
    where: { slug: slugify("Technology") },
  });
  await prisma.blog.upsert({
    where: { slug: "welcome-to-ababil" },
    update: {},
    create: {
      title: "Welcome to ABABIL",
      slug: "welcome-to-ababil",
      excerpt: "Discover digital services, natural products and free books.",
      content:
        "ABABIL brings digital services, natural products, an Islamic library and a helpful blog together in one trusted platform.",
      published: true,
      publishedAt: new Date(),
      categoryId: techCategory?.id,
    },
  });

  // --- Testimonials (homepage reviews) -------------------------------------
  const testimonials = [
    {
      name: "Rahul S.",
      role: "Verified Customer",
      content: "Got my PAN card help quickly. Very reliable service!",
    },
    {
      name: "Ayesha K.",
      role: "Verified Customer",
      content: "The forest honey is pure and delicious. Highly recommend.",
    },
  ];
  // Only seed testimonials once (avoid duplicates on re-run).
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
