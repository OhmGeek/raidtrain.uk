# Raidtrain.uk

This site will display the schedule and allow users to "permalink" to a future Raidtrain charity event.

## Stream overlays

Streamers can add donation overlays to OBS as Browser sources. See `/overlays` on the site for URLs and previews:

- `/overlay/total` – progress bar towards the fundraising target
- `/overlay/recent` – most recent donations
- `/overlay/top` – top donations leaderboard

The overlays call the JustGiving API directly from the browser, so no backend is needed. Set the app ID and page in `src/fundraiser.config.js`.

Each route is a real page: the build copies `index.html` into a folder per route (see `STATIC_ROUTES` in `vite.config.js`), so new routes need adding there as well as in `src/main.jsx`.
