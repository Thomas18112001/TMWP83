import type { Metadata } from "next";
import "@/styles/globals.css";
import { SiteCursor } from "@/components/site-cursor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SITE_URL = "https://toulonwaterpolo.fr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toulon Métropole Water-Polo 83 — Club de water-polo à Toulon",
    template: "%s | TMWP83 — Water-Polo Toulon"
  },
  description:
    "Club de water-polo à Toulon, dans le Var. Équipe féminine élite, école de water-polo dès 8 ans, compétitions nationales. Rejoignez le TMWP83, club phare de la région Sud.",
  keywords: [
    "water-polo", "Toulon", "TMWP83", "club water-polo Toulon",
    "équipe féminine water-polo", "Var", "Piscine Port Marchand",
    "water-polo féminin", "sport Toulon", "FFN"
  ],
  authors: [{ name: "Toulon Métropole Water-Polo 83" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Toulon Métropole Water-Polo 83",
    title: "Toulon Métropole Water-Polo 83 — Club de water-polo à Toulon",
    description:
      "Club de water-polo à Toulon, dans le Var. Équipe féminine élite, école de water-polo dès 8 ans, compétitions nationales.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "TMWP83 — Toulon Métropole Water-Polo 83"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Toulon Métropole Water-Polo 83",
    description:
      "Club de water-polo à Toulon. Équipe féminine élite, école de water-polo, compétitions nationales.",
    images: ["/brand/og-image.png"]
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  },
  icons: {
    icon: "/brand/favicon.webp",
    shortcut: "/brand/favicon.webp",
    apple: "/brand/favicon.webp"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              "name": "Toulon Métropole Water-Polo 83",
              "alternateName": "TMWP83",
              "url": "https://toulonwaterpolo.fr",
              "logo": "https://toulonwaterpolo.fr/brand/logo-light.png",
              "image": "https://toulonwaterpolo.fr/brand/og-image.png",
              "description": "Club de water-polo à Toulon, dans le Var. Équipe féminine élite, école de water-polo dès 8 ans, compétitions nationales.",
              "sport": "Water Polo",
              "foundingDate": "2010",
              "email": "contact@toulonwaterpolo.fr",
              "telephone": "+33615161421",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "370 All. de l'Armée d'Afrique",
                "addressLocality": "Toulon",
                "postalCode": "83000",
                "addressCountry": "FR"
              },
              "location": {
                "@type": "SportsActivityLocation",
                "name": "Piscine Du Port Marchand",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "370 All. de l'Armée d'Afrique",
                  "addressLocality": "Toulon",
                  "postalCode": "83000",
                  "addressCountry": "FR"
                }
              },
              "sameAs": [
                "https://www.instagram.com/toulon_waterpolo_/",
                "https://www.facebook.com/toulonwaterpolo.fr/",
                "https://fr.linkedin.com/in/toulon-m%C3%A9tropole-water-polo-193630395"
              ]
            })
          }}
        />
      </head>
      <body className="bg-shell text-ink antialiased">
        <SiteCursor />
        <div className="relative min-h-screen overflow-x-hidden">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
