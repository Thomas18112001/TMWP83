"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, MapPin, Trophy, Users, Waves } from "lucide-react";
import { publicActivityPath } from "../lib/public-activities";
import type { PublicActivity, PublicActivitySlot } from "../lib/public-activities";

const APP_BASE_URL = (process.env.NEXT_PUBLIC_TMWP_APP_URL || "https://app.toulonwaterpolo.fr").replace(/\/+$/, "");
const DAY_ORDER: PublicActivitySlot["day"][] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const DAY_LABELS: Record<PublicActivitySlot["day"], string> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  dimanche: "Dimanche",
};
const PLANNING_COLORS = ["#d5241d", "#1667b7", "#059669", "#7c3aed", "#f59e0b", "#0891b2", "#be123c"];

type PlanningBlock = {
  activity: PublicActivity;
  slot: PublicActivitySlot;
  startMinutes: number;
  endMinutes: number;
  lane: number;
  laneCount: number;
  color: string;
};

function activityRegistrationUrl(activity: Pick<PublicActivity, "slug" | "id">) {
  const key = activity.id || activity.slug;
  return `${APP_BASE_URL}/inscription/panier?activity=${encodeURIComponent(key)}`;
}

function statusLabel(activity: PublicActivity) {
  if (activity.status === "closed") return "Fermé";
  if (activity.status === "full" || activity.registrationStatus === "full") return "Complet";
  if (activity.registrationStatus === "waitlist") return "Liste d'attente";
  return "Ouvert";
}

function statusClasses(activity: PublicActivity) {
  if (activity.status === "closed") return "bg-ink/10 text-ink/55";
  if (activity.status === "full" || activity.registrationStatus === "full") return "bg-ember/10 text-ember";
  return "bg-green-600/10 text-green-700";
}

function typeIcon(activity: PublicActivity) {
  if (activity.practiceType === "competition") return Trophy;
  if ((activity.audience || activity.category).toLowerCase().includes("jeune")) return Users;
  return Waves;
}

function firstSchedule(activity: PublicActivity) {
  const slot = inferSlots(activity)[0];
  if (slot) return `${DAY_LABELS[slot.day]} ${slot.startTime} - ${slot.endTime}`;
  return activity.schedule || "Planning à confirmer";
}

function priceLabel(activity: PublicActivity) {
  if (activity.price > 0) return `${activity.price.toLocaleString("fr-FR")} €`;
  if (activity.monthlyPrice > 0) return `${activity.monthlyPrice.toLocaleString("fr-FR")} €/mois`;
  return "Tarif à confirmer";
}

function fallbackImage(index: number) {
  const images = [
    "/images/entrainement-tmwp83-piscine-port-marchand.jpg",
    "/images/duel-water-polo-bras-leve.jpg",
    "/images/joueuse-tmwp83-tir-water-polo-match.jpg",
  ];
  return images[index % images.length];
}

function activityCategory(activity: PublicActivity) {
  return activity.category || activity.audience || activity.practiceType || "Activité";
}

export function PublicActivitiesPreview({ activities }: { activities: PublicActivity[] }) {
  const visible = activities.slice(0, 3);

  return (
    <section className="bg-white py-20 lg:py-28 dark:bg-[#13151a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Activités</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">Trouver sa place</h2>
          </div>
          <Link href="/activites" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ember transition-opacity hover:opacity-75">
            Toutes les activités <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {visible.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PublicActivitiesPage({ activities }: { activities: PublicActivity[] }) {
  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Inscriptions</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">Activités ouvertes</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/60">Ces informations viennent du backoffice TMWP83. Les inscriptions restent gérées dans l'espace adhérent.</p>
          </div>
          <a href={APP_BASE_URL} className="button-sheen wave-dark inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ember">
            Espace adhérent
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PublicPlanningPage({ activities }: { activities: PublicActivity[] }) {
  const categories = useMemo(() => {
    return Array.from(new Set(activities.map(activityCategory))).filter(Boolean).sort((a, b) => a.localeCompare(b, "fr"));
  }, [activities]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const filteredActivities = selectedCategory === "Tous" ? activities : activities.filter((activity) => activityCategory(activity) === selectedCategory);
  const planning = useMemo(() => buildPlanningBlocks(filteredActivities), [filteredActivities]);
  const rowsByDay = useMemo(() => groupBlocksByDay(planning.blocks), [planning.blocks]);

  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Planning</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">Créneaux publics</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/60">Le planning public est dérivé des créneaux renseignés dans les activités TMWP83. Les fiches restent la référence pour les inscriptions.</p>
          </div>
          <a href={APP_BASE_URL} className="button-sheen wave-dark inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ember">
            Se connecter
          </a>
        </div>

        {categories.length > 1 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {["Tous", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  selectedCategory === category
                    ? "border-ember bg-ember text-white"
                    : "border-ink/10 bg-white text-ink/65 hover:border-ember hover:text-ember"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="hidden overflow-x-auto rounded-[1.25rem] border border-ink/10 bg-white shadow-soft lg:block">
          <div className="relative min-w-[1120px]" style={{ height: planning.height + 58 }}>
            <div className="sticky top-0 z-20 grid h-[58px] grid-cols-[72px_repeat(7,1fr)] border-b border-ink/10 bg-ink text-white">
              <div className="flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Heure</div>
              {DAY_ORDER.map((day) => (
                <div key={day} className="flex items-center justify-center border-l border-white/10 text-xs font-black uppercase tracking-[0.2em]">
                  {DAY_LABELS[day]}
                </div>
              ))}
            </div>
            <div className="absolute left-0 right-0 top-[58px]" style={{ height: planning.height }}>
              {planning.hours.map((hour) => (
                <div key={hour} className="absolute left-0 right-0 border-t border-ink/8" style={{ top: hourToTop(hour, planning.startHour) }}>
                  <span className="absolute left-3 -translate-y-1/2 rounded-full bg-white px-2 text-[11px] font-bold text-ink/45">{`${String(hour).padStart(2, "0")}:00`}</span>
                </div>
              ))}
              <div className="absolute inset-y-0 left-[72px] right-0 grid grid-cols-7">
                {DAY_ORDER.map((day) => (
                  <div key={day} className="border-l border-ink/8" />
                ))}
              </div>
              {planning.blocks.map((block) => (
                <Link
                  key={`${block.activity.id}-${block.slot.id}-${block.slot.day}-${block.slot.startTime}`}
                  href={publicActivityPath(block.activity)}
                  className="absolute z-10 overflow-hidden rounded-xl border border-white/45 p-3 text-white shadow-[0_14px_35px_rgba(28,28,28,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(28,28,28,0.28)]"
                  style={blockStyle(block, planning.startHour)}
                >
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">{block.slot.startTime} - {block.slot.endTime}</span>
                  <span className="mt-1 block truncate text-sm font-black uppercase">{block.activity.name}</span>
                  <span className="mt-1 block truncate text-xs font-semibold text-white/75">{block.slot.location || block.activity.location || "Piscine Port Marchand"}</span>
                </Link>
              ))}
              {planning.blocks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink/55">Aucun créneau publié pour le moment.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:hidden">
          {DAY_ORDER.map((day) => {
            const dayRows = rowsByDay[day] || [];
            if (dayRows.length === 0) return null;

            return (
              <section key={day} className="rounded-[1.25rem] border border-ink/10 bg-white p-4 shadow-soft">
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-ember">{DAY_LABELS[day]}</h3>
                <div className="space-y-3">
                  {dayRows.map((block) => (
                    <Link key={`${block.activity.id}-${block.slot.id}-${block.slot.startTime}`} href={publicActivityPath(block.activity)} className="block rounded-2xl border border-ink/8 p-4 transition hover:border-ember">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-black uppercase text-ink">{block.activity.name}</p>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${statusClasses(block.activity)}`}>{statusLabel(block.activity)}</span>
                      </div>
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink/65"><Clock3 className="h-4 w-4 text-ember" />{block.slot.startTime} - {block.slot.endTime}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-ink/55"><MapPin className="h-4 w-4 text-ember" />{block.slot.location || block.activity.location || "Piscine Port Marchand"}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          {planning.blocks.length === 0 && (
            <div className="rounded-[1.25rem] border border-ink/10 bg-white px-5 py-10 text-center text-sm font-semibold text-ink/55 shadow-soft">Aucun créneau publié pour le moment.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ activity, index }: { activity: PublicActivity; index: number }) {
  const Icon = typeIcon(activity);
  const disabled = activity.status === "closed" || activity.status === "full" || activity.registrationStatus === "full";
  const detailHref = publicActivityPath(activity);
  const registerUrl = activityRegistrationUrl(activity);

  return (
    <article className="news-glow interactive-panel group flex min-h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/8 bg-white shadow-soft dark:bg-[#1c1f28]">
      <Link href={detailHref} className="relative h-48 overflow-hidden bg-ink">
        <img src={activity.heroImageUrl || fallbackImage(index)} alt={activity.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClasses(activity)}`}>{statusLabel(activity)}</span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember"><Icon className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold uppercase tracking-[0.2em] text-ember">{activity.category || activity.practiceType}</p>
            <Link href={detailHref} className="mt-1 block text-xl font-black uppercase leading-tight text-ink transition hover:text-ember dark:text-white">{activity.name}</Link>
          </div>
        </div>
        <p className="flex-1 text-sm leading-7 text-ink/62 dark:text-white/60">{activity.shortDescription || activity.longDescription || "Description à venir."}</p>
        <div className="mt-5 space-y-2 border-t border-ink/10 pt-5 text-sm text-ink/60 dark:text-white/55">
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-ember" />{firstSchedule(activity)}</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ember" />{activity.location || "Piscine Port Marchand"}</p>
          <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-ember" />{priceLabel(activity)}</p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={registerUrl} aria-disabled={disabled} className={`button-sheen inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition ${disabled ? "pointer-events-none bg-ink/30" : "wave-red bg-ember hover:bg-ink"}`}>
            {disabled ? statusLabel(activity) : activity.ctaLabel || "S'inscrire"}
          </a>
          <Link href={detailHref} className="inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:border-ember hover:text-ember dark:text-white">
            Voir la fiche
          </Link>
        </div>
      </div>
    </article>
  );
}

function inferSlots(activity: PublicActivity): PublicActivitySlot[] {
  if (activity.timeSlots.length > 0) return activity.timeSlots;

  const schedule = activity.schedule || "";
  const timeMatch = schedule.match(/(\d{1,2})\s*h?\s*(\d{0,2})\s*[-–—]\s*(\d{1,2})\s*h?\s*(\d{0,2})/i);
  if (!timeMatch) return [];

  const startTime = `${timeMatch[1].padStart(2, "0")}:${(timeMatch[2] || "00").padStart(2, "0")}`;
  const endTime = `${timeMatch[3].padStart(2, "0")}:${(timeMatch[4] || "00").padStart(2, "0")}`;
  const normalized = schedule.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const days = DAY_ORDER.filter((day) => normalized.includes(day.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || normalized.includes(day.slice(0, 3)));

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

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours)) return 0;
  return hours * 60 + (Number.isFinite(minutes) ? minutes : 0);
}

function buildPlanningBlocks(activities: PublicActivity[]) {
  const baseBlocks = activities.flatMap((activity, activityIndex) =>
    inferSlots(activity).map((slot) => ({
      activity,
      slot,
      startMinutes: toMinutes(slot.startTime),
      endMinutes: toMinutes(slot.endTime),
      lane: 0,
      laneCount: 1,
      color: activity.planningColor || PLANNING_COLORS[activityIndex % PLANNING_COLORS.length],
    }))
  ).filter((block) => block.endMinutes > block.startMinutes);

  const startHour = Math.max(6, Math.floor((Math.min(...baseBlocks.map((block) => block.startMinutes), 8 * 60) - 30) / 60));
  const endHour = Math.min(23, Math.ceil((Math.max(...baseBlocks.map((block) => block.endMinutes), 22 * 60) + 30) / 60));
  const blocks: PlanningBlock[] = [];

  DAY_ORDER.forEach((day) => {
    const dayBlocks = baseBlocks
      .filter((block) => block.slot.day === day)
      .sort((a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes);
    const lanes: number[] = [];

    dayBlocks.forEach((block) => {
      let lane = lanes.findIndex((end) => end <= block.startMinutes);
      if (lane === -1) lane = lanes.length;
      lanes[lane] = block.endMinutes;
      blocks.push({ ...block, lane, laneCount: 1 });
    });

    blocks
      .filter((block) => block.slot.day === day)
      .forEach((block) => {
        const overlaps = dayBlocks.filter((candidate) => candidate.startMinutes < block.endMinutes && candidate.endMinutes > block.startMinutes);
        block.laneCount = Math.max(1, ...overlaps.map((candidate) => {
          const placed = blocks.find((item) => item.activity.id === candidate.activity.id && item.slot.id === candidate.slot.id && item.slot.startTime === candidate.slot.startTime);
          return placed ? placed.lane + 1 : 1;
        }));
      });
  });

  return {
    blocks,
    startHour,
    endHour,
    hours: Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index),
    height: Math.max(520, (endHour - startHour) * 78),
  };
}

function hourToTop(hour: number, startHour: number) {
  return (hour - startHour) * 78;
}

function blockStyle(block: PlanningBlock, startHour: number): CSSProperties {
  const dayIndex = DAY_ORDER.indexOf(block.slot.day);
  const leftBase = 72 + dayIndex * ((1120 - 72) / 7);
  const columnWidth = (1120 - 72) / 7;
  const top = ((block.startMinutes - startHour * 60) / 60) * 78 + 8;
  const height = Math.max(58, ((block.endMinutes - block.startMinutes) / 60) * 78 - 10);
  const laneGap = 4;
  const innerWidth = columnWidth - 12;
  const laneWidth = (innerWidth - laneGap * (block.laneCount - 1)) / block.laneCount;

  return {
    top,
    left: leftBase + 6 + block.lane * (laneWidth + laneGap),
    width: laneWidth,
    height,
    background: block.color,
  };
}

function groupBlocksByDay(blocks: PlanningBlock[]) {
  return DAY_ORDER.reduce<Record<PublicActivitySlot["day"], PlanningBlock[]>>((acc, day) => {
    acc[day] = blocks
      .filter((block) => block.slot.day === day)
      .sort((a, b) => a.startMinutes - b.startMinutes || a.activity.name.localeCompare(b.activity.name, "fr"));
    return acc;
  }, {
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: [],
  });
}
