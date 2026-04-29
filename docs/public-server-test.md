# Public server test

Smoke-test these public routes:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/le-club
curl -I http://127.0.0.1:3000/equipes
curl -I http://127.0.0.1:3000/equipes/feminine-elite
curl -I http://127.0.0.1:3000/competitions
curl -I http://127.0.0.1:3000/competitions/matchs
curl -I http://127.0.0.1:3000/activites
curl -I http://127.0.0.1:3000/actualites
curl -I http://127.0.0.1:3000/partenaires
curl -I http://127.0.0.1:3000/contact
```

Compatibility redirects:

```bash
curl -I http://127.0.0.1:3000/matchs
curl -I http://127.0.0.1:3000/planning
curl -I http://127.0.0.1:3000/equipe-feminine-elite
curl -I http://127.0.0.1:3000/login
```
