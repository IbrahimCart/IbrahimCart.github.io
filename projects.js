// ============================================================
//  EDIT THIS FILE to update your portfolio. No HTML needed.
//
//  - Release an artifact: set status to "released" and update
//    title / summary / tags / repo / demo.
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
        status: "released", // "released" | "in-progress" | "upcoming" (shows "Coming soon")
        due: "Sun Oct 11",
        team: "Solo · 1 week",
        summary: "Static portfolio deployed with GitHub Pages, with light/dark mode, a data-driven layout and a prompt log for course submissions.",
        tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
        repo: "https://github.com/IbrahimCart/IbrahimCart.github.io",
        demo: "https://ibrahimcart.github.io"
      },
      {
        title: "Something You Will Use",
        status: "upcoming",
        due: "Sun Oct 18",
        team: "Solo · 1 week",
        summary: "A small tool that runs, does one real thing, and that I'll keep using after the week ends. My first build with Claude Code.",
        tags: [], repo: "", demo: ""
      },
      {
        title: "AI Inside It",
        status: "upcoming",
        due: "Sun Oct 25",
        team: "Solo · 1 week",
        summary: "A build where an AI model does part of the work every time it runs: reading, deciding, writing or calling tools.",
        tags: [], repo: "", demo: ""
      },
      {
        title: "For Someone Else",
        status: "upcoming",
        due: "Sun Nov 8",
        team: "Pair or trio · 2 weeks",
        summary: "Built with teammates for a real person or group outside the team, finding out what they need and building to it.",
        tags: [], repo: "", demo: ""
      },
      {
        title: "The Moonshot",
        status: "upcoming",
        due: "Sun Dec 13",
        team: "Solo or team · 5 weeks",
        summary: "My biggest project yet: an ambitious build, ideally deployed where real users can reach it.",
        tags: [], repo: "", demo: ""
      }
    ]
  }
  // Example for a future class:
  // {
  //   code: "TCSS 4xx", title: "Course name", term: "Winter 2027",
  //   description: "...", log: "", repo: "",
  //   artifacts: [ { title: "...", status: "released", due: "", team: "", summary: "...", tags: [], repo: "", demo: "" } ]
  // },
];

const PROJECTS = [
  // Personal projects show up in an "Other Projects" section once you add one:
  // { title: "My App", summary: "What it does.", tags: ["React"], repo: "", demo: "" }
];
