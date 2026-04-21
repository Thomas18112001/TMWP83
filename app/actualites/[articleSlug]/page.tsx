import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NEWS_ARTICLES, getArticleBySlug } from "@/lib/site-data";

type Props = { params: { articleSlug: string } };

export function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ articleSlug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticleBySlug(params.articleSlug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `https://tmwp83.fr/actualites/${article.slug}`,
      publishedTime: article.date,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image]
    }
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.articleSlug);
  if (!article) notFound();

  const others = NEWS_ARTICLES.filter((a) => a.slug !== params.articleSlug).slice(0, 3);

  const formattedDate = new Date(article.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[58vh] overflow-hidden bg-ink">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          className="object-cover object-center opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-4xl px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20">
            <nav aria-label="Fil d'Ariane" className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              <Link href="/" className="transition-colors hover:text-white/70">Accueil</Link>
              <span>/</span>
              <Link href="/actualites" className="transition-colors hover:text-white/70">Actualités</Link>
              <span>/</span>
              <span className="text-ember">{article.category}</span>
            </nav>

            <div className="flex max-w-3xl items-start gap-5">
              <div className="mt-1 w-1 shrink-0 self-stretch bg-ember" />
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.38em] text-ember">
                  {article.category}
                </p>
                <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>
                <time
                  dateTime={article.date}
                  className="mt-5 block text-sm font-semibold uppercase tracking-[0.2em] text-white/40"
                >
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────── */}
      <section className="bg-shell py-16 lg:py-24 dark:bg-[#0e1014]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

          {/* Lead excerpt */}
          <p className="mb-10 border-l-4 border-ember pl-6 text-lg font-medium leading-8 text-ink/70 dark:text-white/65">
            {article.excerpt}
          </p>

          {/* Article body */}
          <div className="space-y-6">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-8 text-ink/70 dark:text-white/60">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer meta */}
          <div className="mt-14 flex flex-col gap-4 border-t border-ink/10 pt-8 dark:border-white/8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-ember/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-ember">
                {article.category}
              </span>
              <time dateTime={article.date} className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 dark:text-white/35">
                {formattedDate}
              </time>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-ember transition-opacity hover:opacity-75"
            >
              <ArrowLeft className="h-4 w-4" />
              Toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related articles ─────────────────────────────── */}
      {others.length > 0 && (
        <section className="bg-ink py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                À lire aussi
              </h2>
              <Link
                href="/actualites"
                className="hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white sm:flex"
              >
                Toutes les actualités
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {others.map((a) => (
                <Link
                  key={a.id}
                  href={`/actualites/${a.slug}`}
                  data-cursor="interactive"
                  className="news-glow interactive-panel group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/6 bg-white/5"
                >
                  <div className="relative h-44 overflow-hidden bg-white/5">
                    <Image
                      src={a.image}
                      alt={a.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-ember">
                      {a.category}
                    </p>
                    <h3 className="mt-2 flex-1 text-base font-black uppercase leading-snug text-white">
                      {a.title}
                    </h3>
                    <time
                      dateTime={a.date}
                      className="mt-4 block text-xs font-semibold uppercase tracking-[0.2em] text-white/30"
                    >
                      {new Date(a.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
