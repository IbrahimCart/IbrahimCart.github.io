// ============================================================
//  EDIT THIS FILE to update your portfolio. No HTML needed.
//
//  - Release an artifact: set status to "released", fill in
//    title / summary / tags / repo, and set the week.
//  - New class later: add another { ... } block to COURSES.
//    The FIRST course in the list is featured at the top.
//  - Personal / side projects: add them to PROJECTS.
// ============================================================

const PROFILE = {
  name: "Ibrahim Cartan",
  tagline: "Computer Science student at the University of Washington",
  github: "https://github.com/IbrahimCart",
  email: "okrioaks@uw.edu",
  linkedin: "" // e.g. "https://www.linkedin.com/in/your-name"
};

const COURSES = [
  {
    code: "TCSS 490",
    title: "Special Topics in Computing",
    term: "Autumn 2026",
    description: "Projects, AI implementation experiments and weekly progress logs completed throughout the quarter.",
    log: "https://github.com/IbrahimCart/IbrahimCart.github.io/blob/main/LOG.md", // prompt log
    repo: "https://github.com/IbrahimCart/IbrahimCart.github.io",
    artifacts: [
      {
        title: "Portfolio Setup & AI Log",
        status: "released", // "released" | "in-progress" | "upcoming"
        week: 2,
        summary: "Static portfolio deployed with GitHub Pages, with light/dark mode, a data-driven layout and a prompt log for course submissions.",
        tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
        repo: "https://github.com/IbrahimCart/IbrahimCart.github.io",
        demo: ""
      },
      {
        title: "Discord Music Bot",
        status: "released",
        week: 3,
        summary: "A Discord bot that plays music in voice channels. It searches YouTube with a SoundCloud fallback, accepts YouTube, SoundCloud and Spotify links, and supports slash commands for play, skip, pause, resume, queue and stop. Prefetches the next track for faster starts and works on macOS and Windows. Reflection: the hardest part was that Spotify audio cannot be streamed, so the bot has to find the same song on YouTube, and early versions often played the wrong version. Fixing that taught me to make the bot prefer saying it could not find a song over playing the wrong one, and to match tracks by length. I also learned to test the AI-written changes in Discord myself before pushing them, and to keep a log in the repository of what I asked for and what changed.",
        tags: ["Python", "discord.py", "yt-dlp", "Spotify API", "FFmpeg"],
        repo: "https://github.com/IbrahimCart/discord-music-bot",
        demo: "",
        // Slideshow shown at the top of the card. Replace these with real screenshots later:
        // put the PNG/JPG in images/ and change src (keep or edit the alt text and caption).
        images: [
          { src: "images/play-song.svg", alt: "Mockup of the /play command answered with a Now playing message", caption: "Illustration: /play with a song name starts playback" },
          { src: "images/spotify.svg", alt: "Mockup of a Spotify playlist link being queued", caption: "Illustration: paste a Spotify playlist and it queues every track" },
          { src: "images/queue.svg", alt: "Mockup of the /queue command listing upcoming songs", caption: "Illustration: /queue shows what's playing and what's next" },
          { src: "images/controls.svg", alt: "Mockup of the /skip and /pause commands", caption: "Illustration: /skip, /pause, /resume and /stop control playback" }
        ]
      },
      {
        title: "AI Inside It",
        status: "released",
        week: 4,
        summary: "AI GitHub Code Reviewer: a command-line tool that reviews a pull request or git diff with Claude Code running headless. Claude reads the change and reports bugs, security problems and missing tests, and can post them as inline comments on the PR. My own code fetches and filters the diff, then checks every finding against it and drops any that cite a file or line that was never shown. Reflection: keeping the model's job small, one call with no tools, made it easy to tell whether a bad review was the model's fault or my code's. Structured output was not enough on its own, because the model can return valid JSON that points at a line that does not exist, so the checks mattered as much as the prompt.",
        tags: ["Python", "Claude Code", "claude -p", "GitHub CLI", "Git"],
        repo: "https://github.com/IbrahimCart/ai-code-reviewer",
        demo: "",
        images: [
          { src: "images/review-terminal.svg", alt: "Mockup of a terminal running ai-review on a pull request and listing findings by severity", caption: "Illustration: one command reviews a PR and lists what it found" },
          { src: "images/review-real-pr.jpg", alt: "Real screenshot of two review comments posted by the tool on a GitHub pull request: a critical SQL injection finding and a medium finding about a connection that is never closed", caption: "Real screenshot: the tool's review posted on a practice pull request, including a critical SQL injection finding" },
          { src: "images/review-checks.svg", alt: "Mockup of the review checks list showing dropped, moved and kept model findings", caption: "Illustration: my code drops or fixes anything the model got wrong" },
          { src: "images/review-architecture.svg", alt: "Diagram showing which steps the model handles and which are plain code", caption: "Illustration: the model reviews, my code does everything else" }
        ]
      },
      {
        title: "For Someone Else",
        status: "in-progress",
        week: 5,
        summary: "Update, Nov 2: Doses is a small iPhone app I built for my mom and then made general, so anyone can use it. She takes medication twice a day, 12 hours apart, so I asked her what she needs before building anything: one gentle reminder that gets firmer if she misses it, a clear sign of whether she already took it, the date of her last missed dose, a record she can show her doctor, and everything only on her phone with her medications never named. The app starts with her two reminders, Morning and Evening. In Settings anyone can add, rename, retime, switch off or delete reminders (up to 8); the app never suggests a name and nothing leaves the phone. I also gave it a white page, green buttons and confetti when a dose is recorded. It is running on my own iPhone and its 17 unit tests pass. I have not yet checked that the reminders fire at the right times, and I have not put it on my mom's phone or watched her use it. Getting it onto a real phone took work: the iPhone simulator would not finish starting on my Mac, so I moved Xcode's files to an external drive and installed it on my phone directly. My first attempt, a pull request to another group's Discord bot, was closed by its maintainers because I had not waited to be assigned the issue, so I switched to someone I can ask and watch. I asked my professor if I can do this submission on my own. The plan, team CLAUDE.md and log are in the repository. Next: install it on her phone, watch her use it and write my reflection. Due Sun Nov 8.",
        tags: ["Swift", "SwiftUI", "iOS", "Accessibility"],
        repo: "https://github.com/IbrahimCart/dose-reminder",
        demo: ""
      },
      {
        title: "The Moonshot",
        status: "upcoming",
        week: null,
        summary: "Course plan: a five-week project, solo or with a team, bigger than anything I have built before and ideally deployed where real users can reach it. Due Sun Dec 13.",
        tags: [], repo: "", demo: ""
      }
    ]
  }
  // Example for a future class:
  // {
  //   code: "TCSS 4xx", title: "Course name", term: "Winter 2027",
  //   description: "...", log: "", repo: "",
  //   artifacts: [ { title: "...", status: "released", week: 1, summary: "...", tags: [], repo: "", demo: "" } ]
  // },
];

const PROJECTS = [
  // Personal projects show up in an "Other Projects" section once you add one:
  // { title: "My App", summary: "What it does.", tags: ["React"], repo: "", demo: "" }
];
