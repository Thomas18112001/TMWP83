# FFN Extranat integration

Source of truth:
- Wrapper page: `https://ffn.extranat.fr/webffn/wp_results.php?idact=wp`
- Direct results endpoint: `https://www.extranat.fr/waterpolo/cgi-bin/wp_results.php`
- Direct calendar endpoint: `https://www.extranat.fr/waterpolo/cgi-bin/wp_calendar.php`

Target filter:
- Season: `2026` (`2025 - 2026`)
- Owner: `1725` (`FF Natation`)
- Championship: `1629` (`FF Natation - Elite Feminine`)
- Phase/event: `5579` (`Elite Feminine`)
- Toulon structure: `2326` (`TOULON WATERPOLO`)

All FFN match data must be filtered by both championship `1629` and structure `2326`.
Do not accept rows from other championships just because a Toulon-like team name appears.

Confirmed data on the audited FFN pages:
- Upcoming fixtures are available from `wp_calendar.php`.
- Results, scores, team logos and standings are available from `wp_results.php`.
- Team composition is available inside result match tooltips as per-match rosters.

Not confirmed on the audited FFN pages:
- A standalone season roster with positions is not provided by the current results/calendar/statistics pages.
- If no per-match roster is present, the public site must show an empty state instead of fallback players.
