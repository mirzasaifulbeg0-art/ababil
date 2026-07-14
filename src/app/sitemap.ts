import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/**
 * Generates /sitemap.xml. Right now it lists the static pages. As we build each
 * module we'll extend this to include products, services, books and blog posts
 * pulled from the database.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/digital-services",
    "/products",
    "/library",
    "/blog",
    "/about",
    "/contact",
  ];

  return staticPaths.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
