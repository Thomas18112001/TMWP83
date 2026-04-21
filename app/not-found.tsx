import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-ember">
        404
      </p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-ink sm:text-5xl">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-xl text-base text-ink/70">
        La page demandée n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ember px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ink"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
