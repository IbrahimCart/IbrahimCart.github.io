# TCSS 490 Prompt Log

A running log of the AI prompts I used this quarter, what I asked for and what I kept or changed.

## Template

### Week N: Artifact NN, short title
- **Date:**
- **Tool / model:**
- **Prompt:**
- **What it produced:**
- **What I changed and why:**

---

### Week 2: Artifact 01, Portfolio Setup
- **Date:** 2026-10-11
- **Tool / model:** Claude (Cowork)
- **Prompt:** "Make a front-end portfolio website for my projects this quarter and host it on GitHub."
- **What it produced:** A static HTML/CSS/JS site with a data file (`projects.js`) for projects, deployed to GitHub Pages.
- **What I changed and why:** Restructured it around TCSS 490 with five artifacts and this log, to match the course template.

### Week 3: Artifact 02, Discord Music Bot
- **Date:** 2026-10-18
- **Tool / model:** Claude Code (Claude Opus 5.5 / Sonnet 5.5)
- **Prompt:** "Add this Discord bot to my portfolio website as Artifact 2."
- **What it produced:** A new released artifact entry in `projects.js` describing the bot (Python, discord.py, yt-dlp, Spotify support) and this log entry.
- **What I changed and why:** Made the bot's repository public and linked it from the card.

### Week 4: Artifact 03, AI Inside It
- **Date:** 2026-10-22
- **Tool / model:** Claude Code (Claude Opus 5.5 / Sonnet 5.5)
- **Prompt:** "Build a Python application that uses Claude Code to review changes in GitHub repositories and provide feedback about code quality, potential bugs, security concerns, and recommended tests."
- **What it produced:** A separate repo, [ai-code-reviewer](https://github.com/IbrahimCart/ai-code-reviewer): a Python CLI that runs `claude -p` with no tools and a JSON schema, checks the findings against the real diff, and can post inline review comments on a PR. It also produced 30 tests, a README, a project log and a demo PR. This site got the Artifact 3 card and this entry.
- **What I changed and why:** Dropped the first idea of a GitHub Action, since it would need a paid API key, and ran on `claude -p` instead. Changed the fake secret in the sample diff so GitHub secret scanning would not block the push. Fixed a path-cleanup bug I spotted while writing the checks, where a leading `.` was stripped from `.github/...`, and added a test for it.

### Week 6: Artifact 01 update, Game-world redesign
- **Date:** 2026-11-04
- **Tool / model:** Claude Code (Claude Opus 5.5)
- **Prompt:** "I want the website to be a video game theme where each artifact is a location on a map that a person can go to. I want there to be a little character that is supposed to be the visitor that goes along the trail to the next artifact based on the visitor's cursor." I followed up with many smaller prompts as I tested each version on a local preview.
- **What it produced:** A full-screen game world built from the same `projects.js` data. The portfolio is a hub island in an ocean, and each other artifact is an island in its own biome (autumn, desert, snow), joined to the hub by a bridge. A pixel traveler walks the bridges toward the cursor. Clicking an island opens its card in a side panel, which shows an About me when nothing is selected. Small islets with stepping stones hold places for future projects. The Moonshot is a launch island: clicking it flies a rocket off the map, the camera pulls back to a rotating 3D Earth (WebGL) and the rocket lands on the moon. "Back to Earth" plays the trip in reverse.
- **What I changed and why:** The first version was a flat trail map with the card under it, so I asked for the game style across the whole page and for cards to pop up at the side. When the map felt too zoomed in, I changed the idea to islands joined by bridges, with the portfolio in the middle, and then asked for a less even, more natural layout. I moved the future-project islets to branch off the portfolio island instead of the Discord bot island. For the Moonshot I asked for an astronaut-themed island with a rocket launch to the moon, for Earth to stay visible and slowly turn, for a real zoom out from a sphere instead of a circle mask, and for bigger islands on the globe and less grid-like stars. I also kept the course title as it was, and I still need to rewrite the About me text in my own words.
