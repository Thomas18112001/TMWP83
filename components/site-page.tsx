"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Trophy,
  Users,
  Waves
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
import {
  CLUB_INFO,
  CLUB_VALUES,
  ELITE_PLAYERS,
  HOME_PARTNER_LOGOS,
  NEWS_ARTICLES,
  PARTNER_FEATURES,
  PARTNER_GROUPS,
  type PageContent,
  RANKINGS,
  RECENT_RESULTS,
  UPCOMING_MATCHES
} from "@/lib/site-data";

/* ─── Image paths ─────────────────────────────────────────── */
const IMG = {
  equipeelite: "/images/collectif-tmwp83-avant-match.jpg",
  team: "/images/banc-joueuses-tmwp83-match.jpg",
  under: "/images/plongeon-defense-tmwp83.jpg",
  portrait: "/images/portrait-action-joueuse-tmwp83.jpg",
  resort: "/images/entrainement-tmwp83-piscine-port-marchand.jpg",
  gloves: "/images/coach-tmwp83-bord-bassin.jpg",
  aerial: "/images/piscine-port-marchand-toulon-bassin-exterieur.jpg",
  male: "/images/tir-puissant-tmwp83-water-polo.jpg",
};

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

export function HomePage() {
  return (
    <div className="home-shell overflow-hidden">
<HomeHeroPremium />
      <PartnersStrip />
      <EliteSpotlight />
      <UpcomingMatchesSection />
      <ClubAmbition />
      <FindYourPlace />
      <GallerySection />
      <LatestNewsSection />
    </div>
  );
}


/* ── Partners Strip ─────────────────────────────────────── */
function HomeHeroPremium() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-ink">
      <Image
        src={IMG.equipeelite}
        alt="Joueuse du TMWP83 en action de tir pendant un match de water-polo"
        fill
        className="scale-[1.04] object-cover object-center transition-transform duration-[1200ms]"
        priority
      />
      {/* Strong left overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/5" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,28,28,0.92) 0%, rgba(28,28,28,0.60) 40%, rgba(28,28,28,0.20) 60%, transparent 78%)" }} />
      {/* Subtle ember glow */}
      <div className="absolute left-[4%] top-[22%] h-72 w-72 rounded-full bg-ember/10 blur-[80px]" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
          <Reveal>
            <div className="max-w-[600px]">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/14 bg-black/30 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-ember shadow-[0_0_12px_rgba(213,36,29,0.9)]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.36em] text-white/85">
                  Toulon M&eacute;tropole Water-Polo 83
                </p>
              </div>
              <h1 className="text-6xl font-black uppercase leading-[0.90] tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-[6.5rem]">
                L&apos;INTENSIT&Eacute;
                <span className="mt-1 block text-white/75">DU JEU</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-lg">
                Club formateur, ambition &eacute;lite et culture du collectif. Une
                identit&eacute; toulonnaise au service d&apos;un water-polo f&eacute;minin
                exigeant, spectaculaire et moderne.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  data-cursor="interactive"
                  className="button-sheen wave-red inline-flex items-center justify-center rounded-full border border-ember/20 bg-gradient-to-r from-ember via-[#e33b2d] to-wp-red-dark px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(213,36,29,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(213,36,29,0.42)]"
                >
                  Nous rejoindre
                </Link>
                <Link
                  href="/equipe-feminine-elite"
                  data-cursor="interactive"
                  className="button-sheen wave-ghost inline-flex items-center justify-center rounded-full border border-white/22 bg-white/8 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/45 hover:bg-white/15"
                >
                  &Eacute;quipe &Eacute;lite
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
    <div className="relative overflow-hidden border-y border-ink/10 bg-[rgba(255,255,255,0.85)] backdrop-blur-md dark:bg-white dark:border-ink/10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(213,36,29,0.03),transparent_18%,transparent_82%,rgba(28,28,28,0.03))]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-16 lg:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-16 lg:w-24" />
      <div
        ref={containerRef}
        className={`overflow-x-scroll ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
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
    </div>
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
            <h2 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Porter le water-polo<br />féminin au sommet
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
                href="/equipe-feminine-elite"
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
function UpcomingMatchesSection() {
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
        <div className="grid gap-5 lg:grid-cols-3">
          {UPCOMING_MATCHES.map((m, index) => (
            <Reveal key={m.id} delay={index * 90}>
              <HomeMatchCard {...m} />
            </Reveal>
          ))}
        </div>
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
              Depuis 2010, le TMWP83 développe la pratique du water-polo à
              Toulon autour d&apos;une filière complète, d&apos;une culture de
              l&apos;engagement et d&apos;un ancrage territorial fort.
            </p>
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
      "Formation dès 8 ans, encadrement diplômé, progression par niveau. Découverte, apprentissage et compétition.",
    href: "/le-club",
  },
  {
    Icon: Trophy,
    title: "Compétition",
    description:
      "Équipes engagées en championnat régional et national, des catégories jeunes jusqu'à l'Élite féminine.",
    href: "/competitions",
  },
  {
    Icon: Waves,
    title: "Section Loisir",
    description:
      "Pratique libre et conviviale pour adultes. Plaisir du jeu, condition physique et esprit d'équipe.",
    href: "/contact",
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
          {FIND_YOUR_PLACE_ITEMS.map(({ Icon, title, description, href }, index) => {
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
                    En savoir plus
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
function GallerySection() {
  const images = [
    { src: IMG.equipeelite, alt: "Joueuse du TMWP83 en action de tir", tall: false },
    { src: IMG.team,     alt: "Équipe en fête",          tall: false },
    { src: IMG.gloves, alt: "Coach du TMWP83 au bord du bassin", tall: true },
    { src: IMG.under, alt: "Action defensive du TMWP83 dans le bassin", tall: false },
    { src: IMG.portrait, alt: "Portrait action d'une joueuse du TMWP83", tall: false },
    { src: IMG.aerial,   alt: "Vue aérienne",            tall: false },
    { src: IMG.male, alt: "Tir puissant d'une joueuse du TMWP83", tall: false },
    { src: IMG.resort, alt: "Bassin exterieur de la Piscine Port Marchand", tall: false },
  ];

  return (
    <section className="relative bg-ink py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.14),transparent_26%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Photos
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
            L&apos;intensité en images
          </h2>
        </Reveal>
        {/* Grid: 4 cols, 2 rows */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Row 1: 4 images */}
          {images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              data-cursor="interactive"
              className="media-glow interactive-panel overflow-hidden rounded-[1.25rem]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={300}
                className="h-52 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
              />
            </div>
          ))}
          {/* Row 2: first spans 2 cols, then 2 normal */}
          <div data-cursor="interactive" className="media-glow interactive-panel col-span-2 overflow-hidden rounded-[1.25rem]">
            <Image
              src={images[4].src}
              alt={images[4].alt}
              width={800}
              height={380}
              className="h-52 w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
            />
          </div>
          {images.slice(5, 7).map((img, i) => (
            <div
              key={i + 5}
              data-cursor="interactive"
              className="media-glow interactive-panel overflow-hidden rounded-[1.25rem]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={300}
                className="h-52 w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04] lg:h-60"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
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

export function SitePage({ page }: { page: PageContent }) {
  const meta = PAGE_IMAGES[page.slug] ?? {
    src: IMG.male,
    ghost: page.title.toUpperCase(),
    alt: `Photo water-polo TMWP83 pour la page ${page.title}`
  };

  return (
    <div>
      <InnerHero page={page} src={meta.src} ghost={meta.ghost} alt={meta.alt ?? `Photo water-polo TMWP83 pour la page ${page.title}`} />
      {page.slug === "le-club"               && <ClubSection />}
      {page.slug === "equipe-feminine-elite" && <EliteSection />}
      {page.slug === "equipes"               && <TeamsSection />}
      {page.slug === "competitions"          && <CompetitionsSection />}
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
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
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

function ClubSection() {
  return (
    <>
      {/* Red stats strip */}
      <div className="bg-ember">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/20 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { v: "2010",  l: "Création" },
            { v: "150+",  l: "Licenciés" },
            { v: "8",     l: "Groupes" },
            { v: "#1",    l: "Classement" },
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
                Depuis 2010, le Toulon Métropole Water-Polo 83 s&apos;est imposé
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
            {CLUB_VALUES.map((v) => (
              <div
                key={v.title}
                data-cursor="interactive"
                className="news-glow interactive-panel rounded-[1.75rem] border border-ink/8 bg-white p-7 shadow-soft"
              >
                <div className="mb-4 h-10 w-10 rounded-xl bg-ember/10 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-ember" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-ink">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Piscine Port Marchand */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <Image
          src={IMG.aerial}
          alt="Piscine Port Marchand a Toulon avec le bassin exterieur"
          fill
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
            Quai de la Sinse, Toulon — notre bassin d&apos;entraînement et de
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

function EliteSection() {
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
              <h2 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-ink sm:text-5xl">
                Porter le water-polo<br />féminin au sommet
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-ink/65">
                Le groupe élite s&apos;appuie sur un noyau expérimenté, une
                dynamique de formation et un calendrier national exigeant pour
                viser les plus hautes marches.
              </p>
              {/* Stats row */}
              <div className="mt-8 flex gap-10 border-t border-ink/10 pt-8">
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
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {ELITE_PLAYERS.map((p) => (
              <div
                key={p.number}
                data-cursor="interactive"
                className="news-glow interactive-panel rounded-[1.5rem] border border-white/8 bg-white/5 p-5 transition-colors duration-300 hover:border-ember/40 hover:bg-white/10"
              >
                <p className="text-3xl font-black text-ember">{p.number}</p>
                <p className="mt-4 text-sm font-black uppercase tracking-tight text-white">
                  {p.name}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  {p.position}
                </p>
              </div>
            ))}
          </div>
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
          <div className="grid gap-5 lg:grid-cols-3">
            {UPCOMING_MATCHES.map((m) => (
              <HomeMatchCard key={m.id} {...m} />
            ))}
          </div>
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
          <div className="space-y-3">
            {RECENT_RESULTS.map((r) => (
              <ResultRow key={`${r.date}-${r.home}`} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* Soutenez l'élite */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <Image src={IMG.team} alt="Collectif TMWP83 rassemble avant une rencontre elite" fill className="object-cover opacity-20" />
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
      href: "/equipe-feminine-elite",
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

function CompetitionsSection() {
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
              Retrouvez les prochaines rencontres et venez soutenir vos
              joueuses à Port Marchand.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {UPCOMING_MATCHES.map((m) => (
              <HomeMatchCard key={m.id} {...m} />
            ))}
          </div>
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
          <div className="space-y-3">
            {RECENT_RESULTS.map((r) => (
              <ResultRow key={`${r.date}-${r.home}`} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* Championnat élite table */}
      <section className="bg-ink py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
              Classement
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Championnat Élite
            </h2>
          </div>
          <div data-cursor="interactive" className="news-glow interactive-panel mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5">
                <tr className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Équipe</th>
                  <th className="px-5 py-4 text-center">J</th>
                  <th className="px-5 py-4 text-center">V</th>
                  <th className="px-5 py-4 text-center">D</th>
                  <th className="px-5 py-4 text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {RANKINGS.map((t) => (
                  <tr
                    key={t.rank}
                    className={
                      t.team === "TMWP83"
                        ? "bg-ember/20 text-white transition-colors duration-300 hover:bg-ember/30"
                        : "border-t border-white/[0.06] text-white/75 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
                    }
                  >
                    <td className="px-5 py-4 font-black text-white/40">{t.rank}</td>
                    <td className={`px-5 py-4 font-black uppercase ${t.team === "TMWP83" ? "text-white" : ""}`}>
                      {t.team}
                    </td>
                    <td className="px-5 py-4 text-center">{t.played}</td>
                    <td className="px-5 py-4 text-center">{t.won}</td>
                    <td className="px-5 py-4 text-center">{t.lost}</td>
                    <td className="px-5 py-4 text-center font-black">{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink/60">
              Le TMWP83 construit des relations durables avec ses partenaires.
              Chaque collaboration est pensée pour créer de la valeur des deux
              côtés.
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
        <Image src={IMG.aerial} alt="Piscine Port Marchand a Toulon, bassin du TMWP83" fill className="object-cover opacity-15" />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Rejoindre l&apos;aventure
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Devenir partenaire
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-white/60">
            Associez votre marque à un projet sportif ambitieux et structurant
            pour le Var. Contactez-nous pour découvrir nos offres de partenariat.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="button-sheen wave-light inline-flex items-center gap-2 rounded-full bg-ember px-8 py-4 font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-ink"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  ACTUALITÉS                                                */
/* ══════════════════════════════════════════════════════════ */

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
              <time dateTime={featured.date}>{featured.date}</time>
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
                <h3 className="mt-2 flex-1 text-base font-black uppercase leading-tight text-white">
                  {a.title}
                </h3>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                  <time dateTime={a.date}>{a.date}</time>
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

function ContactSection() {
  return (
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
          <div className="space-y-8 pt-0 lg:pt-20">
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
                <div className="flex items-center gap-3 text-sm text-ink/70">
                  <Mail className="h-4 w-4 shrink-0 text-ember" />
                  <span>{CLUB_INFO.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink/70">
                  <Phone className="h-4 w-4 shrink-0 text-ember" />
                  <span>{CLUB_INFO.phone}</span>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-ink/40">
                Réseaux sociaux
              </p>
              <div className="flex gap-3">
                <a
                  href={CLUB_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition-colors hover:bg-ember hover:text-white"
                >
                  <IconInstagram className="h-4 w-4" />
                </a>
                <a
                  href={CLUB_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition-colors hover:bg-ember hover:text-white"
                >
                  <IconFacebook className="h-4 w-4" />
                </a>
                <a
                  href={CLUB_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink/60 transition-colors hover:bg-ember hover:text-white"
                >
                  <IconLinkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div data-cursor="interactive" className="media-glow interactive-panel overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white">
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-ink/30">
                <MapPin className="h-6 w-6" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {CLUB_INFO.pool}
                  <br />Toulon 83000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SHARED COMPONENTS                                         */
/* ══════════════════════════════════════════════════════════ */

function HomeMatchCard({
  competition,
  home,
  away,
  date,
  time,
  location,
  isHome,
}: {
  competition: string;
  home: string;
  away: string;
  date: string;
  time: string;
  location: string;
  isHome: boolean;
}) {
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
        <p
          className={`text-xl font-black uppercase tracking-tight ${
            isHome ? "text-ember" : "text-ink"
          }`}
        >
          {home}
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-ink/35">
          vs
        </p>
        <p
          className={`text-xl font-black uppercase tracking-tight ${
            !isHome ? "text-ember" : "text-ink"
          }`}
        >
          {away}
        </p>
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

function ResultRow({
  home,
  away,
  scoreHome,
  scoreAway,
  date,
  competition,
}: {
  home: string;
  away: string;
  scoreHome: number;
  scoreAway: number;
  date: string;
  competition: string;
}) {
  const tmwpHome = home === "TMWP83";
  const tmwpAway = away === "TMWP83";
  const won =
    (tmwpHome && scoreHome > scoreAway) ||
    (tmwpAway && scoreAway > scoreHome);
  const draw = scoreHome === scoreAway;

  return (
    <div data-cursor="interactive" className="interactive-panel flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-ink/8 bg-white px-5 py-4 shadow-soft">
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.15em] ${
          draw
            ? "bg-ink/10 text-ink/60"
            : won
            ? "bg-green-500/10 text-green-700"
            : "bg-ember/10 text-ember"
        }`}
      >
        {draw ? "N" : won ? "V" : "D"}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
        {competition}
      </span>
      <div className="flex flex-1 items-center justify-end gap-3 text-right">
        <span
          className={`text-sm font-black uppercase ${
            tmwpHome ? "text-ember" : "text-ink"
          }`}
        >
          {home}
        </span>
        <span className="rounded-lg bg-ink px-3 py-1 text-sm font-black text-white">
          {scoreHome} – {scoreAway}
        </span>
        <span
          className={`text-sm font-black uppercase ${
            tmwpAway ? "text-ember" : "text-ink"
          }`}
        >
          {away}
        </span>
      </div>
      <span className="w-full text-right text-xs text-ink/35 sm:w-auto">
        {date}
      </span>
    </div>
  );
}
