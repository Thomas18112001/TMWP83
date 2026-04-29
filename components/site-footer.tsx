import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Linkedin } from "lucide-react";
import { CLUB_INFO, NAV_LINKS } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="bg-wp-black text-white">
      <div className="relative overflow-hidden bg-wp-red">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="mb-5 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
            Rejoignez l'élite
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
            Joueur, supporter, partenaire : chaque rôle compte dans la
            construction d'un projet d'excellence.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="button-sheen wave-ghost inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-bold uppercase tracking-wider text-wp-red transition-all duration-300 hover:scale-[1.025] hover:bg-white/90"
            >
              Nous rejoindre
            </Link>
            <Link
              href="/partenaires"
              className="button-sheen inline-flex items-center justify-center rounded-full border-2 border-white/60 px-8 py-4 font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white/15"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-6 flex items-center gap-3">
              <img
                src="/brand/logo-light.png"
                alt="TMWP83"
                className="h-12 w-auto"
              />
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              {CLUB_INFO.slogan}
            </p>
            <div className="flex gap-3">
              <a
                href={CLUB_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-wp-red"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={CLUB_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-wp-red"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={CLUB_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="button-sheen wave-icon flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-wp-red"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-wp-red">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-wp-red">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-wp-red" />
                <span>
                  {CLUB_INFO.pool}
                  <br />
                  {CLUB_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-wp-red" />
                <span>{CLUB_INFO.email}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-wp-red" />
                <span>{CLUB_INFO.phone}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-wp-red">
              Informations
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Saison 2025-2026</li>
              <li>Piscine Port Marchand, Toulon</li>
              <li>Club affilié FFN</li>
              <li>Fondé en {CLUB_INFO.founded}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/40 sm:flex-row sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} {CLUB_INFO.name}. Tous droits réservés.
          </span>
          <span>Mentions légales · Politique de confidentialité</span>
        </div>
      </div>
    </footer>
  );
}
