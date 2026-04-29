import type { Metadata } from "next";
import { HomePage } from "@/components/site-page";
import { getFfnFixturesState } from "@/lib/ffn-data";
import { getPublicActivitiesState } from "@/lib/public-activities";

const SITE_URL = "https://toulonwaterpolo.fr";

const HOME_FAQ = [
  {
    question: "Où faire du water polo à Toulon ?",
    answer:
      "Le Toulon Métropole Water-Polo 83 accueille les entraînements et les matchs à la Piscine du Port Marchand à Toulon. Les activités sont accessibles à partir de 8 ans.",
  },
  {
    question: "À partir de quel âge peut-on commencer ?",
    answer:
      "Le club propose une école de water polo accessible à partir de 8 ans, avec des groupes adaptés au niveau et à l'âge.",
  },
  {
    question: "Faut-il savoir nager ?",
    answer:
      "Oui, une aisance minimum dans l'eau est recommandée pour démarrer à partir de 8 ans, puis les éducateurs accompagnent la progression technique.",
  },
  {
    question: "Comment s'inscrire ?",
    answer:
      "Les inscriptions se font via les activités du club, accessibles à partir de 8 ans, et l'espace adhérent, avec un accompagnement possible par le formulaire de contact.",
  },
  {
    question: "Peut-on voir un match ?",
    answer:
      "Oui, les matchs élite à domicile du Toulon Métropole Water-Polo 83 sont ouverts au public avec entrée gratuite.",
  },
  {
    question: "Quel est le prix de l'inscription ?",
    answer:
      "Le tarif dépend de l'activité choisie. Les détails sont affichés sur chaque fiche activité avant l'inscription.",
  },
];

export const metadata: Metadata = {
  title: "Toulon Métropole Water-Polo 83",
  description:
    "Toulon Métropole Water-Polo 83, club de water polo à Toulon. Équipe élite féminine, activités sportives à Toulon dès 8 ans, école de water polo et inscriptions au club.",
  keywords: [
    "water polo Toulon",
    "club water polo Toulon",
    "activité sportive Toulon",
    "water polo féminin Toulon",
    "équipe élite water polo Toulon",
    "Piscine Port Marchand",
    "inscription water polo Toulon",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: "Toulon Métropole Water-Polo 83",
    description:
      "Club water polo Toulon : équipe élite féminine, activités sportives dès 8 ans, inscriptions et matchs à domicile gratuits.",
  },
};

export default async function Page() {
  const [fixturesState, activitiesState] = await Promise.all([
    getFfnFixturesState(5),
    getPublicActivitiesState(),
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage
        ffnFixtures={fixturesState.fixtures}
        ffnStatus={fixturesState.status}
        activities={activitiesState.activities}
        activitiesStatus={activitiesState.status}
      />
    </>
  );
}
