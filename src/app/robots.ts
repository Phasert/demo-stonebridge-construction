import type { MetadataRoute } from "next";

// Portfolio demo: ask crawlers not to index.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
