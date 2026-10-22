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
