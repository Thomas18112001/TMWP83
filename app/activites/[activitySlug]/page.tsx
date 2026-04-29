import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MapPin, Trophy, UserRound, Users, Waves } from "lucide-react";
import { getPublicActivityBySlug } from "@/lib/public-activities";
import type { PublicActivity, PublicActivitySlot } from "@/lib/public-activities";

type PageProps = { params: Promise<{ activitySlug: string }> };

const APP_URL = (process.env.NEXT_PUBLIC_TMWP_APP_URL || "https://app.toulonwaterpolo.fr").replace(/\/+$/, "");
const DAY_ORDER: PublicActivitySlot["day"][] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const DAY_LABELS: Record<PublicActivitySlot["day"], string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { activitySlug } = await params;
  const activity = await getPublicActivityBySlug(activitySlug);
  if (!activity) return { title: "Activité introuvable" };
  return {
    title: activity.name,
    description: activity.shortDescription || `${activity.name} — activité du TMWP83 à Toulon.`,
  };
}

function registrationUrl(activity: Pick<PublicActivity, "slug" | "id">) {
  return `${APP_URL}/inscription/panier?activity=${encodeURIComponent(activity.slug || activity.id)}`;
}

function statusLabel(activity: PublicActivity) {
  if (activity.status === "closed") return "Fermé";
  if (activity.status === "full" || activity.registrationStatus === "full") return "Complet";
  if (activity.registrationStatus === "waitlist") return "Liste d'attente";
  return "Ouvert";
}

function typeIcon(activity: PublicActivity) {
  if (activity.practiceType === "competition") return Trophy;
  if ((activity.audience || activity.category).toLowerCase().includes("jeune")) return Users;
  return Waves;
}

function priceLabel(activity: PublicActivity) {
  if (activity.price > 0) return `${activity.price.toLocaleString("fr-FR")} €`;
  if (activity.monthlyPrice > 0) return `${activity.monthlyPrice.toLocaleString("fr-FR")} €/mois`;
  return "Tarif à confirmer";
}

function inferSlots(activity: PublicActivity): PublicActivitySlot[] {
  if (activity.timeSlots.length > 0) return activity.timeSlots;

  const schedule = activity.schedule || "";
  const timeMatch = schedule.match(/(\d{1,2})\s*h?\s*(\d{0,2})\s*[-–—]\s*(\d{1,2})\s*h?\s*(\d{0,2})/i);
  if (!timeMatch) return [];

  const startTime = `${timeMatch[1].padStart(2, "0")}:${(timeMatch[2] || "00").padStart(2, "0")}`;
  const endTime = `${timeMatch[3].padStart(2, "0")}:${(timeMatch[4] || "00").padStart(2, "0")}`;
  const normalized = schedule.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const days = DAY_ORDER.filter((day) =>
    normalized.includes(day.normalize("NFD").replace(/[̀-ͯ]/g, "")) ||
    normalized.includes(day.slice(0, 3))
  );

  return days.map((day, index) => ({
    id: `${activity.id}-fallback-${index + 1}`,
    day,
    startTime,
    endTime,
    location: activity.location,
    pool: "",
    label: "",
  }));
}

function groupedSlots(activity: PublicActivity) {
  const slots = inferSlots(activity).sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    return dayDiff || a.startTime.localeCompare(b.startTime);
  });
  return DAY_ORDER.map((day) => ({
    day,
    slots: slots.filter((slot) => slot.day === day),
  })).filter((g) => g.slots.length > 0);
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { activitySlug } = await params;
  const activity = await getPublicActivityBySlug(activitySlug);
  if (!activity) notFound();

  const Icon = typeIcon(activity);
  const disabled = activity.status === "closed" || activity.status === "full" || activity.registrationStatus === "full";
  const slotsByDay = groupedSlots(activity);
  const description = activity.longDescription || activity.shortDescription || "Les informations détaillées seront complétées prochainement.";
  const heroSrc = activity.heroImageUrl || "/images/entrainement-tmwp83-piscine-port-marchand.jpg";

  const statusBg = activity.status === "closed"
    ? "bg-white/15 text-white/70"
    : (activity.status === "full" || activity.registrationStatus === "full")
      ? "bg-ember text-white"
      : "bg-green-600 text-white";

  return (
    <main className="bg-shell">
      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden bg-ink pt-28 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt={activity.name}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/15" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
          <Link
            href="/activites"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les activités
          </Link>
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusBg}`}>
                {statusLabel(activity)}
              </span>
              {(activity.category || activity.practiceType) && (
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white/75">
                  {activity.category || activity.practiceType}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
              {activity.name}
            </h1>
            {activity.shortDescription && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                {activity.shortDescription}
              </p>
            )}
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={registrationUrl(activity)}
                aria-disabled={disabled}
                className={`inline-flex rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition ${
                  disabled
                    ? "pointer-events-none bg-white/15"
                    : "bg-ember hover:bg-white hover:text-ink"
                }`}
              >
                {disabled ? statusLabel(activity) : activity.ctaLabel || "S'inscrire"}
              </a>
              <Link
                href="/activites"
                className="inline-flex rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/15"
              >
                Voir le planning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-8">
            {/* Description */}
            <article className="rounded-[1.5rem] border border-ink/8 bg-white p-7 shadow-soft sm:p-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-ink">Présentation</h2>
              <p className="mt-5 whitespace-pre-line text-base leading-8 text-ink/66">{description}</p>
            </article>

            {/* Slots */}
            <article className="rounded-[1.5rem] border border-ink/8 bg-white p-7 shadow-soft sm:p-9">
              <h2 className="text-2xl font-black uppercase tracking-tight text-ink">Créneaux</h2>
              {slotsByDay.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {slotsByDay.map((group) => (
                    <div key={group.day} className="rounded-2xl border border-ink/8 p-4">
                      <h3 className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-ember">
                        {DAY_LABELS[group.day]}
                      </h3>
                      <div className="space-y-3">
                        {group.slots.map((slot) => (
                          <div key={`${slot.id}-${slot.startTime}`} className="grid gap-2 text-sm text-ink/70 sm:grid-cols-[160px_1fr]">
                            <p className="flex items-center gap-2 font-bold text-ink">
                              <Clock3 className="h-4 w-4 text-ember" />
                              {slot.startTime} – {slot.endTime}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-ember" />
                              {slot.location || slot.pool || activity.location || "Piscine Port Marchand"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-base leading-7 text-ink/60">Planning à confirmer.</p>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-[1.5rem] border border-ink/8 bg-white p-6 shadow-soft">
              <h2 className="text-lg font-black uppercase tracking-tight text-ink">Informations</h2>
              <dl className="mt-5 space-y-4 text-sm">
                {(activity.ageRange || activity.audience) && (
                  <InfoRow icon={<Users className="h-4 w-4 text-ember" />} label="Public" value={activity.ageRange || activity.audience} />
                )}
                <InfoRow icon={<MapPin className="h-4 w-4 text-ember" />} label="Lieu" value={activity.location || "Piscine Port Marchand"} />
                {activity.coach && (
                  <InfoRow icon={<UserRound className="h-4 w-4 text-ember" />} label="Coach" value={activity.coach} />
                )}
                <InfoRow icon={<CalendarDays className="h-4 w-4 text-ember" />} label="Tarif" value={priceLabel(activity)} />
                {activity.season && (
                  <InfoRow icon={<CalendarDays className="h-4 w-4 text-ember" />} label="Saison" value={activity.season} />
                )}
                {activity.capacity > 0 && (
                  <InfoRow
                    icon={<Users className="h-4 w-4 text-ember" />}
                    label="Places"
                    value={activity.enrolled > 0 ? `${activity.enrolled}/${activity.capacity}` : `${activity.capacity} places`}
                  />
                )}
              </dl>
            </div>

            <div className="rounded-[1.5rem] border border-ink/8 bg-ink p-6 text-white shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Inscription</p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Le panier, le paiement et l&apos;espace adhérent sont gérés sur app.toulonwaterpolo.fr.
              </p>
              <a
                href={registrationUrl(activity)}
                aria-disabled={disabled}
                className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition ${
                  disabled
                    ? "pointer-events-none bg-white/15 text-white/55"
                    : "bg-ember text-white hover:bg-white hover:text-ink"
                }`}
              >
                {disabled ? statusLabel(activity) : activity.ctaLabel || "S'inscrire"}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink/8 pb-4 last:border-b-0 last:pb-0">
      <dt className="flex items-center gap-2 font-bold uppercase tracking-[0.12em] text-ink/45">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-semibold text-ink/75">{value}</dd>
    </div>
  );
}
