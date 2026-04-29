import { ACTIVITIES as STATIC_ACTIVITIES } from "@/lib/site-data";

export type PublicActivitySlot = {
  id: string;
  day: "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | "dimanche";
  startTime: string;
  endTime: string;
  location: string;
  pool: string;
  label: string;
};

export type PublicActivity = {
  id: string;
  documentId: string;
  name: string;
  slug: string;
  type: "annual" | "stage" | "event";
  practiceType: "loisir" | "competition";
  category: string;
  level: string;
  audience: string;
  ageRange: string;
  shortDescription: string;
  longDescription: string;
  heroImageUrl: string;
  schedule: string;
  timeSlots: PublicActivitySlot[];
  location: string;
  address: string;
  coach: string;
  registrationStatus: "open" | "full" | "waitlist";
  visibility: "active" | "draft" | "archived";
  displayOrder: number;
  planningColor: string;
  ctaLabel: string;
  monthlyPrice: number;
  capacity: number;
  enrolled: number;
  price: number;
  season: string;
  status: "open" | "closed" | "full";
};

type StrapiRow = Record<string, unknown> & {
  id?: string | number;
  documentId?: string | number;
  attributes?: Record<string, unknown>;
};

const VALID_DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"] as const;
const PUBLIC_ACTIVITY_LIMIT = 100;

function apiBaseUrl() {
  return (
    process.env.TMWP_PUBLIC_STRAPI_URL ||
    process.env.NEXT_PUBLIC_TMWP_API_URL ||
    "http://127.0.0.1:8787/api/strapi"
  ).replace(/\/+$/, "");
}

export function appBaseUrl() {
  return (process.env.NEXT_PUBLIC_TMWP_APP_URL || "https://app.toulonwaterpolo.fr").replace(/\/+$/, "");
}

function str(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function num(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function token(value: unknown) {
  return str(value).trim().toLowerCase();
}

function normalizeDay(value: unknown): PublicActivitySlot["day"] {
  const normalized = token(value);
  return VALID_DAYS.includes(normalized as PublicActivitySlot["day"])
    ? (normalized as PublicActivitySlot["day"])
    : "mercredi";
}

function normalizeType(value: unknown): PublicActivity["type"] {
  const normalized = token(value);
  if (normalized === "stage" || normalized === "event") return normalized;
  return "annual";
}

function normalizePractice(value: unknown): PublicActivity["practiceType"] {
  return token(value) === "competition" ? "competition" : "loisir";
}

function normalizeRegistrationStatus(value: unknown): PublicActivity["registrationStatus"] {
  const normalized = token(value);
  if (normalized === "full" || normalized === "waitlist") return normalized;
  return "open";
}

function normalizeVisibility(value: unknown): PublicActivity["visibility"] {
  const normalized = token(value);
  if (normalized === "draft" || normalized === "archived") return normalized;
  return "active";
}

function normalizeStatus(value: unknown): PublicActivity["status"] {
  const normalized = token(value);
  if (normalized === "closed" || normalized === "full") return normalized;
  return "open";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSlots(value: unknown): PublicActivitySlot[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((slot, index) => ({
      id: str(slot.id, `slot-${index + 1}`),
      day: normalizeDay(slot.day),
      startTime: str(slot.startTime).slice(0, 5),
      endTime: str(slot.endTime).slice(0, 5),
      location: str(slot.location),
      pool: str(slot.pool),
      label: str(slot.label),
    }))
    .filter((slot) => Boolean(slot.startTime && slot.endTime));
}

function imageUrl(value: unknown) {
  const raw = str(value).trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) {
    try {
      return new URL(raw, apiBaseUrl().replace(/\/api\/strapi$/, "")).toString();
    } catch {
      return raw;
    }
  }
  return raw;
}

function unwrapRow(row: StrapiRow) {
  return { ...(row.attributes || {}), ...row };
}

function normalizeActivity(row: StrapiRow): PublicActivity {
  const data = unwrapRow(row);
  const id = str(data.documentId || data.id);
  const name = str(data.name, "Activité TMWP83");
  const slug = str(data.slug, slugify(name) || id);

  return {
    id,
    documentId: id,
    name,
    slug,
    type: normalizeType(data.type),
    practiceType: normalizePractice(data.practiceType),
    category: str(data.category),
    level: str(data.level),
    audience: str(data.audience),
    ageRange: str(data.ageRange),
    shortDescription: str(data.shortDescription),
    longDescription: str(data.longDescription),
    heroImageUrl: imageUrl(data.heroImageUrl),
    schedule: str(data.schedule),
    timeSlots: normalizeSlots(data.timeSlots),
    location: str(data.location, "Piscine Port Marchand"),
    address: str(data.address),
    coach: str(data.coach),
    registrationStatus: normalizeRegistrationStatus(data.registrationStatus),
    visibility: normalizeVisibility(data.visibility),
    displayOrder: num(data.displayOrder),
    planningColor: str(data.planningColor, "#d5241d"),
    ctaLabel: str(data.ctaLabel, "S'inscrire"),
    monthlyPrice: num(data.monthlyPrice),
    capacity: num(data.capacity),
    enrolled: num(data.enrolled),
    price: num(data.price),
    season: str(data.season),
    status: normalizeStatus(data.status),
  };
}

function staticFallbackActivities(): PublicActivity[] {
  return STATIC_ACTIVITIES.map((activity, index) => ({
    id: `static-${index + 1}`,
    documentId: `static-${index + 1}`,
    name: activity.title,
    slug: slugify(activity.title),
    type: "annual",
    practiceType: activity.icon === "trophy" ? "competition" : "loisir",
    category: activity.title,
    level: "",
    audience: "",
    ageRange: "",
    shortDescription: activity.description,
    longDescription: activity.description,
    heroImageUrl: "",
    schedule: "Planning à confirmer",
    timeSlots: [],
    location: "Piscine Port Marchand",
    address: "",
    coach: "",
    registrationStatus: "open",
    visibility: "active",
    displayOrder: index + 1,
    planningColor: "#d5241d",
    ctaLabel: "S'inscrire",
    monthlyPrice: 0,
    capacity: 0,
    enrolled: 0,
    price: 0,
    season: "",
    status: "open",
  }));
}

export async function getPublicActivities(): Promise<PublicActivity[]> {
  const query = new URLSearchParams({
    "filters[visibility][$eq]": "active",
    "pagination[pageSize]": String(PUBLIC_ACTIVITY_LIMIT),
    "sort[0]": "displayOrder:asc",
    "sort[1]": "name:asc",
  });

  try {
    const response = await fetch(`${apiBaseUrl()}/activities?${query.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) throw new Error(`Activities fetch failed: ${response.status}`);
    const payload = (await response.json()) as { data?: StrapiRow[] } | StrapiRow[];
    const rows = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
    const activities = rows
      .map(normalizeActivity)
      .filter((activity) => activity.visibility === "active")
      .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "fr"));

    return activities.length > 0 ? activities : staticFallbackActivities();
  } catch {
    return staticFallbackActivities();
  }
}

export function activityRegistrationUrl(activity: Pick<PublicActivity, "slug" | "id">) {
  const key = activity.id || activity.slug;
  return `${appBaseUrl()}/inscription/panier?activity=${encodeURIComponent(key)}`;
}

export function publicActivityPath(activity: Pick<PublicActivity, "slug" | "id">) {
  return `/activites/${encodeURIComponent(activity.slug || activity.id)}`;
}

export async function getPublicActivityBySlug(slug: string): Promise<PublicActivity | null> {
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const activities = await getPublicActivities();

  return (
    activities.find((activity) => {
      const candidates = [activity.slug, activity.id, activity.documentId]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return candidates.includes(normalizedSlug);
    }) || null
  );
}
