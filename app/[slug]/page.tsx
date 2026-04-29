import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/site-page";
import { getFfnFixtures, getFfnResults, getFfnStandings } from "@/lib/ffn-data";
import { getPublicActivities } from "@/lib/public-activities";
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
  "activites":             "/images/entrainement-tmwp83-piscine-port-marchand.jpg",
  "equipes":               "/images/entrainement-tmwp83-piscine-port-marchand.jpg",
  "competitions":          "/images/joueuse-tmwp83-tir-water-polo-match.jpg",
  "partenaires":           "/images/piscine-port-marchand-toulon-bassin-exterieur.jpg",
  "actualites":            "/images/joueuse-tmwp83-numero-sept-tir.jpg",
  "contact":               "/images/piscine-port-marchand-toulon-bassin-exterieur.jpg"
};

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getPageContent(params.slug);

  if (!page) return {};

  const ogImage = PAGE_OG_IMAGES[params.slug] || "/brand/og-image.png";

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: `${page.title} | TMWP83`,
      description: page.description,
      url: `https://toulonwaterpolo.fr/${params.slug}`,
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

export default async function DynamicPage({ params }: PageProps) {
  const page = getPageContent(params.slug);

  if (!page) {
    notFound();
  }

  const needsFFN = params.slug === "competitions" || params.slug === "le-club";
  const needsActivities = params.slug === "activites";

  const [ffnFixtures, ffnResults, ffnStandings, activities] = await Promise.all([
    needsFFN ? getFfnFixtures() : Promise.resolve([]),
    needsFFN ? getFfnResults(8) : Promise.resolve([]),
    needsFFN ? getFfnStandings() : Promise.resolve([]),
    needsActivities ? getPublicActivities() : Promise.resolve([]),
  ]);

  return (
    <SitePage
      page={page}
      ffnFixtures={ffnFixtures}
      ffnResults={ffnResults}
      ffnStandings={ffnStandings}
      activities={activities}
    />
  );
}
