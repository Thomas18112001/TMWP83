import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/site-page";
import { getPageContent, pageSlugs } from "@/lib/site-data";

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

const PAGE_OG_IMAGES: Record<string, string> = {
  "le-club":               "/images/coach-equipe-elite-tmwp83-bord-bassin.jpg",
  "equipe-feminine-elite": "/images/collectif-tmwp83-avant-match.jpg",
  "equipes":               "/images/entrainement-tmwp83-piscine-port-marchand.jpg",
  "competitions":          "/images/joueuse-tmwp83-tir-water-polo-match.jpg",
  "partenaires":           "/images/piscine-port-marchand-toulon-bassin-exterieur.jpg",
  "actualites":            "/images/joueuse-tmwp83-numero-sept-tir.jpg",
  "contact":               "/images/piscine-port-marchand-toulon-bassin-exterieur.jpg"
};

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getPageContent(params.slug);

  if (!page) return {};

  const ogImage = PAGE_OG_IMAGES[params.slug] ?? "/brand/og-image.png";

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: `${page.title} | TMWP83`,
      description: page.description,
      url: `https://tmwp83.fr/${params.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | TMWP83`,
      description: page.description,
      images: [ogImage]
    }
  };
}

export default function DynamicPage({ params }: PageProps) {
  const page = getPageContent(params.slug);

  if (!page) {
    notFound();
  }

  return <SitePage page={page} />;
}
