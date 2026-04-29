import type { MetadataRoute } from "next";
import { pageSlugs, NEWS_ARTICLES } from "@/lib/site-data";

const SITE_URL = "https://toulonwaterpolo.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/equipes/feminine-elite`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...pageSlugs.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: slug === "competitions" || slug === "activites" ? 0.9 : 0.8,
    })),
  ];

  const articlePages: MetadataRoute.Sitemap = NEWS_ARTICLES.map((article) => ({
    url: `${SITE_URL}/actualites/${article.slug}`,
    lastModified: new Date(article.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
