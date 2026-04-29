# Project structure

This repository currently deploys the public Next.js site from the repository root.
The root layout is kept in place to avoid breaking the existing deployment script.

Public site:
- `site/README.md`: boundary marker for the public site.
- `site/app/README.md`: intended route boundary, mapped to root `app/` for current deploy.
- `site/components/README.md`: intended UI boundary, mapped to root `components/` for current deploy.
- `site/lib/README.md`: intended library boundary, mapped to root `lib/` for current deploy.
- `app/`: public routes and compatibility redirects.
- `components/`: public site UI components.
- `lib/`: public site data adapters and content helpers, including FFN.
- `public/`: public media and brand assets.
- `styles/`: public CSS.
- `deploy.py`: current public site deployment entry point.

Intranet/app:
- `intranet/app/README.md`: boundary marker for the intranet app.
- `intranet/src/`: intranet/app boundary for member, registration, payment, documents and admin logic.
- `app.toulonwaterpolo.fr` remains the separate admin/member/registration/payment application.
- Its production source is not fully colocated in this repository.
- Public site code should not be mixed with intranet payment, admin or member flows.

Shared:
- `docs/`: integration contracts, architecture notes and operational references.
- Root config files remain shared by the public site while it is deployed from the repository root.
