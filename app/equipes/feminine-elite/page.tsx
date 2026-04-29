import type { Metadata } from "next";
import { SitePage } from "@/components/site-page";
import { getFfnFixtures, getFfnResults, getFfnRoster } from "@/lib/ffn-data";
import { getPageContent } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Équipe Féminine Élite | TMWP83",
  description:
    "L'équipe féminine Élite du Toulon Métropole Water-Polo 83 : effectif confirmé FFN, prochains matchs et derniers résultats.",
};

export default async function EliteWomenPage() {
  const page = getPageContent("equipe-feminine-elite");
  const [ffnFixtures, ffnResults, ffnRoster] = await Promise.all([
    getFfnFixtures(),
    getFfnResults(8),
    getFfnRoster(),
  ]);

  return (
    <SitePage
      page={page!}
      ffnFixtures={ffnFixtures}
      ffnResults={ffnResults}
      ffnRoster={ffnRoster}
    />
  );
}
