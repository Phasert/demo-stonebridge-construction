import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";

const base = "https://stonebridge.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/services", "/projects", "/process", "/contact", ...projects.map((p) => `/projects/${p.slug}`)].map((path) => ({ url: `${base}${path}` }));
}
