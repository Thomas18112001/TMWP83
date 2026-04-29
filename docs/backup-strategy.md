# Backup strategy

Completed before implementation:

- TMWP83 branch dedicated to this run.
- TMWP83 `backend/.tmp/data.db` copied when present.
- TMWP83 `.env` and `backend/.env` copied when present.
- Full archive of `C:\Users\Thoma\Desktop\SITE WATERPOLO` created before edits.
- Git initialized in `SITE WATERPOLO` with a baseline commit before edits.

Restore principles:

- For TMWP83 code, switch back to the previous branch or use Git history.
- For Strapi local data, restore the copied SQLite database to `backend/.tmp/data.db`.
- For the site, use Git to inspect/revert changes or extract the full archive.
