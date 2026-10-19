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
        demo: "https://ibrahimcart.github.io"
      },
      {
        title: "Discord Music Bot",
        status: "released",
        week: 3,
        summary: "A Discord bot that plays music in voice channels. It searches YouTube with a SoundCloud fallback, accepts YouTube, SoundCloud and Spotify links, and supports slash commands for play, skip, pause, resume, queue and stop. Prefetches the next track for faster starts and works on macOS and Windows.",
        tags: ["Python", "discord.py", "yt-dlp", "Spotify API", "FFmpeg"],
        repo: "", // repo is private; add https://github.com/IbrahimCart/discord-music-bot once it is public
        demo: ""
      },
      { title: "", status: "upcoming", week: null, summary: "", tags: [], repo: "", demo: "" },
      { title: "", status: "upcoming", week: null, summary: "", tags: [], repo: "", demo: "" },
      { title: "", status: "upcoming", week: null, summary: "", tags: [], repo: "", demo: "" }
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
