# CLAUDE.md

Course portfolio for **TCSS 490: Generative AI and Software Development** (UW, Autumn 2026), by Ibrahim Cartan.

- **Live at https://ibrahimcart.github.io.** This link has been submitted to the course, so the repo name, URL and GitHub Pages setup must not change.
- Static site on GitHub Pages: plain HTML/CSS/JS, no framework, no build step. Pushing to `main` deploys it.

## Files

- `projects.js`: all content. `PROFILE`, `COURSES` (first course is featured in the header/hero; TCSS 490 has 5 artifacts) and `PROJECTS` (personal projects; "Other Projects" section appears once non-empty).
- `main.js`: renders everything from `projects.js` (cards, status badges, image slideshow).
- `styles.css`: light/dark themes (`prefers-color-scheme` plus a `data-theme` toggle).
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
