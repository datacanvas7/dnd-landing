import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";

const LAST_MODIFIED = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
