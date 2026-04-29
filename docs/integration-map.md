# Integration map

## Public site routes

- `/`: public homepage, club image, women Elite prominence and latest confirmed FFN fixtures.
- `/le-club`: identity, history and values.
- `/equipes`: team pathway overview, with the women Elite team first in the hierarchy.
- `/equipes/feminine-elite`: flagship women Elite page with FFN fixtures, results and confirmed match roster data.
- `/competitions`: competition hub for the women Elite team.
- `/competitions/matchs`: FFN calendar, results, logos and standings.
- `/activites`: public entry point to app registrations only.
- `/actualites`: public news.
- `/actualites/[articleSlug]`: public article detail.
- `/partenaires`: public partner page.
- `/contact`: public contact page.

## Redirects kept for compatibility

- `/matchs` -> `/competitions/matchs`
- `/planning` -> `/activites`
- `/equipe-feminine-elite` -> `/equipes/feminine-elite`
- `/activites/[activitySlug]` -> `app.toulonwaterpolo.fr/inscription/panier?activity=...`
- `/login` -> `app.toulonwaterpolo.fr/login`

## External app links

- App base URL: `NEXT_PUBLIC_TMWP_APP_URL` or `https://app.toulonwaterpolo.fr`.
- Public registration CTA: `/inscription` on the app domain.
- Activity registration CTA: `/inscription/panier?activity=ACTIVITY_ID` on the app domain.
- Member access CTA label: `Espace adhérent`.

## Data flow

- Public site FFN data comes directly from Extranat with the Elite Feminine/Toulon filters documented in `docs/ffn-integration.md`.
- Registration, payment, documents, profile, member and admin state stays in the intranet app.
