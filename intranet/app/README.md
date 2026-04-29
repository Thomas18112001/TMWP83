# Intranet app

Boundary marker for the separate `app.toulonwaterpolo.fr` application.

Admin, member, registration and payment flows belong to that app boundary.
The production intranet source is not fully colocated in this repository.
Legacy/reference app-oriented code lives under `intranet/src` so payment, admin,
member and registration concerns do not leak into the public site folders.
