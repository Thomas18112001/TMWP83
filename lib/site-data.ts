import {
  Award,
  Gem,
  Shield,
  Target,
  Trophy,
  Users,
  Waves,
  Zap
} from "lucide-react";

export const CLUB_INFO = {
  name: "Toulon Métropole Water-Polo 83",
  shortName: "TMWP83",
  slogan: "L'intensité du jeu, la force du collectif",
  founded: 2010,
  location: "Toulon, Var",
  pool: "Piscine Du Port Marchand",
  address: "370 All. de l'Armée d'Afrique, 83000 Toulon",
  email: "contact@toulonwaterpolo.fr",
  phone: "+33 (0)6 15 16 14 21",
  website: "https://tmwp83.fr",
  social: {
    instagram: "https://www.instagram.com/toulon_waterpolo_/",
    facebook: "https://www.facebook.com/toulonwaterpolo.fr/",
    linkedin: "https://fr.linkedin.com/in/toulon-m%C3%A9tropole-water-polo-193630395"
  }
};

export const NAV_LINKS = [
  { label: "Le Club", href: "/le-club" },
  { label: "Équipe Élite", href: "/equipe-feminine-elite" },
  { label: "Équipes", href: "/equipes" },
  { label: "Compétitions", href: "/competitions" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" }
] as const;

const partnerLogoPath = (fileName: string) =>
  encodeURI(`/partenaires/${fileName}`);

export const PARTNERS = [
  {
    name: "Toulon Provence Méditerranée",
    tier: "premium",
    src: partnerLogoPath("Logo_Toulon_Provence_Mediterranee.png")
  },
  {
    name: "Département du Var",
    tier: "premium",
    src: partnerLogoPath("Logo_Département_Var.png")
  },
  {
    name: "Région Sud",
    tier: "premium",
    src: partnerLogoPath("Logo_marque_Région_Sud.png")
  },
  {
    name: "Caisse d'Épargne",
    tier: "major",
    src: partnerLogoPath("Logo_Caisse_d'Épargne.png")
  },
  {
    name: "Toulon Aéroport",
    tier: "major",
    src: partnerLogoPath("logo-toulon-aeroport.svg")
  },
  {
    name: "Woora",
    tier: "major",
    src: partnerLogoPath("logo-woora.png")
  },
  {
    name: "Nojoke",
    tier: "official",
    src: partnerLogoPath("Nojoke-logo-mozaïc.jpg")
  },
  {
    name: "ORPI Agence Cabanis",
    tier: "official",
    src: partnerLogoPath("orpi-agence-cabanis.png")
  },
  {
    name: "Time Break",
    tier: "official",
    src: partnerLogoPath("time-break-evenementiel-sportifpng.png")
  },
  {
    name: "Planète Marketing",
    tier: "official",
    src: partnerLogoPath("marketing-planete logoTRANSPARENT.png")
  },
  {
    name: "Vars Ascenseurs",
    tier: "official",
    src: partnerLogoPath("logo-vars-ascenseurs-sans-fond-1024x724.png")
  },
  {
    name: "Léa Voisin Communication",
    tier: "official",
    src: partnerLogoPath("logo-lea-voisin-cm-coach-en-communication.png")
  },
  {
    name: "Dullac Imprimerie",
    tier: "official",
    src: partnerLogoPath("logo-dullac-imprimerie.png")
  },
  {
    name: "Côte Piscine Toulon",
    tier: "official",
    src: partnerLogoPath("cote-piscine-toulon.png")
  },
  {
    name: "Café Pop Toulon",
    tier: "official",
    src: partnerLogoPath("cafe-pop-toulon.png")
  },
  {
    name: "Brette Immobilier",
    tier: "official",
    src: partnerLogoPath("brette-immobilier-logo.png")
  },
  {
    name: "Bertaina et Fils Carrosserie",
    tier: "official",
    src: partnerLogoPath("bertaina-et-fils-carrosserie.jpg")
  },
  {
    name: "Assurances Guillaume",
    tier: "official",
    src: partnerLogoPath("ASSURANCES GUILLAUME.jpg")
  }
];

export const HOME_PARTNER_LOGOS = PARTNERS.map(({ name, src }) => ({ name, src }));

export const PARTNER_FEATURES = [
  {
    title: "Visibilité",
    description:
      "Présence sur nos supports de communication, événements, réseaux et activations terrain.",
    icon: Gem
  },
  {
    title: "Territoire",
    description:
      "Associez votre marque à un projet sportif structurant pour Toulon et le Var.",
    icon: Target
  },
  {
    title: "Impact",
    description:
      "Soutenez la formation, la performance féminine et la vie associative du club.",
    icon: Shield
  },
  {
    title: "Réseau",
    description:
      "Rejoignez un écosystème de partenaires publics et privés engagés.",
    icon: Award
  }
];

export const PARTNER_GROUPS = [
  {
    name: "Partenaires institutionnels",
    sponsors: PARTNERS.filter((partner) => partner.tier === "premium")
  },
  {
    name: "Partenaires majeurs",
    sponsors: PARTNERS.filter((partner) => partner.tier === "major")
  },
  {
    name: "Partenaires officiels",
    sponsors: PARTNERS.filter((partner) => partner.tier === "official")
  }
];

export const CLUB_VALUES = [
  {
    title: "Exigence",
    description:
      "Chaque entraînement, chaque match est une opportunité de repousser nos limites et d'atteindre l'excellence."
  },
  {
    title: "Collectif",
    description:
      "La force du groupe prime sur l'individu. Ensemble, nous construisons les victoires de demain."
  },
  {
    title: "Formation",
    description:
      "Former les champions de demain tout en transmettant les valeurs du sport et du respect."
  },
  {
    title: "Rayonnement",
    description:
      "Porter haut les couleurs de Toulon et du Var sur la scène nationale et européenne."
  }
];

export const CLUB_VALUE_ICONS = [Target, Users, Shield, Zap];

export const HOME_ACTIVITY_ICONS = {
  school: Users,
  trophy: Trophy,
  waves: Waves
} as const;

export const ACTIVITIES = [
  {
    title: "École de Water-Polo",
    description:
      "Formation dès 8 ans, encadrement diplômé, progression par niveau. Découverte, apprentissage et compétition.",
    icon: "school" as const
  },
  {
    title: "Compétition",
    description:
      "Équipes engagées en championnat régional et national, des catégories jeunes jusqu'à l'Élite féminine.",
    icon: "trophy" as const
  },
  {
    title: "Section Loisir",
    description:
      "Pratique libre et conviviale pour adultes. Plaisir du jeu, condition physique et esprit d'équipe.",
    icon: "waves" as const
  }
];

export const TEAM_PILLARS = [
  {
    title: "Équipe élite féminine",
    description:
      "Référence du projet sportif et vitrine de la filière performance.",
    cta: "Voir l'équipe Élite",
    href: "/equipe-feminine-elite",
    icon: Trophy,
    highlight: true
  },
  {
    title: "Formation jeunes",
    description:
      "Une progression structurée, du premier ballon jusqu'aux sections compétitives.",
    cta: "Découvrir le club",
    href: "/le-club",
    icon: Users,
    highlight: false
  },
  {
    title: "Section loisir",
    description:
      "Une pratique adulte conviviale, engagée et fidèle à l'esprit du water-polo.",
    cta: "Nous contacter",
    href: "/contact",
    icon: Waves,
    highlight: false
  }
];

export const ELITE_PLAYERS = [
  { name: "Marie Dupont", number: 1, position: "Gardienne" },
  { name: "Léa Martin", number: 3, position: "Centre" },
  { name: "Camille Bernard", number: 5, position: "Ailière" },
  { name: "Sarah Petit", number: 7, position: "Ailière" },
  { name: "Julie Moreau", number: 9, position: "Centre" },
  { name: "Emma Laurent", number: 11, position: "Buteuse" },
  { name: "Chloé Dubois", number: 2, position: "Défenseure" },
  { name: "Manon Thomas", number: 4, position: "Buteuse" },
  { name: "Clara Robert", number: 6, position: "Défenseure" },
  { name: "Inès Richard", number: 8, position: "Centre" },
  { name: "Zoé Simon", number: 10, position: "Gardienne" },
  { name: "Jade Michel", number: 12, position: "Ailière" },
  { name: "Lina Garcia", number: 13, position: "Buteuse" }
];

export const UPCOMING_MATCHES = [
  {
    id: 1,
    competition: "Championnat Élite",
    home: "TMWP83",
    away: "CN Marseille",
    date: "2026-04-19",
    time: "18:00",
    location: "Piscine Port Marchand",
    isHome: true
  },
  {
    id: 2,
    competition: "Coupe de France",
    home: "Nice Water-Polo",
    away: "TMWP83",
    date: "2026-04-26",
    time: "15:30",
    location: "Piscine Jean Bouin, Nice",
    isHome: false
  },
  {
    id: 3,
    competition: "Championnat Élite",
    home: "TMWP83",
    away: "Montpellier WP",
    date: "2026-05-03",
    time: "18:00",
    location: "Piscine Port Marchand",
    isHome: true
  }
];

export const RECENT_RESULTS = [
  {
    home: "TMWP83",
    away: "Lille Aqua",
    scoreHome: 12,
    scoreAway: 8,
    date: "2026-04-05",
    competition: "Championnat Élite"
  },
  {
    home: "Lyon WP",
    away: "TMWP83",
    scoreHome: 9,
    scoreAway: 11,
    date: "2026-03-29",
    competition: "Championnat Élite"
  },
  {
    home: "TMWP83",
    away: "Paris WP",
    scoreHome: 14,
    scoreAway: 7,
    date: "2026-03-22",
    competition: "Coupe de France"
  },
  {
    home: "Bordeaux WP",
    away: "TMWP83",
    scoreHome: 10,
    scoreAway: 10,
    date: "2026-03-15",
    competition: "Championnat Élite"
  }
];

export const RANKINGS = [
  {
    rank: 1,
    team: "TMWP83",
    played: 18,
    won: 14,
    drawn: 2,
    lost: 2,
    goalsFor: 198,
    goalsAgainst: 132,
    points: 44
  },
  {
    rank: 2,
    team: "CN Marseille",
    played: 18,
    won: 13,
    drawn: 1,
    lost: 4,
    goalsFor: 185,
    goalsAgainst: 140,
    points: 40
  },
  {
    rank: 3,
    team: "Nice Water-Polo",
    played: 18,
    won: 11,
    drawn: 3,
    lost: 4,
    goalsFor: 170,
    goalsAgainst: 145,
    points: 36
  },
  {
    rank: 4,
    team: "Montpellier WP",
    played: 18,
    won: 10,
    drawn: 2,
    lost: 6,
    goalsFor: 160,
    goalsAgainst: 150,
    points: 32
  },
  {
    rank: 5,
    team: "Lyon WP",
    played: 18,
    won: 9,
    drawn: 2,
    lost: 7,
    goalsFor: 155,
    goalsAgainst: 152,
    points: 29
  },
  {
    rank: 6,
    team: "Paris WP",
    played: 18,
    won: 7,
    drawn: 3,
    lost: 8,
    goalsFor: 142,
    goalsAgainst: 155,
    points: 24
  }
];

export const NEWS_ARTICLES = [
  {
    id: 1,
    slug: "victoire-face-a-lille-tmwp83-premiere-place",
    title: "Victoire éclatante face à Lille : TMWP83 conforte sa première place",
    excerpt:
      "Les Toulonnaises ont signé une performance remarquable en s'imposant 12-8 face à Lille, consolidant leur position de leader au classement général.",
    body: [
      "Le 6 avril 2026, la Piscine Port Marchand a vibré au rythme d'une victoire éclatante : le TMWP83 s'est imposé 12 à 8 face à l'équipe de Lille dans ce qui restera comme l'une des rencontres les plus abouties de la saison en cours.",
      "Dès le premier quart-temps, les Toulonnaises ont imposé leur rythme en marquant quatre buts consécutifs, forçant le staff adverse à enchaîner les temps morts dès la 8e minute. La défense, organisée autour d'une gardienne en grande forme, n'a concédé que deux buts sur toute la première période.",
      "La seconde mi-temps a confirmé la maîtrise locale. Les combinaisons offensives travaillées en semaine ont trouvé des brèches répétées dans le dispositif lillois. Avec quatre buteuses différentes dans le dernier quart-temps, le collectif a démontré toute sa profondeur et sa qualité de banc.",
      "\"C'est le fruit d'une semaine de travail intense\", a déclaré la capitaine à l'issue de la rencontre. \"Chaque joueuse a tenu son rôle, défensivement comme offensivement. On reste concentrées sur la fin de saison.\" Le TMWP83 compte désormais cinq points d'avance au classement et aborde les prochaines échéances avec une confiance renforcée."
    ],
    date: "2026-04-06",
    category: "Match",
    image: "/images/joueuse-tmwp83-numero-deux-tir.jpg",
    imageAlt: "Joueuse numéro deux du TMWP83 en position de tir lors d'un match de water-polo"
  },
  {
    id: 2,
    slug: "journee-portes-ouvertes-water-polo-piscine-port-marchand",
    title: "Journée portes ouvertes : venez découvrir le water-polo",
    excerpt:
      "Le club organise une journée portes ouvertes le 15 mai à la Piscine Port Marchand. Initiations gratuites pour tous les âges.",
    body: [
      "Le TMWP83 ouvre ses portes le samedi 15 mai 2026 à la Piscine Port Marchand de Toulon. De 10h à 17h, le club accueillera familles, enfants et curieux pour une journée entièrement dédiée à la découverte du water-polo.",
      "Au programme : initiations encadrées par les éducateurs diplômés du club, démonstrations de l'équipe élite féminine, présentation des différentes sections (école de water-polo dès 8 ans, section compétition, section loisir adultes) et échanges avec les joueuses et le staff technique.",
      "L'entrée est libre et gratuite. Des créneaux d'initiation sont proposés toutes les heures pour les enfants à partir de 8 ans. Une session spéciale adultes débutants est prévue à 14h30. Le matériel est fourni par le club, il suffit d'apporter un maillot de bain.",
      "Cette journée est également l'occasion de récupérer les dossiers d'inscription pour la saison 2026-2027, qui débutera en septembre. Les éducateurs et le bureau du club seront présents pour répondre à toutes vos questions. Rejoignez-nous pour une journée dans l'eau !"
    ],
    date: "2026-04-02",
    category: "Club",
    image: "/images/course-water-polo-couloir.jpg",
    imageAlt: "Joueuses du TMWP83 en course dans le bassin lors d'une séance d'entraînement de water-polo"
  },
  {
    id: 3,
    slug: "partenariat-strategique-metropole-toulon-provence-mediterranee",
    title: "Nouveau partenariat stratégique avec la Métropole",
    excerpt:
      "TMWP83 renforce son ancrage territorial avec un accord de partenariat pluriannuel avec Toulon Provence Méditerranée.",
    body: [
      "Le Toulon Métropole Water-Polo 83 a signé un accord de partenariat pluriannuel avec Toulon Provence Méditerranée (TPM). Cet engagement institutionnel majeur marque une étape importante dans le développement du club et dans la reconnaissance de son rôle structurant pour le sport féminin dans le Var.",
      "Concrètement, ce partenariat se traduira par un soutien financier renforcé, un accès prioritaire aux équipements sportifs métropolitains et une présence accrue du TMWP83 dans les événements sportifs et institutionnels organisés sur le territoire. La Métropole devient ainsi partenaire institutionnel officiel du club.",
      "\"Ce partenariat est la reconnaissance du travail accompli depuis plusieurs années\", a déclaré la présidence du club. \"Il nous permet d'envisager la suite avec plus de stabilité et d'ambition, notamment sur le volet formation et sur la montée en puissance de notre équipe élite.\"",
      "Pour TPM, cet engagement s'inscrit dans une politique sportive volontariste visant à valoriser les clubs locaux de haut niveau et à promouvoir la pratique sportive féminine. Le TMWP83, avec son équipe évoluant au niveau national, incarne parfaitement ces valeurs d'exigence et d'ancrage territorial."
    ],
    date: "2026-03-28",
    category: "Partenaires",
    image: "/images/coach-equipe-elite-tmwp83-bord-bassin.jpg",
    imageAlt: "Coach de l'équipe élite du TMWP83 au bord du bassin lors d'une séance d'entraînement"
  },
  {
    id: 4,
    slug: "equipe-elite-preparation-phase-finale-saison",
    title: "L'équipe Élite en préparation pour la phase finale",
    excerpt:
      "Focus sur la préparation intense de nos joueuses avant les matchs décisifs de fin de saison. Détermination et collectif au rendez-vous.",
    body: [
      "À quelques semaines des matchs décisifs de la phase finale, l'équipe élite féminine du TMWP83 a intensifié sa préparation. Doubles séances, travail physique renforcé et scrimmages internes rythment désormais la semaine des joueuses, sous la conduite du staff technique.",
      "L'objectif est clair : arriver dans les meilleures conditions possibles aux rencontres qui détermineront le classement final. La saison régulière a confirmé le potentiel du groupe, qui a su enchaîner des performances de haut niveau et se hisser parmi les meilleures équipes du championnat national.",
      "\"On est dans une bulle en ce moment\", confie l'une des cadres du groupe. \"Tout le monde est concentré, les entraînements sont intenses mais l'ambiance est vraiment bonne. On sent qu'on a quelque chose à aller chercher ensemble.\"",
      "Le staff travaille notamment sur les phases spéciales (exclusions, power-play) et sur la gestion des moments clés en fin de match — des détails qui font souvent la différence au plus haut niveau. Rendez-vous dans les prochaines semaines pour suivre les résultats de cette fin de saison prometteuse."
    ],
    date: "2026-03-20",
    category: "Élite",
    image: "/images/joueuses-tmwp83-banc-remplacantes.jpg",
    imageAlt: "Joueuses du TMWP83 rassemblées sur le banc lors d'une pause en match de water-polo"
  },
  {
    id: 5,
    slug: "ecole-water-polo-inscriptions-ouvertes-saison-2026-2027",
    title: "École de water-polo : inscriptions saison 2026-2027 ouvertes",
    excerpt:
      "Les inscriptions pour la prochaine saison sont désormais ouvertes. Rejoignez un club formateur d'excellence dès la rentrée.",
    body: [
      "Le TMWP83 ouvre officiellement les inscriptions pour la saison 2026-2027. L'école de water-polo accueille les jeunes dès 8 ans dans un environnement formateur, encadré par des éducateurs diplômés d'État, avec une progression pédagogique adaptée à chaque niveau.",
      "Le club propose trois niveaux d'initiation et de perfectionnement : un groupe découverte pour les débutants de 8 à 11 ans, un groupe intermédiaire pour les 12-14 ans déjà initiés, et un groupe performance pour les 15 ans et plus souhaitant s'engager dans une pratique compétitive. Des passerelles vers les équipes seniors sont systématiquement proposées aux jeunes prometteurs.",
      "Les séances se déroulent à la Piscine Port Marchand, au cœur de Toulon, dans un cadre exceptionnel. Les entraînements ont lieu deux fois par semaine pour les débutants et trois fois pour les groupes avancés. Les licences incluent une assurance sportive complète et l'accès aux compétitions régionales organisées par la FFN.",
      "Pour s'inscrire : rendez-vous à la journée portes ouvertes du 15 mai ou directement via le formulaire de contact disponible sur ce site. Les places sont limitées et attribuées par ordre de demande. N'attendez pas la rentrée pour garantir votre place dans le club !"
    ],
    date: "2026-03-15",
    category: "Formation",
    image: "/images/duel-water-polo-bras-leve.jpg",
    imageAlt: "Joueuses en duel lors d'une action de water-polo, bras levés pour le ballon"
  },
  {
    id: 6,
    slug: "parcours-exceptionnel-coupe-de-france-tmwp83",
    title: "Retour sur le parcours exceptionnel en Coupe de France",
    excerpt:
      "De la phase régionale aux demi-finales nationales, retour sur un parcours qui illustre l'ambition croissante du TMWP83.",
    body: [
      "La Coupe de France 2025-2026 restera dans les mémoires du club. Parti des phases régionales avec l'ambition affichée d'aller le plus loin possible, le TMWP83 a réalisé un parcours exceptionnel en atteignant pour la première fois de son histoire les demi-finales nationales.",
      "Le chemin fut long et exigeant : cinq matchs, cinq victoires, dont des succès face à des équipes de premier plan comme Marseille (9-7) et Lyon (11-9 après prolongations). Chaque rencontre a été l'occasion pour le groupe de montrer sa solidité défensive et sa capacité à répondre dans les moments de pression.",
      "La demi-finale face à Strasbourg, perdue d'un but (8-7) dans les dernières secondes, a laissé des regrets mais aussi une grande fierté. \"On a montré qu'on a le niveau pour se battre avec les meilleures équipes de France\", résume le coach. \"Ce parcours doit nous servir de carburant pour la suite.\"",
      "Au-delà du résultat, c'est l'image du club qui ressort grandie de cette aventure. Plusieurs joueuses se sont distinguées individuellement, attirant l'attention des sélectionneurs nationaux. La dynamique est là — et tout porte à croire que le TMWP83 n'en est qu'au début de son ascension sur la scène nationale."
    ],
    date: "2026-03-10",
    category: "Compétition",
    image: "/images/gardienne-tmwp83-arret-but.jpg",
    imageAlt: "Gardienne du TMWP83 effectuant un arrêt décisif devant le but lors d'un match de water-polo"
  }
];

export function getArticleBySlug(slug: string) {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}

export const pageSlugs = [
  "le-club",
  "equipe-feminine-elite",
  "equipes",
  "competitions",
  "partenaires",
  "actualites",
  "contact"
] as const;

export type PageSlug = (typeof pageSlugs)[number];

export type PageContent = {
  slug: PageSlug;
  title: string;
  description: string;
};

const pages: PageContent[] = [
  {
    slug: "le-club",
    title: "Le Club",
    description:
      "Histoire, identité et vision d'un club tourné vers la formation et la performance."
  },
  {
    slug: "equipe-feminine-elite",
    title: "Équipe Féminine Élite",
    description:
      "Le fer de lance du projet sportif. Ambition, exigence et performance au plus haut niveau national."
  },
  {
    slug: "equipes",
    title: "Les Équipes",
    description:
      "Le TMWP83 structure son projet sportif autour de trois filières complémentaires, de la formation à la performance."
  },
  {
    slug: "competitions",
    title: "Compétitions",
    description:
      "Retrouvez les prochaines rencontres de l'équipe Élite et venez soutenir vos joueuses."
  },
  {
    slug: "partenaires",
    title: "Nos Partenaires",
    description:
      "Ils croient en notre projet et financent l'ambition sportive du TMWP83. Chaque partenariat est une alliance stratégique."
  },
  {
    slug: "actualites",
    title: "Actualités",
    description:
      "Résumés de matchs, vie du club, partenariats et événements. Toute l'actualité du TMWP83."
  },
  {
    slug: "contact",
    title: "Contact",
    description:
      "Inscription, partenariat, question ou suggestion : nous sommes à votre écoute."
  }
];

export function getPageContent(slug: string) {
  return pages.find((page) => page.slug === slug);
}
