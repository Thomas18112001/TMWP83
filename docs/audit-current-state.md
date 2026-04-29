# Audit current state

## Public site

- Framework: Next.js 14 App Router, React 18, Tailwind.
- Purpose: communication, SEO, club image, women Elite visibility and public contact.
- Public routes are listed in `docs/sitemap-route-map.md`.
- FFN data is public-only and scoped to the women Elite team.
- Activity and registration routes are entry/redirect points to the intranet app.

## App / intranet

- Domain: `app.toulonwaterpolo.fr`.
- Purpose: auth, member dashboard, registrations, panier, payments, documents, profile and admin.
- Existing activity/planning adapter code was moved under `intranet/src` to keep it out of the public site surface.

## Cleanup decisions

- Removed public rendering of activity catalogue/details/planning.
- Removed public dev-auth/editor rendering from the site shell.
- Kept compatibility redirects for old URLs instead of hard-breaking inbound links.
