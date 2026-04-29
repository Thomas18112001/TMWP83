"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Medal,
  Phone,
  ShieldCheck,
  Trophy,
  Users,
  Waves,
  X,
} from "lucide-react";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { ContactForm } from "@/components/contact-form";
import { formatFfnDate, type FfnFeedStatus, type FfnMatch, type FfnRosterPlayer, type FfnStandingRow } from "@/lib/ffn-data";
import { publicActivityPath, type PublicActivity, type PublicActivitySlot, type PublicActivitiesStatus } from "@/lib/public-activities";
import {
  CLUB_INFO,
  CLUB_VALUE_ICONS,
  CLUB_VALUES,
  HOME_PARTNER_LOGOS,
  NEWS_ARTICLES,
  PARTNER_FEATURES,
  PARTNER_GROUPS,
  type PageContent,
} from "@/lib/site-data";

/* ─── Image paths ─────────────────────────────────────────── */
const IMG = {
  equipeelite: "/images/collectif-tmwp83-avant-match.jpg",
  team: "/images/banc-joueuses-tmwp83-match.jpg",
  under: "/images/plongeon-defense-tmwp83.jpg",
  portrait: "/images/action-joueuse-tmwp83.png",
  resort: "/images/entrainement-tmwp83-piscine-port-marchand.jpg",
  gloves: "/images/coach-tmwp83-bord-bassin.jpg",
  aerial: "/images/piscine-port-marchand-toulon-bassin-exterieur.jpg",
  male: "/images/tir-puissant-tmwp83-water-polo.jpg",
};

const APP_URL = (process.env.NEXT_PUBLIC_TMWP_APP_URL || "https://app.toulonwaterpolo.fr").replace(/\/+$/, "");

function isToulon(structureId?: string | null, team?: string) {
  return structureId === "2326" || team === "TOULON WATERPOLO";
}

function FfnTeamLogo({ src, name }: { src: string | null; name: string }) {
  if (!src) return null;
  return <img src={src} alt={`Logo ${name}`} className="h-9 w-9 shrink-0 rounded-md object-contain" loading="lazy" />;
}

function activityAppUrl(activity: Pick<PublicActivity, "slug" | "id">) {
  const key = activity.slug || activity.id;
  return `${APP_URL}/inscription/panier?activity=${encodeURIComponent(key)}`;
}

function activityStatusLabel(activity: PublicActivity) {
  if (activity.status === "closed") return "Fermé";
  if (activity.status === "full" || activity.registrationStatus === "full") return "Complet";
  if (activity.registrationStatus === "waitlist") return "Liste d'attente";
  return "Ouvert";
}

function activityIsDisabled(activity: PublicActivity) {
  return activity.status === "closed" || activity.status === "full" || activity.registrationStatus === "full";
}

function activityPriceLabel(activity: PublicActivity) {
  if (activity.price > 0) return `${activity.price.toLocaleString("fr-FR")} €`;
  if (activity.monthlyPrice > 0) return `${activity.monthlyPrice.toLocaleString("fr-FR")} €/mois`;
  return "Tarif à confirmer";
}

function activityScheduleLabel(activity: PublicActivity) {
  const slot = activity.timeSlots[0];
  if (slot) return `${slot.day} ${slot.startTime}-${slot.endTime}`;
  return activity.schedule || "Planning à confirmer";
}

function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}


/* ─── Page → image map ────────────────────────────────────── */
const PAGE_IMAGES: Record<string, { src: string; ghost: string; alt?: string }> = {
  "le-club":               { src: IMG.gloves,  ghost: "LE CLUB", alt: "Coach du TMWP83 au bord du bassin pendant une seance water-polo" },
  "activites":             { src: IMG.resort,  ghost: "ACTIVITES", alt: "Entrainement TMWP83 a la Piscine Port Marchand" },
  "equipe-feminine-elite": { src: IMG.team,    ghost: "ÉLITE" },
  "equipes":               { src: IMG.male,    ghost: "ÉQUIPES" },
  "competitions":          { src: IMG.under,   ghost: "COMPÉTITIONS" },
  "partenaires":           { src: IMG.aerial,  ghost: "PARTENAIRES", alt: "Piscine Port Marchand a Toulon, bassin du TMWP83" },
  "actualites":            { src: "/images/joueuse-tmwp83-numero-sept-tir.jpg",    ghost: "NEWS", alt: "Joueuse du TMWP83 numero sept en action de tir" },
  "contact":               { src: IMG.resort,  ghost: "CONTACT", alt: "Bassin exterieur de la Piscine Port Marchand a Toulon" },
};

/* ══════════════════════════════════════════════════════════ */
/*  HOME PAGE                                                 */
/* ══════════════════════════════════════════════════════════ */

export function HomePage({
  ffnFixtures = [],
  ffnStatus = "empty",
  activities = [],
  activitiesStatus = "empty",
}: {
  ffnFixtures?: FfnMatch[];
  ffnStatus?: FfnFeedStatus;
  activities?: PublicActivity[];
  activitiesStatus?: PublicActivitiesStatus;
}) {
  return (
    <div className="home-shell overflow-hidden">
      <HomeHeroPremium />
      <PartnersStrip />
      <HomeEliteSpotlight />
      <HomeUpcomingMatchesSection ffnFixtures={ffnFixtures} ffnStatus={ffnStatus} />
      <HomeClubAmbition />
      <HomeFindYourPlace activities={activities} activitiesStatus={activitiesStatus} />
      <HomeGallerySection />
      <HomeLatestNewsSection />
      <HomeEliteConversionBlock />
      <HomeFaqSection />
    </div>
  );
}


/* ── Partners Strip ─────────────────────────────────────── */
function HomeHeroPremium() {
  return (
    <section className="home-hero relative -mb-px overflow-hidden bg-ink">
      <Image
        src={IMG.equipeelite}
        alt="Joueuse du Toulon Métropole Water-Polo 83 en action pendant un match"
        fill
        sizes="100vw"
        className="scale-[1.03] object-cover object-center opacity-85 transition-transform duration-[1200ms]"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/55 to-ink/18" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/58 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="home-hero__inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="home-hero__content">
              <p className="home-hero__eyebrow font-bold uppercase !text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                Toulon · Var · Depuis 2010
              </p>
              <h1 className="home-hero__title break-words font-black text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
                Toulon M&eacute;tropole
                <span className="mt-2 block">Water-Polo 83</span>
              </h1>
              <p className="home-hero__text font-medium text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]">
                Le club toulonnais de r&eacute;f&eacute;rence pour pratiquer le water polo &agrave; Toulon :
                &eacute;quipe &eacute;lite f&eacute;minine, formation des jeunes d&egrave;s 8 ans, activit&eacute;s sportives
                et accompagnement pour rejoindre le club toute la saison.
              </p>
              <div className="home-hero__actions flex flex-wrap">
                <Link
                  href="/activites"
                  data-cursor="interactive"
                  className="home-hero__button button-sheen wave-red inline-flex items-center justify-center rounded-full border border-ember/20 bg-gradient-to-r from-ember via-[#e33b2d] to-wp-red-dark font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_40px_rgba(213,36,29,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(213,36,29,0.42)]"
                >
                  Voir les activit&eacute;s
                </Link>
                <Link
                  href="/contact"
                  data-cursor="interactive"
                  className="home-hero__button button-sheen wave-ghost inline-flex items-center justify-center rounded-full border border-white/24 bg-white/8 font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/45 hover:bg-white/15"
                >
                  Nous rejoindre
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PartnersStrip() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    pressed: false,
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    moved: false
  });
  const suppressClickRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoScrollActiveRef = useRef(true);
  const autoScrollStateRef = useRef({
    currentVelocity: 28,
    targetVelocity: 28
  });
  const scrollPositionRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const normalizeScrollPosition = (container: HTMLDivElement) => {
    const halfWidth = container.scrollWidth / 2;

    if (!halfWidth) {
      return 0;
    }

    return ((scrollPositionRef.current % halfWidth) + halfWidth) % halfWidth;
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resetToLoopMidpoint = () => {
      scrollPositionRef.current = container.scrollWidth / 2;
      scrollPositionRef.current = normalizeScrollPosition(container);
      container.scrollLeft = scrollPositionRef.current;
    };

    resetToLoopMidpoint();

    let frameId = 0;
    let lastTime = 0;
    const baseVelocity = 28;

    const step = (time: number) => {
      if (!lastTime) {
        lastTime = time;
      }

      const elapsed = time - lastTime;
      lastTime = time;
      const autoScrollState = autoScrollStateRef.current;
      const isPaused =
        dragStateRef.current.active || !autoScrollActiveRef.current;
      autoScrollState.targetVelocity = isPaused ? 0 : baseVelocity;
      const easing = 1 - Math.exp(-elapsed / 240);
      autoScrollState.currentVelocity +=
        (autoScrollState.targetVelocity - autoScrollState.currentVelocity) *
        easing;

      if (Math.abs(autoScrollState.currentVelocity) > 0.01) {
        scrollPositionRef.current +=
          (autoScrollState.currentVelocity * elapsed) / 1000;
        scrollPositionRef.current = normalizeScrollPosition(container);
        container.scrollLeft = scrollPositionRef.current;
      }

      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const pauseAutoScroll = () => {
    autoScrollActiveRef.current = false;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const resumeAutoScroll = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = setTimeout(() => {
      autoScrollActiveRef.current = true;
      resumeTimeoutRef.current = null;
    }, 2400);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    dragStateRef.current = {
      pressed: true,
      active: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: scrollPositionRef.current,
      moved: false
    };

    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;

    if (!container || !dragState.pressed) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.active) {
      const crossedDragThreshold =
        Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY);

      if (!crossedDragThreshold) {
        return;
      }

      dragState.active = true;
      pauseAutoScroll();
      setIsDragging(true);
    }

    if (Math.abs(deltaX) > 4) {
      dragState.moved = true;
    }

    scrollPositionRef.current = dragState.startScrollLeft - deltaX;
    scrollPositionRef.current = normalizeScrollPosition(container);
    container.scrollLeft = scrollPositionRef.current;
  };

  const endDrag = () => {
    const dragState = dragStateRef.current;
    const container = containerRef.current;

    if (!container || !dragState.pressed) {
      return;
    }

    const didDrag = dragState.active;
    const didMove = dragState.moved;
    const pointerId = dragState.pointerId;

    dragStateRef.current = {
      pressed: false,
      active: false,
      pointerId: -1,
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      moved: false
    };

    if (container.hasPointerCapture(pointerId)) {
      container.releasePointerCapture(pointerId);
    }

    suppressClickRef.current = didMove;
    if (didDrag) {
      setIsDragging(false);
      resumeAutoScroll();
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  return (
    <section className="relative -mt-px overflow-hidden border-0 bg-[rgba(255,255,255,0.85)] backdrop-blur-md dark:bg-white">
      <div className="relative z-20 bg-ember px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.28em] text-white">
        Merci &agrave; nos partenaires
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[44px] bg-[linear-gradient(90deg,rgba(213,36,29,0.03),transparent_18%,transparent_82%,rgba(28,28,28,0.03))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 top-[44px] z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-16 lg:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 top-[44px] z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-16 lg:w-24" />
      <div
        ref={containerRef}
        className={`overflow-x-scroll ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={handleClickCapture}
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          touchAction: "pan-y",
          userSelect: isDragging ? "none" : "auto"
        }}
      >
        <div className="flex w-max items-center gap-12 py-7 pr-12 sm:gap-16 sm:py-8 sm:pr-16 lg:gap-20 lg:py-10">
          {[...HOME_PARTNER_LOGOS, ...HOME_PARTNER_LOGOS].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              data-cursor="interactive"
              className="relative h-14 w-[140px] shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:h-16 sm:w-[176px] lg:h-20 lg:w-[228px]"
            >
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                draggable={false}
                loading="lazy"
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 176px, 228px"
                className="pointer-events-none object-contain opacity-75 transition duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Elite Spotlight ────────────────────────────────────── */
function EliteSpotlight() {
  return (
    <section className="bg-shell py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid items-center gap-12 lg:grid-cols-[1fr_400px]">

          {/* Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Équipe Féminine Élite
            </p>
            <h2 className="mt-4 font-black uppercase leading-[1.05] tracking-tight text-ink">
              <span className="block text-3xl sm:text-4xl lg:text-5xl">Porter</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl">Le Water-Polo Féminin</span>
              <span className="block text-4xl text-ember sm:text-5xl lg:text-6xl">Au Sommet</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink/65">
              Le fer de lance du projet sportif. Ambition, exigence et
              performance au plus haut niveau national.
            </p>
            {/* Stats */}
            <div className="mt-8 flex gap-8 border-t border-ink/10 pt-8">
              {[
                { v: "13", l: "Joueuses" },
                { v: "4", l: "Victoires" },
                { v: "150+", l: "Matchs joués" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-black text-ember">{s.v}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-ink/50">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/equipes/feminine-elite"
                data-cursor="interactive"
                className="button-sheen wave-dark inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ember hover:shadow-[0_20px_40px_rgba(213,36,29,0.28)]"
              >
                Voir l&apos;équipe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative">
            <div className="media-glow interactive-panel relative overflow-hidden rounded-[2rem] border border-white/30 shadow-soft">
              <Image
                src={IMG.portrait}
                alt="Portrait action d'une joueuse elite du TMWP83 dans le bassin"
                width={400}
                height={500}
                className="h-[480px] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                  TMWP83
                </p>
                <p className="text-xl font-black uppercase text-white">
                  Saison 2025-2026
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Upcoming Matches Section ───────────────────────────── */
function UpcomingMatchesSection({ ffnFixtures }: { ffnFixtures: FfnMatch[] }) {
  const hasLive = ffnFixtures.length > 0;
  return (
    <section className="relative bg-white/75 py-20 lg:py-28 dark:bg-[#13151a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.08),transparent_30%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Calendrier
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Prochains matchs
          </h2>
        </Reveal>
        {hasLive ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {ffnFixtures.map((m, index) => (
              <Reveal key={m.matchId ?? `${m.date}-${m.home}-${m.away}-${index}`} delay={index * 90}>
                <HomeMatchCard
                  competition={m.competition}
                  home={m.home}
                  away={m.away}
                  homeLogo={m.homeLogo}
                  awayLogo={m.awayLogo}
                  homeStructureId={m.homeStructureId}
                  awayStructureId={m.awayStructureId}
                  date={formatFfnDate(m.date)}
                  time={m.time ?? "\u2014"}
                  location={m.isHome ? "Port Marchand" : "Déplacement"}
                  isHome={m.isHome}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-ink/8 bg-white p-10 text-center shadow-soft dark:border-white/8 dark:bg-white/5">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember/10">
                <Trophy className="h-7 w-7 text-ember" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-ink dark:text-white">
                Fin de saison régulière
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-ink/55 dark:text-white/55">
                Tous les matchs de la saison sont joués. Retrouvez le bilan complet et les résultats sur la page Compétitions.
              </p>
              <Link
                href="/competitions"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-ink hover:-translate-y-0.5"
              >
                Voir les résultats
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        )}
        {hasLive && (
          <Reveal className="mt-8 text-center">
            <a
              href="/competitions"
              data-cursor="interactive"
              className="premium-link inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-ink"
            >
              Tous les matchs
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ── Club Ambition ──────────────────────────────────────── */
function ClubAmbition() {
  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Le club
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-ink sm:text-5xl">
              Un club,<br />une ambition
            </h2>
            <p className="mt-5 text-base leading-7 text-ink/65">
              Depuis 2010, le TMWP83 bâtit à Toulon un projet sportif singulier : une filière complète du premier ballon jusqu&apos;à l&apos;élite nationale, portée par des éducateurs diplômés et une culture de l&apos;exigence collective.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/65">
              Ancré à la Piscine Port Marchand, le club réunit chaque semaine des sportifs de tous âges et de tous niveaux — de l&apos;école de water-polo dès 8 ans à l&apos;équipe féminine engagée en championnat national. Un projet humain, structurant, tourné vers l&apos;avenir du water-polo dans le Var.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 border-t border-ink/10 pt-8">
              {[
                { v: "2010", l: "Année de création" },
                { v: "3", l: "Sections actives" },
                { v: "Var", l: "Ancrage régional" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-2xl font-black text-ember">{s.v}</p>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/45">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/le-club"
                data-cursor="interactive"
                className="button-sheen wave-dark inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ember hover:shadow-[0_20px_40px_rgba(213,36,29,0.28)]"
              >
                Découvrir le club
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {/* Image */}
          <div className="media-glow interactive-panel overflow-hidden rounded-[2rem] border border-white/30 shadow-soft">
            <Image
              src={IMG.aerial}
              alt="Piscine Port Marchand a Toulon, bassin du TMWP83"
              width={700}
              height={480}
              className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Find Your Place ────────────────────────────────────── */
const FIND_YOUR_PLACE_ITEMS = [
  {
    Icon: Users,
    title: "École de Water-Polo",
    description:
      "Dès 8 ans, une progression structurée avec des éducateurs diplômés d'État. Découverte, perfectionnement et premières compétitions en championnat FFN.",
    href: "/activites",
    cta: "Voir les créneaux",
  },
  {
    Icon: Trophy,
    title: "Compétition Élite",
    description:
      "L'équipe féminine en championnat national. Rejoignez la vitrine sportive du club, suivez les matchs, les résultats et le classement en direct.",
    href: "/equipes/feminine-elite",
    cta: "Voir l'équipe",
  },
  {
    Icon: Waves,
    title: "Section Loisir",
    description:
      "Une pratique adulte conviviale, sans pression de résultat. Condition physique, esprit d'équipe et plaisir du water-polo, à la Piscine Port Marchand.",
    href: "/activites",
    cta: "S'inscrire",
  },
];

function FindYourPlace() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 lg:py-28 dark:bg-[#13151a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Nous rejoindre
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Trouver sa place
          </h2>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {FIND_YOUR_PLACE_ITEMS.map(({ Icon, title, description, href, cta }, index) => {
            const isDark =
              hoveredIndex === null ? index === 0 : hoveredIndex === index;
            const isLifted = hoveredIndex === index;

            return (
              <Reveal key={title} delay={index * 90}>
                <div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  data-cursor="interactive"
                  style={{ willChange: "transform, background-color, box-shadow" }}
                  className={[
                    "flex flex-col rounded-[2rem] p-8",
                    "transition-[transform,background-color,border-color,box-shadow,color]",
                    "duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isLifted ? "-translate-y-[9px]" : "translate-y-0",
                    isDark
                      ? "border border-transparent bg-ink shadow-[0_28px_70px_rgba(15,23,42,0.22),0_10px_36px_rgba(213,36,29,0.10)]"
                      : "border border-ink/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)] dark:bg-[#1c1f28] dark:border-white/8",
                  ].join(" ")}
                >
                  {/* Icon badge */}
                  <div
                    className={[
                      "mb-6 flex h-12 w-12 items-center justify-center rounded-2xl",
                      "transition-[background-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isDark
                        ? "bg-ember shadow-[0_14px_28px_rgba(213,36,29,0.35)]"
                        : "bg-ember/10 shadow-none",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-6 w-6 transition-colors duration-[400ms]",
                        isDark ? "text-white" : "text-ember",
                      ].join(" ")}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={[
                      "text-2xl font-black uppercase tracking-tight",
                      "transition-colors duration-[400ms]",
                      isDark ? "text-white" : "text-ink dark:text-[#f0ede8]",
                    ].join(" ")}
                  >
                    {title}
                  </h3>

                  {/* Description */}
                  <p
                    className={[
                      "mt-4 flex-1 text-sm leading-7",
                      "transition-colors duration-[400ms]",
                      isDark ? "text-white/65" : "text-ink/60 dark:text-white/55",
                    ].join(" ")}
                  >
                    {description}
                  </p>

                  {/* CTA */}
                  <Link
                    href={href}
                    data-cursor="interactive"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ember transition-[transform,opacity] duration-300 hover:translate-x-1 hover:opacity-80"
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Gallery ────────────────────────────────────────────── */
const HOME_JOIN_ITEMS = [
  {
    Icon: Users,
    title: "École de Water-Polo",
    description:
      "Dès 8 ans, une progression structurée avec des éducateurs diplômés, de la découverte jusqu'aux premières compétitions.",
    href: "/activites",
    cta: "Voir les activités",
  },
  {
    Icon: Trophy,
    title: "Compétition élite",
    description:
      "L'équipe féminine engagée au niveau national porte l'ambition sportive du club et attire le public autour des matchs.",
    href: "/equipes/feminine-elite",
    cta: "Voir l'équipe",
  },
  {
    Icon: Waves,
    title: "Section loisir",
    description:
      "Une pratique adulte conviviale pour jouer, progresser et garder la forme dans l'esprit collectif du water polo.",
    href: "/activites",
    cta: "S'inscrire",
  },
];

const HOME_FAQ_ITEMS = [
  {
    question: "Où faire du water polo à Toulon ?",
    answer:
      "Le Toulon Métropole Water-Polo 83 accueille ses activités à partir de 8 ans et ses matchs à la Piscine du Port Marchand à Toulon.",
  },
  {
    question: "À partir de quel âge ?",
    answer:
      "Les activités du club sont accessibles à partir de 8 ans, avec des groupes adaptés à l'âge et au niveau.",
  },
  {
    question: "Faut-il savoir nager ?",
    answer:
      "Oui, une aisance minimum dans l'eau est recommandée pour débuter à partir de 8 ans. Les éducateurs accompagnent ensuite la progression.",
  },
  {
    question: "Comment s'inscrire ?",
    answer:
      "Vous pouvez consulter les activités accessibles à partir de 8 ans, ouvrir la fiche correspondante puis lancer l'inscription en ligne via l'espace adhérent.",
  },
  {
    question: "Peut-on voir un match ?",
    answer:
      "Oui, les matchs élite à domicile sont ouverts au public avec entrée gratuite à la Piscine Port Marchand.",
  },
  {
    question: "Prix de l'inscription ?",
    answer:
      "Le tarif dépend de l'activité choisie. Les informations tarifaires sont affichées sur les fiches activités avant validation.",
  },
];

function HomeEliteSpotlight() {
  return (
    <section className="bg-shell py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid items-center gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Équipe élite féminine
            </p>
            <h2 className="mt-4 font-black uppercase leading-[1.05] tracking-tight text-ink">
              <span className="block text-3xl sm:text-4xl lg:text-5xl">Performance,</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl">niveau national</span>
              <span className="block text-4xl text-ember sm:text-5xl lg:text-6xl">et identité du club</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink/65">
              Le Toulon Métropole Water-Polo 83 développe à Toulon un projet élite structuré autour de l’exigence, du collectif et de la formation. L’équipe féminine incarne le plus haut niveau du club et contribue activement au rayonnement de la discipline sur le territoire.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { Icon: Trophy, title: "Performance", text: "Un groupe engagé dans une logique de progression et de compétition." },
                { Icon: Medal, title: "Niveau", text: "Des rencontres référence pour voir du water polo féminin à Toulon." },
                { Icon: ShieldCheck, title: "Identité", text: "Une équipe qui porte les couleurs du club toulonnais et du Var." },
              ].map((item) => {
                const Icon = item.Icon;

                return (
                <div key={item.title} className="rounded-[1.35rem] border border-ink/8 bg-white/70 p-5 shadow-soft dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-ink/60">{item.text}</p>
                </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink/10 pt-8">
              {[
                { v: "13", l: "Joueuses" },
                { v: "National", l: "Niveau" },
                { v: "Gratuit", l: "Entrée public" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-black text-ember">{s.v}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-ink/50">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/equipes/feminine-elite"
                data-cursor="interactive"
                className="button-sheen wave-dark inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ember hover:shadow-[0_20px_40px_rgba(213,36,29,0.28)]"
              >
                Voir l'équipe élite
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/matchs"
                data-cursor="interactive"
                className="button-sheen wave-light inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:-translate-y-1"
              >
                Voir les matchs
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="media-glow interactive-panel relative overflow-hidden rounded-[2rem] border border-white/30 shadow-soft">
              <Image
                src={IMG.portrait}
                alt="Portrait action d'une joueuse élite du TMWP83 dans le bassin"
                width={400}
                height={500}
                className="h-[480px] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                  TMWP83
                </p>
                <p className="text-xl font-black uppercase text-white">
                  Équipe élite Toulon
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HomeUpcomingMatchesSection({
  ffnFixtures,
  ffnStatus,
}: {
  ffnFixtures: FfnMatch[];
  ffnStatus: FfnFeedStatus;
}) {
  const hasLive = ffnStatus === "ok" && ffnFixtures.length > 0;

  return (
    <section className="relative bg-white/75 py-20 lg:py-28 dark:bg-[#13151a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.08),transparent_30%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Calendrier
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Prochains matchs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/60">
            Suivez l'équipe élite féminine et venez voir un match de water polo à Toulon.
            Les rencontres à domicile à la Piscine Port Marchand sont ouvertes au public
            avec entrée gratuite.
          </p>
        </Reveal>
        {hasLive ? (
          <>
            <div className="mb-6 rounded-[1.5rem] border border-ember/15 bg-ember/5 px-5 py-4 text-center text-sm font-semibold text-ink/72">
              Entrée gratuite pour les matchs élite à domicile du Toulon Métropole Water-Polo 83.
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {ffnFixtures.map((m, index) => (
                <Reveal key={m.matchId ?? `${m.date}-${m.home}-${m.away}-${index}`} delay={index * 90}>
                  <HomeMatchCard
                    competition={m.competition}
                    home={m.home}
                    away={m.away}
                    homeLogo={m.homeLogo}
                    awayLogo={m.awayLogo}
                    homeStructureId={m.homeStructureId}
                    awayStructureId={m.awayStructureId}
                    date={formatFfnDate(m.date)}
                    time={m.time ?? "\u2014"}
                    location={m.isHome ? "Port Marchand" : "Déplacement"}
                    isHome={m.isHome}
                  />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-ink/8 bg-white p-10 text-center shadow-soft dark:border-white/8 dark:bg-white/5">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember/10">
                <Trophy className="h-7 w-7 text-ember" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-ink dark:text-white">
                {ffnStatus === "error" ? "Calendrier temporairement indisponible" : "Fin de saison"}
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-ink/55 dark:text-white/55">
                {ffnStatus === "error"
                  ? "Le flux FFN ne répond pas pour le moment. Consultez la page matchs pour les informations disponibles."
                  : "La saison en cours est terminée. Les prochains matchs seront affichés ici dès la reprise du championnat."}
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-ember">
                Entrée gratuite aux matchs élite à domicile
              </p>
            </div>
          </Reveal>
        )}
        <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/matchs"
            data-cursor="interactive"
            className="button-sheen wave-dark inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Voir les matchs
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/equipes/feminine-elite"
            data-cursor="interactive"
            className="button-sheen wave-light inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:-translate-y-0.5"
          >
            Voir l'équipe élite
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function HomeClubAmbition() {
  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Le club
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-ink sm:text-5xl">
              Un club ancré à <span className="text-ember">Toulon</span>,
              <br />
              une crédibilité sportive
            </h2>
            <p className="mt-5 text-base leading-7 text-ink/65">
              Depuis 2010, le TMWP83 développe à Toulon une filière complète du
              premier ballon jusqu'au niveau national. Le club structure la pratique
              du water polo autour de l'apprentissage, de la compétition et d'un
              encadrement cohérent pour les jeunes comme pour les adultes.
            </p>
            <p className="mt-4 text-base leading-7 text-ink/65">
              Basé à la Piscine Port Marchand, le club water polo Toulon réunit plus de
              150 licenciés, plusieurs groupes de pratique et une équipe élite féminine
              qui renforce l'attractivité sportive du territoire.
            </p>
            <div className="mt-8 grid gap-4 border-t border-ink/10 pt-8 sm:grid-cols-3">
              {[
                { v: "2010", l: "Ancienneté" },
                { v: "150+", l: "Licenciés" },
                { v: "National", l: "Niveau compétition" },
              ].map((s) => (
                <div key={s.l} className="rounded-[1.35rem] border border-ink/8 bg-white/70 p-5 shadow-soft dark:bg-white/5">
                  <p className="text-2xl font-black text-ember">{s.v}</p>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/45">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/le-club"
                data-cursor="interactive"
                className="button-sheen wave-dark inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ember hover:shadow-[0_20px_40px_rgba(213,36,29,0.28)]"
              >
                Découvrir le club
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                data-cursor="interactive"
                className="button-sheen wave-light inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-ink transition-all duration-300 hover:-translate-y-1"
              >
                Contacter
              </Link>
            </div>
          </div>
          <div className="media-glow interactive-panel overflow-hidden rounded-[2rem] border border-white/30 shadow-soft">
            <Image
              src={IMG.aerial}
              alt="Piscine Port Marchand a Toulon, bassin du TMWP83"
              width={700}
              height={480}
              className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HomeFindYourPlace({
  activities,
  activitiesStatus,
}: {
  activities: PublicActivity[];
  activitiesStatus: PublicActivitiesStatus;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const featuredActivities = activities.slice(0, 3);

  return (
    <section className="home-activities-section bg-white py-20 lg:py-28 dark:bg-[#13151a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Nous rejoindre
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Trouver son activité
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/60">
            Enfant, joueuse compétition ou adulte loisir, le club propose plusieurs
            activités sportives à Toulon pour découvrir le water polo, progresser et s'inscrire.
          </p>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {HOME_JOIN_ITEMS.map(({ Icon, title, description, href, cta }, index) => {
            const isDark =
              hoveredIndex === null ? index === 0 : hoveredIndex === index;
            const isLifted = hoveredIndex === index;

            return (
              <Reveal key={title} delay={index * 90}>
                <div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  data-cursor="interactive"
                  style={{ willChange: "transform, background-color, box-shadow" }}
                  className={[
                    "flex flex-col rounded-[2rem] p-8",
                    "transition-[transform,background-color,border-color,box-shadow,color]",
                    "duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isLifted ? "-translate-y-[9px]" : "translate-y-0",
                    isDark
                      ? "border border-transparent bg-ink shadow-[0_28px_70px_rgba(15,23,42,0.22),0_10px_36px_rgba(213,36,29,0.10)]"
                      : "border border-ink/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)] dark:bg-[#1c1f28] dark:border-white/8",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "mb-6 flex h-12 w-12 items-center justify-center rounded-2xl",
                      "transition-[background-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isDark
                        ? "bg-ember shadow-[0_14px_28px_rgba(213,36,29,0.35)]"
                        : "bg-ember/10 shadow-none",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-6 w-6 transition-colors duration-[400ms]",
                        isDark ? "text-white" : "text-ember",
                      ].join(" ")}
                    />
                  </div>

                  <h3
                    className={[
                      "text-2xl font-black uppercase tracking-tight",
                      "transition-colors duration-[400ms]",
                      isDark ? "text-white" : "text-ink dark:text-[#f0ede8]",
                    ].join(" ")}
                  >
                    {title}
                  </h3>

                  <p
                    className={[
                      "mt-4 flex-1 text-sm leading-7",
                      "transition-colors duration-[400ms]",
                      isDark ? "text-white/65" : "text-ink/60 dark:text-white/55",
                    ].join(" ")}
                  >
                    {description}
                  </p>

                  <Link
                    href={href}
                    data-cursor="interactive"
                    className="button-sheen wave-red mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-transparent bg-ember px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-95"
                  >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14">
          <Reveal className="mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
              Choisir son créneau
            </h3>
          </Reveal>

          {activitiesStatus === "error" ? (
            <div className="rounded-[1.5rem] border border-ink/8 bg-white p-7 text-sm leading-7 text-ink/60 shadow-soft">
              Les activités du club sont momentanément indisponibles depuis l'application.
              Vous pouvez toujours nous contacter pour recevoir les informations d'inscription.
            </div>
          ) : featuredActivities.length === 0 ? (
            <div className="rounded-[1.5rem] border border-ink/8 bg-white p-7 text-sm leading-7 text-ink/60 shadow-soft">
              Aucune activité n'est affichée pour le moment. Les inscriptions seront ajoutées
              dès publication des prochains créneaux.
            </div>
          ) : (
            <>
              <div className="home-activities-grid">
                {featuredActivities.map((activity, index) => {
                  const disabled = activityIsDisabled(activity);
                  const imageSrc = activity.heroImageUrl || [IMG.resort, IMG.under, IMG.team][index % 3];
                  const categoryLabel = (activity.category || activity.practiceType || "Activité")
                    .replace(/ecole/gi, "École")
                    .replace(/water[- ]?polo/gi, "Water-Polo");
                  const description =
                    activity.shortDescription ||
                    activity.longDescription ||
                    "Créneau encadré par le club pour progresser dans l'eau, découvrir les bases du water polo et rejoindre une dynamique collective à partir de 8 ans.";
                  const enrichedDescription = `${description} ${activity.ageRange || activity.audience ? `Public : ${activity.ageRange || activity.audience}.` : "Activité accessible à partir de 8 ans selon les groupes disponibles."}`;

                  return (
                    <article
                      key={activity.id}
                      className="home-activity-card group flex flex-col overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-ember/25 dark:bg-[#1c1f28] dark:border-white/8"
                    >
                      <Link href={publicActivityPath(activity)} className="relative block h-52 overflow-hidden rounded-t-[1.5rem] bg-ink/5">
                        <Image
                          src={imageSrc}
                          alt={activity.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                        <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-white/20 bg-ink/82 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] backdrop-blur-md">
                          {categoryLabel}
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col p-6">
                        <h4 className="text-xl font-black uppercase leading-tight text-ink">
                          {activity.name}
                        </h4>
                        <p className="mt-3 flex-1 text-sm leading-7 text-ink/60">
                          {enrichedDescription}
                        </p>
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-ember">
                          {activityScheduleLabel(activity)} · {activityPriceLabel(activity)}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href={publicActivityPath(activity)}
                            className="button-sheen wave-light inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:-translate-y-0.5"
                          >
                            En savoir plus
                          </Link>
                          <a
                            href={disabled ? undefined : activityAppUrl(activity)}
                            aria-disabled={disabled}
                            className={`button-sheen wave-red inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] ${
                              disabled
                                ? "pointer-events-none bg-ink/8 text-ink/40"
                                : "bg-ember text-white"
                            }`}
                          >
                            {disabled ? activityStatusLabel(activity) : "S'inscrire"}
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
                <article id="home-activities-all" className="home-activity-card home-activity-card--cta flex flex-col justify-between rounded-[1.5rem] border border-ember/20 bg-[#1C1C1C] p-7 text-white">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-ember">
                      Toutes les sections
                    </p>
                    <h4 className="mt-4 text-2xl font-black uppercase leading-tight">
                      Voir toutes les activités
                    </h4>
                    <p className="mt-4 text-sm leading-7 text-white/68">
                      Retrouvez toutes les sections, horaires et informations d'inscription.
                    </p>
                  </div>
                  <Link
                    href="/activites"
                    className="button-sheen wave-red mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5"
                  >
                    Voir toutes les activités
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </div>
              <p className="mt-6 text-center text-sm font-medium text-ink/45">
                D'autres sections sont disponibles sur la page activités.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

const DAY_ORDER: PublicActivitySlot["day"][] = [
  "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche",
];
const DAY_LABELS: Record<PublicActivitySlot["day"], string> = {
  lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi",
  jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi", dimanche: "Dimanche",
};

const PLANNING_COLORS = ["#d5241d", "#1667b7", "#059669", "#7c3aed", "#f59e0b", "#0891b2", "#be123c"];
const GRID_W = 1120;
const TIME_W = 72;
const ROW_H = 78;

type PlanningBlock = {
  activity: PublicActivity;
  slot: PublicActivitySlot;
  startMinutes: number;
  endMinutes: number;
  lane: number;
  laneCount: number;
  color: string;
};

function planningToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h)) return 0;
  return h * 60 + (Number.isFinite(m) ? m : 0);
}

function inferPlanningSlots(activity: PublicActivity): PublicActivitySlot[] {
  if (activity.timeSlots.length > 0) return activity.timeSlots;
  const schedule = activity.schedule || "";
  const match = schedule.match(/(\d{1,2})\s*h?\s*(\d{0,2})\s*[-–—]\s*(\d{1,2})\s*h?\s*(\d{0,2})/i);
  if (!match) return [];
  const startTime = `${match[1].padStart(2, "0")}:${(match[2] || "00").padStart(2, "0")}`;
  const endTime = `${match[3].padStart(2, "0")}:${(match[4] || "00").padStart(2, "0")}`;
  const norm = schedule.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const days = DAY_ORDER.filter((d) => norm.includes(d.normalize("NFD").replace(/[̀-ͯ]/g, "")) || norm.includes(d.slice(0, 3)));
  return days.map((day, i) => ({ id: `${activity.id}-fb-${i}`, day, startTime, endTime, location: activity.location, pool: "", label: "" }));
}

function buildPlanningBlocks(activities: PublicActivity[]) {
  const base = activities.flatMap((activity, ai) =>
    inferPlanningSlots(activity).map((slot) => ({
      activity, slot,
      startMinutes: planningToMinutes(slot.startTime),
      endMinutes: planningToMinutes(slot.endTime),
      lane: 0, laneCount: 1,
      color: activity.planningColor || PLANNING_COLORS[ai % PLANNING_COLORS.length],
    }))
  ).filter((b) => b.endMinutes > b.startMinutes);

  if (base.length === 0) return { blocks: [] as PlanningBlock[], startHour: 8, endHour: 20, hours: [] as number[], height: 520 };

  const startHour = Math.max(6, Math.floor((Math.min(...base.map((b) => b.startMinutes), 8 * 60) - 30) / 60));
  const endHour = Math.min(23, Math.ceil((Math.max(...base.map((b) => b.endMinutes), 22 * 60) + 30) / 60));
  const blocks: PlanningBlock[] = [];

  DAY_ORDER.forEach((day) => {
    const dayBase = base.filter((b) => b.slot.day === day).sort((a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes);
    const lanes: number[] = [];
    dayBase.forEach((b) => {
      let lane = lanes.findIndex((end) => end <= b.startMinutes);
      if (lane === -1) lane = lanes.length;
      lanes[lane] = b.endMinutes;
      blocks.push({ ...b, lane, laneCount: 1 });
    });
    blocks.filter((b) => b.slot.day === day).forEach((b) => {
      const overlaps = dayBase.filter((c) => c.startMinutes < b.endMinutes && c.endMinutes > b.startMinutes);
      b.laneCount = Math.max(1, ...overlaps.map((c) => {
        const p = blocks.find((x) => x.activity.id === c.activity.id && x.slot.id === c.slot.id && x.slot.startTime === c.slot.startTime);
        return p ? p.lane + 1 : 1;
      }));
    });
  });

  return {
    blocks, startHour, endHour,
    hours: Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i),
    height: Math.max(520, (endHour - startHour) * ROW_H),
  };
}

function hourToTop(hour: number, startHour: number) {
  return (hour - startHour) * ROW_H;
}

function blockStyle(block: PlanningBlock, startHour: number): CSSProperties {
  const di = DAY_ORDER.indexOf(block.slot.day);
  const colW = (GRID_W - TIME_W) / 7;
  const leftBase = TIME_W + di * colW;
  const top = ((block.startMinutes - startHour * 60) / 60) * ROW_H + 8;
  const height = Math.max(58, ((block.endMinutes - block.startMinutes) / 60) * ROW_H - 10);
  const gap = 4;
  const innerW = colW - 12;
  const laneW = (innerW - gap * (block.laneCount - 1)) / block.laneCount;
  return { top, left: leftBase + 6 + block.lane * (laneW + gap), width: laneW, height, background: block.color };
}

function groupPlanningByDay(blocks: PlanningBlock[]) {
  return DAY_ORDER.reduce<Record<PublicActivitySlot["day"], PlanningBlock[]>>((acc, day) => {
    acc[day] = blocks.filter((b) => b.slot.day === day).sort((a, b) => a.startMinutes - b.startMinutes);
    return acc;
  }, { lundi: [], mardi: [], mercredi: [], jeudi: [], vendredi: [], samedi: [], dimanche: [] });
}

function WeeklyCalendar({ activities }: { activities: PublicActivity[] }) {
  const categories = useMemo(
    () => Array.from(new Set(activities.map((a) => a.category || a.practiceType || "Autre"))).sort((a, b) => a.localeCompare(b, "fr")),
    [activities]
  );
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const filtered = selectedCategory === "Tous" ? activities : activities.filter((a) => (a.category || a.practiceType || "Autre") === selectedCategory);
  const planning = useMemo(() => buildPlanningBlocks(filtered), [filtered]);
  const byDay = useMemo(() => groupPlanningByDay(planning.blocks), [planning.blocks]);

  if (activities.length === 0) return null;

  return (
    <div className="mt-20 border-t border-ink/8 pt-16">
      <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Horaires</p>
      <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        Planning hebdomadaire
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-ink/55">
        Créneaux de la saison en cours. Cliquez sur un bloc pour voir la fiche détaillée.
      </p>

      {categories.length > 1 && (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {["Tous", ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                selectedCategory === cat
                  ? "bg-ember text-white"
                  : "border border-ink/12 bg-white text-ink/55 hover:border-ember/40 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Desktop grid */}
      <div className="mt-8 hidden overflow-x-auto rounded-[1.25rem] border border-ink/10 bg-white shadow-soft lg:block">
        <div className="relative min-w-[1120px]" style={{ height: planning.height + 58 }}>
          <div className="sticky top-0 z-20 grid h-[58px] border-b border-ink/10 bg-ink text-white" style={{ gridTemplateColumns: `${TIME_W}px repeat(7, 1fr)` }}>
            <div className="flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">Heure</div>
            {DAY_ORDER.map((day) => (
              <div key={day} className="flex items-center justify-center border-l border-white/10 text-xs font-black uppercase tracking-[0.2em]">
                {DAY_LABELS[day]}
              </div>
            ))}
          </div>
          <div className="absolute left-0 right-0 top-[58px]" style={{ height: planning.height }}>
            {planning.hours.map((h) => (
              <div key={h} className="absolute left-0 right-0 border-t border-ink/8" style={{ top: hourToTop(h, planning.startHour) }}>
                <span className="absolute left-3 -translate-y-1/2 rounded-full bg-white px-2 text-[11px] font-bold text-ink/45">
                  {`${String(h).padStart(2, "0")}:00`}
                </span>
              </div>
            ))}
            <div className="absolute inset-y-0 left-[72px] right-0 grid grid-cols-7">
              {DAY_ORDER.map((day) => <div key={day} className="border-l border-ink/8" />)}
            </div>
            {planning.blocks.map((block) => (
              <Link
                key={`${block.activity.id}-${block.slot.id}-${block.slot.day}-${block.slot.startTime}`}
                href={publicActivityPath(block.activity)}
                className="absolute z-10 overflow-hidden rounded-xl border border-white/40 p-3 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                style={blockStyle(block, planning.startHour)}
              >
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">{block.slot.startTime} – {block.slot.endTime}</span>
                <span className="mt-1 block truncate text-sm font-black uppercase">{block.activity.name}</span>
                <span className="mt-0.5 block truncate text-xs text-white/75">{block.slot.location || block.activity.location || "Port Marchand"}</span>
              </Link>
            ))}
            {planning.blocks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink/55">
                Aucun créneau publié pour cette catégorie.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile day cards */}
      <div className="mt-8 space-y-4 lg:hidden">
        {DAY_ORDER.map((day) => {
          const dayBlocks = byDay[day];
          if (dayBlocks.length === 0) return null;
          return (
            <div key={day} className="rounded-[1.25rem] border border-ink/10 bg-white p-4 shadow-soft">
              <h3 className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-ember">{DAY_LABELS[day]}</h3>
              <div className="space-y-3">
                {dayBlocks.map((block) => (
                  <Link
                    key={`${block.activity.id}-${block.slot.id}-${block.slot.startTime}`}
                    href={publicActivityPath(block.activity)}
                    className="block rounded-2xl border border-ink/8 p-4 transition hover:border-ember"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-black uppercase text-ink">{block.activity.name}</p>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
                        activityIsDisabled(block.activity)
                          ? "bg-ink/10 text-ink/55"
                          : "bg-green-600/10 text-green-700"
                      }`}>{activityStatusLabel(block.activity)}</span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-ink/65">
                      <Clock3 className="h-4 w-4 text-ember" />
                      {block.slot.startTime} – {block.slot.endTime}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-ink/55">
                      <MapPin className="h-4 w-4 text-ember" />
                      {block.slot.location || block.activity.location || "Piscine Port Marchand"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        {planning.blocks.length === 0 && (
          <div className="rounded-[1.25rem] border border-ink/10 bg-white px-5 py-10 text-center text-sm font-semibold text-ink/55 shadow-soft">
            Aucun créneau publié pour cette catégorie.
          </div>
        )}
      </div>
    </div>
  );
}

function PublicActivitiesSection({ activities }: { activities: PublicActivity[] }) {
  type Filter = "all" | "loisir" | "competition";
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = activities.filter((a) => {
    if (filter === "all") return true;
    const t = (a.practiceType || a.category || "").toLowerCase();
    if (filter === "loisir") return t.includes("loisir");
    if (filter === "competition") return t.includes("comp");
    return true;
  });

  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Inscriptions</p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Choisir une activité
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ink/60">
            Les activités ci-dessous viennent directement de l'application
            TMWP83. Le choix, le panier, l'inscription et le paiement restent
            gérés dans l'espace adhérent.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`${APP_URL}/inscription/panier`}
              className="button-sheen wave-red inline-flex items-center justify-center rounded-full bg-ember px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Ouvrir le panier
            </a>
            <a
              href={APP_URL}
              className="button-sheen wave-ghost inline-flex items-center justify-center rounded-full border border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Accès membre
            </a>
          </div>
        </div>

        {activities.length > 0 && (
          <div className="mt-10 flex gap-2">
            {(["all", "loisir", "competition"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                  filter === f
                    ? "bg-ember text-white"
                    : "border border-ink/12 bg-white text-ink/55 hover:border-ember/40 hover:text-ink dark:bg-white/5 dark:text-white/50"
                }`}
              >
                {f === "all" ? "Tout" : f === "loisir" ? "Loisir" : "Compétition"}
              </button>
            ))}
          </div>
        )}

        {activities.length === 0 ? (
          <div className="mt-12 rounded-[1.5rem] border border-ink/8 bg-white p-7 text-sm leading-7 text-ink/60 shadow-soft dark:border-white/8 dark:bg-white/5 dark:text-white/60">
            Aucune activité confirmée n'est disponible depuis l'application pour le moment.
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-[1.5rem] border border-ink/8 bg-white p-7 text-center text-sm text-ink/50 shadow-soft dark:border-white/8 dark:bg-white/5 dark:text-white/50">
            Aucune activité dans cette catégorie pour le moment.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((activity, index) => {
              const disabled = activityIsDisabled(activity);
              const isOpen = !disabled;
              const ActivityIcon =
                activity.practiceType === "competition"
                  ? Trophy
                  : (activity.audience || activity.category).toLowerCase().includes("jeune")
                    ? Users
                    : Waves;
              return (
                <article
                  key={activity.id}
                  className="interactive-panel news-glow group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white shadow-soft"
                >
                  <Link href={publicActivityPath(activity)} className="relative h-44 block overflow-hidden bg-ink/5">
                    <Image
                      src={activity.heroImageUrl || [IMG.resort, IMG.under, IMG.team][index % 3]}
                      alt={activity.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] shadow-sm ${
                      isOpen ? "bg-green-500 text-white" : "bg-white/90 text-ink"
                    }`}>
                      {activityStatusLabel(activity)}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember">
                        <ActivityIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold uppercase tracking-[0.22em] text-ember">
                          {activity.category || activity.practiceType}
                        </p>
                        <Link href={publicActivityPath(activity)} className="mt-0.5 block text-xl font-black uppercase leading-tight text-ink transition hover:text-ember">
                          {activity.name}
                        </Link>
                      </div>
                    </div>
                    <p className="flex-1 text-sm leading-7 text-ink/60">
                      {activity.shortDescription || activity.longDescription || "Informations à confirmer dans l'application."}
                    </p>
                    <dl className="mt-5 space-y-2 border-t border-ink/8 pt-5 text-sm text-ink/55">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-ember" />
                        <dt className="sr-only">Créneau</dt>
                        <dd>{activityScheduleLabel(activity)}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-ember" />
                        <dt className="sr-only">Lieu</dt>
                        <dd>{activity.location || "Piscine Port Marchand"}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-ember" />
                        <dt className="sr-only">Tarif</dt>
                        <dd>{activityPriceLabel(activity)}</dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={disabled ? undefined : activityAppUrl(activity)}
                        aria-disabled={disabled}
                        className={`inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] transition ${
                          disabled
                            ? "pointer-events-none bg-ink/8 text-ink/40"
                            : "bg-ember text-white hover:bg-ink"
                        }`}
                      >
                        {disabled ? activityStatusLabel(activity) : "S'inscrire"}
                      </a>
                      <Link
                        href={publicActivityPath(activity)}
                        className="inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:border-ember hover:text-ember"
                      >
                        Voir la fiche
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <WeeklyCalendar activities={activities} />
      </div>
    </section>
  );
}

function GallerySection() {
  const images = [
    { src: IMG.equipeelite, alt: "Joueuse du TMWP83 en action de tir" },
    { src: IMG.team,        alt: "Équipe en fête" },
    { src: IMG.gloves,      alt: "Coach du TMWP83 au bord du bassin" },
    { src: IMG.under,       alt: "Action défensive du TMWP83 dans le bassin" },
    { src: IMG.portrait,    alt: "Portrait action d'une joueuse du TMWP83" },
    { src: IMG.aerial,      alt: "Vue aérienne de la Piscine Port Marchand" },
    { src: IMG.male,        alt: "Tir puissant d'une joueuse du TMWP83" },
    { src: IMG.resort,      alt: "Bassin extérieur de la Piscine Port Marchand" },
  ];

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <section className="relative bg-ink py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.14),transparent_26%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Photos</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              L&apos;intensité en images
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(img)}
                data-cursor="interactive"
                className="media-glow interactive-panel overflow-hidden rounded-[1.25rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="h-52 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLightbox(images[4])}
              data-cursor="interactive"
              className="media-glow interactive-panel col-span-2 overflow-hidden rounded-[1.25rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              <Image
                src={images[4].src}
                alt={images[4].alt}
                width={800}
                height={380}
                className="h-52 w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
              />
            </button>
            {images.slice(5, 7).map((img, i) => (
              <button
                key={i + 5}
                type="button"
                onClick={() => setLightbox(img)}
                data-cursor="interactive"
                className="media-glow interactive-panel overflow-hidden rounded-[1.25rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="h-52 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="h-full max-h-[85vh] w-full object-contain"
            />
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              {lightbox.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Latest News ────────────────────────────────────────── */
function LatestNewsSection() {
  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Actualités
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Dernières nouvelles
            </h2>
          </div>
          <Link
            href="/actualites"
            data-cursor="interactive"
            className="premium-link hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ink/60 transition-colors hover:text-ink sm:flex"
          >
            Toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {NEWS_ARTICLES.slice(0, 3).map((a, index) => (
            <Reveal key={a.id} delay={index * 90}>
              <Link
                href={`/actualites/${a.slug}`}
                className="news-glow interactive-panel group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/6 bg-ink"
              >
                <div className="relative h-44 flex-shrink-0 overflow-hidden bg-white/5">
                  <Image
                    src={a.image}
                    alt={a.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-ember">
                    {a.category}
                  </p>
                  <h3 className="mt-3 flex-1 text-lg font-black uppercase leading-tight text-white">
                    {a.title}
                  </h3>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                    <time dateTime={a.date}>{a.date}</time>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/actualites"
            data-cursor="interactive"
            className="premium-link inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ink/60 hover:text-ink"
          >
            Toutes les actualités <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  INNER PAGE SHELL                                          */
/* ══════════════════════════════════════════════════════════ */

function HomeGallerySection() {
  const images = [
    { src: IMG.equipeelite, alt: "Match de water polo à Toulon" },
    { src: IMG.team, alt: "Équipe du TMWP83 autour du bassin" },
    { src: IMG.gloves, alt: "Staff TMWP83 au bord du bassin" },
    { src: IMG.under, alt: "Action défensive de water polo" },
    { src: IMG.portrait, alt: "Joueuse élite du TMWP83" },
    { src: IMG.aerial, alt: "Piscine Port Marchand à Toulon" },
    { src: IMG.male, alt: "Action offensive water polo Toulon" },
  ];

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <section className="relative bg-ink py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.14),transparent_26%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">Photos</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              Photos Water Polo Toulon - matchs et entraînements
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(img)}
                data-cursor="interactive"
                className="media-glow interactive-panel overflow-hidden rounded-[1.25rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="h-52 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLightbox(images[4])}
              data-cursor="interactive"
              className="media-glow interactive-panel col-span-2 overflow-hidden rounded-[1.25rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              <Image
                src={images[4].src}
                alt={images[4].alt}
                width={800}
                height={380}
                className="h-52 w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
              />
            </button>
            {images.slice(5, 7).map((img, i) => (
              <button
                key={i + 5}
                type="button"
                onClick={() => setLightbox(img)}
                data-cursor="interactive"
                className="media-glow interactive-panel overflow-hidden rounded-[1.25rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={300}
                  className="h-52 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-5xl w-full overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="h-full max-h-[85vh] w-full object-contain"
            />
            <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              {lightbox.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function HomeLatestNewsSection() {
  return (
    <section className="bg-shell py-20 lg:py-28 dark:bg-[#0e1014]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Actualités
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Dernières actualités du club
            </h2>
          </div>
          <Link
            href="/actualites"
            data-cursor="interactive"
            className="button-sheen wave-dark inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {NEWS_ARTICLES.slice(0, 3).map((a, index) => (
            <Reveal key={a.id} delay={index * 90}>
              <article className="news-glow interactive-panel group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/6 bg-ink">
                <Link
                  href={`/actualites/${a.slug}`}
                  className="relative block h-44 flex-shrink-0 overflow-hidden bg-white/5"
                >
                  <Image
                    src={a.image}
                    alt={a.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-ember">
                    {a.category}
                  </p>
                  <h3 className="mt-3 flex-1 text-lg font-black uppercase leading-tight text-white">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {a.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                      <time dateTime={a.date}>{formatHumanDate(a.date)}</time>
                    </p>
                    <Link
                      href={`/actualites/${a.slug}`}
                      className="button-sheen wave-red inline-flex items-center gap-2 rounded-full bg-ember px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Lire l'article
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeEliteConversionBlock() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28">
      <Image
        src={IMG.team}
        alt="Équipe élite du TMWP83 avant un match"
        fill
        sizes="100vw"
        className="object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-ink/82" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.36em] text-ember">
              Équipe élite féminine
            </p>
            <h2 className="mt-4 break-words text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Rejoignez l'élite du water polo à Toulon
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
              L'équipe élite féminine incarne le haut niveau du Toulon Métropole Water-Polo 83.
              Ses matchs gratuits à domicile rendent la compétition accessible aux familles,
              inspirent les jeunes joueuses et renforcent l'attractivité du club auprès du
              public comme des partenaires.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/equipes/feminine-elite"
                className="button-sheen wave-red inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                Voir l'équipe élite
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/matchs"
                className="button-sheen wave-ghost inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5"
              >
                Voir les matchs
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { value: "Top niveau", label: "Classement du groupe suivi en championnat national" },
              { value: "13", label: "Joueuses mobilisées autour du projet élite" },
              { value: "Gratuit", label: "Matchs à domicile ouverts au public" },
            ].map((item) => (
              <div key={item.value} className="rounded-[1rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
                <p className="text-3xl font-black uppercase text-white">{item.value}</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-white/72">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-20 lg:py-28 dark:bg-[#13151a]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">FAQ</p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
            Questions fréquentes
          </h2>
        </Reveal>
        <div className="space-y-3">
          {HOME_FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
              key={item.question}
              className="rounded-[1.25rem] border border-ink/10 bg-shell shadow-soft transition-colors duration-300 open:bg-white"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-bold uppercase tracking-[0.14em] text-ink"
              >
                {item.question}
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                  <ArrowRight className={`h-3 w-3 rotate-[-45deg] transition-transform duration-300 ${isOpen ? "rotate-0" : ""}`} />
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-7 text-ink/65">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="button-sheen wave-dark inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            Une question ? Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SitePage({
  page,
  ffnFixtures = [],
  ffnResults = [],
  ffnStandings = [],
  ffnRoster = [],
  activities = [],
}: {
  page: PageContent;
  ffnFixtures?: FfnMatch[];
  ffnResults?: FfnMatch[];
  ffnStandings?: FfnStandingRow[];
  ffnRoster?: FfnRosterPlayer[];
  activities?: PublicActivity[];
}) {
  const meta = PAGE_IMAGES[page.slug] || {
    src: IMG.male,
    ghost: page.title.toUpperCase(),
    alt: `Photo water-polo TMWP83 pour la page ${page.title}`
  };

  return (
    <div>
      <InnerHero page={page} src={meta.src} ghost={meta.ghost} alt={meta.alt || `Photo water-polo TMWP83 pour la page ${page.title}`} />
      {page.slug === "le-club"               && <ClubSection ffnStandings={ffnStandings} />}
      {page.slug === "activites"             && <PublicActivitiesSection activities={activities} />}
      {page.slug === "equipe-feminine-elite" && <EliteSection ffnFixtures={ffnFixtures} ffnResults={ffnResults} ffnRoster={ffnRoster} />}
      {page.slug === "equipes"               && <TeamsSection />}
      {page.slug === "competitions"          && <CompetitionsSection ffnFixtures={ffnFixtures} ffnResults={ffnResults} ffnStandings={ffnStandings} />}
      {page.slug === "partenaires"           && <PartnersSection />}
      {page.slug === "actualites"            && <NewsSection />}
      {page.slug === "contact"               && <ContactSection />}
    </div>
  );
}

/* ── Inner Page Hero ────────────────────────────────────── */
function InnerHero({
  page,
  src,
  ghost,
  alt,
}: {
  page: PageContent;
  src: string;
  ghost: string;
  alt: string;
}) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-ink">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover object-center opacity-60"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

      {/* Ghost text */}
      <div className="absolute inset-y-0 right-0 flex items-end overflow-hidden">
        <span className="select-none text-[22vw] font-black uppercase leading-none text-white/[0.04]">
          {ghost}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
          <div className="flex max-w-2xl items-start gap-5">
            <div className="mt-1 w-1 self-stretch bg-ember" />
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-ember">
                {page.slug.replace(/-/g, " ")}
              </p>
              <h1 className="break-words text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-7xl">
                {page.title}
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-white/60">
                {page.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  LE CLUB                                                   */
/* ══════════════════════════════════════════════════════════ */

function ClubSection({ ffnStandings }: { ffnStandings: FfnStandingRow[] }) {
  const toulonStanding = ffnStandings.find((row) => isToulon(null, row.team));

  return (
    <>
      {/* Red stats strip */}
      <div className="bg-ember">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/20 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { v: "2010",  l: "Création" },
            { v: "150+",  l: "Licenciés" },
            { v: "8",     l: "Groupes" },
            { v: toulonStanding ? `#${toulonStanding.rank}` : "FFN", l: "Classement" },
          ].map((s) => (
            <div key={s.l} className="py-6 text-center transition-colors duration-300 hover:bg-white/10">
              <p className="text-3xl font-black text-white lg:text-4xl">{s.v}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Un projet né de la passion */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
                Notre histoire
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-ink sm:text-5xl">
                Un projet né<br />de la passion
              </h2>
              <p className="mt-5 text-base leading-7 text-ink/65">
                Depuis 2010, le Toulon M&eacute;tropole Water-Polo 83 s&apos;est imposé
                comme un acteur incontournable de la pratique du water-polo dans
                le Var. Un projet construit autour de la formation, de
                l&apos;ambition sportive et du rayonnement territorial.
              </p>
              <p className="mt-4 text-base leading-7 text-ink/65">
                Ancré à la Piscine Port Marchand, le club structure l&apos;ensemble
                de sa filière — de l&apos;école aux championnats élite — avec une
                identité forte et un encadrement exigeant.
              </p>
            </div>
            <div data-cursor="interactive" className="media-glow interactive-panel overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src={IMG.resort}
                alt="Piscine Port Marchand a Toulon, bassin d'entrainement du TMWP83"
                width={700}
                height={480}
                className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Classement FFN
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Élite Féminine
            </h2>
          </div>
          {ffnStandings.length === 0 ? (
            <p className="text-center text-sm text-white/45">
              Classement non disponible depuis la source FFN pour le moment.
            </p>
          ) : (
            <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5">
                  <tr className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Équipe</th>
                    <th className="px-5 py-4 text-center">J</th>
                    <th className="hidden px-5 py-4 text-center sm:table-cell">V</th>
                    <th className="hidden px-5 py-4 text-center sm:table-cell">N</th>
                    <th className="hidden px-5 py-4 text-center sm:table-cell">D</th>
                    <th className="px-5 py-4 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {ffnStandings.map((row) => (
                    <tr
                      key={row.rank}
                      className={
                        isToulon(null, row.team)
                          ? "bg-ember/20 text-white"
                          : "border-t border-white/[0.06] text-white/75"
                      }
                    >
                      <td className="px-5 py-4 font-black text-white/40">{row.rank}</td>
                      <td className="px-5 py-4 font-black uppercase">{row.team}</td>
                      <td className="px-5 py-4 text-center">{row.played}</td>
                      <td className="hidden px-5 py-4 text-center sm:table-cell">{row.won}</td>
                      <td className="hidden px-5 py-4 text-center sm:table-cell">{row.drawn}</td>
                      <td className="hidden px-5 py-4 text-center sm:table-cell">{row.lost}</td>
                      <td className="px-5 py-4 text-center font-black">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-white/5 px-5 py-3 text-xs text-white/25">
                Source : FFN Extranat, même filtre que la page Compétitions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="bg-shell py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Identité
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Nos valeurs
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink/60">
              Quatre piliers qui guident chaque décision, chaque entraînement
              et chaque rencontre.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CLUB_VALUES.map((v, i) => {
              const ValueIcon = CLUB_VALUE_ICONS[i % CLUB_VALUE_ICONS.length];
              return (
                <div
                  key={v.title}
                  data-cursor="interactive"
                  className="news-glow interactive-panel rounded-[1.75rem] border border-ink/8 bg-white p-7 shadow-soft"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember">
                    <ValueIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Piscine Port Marchand */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <Image
          src={IMG.aerial}
          alt="Piscine Port Marchand a Toulon avec le bassin exterieur"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Terrain d&apos;entraînement
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Piscine Port Marchand
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-white/60">
            370 All. de l'Armée d'Afrique, 83000 Toulon — notre bassin d&apos;entraînement et de
            compétition au cœur de la cité phocéenne varoise.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="button-sheen wave-light inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-ink"
            >
              Nous rejoindre
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  ÉQUIPE FÉMININE ÉLITE                                     */
/* ══════════════════════════════════════════════════════════ */

function EliteSection({
  ffnFixtures,
  ffnResults,
  ffnRoster,
}: {
  ffnFixtures: FfnMatch[];
  ffnResults: FfnMatch[];
  ffnRoster: FfnRosterPlayer[];
}) {
  return (
    <>
      {/* Intro */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
                Projet sportif
              </p>
              <h2 className="mt-4 font-black uppercase leading-[1.05] tracking-tight text-ink">
                <span className="block text-3xl sm:text-4xl">Porter</span>
                <span className="block text-4xl sm:text-5xl">Le Water-Polo Féminin</span>
                <span className="block text-4xl text-ember sm:text-5xl">Au Sommet</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-ink/65">
                Le groupe élite s&apos;appuie sur un noyau expérimenté, une
                dynamique de formation et un calendrier national exigeant pour
                viser les plus hautes marches.
              </p>
              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink/10 pt-8">
                {[
                  { v: "13",   l: "Joueuses" },
                  { v: "4",  l: "Victoires" },
                  { v: "44",   l: "Points" },
                  { v: "81",   l: "Buts inscrits" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-3xl font-black text-ember">{s.v}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div data-cursor="interactive" className="media-glow interactive-panel overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src={IMG.portrait}
                alt="Portrait action d'une joueuse elite du TMWP83 dans le bassin"
                width={320}
                height={420}
                className="h-[420px] w-full object-cover object-top transition-transform duration-700 hover:scale-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nos joueuses */}
      <section className="bg-ink py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Effectif
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Nos joueuses
            </h2>
          </div>
          {ffnRoster.length === 0 ? (
            <p className="text-center text-sm text-white/40">Effectif non disponible sur les pages FFN confirmées.</p>
          ) : (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {ffnRoster.map((p) => (
              <div
                key={`${p.number}-${p.name}`}
                data-cursor="interactive"
                className="news-glow interactive-panel rounded-[1.5rem] border border-white/8 bg-white/5 p-5 transition-colors duration-300 hover:border-ember/40 hover:bg-white/10"
              >
                <p className="text-3xl font-black text-ember">{p.number || "-"}</p>
                <p className="mt-4 text-sm font-black uppercase tracking-tight text-white">
                  {p.name}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  {p.birthYear || "-"}{p.nationality ? ` · ${p.nationality}` : ""}
                </p>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Prochains rendez-vous */}
      <section className="bg-shell py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Calendrier
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Prochains rendez-vous
            </h2>
          </div>
          {ffnFixtures.length === 0 ? (
            <p className="text-sm text-ink/45">Aucun match à venir pour le moment.</p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {ffnFixtures.map((m, index) => (
                <HomeMatchCard
                  key={m.matchId ?? `${m.date}-${m.home}-${m.away}-${index}`}
                  competition={m.competition}
                  home={m.home}
                  away={m.away}
                  homeLogo={m.homeLogo}
                  awayLogo={m.awayLogo}
                  homeStructureId={m.homeStructureId}
                  awayStructureId={m.awayStructureId}
                  date={formatFfnDate(m.date)}
                  time={m.time ?? "\u2014"}
                  location={m.isHome ? "Port Marchand, Toulon" : "Déplacement"}
                  isHome={m.isHome}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dernières performances */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Résultats
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Dernières performances
            </h2>
          </div>
          {ffnResults.length === 0 ? (
            <p className="text-sm text-ink/45">Aucun résultat disponible pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {ffnResults.map((m, index) => {
                const tmwpHome = isToulon(m.homeStructureId, m.home);
                const tmwpAway = isToulon(m.awayStructureId, m.away);
                const won =
                  m.hasScore &&
                  ((tmwpHome && (m.homeScore ?? 0) > (m.awayScore ?? 0)) ||
                    (tmwpAway && (m.awayScore ?? 0) > (m.homeScore ?? 0)));
                const draw = m.hasScore && m.homeScore === m.awayScore;
                return (
                  <div key={m.matchId ?? `${m.date}-${m.home}-${m.away}-${index}`} data-cursor="interactive" className="interactive-panel flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-ink/8 bg-white px-5 py-4 shadow-soft">
                    {m.hasScore ? (
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.15em] ${draw ? "bg-ink/10 text-ink/60" : won ? "bg-green-500/10 text-green-700" : "bg-ember/10 text-ember"}`}>
                        {draw ? "N" : won ? "V" : "D"}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.15em] text-ink/30">—</span>
                    )}
                    <span className="min-w-0 shrink truncate text-xs font-bold uppercase tracking-[0.18em] text-ink/40">{m.competition}</span>
                    <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
                      <FfnTeamLogo src={m.homeLogo} name={m.home} />
                      <span className={`min-w-0 shrink truncate text-sm font-black uppercase ${tmwpHome ? "text-ember" : "text-ink"}`}>{m.home}</span>
                      <span className="shrink-0 rounded-lg bg-ink px-3 py-1 text-sm font-black text-white">
                        {m.hasScore ? `${m.homeScore} – ${m.awayScore}` : "— – —"}
                      </span>
                      <span className={`min-w-0 shrink truncate text-sm font-black uppercase ${tmwpAway ? "text-ember" : "text-ink"}`}>{m.away}</span>
                      <FfnTeamLogo src={m.awayLogo} name={m.away} />
                    </div>
                    <span className="w-full text-right text-xs text-ink/35 sm:w-auto">{formatFfnDate(m.date)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Soutenez l'élite */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <Image src={IMG.team} alt="Collectif TMWP83 rassemble avant une rencontre elite" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Soutien
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Soutenez l&apos;élite
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-white/60">
            Venez supporter vos joueuses à la Piscine Port Marchand et faites
            vibrer les tribunes.
          </p>
          <div className="mt-8">
            <Link
              href="/competitions"
              className="button-sheen wave-light inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-ink"
            >
              Voir le calendrier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  LES ÉQUIPES                                               */
/* ══════════════════════════════════════════════════════════ */

function TeamsSection() {
  const teams = [
    {
      title: "Équipe Féminine Élite",
      description:
        "Référence du projet sportif et vitrine de la filière performance. Championnat élite national.",
      cta: "Voir l'équipe Élite",
      href: "/equipes/feminine-elite",
      featured: true,
    },
    {
      title: "Équipes Jeunes",
      description:
        "Groupes structurés par catégories d'âge. Apprentissage progressif et culture du jeu.",
      cta: "En savoir plus",
      href: "/le-club",
      featured: false,
    },
    {
      title: "Section Loisir",
      description:
        "Pratique adulte conviviale, régulière et encadrée. Bienvenue à tous les niveaux.",
      cta: "Contactez-nous",
      href: "/contact",
      featured: false,
    },
  ];

  return (
    <>
      {/* Trouver sa filière */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Organisation du club
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Trouver sa filière
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink/60">
              Le TMWP83 structure son projet sportif autour de trois filières
              complémentaires, de la formation à la performance.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {teams.map((t) => (
              <div
                key={t.title}
                data-cursor="interactive"
                className={`interactive-panel news-glow flex flex-col rounded-[2rem] p-8 ${
                  t.featured
                    ? "bg-ink text-white"
                    : "border border-ink/10 bg-shell shadow-soft"
                }`}
              >
                {t.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-ember px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                    Élite
                  </span>
                )}
                <h3
                  className={`text-2xl font-black uppercase tracking-tight ${
                    t.featured ? "text-white" : "text-ink"
                  }`}
                >
                  {t.title}
                </h3>
                <p
                  className={`mt-4 flex-1 text-sm leading-7 ${
                    t.featured ? "text-white/65" : "text-ink/65"
                  }`}
                >
                  {t.description}
                </p>
                <Link
                  href={t.href}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ember transition-opacity hover:opacity-70"
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two info sections */}
      <section className="bg-shell py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div data-cursor="interactive" className="news-glow interactive-panel rounded-[2rem] border border-ink/8 bg-white p-8 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
                Formation
              </p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-ink">
                Former sans perdre l&apos;exigence
              </h3>
              <p className="mt-4 text-sm leading-7 text-ink/65">
                Les groupes jeunes du TMWP83 bénéficient d&apos;un encadrement
                diplômé, de sessions structurées par niveau et d&apos;une
                progression vers la compétition régionale et nationale.
              </p>
            </div>
            <div data-cursor="interactive" className="news-glow interactive-panel rounded-[2rem] border border-ink/8 bg-white p-8 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
                Loisir
              </p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-ink">
                Relier compétition et vie de club
              </h3>
              <p className="mt-4 text-sm leading-7 text-ink/65">
                La section loisir offre une pratique régulière et conviviale
                pour adultes, en parallèle des activités compétitives du club.
                Esprit d&apos;équipe et bonne humeur garantis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA choisir sa section */}
      <section className="bg-white py-20 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Inscription
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
            Choisir sa section
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-ink/60">
            Contactez-nous pour connaître les modalités d&apos;inscription et les
            créneaux disponibles selon votre profil.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="button-sheen wave-to-ink inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-ink"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  COMPÉTITIONS                                              */
/* ══════════════════════════════════════════════════════════ */

function CompetitionsSection({
  ffnFixtures,
  ffnResults,
  ffnStandings,
}: {
  ffnFixtures: FfnMatch[];
  ffnResults: FfnMatch[];
  ffnStandings: FfnStandingRow[];
}) {
  return (
    <>
      {/* Prochains matchs */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Calendrier
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Prochains matchs
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink/60">
              Venez soutenir nos joueuses à la Piscine Port Marchand.
              L&apos;entrée est <strong className="font-bold text-ink">libre et gratuite</strong> pour tous les matchs à domicile.
            </p>
          </div>
          {ffnFixtures.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-ink/8 bg-shell p-10 text-center shadow-soft">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember/10">
                <Trophy className="h-7 w-7 text-ember" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-ink">Aucun match à venir</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-ink/55">
                La saison régulière est terminée. Retrouvez les résultats et le classement ci-dessous.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {ffnFixtures.map((m, index) => (
                <HomeMatchCard
                  key={m.matchId ?? `${m.date}-${m.home}-${m.away}-${index}`}
                  competition={m.competition}
                  home={m.home}
                  away={m.away}
                  homeLogo={m.homeLogo}
                  awayLogo={m.awayLogo}
                  homeStructureId={m.homeStructureId}
                  awayStructureId={m.awayStructureId}
                  date={formatFfnDate(m.date)}
                  time={m.time ?? "\u2014"}
                  location={m.isHome ? "Port Marchand, Toulon" : "Déplacement"}
                  isHome={m.isHome}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Derniers scores */}
      <section className="bg-shell py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Résultats
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Derniers scores
            </h2>
          </div>
          {ffnResults.length === 0 ? (
            <div className="rounded-[1.5rem] border border-ink/8 bg-white p-7 text-sm leading-7 text-ink/50 shadow-soft">
              Les résultats apparaîtront ici à l&apos;issue des matchs. Données directement issues de l&apos;Extranat FFN.
            </div>
          ) : (
            <div className="space-y-3">
              {ffnResults.map((m, index) => {
                const tmwpHome = isToulon(m.homeStructureId, m.home);
                const tmwpAway = isToulon(m.awayStructureId, m.away);
                const won =
                  m.hasScore &&
                  ((tmwpHome && (m.homeScore ?? 0) > (m.awayScore ?? 0)) ||
                    (tmwpAway && (m.awayScore ?? 0) > (m.homeScore ?? 0)));
                const draw = m.hasScore && m.homeScore === m.awayScore;
                return (
                  <div key={m.matchId ?? `${m.date}-${m.home}-${m.away}-${index}`} data-cursor="interactive" className="interactive-panel flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-ink/8 bg-white px-5 py-4 shadow-soft">
                    {m.hasScore ? (
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.15em] ${draw ? "bg-ink/10 text-ink/60" : won ? "bg-green-500/10 text-green-700" : "bg-ember/10 text-ember"}`}>
                        {draw ? "N" : won ? "V" : "D"}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.15em] text-ink/30">—</span>
                    )}
                    <span className="min-w-0 shrink truncate text-xs font-bold uppercase tracking-[0.18em] text-ink/40">{m.competition}</span>
                    <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
                      <FfnTeamLogo src={m.homeLogo} name={m.home} />
                      <span className={`min-w-0 shrink truncate text-sm font-black uppercase ${tmwpHome ? "text-ember" : "text-ink"}`}>{m.home}</span>
                      <span className="shrink-0 rounded-lg bg-ink px-3 py-1 text-sm font-black text-white">
                        {m.hasScore ? `${m.homeScore} – ${m.awayScore}` : "— – —"}
                      </span>
                      <span className={`min-w-0 shrink truncate text-sm font-black uppercase ${tmwpAway ? "text-ember" : "text-ink"}`}>{m.away}</span>
                      <FfnTeamLogo src={m.awayLogo} name={m.away} />
                    </div>
                    <span className="w-full text-right text-xs text-ink/35 sm:w-auto">{formatFfnDate(m.date)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Classement Élite Féminine */}
      {ffnStandings.length > 0 && (
        <section className="bg-ink py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
                Classement
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Élite Féminine
              </h2>
            </div>
            <div data-cursor="interactive" className="news-glow interactive-panel mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5">
                  <tr className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Équipe</th>
                    <th className="px-5 py-4 text-center">J</th>
                    <th className="hidden px-5 py-4 text-center sm:table-cell">V</th>
                    <th className="hidden px-5 py-4 text-center sm:table-cell">N</th>
                    <th className="hidden px-5 py-4 text-center sm:table-cell">D</th>
                    <th className="px-5 py-4 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {ffnStandings.map((t) => (
                    <tr
                      key={t.rank}
                      className={
                        isToulon(null, t.team)
                          ? "bg-ember/20 text-white transition-colors duration-300 hover:bg-ember/30"
                          : "border-t border-white/[0.06] text-white/75 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
                      }
                    >
                      <td className="px-5 py-4 font-black text-white/40">{t.rank}</td>
                      <td className={`px-5 py-4 font-black uppercase ${isToulon(null, t.team) ? "text-white" : ""}`}>{t.team}</td>
                      <td className="px-5 py-4 text-center">{t.played}</td>
                      <td className="hidden px-5 py-4 text-center sm:table-cell">{t.won}</td>
                      <td className="hidden px-5 py-4 text-center sm:table-cell">{t.drawn}</td>
                      <td className="hidden px-5 py-4 text-center sm:table-cell">{t.lost}</td>
                      <td className="px-5 py-4 text-center font-black">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-white/5 px-5 py-3 text-xs text-white/25">
                Source : FFN Extranat — mis à jour toutes les heures.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PARTENAIRES                                               */
/* ══════════════════════════════════════════════════════════ */

function PartnersSection() {
  return (
    <>
      {/* Pourquoi nous soutenir */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Pourquoi nous soutenir
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Des partenariats utiles et visibles
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink/60">
              Le TMWP83 est bien plus qu&apos;un club de sport : c&apos;est un projet structurant pour Toulon et le Var, porté par une équipe féminine en championnat national et un tissu associatif vivant.
              Soutenir le TMWP83, c&apos;est associer votre marque à l&apos;excellence sportive locale et à une communauté engagée.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  data-cursor="interactive"
                  className="news-glow interactive-panel rounded-[1.75rem] border border-ink/8 bg-shell p-7 shadow-soft"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10">
                    <Icon className="h-5 w-5 text-ember" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partenaires actuels */}
      <section className="bg-shell py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Nos soutiens
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Partenaires actuels
            </h2>
          </div>
          <div className="space-y-12">
            {PARTNER_GROUPS.map((group) => (
              <div key={group.name}>
                <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] text-ember">
                  {group.name}
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {group.sponsors.map((s) => (
                    <div
                      key={s.name}
                      data-cursor="interactive"
                      className="interactive-panel flex items-center justify-center rounded-2xl border border-ink/8 bg-white p-6 shadow-soft"
                    >
                      {"src" in s && s.src ? (
                        <img
                          src={s.src}
                          alt={s.name}
                          className="max-h-14 w-full object-contain"
                        />
                      ) : (
                        <span className="text-sm font-bold uppercase tracking-[0.14em] text-ink">
                          {s.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Devenir partenaire */}
      <section className="relative overflow-hidden bg-ink py-24 text-center text-white">
        <Image src={IMG.aerial} alt="Piscine Port Marchand a Toulon, bassin du TMWP83" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Rejoindre l&apos;aventure
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Devenir partenaire
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65">
            Votre entreprise est à Toulon ou dans le Var ? Associez votre marque à un projet sportif ambitieux, porté par une équipe féminine de niveau national et un club ancré dans la région Sud. Nous proposons différentes formules adaptées à votre budget et à vos objectifs de visibilité.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="button-sheen wave-light inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-ink"
            >
              Prendre contact
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${CLUB_INFO.email}?subject=Partenariat TMWP83`}
              className="button-sheen inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 font-bold uppercase tracking-[0.18em] text-white transition-all hover:border-white hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Envoyer un email
            </a>
          </div>
          <p className="mt-6 text-xs text-white/30">
            Réponse garantie sous 48h ouvrées — {CLUB_INFO.email}
          </p>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  ACTUALITÉS                                                */
/* ══════════════════════════════════════════════════════════ */

function formatHumanDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function NewsSection() {
  const [featured, ...rest] = NEWS_ARTICLES;

  return (
    <section className="bg-shell py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Featured */}
        <Link
          href={`/actualites/${featured.slug}`}
          data-cursor="interactive"
          className="news-glow interactive-panel group mb-8 grid overflow-hidden rounded-[2rem] bg-ink lg:grid-cols-[1fr_1fr]"
        >
          <div className="relative h-64 overflow-hidden bg-white/5 lg:h-auto">
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-ember">
              {featured.category}
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-white lg:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              {featured.excerpt}
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
              <time dateTime={featured.date}>{formatHumanDate(featured.date)}</time>
            </p>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link
              key={a.id}
              href={`/actualites/${a.slug}`}
              data-cursor="interactive"
              className="news-glow interactive-panel group flex flex-col overflow-hidden rounded-[1.75rem] bg-ink"
            >
              <div className="relative h-40 overflow-hidden bg-white/5">
                <Image
                  src={a.image}
                  alt={a.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-ember">
                  {a.category}
                </p>
                <h3 className="mt-2 text-base font-black uppercase leading-tight text-white">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="mt-3 flex-1 text-sm leading-6 text-white/55 line-clamp-3">
                    {a.excerpt}
                  </p>
                )}
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  <time dateTime={a.date}>{formatHumanDate(a.date)}</time>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-sm leading-7 text-ink/50">
          Suivez toute l&apos;actualité du water-polo à Toulon et dans le Var.
          Le TMWP83 publie régulièrement des résumés de matchs, des focus sur
          la saison en cours, des annonces d&apos;événements et des nouvelles de ses
          partenaires. Restez connectés au club.
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  CONTACT                                                   */
/* ══════════════════════════════════════════════════════════ */

const CONTACT_FAQ = [
  {
    q: "Comment s'inscrire au club ?",
    a: "Les inscriptions se font via l'application TMWP83 (espace adhérent). Rendez-vous sur le lien « Accès membre » en haut de page, créez votre compte, choisissez votre activité et réglez en ligne. Pour les mineurs, une autorisation parentale et un certificat médical sont requis.",
  },
  {
    q: "Quels sont les tarifs ?",
    a: "Les tarifs varient selon la section (école de water-polo, compétition, loisir) et l'âge. Le détail est disponible directement dans l'application lors de la sélection de l'activité. Des facilités de paiement en plusieurs fois sont proposées.",
  },
  {
    q: "À quel âge peut-on commencer le water-polo ?",
    a: "L'école de water-polo accueille les enfants dès 8 ans. Aucun niveau de natation expert n'est requis — nos éducateurs adaptent les exercices à chaque enfant. Des créneaux d'initiation sont proposés en début de saison.",
  },
  {
    q: "Les matchs à domicile sont-ils ouverts au public ?",
    a: "Oui, l'entrée est libre et gratuite pour tous les matchs à domicile à la Piscine Port Marchand. Venez nombreux soutenir l'équipe féminine élite ! Les dates sont disponibles sur la page Compétitions.",
  },
  {
    q: "Comment devenir partenaire ?",
    a: "Contactez-nous via le formulaire ci-contre ou directement par email à contact@toulonwaterpolo.fr. Nous vous présenterons nos différentes formules de partenariat (visibilité, événementiel, naming) adaptées à votre budget.",
  },
];

function ContactSection() {
  return (
    <>
      <section className="bg-shell py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            {/* Form */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.38em] text-ember">
                Message
              </p>
              <h2 className="mb-8 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
                Envoyez-nous un message
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="space-y-6 pt-0 lg:pt-20">
              {/* Google Maps */}
              <div className="overflow-hidden rounded-[1.5rem] border border-ink/10 shadow-soft">
                <iframe
                  title="Piscine Port Marchand, Toulon"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.2!2d5.9281!3d43.1188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9091d4e3ffba9%3A0x37c5c2f1c98e1234!2sPiscine%20du%20Port%20Marchand!5e0!3m2!1sfr!2sfr"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Adresse */}
              <div data-cursor="interactive" className="interactive-panel rounded-[1.5rem] border border-ink/8 bg-white/75 p-6 shadow-soft">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-ink/40">
                  Adresse
                </p>
                <div className="flex items-start gap-3 text-sm text-ink/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                  <span>
                    {CLUB_INFO.pool}
                    <br />
                    {CLUB_INFO.address}
                  </span>
                </div>
              </div>

              {/* Contact direct */}
              <div data-cursor="interactive" className="interactive-panel rounded-[1.5rem] border border-ink/8 bg-white/75 p-6 shadow-soft">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-ink/40">
                  Contact direct
                </p>
                <div className="space-y-3">
                  <a href={`mailto:${CLUB_INFO.email}`} className="flex items-center gap-3 text-sm text-ink/70 transition-colors hover:text-ember">
                    <Mail className="h-4 w-4 shrink-0 text-ember" />
                    <span>{CLUB_INFO.email}</span>
                  </a>
                  <a href={`tel:${CLUB_INFO.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-ink/70 transition-colors hover:text-ember">
                    <Phone className="h-4 w-4 shrink-0 text-ember" />
                    <span>{CLUB_INFO.phone}</span>
                  </a>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-ink/40">
                  Réseaux sociaux
                </p>
                <div className="flex gap-3">
                  <a href={CLUB_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition-colors hover:bg-ember hover:text-white">
                    <IconInstagram className="h-4 w-4" />
                  </a>
                  <a href={CLUB_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition-colors hover:bg-ember hover:text-white">
                    <IconFacebook className="h-4 w-4" />
                  </a>
                  <a href={CLUB_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition-colors hover:bg-ember hover:text-white">
                    <IconLinkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">FAQ</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-3">
            {CONTACT_FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-[1.25rem] border border-ink/10 bg-shell px-6 py-5 shadow-soft open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold uppercase tracking-[0.14em] text-ink">
                  {item.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember transition-transform group-open:rotate-45">
                    <ArrowRight className="h-3 w-3 rotate-[-45deg] group-open:rotate-0 transition-transform" />
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-ink/65">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SHARED COMPONENTS                                         */
/* ══════════════════════════════════════════════════════════ */

function HomeMatchCard({
  competition,
  home,
  away,
  homeLogo,
  awayLogo,
  homeStructureId,
  awayStructureId,
  date,
  time,
  location,
  isHome: _isHome,
}: {
  competition: string;
  home: string;
  away: string;
  homeLogo?: string | null;
  awayLogo?: string | null;
  homeStructureId?: string | null;
  awayStructureId?: string | null;
  date: string;
  time: string;
  location: string;
  isHome: boolean;
}) {
  const tmwpHome = isToulon(homeStructureId, home);
  const tmwpAway = isToulon(awayStructureId, away);

  return (
    <article
      data-cursor="interactive"
      className="surface-panel interactive-panel flex flex-col rounded-[1.75rem] border border-white/60 p-6 shadow-soft"
    >
      {/* Competition badge */}
      <span className="mb-4 inline-flex w-fit rounded-full bg-ember/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-ember">
        {competition}
      </span>
      {/* Teams */}
      <div className="flex-1 space-y-2">
        <div className="flex min-w-0 items-center gap-3">
          <FfnTeamLogo src={homeLogo ?? null} name={home} />
          <p className={`min-w-0 break-words text-xl font-black uppercase tracking-tight ${tmwpHome ? "text-ember" : "text-ink"}`}>
            {home}
          </p>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-ink/35">
          vs
        </p>
        <div className="flex min-w-0 items-center gap-3">
          <FfnTeamLogo src={awayLogo ?? null} name={away} />
          <p className={`min-w-0 break-words text-xl font-black uppercase tracking-tight ${tmwpAway ? "text-ember" : "text-ink"}`}>
            {away}
          </p>
        </div>
      </div>
      {/* Info */}
      <div className="mt-5 space-y-2 border-t border-ink/8 pt-5 text-xs text-ink/55">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-ember" />
          <span className="font-semibold">{date}</span>
          <span>·</span>
          <Clock3 className="h-3.5 w-3.5 text-ember" />
          <span className="font-semibold">{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-ember" />
          <span>{location}</span>
        </div>
      </div>
    </article>
  );
}
