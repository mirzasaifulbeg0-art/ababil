import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/** Generates /robots.txt automatically. Tells search engines what to crawl. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private areas out of search results.
      disallow: ["/admin", "/dashboard", "/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
