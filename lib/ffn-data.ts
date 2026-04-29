const EXTRANAT_BASE = "https://www.extranat.fr";
const WATERPOLO_BASE = `${EXTRANAT_BASE}/waterpolo/cgi-bin`;

const TARGET = {
  season: "2026",
  ownerId: "1725",
  championshipId: "1629",
  phaseId: "5579",
  teamStructureId: "2326",
  teamName: "TOULON WATERPOLO",
  competition: "Elite Féminine",
};

export type FfnRosterPlayer = {
  number: number | null;
  name: string;
  birthYear: number | null;
  nationality: string | null;
};

export type FfnMatch = {
  matchId: string | null;
  competition: string;
  competitionId: string;
  phase: string;
  round: number;
  date: string | null;
  time: string | null;
  datetime: string | null;
  home: string;
  away: string;
  homeStructureId: string | null;
  awayStructureId: string | null;
  homeLogo: string | null;
  awayLogo: string | null;
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
  hasScore: boolean;
  homeRoster: FfnRosterPlayer[];
  awayRoster: FfnRosterPlayer[];
};

export type FfnStandingRow = {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
};

export type FfnSourceInfo = {
  sourceUrl: string;
  season: string;
  ownerId: string;
  championshipId: string;
  phaseId: string;
  teamStructureId: string;
  competition: string;
};

export type FfnFeedStatus = "ok" | "empty" | "error";

export type FfnFixturesState = {
  fixtures: FfnMatch[];
  status: FfnFeedStatus;
  season: string;
  competition: string;
};

export function getFfnSourceInfo(): FfnSourceInfo {
  return {
    sourceUrl: "https://ffn.extranat.fr/webffn/wp_results.php?idact=wp",
    season: TARGET.season,
    ownerId: TARGET.ownerId,
    championshipId: TARGET.championshipId,
    phaseId: TARGET.phaseId,
    teamStructureId: TARGET.teamStructureId,
    competition: TARGET.competition,
  };
}

async function fetchExtranat(path: string): Promise<string | null> {
  const body = new URLSearchParams({
    liste_saison: TARGET.season,
    liste_proprietaire: TARGET.ownerId,
    liste_championnat: TARGET.championshipId,
    liste_epreuve: TARGET.phaseId,
    action: "epreuve",
  });

  try {
    const res = await fetch(`${WATERPOLO_BASE}/${path}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&eacute;/g, "é")
    .replace(/&Eacute;/g, "É")
    .replace(/&egrave;/g, "è")
    .replace(/&agrave;/g, "à")
    .replace(/&ccedil;/g, "ç")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripTags(value: string): string {
  return decodeHtml(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTeam(value: string): string {
  const clean = stripTags(value).replace(/^\*\s*/, "").trim();
  return clean === "TOULON WATER-POLO" ? TARGET.teamName : clean;
}

function toPublicUrl(src: string | null): string | null {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  return `${EXTRANAT_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function toInt(value: string | undefined | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDate(dateText: string): { round: number; date: string | null; time: string | null; datetime: string | null } {
  const match = stripTags(dateText).match(/journée\[(\d+)\]\s*-\s*(?:\S+)\s+(\d{1,2})\s+([A-Za-zéûîôà]+)\s+(\d{4})\s+à\s+(\d{1,2})h(\d{2})/i);
  if (!match) return { round: 0, date: null, time: null, datetime: null };

  const months: Record<string, string> = {
    janvier: "01",
    fevrier: "02",
    février: "02",
    mars: "03",
    avril: "04",
    mai: "05",
    juin: "06",
    juillet: "07",
    aout: "08",
    août: "08",
    septembre: "09",
    octobre: "10",
    novembre: "11",
    decembre: "12",
    décembre: "12",
  };
  const [, round, day, monthName, year, hour, minute] = match;
  const month = months[monthName.toLowerCase()];
  const date = month ? `${year}-${month}-${day.padStart(2, "0")}` : null;
  const time = `${hour.padStart(2, "0")}:${minute}`;
  return {
    round: Number.parseInt(round, 10),
    date,
    time,
    datetime: date ? `${date}T${time}:00.000Z` : null,
  };
}

function parseRoster(tableHtml: string): FfnRosterPlayer[] {
  return [...tableHtml.matchAll(/<tr>\s*<td>J(\d+)<\/td>\s*<td>(.*?)<\/td>\s*<td>(\d{4})<\/td>\s*<td>\((.*?)\)<\/td>\s*<\/tr>/g)]
    .map((row) => ({
      number: toInt(row[1]),
      name: stripTags(row[2]),
      birthYear: toInt(row[3]),
      nationality: stripTags(row[4]) || null,
    }))
    .filter((player) => player.name.length > 0);
}

function extractRosters(block: string): Record<string, FfnRosterPlayer[]> {
  const rosters: Record<string, FfnRosterPlayer[]> = {};
  const matches = block.matchAll(/<table class="resultat_compo_equipe">([\s\S]*?)<\/table>[\s\S]*?<a class="equipe"[^>]*structure=(\d+)(?:&amp;|&)action=structure/g);
  for (const match of matches) {
    rosters[match[2]] = parseRoster(match[1]);
  }
  return rosters;
}

function parseMatchBlock(block: string, withScores: boolean): FfnMatch | null {
  if (!block.includes(`data-championnat="${TARGET.championshipId}"`)) return null;

  const id = block.match(/feuille_match\.php\?match_id=(\d+)/)?.[1] ?? null;
  const logoMatches = [...block.matchAll(/class="logo_equipe_[12]"[\s\S]*?<img\s+src="([^"]+)"/g)];
  const teamMatches = [...block.matchAll(/<a class="equipe"[^>]*structure=(\d+)(?:&amp;|&)action=structure[^>]*>([\s\S]*?)<\/a>/g)];
  if (teamMatches.length !== 2) return null;

  const homeStructureId = teamMatches[0][1];
  const awayStructureId = teamMatches[1][1];
  const home = normalizeTeam(teamMatches[0][2]);
  const away = normalizeTeam(teamMatches[1][2]);
  if (homeStructureId !== TARGET.teamStructureId && awayStructureId !== TARGET.teamStructureId) return null;

  const dateHtml = block.match(/<div class="ffnatation_date">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const date = parseDate(dateHtml);
  const scoreMatches = withScores ? [...block.matchAll(/<div class="score_(?:gagnant|perdant)">\s*(\d+)\s*<\/div>/g)] : [];
  const rosters = withScores ? extractRosters(block) : {};

  return {
    matchId: id,
    competition: TARGET.competition,
    competitionId: TARGET.championshipId,
    phase: TARGET.competition,
    round: date.round,
    date: date.date,
    time: date.time,
    datetime: date.datetime,
    home,
    away,
    homeStructureId,
    awayStructureId,
    homeLogo: toPublicUrl(logoMatches[0]?.[1] ?? `/waterpolo/rsc/logo/${homeStructureId}.jpg`),
    awayLogo: toPublicUrl(logoMatches[1]?.[1] ?? `/waterpolo/rsc/logo/${awayStructureId}.jpg`),
    isHome: homeStructureId === TARGET.teamStructureId,
    homeScore: toInt(scoreMatches[0]?.[1]),
    awayScore: toInt(scoreMatches[1]?.[1]),
    hasScore: scoreMatches.length === 2,
    homeRoster: rosters[homeStructureId] ?? [],
    awayRoster: rosters[awayStructureId] ?? [],
  };
}

function parseMatches(html: string, withScores: boolean): FfnMatch[] {
  return html
    .split(/<div name="match"/g)
    .slice(1)
    .map((part) => parseMatchBlock(`<div name="match"${part}`, withScores))
    .filter((match): match is FfnMatch => match !== null);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getFfnResults(limit?: number): Promise<FfnMatch[]> {
  const html = await fetchExtranat("wp_results.php");
  if (!html) return [];
  const list = parseMatches(html, true)
    .filter((match) => match.hasScore && match.date && match.date <= todayIso())
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return limit ? list.slice(0, limit) : list;
}

export async function getFfnFixtures(limit?: number): Promise<FfnMatch[]> {
  const html = await fetchExtranat("wp_calendar.php");
  if (!html) return [];
  const list = parseMatches(html, false)
    .filter((match) => match.date && match.date >= todayIso())
    .sort((a, b) => (a.datetime ?? "").localeCompare(b.datetime ?? ""));
  return limit ? list.slice(0, limit) : list;
}

export async function getFfnFixturesState(limit?: number): Promise<FfnFixturesState> {
  const html = await fetchExtranat("wp_calendar.php");

  if (!html) {
    return {
      fixtures: [],
      status: "error",
      season: TARGET.season,
      competition: TARGET.competition,
    };
  }

  const fixtures = parseMatches(html, false)
    .filter((match) => match.date && match.date >= todayIso())
    .sort((a, b) => (a.datetime ?? "").localeCompare(b.datetime ?? ""));

  return {
    fixtures: limit ? fixtures.slice(0, limit) : fixtures,
    status: fixtures.length > 0 ? "ok" : "empty",
    season: TARGET.season,
    competition: TARGET.competition,
  };
}

export async function getFfnStandings(): Promise<FfnStandingRow[]> {
  const html = await fetchExtranat("wp_results.php");
  if (!html) return [];

  const table = html.match(/<table class="classement_epreuve"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  if (!table) return [];

  return [...table.matchAll(/<tr>\s*<td>(\d+)<\/td>\s*<td>(.*?)<\/td>\s*<td class="point">(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td[^>]*>(-?\d+)<\/td>\s*<\/tr>/g)]
    .map((row) => ({
      rank: Number.parseInt(row[1], 10),
      team: normalizeTeam(row[2]),
      points: Number.parseInt(row[3], 10),
      played: Number.parseInt(row[4], 10),
      won: Number.parseInt(row[5], 10),
      drawn: Number.parseInt(row[6], 10),
      lost: Number.parseInt(row[7], 10),
      goalsFor: Number.parseInt(row[8], 10),
      goalsAgainst: Number.parseInt(row[9], 10),
      goalDiff: Number.parseInt(row[10], 10),
    }));
}

export async function getFfnRoster(): Promise<FfnRosterPlayer[]> {
  const results = await getFfnResults();
  const matchWithRoster = results.find((match) =>
    match.homeStructureId === TARGET.teamStructureId
      ? match.homeRoster.length > 0
      : match.awayRoster.length > 0
  );
  if (!matchWithRoster) return [];
  return matchWithRoster.homeStructureId === TARGET.teamStructureId
    ? matchWithRoster.homeRoster
    : matchWithRoster.awayRoster;
}

const FR_MONTHS = ["jan.", "fév.", "mar.", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."];
const FR_DAYS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

export function formatFfnDate(isoDate: string | null): string {
  if (!isoDate) return "-";
  const d = new Date(`${isoDate}T12:00:00`);
  return `${FR_DAYS[d.getDay()]} ${d.getDate()} ${FR_MONTHS[d.getMonth()]}`;
}
