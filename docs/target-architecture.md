# Target architecture

- `toulonwaterpolo.fr`: public Next.js showcase site, SEO and public pages.
- `app.toulonwaterpolo.fr`: existing TMWP83 app for admin, members, registration and payments.
- TMWP83 Strapi remains the source of truth for activities and public planning.
- Auth systems stay separated: site viewer/editor JWT is not merged with TMWP83 `tmwp_session`.
