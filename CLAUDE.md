# CLAUDE.md

Course portfolio for **TCSS 490: Generative AI and Software Development** (UW, Autumn 2026), by Ibrahim Cartan.

- **Live at https://ibrahimcart.github.io.** This link has been submitted to the course, so the repo name, URL and GitHub Pages setup must not change.
- Static site on GitHub Pages: plain HTML/CSS/JS, no framework, no build step. Pushing to `main` deploys it.

## Files

- `projects.js`: all content. `PROFILE`, `COURSES` (first course is featured in the header/hero; TCSS 490 has 5 artifacts) and `PROJECTS` (personal projects; "Other Projects" section appears once non-empty).
- `main.js`: renders everything from `projects.js` (cards, status badges, image slideshow). The featured course is a full-screen video-game world at the top of the page: an ocean with a central hub island for Artifact 1 (the portfolio) and one island per other artifact scattered irregularly around it (stacked above/below the hub on phones), each in its own biome and joined to the hub by a bridge (broken planks lead to locked ones). Small islets reached by stepping stones are placeholders for future projects (named after `PROJECTS` entries once added). A pixel traveler walks the bridges toward the cursor, always via the hub. On wide screens (1000px+) a side panel is always docked on the right: it shows About me (`PROFILE.about`) until a landmark or quest-log row is clicked, then that artifact's card; on smaller screens About me is a section under the map and cards slide in. The Moonshot uses `biome: "space"`: an astronaut launch island where clicking plays a rocket launch; a WebGL camera pulls back from the flat map (a snapshot of the SVG) until it is a lit, slowly rotating 3D Earth with half of it on screen, the rocket lands on a small moon (with the astronaut and flag standing on it), and the card opens ("Back to Earth" plays it in reverse). In light mode the trip is a solar eclipse: orange sky, a sun already in place that pans up with the camera, and a moon that darkens as it covers the sun. A night-sky band runs along the top of the map with a faint Big Dipper in it; clicking the gold Contact button (or the Dipper) pans up to a full sky where the four bowl stars link to email, GitHub, LinkedIn and Handshake (`PROFILE` in `projects.js`); from the moon it slides down over the space scene. Any `mailto:` link opens an email card (address plus Copy button) instead of the visitor's mail app. Scenery is generated from a fixed seed, so it looks the same on every visit.
- `styles.css`: light/dark themes (`prefers-color-scheme` plus a `data-theme` toggle). The theme is also the time of day in the world: light is daytime (blue sky, no stars, a sun by the Dipper), dark is night. Sky colors are CSS variables in all three theme blocks.
- `index.html`: layout shell; scripts are loaded with a `?v=Date.now()` cache-buster.
- `LOG.md`: the prompt log the course requires. Add an entry per artifact/week using its template.
- `images/`: slideshow images for artifact cards.

## Artifacts (TCSS 490)

1. Portfolio Setup & AI Log: released (week 2).
2. Discord Music Bot: released (week 3), with an image slideshow (`images` array).
3. AI Inside It: upcoming, due Sun Oct 25.
4. For Someone Else: upcoming, due Sun Nov 8.
5. The Moonshot: upcoming, due Sun Dec 13.

Upcoming cards hold the course plan as placeholder text until released.

## Rules

- Never overwrite or remove existing cards. Release an artifact by editing its own entry (`status: "released"`, title, summary, tags, repo, week).
- Always start from the latest `main` (`git pull`) before making changes.
- Local preview: `python3 .claude/devserver.py 8490` serves the site at http://localhost:8490 and reloads the page whenever a file changes (dev-only, not part of the site).
